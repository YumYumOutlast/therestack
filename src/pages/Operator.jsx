import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import TabDashboard from '../components/TabDashboard'
import WorkflowCard from '../components/WorkflowCard'
import WorkflowStep from '../components/WorkflowStep'
import PromptBlock from '../components/PromptBlock'
import PromptLibrary from '../components/PromptLibrary'

const ALL_STEP_KEYS = [
  'restack_operator_services_step_1',
  'restack_operator_packaging_step_1',
  'restack_operator_packaging_step_2',
  'restack_operator_acquisition_step_1',
  'restack_operator_acquisition_step_2',
  'restack_operator_delivery_step_1',
  'restack_operator_delivery_step_2',
  'restack_operator_delivery_step_3',
  'restack_operator_scaling_step_1',
  'restack_operator_scaling_step_2',
]

const ALL_PROMPTS = [
  {
    label: 'Warm Outreach Message',
    content: `"Hey [name], I've been building AI automation systems that help businesses save 10-15 hours a week on repetitive work — things like email management, report generation, data entry, and client follow-ups.

I'm looking for 2-3 businesses to work with at a founding rate while I build out my consulting practice. The rate is [50% of your target rate] and includes [specific deliverable].

Would that be useful for you or anyone you know? Happy to do a free 15-minute audit to see if there's a fit."`,
  },
  {
    label: 'Free Audit Close Script',
    content: `0–5 min: "Walk me through your biggest time-wasters right now."
5–10 min: Identify top 2–3 automatable tasks. Explain how you'd build them.
10–12 min: Estimate time savings in hours and dollars per month.
12–15 min: "I can build that system for you in [timeframe] for [price]. Want to move forward?"

Close rate: 40–60%.`,
  },
  {
    label: 'Discovery Call Script',
    content: `OPENING (2 min):
"Thanks for taking the time. I'd love to understand your business so I can see if there's a way I can help. Can you give me a quick overview of what your team does day-to-day?"

PAIN IDENTIFICATION (10 min):
"What are the tasks that eat the most time? The stuff where you think — this really shouldn't take this long."

SOLUTION FRAMING (10 min):
"Based on what you've described, here's what I'd recommend..."

CLOSE (5 min):
"I can build this system for you in [timeframe]. The investment is [price]. That includes [scope]. Would you like to move forward?"`,
  },
  {
    label: 'Case Study Formula',
    content: `CLIENT: [Industry, size — no name unless they agree]
PROBLEM: [What they struggled with, quantified]
SOLUTION: [What you built, tools used]
RESULTS: [Time saved, dollar impact]
TIMELINE: [How long the engagement took]
TESTIMONIAL: [Direct quote from client]`,
  },
  {
    label: 'Client Proposal Template',
    content: `[YOUR NAME / BUSINESS NAME]
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

[Your Name] | [Email] | [Phone]`,
  },
  {
    label: 'Follow-Up Email Sequence',
    content: `After discovery call (within 2 hours):
Subject: Great talking today + next steps

Day 3 follow-up after sending proposal:
Subject: Quick follow-up on the automation proposal

After project delivery (Day 14):
Subject: How are the automations working?

Asking for a testimonial:
Subject: Quick favor?`,
  },
]

function ProgressSummary() {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const done = ALL_STEP_KEYS.filter((k) => localStorage.getItem(k) === 'true').length
    setCount(done)
  }, [])
  const total = ALL_STEP_KEYS.length
  const pct = Math.round((count / total) * 100)
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-zinc-400 text-sm">Operator Progress</span>
        <span className="text-teal-400 font-bold text-sm">{count}/{total} steps</span>
      </div>
      <div className="w-full bg-zinc-800 rounded-full h-2">
        <div
          className="bg-teal-500 h-2 rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-zinc-500 text-xs mt-2">{pct}% complete</p>
    </div>
  )
}

function StartHereTab({ setActiveTab }) {
  return (
    <div>
      <div className="border-l-4 border-teal-400 bg-zinc-900 rounded-r-xl px-6 py-5 mb-8">
        <p className="text-white font-bold text-lg mb-2">You've already done this for free.</p>
        <p className="text-zinc-300 text-sm leading-relaxed">
          Time to charge for it. You have the skills, the system, the templates, and the scripts. The only step left is building the business around what you can already do.
        </p>
      </div>
      <ProgressSummary />
      <h3 className="text-white font-bold text-base mb-4">Your 30-Day Launch Plan</h3>
      <div className="space-y-3 mb-8">
        {[
          {
            week: 'Week 1',
            title: 'Pick your services and price them',
            desc: 'Choose 2–3 services from the list. Set founding rates. Define your ideal client. Prepare your audit script.',
            tab: 'services',
          },
          {
            week: 'Week 2',
            title: 'Start outreach — warm network first',
            desc: 'Send 10 warm outreach messages per day. Book 5 free audits. Close at least 1 paying client.',
            tab: 'acquisition',
          },
          {
            week: 'Week 3',
            title: 'Deliver and document everything',
            desc: 'Deliver your first project. Record the training call. Collect a testimonial. Build your case study.',
            tab: 'delivery',
          },
          {
            week: 'Week 4',
            title: 'Scale to $3K/month',
            desc: 'Add 2 more clients. Raise prices. Propose a retainer. Start LinkedIn outreach channel.',
            tab: 'scaling',
          },
        ].map(({ week, title, desc, tab }) => (
          <div
            key={week}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex items-start justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-teal-400 text-xs font-bold bg-teal-500/10 border border-teal-500/30 px-2 py-0.5 rounded">
                  {week}
                </span>
                <p className="text-white font-semibold text-sm">{title}</p>
              </div>
              <p className="text-zinc-400 text-xs leading-relaxed">{desc}</p>
            </div>
            <button
              onClick={() => setActiveTab(tab)}
              className="shrink-0 text-teal-400 text-xs font-bold border border-teal-500/40 px-3 py-1.5 rounded-lg hover:bg-teal-500/10 transition-colors whitespace-nowrap"
            >
              Go →
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function ServicesTab() {
  const tier1 = [
    ['1', 'Email System Automation', 'Templates + sequences + Zapier', '$500–1,500'],
    ['2', 'Client Onboarding System', '5-email sequence + CRM triggers', '$750–2,000'],
    ['3', 'Invoice Processing Pipeline', 'Extraction + categorization + logging', '$500–1,200'],
    ['4', 'Report Generation System', 'Data-to-report automation', '$750–1,500'],
    ['5', 'CRM Workflow Automation', 'Lead tracking + follow-up triggers', '$1,000–2,500'],
    ['6', 'Sales Pipeline Automation', 'Lead scoring + outreach sequences', '$1,000–3,000'],
    ['7', 'Customer Support System', 'Response templates + routing + FAQ', '$750–2,000'],
  ]
  const tier2 = [
    ['8', 'Social Media Content System', 'Prompt library + scheduling', '$300–800'],
    ['9', 'Meeting Notes Automation', 'Transcription + summary pipeline', '$200–500'],
    ['10', 'HR Document Generation', 'Job posts + interview Qs + reviews', '$500–1,200'],
    ['11', 'Project Status Automation', 'Task list to stakeholder reports', '$300–750'],
    ['12', 'Expense Management System', 'Categorization + monthly summaries', '$400–900'],
    ['13', 'Newsletter Automation', 'Content pipeline + email drafting', '$300–700'],
    ['14', 'Data Cleanup & Organization', 'Spreadsheet systems + formulas', '$200–600'],
  ]
  const tier3 = [
    ['15', 'Blog Content System', 'Outline + draft + repurpose pipeline', '$200–500'],
    ['16', 'Calendar & Scheduling Setup', 'Booking + reminders + prep notes', '$150–400'],
    ['17', 'Document Template Library', 'Proposals + contracts + SOWs', '$300–600'],
    ['18', 'Internal Comms Automation', 'Team updates + announcements', '$200–400'],
    ['19', 'File Organization System', 'Naming conventions + auto-sorting', '$150–350'],
    ['20', 'Prompt Library Creation', 'Custom prompt bank for their team', '$200–500'],
  ]

  function ServiceTable({ rows }) {
    return (
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm border-collapse min-w-[420px]">
          <thead>
            <tr className="border-b border-zinc-700">
              <th className="text-teal-400 text-left py-2 pr-3 font-bold w-8">#</th>
              <th className="text-teal-400 text-left py-2 pr-3 font-bold">Service</th>
              <th className="text-teal-400 text-left py-2 pr-3 font-bold">What You Build</th>
              <th className="text-teal-400 text-left py-2 font-bold">Price</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {rows.map(([n, service, what, price]) => (
              <tr key={n}>
                <td className="py-2.5 pr-3 text-teal-400 font-bold">{n}</td>
                <td className="py-2.5 pr-3 text-white font-semibold text-xs">{service}</td>
                <td className="py-2.5 pr-3 text-zinc-400 text-xs">{what}</td>
                <td className="py-2.5 text-teal-300 font-mono text-xs">{price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div>
      <WorkflowCard title="The 20 Highest-Demand Automation Services">
        <p className="text-white font-semibold mb-2 text-sm">
          Tier 1 — High Demand, High Willingness to Pay ($75–150/hr)
        </p>
        <ServiceTable rows={tier1} />
        <p className="text-white font-semibold mb-2 text-sm">
          Tier 2 — Strong Demand, Moderate Pricing ($50–100/hr)
        </p>
        <ServiceTable rows={tier2} />
        <p className="text-white font-semibold mb-2 text-sm">
          Tier 3 — Growing Demand, Entry-Level ($40–75/hr)
        </p>
        <ServiceTable rows={tier3} />
        <div className="bg-teal-500/5 border border-teal-500/30 rounded-lg px-5 py-4 mb-6">
          <p className="text-teal-400 text-xs font-bold tracking-widest uppercase mb-1">Pricing Math</p>
          <p className="text-zinc-300 text-sm">
            2 Tier 1 services/month at $1,000 avg ={' '}
            <span className="text-white font-bold">$2,000/month side hustle</span>. 4 services ={' '}
            <span className="text-white font-bold">$4,000</span>.
          </p>
        </div>

        <WorkflowStep
          stepNumber={1}
          title="Define your Ideal Client Profile"
          workflowId="operator_services"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-zinc-800/50 border border-teal-500/30 rounded-lg px-4 py-4">
              <p className="text-teal-400 text-xs font-bold tracking-widest uppercase mb-3">
                Best Clients — Start Here
              </p>
              <ul className="space-y-1">
                {[
                  'Real estate agencies (5–20 agents)',
                  'Insurance agencies (small/mid)',
                  'Marketing agencies (3–15 people)',
                  'Law firms (small)',
                  'Accounting firms (non-tax season)',
                  'E-commerce ($500K–5M revenue)',
                ].map((c) => (
                  <li key={c} className="text-zinc-300 text-xs flex items-start gap-2">
                    <span className="text-teal-400 shrink-0">✓</span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-4">
              <p className="text-zinc-500 text-xs font-bold tracking-widest uppercase mb-3">
                Avoid For Now
              </p>
              <ul className="space-y-1">
                {[
                  'Solopreneurs under $100K revenue',
                  'Large corporations',
                  '"I want AI to replace my entire staff"',
                  '"Can you just do a quick thing?"',
                ].map((c) => (
                  <li key={c} className="text-zinc-400 text-xs flex items-start gap-2">
                    <span className="text-red-500/60 shrink-0">✕</span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-3 bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3">
            <p className="text-teal-400 text-xs font-bold uppercase tracking-widest mb-1">
              Sweet Spot
            </p>
            <p className="text-zinc-300 text-sm">
              5–25 employees, $500K–5M revenue, at least one full-time person doing administrative work
              that could be automated.
            </p>
          </div>
        </WorkflowStep>
      </WorkflowCard>
    </div>
  )
}

function PackagingTab() {
  return (
    <div>
      <WorkflowCard title="Three Service Models">
        <WorkflowStep
          stepNumber={1}
          title="Choose your service model"
          workflowId="operator_packaging"
        >
          <div className="space-y-4 mb-2">
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
              <div key={m.model} className="bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-4">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <p className="text-white font-bold text-sm">{m.model}</p>
                  <span className="text-teal-400 text-xs font-bold bg-teal-500/10 border border-teal-500/30 px-2 py-1 rounded-full">
                    {m.range}
                  </span>
                </div>
                <div className="space-y-1.5 mb-2">
                  {m.items.map(([tier, price]) => (
                    <div
                      key={tier}
                      className="flex justify-between text-xs border-b border-zinc-700 pb-1.5"
                    >
                      <span className="text-zinc-300">{tier}</span>
                      <span className="text-teal-300 font-mono">{price}</span>
                    </div>
                  ))}
                </div>
                {m.note && <p className="text-zinc-400 text-xs">{m.note}</p>}
              </div>
            ))}
          </div>
          <div className="bg-teal-500/5 border border-teal-500/30 rounded-lg px-4 py-3">
            <p className="text-teal-400 text-xs font-bold uppercase tracking-widest mb-1">
              The Revenue Ladder
            </p>
            <p className="text-zinc-300 text-sm">
              2–3 retainer clients ($3–6K/month) + 1–2 one-time projects ($1–3K/month) + 1 VIP
              day/month ($1.5–3K) ={' '}
              <span className="text-white font-bold">$5.5–12K/month</span>.
            </p>
          </div>
        </WorkflowStep>

        <WorkflowStep
          stepNumber={2}
          title="Scope projects so you don't get trapped"
          workflowId="operator_packaging"
        >
          <div className="space-y-1.5">
            {[
              'Define exactly what\'s INCLUDED (be over-specific)',
              'Define exactly what\'s NOT INCLUDED',
              'Set a revision limit: "This project includes 2 rounds of revisions."',
              'Get sign-off before starting',
            ].map((item, i) => (
              <p key={i} className="text-zinc-300 text-sm flex items-start gap-2">
                <span className="text-teal-400 font-bold shrink-0">{i + 1}.</span>
                {item}
              </p>
            ))}
          </div>
          <div className="mt-3 bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3">
            <p className="text-zinc-300 text-sm">
              <span className="text-white font-semibold">Billing rule:</span> 50% upfront, 50% on
              delivery. Non-negotiable for project work.
            </p>
          </div>
        </WorkflowStep>
      </WorkflowCard>
    </div>
  )
}

function AcquisitionTab() {
  return (
    <div>
      <WorkflowCard title="Client Acquisition: 5 Channels">
        <WorkflowStep
          stepNumber={1}
          title="Start with warm outreach (Channel 1)"
          workflowId="operator_acquisition"
        >
          <p className="text-zinc-400 text-sm mb-3">
            Highest close rate. Do this before anything else.
          </p>
          <PromptBlock
            label="Warm Outreach Message"
            content={`"Hey [name], I've been building AI automation systems that help businesses save 10-15 hours a week on repetitive work — things like email management, report generation, data entry, and client follow-ups.

I'm looking for 2-3 businesses to work with at a founding rate while I build out my consulting practice. The rate is [50% of your target rate] and includes [specific deliverable].

Would that be useful for you or anyone you know? Happy to do a free 15-minute audit to see if there's a fit."`}
          />
          <div className="mt-4 space-y-3">
            {[
              {
                ch: 'Channel 2: LinkedIn',
                timeline: '1–2 weeks',
                note: '50 requests → 15–20 connections → 5–8 conversations → 2–3 audits → 1–2 clients.',
              },
              {
                ch: 'Channel 3: Local Business Groups',
                timeline: '2–4 weeks',
                note: 'Chamber of Commerce, BNI chapters, local entrepreneur meetups.',
              },
              {
                ch: 'Channel 4: Upwork / Fiverr',
                timeline: 'Immediate, lower rates',
                note: 'Rates: $30–75/hr. Bootstrap strategy, not long-term plan.',
              },
              {
                ch: 'Channel 5: Referral System',
                timeline: 'Ongoing',
                note: 'Offer $100 off their next project for every referral that becomes a client.',
              },
            ].map((c) => (
              <div key={c.ch} className="bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                  <p className="text-white font-semibold text-sm">{c.ch}</p>
                  <span className="text-zinc-500 text-xs">{c.timeline}</span>
                </div>
                <p className="text-zinc-400 text-xs">{c.note}</p>
              </div>
            ))}
          </div>
        </WorkflowStep>

        <WorkflowStep
          stepNumber={2}
          title="Run the Free Audit Close (15 minutes)"
          workflowId="operator_acquisition"
        >
          <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg overflow-hidden mb-3">
            {[
              ['0–5 min', 'Ask them to walk you through their biggest time-wasters.'],
              [
                '5–10 min',
                "Identify top 2–3 automatable tasks. Explain how you'd build them.",
              ],
              ['10–12 min', 'Estimate time savings in hours and dollars per month.'],
              [
                '12–15 min',
                '"I can build that system for you in [timeframe] for [price]. Want to move forward?"',
              ],
            ].map(([time, task], i, arr) => (
              <div
                key={time}
                className={`flex gap-4 px-4 py-3 text-sm ${
                  i < arr.length - 1 ? 'border-b border-zinc-700' : ''
                }`}
              >
                <span className="text-teal-400 font-semibold shrink-0 w-16 text-xs">{time}</span>
                <span className="text-zinc-300 text-xs">{task}</span>
              </div>
            ))}
          </div>
          <p className="text-zinc-400 text-sm">
            Close rate: <span className="text-white font-semibold">40–60%</span>.
          </p>
        </WorkflowStep>
      </WorkflowCard>
    </div>
  )
}

function DeliveryTab() {
  return (
    <div>
      <WorkflowCard title="The Client Engagement Lifecycle">
        <WorkflowStep
          stepNumber={1}
          title="Discovery Call (30 min, free)"
          workflowId="operator_delivery"
        >
          <PromptBlock
            label="Discovery Call Script"
            content={`OPENING (2 min):
"Thanks for taking the time. I'd love to understand your business so I can see if there's a way I can help. Can you give me a quick overview of what your team does day-to-day?"

PAIN IDENTIFICATION (10 min):
"What are the tasks that eat the most time? The stuff where you think — this really shouldn't take this long."

SOLUTION FRAMING (10 min):
"Based on what you've described, here's what I'd recommend..."

CLOSE (5 min):
"I can build this system for you in [timeframe]. The investment is [price]. That includes [scope]. Would you like to move forward?"`}
          />
        </WorkflowStep>

        <WorkflowStep
          stepNumber={2}
          title="Proposal → Build → Delivery"
          workflowId="operator_delivery"
        >
          <div className="space-y-3">
            {[
              {
                phase: 'Phase 2: Proposal & Agreement',
                timing: '1–2 days',
                note: 'Send within 24 hours. Payment terms: 50% upfront, 50% on delivery.',
              },
              {
                phase: 'Phase 3: Build',
                timing: '1–2 weeks',
                note: "Send a mid-project update. Clients hate silence.",
              },
              {
                phase: 'Phase 4: Delivery & Training',
                timing: '1–2 hours',
                note: 'Record the training call and send the recording. Reduces support questions by 70%.',
              },
            ].map((p) => (
              <div key={p.phase} className="bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                  <p className="text-white font-semibold text-sm">{p.phase}</p>
                  <span className="text-zinc-500 text-xs">{p.timing}</span>
                </div>
                <p className="text-zinc-400 text-xs">{p.note}</p>
              </div>
            ))}
          </div>
        </WorkflowStep>

        <WorkflowStep
          stepNumber={3}
          title="Support period & retainer upsell"
          workflowId="operator_delivery"
        >
          <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-4 mb-3">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
              <p className="text-white font-semibold text-sm">Phase 5: Support & Upsell</p>
              <span className="text-zinc-500 text-xs">2–4 weeks</span>
            </div>
            <p className="text-zinc-400 text-xs">
              At end of support period, send the retainer pitch. Most clients who love the work will
              say yes.
            </p>
          </div>
          <PromptBlock
            label="Retainer Pitch"
            content={`"The automations have been running for [X weeks] now. Based on the time you're saving, I'd love to propose an ongoing arrangement.

For $[retainer rate]/month, I'll:
- Maintain and update your existing automations
- Build 1–2 new automations per month
- Be available for questions and troubleshooting

This is [X]% of what a part-time assistant would cost, with zero training overhead.

Would you like to continue on that basis?"`}
          />
        </WorkflowStep>
      </WorkflowCard>
    </div>
  )
}

function ScalingTab() {
  return (
    <div>
      <WorkflowCard title="4 Stages from Side Hustle to Business">
        <WorkflowStep stepNumber={1} title="Know which stage you're in" workflowId="operator_scaling">
          <div className="space-y-3 mb-4">
            {[
              {
                stage: 'Stage 1: Side Hustle',
                revenue: '$1–3K/month',
                focus: 'Testimonials, case studies, referrals.',
              },
              {
                stage: 'Stage 2: Consistent Freelance',
                revenue: '$3–6K/month',
                focus: 'Productize your services. Raise prices if close rate exceeds 60%.',
              },
              {
                stage: 'Stage 3: Full Practice',
                revenue: '$6–12K/month',
                focus: "Retainer income covers base expenses. You're running a business.",
              },
              {
                stage: 'Stage 4: Scalable Business',
                revenue: '$12K+/month',
                focus: 'Subcontract, group training, digital products, online course.',
              },
            ].map((s) => (
              <div
                key={s.stage}
                className="bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-4 flex flex-wrap items-start justify-between gap-3"
              >
                <div>
                  <p className="text-white font-bold text-sm mb-1">{s.stage}</p>
                  <p className="text-zinc-400 text-xs">{s.focus}</p>
                </div>
                <span className="text-teal-400 text-xs font-bold bg-teal-500/10 border border-teal-500/30 px-2 py-1 rounded-full shrink-0">
                  {s.revenue}
                </span>
              </div>
            ))}
          </div>
        </WorkflowStep>

        <WorkflowStep stepNumber={2} title="Know when to raise prices" workflowId="operator_scaling">
          <p className="text-zinc-300 text-sm mb-3">Raise prices when ANY of these are true:</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {[
              '5+ completed projects',
              'Close rate above 60%',
              'You have a waitlist',
              '90 days since last increase',
            ].map((trigger) => (
              <span
                key={trigger}
                className="text-xs bg-teal-500/10 border border-teal-500/30 text-teal-300 px-3 py-1.5 rounded-full"
              >
                {trigger}
              </span>
            ))}
          </div>
          <p className="text-zinc-300 text-sm mb-4">
            How much:{' '}
            <span className="text-white font-semibold">20–30% per increase</span>.
          </p>
          <div className="bg-teal-500/5 border border-teal-500/30 rounded-lg px-4 py-3">
            <p className="text-zinc-300 text-sm">
              The automation consulting market barely exists yet. The people who start now will own it.
            </p>
          </div>
        </WorkflowStep>
      </WorkflowCard>

      {/* Final CTA — no upsell, this is the top tier */}
      <div className="mt-8 p-6 border border-teal-500/30 rounded-xl bg-teal-500/5">
        <h2 className="text-white text-xl font-bold mb-3">
          The automation consulting market barely exists yet.
        </h2>
        <p className="text-zinc-300 text-sm leading-relaxed">
          The people who start now will own it. You have the skills, the system, the templates, and
          the scripts. The only thing left is execution. Go.
        </p>
      </div>
    </div>
  )
}

export default function Operator() {
  const [activeTab, setActiveTab] = useState('start')

  const tabs = [
    { id: 'start', label: 'Start Here', content: <StartHereTab setActiveTab={setActiveTab} /> },
    { id: 'services', label: 'Services', content: <ServicesTab /> },
    { id: 'packaging', label: 'Packaging', content: <PackagingTab /> },
    { id: 'acquisition', label: 'Acquisition', content: <AcquisitionTab /> },
    { id: 'delivery', label: 'Delivery', content: <DeliveryTab /> },
    { id: 'scaling', label: 'Scaling', content: <ScalingTab /> },
    { id: 'templates', label: 'Templates', content: <PromptLibrary prompts={ALL_PROMPTS} /> },
  ]

  return (
    <div className="min-h-screen text-white flex flex-col" style={{ backgroundColor: '#111118' }}>
      <Navbar />
      <TabDashboard
        tabs={tabs}
        pageTitle="The Automation Consultant Kit"
        pageSubtitle="Turn Your AI Skills Into a Paying Business"
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <footer className="py-8 text-center border-t border-zinc-800">
        <p className="text-zinc-500 text-sm">© 2026 The Restack. Built for the ones who didn't wait.</p>
      </footer>
    </div>
  )
}
