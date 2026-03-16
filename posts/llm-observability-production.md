---
title: 'LLM Observability: Monitoring AI Systems in Production'
slug: llm-observability-production
date: '2025-03-10'
category: GenAI Systems
tags:
  - Observability
  - LangSmith
  - Monitoring
  - Production
  - DevOps
excerpt: >-
  How to instrument, monitor, and debug LLM-powered applications in production —
  covering tracing, cost tracking, latency profiling, and quality regression detection.
color: purple
status: published
featured: false
---

## The Observability Gap in AI Systems

Traditional software observability — logs, metrics, traces — breaks down when your application's most important logic lives inside an LLM prompt. The model is a black box. Its outputs are non-deterministic. And the bugs don't throw stack traces.

This guide covers the instrumentation patterns that give you real visibility into production LLM systems.

## What You Need to Observe

Before picking tools, clarify what actually matters:

| Signal | Why It Matters | How to Measure |
|--------|---------------|----------------|
| Latency | User experience & cost | p50, p95, p99 by prompt type |
| Cost | Budget control | Tokens in × out per request |
| Quality | Are answers correct? | Human feedback + automated evals |
| Errors | API failures, format errors | Error rate by type |
| Throughput | Capacity planning | Requests/minute |
| Cache hit rate | Cost reduction | % of requests served from cache |

## Structured Logging for LLM Calls

Start with structured logs. Every LLM call should emit a JSON log event:

```python
import time
import uuid
import json
import logging
from dataclasses import dataclass, asdict
from typing import Optional

logger = logging.getLogger("genai_lab")

@dataclass
class LLMCallEvent:
    event_type: str = "llm_call"
    trace_id: str = ""
    model: str = ""
    prompt_tokens: int = 0
    completion_tokens: int = 0
    total_tokens: int = 0
    latency_ms: float = 0
    cost_usd: float = 0
    success: bool = True
    error: Optional[str] = None
    prompt_template: str = ""
    cached: bool = False

# Token costs (update as pricing changes)
COST_PER_1K = {
    "gpt-4o": {"input": 0.005, "output": 0.015},
    "gpt-4o-mini": {"input": 0.00015, "output": 0.0006},
    "claude-3-5-sonnet": {"input": 0.003, "output": 0.015},
}

def calculate_cost(model: str, prompt_tokens: int, completion_tokens: int) -> float:
    costs = COST_PER_1K.get(model, {"input": 0.002, "output": 0.002})
    return (prompt_tokens / 1000 * costs["input"]) + (completion_tokens / 1000 * costs["output"])


class ObservableLLM:
    """Wrapper around any LLM client that adds structured observability."""

    def __init__(self, llm, model_name: str):
        self.llm = llm
        self.model_name = model_name

    def invoke(self, prompt: str, template_name: str = "unknown", **kwargs) -> str:
        trace_id = str(uuid.uuid4())[:8]
        start = time.perf_counter()
        event = LLMCallEvent(
            trace_id=trace_id,
            model=self.model_name,
            prompt_template=template_name,
        )

        try:
            response = self.llm.invoke(prompt, **kwargs)
            elapsed_ms = (time.perf_counter() - start) * 1000

            # Extract token usage (structure varies by provider)
            usage = getattr(response, "usage_metadata", None) or {}
            event.prompt_tokens = usage.get("input_tokens", 0)
            event.completion_tokens = usage.get("output_tokens", 0)
            event.total_tokens = event.prompt_tokens + event.completion_tokens
            event.latency_ms = round(elapsed_ms, 2)
            event.cost_usd = calculate_cost(
                self.model_name, event.prompt_tokens, event.completion_tokens
            )
            event.success = True

            logger.info(json.dumps(asdict(event)))
            return response.content

        except Exception as e:
            event.latency_ms = round((time.perf_counter() - start) * 1000, 2)
            event.success = False
            event.error = str(e)
            logger.error(json.dumps(asdict(event)))
            raise
```

## Distributed Tracing with LangSmith

For LangChain applications, LangSmith is the gold standard:

```python
import os
from langchain_openai import ChatOpenAI
from langchain.callbacks.tracers import LangChainTracer

# Set env vars to enable automatic tracing
os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_API_KEY"] = "your-langsmith-key"
os.environ["LANGCHAIN_PROJECT"] = "genai-lab-production"

# Now every LangChain call is automatically traced
llm = ChatOpenAI(model="gpt-4o")

# Tag traces with metadata for filtering
with LangChainTracer(
    project_name="genai-lab-production",
    tags=["rag", "user-query"],
    metadata={"user_id": "usr_123", "feature": "blog-assistant"},
):
    response = llm.invoke("Explain RAG in one paragraph")
```

## Building a Custom Metrics Dashboard

If you want full control without a SaaS dependency:

```python
from collections import defaultdict
from threading import Lock
import statistics

class MetricsCollector:
    """Thread-safe in-memory metrics. In production, ship to Prometheus/Grafana."""

    def __init__(self):
        self._lock = Lock()
        self._latencies: dict[str, list[float]] = defaultdict(list)
        self._costs: dict[str, list[float]] = defaultdict(list)
        self._errors: dict[str, int] = defaultdict(int)
        self._calls: dict[str, int] = defaultdict(int)

    def record(self, template: str, latency_ms: float, cost: float, success: bool):
        with self._lock:
            self._latencies[template].append(latency_ms)
            self._costs[template].append(cost)
            self._calls[template] += 1
            if not success:
                self._errors[template] += 1

    def summary(self) -> dict:
        with self._lock:
            result = {}
            for template in self._calls:
                lats = self._latencies[template]
                result[template] = {
                    "calls": self._calls[template],
                    "error_rate": round(self._errors[template] / self._calls[template], 3),
                    "p50_ms": round(statistics.median(lats), 1),
                    "p95_ms": round(sorted(lats)[int(len(lats) * 0.95)], 1) if len(lats) >= 20 else None,
                    "total_cost_usd": round(sum(self._costs[template]), 4),
                    "avg_cost_usd": round(statistics.mean(self._costs[template]), 6),
                }
            return result

metrics = MetricsCollector()
```

## Quality Regression Detection

Latency and cost are easy. Quality is hard. Two approaches:

### 1. LLM-as-Judge (Automated)

```python
JUDGE_PROMPT = """You are evaluating the quality of an AI assistant's response.

Question: {question}
Response: {response}

Rate the response on:
1. Accuracy (0-10): Is the information correct?
2. Completeness (0-10): Does it fully answer the question?
3. Clarity (0-10): Is it well-explained and readable?

Respond ONLY with JSON: {{"accuracy": N, "completeness": N, "clarity": N, "overall": N}}"""

def auto_evaluate(question: str, response: str, judge_llm) -> dict:
    prompt = JUDGE_PROMPT.format(question=question, response=response)
    raw = judge_llm.invoke(prompt)
    try:
        scores = json.loads(raw)
        return scores
    except json.JSONDecodeError:
        return {"error": "judge failed to return JSON"}
```

### 2. Regression Test Suite

```python
# regression_tests.py — run this in CI before deploying prompt changes
GOLDEN_SET = [
    {
        "id": "rag_basic",
        "question": "What is RAG?",
        "must_contain": ["retrieval", "augmented", "generation"],
        "must_not_contain": ["I don't know", "I cannot"],
        "max_latency_ms": 3000,
    },
    {
        "id": "code_python",
        "question": "Write a Python function to reverse a string",
        "must_contain": ["def ", "return"],
        "must_not_contain": ["sorry", "cannot write code"],
        "max_latency_ms": 4000,
    },
]

def run_regression_suite(llm) -> dict:
    results = []
    for test in GOLDEN_SET:
        start = time.perf_counter()
        response = llm.invoke(test["question"])
        latency = (time.perf_counter() - start) * 1000

        passed = True
        failures = []

        for phrase in test.get("must_contain", []):
            if phrase.lower() not in response.lower():
                passed = False
                failures.append(f"Missing: '{phrase}'")

        for phrase in test.get("must_not_contain", []):
            if phrase.lower() in response.lower():
                passed = False
                failures.append(f"Found forbidden: '{phrase}'")

        if latency > test.get("max_latency_ms", float("inf")):
            passed = False
            failures.append(f"Too slow: {latency:.0f}ms > {test['max_latency_ms']}ms")

        results.append({"id": test["id"], "passed": passed, "failures": failures, "latency_ms": latency})

    passed_count = sum(1 for r in results if r["passed"])
    print(f"\n{'='*50}")
    print(f"Regression Suite: {passed_count}/{len(results)} passed")
    for r in results:
        status = "✓" if r["passed"] else "✗"
        print(f"  {status} {r['id']} ({r['latency_ms']:.0f}ms)")
        for f in r["failures"]:
            print(f"      → {f}")
    return {"passed": passed_count, "total": len(results), "results": results}
```

## Alerting

Wire your metrics to alerts. A simple approach with thresholds:

```python
ALERT_THRESHOLDS = {
    "error_rate": 0.05,          # Alert if >5% of calls fail
    "p95_latency_ms": 8000,      # Alert if p95 > 8 seconds
    "hourly_cost_usd": 5.0,      # Alert if spending >$5/hour
}

def check_alerts(metrics_summary: dict) -> list[str]:
    alerts = []
    for template, stats in metrics_summary.items():
        if stats["error_rate"] > ALERT_THRESHOLDS["error_rate"]:
            alerts.append(f"HIGH ERROR RATE: {template} at {stats['error_rate']*100:.1f}%")
        if stats.get("p95_ms") and stats["p95_ms"] > ALERT_THRESHOLDS["p95_latency_ms"]:
            alerts.append(f"HIGH LATENCY: {template} p95={stats['p95_ms']}ms")
    return alerts
```

## Conclusion

Observability in LLM systems is non-negotiable for production. Without it, you're flying blind — unable to catch quality regressions, cost explosions, or reliability issues before users do.

Start with structured logging, add cost tracking from day one, and build a regression test suite before you make any prompt changes. That foundation gives you the confidence to iterate quickly without breaking what's already working.
