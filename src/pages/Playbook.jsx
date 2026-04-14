import Navbar from '../components/Navbar'

const TEAL = '#00D4AA'
const SURFACE = '#1a1a24'
const BORDER = '#2a2a38'

const modules = [
  { title: 'Part 1: The AI-Proof Identity', desc: 'Position yourself as the operator, not the output. Build the personal brand that compounds.' },
  { title: 'Part 2: Compound Skill Stacking', desc: 'Layer skills so each one multiplies the value of the last.' },
  { title: 'Part 3: Building in Public', desc: 'Document your stack publicly. Attract opportunities you can\'t create by staying silent.' },
  { title: 'Part 4: Monetization Frameworks', desc: 'Turn your stack into income — consulting, productized services, and digital products.' },
  { title: 'Part 5: The Long Game', desc: 'How to stay relevant as AI evolves. Build the skill that can\'t be replaced: judgment.' },
]

export default function Playbook() {
  return (
    <div style={{ backgroundColor: '#111118' }} className="min-h-screen text-white">
      <Navbar />

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-20 pb-12 text-center">
        <span style={{ color: TEAL }} className="text-xs font-semibold tracking-widest uppercase">AI-Proof Playbook · $79</span>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mt-3 mb-4 tracking-tight">
          Welcome to The Restack
        </h1>
        <p className="text-gray-400 text-lg leading-relaxed">
          The strategies that compound over time. This is how you make yourself irreplaceable in an AI-first world.
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
            Write your "AI-Proof Statement" before Module 1.
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            In 2-3 sentences, describe what you do that no AI can fully replace. Don't overthink it — write what's true right now. You'll refine it by the end of Part 1.
          </p>
        </div>
      </section>

      {/* Curriculum */}
      <section className="max-w-3xl mx-auto px-6 pb-24">
        <h2 className="text-white text-2xl font-bold mb-8">Playbook Curriculum</h2>
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
          <p className="text-gray-500 text-sm">Full content unlocking week by week. Stay tuned.</p>
        </div>
      </section>
    </div>
  )
}
