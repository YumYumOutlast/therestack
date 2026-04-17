import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import TabDashboard from '../components/TabDashboard'
import WorkflowCard from '../components/WorkflowCard'
import WorkflowStep from '../components/WorkflowStep'
import PromptBlock from '../components/PromptBlock'
import PromptLibrary from '../components/PromptLibrary'
import ClaimForm from '../components/ClaimForm'
import XPBar from '../components/XPBar'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

const TOTAL_STEPS = 14

const ALL_PROMPTS = [
  {
    label: 'Time Capture Log Format',
    content: '[Time] | [Task] | [Category]\nExample: 9:00-9:30 | Responded to 6 client emails | Communication',
  },
  {
    label: 'Automation Scoring Spreadsheet',
    content: 'Columns: Task | Category | Hours/Week | Automation Score (1-5) | Potential Tool | Priority\nPriority Score = Automation Score × Hours Per Week\nHigher score = build this automation first.',
  },
  {
    label: 'Master Prompt Template',
    content: '"You are a [ROLE]. [CONTEXT about the situation]. [SPECIFIC TASK you want completed]. [CONSTRAINTS on length, tone, format, exclusions]. Structure the output as: [OUTPUT FORMAT]."',
  },
  {
    label: 'Prompt Chain — Step 1: Extract',
    content: '"Here are raw notes from 5 client feedback calls:\n[paste notes]\nExtract and organize into:\n1. Common themes (mentioned by 2+ clients)\n2. Unique concerns (mentioned by 1 client)\n3. Specific feature requests\n4. Sentiment per client"',
  },
  {
    label: 'Prompt Chain — Step 2: Analyze',
    content: '"Based on this organized feedback:\n[paste Step 1 output]\nIdentify:\n1. Top 3 issues by frequency and severity\n2. Quick fixes vs. structural problems\n3. Contradictions between clients\n4. The one change that improves satisfaction most"',
  },
  {
    label: 'Prompt Chain — Step 3: Deliver',
    content: '"Based on this analysis:\n[paste Step 2 output]\nWrite a Client Feedback Strategy Brief for leadership. Include:\n1. Executive summary (one paragraph)\n2. Priority matrix (top issues by impact and effort)\n3. Recommended actions for next quarter\n4. Risks if we don\'t act\nTone: data-driven, concise, suitable for a VP audience."',
  },
  {
    label: 'Automation Portfolio Tracker Columns',
    content: 'Name | Department | Date Built | Tools Used | Time Before (min) | Time After (min) | Frequency (×/week) | Weekly Saved | Monthly Saved | Status\nWeekly Saved = (Time Before − Time After) × Frequency\nMonthly Saved = Weekly Saved × 4.3',
  },
  {
    label: 'Dollar Value Formula',
    content: 'Hourly Rate = Annual Salary ÷ 2,080\n\n$60K/year → ~$29/hr\nSave 10 hrs/month → $290/month = $3,480/year\nSave 20 hrs/month → $580/month = $6,960/year',
  },
  {
    label: 'Promotion Proposal Email',
    content: 'Subject: Proposal: AI Efficiency Pilot\n\n"Over the past [X weeks], I\'ve been building AI-powered workflows that have saved our team approximately [X hours/month]. [Colleague 1] and [Colleague 2] have seen similar results after I helped them set up systems.\n\nI\'d like to propose a small pilot: I\'ll spend [X hours/week] helping [X team members] automate their top 3 time-wasters over the next 30 days. I\'ll track and report results.\n\nIf successful, this could save the department [estimated hours/dollars] annually.\n\nWould you be open to discussing this in our next 1:1?"',
  },
  {
    label: 'Promotion Conversation Opener',
    content: '"Over the past 90 days, I\'ve implemented systems that have saved our team [X hours/month]. That translates to approximately $[dollar amount] in productivity recovered. I\'d like to talk about expanding this work — and what that could look like in terms of my role."',
  },
]

const CALENDAR_WEEKS = [
  {
    id: 'week1',
    title: 'Week 1 — Foundation',
    subtitle: 'Days 1–7',
    step: 1,
    days: [
      { day: 'Day 1', task: 'Set 30-min timer. Start logging every task.' },
      { day: 'Day 2', task: 'Keep logging. No skipping. No estimating.' },
      { day: 'Day 3', task: 'Keep logging. Note patterns you spot.' },
      { day: 'Day 4', task: 'Keep logging. You\'re building the evidence.' },
      { day: 'Day 5', task: 'End of capture week. Keep going.' },
      { day: 'Day 6', task: 'Score every task 1–5. Calculate priority scores. Build Automation Roadmap.' },
      { day: 'Day 7', task: 'Create Efficiency Portfolio spreadsheet.' },
    ],
  },
  {
    id: 'week2',
    title: 'Week 2 — Quick Wins',
    subtitle: 'Days 8–14',
    step: 2,
    days: [
      { day: 'Day 8', task: 'Build Wave 1 automation #1.' },
      { day: 'Day 9', task: 'Build Wave 1 automation #2.' },
      { day: 'Day 10', task: 'Build Wave 1 automation #3.' },
      { day: 'Day 11', task: 'Refine and stabilize all Wave 1 automations.' },
      { day: 'Day 12', task: 'First Portfolio Review. Calculate weekly time saved + dollar equivalent.' },
      { day: 'Day 13', task: 'Help one colleague automate one task.' },
      { day: 'Day 14', task: 'Document everything you\'ve built so far.' },
    ],
  },
  {
    id: 'week3',
    title: 'Week 3 — High-Impact Builds',
    subtitle: 'Days 15–21',
    step: 3,
    days: [
      { day: 'Day 15', task: 'Build Wave 2 automation #1 (high-impact).' },
      { day: 'Day 16', task: 'Build Wave 2 automation #2.' },
      { day: 'Day 17', task: 'Build Wave 2 automation #3.' },
      { day: 'Day 18', task: 'Build your first prompt chain.' },
      { day: 'Day 19', task: 'Refine prompt chain. Test outputs.' },
      { day: 'Day 20', task: 'Second Portfolio Review. Target: 5–10+ hrs/month saved.' },
      { day: 'Day 21', task: 'Help Colleague #2. Different department.' },
    ],
  },
  {
    id: 'week4',
    title: 'Week 4 — Integration & Presentation',
    subtitle: 'Days 22–30',
    step: 4,
    days: [
      { day: 'Day 22', task: 'Wave 3 — connect automations into systems.' },
      { day: 'Day 23', task: 'Build multi-step Zap with conditional logic.' },
      { day: 'Day 24', task: 'Final automation build. System integration.' },
      { day: 'Day 25', task: 'Final Portfolio Review.' },
      { day: 'Day 26', task: 'Calculate total dollar impact. Prepare the numbers.' },
      { day: 'Day 27', task: 'Prepare promotion case.' },
      { day: 'Day 28', task: 'Draft and send the proposal email.' },
      { day: 'Day 29', task: 'Follow up if needed. Prepare for the conversation.' },
      { day: 'Day 30', task: 'Have the promotion conversation.' },
    ],
  },
]

function ProgressSummary() {
  const { user } = useAuth()
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!user) {
      setCount(0)
      return
    }
    supabase
      .from('progress')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('page', 'playbook')
      .eq('completed', true)
      .then(({ count: c }) => setCount(c ?? 0))
  }, [user])
  const total = TOTAL_STEPS
  const pct = total > 0 ? Math.round((count / total) * 100) : 0
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-zinc-400 text-sm">Playbook Progress</span>
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
        <p className="text-white font-bold text-lg mb-2">You're not here to use AI.</p>
        <p className="text-zinc-300 text-sm leading-relaxed">
          You're here to get promoted for it. There's a difference between someone who saves time and someone who turns that saved time into career leverage. This playbook is the system for doing the second thing.
        </p>
      </div>
      <XPBar />
      <ProgressSummary />
      <h3 className="text-white font-bold text-base mb-4">Your 5 Phases</h3>
      <div className="space-y-3">
        {[
          {
            title: 'Phase 1: Job Audit',
            desc: 'Track every task for one week. Score each one 1–5 on the automation spectrum. Build your priority roadmap.',
            tab: 'audit',
          },
          {
            title: 'Phase 2: Custom Workflows',
            desc: 'Master the prompt template, prompt chaining, and advanced multi-step Zapier automation.',
            tab: 'workflows',
          },
          {
            title: 'Phase 3: Your Portfolio',
            desc: 'Build your Automation Tracker. Convert time saved into dollar value. This is your promotion evidence.',
            tab: 'portfolio',
          },
          {
            title: 'Phase 4: Promotion Play',
            desc: 'Positioning framework, proposal email template, and the 4-part promotion conversation script.',
            tab: 'promotion',
          },
          {
            title: 'Phase 5: 30-Day Calendar',
            desc: 'Day-by-day implementation plan from audit to promotion conversation.',
            tab: 'calendar',
          },
        ].map(({ title, desc, tab }) => (
          <div
            key={tab}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex items-start justify-between gap-4"
          >
            <div>
              <p className="text-white font-semibold text-sm mb-1">{title}</p>
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

function JobAuditTab() {
  return (
    <div>
      <WorkflowCard
        title="The Job Audit Framework"
        timeSaved="Identifies 40–60% of your week to reclaim"
        tools="Timer + Spreadsheet"
      >
        <WorkflowStep stepNumber={1} title="Run the Time Capture Exercise" workflowId="playbook_audit">
          <p className="text-zinc-300 text-sm leading-relaxed mb-3">
            For one full work week, track every task in 30-minute blocks. Not categories — actual tasks, actual time.
          </p>
          <div className="space-y-1.5 mb-3">
            {[
              'Set a recurring 30-minute timer on your phone.',
              'Every time it goes off, write down what you just spent 30 minutes doing.',
              'Do this for 5 consecutive workdays. No estimating from memory.',
              'Categorize: COMMUNICATION · DOCUMENTATION · DATA WORK · MEETINGS · CREATIVE · ADMIN · DEEP WORK',
            ].map((item, i) => (
              <p key={i} className="text-zinc-300 text-sm flex items-start gap-2">
                <span className="text-teal-400 shrink-0 font-bold">{i + 1}.</span>
                {item}
              </p>
            ))}
          </div>
          <PromptBlock
            label="Time Log Format"
            content={'[Time] | [Task] | [Category]\nExample: 9:00-9:30 | Responded to 6 client emails | Communication'}
          />
          <div className="mt-3 bg-teal-500/5 border border-teal-500/30 rounded-lg px-4 py-3">
            <p className="text-zinc-300 text-sm">
              Communication and Admin typically consume{' '}
              <span className="text-white font-bold">40–50%</span> of the work week. Deep Work gets
              less than 20%. The goal is to flip that ratio.
            </p>
          </div>
        </WorkflowStep>

        <WorkflowStep
          stepNumber={2}
          title="Score every task on the Automation Spectrum (1–5)"
          workflowId="playbook_audit"
        >
          <div className="overflow-x-auto mb-3">
            <table className="w-full text-sm border-collapse min-w-[380px]">
              <thead>
                <tr className="border-b border-zinc-700">
                  <th className="text-teal-400 text-left py-2 pr-3 font-bold w-12">Score</th>
                  <th className="text-teal-400 text-left py-2 pr-3 font-bold">Label</th>
                  <th className="text-teal-400 text-left py-2 font-bold">Examples</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {[
                  ['5', 'Fully Automatable', 'Email sorting, data entry, meeting transcription'],
                  ['4', 'Mostly Automatable', 'Email drafts, report generation, expense categorization'],
                  ['3', 'AI-Assisted', 'Client proposals, complaint responses, performance reviews'],
                  ['2', 'Human-Led, AI-Enhanced', 'Strategy docs, presentations, negotiation prep'],
                  ['1', 'Human Only', 'Coaching, conflict resolution, leadership decisions'],
                ].map(([score, label, examples]) => (
                  <tr key={score}>
                    <td className="py-2 pr-3 text-teal-400 font-bold">{score}</td>
                    <td className="py-2 pr-3 text-white font-semibold text-xs">{label}</td>
                    <td className="py-2 text-zinc-400 text-xs">{examples}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <PromptBlock
            label="Scoring Spreadsheet"
            content={
              'Columns: Task | Category | Hours/Week | Automation Score (1-5) | Potential Tool | Priority\nPriority Score = Automation Score × Hours Per Week\nHigher score = build this automation first.'
            }
          />
        </WorkflowStep>

        <WorkflowStep stepNumber={3} title="Build your Automation Roadmap" workflowId="playbook_audit">
          <div className="space-y-2 mb-3">
            {[
              {
                wave: 'Wave 1 (Week 1–2)',
                label: 'Quick Wins',
                desc: 'Pick top 3–5 tasks that score 4–5 AND take less than 30 min to automate.',
              },
              {
                wave: 'Wave 2 (Week 2–3)',
                label: 'High-Impact Builds',
                desc: 'Top 3 tasks that score 3–4 AND take the most hours/week. 30–60 min each to build.',
              },
              {
                wave: 'Wave 3 (Week 3–4)',
                label: 'System Integration',
                desc: 'Connect individual automations. When they talk to each other, savings compound exponentially.',
              },
            ].map((w) => (
              <div key={w.wave} className="bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-teal-400 font-bold text-xs">{w.wave}:</span>
                  <span className="text-white font-semibold text-xs">{w.label}</span>
                </div>
                <p className="text-zinc-300 text-xs">{w.desc}</p>
              </div>
            ))}
          </div>
          <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3">
            <p className="text-zinc-300 text-sm">
              <span className="text-white font-semibold">Important:</span> Document everything as you
              build. Your documentation becomes career leverage.
            </p>
          </div>
        </WorkflowStep>
      </WorkflowCard>
    </div>
  )
}

function CustomWorkflowsTab() {
  return (
    <div>
      <WorkflowCard title="The Master Prompt Template" tools="Claude / ChatGPT">
        <p className="text-zinc-400 text-sm mb-4">5 components. Miss any one and output degrades.</p>
        <div className="space-y-2 mb-5">
          {[
            [
              'ROLE',
              'Tell AI who it is.',
              'Weak: "Write me an email." Strong: "You are a senior account manager at a B2B services company."',
            ],
            [
              'CONTEXT',
              'Give AI all relevant background.',
              'Include company, client, situation, history — whatever shapes the output.',
            ],
            [
              'TASK',
              'Be specific about what you want done.',
              '"Write a 3-sentence summary structured as: situation, complication, resolution." Not just "write a summary."',
            ],
            [
              'CONSTRAINTS',
              'Length, tone, format, exclusions.',
              '"Under 150 words. Professional tone. No buzzwords. No bullet points."',
            ],
            [
              'OUTPUT FORMAT',
              'Show AI what the result should look like.',
              'Paste an example, or describe it explicitly.',
            ],
          ].map(([comp, def, example]) => (
            <div key={comp} className="bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3">
              <p className="text-teal-400 text-xs font-bold tracking-widest uppercase mb-0.5">{comp}</p>
              <p className="text-white text-sm font-semibold mb-0.5">{def}</p>
              <p className="text-zinc-400 text-xs">{example}</p>
            </div>
          ))}
        </div>
        <WorkflowStep
          stepNumber={1}
          title="Write your first master prompt using this template"
          workflowId="playbook_workflows"
        >
          <PromptBlock
            label="Master Prompt Template"
            content={`"You are a [ROLE]. [CONTEXT about the situation]. [SPECIFIC TASK you want completed]. [CONSTRAINTS on length, tone, format, exclusions]. Structure the output as: [OUTPUT FORMAT]."`}
          />
        </WorkflowStep>
      </WorkflowCard>

      <WorkflowCard title="Prompt Chaining: When One Prompt Isn't Enough" tools="Claude / ChatGPT">
        <p className="text-zinc-400 text-sm mb-4">
          Use chaining when: the task has multiple distinct phases, input data is messy, or a single
          prompt keeps giving mediocre results.
        </p>
        <WorkflowStep stepNumber={2} title="Build a 3-part prompt chain" workflowId="playbook_workflows">
          <p className="text-zinc-400 text-xs mb-3">
            Example — Raw client feedback → Leadership strategy brief
          </p>
          <div className="space-y-3">
            <PromptBlock
              label="Step 1 — Extract"
              content={`"Here are raw notes from 5 client feedback calls:\n[paste notes]\nExtract and organize into:\n1. Common themes (mentioned by 2+ clients)\n2. Unique concerns (mentioned by 1 client)\n3. Specific feature requests\n4. Sentiment per client"`}
            />
            <PromptBlock
              label="Step 2 — Analyze"
              content={`"Based on this organized feedback:\n[paste Step 1 output]\nIdentify:\n1. Top 3 issues by frequency and severity\n2. Quick fixes vs. structural problems\n3. Contradictions between clients\n4. The one change that improves satisfaction most"`}
            />
            <PromptBlock
              label="Step 3 — Deliver"
              content={`"Based on this analysis:\n[paste Step 2 output]\nWrite a Client Feedback Strategy Brief for leadership. Include:\n1. Executive summary (one paragraph)\n2. Priority matrix (top issues by impact and effort)\n3. Recommended actions for next quarter\n4. Risks if we don't act\nTone: data-driven, concise, suitable for a VP audience."`}
            />
          </div>
        </WorkflowStep>
      </WorkflowCard>

      <WorkflowCard title="Advanced Zapier: Multi-Step Automations" tools="Zapier">
        <WorkflowStep
          stepNumber={3}
          title="Build a multi-step Zap with conditional logic"
          workflowId="playbook_workflows"
        >
          <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 mb-4">
            <p className="text-teal-400 text-xs font-bold tracking-widest uppercase mb-2">
              Multi-Step Zap Architecture
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {['TRIGGER', 'Process', 'Transform', 'Decision', 'Action', 'Notify'].map((step, i, arr) => (
                <span key={step} className="flex items-center gap-2">
                  <span className="text-teal-300 bg-zinc-900 border border-zinc-700 px-2 py-1 rounded text-xs font-mono">
                    {step}
                  </span>
                  {i < arr.length - 1 && <span className="text-zinc-600 text-xs">→</span>}
                </span>
              ))}
            </div>
          </div>
          <p className="text-white font-semibold text-sm mb-2">Conditional Logic Examples</p>
          <div className="space-y-1.5">
            {[
              'IF email contains "urgent" → Route to priority inbox AND notify via Slack',
              'IF invoice amount > $5,000 → Require manager approval',
              'IF lead source = "website" → Add to sequence A; IF "referral" → Add to sequence B',
            ].map((rule) => (
              <p
                key={rule}
                className="text-zinc-300 text-xs font-mono bg-zinc-900 border border-zinc-700 rounded px-3 py-2"
              >
                {rule}
              </p>
            ))}
          </div>
        </WorkflowStep>
      </WorkflowCard>
    </div>
  )
}

function PortfolioTab() {
  return (
    <div>
      <WorkflowCard
        title="The Efficiency Portfolio"
        timeSaved="Builds your promotion case"
        tools="Google Sheets"
      >
        <WorkflowStep
          stepNumber={1}
          title="Create your Automation Tracker spreadsheet"
          workflowId="playbook_portfolio"
        >
          <p className="text-zinc-300 text-sm leading-relaxed mb-3">
            Name it <span className="text-white font-semibold">"My Automation Portfolio"</span>
          </p>
          <div className="overflow-x-auto mb-3">
            <table className="w-full text-sm border-collapse min-w-[480px]">
              <thead>
                <tr className="border-b border-zinc-700">
                  {['Col', 'Field', 'Notes'].map((h) => (
                    <th key={h} className="text-teal-400 text-left py-2 pr-3 font-bold">
                      {h}
                    </th>
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
                    <td className="py-2 pr-3 text-teal-400 font-mono font-bold">{col}</td>
                    <td className="py-2 pr-3 text-white font-semibold text-xs">{field}</td>
                    <td className="py-2 text-zinc-400 text-xs">{note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <PromptBlock
            label="Savings Formula"
            content={
              'Weekly Saved = (Time Before − Time After) × Frequency per week\nMonthly Saved = Weekly Saved × 4.3'
            }
          />
        </WorkflowStep>

        <WorkflowStep
          stepNumber={2}
          title="Convert time saved into dollar value"
          workflowId="playbook_portfolio"
        >
          <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-4 mb-3">
            <p className="text-zinc-300 text-sm mb-3">
              Your hourly rate ={' '}
              <span className="text-teal-300 font-mono">annual salary ÷ 2,080</span>
            </p>
            <div className="space-y-2">
              {[
                ['$60K/year salary', '~$29/hr'],
                ['Save 10 hrs/month', '$290/month = $3,480/year'],
                ['Save 20 hrs/month', '$580/month = $6,960/year'],
              ].map(([input, result]) => (
                <div
                  key={input}
                  className="flex justify-between items-center border-b border-zinc-700 pb-2"
                >
                  <span className="text-zinc-300 text-xs">{input}</span>
                  <span className="text-teal-400 font-bold text-xs">{result}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-teal-500/5 border border-teal-500/30 rounded-lg px-4 py-3">
            <p className="text-zinc-300 text-sm">
              Leadership thinks in dollars, not minutes. This is the math that gets you promoted.
            </p>
          </div>
        </WorkflowStep>
      </WorkflowCard>
    </div>
  )
}

function PromotionPlayTab() {
  return (
    <div>
      <WorkflowCard title="Positioning Yourself as the AI Person">
        <WorkflowStep
          stepNumber={1}
          title="Build your positioning and send the proposal"
          workflowId="playbook_promotion"
        >
          <div className="space-y-2 mb-4">
            {[
              [
                'Start with results, not technology',
                'Never lead with "I\'ve been using AI tools." Lead with "I\'ve reduced report generation time by 75%."',
              ],
              [
                'Share your wins publicly but subtly',
                'Mention time savings in meetings. Let the number do the positioning.',
              ],
              [
                'Offer to help one colleague',
                'Do this 3 times. Each one is a testimonial and a referral waiting to happen.',
              ],
              [
                'Propose an internal AI Efficiency initiative',
                'Turn a personal practice into a departmental initiative. That\'s leadership.',
              ],
            ].map(([title, desc], i) => (
              <div
                key={title}
                className="flex items-start gap-3 bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3"
              >
                <span className="text-teal-400 font-bold shrink-0 text-sm">{i + 1}.</span>
                <div>
                  <p className="text-white font-semibold text-sm mb-0.5">{title}</p>
                  <p className="text-zinc-400 text-xs">{desc}</p>
                </div>
              </div>
            ))}
          </div>
          <PromptBlock
            label="Proposal Email Template"
            content={`Subject: Proposal: AI Efficiency Pilot\n\n"Over the past [X weeks], I've been building AI-powered workflows that have saved our team approximately [X hours/month]. [Colleague 1] and [Colleague 2] have seen similar results after I helped them set up systems.\n\nI'd like to propose a small pilot: I'll spend [X hours/week] helping [X team members] automate their top 3 time-wasters over the next 30 days. I'll track and report results.\n\nIf successful, this could save the department [estimated hours/dollars] annually.\n\nWould you be open to discussing this in our next 1:1?"`}
          />
        </WorkflowStep>

        <WorkflowStep
          stepNumber={2}
          title="Run the promotion conversation"
          workflowId="playbook_promotion"
        >
          <p className="text-zinc-400 text-sm leading-relaxed mb-3">
            You're presenting a business case, not asking for a favor. Use this 4-part framework.
          </p>
          <div className="space-y-2 mb-4">
            {[
              [
                'Open with business impact',
                '"Over the past 90 days, I\'ve implemented systems that have saved our team [X hours/month]..."',
              ],
              [
                'Connect to company priorities',
                'Link your work to a current initiative, goal, or pain point leadership is already focused on.',
              ],
              [
                'Propose the expanded role',
                '"I\'d like to take on X responsibility" is better than "I\'d like a promotion."',
              ],
              [
                'Make it easy to say yes',
                'Propose a 90-day pilot. Lower the risk. Make the decision obvious.',
              ],
            ].map(([step, desc], i) => (
              <div
                key={step}
                className="flex items-start gap-3 bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3"
              >
                <span className="text-teal-400 font-bold shrink-0 text-sm">{i + 1}.</span>
                <div>
                  <p className="text-white font-semibold text-sm mb-0.5">{step}</p>
                  <p className="text-zinc-400 text-xs">{desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-teal-500/5 border border-teal-500/30 rounded-lg px-4 py-3">
            <p className="text-zinc-300 text-sm">
              <span className="text-white font-semibold">Key insight:</span> You're not asking for a
              promotion because you've been a good employee. You're presenting a business case.
            </p>
          </div>
        </WorkflowStep>
      </WorkflowCard>
    </div>
  )
}

function CalendarTab() {
  return (
    <div>
      {CALENDAR_WEEKS.map((w) => (
        <WorkflowCard key={w.id} title={w.title} id={w.id}>
          <WorkflowStep stepNumber={w.step} title={w.subtitle} workflowId="playbook_calendar">
            <div className="grid grid-cols-2 sm:grid-cols-7 gap-2">
              {w.days.map((d) => (
                <div key={d.day} className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-2.5">
                  <p className="text-teal-400 text-xs font-bold mb-1">{d.day}</p>
                  <p className="text-zinc-300 text-xs leading-relaxed">{d.task}</p>
                </div>
              ))}
            </div>
          </WorkflowStep>
        </WorkflowCard>
      ))}

      <div className="mt-8 p-6 border border-teal-500/30 rounded-xl bg-teal-500/5">
        <h2 className="text-white text-xl font-bold mb-2">Ready to sell this?</h2>
        <p className="text-zinc-300 text-sm leading-relaxed mb-4">
          The Automation Consultant Kit teaches you to package these exact skills into a service
          businesses will pay $50–150/hr for. Client templates, pricing frameworks, discovery call
          scripts, and a 30-day plan to land your first paying client.
        </p>
        <a
          href="https://getfluxe.gumroad.com/l/AutomationConsultant"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-teal-500 hover:bg-teal-400 text-black font-bold px-6 py-3 rounded-lg transition-colors no-underline"
        >
          Get the Consultant Kit — $149
        </a>
      </div>
    </div>
  )
}

export default function Playbook() {
  const [activeTab, setActiveTab] = useState('start')

  const tabs = [
    { id: 'start', label: 'Start Here', content: <StartHereTab setActiveTab={setActiveTab} /> },
    { id: 'audit', label: 'Job Audit', content: <JobAuditTab /> },
    { id: 'workflows', label: 'Custom Workflows', content: <CustomWorkflowsTab /> },
    { id: 'portfolio', label: 'Your Portfolio', content: <PortfolioTab /> },
    { id: 'promotion', label: 'Promotion Play', content: <PromotionPlayTab /> },
    { id: 'calendar', label: '30-Day Calendar', content: <CalendarTab /> },
    { id: 'prompts', label: 'Prompt Library', content: <PromptLibrary prompts={ALL_PROMPTS} /> },
    { id: 'rankup',  label: 'Rank Up',        content: <ClaimForm gate="playbook" /> },
  ]

  return (
    <div className="min-h-screen text-white flex flex-col" style={{ backgroundColor: '#111118' }}>
      <Navbar />
      <TabDashboard
        tabs={tabs}
        pageTitle="The AI-Proof Playbook"
        pageSubtitle="The Complete System for Becoming Your Company's AI Strategist"
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <footer className="py-8 text-center border-t border-zinc-800">
        <p className="text-zinc-500 text-sm">© 2026 The Restack. Built for the ones who didn't wait.</p>
      </footer>
    </div>
  )
}
