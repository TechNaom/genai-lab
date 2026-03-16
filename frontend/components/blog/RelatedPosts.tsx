import { Post } from '../../lib/api'
import PostCard from './PostCard'

interface Props {
  posts: Post[]
  title?: string
}

export default function RelatedPosts({ posts, title = 'Related Articles' }: Props) {
  if (!posts.length) return null

  return (
    <section className="max-w-6xl mx-auto px-6 pb-16">
      <div
        className="text-xs tracking-widest uppercase font-semibold mb-6 flex items-center gap-2"
        style={{ color: '#00d4ff' }}
      >
        <span className="inline-block w-6 h-px" style={{ background: '#00d4ff' }} />
        {title}
      </div>
      <div
        className="grid gap-5"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}
      >
        {posts.map((post, i) => (
          <PostCard key={post.slug} post={post} index={i} />
        ))}
      </div>
    </section>
  )
}
