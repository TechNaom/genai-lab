import Head from 'next/head'
import { motion } from 'framer-motion'
import Layout from '../components/layout/Layout'

const SKILLS = [
  { name: 'Prompt Engineering', sub: 'Advanced LLM prompting' },
  { name: 'LLM Systems', sub: 'End-to-end pipelines' },
  { name: 'RAG Architecture', sub: 'Retrieval-augmented Gen' },
  { name: 'AI Automation', sub: 'Enterprise workflows' },
  { name: 'Mini-LLMs', sub: 'Domain-specific models' },
  { name: 'Embeddings', sub: 'Vector search & stores' },
  { name: 'Fine-tuning', sub: 'QLoRA, LoRA, PEFT' },
  { name: 'AI Agents', sub: 'Multi-step automation' },
]

const TIMELINE = [
  { icon: '🎯', year: 'Present', title: 'GenAI Automation Lead & Mentor', desc: 'Leading AI automation initiatives and mentoring teams on LLM best practices and production AI systems.' },
  { icon: '🔬', year: 'Research', title: 'Mini-LLM Experiments', desc: 'Building domain-specific lightweight language models for enterprise use cases with QLoRA fine-tuning.' },
  { icon: '🏗️', year: 'Systems', title: 'RAG & AI Architecture', desc: 'Designing end-to-end retrieval-augmented generation systems and AI infrastructure at scale.' },
  { icon: '🚀', year: 'Foundation', title: 'AI Systems Engineering', desc: 'Deep expertise in ML pipelines, embeddings, vector databases, and AI infrastructure.' },
]

export default function About() {
  return (
    <Layout>
      <Head>
        <title>About — Manohar Papasani</title>
        <meta name="description" content="Manohar Papasani is a GenAI Automation Lead and Mentor building intelligent AI systems." />
      </Head>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <motion.div className="mb-14" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-xs tracking-widest uppercase font-semibold mb-3 flex items-center gap-2" style={{ color: '#00d4ff' }}>
            <span className="inline-block w-6 h-px" style={{ background: '#00d4ff' }} />
            About
          </div>
          <h1 className="font-black text-white" style={{ fontSize: 'clamp(2rem,5vw,3rem)', letterSpacing: '-1.5px' }}>
            Manohar <span style={{ color: '#00d4ff' }}>Papasani</span>
          </h1>
        </motion.div>

        <div className="grid gap-16 lg:grid-cols-2">
          {/* Left: Avatar + skills */}
          <motion.div
            className="flex flex-col gap-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* Avatar */}
            <div
              className="rounded-3xl flex items-center justify-center relative overflow-hidden"
              style={{ background: '#0d1e2e', border: '1px solid #1a3048', aspectRatio: '1', maxWidth: '360px' }}
            >
              <div className="absolute inset-0 hero-grid opacity-50" />
              <div
                className="relative font-black select-none"
                style={{
                  fontSize: '6rem',
                  background: 'linear-gradient(135deg, #00d4ff, #a78bfa)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-4px',
                }}
              >
                MP
              </div>
            </div>

            {/* Skills grid */}
            <div className="grid grid-cols-2 gap-3">
              {SKILLS.map((s) => (
                <div
                  key={s.name}
                  className="rounded-xl p-4"
                  style={{ background: '#112436', border: '1px solid #1a3048' }}
                >
                  <div className="font-bold text-xs text-white mb-1">{s.name}</div>
                  <div className="text-xs" style={{ color: '#4a7a9b' }}>{s.sub}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Bio + timeline */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="font-bold text-white mb-5" style={{ fontSize: '1.5rem', letterSpacing: '-0.3px' }}>
              Building the Future of AI
            </h2>
            <div className="text-base leading-loose mb-6" style={{ color: '#8ab4d4' }}>
              <p className="mb-4">
                Manohar Papasani is a GenAI Automation Lead and Mentor who builds intelligent systems
                that transform AI ideas into real-world software.
              </p>
              <p className="mb-4">
                His work focuses on prompt engineering, end-to-end automation, LLM systems, embeddings,
                and building lightweight domain-specific mini-LLMs designed for practical enterprise applications.
              </p>
              <p className="mb-4">
                With a passion for bridging the gap between cutting-edge research and production systems,
                Manohar mentors teams and individuals on navigating the rapidly evolving AI landscape.
              </p>
            </div>

            {/* Timeline */}
            <div className="mt-6">
              {TIMELINE.map((t, i) => (
                <div key={t.title} className="flex gap-4 pb-8 relative">
                  {i < TIMELINE.length - 1 && (
                    <div className="absolute left-5 top-10 bottom-0 w-px" style={{ background: '#1a3048' }} />
                  )}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background: '#112436', border: '2px solid #1f3a58' }}
                  >
                    {t.icon}
                  </div>
                  <div className="pt-2">
                    <div className="text-xs font-semibold tracking-wide uppercase mb-1" style={{ color: '#00d4ff' }}>{t.year}</div>
                    <div className="font-semibold text-sm text-white mb-1">{t.title}</div>
                    <div className="text-sm leading-relaxed" style={{ color: '#4a7a9b' }}>{t.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  )
}
