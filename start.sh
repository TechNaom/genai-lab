#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
# start.sh — Quick local dev launcher for Manohar's GenAI Lab
# Usage: bash start.sh
# ─────────────────────────────────────────────────────────────

set -e

CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RESET='\033[0m'

echo -e "${CYAN}"
echo "  ╔═══════════════════════════════════════╗"
echo "  ║     Manohar's GenAI Lab — Dev Start   ║"
echo "  ╚═══════════════════════════════════════╝"
echo -e "${RESET}"

# ── Backend Setup ─────────────────────────────────────────────
echo -e "${YELLOW}[1/4] Setting up Python backend...${RESET}"

cd backend

if [ ! -d "venv" ]; then
  echo "  Creating virtual environment..."
  python3 -m venv venv
fi

source venv/bin/activate
pip install -r requirements.txt -q

if [ ! -f ".env" ]; then
  echo "  Creating .env from example..."
  cp .env.example .env
  echo -e "${YELLOW}  ⚠ Edit backend/.env with your credentials before production use!${RESET}"
fi

echo -e "${GREEN}  ✓ Backend ready${RESET}"

# ── Frontend Setup ─────────────────────────────────────────────
echo -e "${YELLOW}[2/4] Setting up Next.js frontend...${RESET}"

cd ../frontend

if [ ! -d "node_modules" ]; then
  echo "  Installing npm packages..."
  npm install -q
fi

if [ ! -f ".env.local" ]; then
  echo "  Creating .env.local from example..."
  cp .env.local.example .env.local
fi

echo -e "${GREEN}  ✓ Frontend ready${RESET}"

# ── Launch Services ────────────────────────────────────────────
echo -e "${YELLOW}[3/4] Starting services...${RESET}"
cd ..

# Start backend in background
(cd backend && source venv/bin/activate && uvicorn main:app --reload --port 8000) &
BACKEND_PID=$!

# Give backend a moment to start
sleep 2

# Start frontend in background
(cd frontend && npm run dev) &
FRONTEND_PID=$!

# ── Ready ──────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}[4/4] GenAI Lab is running!${RESET}"
echo ""
echo -e "  🌐 Frontend:  ${CYAN}http://localhost:3000${RESET}"
echo -e "  ⚡ Backend:   ${CYAN}http://localhost:8000${RESET}"
echo -e "  📖 API docs:  ${CYAN}http://localhost:8000/docs${RESET}"
echo -e "  🔐 Admin:     ${CYAN}http://localhost:3000/admin${RESET}"
echo ""
echo "  Press Ctrl+C to stop all services"
echo ""

# Wait and clean up on exit
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo 'Services stopped.'" INT TERM
wait
