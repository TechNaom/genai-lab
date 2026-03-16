const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

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

async function apiFetch(path: string, options: RequestInit = {}) {
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

function authHeaders(token: string) {
  return { 'x-admin-token': token }
}

// ── Public ──────────────────────────────────────────────────────────────────

export const api = {
  async getPosts(params?: {
    tag?: string
    category?: string
    q?: string
    page?: number
    limit?: number
  }): Promise<Post[]> {
    const qs = new URLSearchParams()
    if (params?.tag) qs.set('tag', params.tag)
    if (params?.category) qs.set('category', params.category)
    if (params?.q) qs.set('q', params.q)
    if (params?.page) qs.set('page', String(params.page))
    if (params?.limit) qs.set('limit', String(params.limit))
    return apiFetch(`/api/posts/?${qs.toString()}`)
  },

  async getPost(slug: string): Promise<Post> {
    return apiFetch(`/api/posts/${slug}`)
  },

  // ── Admin ────────────────────────────────────────────────────────────────

  async login(username: string, password: string) {
    return apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })
  },

  async getAllPosts(token: string): Promise<Post[]> {
    return apiFetch('/api/posts/admin/all', {
      headers: authHeaders(token),
    })
  },

  async createPost(token: string, post: Partial<Post> & { content?: string }) {
    return apiFetch('/api/posts/', {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify(post),
    })
  },

  async updatePost(token: string, slug: string, post: Partial<Post> & { content?: string }) {
    return apiFetch(`/api/posts/${slug}`, {
      method: 'PUT',
      headers: authHeaders(token),
      body: JSON.stringify(post),
    })
  },

  async deletePost(token: string, slug: string) {
    const res = await fetch(`${API_URL}/api/posts/${slug}`, {
      method: 'DELETE',
      headers: { 'x-admin-token': token },
    })
    if (!res.ok) throw new Error('Delete failed')
  },
}
