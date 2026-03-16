import Head from 'next/head'
import { motion } from 'framer-motion'
import Layout from '../components/layout/Layout'

const EXPERIMENTS = [
  { n: '01', title: 'Token Efficiency in Chain-of-Thought Prompting', desc: 'Measuring how much token budget is actually needed for CoT to improve accuracy across different task types.', status: 'completed', date: 'Jan 2025' },
  { n: '02', title: 'Embedding Model Comparison Benchmark', desc: 'Side-by-side evaluation of OpenAI, Cohere, and open-source embedding models on domain-specific retrieval tasks.', status: 'completed', date: 'Jan 2025' },
  { n: '03', title: 'Context Window Utilization Study', desc: 'How effectively do different LLMs use information placed at different positions in a long context window.', status: 'in-progress', date: 'Feb 2025' },
  { n: '04', title: 'LoRA Rank vs Task Complexity', desc: 'Finding the optimal LoRA rank for different downstream tasks. Does rank 16 generalize better than rank 4?', status: 'completed', date: 'Feb 2025' },
  { n: '05', title: 'Agentic Loop Reliability Testing', desc: 'Stress testing multi-step agent workflows: where do they break and what guardrails are most effective?', status: 'in-progress', date: 'Mar 2025' },
  { n: '06', title: 'Semantic Chunking Strategies', desc: 'Comparing fixed-size, sentence boundary, semantic, and proposition-based chunking for RAG retrieval accuracy.', status: 'planned', date: 'Mar 2025' },
  { n: '07', title: 'Prompt Injection Defense Methods', desc: 'Evaluating effectiveness of different prompt injection defense strategies against adversarial user inputs.', status: 'planned', date: 'Apr 2025' },
  { n: '08', title: 'Small vs Large Model Routing', desc: 'Building an intelligent router that sends simple tasks to small fast models and complex ones to large models.', status: 'planned', date: 'Apr 2025' },
]

const STATUS_STYLES = {
  completed: { color: '#00ff9d', label: '✓ Completed' },
  'in-progress': { color: '#ff8c42', label: '⟳ In Progress' },
  planned: { color: '#4a7a9b', label: '◦ Planned' },
}

export default function Experiments() {
  return (
    <Layout>
      <Head>
        <title>Experiments — Manohar's GenAI Lab</title>
        <meta name="description" content="AI research experiments and mini-studies on LLMs, prompting, and GenAI systems." />
      </Head>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <motion.div className="mb-14" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-xs tracking-widest uppercase font-semibold mb-3 flex items-center gap-2" style={{ color: '#00d4ff' }}>
            <span className="inline-block w-6 h-px" style={{ background: '#00d4ff' }} />
            Experiments
          </div>
          <h1 className="font-black text-white mb-2" style={{ fontSize: 'clamp(2rem,5vw,3rem)', letterSpacing: '-1.5px' }}>
            Research <span style={{ color: '#00d4ff' }}>Lab</span>
          </h1>
          <p style={{ color: '#8ab4d4' }}>Micro-studies and benchmarks exploring the edges of AI capabilities.</p>
        </motion.div>

        <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {EXPERIMENTS.map((e, i) => {
            const s = STATUS_STYLES[e.status as keyof typeof STATUS_STYLES]
            return (
              <motion.div
                key={e.n}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ y: -3 }}
                className="rounded-2xl p-7 relative overflow-hidden transition-all duration-300 cursor-pointer"
                style={{ background: '#0d1e2e', border: '1px solid #1a3048' }}
              >
                <div className="font-black mb-2 select-none" style={{ fontSize: '3rem', color: '#1a3048', letterSpacing: '-2px' }}>{e.n}</div>
                <h3 className="font-bold text-white mb-2 leading-snug" style={{ fontSize: '1rem' }}>{e.title}</h3>
                <p className="text-sm leading-relaxed mb-5" style={{ color: '#8ab4d4' }}>{e.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold" style={{ color: s.color }}>{s.label}</span>
                  <span className="text-xs" style={{ color: '#4a7a9b' }}>{e.date}</span>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </Layout>
  )
}
