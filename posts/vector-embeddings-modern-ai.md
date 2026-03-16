---
title: 'Vector Embeddings: The Hidden Layer of Modern AI Apps'
slug: vector-embeddings-modern-ai
date: '2025-03-01'
category: GenAI Systems
tags:
  - Embeddings
  - Pinecone
  - Semantic Search
  - OpenAI
  - Vector DB
excerpt: >-
  Understanding embeddings and how to leverage them for semantic search,
  recommendations, anomaly detection, and long-term agent memory.
color: pink
status: published
featured: false
---

## What Are Embeddings?

An embedding is a dense vector — a list of floating-point numbers — that represents the semantic meaning of a piece of text. The magic: text with similar meaning produces vectors that are geometrically close in high-dimensional space.

```
"The cat sat on the mat"  → [0.23, -0.41, 0.87, ...]  (1536 dimensions)
"A feline rested on a rug"→ [0.25, -0.39, 0.84, ...]  (very close!)
"Stock market crashes"    → [-0.91, 0.12, -0.33, ...] (far away)
```

This single property unlocks an extraordinary range of applications.

## Generating Embeddings

```python
from openai import OpenAI
import numpy as np

client = OpenAI()

def embed(text: str, model: str = "text-embedding-3-small") -> list[float]:
    """Generate an embedding for a single text."""
    response = client.embeddings.create(
        input=text,
        model=model,
        dimensions=512,  # Optional: reduce for speed/storage
    )
    return response.data[0].embedding

def embed_batch(texts: list[str], model: str = "text-embedding-3-small") -> list[list[float]]:
    """Batch embed for efficiency — up to 2048 inputs per call."""
    response = client.embeddings.create(
        input=texts,
        model=model,
    )
    # Results are in the same order as inputs
    return [item.embedding for item in sorted(response.data, key=lambda x: x.index)]

# Similarity
def cosine_similarity(a: list[float], b: list[float]) -> float:
    a, b = np.array(a), np.array(b)
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))
```

## Choosing the Right Embedding Model

| Model | Dimensions | Speed | Cost | Best For |
|-------|-----------|-------|------|----------|
| `text-embedding-3-small` | 1536 | Fast | $0.02/1M | General use, RAG |
| `text-embedding-3-large` | 3072 | Moderate | $0.13/1M | High-accuracy search |
| `text-embedding-ada-002` | 1536 | Fast | $0.10/1M | Legacy, avoid for new projects |
| `BAAI/bge-large-en-v1.5` | 1024 | Fast | Free | Self-hosted, privacy-sensitive |
| `nomic-embed-text` | 768 | Very fast | Free | Local, low-latency |

For most RAG applications, `text-embedding-3-small` is the sweet spot between quality and cost.

## Application 1: Semantic Search

Keyword search fails when users don't use the exact right words. Semantic search finds conceptually related content:

```python
import chromadb

client = chromadb.PersistentClient(path="./search_db")
collection = client.get_or_create_collection(
    name="articles",
    metadata={"hnsw:space": "cosine"},
)

def index_articles(articles: list[dict]):
    """Index articles for semantic search."""
    embeddings = embed_batch([a["content"] for a in articles])
    collection.add(
        documents=[a["content"] for a in articles],
        embeddings=embeddings,
        ids=[a["id"] for a in articles],
        metadatas=[{"title": a["title"], "author": a["author"]} for a in articles],
    )

def semantic_search(query: str, n_results: int = 5) -> list[dict]:
    """Find semantically similar articles."""
    query_embedding = embed(query)
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=n_results,
    )
    return [
        {
            "content": doc,
            "metadata": meta,
            "similarity": 1 - dist,  # Convert distance to similarity
        }
        for doc, meta, dist in zip(
            results["documents"][0],
            results["metadatas"][0],
            results["distances"][0],
        )
    ]

# Now "machine learning models" will find articles about "neural networks"
# even if those exact words don't appear in the query
results = semantic_search("How do neural networks learn?")
```

## Application 2: Recommendation System

```python
class ContentRecommender:
    def __init__(self, items: list[dict]):
        """
        items: list of dicts with 'id', 'title', 'description' keys
        """
        self.items = {item["id"]: item for item in items}
        
        # Pre-compute embeddings for all items
        texts = [f"{item['title']}. {item['description']}" for item in items]
        embeddings = embed_batch(texts)
        
        self.item_embeddings = {
            item["id"]: emb 
            for item, emb in zip(items, embeddings)
        }
    
    def recommend(self, item_id: str, n: int = 5) -> list[dict]:
        """Find the N most similar items to a given item."""
        if item_id not in self.item_embeddings:
            raise ValueError(f"Item {item_id} not found")
        
        target_emb = self.item_embeddings[item_id]
        
        similarities = [
            (id_, cosine_similarity(target_emb, emb))
            for id_, emb in self.item_embeddings.items()
            if id_ != item_id
        ]
        
        # Sort by similarity descending
        similarities.sort(key=lambda x: x[1], reverse=True)
        
        return [
            {**self.items[id_], "similarity": sim}
            for id_, sim in similarities[:n]
        ]
```

## Application 3: Anomaly Detection

Find documents that don't belong with the rest:

```python
def find_anomalies(documents: list[str], threshold: float = 0.5) -> list[int]:
    """
    Returns indices of documents that are semantically far from the cluster center.
    Useful for: finding spam in support tickets, off-topic content, etc.
    """
    embeddings = np.array(embed_batch(documents))
    
    # Compute centroid (average embedding)
    centroid = embeddings.mean(axis=0)
    
    # Compute distance from centroid for each document
    similarities_to_center = [
        cosine_similarity(emb.tolist(), centroid.tolist())
        for emb in embeddings
    ]
    
    # Anomalies are far from the center
    anomalies = [
        i for i, sim in enumerate(similarities_to_center)
        if sim < threshold
    ]
    
    return anomalies

# Example: find off-topic support tickets
tickets = load_support_tickets()
anomaly_indices = find_anomalies(tickets)
for i in anomaly_indices:
    print(f"Potential anomaly: {tickets[i][:100]}")
```

## Application 4: Long-Term Agent Memory

The biggest limitation of LLMs is their context window. Embeddings solve this:

```python
import time

class SemanticMemory:
    """
    Long-term memory for AI agents using vector similarity.
    Stores arbitrary facts and retrieves the most relevant ones for any query.
    """
    def __init__(self, capacity: int = 10000):
        self.client = chromadb.EphemeralClient()
        self.collection = self.client.create_collection("agent_memory")
        self.capacity = capacity
        self._counter = 0
    
    def remember(self, fact: str, metadata: dict = None):
        """Store a fact in long-term memory."""
        embedding = embed(fact)
        self.collection.add(
            documents=[fact],
            embeddings=[embedding],
            ids=[f"mem_{self._counter}"],
            metadatas=[{
                **(metadata or {}),
                "timestamp": time.time(),
            }],
        )
        self._counter += 1
    
    def recall(self, query: str, n: int = 5) -> list[str]:
        """Retrieve the most relevant memories for a query."""
        results = self.collection.query(
            query_embeddings=[embed(query)],
            n_results=min(n, self._counter),
        )
        return results["documents"][0]
    
    def forget_old(self, keep_recent: int = 1000):
        """Prune old memories to stay within capacity."""
        # Get all IDs sorted by timestamp
        all_results = self.collection.get(include=["metadatas"])
        sorted_ids = sorted(
            zip(all_results["ids"], all_results["metadatas"]),
            key=lambda x: x[1].get("timestamp", 0),
        )
        
        # Delete oldest
        to_delete = [id_ for id_, _ in sorted_ids[:-keep_recent]]
        if to_delete:
            self.collection.delete(ids=to_delete)

# Usage in an agent
memory = SemanticMemory()
memory.remember("User prefers concise explanations without jargon")
memory.remember("User is building a SaaS product in the healthcare space")
memory.remember("User's tech stack: FastAPI, React, PostgreSQL")

# Later, when answering a question:
relevant = memory.recall("How should I structure the API?")
context = "\n".join(relevant)
response = llm.invoke(f"Context: {context}\n\nQuestion: How should I structure the API?")
```

## Storing Embeddings at Scale

For production with millions of vectors, use a dedicated vector database:

**Pinecone** (managed, easiest):
```python
from pinecone import Pinecone, ServerlessSpec

pc = Pinecone(api_key="YOUR_KEY")
index = pc.create_index(
    name="genai-lab",
    dimension=1536,
    metric="cosine",
    spec=ServerlessSpec(cloud="aws", region="us-east-1"),
)

# Upsert vectors
index.upsert(vectors=[
    {"id": "doc1", "values": embed("your text"), "metadata": {"source": "blog"}}
])

# Query
results = index.query(vector=embed("search query"), top_k=10, include_metadata=True)
```

**Qdrant** (self-hosted, best performance):
```python
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct

client = QdrantClient(":memory:")  # or url="http://localhost:6333"
client.create_collection(
    "knowledge_base",
    vectors_config=VectorParams(size=1536, distance=Distance.COSINE),
)
```

## Conclusion

Embeddings are the connective tissue of modern AI applications. Once you internalize that semantic similarity is just vector distance, a whole category of problems becomes solvable: search, recommendations, deduplication, classification, anomaly detection, and memory.

The investment in understanding embeddings well pays dividends across every AI project you'll ever work on.
