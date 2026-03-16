# Manohar's GenAI Lab

A production-ready personal blog platform for AI engineering content.

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS, Framer Motion
- **Backend**: Python FastAPI
- **Storage**: Markdown files in `/posts` directory
- **Deployment**: Render (frontend + backend as separate services)

## Project Structure

```
genai-lab/
├── frontend/                  # Next.js application
│   ├── pages/
│   │   ├── index.tsx          # Homepage
│   │   ├── blog/
│   │   │   ├── index.tsx      # Blog listing
│   │   │   └── [slug].tsx     # Individual article
│   │   ├── projects.tsx       # Projects page
│   │   ├── experiments.tsx    # Experiments page
│   │   ├── about.tsx          # About page
│   │   └── admin/
│   │       └── index.tsx      # Admin dashboard
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Layout.tsx
│   │   ├── blog/
│   │   │   ├── PostCard.tsx
│   │   │   ├── PostGrid.tsx
│   │   │   ├── TableOfContents.tsx
│   │   │   └── RelatedPosts.tsx
│   │   └── ui/
│   │       ├── TagBadge.tsx
│   │       ├── ReadingProgress.tsx
│   │       └── NewsletterForm.tsx
│   ├── lib/
│   │   ├── api.ts             # API client
│   │   └── utils.ts
│   ├── styles/
│   │   └── globals.css
│   ├── public/
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── package.json
│   └── .env.local.example
│
├── backend/                   # FastAPI application
│   ├── main.py                # App entry point
│   ├── routers/
│   │   ├── posts.py           # Post CRUD endpoints
│   │   └── auth.py            # Admin auth
│   ├── models/
│   │   └── post.py            # Pydantic models
│   ├── utils/
│   │   └── markdown.py        # Markdown utilities
│   ├── requirements.txt
│   └── .env.example
│
├── posts/                     # Markdown blog posts
│   └── building-rag-systems-langchain.md
│
└── render.yaml                # Render deployment config
```

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/genai-lab.git
cd genai-lab
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your values
uvicorn main:app --reload --port 8000
```

### 3. Frontend Setup

```bash
cd frontend
npm install
cp .env.local.example .env.local
# Edit .env.local — set NEXT_PUBLIC_API_URL=http://localhost:8000
npm run dev
```

Open http://localhost:3000

## Admin Access

Navigate to `/admin` and log in with the credentials from your `.env` file.

Default (change immediately!):
- Username: `admin`
- Password: `genai2025`

## Deploy to Render

1. Push code to GitHub
2. Go to [render.com](https://render.com) → New → Blueprint
3. Connect your GitHub repo
4. Render reads `render.yaml` and creates both services automatically
5. Set environment variables in the Render dashboard

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.
