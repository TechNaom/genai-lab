import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/*
          Tixly uses a tight, confident grotesque — closest free match is
          Plus Jakarta Sans (800/700) for display + Inter (400/500) for body.
          Plus Jakarta Sans has that same chunky-but-refined quality.
        */}
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#050a0f" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
