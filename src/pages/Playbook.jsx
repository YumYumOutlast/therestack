import Navbar from '../components/Navbar'

const TEAL = '#00D4AA'
const SURFACE = '#1a1a24'
const BORDER = '#2a2a38'

const roadmap = [
  {
    step: 1,
    title: 'The Job Audit',
    desc: 'Track exactly where your hours go for one week. This becomes your evidence, your leverage, and your pitch.',
  },
  {
    step: 2,
    title: 'Build Custom Workflows',
    desc: 'Use your audit data to build workflows that solve your specific job\'s bottlenecks — not generic ones.',
  },
  {
    step: 3,
    title: 'Track Your Impact',
    desc: 'Document time saved, errors reduced, and revenue influenced. Numbers make the case your boss can\'t argue with.',
  },
  {
    step: 4,
    title: 'Present Your Value',
    desc: 'Use the presentation framework inside to walk your manager through exactly what you\'ve built and what it\'s worth.',
  },
  {
    step: 5,
    title: 'Make the Ask',
    desc: 'Script the conversation. Practice the objections. Know your number going in. This step is where people leave money on the table — you won\'t.',
  },
]

export default function Playbook() {
  return (
    <div style={{ backgroundColor: '#111118' }} className="min-h-screen text-white flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-20 pb-12 text-center">
        <span style={{ color: TEAL }} className="text-xs font-semibold tracking-widest uppercase">AI-Proof Playbook · $79</span>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mt-3 mb-5 tracking-tight leading-tight">
          You don't just want to save time. You want to get paid for it.
        </h1>
        <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto">
          This is the playbook for turning AI skills into a raise, a promotion, or a business. Start with the data.
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
            Set a 30-minute timer on your phone right now.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            That's your first time capture block. Start it today. The data from one real week is worth more than every framework in this guide. Start the timer. Then come back here.
          </p>
        </div>
      </section>

      {/* Your Roadmap */}
      <section className="max-w-3xl mx-auto px-6 mb-14 w-full">
        <h2 className="text-white text-2xl font-bold mb-2">Your Roadmap</h2>
        <p className="text-gray-400 text-sm mb-8">Five steps from where you are to where you want to be. Do them in order.</p>
        <div className="space-y-3">
          {roadmap.map((item) => (
            <div
              key={item.step}
              style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}` }}
              className="rounded-xl p-5 flex items-start gap-4"
            >
              <span
                style={{ backgroundColor: '#111118', color: TEAL, border: `1px solid ${TEAL}` }}
                className="text-sm font-bold w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5"
              >
                {item.step}
              </span>
              <div>
                <h3 className="text-white font-bold mb-1">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* The Promotion Math */}
      <section className="max-w-3xl mx-auto px-6 mb-14 w-full">
        <h2 className="text-white text-2xl font-bold mb-2">The Promotion Math</h2>
        <p className="text-gray-400 text-sm mb-8">Make the invisible visible. This is how you translate automation into a dollar amount.</p>
        <div
          style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}` }}
          className="rounded-2xl p-8"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center flex-wrap">
            <div className="flex flex-col items-center">
              <span className="text-gray-400 text-xs uppercase tracking-wider mb-2">Your hourly rate</span>
              <span style={{ color: TEAL }} className="text-3xl font-bold">$X</span>
            </div>
            <span className="text-gray-600 text-2xl font-light hidden sm:block">×</span>
            <span style={{ color: TEAL }} className="text-2xl font-light sm:hidden">×</span>
            <div className="flex flex-col items-center">
              <span className="text-gray-400 text-xs uppercase tracking-wider mb-2">Hours saved / month</span>
              <span style={{ color: TEAL }} className="text-3xl font-bold">Y hrs</span>
            </div>
            <span className="text-gray-600 text-2xl font-light hidden sm:block">=</span>
            <span style={{ color: TEAL }} className="text-2xl font-light sm:hidden">=</span>
            <div className="flex flex-col items-center">
              <span className="text-gray-400 text-xs uppercase tracking-wider mb-2">Your monthly value</span>
              <span className="text-white text-3xl font-bold">$X × Y</span>
            </div>
          </div>
          <div style={{ borderTop: `1px solid ${BORDER}` }} className="mt-8 pt-6">
            <p className="text-gray-400 text-sm text-center leading-relaxed">
              Example: $50/hr × 20 hours saved = <span className="text-white font-semibold">$1,000/month in value delivered</span>. That's your floor for the conversation.
            </p>
          </div>
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
            You have the skills. Now package them and sell them.
          </p>
          <a
            href="https://getfluxe.gumroad.com/l/AutomationConsultant"
            target="_blank"
            rel="noopener noreferrer"
            style={{ backgroundColor: TEAL, color: '#111118' }}
            className="inline-block px-8 py-3.5 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity no-underline"
          >
            Unlock the Operator Kit — $149
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
