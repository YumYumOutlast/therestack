import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import TabDashboard from '../components/TabDashboard'
import WorkflowCard from '../components/WorkflowCard'
import WorkflowStep from '../components/WorkflowStep'
import PromptBlock from '../components/PromptBlock'
import PromptLibrary from '../components/PromptLibrary'

// ── localStorage step keys ─────────────────────────────────────────────────
const DEPT_STEPS = {
  clients:  ['restack_starter_clients_1_step_1','restack_starter_clients_1_step_2','restack_starter_clients_1_step_3','restack_starter_clients_1_step_4','restack_starter_clients_2_step_1','restack_starter_clients_2_step_2','restack_starter_clients_2_step_3','restack_starter_clients_3_step_1','restack_starter_clients_3_step_2','restack_starter_clients_3_step_3'],
  finance:  ['restack_starter_finance_1_step_1','restack_starter_finance_1_step_2','restack_starter_finance_1_step_3','restack_starter_finance_2_step_1','restack_starter_finance_2_step_2','restack_starter_finance_2_step_3','restack_starter_finance_3_step_1','restack_starter_finance_3_step_2','restack_starter_finance_3_step_3'],
  marketing:['restack_starter_mktg_1_step_1','restack_starter_mktg_1_step_2','restack_starter_mktg_2_step_1','restack_starter_mktg_2_step_2','restack_starter_mktg_3_step_1','restack_starter_mktg_3_step_2'],
  hr:       ['restack_starter_hr_1_step_1','restack_starter_hr_1_step_2','restack_starter_hr_2_step_1','restack_starter_hr_2_step_2','restack_starter_hr_3_step_1'],
  projects: ['restack_starter_proj_1_step_1','restack_starter_proj_2_step_1','restack_starter_proj_2_step_2','restack_starter_proj_2_step_3','restack_starter_proj_3_step_1','restack_starter_proj_3_step_2','restack_starter_proj_3_step_3'],
}
const ALL_STEP_KEYS = Object.values(DEPT_STEPS).flat()

// ── All prompts ────────────────────────────────────────────────────────────
const ALL_PROMPTS = [
  { label: 'Client Follow-Up from CRM Notes', content: `"I just had a [call/meeting] with [client name] at [company]. Here are my raw notes:\n[paste notes]\n\nWrite a professional follow-up email that:\n- References key decisions made\n- Confirms action items and deadlines\n- Addresses any concerns they raised\n- Ends with a clear next step\n\nTone: [warm/formal/casual] and confident. Keep it under 150 words."` },
  { label: 'Client Onboarding Email Sequence', content: `"I run a [type of business]. New client onboarding needs a 5-email sequence:\nEmail 1 (Day 0): Welcome + what to expect + first action item\nEmail 2 (Day 2): Setup / intake guidance\nEmail 3 (Day 5): First week check-in\nEmail 4 (Day 10): First deliverable preview\nEmail 5 (Day 21): Progress check + next phase\n\nTone: professional but human. Each under 150 words. Include subject lines."` },
  { label: 'Complaint Response', content: `"A client sent this:\n[paste email]\n\nContext: [what actually happened]\n\nDraft a response that:\n- Acknowledges their frustration without being defensive\n- Takes responsibility where appropriate\n- Explains what happened briefly and factually\n- Offers a specific resolution\n- Ends with reassurance\n\nTone: empathetic, calm, solution-focused. Under 200 words."` },
  { label: 'Invoice Data Extraction', content: `"Extract from this invoice:\n- Vendor Name\n- Invoice Number\n- Date / Due Date\n- Line Items (description + amount)\n- Subtotal / Tax / Total\n\n[paste invoice text]\n\nFormat as: Vendor | Invoice # | Date | Due | Total | Category"` },
  { label: 'Smart Expense Categorization', content: `"My expense categories:\n- Software: SaaS, apps, cloud services\n- Office: supplies, equipment\n- Travel: flights, hotels, rideshare\n- Meals: client dinners, team lunches\n- Marketing: ads, design services\n- Professional: legal, accounting\n- Payroll: salaries, contractors\n\nCategorize these transactions. Mark uncertain ones as 'REVIEW':\n[paste transaction list]"` },
  { label: 'Monthly Financial Summary', content: `"Monthly budget vs actual:\nCategory | Budget | Actual\nSoftware | $2,000 | $2,450\nMarketing | $5,000 | $3,200\n[continue your data]\n\nCreate executive summary with:\n1. One-paragraph overview\n2. Top 3 over budget with explanations\n3. Top 3 under budget with explanations\n4. Total variance\n5. Recommended actions"` },
  { label: 'Social Media Posts from Talking Point', content: `"Create posts for each platform from this talking point: [idea]\n\n1. LinkedIn (150-200 words, professional but personal)\n2. X/Twitter (under 280 chars, punchy)\n3. Instagram caption (casual, relatable, CTA)\n4. Facebook (conversational, ask a question)\n\nMy brand voice: [5 words describing your style]"` },
  { label: 'Blog Outline Builder', content: `"Blog outline for: [topic]\nAudience: [who]\nGoal: [inform/persuade/teach]\nLength: [word count]\n\nProvide:\n1. Three headline options\n2. Introduction hook (2 sentences)\n3. 4-6 section headers with 2-3 key points each\n4. Conclusion with takeaway\n5. Call to action"` },
  { label: 'Blog Repurpose Prompt', content: `"Take this post and create:\n1. LinkedIn summary (150 words)\n2. X/Twitter thread (5-7 tweets)\n3. Email newsletter version (300 words)"` },
  { label: 'Email Newsletter from Bullets', content: `"Write a weekly newsletter from these bullets:\n[paste bullets]\n\nFormat:\n- Subject line (curiosity-driven, under 50 chars)\n- Opening hook (personal, relatable)\n- Main section: expand best bullet into 2-3 paragraphs\n- Quick hits: remaining bullets as short list\n- Closing: one sentence CTA\n\n400-600 words. Tone: [your voice]"` },
  { label: 'Job Description Generator', content: `"Job description for:\nRole: [title] | Dept: [team] | Reports to: [manager]\nDay-to-day: [2-3 sentences]\nSalary: [range] | Location: [remote/hybrid/office]\nLevel: [junior/mid/senior]\n\nFormat:\n1. About the role (2-3 sentences)\n2. What you'll do (5-7 bullets)\n3. Must-haves (4-5 points)\n4. Nice-to-haves (2-3 points)\n5. What we offer\n\nUse inclusive language. Avoid jargon."` },
  { label: 'Interview Question Builder', content: `"From this job description, generate:\n[paste JD]\n\n1. TECHNICAL (5 questions) — 'Tell me about a time...' format\n2. PROBLEM-SOLVING (3 questions) — realistic scenarios\n3. CULTURE (3 questions) — teamwork and communication\n\nFor each: what a GOOD answer includes vs. RED FLAG answer."` },
  { label: '360 Feedback Summarizer', content: `"Synthesize 360 feedback for [name], [role]:\nManager: [paste]\nPeer 1: [paste]\nPeer 2: [paste]\nSelf-Assessment: [paste]\n\nCreate:\n1. Top 3 strengths (with examples)\n2. Top 2 growth areas (with examples)\n3. Overall narrative (balanced, constructive)\n4. Development goals for next quarter\n\nFocus on behaviors, not personality."` },
  { label: 'Project Status Update', content: `"Weekly project status update:\nProject: [name] | Period: [dates]\n[paste task list]\n\nFormat:\n1. Executive Summary (3 sentences)\n2. Status by workstream (GREEN / AMBER / RED)\n3. Key accomplishments\n4. Blockers and risks\n5. Next week priorities\n6. Decisions needed from stakeholders"` },
  { label: 'Risk Assessment', content: `"Analyze for risks:\nProject: [description]\nTimeline: [dates] | Team: [size] | Budget: [amount]\nStatus: [on track/behind]\nNotes: [paste recent meeting notes]\nTasks: [paste task list]\n\nIdentify risks in: Timeline, Budget, Resources, Dependencies, Scope, Quality\n\nFor each: describe, rate Severity (H/M/L), rate Likelihood (H/M/L), suggest mitigation."` },
  { label: 'Scope of Work from Meeting Notes', content: `"Create a SOW from these notes:\n[paste everything]\n\nStructure:\n1. Project Overview\n2. Objectives (3-5 measurable)\n3. Scope of Work (deliverables with descriptions)\n4. Out of Scope (what's NOT included)\n5. Timeline and Milestones\n6. Assumptions\n7. Dependencies\n8. Acceptance Criteria\n\nFlag ambiguous items with [NEEDS CLARIFICATION]."` },
]

// ── Shared helpers ─────────────────────────────────────────────────────────
function ProgressSummary({ stepKeys }) {
  const [completed, setCompleted] = useState(0)
  useEffect(() => {
    setCompleted(stepKeys.filter((k) => localStorage.getItem(k) === 'true').length)
  }, [stepKeys])
  const total = stepKeys.length
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0
  return (
    <div className="mt-8 bg-zinc-900 border border-zinc-800 rounded-xl p-5">
      <div className="flex justify-between items-center mb-2">
        <span className="text-zinc-400 text-sm">Your progress</span>
        <span className="text-teal-400 text-sm font-bold">{completed} of {total} steps complete</span>
      </div>
      <div className="w-full bg-zinc-800 rounded-full h-2">
        <div className="bg-teal-500 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function DeptBanner({ aiHandles, needsYou }) {
  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-lg px-5 py-4 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div>
        <p className="text-teal-400 text-xs font-bold tracking-widest uppercase mb-1">AI handles</p>
        <p className="text-zinc-300 text-sm">{aiHandles}</p>
      </div>
      <div>
        <p className="text-zinc-500 text-xs font-bold tracking-widest uppercase mb-1">Still needs you</p>
        <p className="text-zinc-400 text-sm">{needsYou}</p>
      </div>
    </div>
  )
}

function ProTip({ children }) {
  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-lg px-5 py-4 mt-3">
      <p className="text-teal-400 text-xs font-bold tracking-widest uppercase mb-2">Pro Tip</p>
      <p className="text-zinc-300 text-sm leading-relaxed">{children}</p>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// TAB CONTENT COMPONENTS
// ══════════════════════════════════════════════════════════════════════════

function StartHereTab({ setActiveTab }) {
  const depts = [
    { id: 'clients',   name: 'Client & Customer Management', count: '3 workflows', desc: 'Eliminate manual follow-ups, late check-ins, and dropped handoffs.' },
    { id: 'finance',   name: 'Invoicing & Finance',          count: '3 workflows', desc: 'Stop chasing invoices. Your books stay clean without you touching them.' },
    { id: 'marketing', name: 'Content & Marketing',          count: '3 workflows', desc: 'One talking point becomes 80 pieces of content a month.' },
    { id: 'hr',        name: 'HR & People Operations',       count: '3 workflows', desc: 'Hire faster, review cleaner, onboard smoother.' },
    { id: 'projects',  name: 'Project Management',           count: '3 workflows', desc: 'Status reports, risk assessments, and SOWs — automated.' },
  ]
  return (
    <div>
      <h2 className="text-white font-bold text-2xl mb-2">15 workflows. 5 departments. Start where it hurts.</h2>
      <p className="text-zinc-400 text-sm leading-relaxed mb-8">
        Don't read all of this. Find your department. Pick your biggest time-waster. Set it up.
      </p>
      <div className="space-y-3">
        {depts.map((dept) => (
          <div key={dept.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-white font-bold">{dept.name}</span>
                <span className="bg-zinc-800 text-teal-400 text-xs px-2 py-0.5 rounded-full">{dept.count}</span>
              </div>
              <p className="text-zinc-400 text-sm">{dept.desc}</p>
            </div>
            <button
              onClick={() => setActiveTab(dept.id)}
              className="shrink-0 text-teal-400 border border-teal-500/40 text-sm font-medium px-4 py-2 rounded-lg hover:bg-teal-500/10 transition-colors whitespace-nowrap"
            >
              Go to {dept.name.split(' ')[0]} →
            </button>
          </div>
        ))}
      </div>
      <ProgressSummary stepKeys={ALL_STEP_KEYS} />
    </div>
  )
}

function ClientsTab() {
  return (
    <div>
      <DeptBanner
        aiHandles="Follow-up drafts, onboarding sequences, complaint responses, meeting prep"
        needsYou="Relationship judgment, emotional subtext, strategic decisions, trust-building"
      />
      <WorkflowCard title="1. Auto-Draft Client Follow-Ups from CRM Notes" timeSaved="~25 min/day" tools="ChatGPT + CRM" id="c1">
        <WorkflowStep stepNumber={1} title="Copy your raw CRM notes after any client interaction" workflowId="starter_clients_1">
          <p className="text-zinc-300 text-sm">Don't clean them up. Messy bullets are fine.</p>
        </WorkflowStep>
        <WorkflowStep stepNumber={2} title="Use this prompt" workflowId="starter_clients_1">
          <PromptBlock content={`"I just had a [call/meeting] with [client name] at [company]. Here are my raw notes:\n[paste notes]\n\nWrite a professional follow-up email that:\n- References key decisions made\n- Confirms action items and deadlines\n- Addresses any concerns they raised\n- Ends with a clear next step\n\nTone: [warm/formal/casual] and confident. Keep it under 150 words."`} />
        </WorkflowStep>
        <WorkflowStep stepNumber={3} title="Add the human layer" workflowId="starter_clients_1">
          <p className="text-zinc-300 text-sm">One personal detail, emotional calibration, sensitive info you wouldn't put in a prompt.</p>
        </WorkflowStep>
        <WorkflowStep stepNumber={4} title="Save your best outputs as templates" workflowId="starter_clients_1">
          <p className="text-zinc-300 text-sm">Organized by situation: post-meeting, post-proposal, check-in, escalation.</p>
        </WorkflowStep>
      </WorkflowCard>

      <WorkflowCard title="2. AI-Generated Client Onboarding Sequence" timeSaved="~2 hrs (one-time build)" tools="ChatGPT + Gmail + Zapier" id="c2">
        <WorkflowStep stepNumber={1} title="Define your onboarding journey in 5 sentences" workflowId="starter_clients_2">
          <ol className="space-y-1 mt-2">
            {['What does the client need to do first?', 'What should they expect in week 1?', "What's the first deliverable?", 'How do they reach you?', 'What does success look like at 30 days?'].map((q, i) => (
              <li key={i} className="flex items-start gap-2 text-zinc-300 text-sm"><span className="text-teal-400 shrink-0">{i + 1}.</span>{q}</li>
            ))}
          </ol>
        </WorkflowStep>
        <WorkflowStep stepNumber={2} title="Generate the full 5-email sequence" workflowId="starter_clients_2">
          <PromptBlock content={`"I run a [type of business]. New client onboarding needs a 5-email sequence:\nEmail 1 (Day 0): Welcome + what to expect + first action item\nEmail 2 (Day 2): Setup / intake guidance\nEmail 3 (Day 5): First week check-in\nEmail 4 (Day 10): First deliverable preview\nEmail 5 (Day 21): Progress check + next phase\n\nTone: professional but human. Each under 150 words. Include subject lines."`} />
        </WorkflowStep>
        <WorkflowStep stepNumber={3} title="Automate the send" workflowId="starter_clients_2">
          <p className="text-zinc-300 text-sm">Set up as Gmail templates, or connect CRM to Gmail via Zapier — new client added = sequence starts automatically.</p>
        </WorkflowStep>
      </WorkflowCard>

      <WorkflowCard title="3. Complaint Response System" timeSaved="~15 min/incident" tools="ChatGPT" id="c3">
        <WorkflowStep stepNumber={1} title="Use this prompt" workflowId="starter_clients_3">
          <PromptBlock content={`"A client sent this:\n[paste email]\n\nContext: [what actually happened]\n\nDraft a response that:\n- Acknowledges their frustration without being defensive\n- Takes responsibility where appropriate\n- Explains what happened briefly and factually\n- Offers a specific resolution\n- Ends with reassurance\n\nTone: empathetic, calm, solution-focused. Under 200 words."`} />
        </WorkflowStep>
        <WorkflowStep stepNumber={2} title="Check emotional tone" workflowId="starter_clients_3">
          <p className="text-zinc-300 text-sm">Does it acknowledge their feeling, not just the facts?</p>
        </WorkflowStep>
        <WorkflowStep stepNumber={3} title="Build a response library by complaint type" workflowId="starter_clients_3">
          <p className="text-zinc-300 text-sm">After 30 days you'll have 80% of complaints covered. Response time drops from 20 min to 3 min.</p>
          <ProTip>Never send within 60 seconds of reading the complaint. AI removes writing time. You still need thinking time.</ProTip>
        </WorkflowStep>
      </WorkflowCard>
    </div>
  )
}

function FinanceTab() {
  return (
    <div>
      <DeptBanner
        aiHandles="Extracting invoice data, categorizing expenses, financial summaries, variance explanations"
        needsYou="Verifying extracted numbers, judgment on ambiguous expenses, interpreting trends, approvals"
      />
      <WorkflowCard title="4. Invoice Data Extraction to Spreadsheet" timeSaved="~45 min/week" tools="ChatGPT + Google Sheets" id="f1">
        <WorkflowStep stepNumber={1} title="Use this prompt" workflowId="starter_finance_1">
          <PromptBlock content={`"Extract from this invoice:\n- Vendor Name\n- Invoice Number\n- Date / Due Date\n- Line Items (description + amount)\n- Subtotal / Tax / Total\n\n[paste invoice text]\n\nFormat as: Vendor | Invoice # | Date | Due | Total | Category"`} />
        </WorkflowStep>
        <WorkflowStep stepNumber={2} title="Set up your tracking sheet" workflowId="starter_finance_1">
          <p className="text-zinc-300 text-sm font-mono text-xs bg-zinc-900 border border-zinc-700 rounded p-3">Date Received | Vendor | Invoice # | Amount | Due Date | Category | Status | Notes</p>
        </WorkflowStep>
        <WorkflowStep stepNumber={3} title="Batch process weekly" workflowId="starter_finance_1">
          <p className="text-zinc-300 text-sm">Create a Gmail label "To Process." Friday afternoon: open all labeled emails, batch-extract into your sheet.</p>
          <ProTip>Always verify dollar amounts. AI occasionally misreads numbers from PDFs.</ProTip>
        </WorkflowStep>
      </WorkflowCard>

      <WorkflowCard title="5. Smart Expense Categorization" timeSaved="~1 hr/month" tools="ChatGPT + bank export CSV" id="f2">
        <WorkflowStep stepNumber={1} title="Use this prompt" workflowId="starter_finance_2">
          <PromptBlock content={`"My expense categories:\n- Software: SaaS, apps, cloud services\n- Office: supplies, equipment\n- Travel: flights, hotels, rideshare\n- Meals: client dinners, team lunches\n- Marketing: ads, design services\n- Professional: legal, accounting\n- Payroll: salaries, contractors\n\nCategorize these transactions. Mark uncertain ones as 'REVIEW':\n[paste transaction list]"`} />
        </WorkflowStep>
        <WorkflowStep stepNumber={2} title="Export monthly statement as CSV" workflowId="starter_finance_2">
          <p className="text-zinc-300 text-sm">Paste descriptions and amounts directly into the prompt.</p>
        </WorkflowStep>
        <WorkflowStep stepNumber={3} title="Build your rulebook" workflowId="starter_finance_2">
          <p className="text-zinc-300 text-sm">Each month note which vendors AI flagged. By month 3: 95%+ accuracy on first pass.</p>
        </WorkflowStep>
      </WorkflowCard>

      <WorkflowCard title="6. End-of-Month Financial Summary Generator" timeSaved="~2 hrs/month" tools="ChatGPT + your budget sheet" id="f3">
        <WorkflowStep stepNumber={1} title="Use this prompt" workflowId="starter_finance_3">
          <PromptBlock content={`"Monthly budget vs actual:\nCategory | Budget | Actual\nSoftware | $2,000 | $2,450\nMarketing | $5,000 | $3,200\n[continue your data]\n\nCreate executive summary with:\n1. One-paragraph overview\n2. Top 3 over budget with explanations\n3. Top 3 under budget with explanations\n4. Total variance\n5. Recommended actions"`} />
        </WorkflowStep>
        <WorkflowStep stepNumber={2} title="Add insider context" workflowId="starter_finance_3">
          <p className="text-zinc-300 text-sm">AI gives structural analysis. You add the WHY behind each variance.</p>
        </WorkflowStep>
        <WorkflowStep stepNumber={3} title="After 3 months, prompt AI to identify trends" workflowId="starter_finance_3">
          <p className="text-zinc-300 text-sm">Paste the last 3 monthly summaries and ask for pattern analysis.</p>
        </WorkflowStep>
      </WorkflowCard>
    </div>
  )
}

function MarketingTab() {
  return (
    <div>
      <DeptBanner
        aiHandles="Social post drafts, blog outlines, newsletter drafts, content repurposing"
        needsYou="Original ideas, brand voice calibration, strategic decisions, audience empathy"
      />
      <WorkflowCard title="7. Social Media Posts from a Single Talking Point" timeSaved="~3 hrs/week" tools="ChatGPT + scheduler" id="m1">
        <WorkflowStep stepNumber={1} title="Use this prompt" workflowId="starter_mktg_1">
          <PromptBlock content={`"Create posts for each platform from this talking point: [idea]\n\n1. LinkedIn (150-200 words, professional but personal)\n2. X/Twitter (under 280 chars, punchy)\n3. Instagram caption (casual, relatable, CTA)\n4. Facebook (conversational, ask a question)\n\nMy brand voice: [5 words describing your style]"`} />
        </WorkflowStep>
        <WorkflowStep stepNumber={2} title="Build a talking points bank" workflowId="starter_mktg_1">
          <p className="text-zinc-300 text-sm">20 talking points/month × 4 platforms = 80 pieces of content. Under 2 hours total.</p>
          <ProTip>The 20% you edit in is what makes it YOUR content.</ProTip>
        </WorkflowStep>
      </WorkflowCard>

      <WorkflowCard title="8. Blog Outline Builder + Repurpose Engine" timeSaved="~1 hr/post" tools="ChatGPT" id="m2">
        <WorkflowStep stepNumber={1} title="Build the outline" workflowId="starter_mktg_2">
          <PromptBlock content={`"Blog outline for: [topic]\nAudience: [who]\nGoal: [inform/persuade/teach]\nLength: [word count]\n\nProvide:\n1. Three headline options\n2. Introduction hook (2 sentences)\n3. 4-6 section headers with 2-3 key points each\n4. Conclusion with takeaway\n5. Call to action"`} />
        </WorkflowStep>
        <WorkflowStep stepNumber={2} title="Repurpose one blog into 4 channels" workflowId="starter_mktg_2">
          <PromptBlock content={`"Take this post and create:\n1. LinkedIn summary (150 words)\n2. X/Twitter thread (5-7 tweets)\n3. Email newsletter version (300 words)"`} />
          <ProTip>Don't let AI write your intro. That's where your voice lives.</ProTip>
        </WorkflowStep>
      </WorkflowCard>

      <WorkflowCard title="9. Email Newsletter from Bullet Points" timeSaved="~1.5 hrs/week" tools="ChatGPT + email platform" id="m3">
        <WorkflowStep stepNumber={1} title="Use this prompt" workflowId="starter_mktg_3">
          <PromptBlock content={`"Write a weekly newsletter from these bullets:\n[paste bullets]\n\nFormat:\n- Subject line (curiosity-driven, under 50 chars)\n- Opening hook (personal, relatable)\n- Main section: expand best bullet into 2-3 paragraphs\n- Quick hits: remaining bullets as short list\n- Closing: one sentence CTA\n\n400-600 words. Tone: [your voice]"`} />
        </WorkflowStep>
        <WorkflowStep stepNumber={2} title="Build a sustainable rhythm" workflowId="starter_mktg_3">
          <div className="space-y-1 mt-2">
            {[['Mon–Thu', 'Collect bullets (30 sec each)'], ['Fri AM', 'Generate draft (1 min)'], ['Fri PM', 'Edit for voice (4 min)'], ['Total', 'Under 10 min/week']].map(([day, task]) => (
              <div key={day} className="flex gap-3 text-sm">
                <span className="text-teal-400 font-semibold w-16 shrink-0">{day}</span>
                <span className="text-zinc-300">{task}</span>
              </div>
            ))}
          </div>
        </WorkflowStep>
      </WorkflowCard>
    </div>
  )
}

function HrTab() {
  return (
    <div>
      <DeptBanner
        aiHandles="Job descriptions, interview questions, 360 feedback summaries, HR comms drafts"
        needsYou="Cultural fit evaluation, hiring/firing decisions, sensitive conversations, legal compliance"
      />
      <WorkflowCard title="10. Job Description Generator" timeSaved="~30 min/posting" tools="ChatGPT" id="h1">
        <WorkflowStep stepNumber={1} title="Generate the JD" workflowId="starter_hr_1">
          <PromptBlock content={`"Job description for:\nRole: [title] | Dept: [team] | Reports to: [manager]\nDay-to-day: [2-3 sentences]\nSalary: [range] | Location: [remote/hybrid/office]\nLevel: [junior/mid/senior]\n\nFormat:\n1. About the role (2-3 sentences)\n2. What you'll do (5-7 bullets)\n3. Must-haves (4-5 points)\n4. Nice-to-haves (2-3 points)\n5. What we offer\n\nUse inclusive language. Avoid jargon."`} />
        </WorkflowStep>
        <WorkflowStep stepNumber={2} title="Run a bias check" workflowId="starter_hr_1">
          <PromptBlock content={`"Review this job description for exclusionary language, unnecessary requirements, or bias. Suggest improvements."`} />
        </WorkflowStep>
      </WorkflowCard>

      <WorkflowCard title="11. Tailored Interview Question Builder" timeSaved="~20 min/interview" tools="ChatGPT" id="h2">
        <WorkflowStep stepNumber={1} title="Generate questions from your JD" workflowId="starter_hr_2">
          <PromptBlock content={`"From this job description, generate:\n[paste JD]\n\n1. TECHNICAL (5 questions) — 'Tell me about a time...' format\n2. PROBLEM-SOLVING (3 questions) — realistic scenarios\n3. CULTURE (3 questions) — teamwork and communication\n\nFor each: what a GOOD answer includes vs. RED FLAG answer."`} />
        </WorkflowStep>
        <WorkflowStep stepNumber={2} title="Use it as your scorecard" workflowId="starter_hr_2">
          <p className="text-zinc-300 text-sm">Print with good/red flag criteria. Score each answer 1–5.</p>
          <ProTip>Always ask one question AI didn't generate — based on their specific resume.</ProTip>
        </WorkflowStep>
      </WorkflowCard>

      <WorkflowCard title="12. Performance Feedback Summarizer" timeSaved="~1 hr/review cycle" tools="ChatGPT" id="h3">
        <WorkflowStep stepNumber={1} title="Synthesize 360 feedback" workflowId="starter_hr_3">
          <PromptBlock content={`"Synthesize 360 feedback for [name], [role]:\nManager: [paste]\nPeer 1: [paste]\nPeer 2: [paste]\nSelf-Assessment: [paste]\n\nCreate:\n1. Top 3 strengths (with examples)\n2. Top 2 growth areas (with examples)\n3. Overall narrative (balanced, constructive)\n4. Development goals for next quarter\n\nFocus on behaviors, not personality."`} />
          <ProTip>Never let AI write the final review without your personal touch. The summary is the scaffold, not the document.</ProTip>
        </WorkflowStep>
      </WorkflowCard>
    </div>
  )
}

function ProjectsTab() {
  return (
    <div>
      <DeptBanner
        aiHandles="Status updates, risk identification, scope documents, timelines"
        needsYou="Prioritization with competing stakeholders, team dynamics, adapting to reality"
      />
      <WorkflowCard title="13. Project Status Update Generator" timeSaved="~1 hr/week" tools="ChatGPT + project tracker" id="p1">
        <WorkflowStep stepNumber={1} title="Use this prompt" workflowId="starter_proj_1">
          <PromptBlock content={`"Weekly project status update:\nProject: [name] | Period: [dates]\n[paste task list]\n\nFormat:\n1. Executive Summary (3 sentences)\n2. Status by workstream (GREEN / AMBER / RED)\n3. Key accomplishments\n4. Blockers and risks\n5. Next week priorities\n6. Decisions needed from stakeholders"`} />
          <ProTip>Send at the same time every week. Consistency builds trust.</ProTip>
        </WorkflowStep>
      </WorkflowCard>

      <WorkflowCard title="14. AI-Powered Risk Assessment" timeSaved="~30 min/project" tools="ChatGPT" id="p2">
        <WorkflowStep stepNumber={1} title="Run the assessment" workflowId="starter_proj_2">
          <PromptBlock content={`"Analyze for risks:\nProject: [description]\nTimeline: [dates] | Team: [size] | Budget: [amount]\nStatus: [on track/behind]\nNotes: [paste recent meeting notes]\nTasks: [paste task list]\n\nIdentify risks in: Timeline, Budget, Resources, Dependencies, Scope, Quality\n\nFor each: describe, rate Severity (H/M/L), rate Likelihood (H/M/L), suggest mitigation."`} />
        </WorkflowStep>
        <WorkflowStep stepNumber={2} title="Create a living risk register" workflowId="starter_proj_2">
          <p className="text-zinc-300 text-sm">Review weekly. Update status as risks materialize or resolve.</p>
        </WorkflowStep>
        <WorkflowStep stepNumber={3} title="Run at every milestone" workflowId="starter_proj_2">
          <p className="text-zinc-300 text-sm">Kickoff, 25%, 50%, and any scope change.</p>
          <ProTip>Share your risk register proactively. Builds credibility instantly.</ProTip>
        </WorkflowStep>
      </WorkflowCard>

      <WorkflowCard title="15. Scope Document Drafter from Meeting Notes" timeSaved="~2 hrs/document" tools="ChatGPT" id="p3">
        <WorkflowStep stepNumber={1} title="Generate the SOW" workflowId="starter_proj_3">
          <PromptBlock content={`"Create a SOW from these notes:\n[paste everything]\n\nStructure:\n1. Project Overview\n2. Objectives (3-5 measurable)\n3. Scope of Work (deliverables with descriptions)\n4. Out of Scope (what's NOT included)\n5. Timeline and Milestones\n6. Assumptions\n7. Dependencies\n8. Acceptance Criteria\n\nFlag ambiguous items with [NEEDS CLARIFICATION]."`} />
        </WorkflowStep>
        <WorkflowStep stepNumber={2} title="Resolve every flag before sign-off" workflowId="starter_proj_3">
          <p className="text-zinc-300 text-sm">Every [NEEDS CLARIFICATION] flag is gold. These are the scope creep risks hiding in plain sight.</p>
        </WorkflowStep>
        <WorkflowStep stepNumber={3} title="Build a SOW library by project type" workflowId="starter_proj_3">
          <p className="text-zinc-300 text-sm">After 3–5 SOWs, save by type. SOW creation: 3 hours → 15 minutes.</p>
          <ProTip>The "Out of Scope" section is the most important part. Every word there is a boundary you won't have to fight for later.</ProTip>
        </WorkflowStep>
      </WorkflowCard>

      {/* Upsell on last tab */}
      <div className="mt-12 p-6 border border-teal-500/30 rounded-xl bg-teal-500/5">
        <h2 className="text-white text-xl font-bold mb-2">You have the workflows. Now build the system.</h2>
        <p className="text-zinc-300 text-sm leading-relaxed mb-1">
          The AI-Proof Playbook teaches you to audit your own job, build custom workflows, measure your savings in dollars, and present it for a promotion. Includes a 30-day implementation calendar.
        </p>
        <a href="https://getfluxe.gumroad.com/l/AIProofPlaybook" target="_blank" rel="noopener noreferrer"
          className="mt-4 inline-block bg-teal-500 hover:bg-teal-400 text-black font-bold px-6 py-3 rounded-lg transition-colors no-underline">
          Get the Playbook — $79
        </a>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// PAGE
// ══════════════════════════════════════════════════════════════════════════

export default function Starter() {
  const [activeTab, setActiveTab] = useState('start')

  const tabs = [
    { id: 'start',     label: 'Start Here',    content: <StartHereTab setActiveTab={setActiveTab} /> },
    { id: 'clients',   label: 'Clients',       content: <ClientsTab /> },
    { id: 'finance',   label: 'Finance',       content: <FinanceTab /> },
    { id: 'marketing', label: 'Marketing',     content: <MarketingTab /> },
    { id: 'hr',        label: 'HR',            content: <HrTab /> },
    { id: 'projects',  label: 'Projects',      content: <ProjectsTab /> },
    { id: 'prompts',   label: 'Prompt Library',content: <PromptLibrary prompts={ALL_PROMPTS} /> },
  ]

  return (
    <div className="min-h-screen text-white flex flex-col" style={{ backgroundColor: '#111118' }}>
      <Navbar />
      <TabDashboard
        tabs={tabs}
        pageTitle="AI-Proof Starter Kit"
        pageSubtitle="15 Advanced Workflows Across Every Department"
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <footer className="py-8 text-center" style={{ borderTop: '1px solid #2a2a38' }}>
        <p className="text-zinc-500 text-sm">© 2026 The Restack. Built for the ones who didn't wait.</p>
      </footer>
    </div>
  )
}
