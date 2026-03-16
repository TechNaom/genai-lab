---
title: Prompt Engineering Patterns for Enterprise LLMs
slug: prompt-engineering-enterprise
date: '2025-01-22'
category: Prompt Engineering
tags:
  - Prompts
  - Enterprise
  - GPT-4
  - Best Practices
  - Chain of Thought
excerpt: >-
  Systematic approaches to prompt design that consistently produce reliable
  outputs at enterprise scale — from chain-of-thought to few-shot patterns.
color: purple
status: published
featured: false
---

## The Art and Science of Prompting

Prompt engineering often gets dismissed as "just asking ChatGPT nicely." The reality for enterprise applications is far more demanding: you need prompts that produce consistent, structured, auditable outputs across millions of calls.

This guide covers the patterns that have proven reliable in production environments.

## Foundation: The Anatomy of a Good Prompt

Every production prompt needs these four components:

### 1. Role / Persona

```
You are a senior financial analyst specializing in risk assessment. 
You communicate in precise, professional language and always quantify uncertainty.
```

### 2. Task Definition

```
Your task is to analyze the provided financial data and produce a structured 
risk assessment report. Focus on: liquidity risk, credit exposure, and 
operational risk indicators.
```

### 3. Output Format

```
Respond ONLY with a JSON object matching this exact schema:
{
  "overall_risk": "low|medium|high|critical",
  "confidence": 0.0-1.0,
  "risk_factors": [{"name": string, "severity": string, "explanation": string}],
  "recommended_actions": [string]
}
```

### 4. Constraints and Examples

```
Rules:
- Never include personally identifiable information in your response
- If data is insufficient to assess a risk factor, mark severity as "insufficient_data"
- Confidence below 0.7 should trigger a human review flag
```

## Pattern 1: Chain of Thought (CoT)

Force the model to reason before answering. This single change can improve accuracy by 20-40% on complex reasoning tasks.

```python
COT_PROMPT = """
Analyze the following support ticket and classify it.

Before giving your final classification, think through:
1. What is the customer's core problem?
2. What product area does this involve?
3. What is the urgency level and why?
4. Are there any red flags suggesting escalation?

ONLY THEN provide your classification.

Support Ticket:
{ticket}

Reasoning:
[Think through the 4 questions above]

Classification:
{
  "category": "...",
  "priority": "...",
  "escalate": true/false,
  "routing_team": "..."
}
"""
```

## Pattern 2: Few-Shot with Diverse Examples

Provide 3-5 examples that cover edge cases, not just the easy cases.

```python
FEW_SHOT_EXAMPLES = [
    {
        "input": "How do I cancel my subscription?",
        "output": {"intent": "cancellation", "sentiment": "neutral", "urgency": "low"}
    },
    {
        "input": "I've been charged twice and I need this fixed IMMEDIATELY",
        "output": {"intent": "billing_dispute", "sentiment": "angry", "urgency": "high"}
    },
    {
        "input": "Love the product! Quick question about the export feature",
        "output": {"intent": "feature_question", "sentiment": "positive", "urgency": "low"}
    },
]
```

When choosing examples:
- Cover the full range of expected inputs
- Include at least one ambiguous or edge case
- Make sure examples demonstrate the exact output format you want

## Pattern 3: Constitutional Constraints

Instead of a single monolithic prompt, use a two-step approach with explicit constraints:

```python
STEP_1_GENERATE = """
Generate a response to this customer inquiry: {inquiry}
"""

STEP_2_VALIDATE = """
Review this customer service response and check it against our policies:

Response to review:
{response}

Policy checklist:
- [ ] Does not make promises about refunds > $100 without approval
- [ ] Does not share internal pricing or cost information  
- [ ] Does not use phrases that admit fault without review
- [ ] Is professional and empathetic in tone
- [ ] Provides a clear next step for the customer

If the response violates any policy, rewrite it to comply.
Output the final, policy-compliant response only.
"""
```

## Pattern 4: Output Anchoring

When you need strict output formats, anchor the response by starting it in your prompt:

```python
ANCHORED_PROMPT = f"""
Analyze this document and extract key information.

Document:
{document}

Extracted Information:
```json
{{
  "summary": \""""

# The model will complete the JSON from where you left off
# This dramatically reduces format errors
```

## Evaluation and Versioning

Never deploy a prompt change without testing it. Build a regression suite:

```python
class PromptEvaluator:
    def __init__(self, test_cases: list[dict]):
        self.test_cases = test_cases
    
    def evaluate(self, prompt_template: str) -> dict:
        results = []
        for case in self.test_cases:
            prompt = prompt_template.format(**case["inputs"])
            response = llm.invoke(prompt)
            
            score = self.score_response(response, case["expected"])
            results.append(score)
        
        return {
            "accuracy": sum(r["correct"] for r in results) / len(results),
            "avg_latency": sum(r["latency"] for r in results) / len(results),
            "failures": [r for r in results if not r["correct"]],
        }
```

Always version your prompts. A prompt is code — treat it like one:

```
prompts/
  v1/
    classify_ticket.txt
    extract_entities.txt
  v2/
    classify_ticket.txt   ← improved CoT
    extract_entities.txt
  current -> v2/          ← symlink to active version
```

## Common Pitfalls

**Don't**: Ask the model to "be concise" — define exactly what concise means ("respond in 2-3 sentences").

**Don't**: Use vague persona descriptions like "you are helpful" — be specific about domain expertise.

**Don't**: Skip negative examples — showing what NOT to do is as important as showing what to do.

**Do**: Test your prompts on the worst-case inputs before production.

**Do**: Monitor prompt performance over time — model updates from providers can shift behavior.

## Conclusion

Systematic prompt engineering is not optional at enterprise scale. The patterns here — CoT, few-shot with edge cases, constitutional constraints, output anchoring — are the foundation of reliable AI-powered systems.

The difference between a prompt that works 80% of the time and one that works 99% of the time is the difference between a demo and a production system.
