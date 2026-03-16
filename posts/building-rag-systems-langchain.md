---
title: Building Production-Ready RAG Systems with LangChain
slug: building-rag-systems-langchain
date: '2025-01-15'
category: LLM Architectures
tags:
  - RAG
  - LangChain
  - Vector DB
  - Python
  - Production
excerpt: >-
  A deep dive into architecting robust Retrieval-Augmented Generation systems
  that actually work in production environments — from chunking strategy to
  evaluation.
color: cyan
status: published
featured: true
---

## Introduction

Retrieval-Augmented Generation (RAG) has become the backbone of modern enterprise AI applications. While getting a basic RAG demo working takes an afternoon, building a system that handles thousands of queries reliably in production is a completely different challenge.

In this article, we'll cover the architecture decisions, implementation details, and operational considerations that separate a production RAG system from a weekend project.

## Why RAG Over Fine-Tuning?

Before diving into implementation, it's worth addressing the classic question: **why RAG instead of fine-tuning?**

The answer usually comes down to three factors:

- **Data freshness** — RAG retrieves from a live knowledge base; fine-tuned models have a static knowledge cutoff
- **Auditability** — RAG can cite its sources; fine-tuned models cannot explain where knowledge came from
- **Cost** — Updating a RAG knowledge base costs cents; re-fine-tuning costs hundreds to thousands of dollars

> RAG is not the answer to every problem, but it is the right architecture for the vast majority of enterprise knowledge retrieval use cases.

## Architecture Overview

A production RAG system has five distinct layers:

### 1. Document Ingestion Pipeline

```python
from langchain.document_loaders import DirectoryLoader, PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter

# Load documents
loader = DirectoryLoader('./docs', glob='**/*.pdf', loader_cls=PyPDFLoader)
documents = loader.load()

# Semantic chunking — NOT fixed size
splitter = RecursiveCharacterTextSplitter(
    chunk_size=1024,
    chunk_overlap=128,
    separators=["\n\n", "\n", ". ", " ", ""],
    length_function=len,
)
chunks = splitter.split_documents(documents)
print(f"Created {len(chunks)} chunks from {len(documents)} documents")
```

### 2. Embedding and Storage

```python
from langchain.vectorstores import Chroma
from langchain.embeddings import OpenAIEmbeddings
import chromadb

# Use a persistent client for production
client = chromadb.PersistentClient(path="./chroma_db")

embeddings = OpenAIEmbeddings(model="text-embedding-3-large")

vectorstore = Chroma(
    client=client,
    collection_name="knowledge_base",
    embedding_function=embeddings,
)

# Batch upsert — critical for large document sets
batch_size = 100
for i in range(0, len(chunks), batch_size):
    batch = chunks[i:i + batch_size]
    vectorstore.add_documents(batch)
    print(f"Indexed batch {i // batch_size + 1}")
```

### 3. Retrieval with Re-Ranking

Simple vector similarity is often not enough. Add a cross-encoder re-ranker for significantly better precision:

```python
from langchain.retrievers import ContextualCompressionRetriever
from langchain.retrievers.document_compressors import CrossEncoderReranker
from langchain_community.cross_encoders import HuggingFaceCrossEncoder

# Base retriever — fetch more than you need
base_retriever = vectorstore.as_retriever(
    search_type="mmr",       # Maximum marginal relevance
    search_kwargs={"k": 20, "fetch_k": 50},
)

# Re-ranker — trim to the best k
reranker = HuggingFaceCrossEncoder(model_name="BAAI/bge-reranker-base")
compressor = CrossEncoderReranker(model=reranker, top_n=5)

retriever = ContextualCompressionRetriever(
    base_compressor=compressor,
    base_retriever=base_retriever,
)
```

### 4. The Generation Chain

```python
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from langchain_openai import ChatOpenAI

PROMPT_TEMPLATE = """You are an expert assistant. Answer the question using ONLY 
the provided context. If the answer is not in the context, say "I don't have 
enough information to answer this accurately."

Context:
{context}

Question: {question}

Answer (cite specific passages when possible):"""

prompt = PromptTemplate(
    template=PROMPT_TEMPLATE,
    input_variables=["context", "question"],
)

llm = ChatOpenAI(model="gpt-4o", temperature=0)

qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=retriever,
    chain_type_kwargs={"prompt": prompt},
    return_source_documents=True,
)
```

### 5. Response with Citations

```python
def query_with_citations(question: str) -> dict:
    result = qa_chain.invoke({"query": question})
    
    sources = [
        {
            "content": doc.page_content[:200],
            "source": doc.metadata.get("source", "unknown"),
            "page": doc.metadata.get("page", 0),
        }
        for doc in result["source_documents"]
    ]
    
    return {
        "answer": result["result"],
        "sources": sources,
        "confidence": compute_confidence(result),
    }
```

## Chunking Strategy Matters More Than You Think

This is the most overlooked aspect of RAG. The right chunking strategy can improve retrieval accuracy by 30-40%.

**Fixed-size chunking** (naive):
- Simple to implement
- Breaks mid-sentence, losing context
- Produces inconsistent quality chunks

**Recursive character splitting** (good default):
- Respects paragraph and sentence boundaries
- 1024 tokens with 128 overlap is a solid starting point
- Works well for most document types

**Semantic chunking** (best for varied content):
- Groups sentences by semantic similarity
- More expensive to compute
- Produces coherent, topic-aligned chunks

```python
from langchain_experimental.text_splitter import SemanticChunker
from langchain_openai import OpenAIEmbeddings

semantic_splitter = SemanticChunker(
    OpenAIEmbeddings(),
    breakpoint_threshold_type="percentile",
    breakpoint_threshold_amount=95,
)
semantic_chunks = semantic_splitter.split_documents(documents)
```

## Evaluation Framework

Never ship a RAG system you haven't evaluated. Use RAGAS for automated evaluation:

```python
from ragas import evaluate
from ragas.metrics import faithfulness, answer_relevancy, context_recall

# Build evaluation dataset
eval_questions = [
    "What is the refund policy?",
    "How do I reset my password?",
    # ... more questions
]

eval_dataset = build_eval_dataset(eval_questions, qa_chain)

result = evaluate(
    eval_dataset,
    metrics=[faithfulness, answer_relevancy, context_recall],
)

print(result)
# faithfulness: 0.92
# answer_relevancy: 0.88  
# context_recall: 0.79
```

Target scores before going to production:
- Faithfulness > 0.90
- Answer Relevancy > 0.85
- Context Recall > 0.75

## Production Checklist

Before deploying your RAG system:

- [ ] Implement request caching for frequent queries (Redis TTL: 1 hour)
- [ ] Add query preprocessing (spell correction, query expansion)
- [ ] Set up async ingestion pipeline for document updates
- [ ] Configure rate limiting on the embedding API calls
- [ ] Implement fallback to keyword search when vector search fails
- [ ] Add monitoring for retrieval latency and answer quality
- [ ] Set up human feedback loop to continuously improve

## Conclusion

Building a production RAG system is 20% vector search and 80% engineering discipline. The core concepts are straightforward, but the details — chunking strategy, re-ranking, evaluation, monitoring — are what separate systems that work in demos from systems that work for users.

The patterns in this guide have been battle-tested across multiple enterprise deployments. Start simple, measure everything, and iterate based on real query data.

Have questions about your specific RAG architecture? Feel free to reach out or leave a comment below.
