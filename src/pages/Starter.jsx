import Navbar from '../components/Navbar'

const TEAL = '#00D4AA'
const SURFACE = '#1a1a24'
const BORDER = '#2a2a38'

const departments = [
  {
    name: 'Client Management',
    workflows: '3 workflows',
    desc: 'Eliminate manual follow-ups, late check-ins, and dropped handoffs — your clients always know what\'s next.',
  },
  {
    name: 'Finance',
    workflows: '3 workflows',
    desc: 'Stop chasing invoices and reconciling spreadsheets. Your books stay clean without you touching them.',
  },
  {
    name: 'Marketing',
    workflows: '3 workflows',
    desc: 'One talking point becomes a week of content. Build the content machine that runs while you sleep.',
  },
  {
    name: 'HR',
    workflows: '3 workflows',
    desc: 'Automate candidate screening, offer flows, and onboarding tasks so your team hits the ground running.',
  },
  {
    name: 'Projects',
    workflows: '3 workflows',
    desc: 'Never miss a deadline or status update again. Automated reports keep every project visible.',
  },
]

const prompts = [
  {
    label: 'CRM Follow-Up',
    prompt: 'You are a professional relationship manager. Based on this client interaction summary: [paste summary], write a warm, specific follow-up email that references what was discussed and proposes a clear next step. Keep it under 150 words.',
  },
  {
    label: 'Invoice Extraction',
    prompt: 'Extract the following from this invoice: vendor name, invoice number, due date, line items with amounts, and total. Return as a clean JSON object. Invoice text: [paste invoice]',
  },
  {
    label: 'Social Post from Talking Point',
    prompt: 'Turn this talking point into 3 LinkedIn posts — one that leads with a bold claim, one that leads with a question, one that leads with a short story. Talking point: [paste talking point]. Each post should be under 200 words and end with a clear call to action.',
  },
]

export default function Starter() {
  return (
    <div style={{ backgroundColor: '#111118' }} className="min-h-screen text-white flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-20 pb-12 text-center">
        <span style={{ color: TEAL }} className="text-xs font-semibold tracking-widest uppercase">Starter Kit · $27</span>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mt-3 mb-5 tracking-tight leading-tight">
          15 workflows. 5 departments. Start with one.
        </h1>
        <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto">
          You don't need to set everything up today. You need one workflow running by tonight.
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
            Pick the department eating the most of your week.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            Go straight to that section. Set up Workflow 1 from that section today. Don't move on until it's running.
          </p>
        </div>
      </section>

      {/* Departments */}
      <section className="max-w-3xl mx-auto px-6 mb-14 w-full">
        <h2 className="text-white text-2xl font-bold mb-2">Your 5 Departments</h2>
        <p className="text-gray-400 text-sm mb-8">3 workflows per department. 15 total. Each one saves real hours.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {departments.map((dept) => (
            <div
              key={dept.name}
              style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}` }}
              className="rounded-xl p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-bold text-base">{dept.name}</h3>
                <span
                  style={{ color: TEAL, backgroundColor: `${TEAL}15`, border: `1px solid ${TEAL}35` }}
                  className="text-xs font-semibold px-2 py-1 rounded-full"
                >
                  {dept.workflows}
                </span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">{dept.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Prompt Library */}
      <section className="max-w-3xl mx-auto px-6 mb-14 w-full">
        <h2 className="text-white text-2xl font-bold mb-2">Prompt Library</h2>
        <p className="text-gray-400 text-sm mb-8">Copy these. Use them today. Swap in your details where you see brackets.</p>
        <div className="space-y-4">
          {prompts.map((item) => (
            <div
              key={item.label}
              style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}` }}
              className="rounded-xl p-5"
            >
              <p style={{ color: TEAL }} className="text-xs font-semibold tracking-wider uppercase mb-3">{item.label}</p>
              <p
                style={{ backgroundColor: '#111118', border: `1px solid ${BORDER}` }}
                className="text-gray-300 text-sm leading-relaxed font-mono rounded-lg p-4 whitespace-pre-wrap"
              >
                {item.prompt}
              </p>
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
            You're saving time. Now learn to build your own workflows and turn that into a promotion or a business.
          </p>
          <a
            href="https://getfluxe.gumroad.com/l/AIProofPlaybook"
            target="_blank"
            rel="noopener noreferrer"
            style={{ backgroundColor: TEAL, color: '#111118' }}
            className="inline-block px-8 py-3.5 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity no-underline"
          >
            Unlock the Playbook — $79
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
