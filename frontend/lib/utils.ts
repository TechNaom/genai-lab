/**
 * Shared utility helpers for the GenAI Lab frontend.
 */

export function formatDate(d?: string): string {
  if (!d) return ''
  try {
    return new Date(d).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return d
  }
}

export function formatDateShort(d?: string): string {
  if (!d) return ''
  try {
    return new Date(d).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return d
  }
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function estimateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length
  return Math.max(1, Math.round(words / 200))
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).replace(/\s+\S*$/, '') + '…'
}

/** Extract heading objects from markdown for table of contents */
export function extractHeadings(markdown: string) {
  const headings: { level: number; text: string; id: string }[] = []
  markdown.split('\n').forEach((line) => {
    const m2 = line.match(/^## (.+)/)
    const m3 = line.match(/^### (.+)/)
    if (m2) {
      const text = m2[1].trim()
      headings.push({ level: 2, text, id: text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') })
    } else if (m3) {
      const text = m3[1].trim()
      headings.push({ level: 3, text, id: text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') })
    }
  })
  return headings
}

export const COVER_GRADIENTS: Record<string, string> = {
  cyan: 'linear-gradient(135deg, #051520, #003d5c, #006688)',
  purple: 'linear-gradient(135deg, #0a0520, #2d1b6e, #5b3bb8)',
  green: 'linear-gradient(135deg, #041208, #0d3320, #1a6640)',
  orange: 'linear-gradient(135deg, #150800, #4a2000, #8a4000)',
  pink: 'linear-gradient(135deg, #150510, #4a1030, #882050)',
}

export const CAT_EMOJI: Record<string, string> = {
  'AI Automation': '🤖',
  'Prompt Engineering': '✍️',
  'GenAI Systems': '⚙️',
  'LLM Architectures': '🏗️',
  'Mini LLM Research': '🧪',
  'Experiments': '🔬',
}

export const CAT_ACCENT: Record<string, string> = {
  'AI Automation': '#00d4ff',
  'Prompt Engineering': '#a78bfa',
  'GenAI Systems': '#00ff9d',
  'LLM Architectures': '#ff8c42',
  'Mini LLM Research': '#ff4d6d',
  'Experiments': '#ffd700',
}
