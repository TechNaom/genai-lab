import Head from 'next/head'
import { motion } from 'framer-motion'
import Layout from '../components/layout/Layout'

const PROJECTS = [
  {
    icon: '🤖', title: 'Enterprise AI Workflow Automation', status: 'live',
    desc: 'End-to-end automation platform that integrates LLMs into existing enterprise workflows. Handles document processing, decision routing, and human-in-the-loop validation.',
    stack: ['LangChain', 'FastAPI', 'GPT-4', 'Redis'],
    accent: '#00d4ff',
  },
  {
    icon: '✍️', title: 'Prompt Engineering Framework', status: 'live',
    desc: 'Systematic framework for designing, testing, and versioning prompts at scale. Includes evaluation harness, A/B testing, and regression detection.',
    stack: ['Python', 'OpenAI', 'Anthropic', 'SQLite'],
    accent: '#a78bfa',
  },
  {
    icon: '🧠', title: 'Mini-LLM Training Pipeline', status: 'beta',
    desc: 'Complete pipeline for fine-tuning 7B parameter models on domain-specific data using QLoRA. Supports Mistral, LLaMA, and Phi architectures.',
    stack: ['PyTorch', 'HuggingFace', 'QLoRA', 'PEFT'],
    accent: '#00ff9d',
  },
  {
    icon: '🔍', title: 'RAG Systems Toolkit', status: 'live',
    desc: 'Production-ready RAG toolkit with semantic chunking, hybrid search, re-ranking, and automated evaluation. Plug-and-play with multiple vector stores.',
    stack: ['LangChain', 'Pinecone', 'Chroma', 'FastAPI'],
    accent: '#ff8c42',
  },
  {
    icon: '🌐', title: 'Multi-Agent Research System', status: 'beta',
    desc: 'Experimental multi-agent framework where specialized AI agents collaborate to conduct research, fact-check, and synthesize information.',
    stack: ['CrewAI', 'Tavily', 'GPT-4o', 'FastAPI'],
    accent: '#ff4d6d',
  },
  {
    icon: '📊', title: 'LLM Evaluation Dashboard', status: 'live',
    desc: 'Comprehensive evaluation suite for measuring LLM performance across accuracy, faithfulness, relevance, and latency metrics.',
    stack: ['Streamlit', 'RAGAS', 'LangSmith', 'Python'],
    accent: '#ffd700',
  },
]

export default function Projects() {
  return (
    <Layout>
      <Head>
        <title>Projects — Manohar's GenAI Lab</title>
        <meta name="description" content="AI automation projects and experiments by Manohar Papasani." />
      </Head>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <motion.div className="mb-14" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-xs tracking-widest uppercase font-semibold mb-3 flex items-center gap-2" style={{ color: '#00d4ff' }}>
            <span className="inline-block w-6 h-px" style={{ background: '#00d4ff' }} />
            Projects
          </div>
          <h1 className="font-black text-white mb-2" style={{ fontSize: 'clamp(2rem,5vw,3rem)', letterSpacing: '-1.5px' }}>
            AI Systems <span style={{ color: '#00d4ff' }}>Built</span>
          </h1>
          <p style={{ color: '#8ab4d4' }}>Production systems and open tools for the AI engineering community.</p>
        </motion.div>

        <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))' }}>
          {PROJECTS.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="rounded-2xl p-8 relative overflow-hidden transition-all duration-300 cursor-pointer"
              style={{ background: '#0d1e2e', border: '1px solid #1a3048' }}
            >
              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, ${p.accent}, #a78bfa)` }} />

              {/* Status badge */}
              <span
                className="absolute top-6 right-6 text-xs font-bold px-3 py-1 rounded-full tracking-wide"
                style={{
                  background: p.status === 'live' ? 'rgba(0,255,157,0.1)' : 'rgba(255,140,66,0.1)',
                  color: p.status === 'live' ? '#00ff9d' : '#ff8c42',
                  border: `1px solid ${p.status === 'live' ? 'rgba(0,255,157,0.2)' : 'rgba(255,140,66,0.2)'}`,
                }}
              >
                {p.status}
              </span>

              <div className="text-4xl mb-5">{p.icon}</div>
              <h3 className="font-bold text-white mb-3" style={{ fontSize: '1.1rem', letterSpacing: '-0.3px' }}>{p.title}</h3>
              <p className="text-sm leading-relaxed mb-5" style={{ color: '#8ab4d4' }}>{p.desc}</p>
              <div className="flex flex-wrap gap-2">
                {p.stack.map((s) => (
                  <span key={s} className="text-xs px-2.5 py-1 rounded-md font-mono" style={{ background: '#112436', color: '#4a7a9b' }}>{s}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  )
}
