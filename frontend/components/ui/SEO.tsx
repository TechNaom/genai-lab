import Head from 'next/head'

interface SEOProps {
  title?: string
  description?: string
  slug?: string
  image?: string
  type?: 'website' | 'article'
  publishedTime?: string
  tags?: string[]
  author?: string
}

const SITE_NAME = "Manohar's GenAI Lab"
const DEFAULT_DESCRIPTION =
  'GenAI Automation Lead & Mentor. Building intelligent systems through prompt engineering, automation, and modern AI frameworks.'
const DEFAULT_IMAGE = '/og-image.png'

export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  slug,
  image = DEFAULT_IMAGE,
  type = 'website',
  publishedTime,
  tags = [],
  author = 'Manohar Papasani',
}: SEOProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const fullTitle = title ? `${title} — ${SITE_NAME}` : SITE_NAME
  const canonicalUrl = slug ? `${siteUrl}/blog/${slug}` : siteUrl
  const ogImage = image.startsWith('http') ? image : `${siteUrl}${image}`

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_US" />

      {/* Article-specific OG */}
      {type === 'article' && (
        <>
          {publishedTime && (
            <meta property="article:published_time" content={publishedTime} />
          )}
          <meta property="article:author" content={author} />
          {tags.map((tag) => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:creator" content="@manohar_genai" />
      <meta name="twitter:site" content="@manohar_genai" />

      {/* RSS */}
      <link
        rel="alternate"
        type="application/rss+xml"
        title={`${SITE_NAME} RSS Feed`}
        href={`${siteUrl}/api/rss`}
      />

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    </Head>
  )
}
