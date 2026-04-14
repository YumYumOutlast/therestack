import Navbar from '../components/Navbar'

const BORDER = '#2a2a38'

export default function Playbook() {
  return (
    <div className="min-h-screen text-white flex flex-col" style={{ backgroundColor: '#111118' }}>
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 pt-16 pb-24 w-full flex-1">

        {/* Page header */}
        <div className="mb-10">
          <p className="text-teal-400 text-xs font-semibold tracking-widest uppercase mb-3">AI-Proof Playbook · $79</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight leading-tight mb-4">
            The AI-Proof Playbook
          </h1>
          <p className="text-zinc-400 text-lg">The Complete System for Becoming Your Company's AI Strategist</p>
        </div>

        {/* Welcome */}
        <div className="border-l-4 border-teal-400 bg-zinc-900 rounded-r-xl px-6 py-5 mb-14">
          <p className="text-zinc-300 text-sm leading-relaxed">
            You're not here to use AI. You're here to think in systems. This is the difference between someone who saves time and someone who gets promoted for it.
          </p>
        </div>

        {/* ═══════════════════════════════
            PART 1: THE JOB AUDIT
        ═══════════════════════════════ */}
        <h2 className="text-teal-400 font-bold text-xl mt-8 mb-3">Part 1: The Job Audit Framework</h2>

        {/* Step 1 */}
        <p className="text-white font-semibold mt-6 mb-2 text-base">Step 1 — The Time Capture Exercise</p>
        <p className="text-zinc-300 text-sm leading-relaxed mb-4">
          For one full work week, track every task in 30-minute blocks. Not categories — actual tasks, actual time.
        </p>

        <div className="bg-zinc-900 border border-zinc-700 rounded-lg px-5 py-5 mb-4">
          <p className="text-teal-400 text-xs font-bold tracking-widest uppercase mb-3">How to do it</p>
          <ol className="space-y-2.5">
            {[
              'Set a recurring 30-minute timer on your phone.',
              <>Every time it goes off, write down what you just spent 30 minutes doing.<br /><span className="text-teal-300 font-mono text-xs">Format: [Time] | [Task] | [Category]</span><br /><span className="text-zinc-500 text-xs">Example: 9:00-9:30 | Responded to 6 client emails | Communication</span></>,
              'Do this for 5 consecutive workdays. No estimating from memory.',
              <>At the end of the week, categorize every entry into:<br /><span className="text-zinc-400">COMMUNICATION · DOCUMENTATION · DATA WORK · MEETINGS · CREATIVE · ADMIN · DEEP WORK</span></>,
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-zinc-300 text-sm">
                <span className="text-teal-400 font-bold shrink-0">{i + 1}.</span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="bg-teal-500/5 border border-teal-500/30 rounded-lg px-5 py-4 mb-6">
          <p className="text-teal-400 text-xs font-bold tracking-widest uppercase mb-2">What you'll discover</p>
          <p className="text-zinc-300 text-sm leading-relaxed">Communication and Admin typically consume 40–50% of the work week. Deep Work gets less than 20%. The goal is to flip that ratio.</p>
        </div>

        {/* Step 2 */}
        <p className="text-white font-semibold mt-6 mb-2 text-base">Step 2 — Score Every Task on the Automation Spectrum</p>
        <p className="text-zinc-300 text-sm leading-relaxed mb-4">For every task in your log, assign a score 1–5:</p>

        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-zinc-700">
                <th className="text-teal-400 text-left py-2 pr-4 font-bold w-12">Score</th>
                <th className="text-teal-400 text-left py-2 pr-4 font-bold">Label</th>
                <th className="text-teal-400 text-left py-2 font-bold">Examples</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {[
                ['5', 'Fully Automatable', 'Email sorting, data entry, meeting transcription, invoice extraction'],
                ['4', 'Mostly Automatable', 'Email drafts, report generation, expense categorization'],
                ['3', 'AI-Assisted', 'Client proposals, complaint responses, performance reviews'],
                ['2', 'Human-Led, AI-Enhanced', 'Strategy docs, presentations, negotiation prep'],
                ['1', 'Human Only', 'Coaching, conflict resolution, leadership decisions'],
              ].map(([score, label, examples]) => (
                <tr key={score}>
                  <td className="py-2.5 pr-4 text-teal-400 font-bold">{score}</td>
                  <td className="py-2.5 pr-4 text-white font-semibold">{label}</td>
                  <td className="py-2.5 text-zinc-400">{examples}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-white font-semibold mt-4 mb-2">Build Your Scoring Spreadsheet</p>
        <pre className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 font-mono text-sm text-teal-300 whitespace-pre-wrap overflow-x-auto mb-3">{`Columns: Task | Category | Hours/Week | Automation Score (1-5) | Potential Tool | Priority`}</pre>
        <div className="bg-zinc-900 border border-zinc-700 rounded-lg px-5 py-4 mb-6">
          <p className="text-teal-400 text-xs font-bold tracking-widest uppercase mb-2">The Priority Formula</p>
          <p className="text-white font-mono text-sm">Priority Score = Automation Score × Hours Per Week</p>
          <p className="text-zinc-400 text-xs mt-1">Higher score = build this automation first.</p>
        </div>

        {/* Step 3 */}
        <p className="text-white font-semibold mt-6 mb-2 text-base">Step 3 — Build Your Automation Roadmap</p>
        <div className="space-y-3 mb-4">
          {[
            { wave: 'Wave 1 (Week 1–2)', label: 'Quick Wins', desc: 'Pick top 3–5 tasks that score 4–5 AND take less than 30 min to automate.' },
            { wave: 'Wave 2 (Week 2–3)', label: 'High-Impact Builds', desc: 'Top 3 tasks that score 3–4 AND take the most hours/week. 30–60 min each to build.' },
            { wave: 'Wave 3 (Week 3–4)', label: 'System Integration', desc: 'Connect individual automations. When automations talk to each other, savings compound exponentially.' },
          ].map((w) => (
            <div key={w.wave} className="bg-zinc-900 border border-zinc-700 rounded-lg px-5 py-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-teal-400 font-bold text-sm">{w.wave}:</span>
                <span className="text-white font-semibold text-sm">{w.label}</span>
              </div>
              <p className="text-zinc-300 text-sm">{w.desc}</p>
            </div>
          ))}
        </div>
        <div className="bg-zinc-900 border border-zinc-700 rounded-lg px-5 py-4 mb-8">
          <p className="text-teal-400 text-xs font-bold tracking-widest uppercase mb-2">Important</p>
          <p className="text-zinc-300 text-sm leading-relaxed">Document everything as you build. Your documentation becomes career leverage.</p>
        </div>

        {/* ═══════════════════════════════
            PART 2: CUSTOM WORKFLOWS
        ═══════════════════════════════ */}
        <h2 className="text-teal-400 font-bold text-xl mt-12 mb-3">Part 2: Building Custom Workflows from Scratch</h2>

        <p className="text-white font-semibold mt-6 mb-3 text-base">The Anatomy of a Perfect Prompt</p>
        <p className="text-zinc-300 text-sm leading-relaxed mb-4">5 components. Miss any one and output degrades.</p>
        <div className="space-y-2 mb-5">
          {[
            ['ROLE', 'Tell AI who it is.', 'Weak: "Write me an email." Strong: "You are a senior account manager at a B2B services company."'],
            ['CONTEXT', 'Give AI all relevant background.', 'Include company, client, situation, history — whatever shapes the output.'],
            ['TASK', 'Be specific about what you want done.', 'Not "write a summary" — "write a 3-sentence summary structured as: situation, complication, resolution."'],
            ['CONSTRAINTS', 'Length, tone, format, exclusions.', '"Under 150 words. Professional tone. No buzzwords. No bullet points."'],
            ['OUTPUT FORMAT', 'Show AI what the result should look like.', 'Paste an example, or describe it explicitly.'],
          ].map(([comp, def, example]) => (
            <div key={comp} className="bg-zinc-900 border border-zinc-700 rounded-lg px-5 py-4">
              <p className="text-teal-400 text-xs font-bold tracking-widest uppercase mb-1">{comp}</p>
              <p className="text-white text-sm font-semibold mb-0.5">{def}</p>
              <p className="text-zinc-400 text-xs">{example}</p>
            </div>
          ))}
        </div>

        <p className="text-white font-semibold mt-4 mb-2">The Master Prompt Template</p>
        <pre className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 font-mono text-sm text-teal-300 whitespace-pre-wrap overflow-x-auto mb-8">{`"You are a [ROLE]. [CONTEXT about the situation]. [SPECIFIC TASK you want completed]. [CONSTRAINTS on length, tone, format, exclusions]. Structure the output as: [OUTPUT FORMAT]."`}</pre>

        <p className="text-white font-semibold mt-6 mb-3 text-base">Prompt Chaining: When One Prompt Isn't Enough</p>
        <p className="text-zinc-300 text-sm leading-relaxed mb-4">Example — Raw client feedback → Strategy document:</p>
        <pre className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 font-mono text-sm text-teal-300 whitespace-pre-wrap overflow-x-auto mb-4">{`PROMPT 1 (Extract):
"Here are raw notes from 5 client feedback calls:
[paste notes]
Extract and organize into:
1. Common themes (mentioned by 2+ clients)
2. Unique concerns (mentioned by 1 client)
3. Specific feature requests
4. Sentiment per client"

PROMPT 2 (Analyze):
"Based on this organized feedback:
[paste Prompt 1 output]
Identify:
1. Top 3 issues by frequency and severity
2. Quick fixes vs. structural problems
3. Contradictions between clients
4. The one change that improves satisfaction most"

PROMPT 3 (Deliver):
"Based on this analysis:
[paste Prompt 2 output]
Write a Client Feedback Strategy Brief for leadership. Include:
1. Executive summary (one paragraph)
2. Priority matrix (top issues by impact and effort)
3. Recommended actions for next quarter
4. Risks if we don't act
Tone: data-driven, concise, suitable for a VP audience."`}</pre>

        <p className="text-white font-semibold mt-4 mb-2">Use Prompt Chaining When:</p>
        <ul className="space-y-1 mb-4">
          {['The task has multiple distinct phases', 'Input data is messy', 'You need different perspectives at different stages', 'Single prompt is getting mediocre results'].map((item) => (
            <li key={item} className="flex items-start gap-2 text-zinc-300 text-sm"><span className="text-teal-400 shrink-0">→</span>{item}</li>
          ))}
        </ul>

        <p className="text-white font-semibold mt-6 mb-3 text-base">Advanced Zapier: Multi-Step Automations</p>
        <div className="bg-zinc-900 border border-zinc-700 rounded-lg px-5 py-4 mb-4">
          <p className="text-teal-400 text-xs font-bold tracking-widest uppercase mb-3">Multi-Step Zap Architecture</p>
          <div className="flex flex-wrap items-center gap-2 text-sm font-mono">
            {['TRIGGER', 'Process data', 'Transform/enrich', 'Make a decision', 'Take action', 'Notify'].map((step, i, arr) => (
              <>
                <span key={step} className="text-teal-300 bg-zinc-800 border border-zinc-700 px-2 py-1 rounded text-xs">{step}</span>
                {i < arr.length - 1 && <span key={`arrow-${i}`} className="text-zinc-600">→</span>}
              </>
            ))}
          </div>
        </div>
        <p className="text-white font-semibold mt-4 mb-2">Conditional Logic (Paths and Filters)</p>
        <div className="space-y-1.5 mb-8">
          {[
            'IF email contains "urgent" → Route to priority inbox AND notify via Slack',
            'IF invoice amount > $5,000 → Require manager approval',
            'IF lead source = "website" → Add to sequence A; IF "referral" → Add to sequence B',
          ].map((rule) => (
            <p key={rule} className="text-zinc-300 text-sm font-mono bg-zinc-900 border border-zinc-700 rounded px-4 py-2">{rule}</p>
          ))}
        </div>

        {/* ═══════════════════════════════
            PART 3: EFFICIENCY PORTFOLIO
        ═══════════════════════════════ */}
        <h2 className="text-teal-400 font-bold text-xl mt-12 mb-3">Part 3: The Efficiency Portfolio</h2>

        <p className="text-white font-semibold mt-4 mb-2">Build Your Automation Tracker</p>
        <p className="text-zinc-300 text-sm leading-relaxed mb-3">Create a spreadsheet: <span className="text-white font-semibold">"My Automation Portfolio"</span></p>
        <div className="overflow-x-auto mb-5">
          <table className="w-full text-sm border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-zinc-700">
                {['Col', 'Field', 'Notes'].map((h) => (
                  <th key={h} className="text-teal-400 text-left py-2 pr-4 font-bold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {[
                ['A', 'Automation Name', 'Descriptive: "Client Email Follow-Up Draft"'],
                ['B', 'Department', 'Client / Finance / Marketing / HR / Projects'],
                ['C', 'Date Built', 'For tracking growth over time'],
                ['D', 'Tools Used', 'ChatGPT + Zapier + Gmail'],
                ['E', 'Time Before (min)', 'How long the task took manually'],
                ['F', 'Time After (min)', 'How long it takes now'],
                ['G', 'Frequency (×/week)', 'How often you run this task'],
                ['H', 'Weekly Saved', '(E−F) × G'],
                ['I', 'Monthly Saved', 'H × 4.3'],
                ['J', 'Status', 'Active / Paused / Needs Update'],
              ].map(([col, field, note]) => (
                <tr key={col}>
                  <td className="py-2 pr-4 text-teal-400 font-mono font-bold">{col}</td>
                  <td className="py-2 pr-4 text-white font-semibold">{field}</td>
                  <td className="py-2 text-zinc-400 text-xs">{note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-white font-semibold mt-4 mb-2">Converting Time to Dollar Value</p>
        <div className="bg-zinc-900 border border-zinc-700 rounded-lg px-5 py-5 mb-4">
          <p className="text-zinc-300 text-sm mb-3">Your hourly rate = <span className="text-teal-300 font-mono">annual salary ÷ 2,080</span></p>
          <div className="space-y-2">
            {[
              ['$60K/year salary', '~$29/hr'],
              ['Save 10 hrs/month', '$290/month = $3,480/year'],
              ['Save 20 hrs/month', '$580/month = $6,960/year'],
            ].map(([input, result]) => (
              <div key={input} className="flex justify-between items-center text-sm border-b border-zinc-800 pb-2">
                <span className="text-zinc-300">{input}</span>
                <span className="text-teal-400 font-bold">{result}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-teal-500/5 border border-teal-500/30 rounded-lg px-5 py-4 mb-8">
          <p className="text-zinc-300 text-sm leading-relaxed">Leadership thinks in dollars, not minutes. This is the math that gets you promoted.</p>
        </div>

        {/* ═══════════════════════════════
            PART 4: THE PROMOTION PLAY
        ═══════════════════════════════ */}
        <h2 className="text-teal-400 font-bold text-xl mt-12 mb-3">Part 4: The Promotion Play</h2>

        <p className="text-white font-semibold mt-4 mb-3">Positioning Yourself as the AI Person</p>
        <div className="space-y-3 mb-5">
          {[
            ['Start with results, not technology', 'Never lead with "I\'ve been using AI tools." Lead with "I\'ve reduced report generation time by 75%."'],
            ['Share your wins publicly but subtly', 'Mention time savings in meetings. Let the number do the positioning.'],
            ['Offer to help one colleague', 'Do this 3 times. Each one is a testimonial and a referral waiting to happen.'],
            ['Propose an internal AI Efficiency initiative', 'Turn a personal practice into a departmental initiative. That\'s leadership.'],
          ].map(([title, desc], i) => (
            <div key={title} className="flex items-start gap-3 bg-zinc-900 border border-zinc-700 rounded-lg px-5 py-4">
              <span className="text-teal-400 font-bold shrink-0 text-sm">{i + 1}.</span>
              <div>
                <p className="text-white font-semibold text-sm mb-1">{title}</p>
                <p className="text-zinc-400 text-sm">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-white font-semibold mt-6 mb-2">Proposal Email Template</p>
        <pre className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 font-mono text-sm text-teal-300 whitespace-pre-wrap overflow-x-auto mb-6">{`Subject: Proposal: AI Efficiency Pilot

"Over the past [X weeks], I've been building AI-powered workflows that have saved our team approximately [X hours/month]. [Colleague 1] and [Colleague 2] have seen similar results after I helped them set up systems.

I'd like to propose a small pilot: I'll spend [X hours/week] helping [X team members] automate their top 3 time-wasters over the next 30 days. I'll track and report results.

If successful, this could save the department [estimated hours/dollars] annually.

Would you be open to discussing this in our next 1:1?"`}</pre>

        <p className="text-white font-semibold mt-6 mb-3">The Promotion Conversation — 4-Part Framework</p>
        <div className="space-y-3 mb-4">
          {[
            ['Open with business impact', '"Over the past 90 days, I\'ve implemented systems that have saved our team [X hours/month]..."'],
            ['Connect to company priorities', 'Link your work to a current initiative, goal, or pain point leadership is already focused on.'],
            ['Propose the expanded role', 'Be specific. "I\'d like to take on X responsibility" is better than "I\'d like a promotion."'],
            ['Make it easy to say yes', 'Propose a 90-day pilot. Lower the risk. Make the decision obvious.'],
          ].map(([step, desc], i) => (
            <div key={step} className="flex items-start gap-3 bg-zinc-900 border border-zinc-700 rounded-lg px-5 py-4">
              <span className="text-teal-400 font-bold shrink-0 text-sm">{i + 1}.</span>
              <div>
                <p className="text-white font-semibold text-sm mb-1">{step}</p>
                <p className="text-zinc-400 text-sm">{desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-teal-500/5 border border-teal-500/30 rounded-lg px-5 py-4 mb-8">
          <p className="text-zinc-300 text-sm leading-relaxed">
            <span className="text-white font-semibold">Key insight:</span> You're not asking for a promotion because you've been a good employee. You're presenting a business case.
          </p>
        </div>

        {/* ═══════════════════════════════
            PART 5: 30-DAY CALENDAR
        ═══════════════════════════════ */}
        <h2 className="text-teal-400 font-bold text-xl mt-12 mb-3">Part 5: 30-Day Implementation Calendar</h2>

        {[
          {
            week: 'Week 1 — Foundation (Days 1–7)',
            days: [
              ['Day 1', 'Set 30-min timer. Start logging every task.'],
              ['Days 2–5', 'Keep logging. No skipping. No estimating.'],
              ['Day 6', 'Score every task 1–5. Calculate priority scores. Build Automation Roadmap.'],
              ['Day 7', 'Create Efficiency Portfolio spreadsheet.'],
            ],
          },
          {
            week: 'Week 2 — Quick Wins (Days 8–14)',
            days: [
              ['Days 8–9', 'Build Wave 1 automations (3–5 quick wins)'],
              ['Days 10–11', 'Refine and stabilize.'],
              ['Day 12', 'First Portfolio Review. Calculate total weekly time saved + dollar equivalent.'],
              ['Days 13–14', 'Help one colleague automate one task.'],
            ],
          },
          {
            week: 'Week 3 — High-Impact Builds (Days 15–21)',
            days: [
              ['Days 15–17', 'Build Wave 2 automations (3 high-impact, custom prompts)'],
              ['Days 18–19', 'Build your first prompt chain.'],
              ['Day 20', 'Second Portfolio Review. Should be at 5–10+ hours/month saved.'],
              ['Day 21', 'Help Colleague #2. Different department.'],
            ],
          },
          {
            week: 'Week 4 — Integration & Presentation (Days 22–30)',
            days: [
              ['Days 22–24', 'Wave 3 — connect automations into systems with multi-step Zaps'],
              ['Days 25–26', 'Final Portfolio Review.'],
              ['Days 27–28', 'Prepare promotion case.'],
              ['Days 29–30', 'Have the conversation.'],
            ],
          },
        ].map((w) => (
          <div key={w.week} className="mb-5">
            <p className="text-white font-bold text-sm mb-2">{w.week}</p>
            <div className="bg-zinc-900 border border-zinc-700 rounded-lg overflow-hidden">
              {w.days.map(([day, task], i, arr) => (
                <div key={day} className={`flex gap-4 px-5 py-3 text-sm ${i < arr.length - 1 ? 'border-b border-zinc-800' : ''}`}>
                  <span className="text-teal-400 font-semibold shrink-0 w-20">{day}</span>
                  <span className="text-zinc-300">{task}</span>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Upsell */}
        <div className="mt-12 p-6 border border-teal-500/30 rounded-xl bg-teal-500/5">
          <h2 className="text-white text-xl font-bold mb-2">Ready to sell this?</h2>
          <p className="text-zinc-300 text-sm leading-relaxed mb-1">
            The Automation Consultant Kit teaches you to package these exact skills into a service businesses will pay $50–150/hr for. Client templates, pricing frameworks, discovery call scripts, and a 30-day plan to land your first paying client.
          </p>
          <a
            href="https://getfluxe.gumroad.com/l/AutomationConsultant"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block bg-teal-500 hover:bg-teal-400 text-black font-bold px-6 py-3 rounded-lg transition-colors no-underline"
          >
            Get the Consultant Kit — $149
          </a>
        </div>

      </main>

      <footer style={{ borderTop: `1px solid ${BORDER}` }} className="py-8 text-center">
        <p className="text-zinc-500 text-sm">© 2026 The Restack. Built for the ones who didn't wait.</p>
      </footer>
    </div>
  )
}
