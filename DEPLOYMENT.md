# Deployment Guide — Manohar's GenAI Lab

## Prerequisites

- GitHub account
- Render account (free tier works)
- Node.js 20+ installed locally
- Python 3.11+ installed locally

---

## Step 1 — Push to GitHub

```bash
cd genai-lab

# Initialize git
git init
git add .
git commit -m "Initial commit: Manohar's GenAI Lab"

# Create repo on GitHub (via CLI or website), then:
git remote add origin https://github.com/YOUR_USERNAME/genai-lab.git
git branch -M main
git push -u origin main
```

---

## Step 2 — Deploy Backend on Render

### 2a. Create Web Service

1. Go to [render.com](https://render.com) → **New** → **Web Service**
2. Connect your GitHub repo
3. Configure:
   - **Name**: `genai-lab-api`
   - **Root Directory**: `backend`
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### 2b. Add Environment Variables

In Render dashboard → Environment:

| Key | Value |
|-----|-------|
| `ADMIN_USERNAME` | `admin` (change this!) |
| `ADMIN_PASSWORD` | your-strong-password |
| `ADMIN_SECRET` | your-random-secret-token |
| `POSTS_DIR` | `/data/posts` |
| `FRONTEND_URL` | (set after frontend is deployed) |

### 2c. Add Persistent Disk

1. In your backend service → **Disks** → **Add Disk**
2. Name: `posts-storage`
3. Mount Path: `/data/posts`
4. Size: 1 GB

> **Important**: The posts disk persists your markdown files across deployments.
> Without it, posts created via admin will be lost on every deploy.

### 2d. Note Your Backend URL

After deploy, copy your backend URL: `https://genai-lab-api.onrender.com`

---

## Step 3 — Deploy Frontend on Render

### 3a. Create Web Service

1. **New** → **Web Service**
2. Connect same GitHub repo
3. Configure:
   - **Name**: `genai-lab-frontend`
   - **Root Directory**: `frontend`
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`

### 3b. Add Environment Variables

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_API_URL` | `https://genai-lab-api.onrender.com` |
| `NEXT_PUBLIC_SITE_URL` | `https://genai-lab-frontend.onrender.com` |
| `NODE_VERSION` | `20` |

### 3c. Update Backend CORS

Go back to backend service → Environment → update:

| Key | Value |
|-----|-------|
| `FRONTEND_URL` | `https://genai-lab-frontend.onrender.com` |

Then **Manual Deploy** → **Deploy latest commit** to apply the update.

---

## Step 4 — Verify Deployment

1. Visit your frontend URL
2. Check homepage loads posts
3. Navigate to `/admin` and log in
4. Create a test post and verify it appears on `/blog`

---

## Step 5 — Custom Domain (Optional)

In Render dashboard → your service → **Custom Domains**:

```
genai-lab.yourdomain.com   →   genai-lab-frontend
api.genai-lab.yourdomain.com  →  genai-lab-api
```

Update `NEXT_PUBLIC_API_URL` and `FRONTEND_URL` to use your custom domains.

---

## Seeding Initial Posts

To pre-populate your blog with the example posts:

```bash
# The posts/ directory is already in your repo.
# On Render, set POSTS_DIR to match your disk mount path.
# Or use the Admin dashboard to create posts manually.
```

To copy local posts to production:

```bash
# Via Render Shell (paid plan) or copy posts via admin UI
```

---

## Local Development

```bash
# Terminal 1: Backend
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env    # Edit with your values
uvicorn main:app --reload --port 8000

# Terminal 2: Frontend
cd frontend
npm install
cp .env.local.example .env.local   # Set NEXT_PUBLIC_API_URL=http://localhost:8000
npm run dev
```

Open http://localhost:3000

---

## Auto-Deploy on Git Push

Render auto-deploys when you push to `main`. To prevent this for drafts, use a separate branch:

```bash
git checkout -b develop    # Work on develop
git push origin develop    # No auto-deploy

git checkout main
git merge develop
git push origin main       # Triggers deploy
```

---

## Troubleshooting

### Posts not persisting after redeploy
→ Ensure the disk is attached and `POSTS_DIR` points to the disk mount path (`/data/posts`)

### CORS errors
→ Ensure `FRONTEND_URL` in backend env matches your frontend URL exactly (no trailing slash)

### Build fails on frontend
→ Check Node version is 20+. Set `NODE_VERSION=20` in environment variables

### Admin login fails
→ Verify `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and `ADMIN_SECRET` are set correctly in backend env

### Cold start delays (free tier)
→ Free Render services spin down after 15 min of inactivity. First request after idle takes ~30 seconds. Upgrade to paid to keep the service always-on.
