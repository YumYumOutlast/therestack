import Navbar from '../components/Navbar'

const TEAL = '#00D4AA'
const SURFACE = '#1a1a24'
const BORDER = '#2a2a38'

const arsenal = [
  {
    title: 'The 20 Services',
    desc: 'A menu of done-for-you automation services you can offer immediately, with pricing ranges for each.',
  },
  {
    title: 'Three Service Models',
    desc: 'One-time builds, retainers, and audits. Know which to pitch, when, and at what price point.',
  },
  {
    title: 'Scoping Checklist',
    desc: 'Never get caught off-guard by scope creep again. This checklist closes gaps before the contract is signed.',
  },
  {
    title: 'Client Acquisition Playbook',
    desc: 'Warm outreach sequences, DM scripts, and referral frameworks that bring in clients without cold calling.',
  },
  {
    title: 'Delivery System',
    desc: 'Your client onboarding, project management, and handoff process — documented and ready to hand off.',
  },
  {
    title: 'Templates Bundle',
    desc: 'Contracts, proposals, invoices, and SOW templates. Professional from day one, no lawyer required.',
  },
]

const mathRows = [
  { label: '2 Tier 1 projects / month', value: '$2,000' },
  { label: '4 Tier 1 projects / month', value: '$4,000' },
  { label: '3 retainer clients @ $1,000/mo', value: '$3,000 recurring' },
  { label: 'Mature practice', value: '$5,500–12,000/mo' },
]

export default function Operator() {
  return (
    <div style={{ backgroundColor: '#111118' }} className="min-h-screen text-white flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-20 pb-12 text-center">
        <span style={{ color: TEAL }} className="text-xs font-semibold tracking-widest uppercase">Automation Consultant Kit · $149</span>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mt-3 mb-5 tracking-tight leading-tight">
          You're an Operator now. Act like it.
        </h1>
        <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto">
          Everything you need to sign clients, deliver results, and build a consulting practice that runs on AI.
        </p>
      </section>

      {/* Start Here */}
      <section className="max-w-3xl mx-auto px-6 mb-14 w-full">
        <div
          style={{ backgroundColor: SURFACE, borderLeft: `4px solid ${TEAL}` }}
          className="rounded-xl p-6"
        >
          <p style={{ color: TEAL }} className="text-xs font-semibold tracking-widest uppercase mb-2">Start Here</p>
          <h2 className="text-white text-xl font-bold mb-3">
            Send the warm outreach message to 3 people before you finish reading this.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            Not after. Not when you feel ready. Three people, today. The rest only works if you have someone to sell to. Find the message on the Acquisition page and send it now.
          </p>
        </div>
      </section>

      {/* Your Arsenal */}
      <section className="max-w-3xl mx-auto px-6 mb-14 w-full">
        <h2 className="text-white text-2xl font-bold mb-2">Your Arsenal</h2>
        <p className="text-gray-400 text-sm mb-8">Six tools. Use all of them. Each one removes a reason clients don't buy.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {arsenal.map((item) => (
            <div
              key={item.title}
              style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}` }}
              className="rounded-xl p-5"
            >
              <div
                style={{ color: TEAL }}
                className="text-xs font-bold tracking-widest uppercase mb-2"
              >
                ▸
              </div>
              <h3 className="text-white font-bold mb-2">{item.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The Math */}
      <section className="max-w-3xl mx-auto px-6 mb-14 w-full">
        <h2 className="text-white text-2xl font-bold mb-2">The Math</h2>
        <p className="text-gray-400 text-sm mb-8">This is what a real practice looks like. These are not projections — they're the floor.</p>
        <div
          style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}` }}
          className="rounded-2xl overflow-hidden"
        >
          {mathRows.map((row, i) => (
            <div
              key={row.label}
              style={{
                borderBottom: i < mathRows.length - 1 ? `1px solid ${BORDER}` : 'none',
              }}
              className="flex items-center justify-between px-6 py-4 flex-wrap gap-2"
            >
              <span className="text-gray-300 text-sm">{row.label}</span>
              <span style={{ color: TEAL }} className="font-bold text-base">{row.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Discord / Community */}
      <section className="max-w-3xl mx-auto px-6 pb-24 w-full">
        <div
          style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}` }}
          className="rounded-2xl p-8 text-center"
        >
          <h2 className="text-white text-2xl font-bold mb-3">Join the Operator Lounge</h2>
          <p className="text-gray-400 text-base mb-7 max-w-lg mx-auto leading-relaxed">
            The Restack Discord is where Operators share wins, solve client problems, and refer each other work. This is where the community lives.
          </p>
          <a
            href="#"
            style={{ backgroundColor: TEAL, color: '#111118' }}
            className="inline-block px-8 py-3.5 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity no-underline"
          >
            Join The Restack Discord
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
