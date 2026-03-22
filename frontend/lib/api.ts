// All API calls go through Next.js proxy routes — no CORS issues
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://genai-lab-api.onrender.com'

export interface Post {
  title: string
  slug: string
  date?: string
  category?: string
  tags?: string[]
  excerpt?: string
  color?: string
  status?: string
  featured?: boolean
  readTime?: number
  content?: string
}

// Direct backend fetch — used server-side (getStaticProps etc.)
async function backendFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err.detail || 'API error')
  }
  return res.json()
}

// Client-side fetch — goes through Next.js proxy (no CORS)
async function proxyFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(path, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err.detail || 'API error')
  }
  return res.json()
}

function authHeaders(token: string) {
  return { 'x-admin-token': token }
}

export const api = {
  // ── Public endpoints (server-side, direct) ──
  async getPosts(params: { limit?: number; tag?: string; category?: string; q?: string } = {}): Promise<Post[]> {
    const q = new URLSearchParams()
    if (params.limit) q.set('limit', String(params.limit))
    if (params.tag) q.set('tag', params.tag)
    if (params.category) q.set('category', params.category)
    if (params.q) q.set('q', params.q)
    const qs = q.toString()
    return backendFetch(`/api/posts/${qs ? '?' + qs : ''}`)
  },

  async getPost(slug: string): Promise<Post> {
    return backendFetch(`/api/posts/${slug}`)
  },

  async getTags(): Promise<string[]> {
    const posts: Post[] = await backendFetch('/api/posts/')
    const tags = new Set<string>()
    posts.forEach((p) => (p.tags || []).forEach((t) => tags.add(t)))
    return Array.from(tags)
  },

  // ── Admin endpoints (client-side, via proxy) ──
  async login(username: string, password: string) {
    return proxyFetch('/api/auth-proxy', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })
  },

  async getAllPosts(token: string): Promise<Post[]> {
    return proxyFetch('/api/posts-proxy?status=all', {
      headers: authHeaders(token),
    })
  },

  async createPost(token: string, post: Partial<Post> & { content?: string }) {
    return proxyFetch('/api/posts-proxy', {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify(post),
    })
  },

  async updatePost(token: string, slug: string, post: Partial<Post> & { content?: string }) {
    return proxyFetch(`/api/posts-proxy?slug=${slug}`, {
      method: 'PUT',
      headers: authHeaders(token),
      body: JSON.stringify(post),
    })
  },

  async deletePost(token: string, slug: string) {
    const res = await fetch(`/api/posts-proxy?slug=${slug}`, {
      method: 'DELETE',
      headers: { 'x-admin-token': token },
    })
    if (!res.ok) throw new Error('Delete failed')
  },
}
