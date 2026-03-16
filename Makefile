# ─────────────────────────────────────────────────────────────────────────────
# Makefile — Manohar's GenAI Lab
# Usage: make <target>
# ─────────────────────────────────────────────────────────────────────────────

.PHONY: help dev dev-backend dev-frontend install install-backend install-frontend \
        test test-backend lint lint-frontend build docker-up docker-down docker-logs \
        clean new-post

# Default: show help
help:
	@echo ""
	@echo "  Manohar's GenAI Lab — Make Commands"
	@echo "  ─────────────────────────────────────"
	@echo "  make dev              Start both backend and frontend (local)"
	@echo "  make dev-backend      Start FastAPI backend only"
	@echo "  make dev-frontend     Start Next.js frontend only"
	@echo "  make install          Install all dependencies"
	@echo "  make test             Run all tests"
	@echo "  make lint             Lint frontend TypeScript"
	@echo "  make build            Production build (frontend)"
	@echo "  make docker-up        Start with Docker Compose"
	@echo "  make docker-down      Stop Docker Compose"
	@echo "  make docker-logs      Tail Docker logs"
	@echo "  make clean            Remove build artifacts and caches"
	@echo "  make new-post         Scaffold a new blog post"
	@echo ""

# ── Local Development ─────────────────────────────────────────────────────────

dev:
	@bash start.sh

dev-backend:
	@cd backend && \
		([ -d venv ] || python3 -m venv venv) && \
		. venv/bin/activate && \
		pip install -r requirements.txt -q && \
		uvicorn main:app --reload --port 8000

dev-frontend:
	@cd frontend && npm run dev

# ── Install ───────────────────────────────────────────────────────────────────

install: install-backend install-frontend
	@echo "✓ All dependencies installed"

install-backend:
	@cd backend && \
		([ -d venv ] || python3 -m venv venv) && \
		. venv/bin/activate && \
		pip install -r requirements.txt -q
	@echo "✓ Backend dependencies installed"

install-frontend:
	@cd frontend && npm install -q
	@echo "✓ Frontend dependencies installed"

# ── Testing ───────────────────────────────────────────────────────────────────

test: test-backend
	@echo "✓ All tests passed"

test-backend:
	@cd backend && \
		. venv/bin/activate && \
		python -m pytest tests/ -v

# ── Lint ──────────────────────────────────────────────────────────────────────

lint: lint-frontend

lint-frontend:
	@cd frontend && npm run lint

# ── Build ─────────────────────────────────────────────────────────────────────

build:
	@cd frontend && npm run build
	@echo "✓ Production build complete → frontend/.next"

# ── Docker ───────────────────────────────────────────────────────────────────

docker-up:
	@[ -f .env ] || (echo "⚠  No .env found. Copying .env.docker → .env" && cp .env.docker .env)
	@docker-compose up --build -d
	@echo ""
	@echo "  🌐 Frontend: http://localhost:3000"
	@echo "  ⚡ Backend:  http://localhost:8000"
	@echo "  📖 API Docs: http://localhost:8000/docs"
	@echo ""

docker-down:
	@docker-compose down

docker-logs:
	@docker-compose logs -f

# ── Utilities ─────────────────────────────────────────────────────────────────

clean:
	@rm -rf frontend/.next frontend/node_modules
	@rm -rf backend/__pycache__ backend/venv backend/tests/__pycache__
	@find backend -name "*.pyc" -delete
	@echo "✓ Cleaned build artifacts"

# Scaffold a new markdown post interactively
new-post:
	@read -p "Post title: " title; \
	slug=$$(echo "$$title" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-//;s/-$$//'); \
	date=$$(date +%Y-%m-%d); \
	file="posts/$$slug.md"; \
	echo "---" > $$file; \
	echo "title: '$$title'" >> $$file; \
	echo "slug: $$slug" >> $$file; \
	echo "date: '$$date'" >> $$file; \
	echo "category: GenAI Systems" >> $$file; \
	echo "tags: []" >> $$file; \
	echo "excerpt: ''" >> $$file; \
	echo "color: cyan" >> $$file; \
	echo "status: draft" >> $$file; \
	echo "featured: false" >> $$file; \
	echo "---" >> $$file; \
	echo "" >> $$file; \
	echo "## Introduction" >> $$file; \
	echo "" >> $$file; \
	echo "Write your content here..." >> $$file; \
	echo ""; \
	echo "✓ Created: $$file"; \
	echo "  Edit it, then publish via Admin dashboard or set status: published"
