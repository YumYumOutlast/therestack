import Navbar from '../components/Navbar'

const TEAL = '#00D4AA'
const SURFACE = '#1a1a24'
const BORDER = '#2a2a38'

const modules = [
  { title: 'Sprint 1: Productize Your Stack', desc: 'Package your skills into a service. Price it. Position it. Sell it.' },
  { title: 'Sprint 2: Client Acquisition System', desc: 'Build an outbound machine that runs on AI and brings in qualified leads while you sleep.' },
  { title: 'Sprint 3: Delivery at Scale', desc: 'Serve more clients without adding hours. Systems over sweat.' },
  { title: 'Sprint 4: Consulting Retainer Model', desc: 'Move from one-off projects to recurring revenue with retainer-based automation consulting.' },
  { title: 'Sprint 5: Case Studies & Social Proof', desc: 'Document your results. Build a portfolio that sells for you.' },
  { title: 'Sprint 6: $10K Month Blueprint', desc: 'The exact plan to hit your first $10K month as an automation consultant.' },
]

export default function Operator() {
  return (
    <div style={{ backgroundColor: '#111118' }} className="min-h-screen text-white">
      <Navbar />

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-20 pb-12 text-center">
        <span style={{ color: TEAL }} className="text-xs font-semibold tracking-widest uppercase">Automation Consultant Kit · $149</span>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mt-3 mb-4 tracking-tight">
          Welcome to The Restack
        </h1>
        <p className="text-gray-400 text-lg leading-relaxed">
          You're not here to learn AI. You're here to deploy it. This kit turns your stack into a business.
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
            Define your ideal client before Sprint 1.
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Write down the exact type of business or person you want to serve as an automation consultant. Industry, size, pain point. The more specific you are now, the faster you'll close your first client.
          </p>
        </div>
      </section>

      {/* Stats bar */}
      <section className="max-w-3xl mx-auto px-6 mb-16">
        <div className="grid grid-cols-3 gap-4 text-center">
          {[
            { value: '6', label: 'Sprints' },
            { value: '$10K', label: 'Target / Month' },
            { value: '90 days', label: 'To First Client' },
          ].map((stat) => (
            <div key={stat.label} style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}` }} className="rounded-xl p-4">
              <div style={{ color: TEAL }} className="text-2xl font-bold mb-1">{stat.value}</div>
              <div className="text-gray-400 text-xs">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Curriculum */}
      <section className="max-w-3xl mx-auto px-6 pb-24">
        <h2 className="text-white text-2xl font-bold mb-8">Operator Curriculum</h2>
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
          <p className="text-gray-500 text-sm">Full sprint content being finalized. You're on the early-access list.</p>
        </div>
      </section>
    </div>
  )
}
