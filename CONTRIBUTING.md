# Contributing to Manohar's GenAI Lab

Thank you for your interest in contributing! This document covers the development workflow, coding standards, and how to submit changes.

---

## Development Setup

```bash
# 1. Fork and clone
git clone https://github.com/YOUR_USERNAME/genai-lab.git
cd genai-lab

# 2. Install dependencies
make install

# 3. Set up environment
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local

# 4. Start dev servers
make dev
```

Open http://localhost:3000 — changes hot-reload automatically.

---

## Project Structure

```
genai-lab/
├── backend/         FastAPI Python API
│   ├── routers/     Route handlers (posts, auth, newsletter)
│   ├── models/      Pydantic schemas
│   ├── utils/       Shared helpers (markdown parsing)
│   └── tests/       pytest test suite
├── frontend/        Next.js TypeScript app
│   ├── pages/       File-based routes
│   ├── components/  Reusable UI components
│   ├── lib/         API client + utilities
│   └── styles/      Global CSS + design tokens
└── posts/           Markdown blog posts (flat files)
```

---

## Workflow

### Branches

| Branch | Purpose |
|--------|---------|
| `main` | Production — auto-deploys to Render |
| `develop` | Integration branch for features |
| `feature/*` | Individual features |
| `fix/*` | Bug fixes |

```bash
# Start a feature
git checkout develop
git checkout -b feature/my-feature

# Work, commit, push
git add .
git commit -m "feat: add my feature"
git push origin feature/my-feature

# Open a PR against develop
```

### Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add newsletter unsubscribe endpoint
fix: correct tag filter on blog listing page
docs: update deployment guide for Render disk
refactor: extract TOC logic into separate hook
chore: bump Next.js to 14.3.0
```

---

## Coding Standards

### TypeScript / React

- Functional components with explicit prop interfaces
- No `any` types except in ReactMarkdown component overrides
- All API calls go through `lib/api.ts` — never `fetch` directly in components
- Styles use inline style objects with CSS variable tokens (no hardcoded hex)
- Use Framer Motion for animations, not CSS keyframes

### Python

- Type hints on all function signatures
- Pydantic models for all request/response bodies
- No raw `dict` returns from route handlers — always a Pydantic model or typed dict
- Docstrings on all public functions

```python
# Good
def parse_frontmatter(raw: str) -> tuple[dict, str]:
    """Parse YAML frontmatter from markdown. Returns (metadata, content)."""
    ...

# Avoid
def parse(r):
    ...
```

### Markdown Posts

Every post in `/posts` must have valid YAML frontmatter:

```yaml
---
title: 'Your Post Title'
slug: your-post-slug
date: 'YYYY-MM-DD'
category: 'One of the 6 categories'
tags: ['tag1', 'tag2']
excerpt: 'One sentence summary for card preview.'
color: cyan          # cyan | purple | green | orange | pink
status: published    # published | draft
featured: false
---
```

---

## Testing

```bash
# Run backend tests
make test-backend

# Run with coverage
cd backend && . venv/bin/activate && pytest tests/ -v --cov=. --cov-report=term

# Lint frontend
make lint
```

All PRs must pass the CI checks (lint + build + test) before merging.

### Adding Tests

Tests live in `backend/tests/test_posts.py`. Follow the existing pattern:

```python
def test_my_new_feature():
    # Arrange
    payload = { ... }
    # Act
    res = client.post("/api/posts/", json=payload, headers=AUTH_HEADERS)
    # Assert
    assert res.status_code == 201
    assert res.json()["title"] == payload["title"]
```

---

## Adding a New Page

1. Create `frontend/pages/your-page.tsx`
2. Export a default React component
3. Add to `navLinks` array in `components/layout/Layout.tsx`
4. Use the `<SEO>` component for meta tags
5. Wrap with `<Layout>`

```tsx
import Layout from '../components/layout/Layout'
import SEO from '../components/ui/SEO'

export default function YourPage() {
  return (
    <Layout>
      <SEO title="Your Page" description="..." />
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* content */}
      </div>
    </Layout>
  )
}
```

---

## Adding a New API Endpoint

1. Create or edit a router in `backend/routers/`
2. Add Pydantic models to `backend/models/`
3. Register the router in `backend/main.py`
4. Add tests in `backend/tests/`
5. Update `lib/api.ts` in the frontend if the endpoint is client-facing

---

## Questions?

Open a GitHub Discussion or reach out to Manohar directly.
