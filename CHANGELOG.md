# Changelog

All notable changes to Manohar's GenAI Lab are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [1.0.0] — 2025-03-15

### Added

**Platform**
- Full Next.js 14 frontend with TypeScript and Tailwind CSS
- FastAPI Python backend with markdown file storage
- Docker + Docker Compose support for self-hosting
- Render Blueprint (`render.yaml`) for one-click cloud deployment
- GitHub Actions CI pipeline (lint + build + test)
- `Makefile` for common development tasks
- `start.sh` quick-launch script

**Frontend Pages**
- Homepage with hero, featured posts, categories, stats, newsletter
- Blog listing with live search, tag filters, and pagination
- Article pages with syntax-highlighted code, table of contents, reading time
- Tag pages (`/blog/tag/[tag]`) with related tags sidebar
- Projects page with 6 AI project cards
- Experiments tracker with 8 research studies
- About page with skills grid and career timeline
- Admin dashboard with login, rich editor, draft/publish workflow
- Custom 404 page

**Components**
- `PostCard` — animated blog card with cover gradients
- `PostGrid` — responsive grid with loading skeletons and empty state
- `RelatedPosts` — auto-suggests by category and tag overlap
- `Layout` — sticky nav with mobile hamburger, reading progress bar
- `TagBadge` — reusable tag pill component
- `SEO` — full OG/Twitter Card/article meta per page
- `ReadingProgress` — scroll-based progress bar
- `NewsletterForm` — email capture with validation

**API Routes (Next.js)**
- `GET /api/rss` — valid RSS 2.0 feed from published posts
- `GET /api/sitemap` → served at `/sitemap.xml`
- `GET /api/robots` → served at `/robots.txt`

**Backend API**
- `GET /api/posts/` — list posts (filter by tag, category, search query)
- `GET /api/posts/{slug}` — get single published post
- `POST /api/posts/` — create post (admin)
- `PUT /api/posts/{slug}` — update post (admin)
- `DELETE /api/posts/{slug}` — delete post (admin)
- `GET /api/posts/admin/all` — list all posts including drafts (admin)
- `POST /api/auth/login` — admin login, returns token
- `POST /api/newsletter/subscribe` — newsletter signup
- `GET /api/newsletter/count` — public subscriber count
- `GET /health` — health check endpoint

**Content**
- 6 full-length technical blog posts:
  - Building Production-Ready RAG Systems with LangChain
  - Prompt Engineering Patterns for Enterprise LLMs
  - Mini-LLMs: Training Domain-Specific Models on Consumer Hardware
  - Agentic AI: Building Reliable Multi-Step Automation Workflows
  - Vector Embeddings: The Hidden Layer of Modern AI Apps
  - LLM Observability: Monitoring AI Systems in Production
- 13 backend API tests covering CRUD, auth, and edge cases

**Design System**
- Dark theme with cyan/purple gradient accent system
- Syne display font + JetBrains Mono for code
- Glassmorphism surface cards
- Framer Motion page transitions and hover effects
- Responsive layouts (mobile-first)
- Reading progress bar on article pages

---

## Roadmap

### [1.1.0] — Planned
- [ ] Search with full-text indexing (Fuse.js or MeiliSearch)
- [ ] Dark/light mode toggle
- [ ] Image upload for post covers (Cloudinary integration)
- [ ] Comment system (giscus or Disqus)
- [ ] Post analytics dashboard in admin
- [ ] Email notifications on publish (Resend integration)

### [1.2.0] — Planned
- [ ] Multi-author support
- [ ] Series/collections grouping
- [ ] Interactive code playgrounds (CodeSandbox embeds)
- [ ] AI-assisted post writing in admin
- [ ] Custom domain email (newsletter)
