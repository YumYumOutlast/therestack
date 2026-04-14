import Navbar from '../components/Navbar'

const TEAL = '#00D4AA'
const SURFACE = '#1a1a24'
const BORDER = '#2a2a38'

const modules = [
  { title: 'Module 1: The AI Mindset Shift', desc: 'Understand how to think about AI as leverage, not a tool.' },
  { title: 'Module 2: Your First Automation', desc: 'Build a simple workflow that saves you 2 hours a week.' },
  { title: 'Module 3: Prompt Architecture 101', desc: 'Learn the anatomy of a prompt that actually works.' },
  { title: 'Module 4: Stack Your Skills', desc: 'Combine tools to create compound output.' },
]

export default function Free() {
  return (
    <div style={{ backgroundColor: '#111118' }} className="min-h-screen text-white">
      <Navbar />

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-20 pb-12 text-center">
        <span style={{ color: TEAL }} className="text-xs font-semibold tracking-widest uppercase">Free Tier</span>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mt-3 mb-4 tracking-tight">
          Welcome to The Restack
        </h1>
        <p className="text-gray-400 text-lg leading-relaxed">
          This is where it starts. No cost. No fluff. Just the foundation you need to build real leverage with AI.
        </p>
      </section>

      {/* Start Here */}
      <section className="max-w-3xl mx-auto px-6 mb-16">
        <div
          style={{ backgroundColor: SURFACE, borderLeft: `4px solid ${TEAL}` }}
          className="rounded-xl p-6"
        >
          <p style={{ color: TEAL }} className="text-xs font-semibold tracking-widest uppercase mb-2">Start Here</p>
          <h2 className="text-white text-xl font-bold mb-2">
            Complete your AI audit in the next 24 hours.
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            List every repetitive task you do in a week. Then highlight the top 3 that drain the most energy. That's your first automation target.
          </p>
        </div>
      </section>

      {/* Curriculum */}
      <section className="max-w-3xl mx-auto px-6 pb-24">
        <h2 className="text-white text-2xl font-bold mb-8">Free Curriculum</h2>
        <div className="space-y-4">
          {modules.map((mod, i) => (
            <div
              key={i}
              style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}` }}
              className="rounded-xl p-5 flex items-start gap-4"
            >
              <span
                style={{ backgroundColor: '#111118', color: TEAL, border: `1px solid ${TEAL}` }}
                className="text-xs font-bold w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
              >
                {i + 1}
              </span>
              <div>
                <h3 className="text-white font-semibold mb-1">{mod.title}</h3>
                <p className="text-gray-400 text-sm">{mod.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div
          style={{ backgroundColor: SURFACE, border: `1px dashed ${BORDER}` }}
          className="rounded-xl p-6 mt-6 text-center"
        >
          <p className="text-gray-500 text-sm">More modules dropping soon. You'll be notified.</p>
        </div>
      </section>
    </div>
  )
}
