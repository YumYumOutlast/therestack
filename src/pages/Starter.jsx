import Navbar from '../components/Navbar'

const TEAL = '#00D4AA'
const SURFACE = '#1a1a24'
const BORDER = '#2a2a38'

const modules = [
  { title: 'Week 1: Stack Architecture', desc: 'Design your personal AI stack from scratch — tools, triggers, outputs.' },
  { title: 'Week 2: Content Engine', desc: 'Build a system that produces a week of content in 90 minutes.' },
  { title: 'Week 3: Outreach Automation', desc: 'Set up AI-assisted outreach that doesn\'t feel robotic.' },
  { title: 'Week 4: ROI Tracking', desc: 'Measure what\'s working. Cut what\'s not. Double what does.' },
]

export default function Starter() {
  return (
    <div style={{ backgroundColor: '#111118' }} className="min-h-screen text-white">
      <Navbar />

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-20 pb-12 text-center">
        <span style={{ color: TEAL }} className="text-xs font-semibold tracking-widest uppercase">Starter Kit · $27</span>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mt-3 mb-4 tracking-tight">
          Welcome to The Restack
        </h1>
        <p className="text-gray-400 text-lg leading-relaxed">
          Your first real AI stack, built step by step. Four weeks, four systems, one serious upgrade.
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
            Map your current stack before touching anything.
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Open a doc and write out every tool you use daily. Then mark which ones have AI features you haven't turned on yet. That gap is where you'll start.
          </p>
        </div>
      </section>

      {/* Curriculum */}
      <section className="max-w-3xl mx-auto px-6 pb-24">
        <h2 className="text-white text-2xl font-bold mb-8">Starter Curriculum</h2>
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
          <p className="text-gray-500 text-sm">Full lesson content coming soon. You'll be first to access it.</p>
        </div>
      </section>
    </div>
  )
}
