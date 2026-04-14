import Navbar from '../components/Navbar'

const TEAL = '#00D4AA'
const SURFACE = '#1a1a24'
const BORDER = '#2a2a38'

const categories = [
  {
    name: 'Client Management',
    desc: 'Automate follow-ups, onboarding, and status updates so no client falls through the cracks.',
  },
  {
    name: 'Finance',
    desc: 'Streamline invoicing, expense tracking, and monthly close so the numbers run themselves.',
  },
  {
    name: 'Marketing',
    desc: 'Turn one idea into a week of content across every channel without touching it twice.',
  },
  {
    name: 'HR',
    desc: 'Automate hiring pipelines, onboarding tasks, and team check-ins at scale.',
  },
  {
    name: 'Projects',
    desc: 'Keep every project on track with automated status reports, blockers, and next steps.',
  },
]

export default function Free() {
  return (
    <div style={{ backgroundColor: '#111118' }} className="min-h-screen text-white flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-20 pb-12 text-center">
        <span style={{ color: TEAL }} className="text-xs font-semibold tracking-widest uppercase">Free Tier</span>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mt-3 mb-5 tracking-tight leading-tight">
          You're in. Now do one thing.
        </h1>
        <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto">
          Don't read the whole guide. Open Workflow 1 and set it up before you close this tab. Ten minutes. You'll feel it by tomorrow morning.
        </p>
      </section>

      {/* Your First Move */}
      <section className="max-w-3xl mx-auto px-6 mb-14 w-full">
        <div
          style={{ backgroundColor: SURFACE, borderLeft: `4px solid ${TEAL}` }}
          className="rounded-xl p-6"
        >
          <p style={{ color: TEAL }} className="text-xs font-semibold tracking-widest uppercase mb-2">Your First Move</p>
          <h2 className="text-white text-xl font-bold mb-3">
            Open your FlowState guide right now.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            Go directly to Workflow 1. Set it up today. One workflow changes your week.
          </p>
        </div>
      </section>

      {/* What You Have Access To */}
      <section className="max-w-3xl mx-auto px-6 mb-14 w-full">
        <h2 className="text-white text-2xl font-bold mb-2">What You Have Access To</h2>
        <p className="text-gray-400 text-sm mb-8">Five workflow categories. Real systems. Yours now.</p>
        <div className="space-y-3">
          {categories.map((cat) => (
            <div
              key={cat.name}
              style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}` }}
              className="rounded-xl px-5 py-4 flex items-start gap-4"
            >
              <div
                style={{ backgroundColor: `${TEAL}18`, border: `1px solid ${TEAL}40` }}
                className="w-2 h-2 rounded-full mt-2 shrink-0"
              />
              <div>
                <h3 className="text-white font-semibold mb-1">{cat.name}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{cat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Ready for More */}
      <section className="max-w-3xl mx-auto px-6 pb-24 w-full">
        <div
          style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}` }}
          className="rounded-2xl p-8 text-center"
        >
          <h2 className="text-white text-2xl font-bold mb-3">Ready for More?</h2>
          <p className="text-gray-400 text-base mb-7 max-w-md mx-auto leading-relaxed">
            The Starter Kit gives you 15 workflows across all 5 departments plus a prompt library you can use immediately.
          </p>
          <a
            href="https://getfluxe.gumroad.com/l/FlowStateStarterKit"
            target="_blank"
            rel="noopener noreferrer"
            style={{ backgroundColor: TEAL, color: '#111118' }}
            className="inline-block px-8 py-3.5 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity no-underline"
          >
            Unlock the Starter Kit — $27
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${BORDER}` }} className="py-8 text-center mt-auto">
        <p className="text-gray-500 text-sm">© 2026 The Restack. Built for the ones who didn't wait.</p>
      </footer>
    </div>
  )
}
