import Navbar from '../components/Navbar'

const BORDER = '#2a2a38'

export default function Operator() {
  return (
    <div className="min-h-screen text-white flex flex-col" style={{ backgroundColor: '#111118' }}>
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 pt-16 pb-24 w-full flex-1">

        {/* Page header */}
        <div className="mb-10">
          <p className="text-teal-400 text-xs font-semibold tracking-widest uppercase mb-3">Automation Consultant Kit · $149</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight leading-tight mb-4">
            The Automation Consultant Kit
          </h1>
          <p className="text-zinc-400 text-lg">Turn Your AI Skills Into a Paying Business</p>
        </div>

        {/* Welcome */}
        <div className="border-l-4 border-teal-400 bg-zinc-900 rounded-r-xl px-6 py-5 mb-14">
          <p className="text-zinc-300 text-sm leading-relaxed">
            You've done this for yourself. You've done it for colleagues. The only step left is charging for it. Here's the complete system.
          </p>
        </div>

        {/* ═══════════════════════════════
            PART 1: 20 SERVICES
        ═══════════════════════════════ */}
        <h2 className="text-teal-400 font-bold text-xl mt-8 mb-3">Part 1: The 20 Highest-Demand Automation Services</h2>

        <p className="text-white font-semibold mt-6 mb-3">Tier 1 — High Demand, High Willingness to Pay ($75–150/hr)</p>
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm border-collapse min-w-[480px]">
            <thead>
              <tr className="border-b border-zinc-700">
                <th className="text-teal-400 text-left py-2 pr-3 font-bold">#</th>
                <th className="text-teal-400 text-left py-2 pr-3 font-bold">Service</th>
                <th className="text-teal-400 text-left py-2 pr-3 font-bold">What You Build</th>
                <th className="text-teal-400 text-left py-2 font-bold">Typical Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {[
                ['1', 'Email System Automation', 'Templates + sequences + Zapier', '$500–1,500'],
                ['2', 'Client Onboarding System', '5-email sequence + CRM triggers', '$750–2,000'],
                ['3', 'Invoice Processing Pipeline', 'Extraction + categorization + logging', '$500–1,200'],
                ['4', 'Report Generation System', 'Data-to-report automation', '$750–1,500'],
                ['5', 'CRM Workflow Automation', 'Lead tracking + follow-up triggers', '$1,000–2,500'],
                ['6', 'Sales Pipeline Automation', 'Lead scoring + outreach sequences', '$1,000–3,000'],
                ['7', 'Customer Support System', 'Response templates + routing + FAQ', '$750–2,000'],
              ].map(([n, service, what, price]) => (
                <tr key={n}>
                  <td className="py-2.5 pr-3 text-teal-400 font-bold">{n}</td>
                  <td className="py-2.5 pr-3 text-white font-semibold">{service}</td>
                  <td className="py-2.5 pr-3 text-zinc-400">{what}</td>
                  <td className="py-2.5 text-teal-300 font-mono text-xs">{price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-white font-semibold mt-6 mb-3">Tier 2 — Strong Demand, Moderate Pricing ($50–100/hr)</p>
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm border-collapse min-w-[480px]">
            <thead>
              <tr className="border-b border-zinc-700">
                <th className="text-teal-400 text-left py-2 pr-3 font-bold">#</th>
                <th className="text-teal-400 text-left py-2 pr-3 font-bold">Service</th>
                <th className="text-teal-400 text-left py-2 pr-3 font-bold">What You Build</th>
                <th className="text-teal-400 text-left py-2 font-bold">Typical Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {[
                ['8', 'Social Media Content System', 'Prompt library + scheduling', '$300–800'],
                ['9', 'Meeting Notes Automation', 'Transcription + summary pipeline', '$200–500'],
                ['10', 'HR Document Generation', 'Job posts + interview Qs + reviews', '$500–1,200'],
                ['11', 'Project Status Automation', 'Task list to stakeholder reports', '$300–750'],
                ['12', 'Expense Management System', 'Categorization + monthly summaries', '$400–900'],
                ['13', 'Newsletter Automation', 'Content pipeline + email drafting', '$300–700'],
                ['14', 'Data Cleanup & Organization', 'Spreadsheet systems + formulas', '$200–600'],
              ].map(([n, service, what, price]) => (
                <tr key={n}>
                  <td className="py-2.5 pr-3 text-teal-400 font-bold">{n}</td>
                  <td className="py-2.5 pr-3 text-white font-semibold">{service}</td>
                  <td className="py-2.5 pr-3 text-zinc-400">{what}</td>
                  <td className="py-2.5 text-teal-300 font-mono text-xs">{price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-white font-semibold mt-6 mb-3">Tier 3 — Growing Demand, Entry-Level ($40–75/hr)</p>
        <div className="overflow-x-auto mb-5">
          <table className="w-full text-sm border-collapse min-w-[480px]">
            <thead>
              <tr className="border-b border-zinc-700">
                <th className="text-teal-400 text-left py-2 pr-3 font-bold">#</th>
                <th className="text-teal-400 text-left py-2 pr-3 font-bold">Service</th>
                <th className="text-teal-400 text-left py-2 pr-3 font-bold">What You Build</th>
                <th className="text-teal-400 text-left py-2 font-bold">Typical Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {[
                ['15', 'Blog Content System', 'Outline + draft + repurpose pipeline', '$200–500'],
                ['16', 'Calendar & Scheduling Setup', 'Booking + reminders + prep notes', '$150–400'],
                ['17', 'Document Template Library', 'Proposals + contracts + SOWs', '$300–600'],
                ['18', 'Internal Comms Automation', 'Team updates + announcements', '$200–400'],
                ['19', 'File Organization System', 'Naming conventions + auto-sorting', '$150–350'],
                ['20', 'Prompt Library Creation', 'Custom prompt bank for their team', '$200–500'],
              ].map(([n, service, what, price]) => (
                <tr key={n}>
                  <td className="py-2.5 pr-3 text-teal-400 font-bold">{n}</td>
                  <td className="py-2.5 pr-3 text-white font-semibold">{service}</td>
                  <td className="py-2.5 pr-3 text-zinc-400">{what}</td>
                  <td className="py-2.5 text-teal-300 font-mono text-xs">{price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-teal-500/5 border border-teal-500/30 rounded-lg px-5 py-4 mb-6">
          <p className="text-teal-400 text-xs font-bold tracking-widest uppercase mb-2">Pricing Math</p>
          <p className="text-zinc-300 text-sm">2 Tier 1 services/month at $1,000 avg = <span className="text-white font-bold">$2,000/month side hustle</span>. 4 services = <span className="text-white font-bold">$4,000</span>.</p>
        </div>

        <p className="text-white font-semibold mt-8 mb-3">Your Ideal Client Profile</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-zinc-900 border border-teal-500/30 rounded-lg px-5 py-4">
            <p className="text-teal-400 text-xs font-bold tracking-widest uppercase mb-3">Best Clients — Start Here</p>
            <ul className="space-y-1">
              {['Real estate agencies (5–20 agents)', 'Insurance agencies (small/mid)', 'Marketing agencies (3–15 people)', 'Law firms (small)', 'Accounting firms (non-tax season)', 'E-commerce ($500K–5M revenue)'].map((c) => (
                <li key={c} className="text-zinc-300 text-sm flex items-start gap-2"><span className="text-teal-400 shrink-0">✓</span>{c}</li>
              ))}
            </ul>
          </div>
          <div className="bg-zinc-900 border border-zinc-700 rounded-lg px-5 py-4">
            <p className="text-zinc-500 text-xs font-bold tracking-widest uppercase mb-3">Avoid For Now</p>
            <ul className="space-y-1">
              {['Solopreneurs under $100K revenue', 'Large corporations', '"I want AI to replace my entire staff"', '"Can you just do a quick thing?"'].map((c) => (
                <li key={c} className="text-zinc-400 text-sm flex items-start gap-2"><span className="text-red-500/60 shrink-0">✕</span>{c}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="bg-zinc-900 border border-zinc-700 rounded-lg px-5 py-4 mb-8">
          <p className="text-teal-400 text-xs font-bold tracking-widest uppercase mb-2">Sweet Spot</p>
          <p className="text-zinc-300 text-sm">5–25 employees, $500K–5M revenue, at least one full-time person doing administrative work that could be automated.</p>
        </div>

        {/* ═══════════════════════════════
            PART 2: SERVICE MODELS
        ═══════════════════════════════ */}
        <h2 className="text-teal-400 font-bold text-xl mt-12 mb-3">Part 2: Three Service Models</h2>

        <div className="space-y-4 mb-6">
          {[
            {
              model: 'Model 1: One-Time Setup',
              range: '$500–3,000',
              items: [
                ['Simple workflow', '$500–800'],
                ['Medium system (2–3 connected workflows)', '$800–1,500'],
                ['Complex system (full dept + training)', '$1,500–3,000'],
              ],
              note: 'Deliverable: Working system + documentation + 30-min training session + 2 weeks email support.',
            },
            {
              model: 'Model 2: Monthly Retainer',
              range: '$500–2,000/month',
              items: [
                ['Light (4 hrs/month)', '$500–750/month'],
                ['Standard (8 hrs/month)', '$1,000–1,500/month'],
                ['Premium (12+ hrs/month)', '$1,500–2,000/month'],
              ],
              note: null,
            },
            {
              model: 'Model 3: VIP Day',
              range: '$1,500–3,000',
              items: [
                ['6-hour day', '$1,500'],
                ['8-hour day with follow-up support', '$2,500'],
              ],
              note: 'VIP days almost always convert to retainers.',
            },
          ].map((m) => (
            <div key={m.model} className="bg-zinc-900 border border-zinc-700 rounded-xl px-5 py-5">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <p className="text-white font-bold">{m.model}</p>
                <span className="text-teal-400 text-xs font-bold bg-teal-500/10 border border-teal-500/30 px-2 py-1 rounded-full">{m.range}</span>
              </div>
              <div className="space-y-1.5 mb-3">
                {m.items.map(([tier, price]) => (
                  <div key={tier} className="flex justify-between text-sm border-b border-zinc-800 pb-1.5">
                    <span className="text-zinc-300">{tier}</span>
                    <span className="text-teal-300 font-mono text-xs">{price}</span>
                  </div>
                ))}
              </div>
              {m.note && <p className="text-zinc-400 text-xs">{m.note}</p>}
            </div>
          ))}
        </div>

        <div className="bg-teal-500/5 border border-teal-500/30 rounded-lg px-5 py-4 mb-5">
          <p className="text-teal-400 text-xs font-bold tracking-widest uppercase mb-2">The Revenue Ladder</p>
          <p className="text-zinc-300 text-sm">2–3 retainer clients ($3–6K/month) + 1–2 one-time projects ($1–3K/month) + 1 VIP day/month ($1.5–3K) = <span className="text-white font-bold">$5.5–12K/month</span>.</p>
        </div>

        <p className="text-white font-semibold mt-6 mb-3">Scoping Projects So You Don't Get Trapped</p>
        <div className="bg-zinc-900 border border-zinc-700 rounded-lg px-5 py-5 mb-8">
          <p className="text-teal-400 text-xs font-bold tracking-widest uppercase mb-3">The Scoping Checklist</p>
          <ol className="space-y-2">
            {[
              'Define exactly what\'s INCLUDED (be over-specific)',
              'Define exactly what\'s NOT INCLUDED',
              'Set a revision limit: "This project includes 2 rounds of revisions."',
              'Get sign-off before starting',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-zinc-300 text-sm">
                <span className="text-teal-400 font-bold shrink-0">{i + 1}.</span>{item}
              </li>
            ))}
          </ol>
        </div>

        {/* ═══════════════════════════════
            PART 3: CLIENT ACQUISITION
        ═══════════════════════════════ */}
        <h2 className="text-teal-400 font-bold text-xl mt-12 mb-3">Part 3: Client Acquisition</h2>

        <p className="text-white font-semibold mt-4 mb-3">Channel 1: Your Existing Network (Fastest)</p>
        <p className="text-zinc-300 text-sm leading-relaxed mb-3">The Warm Outreach Message:</p>
        <pre className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 font-mono text-sm text-teal-300 whitespace-pre-wrap overflow-x-auto mb-4">{`"Hey [name], I've been building AI automation systems that help businesses save 10-15 hours a week on repetitive work — things like email management, report generation, data entry, and client follow-ups.

I'm looking for 2-3 businesses to work with at a founding rate while I build out my consulting practice. The rate is [50% of your target rate] and includes [specific deliverable].

Would that be useful for you or anyone you know? Happy to do a free 15-minute audit to see if there's a fit."`}</pre>

        <p className="text-white font-semibold mt-4 mb-3">The Free Audit Close (15 minutes)</p>
        <div className="bg-zinc-900 border border-zinc-700 rounded-lg overflow-hidden mb-4">
          {[
            ['0–5 min', 'Ask them to walk you through their biggest time-wasters'],
            ['5–10 min', 'Identify top 2–3 automatable tasks, explain how you\'d build them'],
            ['10–12 min', 'Estimate time savings in hours and dollars per month'],
            ['12–15 min', '"I can build that system for you in [timeframe] for [price]. Want to move forward?"'],
          ].map(([time, task], i, arr) => (
            <div key={time} className={`flex gap-4 px-5 py-3 text-sm ${i < arr.length - 1 ? 'border-b border-zinc-800' : ''}`}>
              <span className="text-teal-400 font-semibold shrink-0 w-16">{time}</span>
              <span className="text-zinc-300">{task}</span>
            </div>
          ))}
        </div>
        <p className="text-zinc-400 text-sm mb-6">Close rate: <span className="text-white font-semibold">40–60%</span>.</p>

        <p className="text-white font-semibold mt-4 mb-3">All 5 Acquisition Channels</p>
        <div className="space-y-3 mb-8">
          {[
            { ch: 'Channel 1', name: 'Existing Network', timeline: 'Immediate', note: 'Warm outreach. Highest close rate. Start here.' },
            { ch: 'Channel 2', name: 'LinkedIn', timeline: '1–2 weeks', note: '50 requests → 15–20 connections → 5–8 conversations → 2–3 audits → 1–2 clients.' },
            { ch: 'Channel 3', name: 'Local Business Groups', timeline: '2–4 weeks', note: 'Chamber of Commerce, BNI chapters, local entrepreneur meetups.' },
            { ch: 'Channel 4', name: 'Upwork / Fiverr', timeline: 'Immediate, lower rates', note: 'Rates: $30–75/hr. Bootstrap strategy, not long-term plan.' },
            { ch: 'Channel 5', name: 'Referral System', timeline: 'Ongoing', note: 'Offer $100 off their next project for every referral that becomes a client.' },
          ].map((c) => (
            <div key={c.ch} className="bg-zinc-900 border border-zinc-700 rounded-lg px-5 py-4">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                <p className="text-white font-semibold text-sm">{c.ch}: {c.name}</p>
                <span className="text-zinc-500 text-xs">{c.timeline}</span>
              </div>
              <p className="text-zinc-400 text-sm">{c.note}</p>
            </div>
          ))}
        </div>

        {/* ═══════════════════════════════
            PART 4: DELIVERY SYSTEM
        ═══════════════════════════════ */}
        <h2 className="text-teal-400 font-bold text-xl mt-12 mb-3">Part 4: The Delivery System</h2>

        <p className="text-white font-semibold mt-4 mb-3">The Client Engagement Lifecycle — 5 Phases</p>

        <p className="text-white font-semibold mt-4 mb-2">Phase 1: Discovery Call (30 min, free)</p>
        <pre className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 font-mono text-sm text-teal-300 whitespace-pre-wrap overflow-x-auto mb-4">{`OPENING (2 min):
"Thanks for taking the time. I'd love to understand your business so I can see if there's a way I can help. Can you give me a quick overview of what your team does day-to-day?"

PAIN IDENTIFICATION (10 min):
"What are the tasks that eat the most time? The stuff where you think — this really shouldn't take this long."

SOLUTION FRAMING (10 min):
"Based on what you've described, here's what I'd recommend..."

CLOSE (5 min):
"I can build this system for you in [timeframe]. The investment is [price]. That includes [scope]. Would you like to move forward?"`}</pre>

        <div className="space-y-3 mb-8">
          {[
            { phase: 'Phase 2: Proposal & Agreement', timing: '1–2 days', note: 'Send within 24 hours. Payment terms: 50% upfront, 50% on delivery.' },
            { phase: 'Phase 3: Build', timing: '1–2 weeks', note: 'Send a mid-project update. Clients hate silence.' },
            { phase: 'Phase 4: Delivery & Training', timing: '1–2 hours', note: 'Record the Zoom call and send the recording. Reduces support questions by 70%.' },
            { phase: 'Phase 5: Support & Upsell', timing: '2–4 weeks', note: 'At end of support period, send the retainer pitch.' },
          ].map((p) => (
            <div key={p.phase} className="bg-zinc-900 border border-zinc-700 rounded-lg px-5 py-4">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                <p className="text-white font-semibold text-sm">{p.phase}</p>
                <span className="text-zinc-500 text-xs">{p.timing}</span>
              </div>
              <p className="text-zinc-400 text-sm">{p.note}</p>
            </div>
          ))}
        </div>

        {/* ═══════════════════════════════
            PART 5: SCALING
        ═══════════════════════════════ */}
        <h2 className="text-teal-400 font-bold text-xl mt-12 mb-3">Part 5: Scaling</h2>

        <p className="text-white font-semibold mt-4 mb-3">4 Stages from Side Hustle to Business</p>
        <div className="space-y-3 mb-6">
          {[
            { stage: 'Stage 1: Side Hustle', revenue: '$1–3K/month', focus: 'Testimonials, case studies, referrals.' },
            { stage: 'Stage 2: Consistent Freelance', revenue: '$3–6K/month', focus: 'Productize your services. Raise prices if close rate exceeds 60%.' },
            { stage: 'Stage 3: Full Practice', revenue: '$6–12K/month', focus: 'Retainer income covers base expenses. You\'re running a business.' },
            { stage: 'Stage 4: Scalable Business', revenue: '$12K+/month', focus: 'Subcontract, group training, digital products, online course.' },
          ].map((s) => (
            <div key={s.stage} className="bg-zinc-900 border border-zinc-700 rounded-xl px-5 py-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-white font-bold text-sm mb-1">{s.stage}</p>
                <p className="text-zinc-400 text-sm">{s.focus}</p>
              </div>
              <span className="text-teal-400 text-xs font-bold bg-teal-500/10 border border-teal-500/30 px-2 py-1 rounded-full shrink-0">{s.revenue}</span>
            </div>
          ))}
        </div>

        <p className="text-white font-semibold mt-6 mb-2">When to Raise Prices</p>
        <div className="flex flex-wrap gap-2 mb-5">
          {['5+ completed projects', 'Close rate above 60%', 'You have a waitlist', '90 days since last increase'].map((trigger) => (
            <span key={trigger} className="text-xs bg-teal-500/10 border border-teal-500/30 text-teal-300 px-3 py-1.5 rounded-full">{trigger}</span>
          ))}
        </div>
        <p className="text-zinc-400 text-sm mb-8">How much: <span className="text-white font-semibold">20–30% per increase</span>. Raise when ANY of the triggers above are true.</p>

        {/* ═══════════════════════════════
            PART 6: TEMPLATES
        ═══════════════════════════════ */}
        <h2 className="text-teal-400 font-bold text-xl mt-12 mb-3">Part 6: Templates &amp; Scripts</h2>

        <p className="text-white font-semibold mt-4 mb-2">The Case Study Formula</p>
        <pre className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 font-mono text-sm text-teal-300 whitespace-pre-wrap overflow-x-auto mb-6">{`CLIENT: [Industry, size — no name unless they agree]
PROBLEM: [What they struggled with, quantified]
SOLUTION: [What you built, tools used]
RESULTS: [Time saved, dollar impact]
TIMELINE: [How long the engagement took]
TESTIMONIAL: [Direct quote from client]`}</pre>

        <p className="text-white font-semibold mt-6 mb-2">Client Proposal Template</p>
        <pre className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 font-mono text-sm text-teal-300 whitespace-pre-wrap overflow-x-auto mb-6">{`[YOUR NAME / BUSINESS NAME]
Automation Consulting Proposal

Prepared for: [Client Name], [Company]
Date: [Date]

PROJECT OVERVIEW
[2-3 sentences]

SCOPE OF WORK
This engagement includes:
- [Deliverable 1]
- [Deliverable 2]
- [Training session]
- [Support period]
- [Documentation]

This engagement does NOT include:
- [Exclusion 1]
- [Exclusion 2]

TIMELINE
Project start: [Date]
Delivery: [Date]
Support period: [Dates]

INVESTMENT
Total: $[Amount]
- 50% due upon approval: $[Amount]
- 50% due upon delivery: $[Amount]

Includes 2 rounds of revisions.

NEXT STEPS
Reply with 'APPROVED' and I'll send an invoice for the first payment.

This proposal is valid for 14 days.

[Your Name] | [Email] | [Phone]`}</pre>

        <p className="text-white font-semibold mt-6 mb-3">Follow-Up Email Sequences</p>
        <div className="space-y-3 mb-8">
          {[
            { trigger: 'After discovery call (within 2 hours)', subject: 'Great talking today + next steps' },
            { trigger: 'After sending proposal (Day 3 follow-up)', subject: 'Quick follow-up on the automation proposal' },
            { trigger: 'After project delivery (Day 14)', subject: 'How are the automations working?' },
            { trigger: 'Asking for a testimonial', subject: 'Quick favor?' },
          ].map((e) => (
            <div key={e.trigger} className="bg-zinc-900 border border-zinc-700 rounded-lg px-5 py-3 flex flex-wrap items-center justify-between gap-2">
              <span className="text-zinc-400 text-sm">{e.trigger}</span>
              <span className="text-teal-300 text-xs font-mono">Subject: {e.subject}</span>
            </div>
          ))}
        </div>

        {/* Closing — no upsell */}
        <div className="mt-12 p-6 border border-teal-500/30 rounded-xl bg-teal-500/5">
          <h2 className="text-white text-xl font-bold mb-3">The automation consulting market barely exists yet.</h2>
          <p className="text-zinc-300 text-sm leading-relaxed mb-6">
            The people who start now will own it. You have the skills, the system, the templates, and the scripts. The only thing left is execution. Go.
          </p>
          <a
            href="#"
            className="inline-block bg-teal-500 hover:bg-teal-400 text-black font-bold px-6 py-3 rounded-lg transition-colors no-underline"
          >
            Join The Restack Discord
          </a>
        </div>

      </main>

      <footer style={{ borderTop: `1px solid ${BORDER}` }} className="py-8 text-center">
        <p className="text-zinc-500 text-sm">© 2026 The Restack. Built for the ones who didn't wait.</p>
      </footer>
    </div>
  )
}
