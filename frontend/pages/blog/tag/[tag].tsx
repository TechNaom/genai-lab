import { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Layout from '../../../components/layout/Layout'
import PostCard from '../../../components/blog/PostCard'
import { api, Post } from '../../../lib/api'

interface Props {
  tag: string
  posts: Post[]
  allTags: string[]
}

export default function TagPage({ tag, posts, allTags }: Props) {
  return (
    <Layout>
      <Head>
        <title>{tag} Articles — Manohar's GenAI Lab</title>
        <meta name="description" content={`All articles tagged with "${tag}" on Manohar's GenAI Lab.`} />
      </Head>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Header */}
        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm no-underline mb-6 block transition-colors duration-200"
            style={{ color: '#8ab4d4' }}
          >
            ← All Posts
          </Link>

          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-5"
            style={{
              background: 'rgba(0,212,255,0.1)',
              border: '1px solid rgba(0,212,255,0.3)',
              color: '#00d4ff',
            }}
          >
            🏷 {tag}
          </div>

          <h1
            className="font-black text-white mb-2"
            style={{ fontSize: 'clamp(2rem,5vw,3rem)', letterSpacing: '-1.5px' }}
          >
            Articles tagged{' '}
            <span style={{ color: '#00d4ff' }}>"{tag}"</span>
          </h1>
          <p style={{ color: '#8ab4d4' }}>
            {posts.length} article{posts.length !== 1 ? 's' : ''} found
          </p>
        </motion.div>

        {/* Posts grid */}
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-lg font-semibold mb-2" style={{ color: '#8ab4d4' }}>
              No articles with this tag yet
            </h3>
            <p className="mb-6" style={{ color: '#4a7a9b' }}>
              Check back soon — more content is on the way.
            </p>
            <Link href="/blog">
              <motion.button
                className="px-6 py-3 rounded-xl font-semibold text-sm cursor-pointer"
                style={{
                  background: 'transparent',
                  border: '1px solid #1f3a58',
                  color: '#e8f4ff',
                  fontFamily: 'Syne, sans-serif',
                }}
                whileHover={{ background: '#0d1e2e', borderColor: '#00d4ff' }}
              >
                Browse All Articles
              </motion.button>
            </Link>
          </div>
        ) : (
          <div
            className="grid gap-6"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))' }}
          >
            {posts.map((p, i) => (
              <PostCard key={p.slug} post={p} index={i} />
            ))}
          </div>
        )}

        {/* Related tags */}
        {allTags.length > 1 && (
          <div className="mt-16 pt-10" style={{ borderTop: '1px solid #1a3048' }}>
            <div
              className="text-xs tracking-widest uppercase font-semibold mb-5 flex items-center gap-2"
              style={{ color: '#4a7a9b' }}
            >
              <span
                className="inline-block w-6 h-px"
                style={{ background: '#4a7a9b' }}
              />
              Other Tags
            </div>
            <div className="flex flex-wrap gap-2">
              {allTags
                .filter((t) => t !== tag)
                .slice(0, 16)
                .map((t) => (
                  <Link
                    key={t}
                    href={`/blog/tag/${encodeURIComponent(t)}`}
                    className="text-xs font-medium px-4 py-2 rounded-full no-underline transition-all duration-200"
                    style={{
                      background: '#0d1e2e',
                      border: '1px solid #1a3048',
                      color: '#8ab4d4',
                    }}
                  >
                    {t}
                  </Link>
                ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const posts = await api.getPosts({ limit: 1000 })
    const tags = Array.from(new Set(posts.flatMap((p) => p.tags || [])))
    return {
      paths: tags.map((tag) => ({ params: { tag } })),
      fallback: 'blocking',
    }
  } catch {
    return { paths: [], fallback: 'blocking' }
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const tag = params?.tag as string

  try {
    const allPosts = await api.getPosts({ limit: 1000 })
    const posts = allPosts.filter((p) => (p.tags || []).includes(tag))
    const allTags = Array.from(new Set(allPosts.flatMap((p) => p.tags || [])))

    return {
      props: { tag, posts, allTags },
      revalidate: 60,
    }
  } catch {
    return { props: { tag, posts: [], allTags: [] }, revalidate: 30 }
  }
}
