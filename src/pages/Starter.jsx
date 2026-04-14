import Navbar from '../components/Navbar'

const BORDER = '#2a2a38'

function Dept({ label, aiHandles, needsYou }) {
  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-lg px-5 py-4 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <p className="text-teal-400 text-xs font-bold tracking-widest uppercase mb-1">AI handles</p>
          <p className="text-zinc-300 text-sm">{aiHandles}</p>
        </div>
        <div>
          <p className="text-zinc-500 text-xs font-bold tracking-widest uppercase mb-1">Still needs you</p>
          <p className="text-zinc-400 text-sm">{needsYou}</p>
        </div>
      </div>
    </div>
  )
}

function Workflow({ number, title, saved, steps }) {
  return (
    <div className="mb-12">
      <div className="flex items-start gap-3 mb-3">
        <span className="shrink-0 w-7 h-7 rounded-full border border-teal-500 text-teal-400 text-xs font-bold flex items-center justify-center mt-0.5">{number}</span>
        <div>
          <h3 className="text-white font-bold text-base">{title}</h3>
          <span className="text-xs font-semibold bg-teal-500/10 border border-teal-500/30 text-teal-300 px-2 py-0.5 rounded-full">⏱ {saved}</span>
        </div>
      </div>
      {steps}
    </div>
  )
}

export default function Starter() {
  return (
    <div className="min-h-screen text-white flex flex-col" style={{ backgroundColor: '#111118' }}>
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 pt-16 pb-24 w-full flex-1">

        {/* Page header */}
        <div className="mb-10">
          <p className="text-teal-400 text-xs font-semibold tracking-widest uppercase mb-3">Starter Kit · $27</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight leading-tight mb-4">
            AI-Proof Starter Kit
          </h1>
          <p className="text-zinc-400 text-lg">15 Advanced Workflows Across Every Department</p>
        </div>

        {/* Welcome */}
        <div className="border-l-4 border-teal-400 bg-zinc-900 rounded-r-xl px-6 py-5 mb-14">
          <p className="text-zinc-300 text-sm leading-relaxed">
            You paid for the map. Here it is — all 5 departments, 15 workflows, exact prompts. Pick your biggest time-waster and start there.
          </p>
        </div>

        {/* ═══════════════════════════════
            DEPARTMENT 1: CLIENT MANAGEMENT
        ═══════════════════════════════ */}
        <h2 className="text-teal-400 font-bold text-xl mt-8 mb-3">Department 1: Client &amp; Customer Management</h2>
        <Dept
          aiHandles="Follow-up drafts, onboarding sequences, complaint responses, meeting prep"
          needsYou="Relationship judgment, emotional subtext, strategic decisions, trust-building"
        />

        <Workflow number={1} title="Auto-Draft Client Follow-Ups from CRM Notes" saved="~25 min/day" steps={
          <>
            <p className="text-white font-semibold mt-4 mb-1">Step 1 — Copy your raw CRM notes after any client interaction</p>
            <p className="text-zinc-300 text-sm leading-relaxed">Don't clean them up. Messy bullets are fine.</p>

            <p className="text-white font-semibold mt-4 mb-1">Step 2 — Use this prompt</p>
            <pre className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 font-mono text-sm text-teal-300 whitespace-pre-wrap overflow-x-auto">{`"I just had a [call/meeting] with [client name] at [company]. Here are my raw notes:
[paste notes]

Write a professional follow-up email that:
- References key decisions made
- Confirms action items and deadlines
- Addresses any concerns they raised
- Ends with a clear next step

Tone: [warm/formal/casual] and confident. Keep it under 150 words."`}</pre>

            <p className="text-white font-semibold mt-4 mb-1">Step 3 — Add the human layer</p>
            <p className="text-zinc-300 text-sm leading-relaxed">One personal detail, emotional calibration, sensitive info you wouldn't put in a prompt.</p>

            <p className="text-white font-semibold mt-4 mb-1">Step 4 — Save your best outputs as templates</p>
            <p className="text-zinc-300 text-sm leading-relaxed">Organized by situation: post-meeting, post-proposal, check-in, escalation.</p>
          </>
        } />

        <Workflow number={2} title="AI-Generated Client Onboarding Sequence" saved="~2 hrs (one-time build)" steps={
          <>
            <p className="text-white font-semibold mt-4 mb-1">Step 1 — Define your onboarding journey in 5 sentences</p>
            <ol className="space-y-1 mt-2 mb-3">
              {['What does the client need to do first?', 'What should they expect in week 1?', "What's the first deliverable?", 'How do they reach you?', 'What does success look like at 30 days?'].map((q, i) => (
                <li key={i} className="flex items-start gap-2 text-zinc-300 text-sm"><span className="text-teal-400 shrink-0">{i + 1}.</span>{q}</li>
              ))}
            </ol>

            <p className="text-white font-semibold mt-4 mb-1">Step 2 — Generate the full sequence</p>
            <pre className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 font-mono text-sm text-teal-300 whitespace-pre-wrap overflow-x-auto">{`"I run a [type of business]. New client onboarding needs a 5-email sequence:
Email 1 (Day 0): Welcome + what to expect + first action item
Email 2 (Day 2): Setup / intake guidance
Email 3 (Day 5): First week check-in
Email 4 (Day 10): First deliverable preview
Email 5 (Day 21): Progress check + next phase

Tone: professional but human. Each under 150 words. Include subject lines."`}</pre>

            <p className="text-white font-semibold mt-4 mb-1">Step 3 — Automate the send</p>
            <p className="text-zinc-300 text-sm leading-relaxed">Set up as Gmail templates, or connect CRM to Gmail via Zapier — new client added = sequence starts automatically.</p>
          </>
        } />

        <Workflow number={3} title="Complaint Response System" saved="~15 min/incident" steps={
          <>
            <p className="text-white font-semibold mt-4 mb-1">Step 1 — Use this prompt</p>
            <pre className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 font-mono text-sm text-teal-300 whitespace-pre-wrap overflow-x-auto">{`"A client sent this:
[paste email]

Context: [what actually happened]

Draft a response that:
- Acknowledges their frustration without being defensive
- Takes responsibility where appropriate
- Explains what happened briefly and factually
- Offers a specific resolution
- Ends with reassurance

Tone: empathetic, calm, solution-focused. Under 200 words."`}</pre>

            <p className="text-white font-semibold mt-4 mb-1">Step 2 — Check emotional tone</p>
            <p className="text-zinc-300 text-sm leading-relaxed">Does it acknowledge their feeling, not just the facts?</p>

            <p className="text-white font-semibold mt-4 mb-1">Step 3 — Build a response library by complaint type</p>
            <p className="text-zinc-300 text-sm leading-relaxed">After 30 days you'll have 80% of complaints covered by a template. Response time drops from 20 min to 3 min.</p>

            <div className="mt-4 bg-zinc-900 border border-zinc-700 rounded-lg px-5 py-4">
              <p className="text-teal-400 text-xs font-bold tracking-widest uppercase mb-2">Pro Tip</p>
              <p className="text-zinc-300 text-sm leading-relaxed">Never send within 60 seconds of reading the complaint. AI removes writing time. You still need thinking time.</p>
            </div>
          </>
        } />

        {/* ═══════════════════════════════
            DEPARTMENT 2: FINANCE
        ═══════════════════════════════ */}
        <h2 className="text-teal-400 font-bold text-xl mt-12 mb-3">Department 2: Invoicing &amp; Finance</h2>
        <Dept
          aiHandles="Extracting invoice data, categorizing expenses, financial summaries, variance explanations"
          needsYou="Verifying extracted numbers, judgment on ambiguous expenses, interpreting trends, approvals"
        />

        <Workflow number={4} title="Invoice Data Extraction to Spreadsheet" saved="~45 min/week" steps={
          <>
            <p className="text-white font-semibold mt-4 mb-1">Step 1 — Use this prompt</p>
            <pre className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 font-mono text-sm text-teal-300 whitespace-pre-wrap overflow-x-auto">{`"Extract from this invoice:
- Vendor Name
- Invoice Number
- Date / Due Date
- Line Items (description + amount)
- Subtotal / Tax / Total

[paste invoice text]

Format as: Vendor | Invoice # | Date | Due | Total | Category"`}</pre>

            <p className="text-white font-semibold mt-4 mb-1">Step 2 — Set up your tracking sheet</p>
            <p className="text-zinc-300 text-sm leading-relaxed font-mono text-xs bg-zinc-900 border border-zinc-700 rounded p-3">Date Received | Vendor | Invoice # | Amount | Due Date | Category | Status | Notes</p>

            <p className="text-white font-semibold mt-4 mb-1">Step 3 — Batch process weekly</p>
            <p className="text-zinc-300 text-sm leading-relaxed">Create a Gmail label "To Process." Friday afternoon: open all labeled emails, batch-extract into your sheet.</p>

            <div className="mt-4 bg-zinc-900 border border-zinc-700 rounded-lg px-5 py-4">
              <p className="text-teal-400 text-xs font-bold tracking-widest uppercase mb-2">Pro Tip</p>
              <p className="text-zinc-300 text-sm leading-relaxed">Always verify dollar amounts. AI occasionally misreads numbers from PDFs.</p>
            </div>
          </>
        } />

        <Workflow number={5} title="Smart Expense Categorization" saved="~1 hr/month" steps={
          <>
            <p className="text-white font-semibold mt-4 mb-1">Step 1 — Use this prompt</p>
            <pre className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 font-mono text-sm text-teal-300 whitespace-pre-wrap overflow-x-auto">{`"My expense categories:
- Software: SaaS, apps, cloud services
- Office: supplies, equipment
- Travel: flights, hotels, rideshare
- Meals: client dinners, team lunches
- Marketing: ads, design services
- Professional: legal, accounting
- Payroll: salaries, contractors

Categorize these transactions. Mark uncertain ones as 'REVIEW':
[paste transaction list]"`}</pre>

            <p className="text-white font-semibold mt-4 mb-1">Step 2 — Export monthly statement as CSV</p>
            <p className="text-zinc-300 text-sm leading-relaxed">Paste descriptions and amounts directly.</p>

            <p className="text-white font-semibold mt-4 mb-1">Step 3 — Build your rulebook</p>
            <p className="text-zinc-300 text-sm leading-relaxed">Each month note which vendors AI flagged. By month 3: 95%+ accuracy on first pass.</p>
          </>
        } />

        <Workflow number={6} title="End-of-Month Financial Summary Generator" saved="~2 hrs/month" steps={
          <>
            <p className="text-white font-semibold mt-4 mb-1">Step 1 — Use this prompt</p>
            <pre className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 font-mono text-sm text-teal-300 whitespace-pre-wrap overflow-x-auto">{`"Monthly budget vs actual:
Category | Budget | Actual
Software | $2,000 | $2,450
Marketing | $5,000 | $3,200
[continue your data]

Create executive summary with:
1. One-paragraph overview
2. Top 3 over budget with explanations
3. Top 3 under budget with explanations
4. Total variance
5. Recommended actions"`}</pre>

            <p className="text-white font-semibold mt-4 mb-1">Step 2 — Add insider context</p>
            <p className="text-zinc-300 text-sm leading-relaxed">AI gives structural analysis. You add the WHY.</p>

            <p className="text-white font-semibold mt-4 mb-1">Step 3 — After 3 months, prompt AI to identify trends</p>
            <p className="text-zinc-300 text-sm leading-relaxed">Paste the last 3 monthly summaries and ask for pattern analysis.</p>
          </>
        } />

        {/* ═══════════════════════════════
            DEPARTMENT 3: MARKETING
        ═══════════════════════════════ */}
        <h2 className="text-teal-400 font-bold text-xl mt-12 mb-3">Department 3: Content &amp; Marketing</h2>
        <Dept
          aiHandles="Social post drafts, blog outlines, newsletter drafts, content repurposing"
          needsYou="Original ideas, brand voice calibration, strategic decisions, audience empathy"
        />

        <Workflow number={7} title="Social Media Posts from a Single Talking Point" saved="~3 hrs/week" steps={
          <>
            <p className="text-white font-semibold mt-4 mb-1">Step 1 — Use this prompt</p>
            <pre className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 font-mono text-sm text-teal-300 whitespace-pre-wrap overflow-x-auto">{`"Create posts for each platform from this talking point: [idea]

1. LinkedIn (150-200 words, professional but personal)
2. X/Twitter (under 280 chars, punchy)
3. Instagram caption (casual, relatable, CTA)
4. Facebook (conversational, ask a question)

My brand voice: [5 words describing your style]"`}</pre>

            <p className="text-white font-semibold mt-4 mb-1">Step 2 — Build a talking points bank</p>
            <p className="text-zinc-300 text-sm leading-relaxed">20 talking points/month × 4 platforms = 80 pieces of content. Under 2 hours total.</p>

            <div className="mt-4 bg-zinc-900 border border-zinc-700 rounded-lg px-5 py-4">
              <p className="text-teal-400 text-xs font-bold tracking-widest uppercase mb-2">Pro Tip</p>
              <p className="text-zinc-300 text-sm leading-relaxed">The 20% you edit in is what makes it YOUR content.</p>
            </div>
          </>
        } />

        <Workflow number={8} title="Blog Outline Builder" saved="~1 hr/post" steps={
          <>
            <p className="text-white font-semibold mt-4 mb-1">Step 1 — Build the outline</p>
            <pre className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 font-mono text-sm text-teal-300 whitespace-pre-wrap overflow-x-auto">{`"Blog outline for: [topic]
Audience: [who]
Goal: [inform/persuade/teach]
Length: [word count]

Provide:
1. Three headline options
2. Introduction hook (2 sentences)
3. 4-6 section headers with 2-3 key points each
4. Conclusion with takeaway
5. Call to action"`}</pre>

            <p className="text-white font-semibold mt-4 mb-1">Step 2 — Repurpose across platforms</p>
            <pre className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 font-mono text-sm text-teal-300 whitespace-pre-wrap overflow-x-auto">{`"Take this post and create:
1. LinkedIn summary (150 words)
2. X/Twitter thread (5-7 tweets)
3. Email newsletter version (300 words)"`}</pre>

            <p className="text-zinc-300 text-sm leading-relaxed mt-3">One blog = 4 pieces across 4 channels.</p>
            <div className="mt-4 bg-zinc-900 border border-zinc-700 rounded-lg px-5 py-4">
              <p className="text-teal-400 text-xs font-bold tracking-widest uppercase mb-2">Pro Tip</p>
              <p className="text-zinc-300 text-sm leading-relaxed">Don't let AI write your intro. That's where your voice lives.</p>
            </div>
          </>
        } />

        <Workflow number={9} title="Email Newsletter from Bullet Points" saved="~1.5 hrs/week" steps={
          <>
            <p className="text-white font-semibold mt-4 mb-1">Step 1 — Use this prompt</p>
            <pre className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 font-mono text-sm text-teal-300 whitespace-pre-wrap overflow-x-auto">{`"Write a weekly newsletter from these bullets:
[paste bullets]

Format:
- Subject line (curiosity-driven, under 50 chars)
- Opening hook (personal, relatable)
- Main section: expand best bullet into 2-3 paragraphs
- Quick hits: remaining bullets as short list
- Closing: one sentence CTA

400-600 words. Tone: [your voice]"`}</pre>

            <p className="text-white font-semibold mt-4 mb-1">Step 2 — Build a sustainable rhythm</p>
            <div className="space-y-1 mt-2">
              {[['Mon–Thu', 'Collect bullets as you go (30 sec each)'], ['Fri AM', 'Generate draft (1 min)'], ['Fri PM', 'Edit for voice (4 min)'], ['Total', 'Under 10 min/week']].map(([day, task]) => (
                <div key={day} className="flex gap-3 text-sm">
                  <span className="text-teal-400 font-semibold w-16 shrink-0">{day}</span>
                  <span className="text-zinc-300">{task}</span>
                </div>
              ))}
            </div>
          </>
        } />

        {/* ═══════════════════════════════
            DEPARTMENT 4: HR
        ═══════════════════════════════ */}
        <h2 className="text-teal-400 font-bold text-xl mt-12 mb-3">Department 4: HR &amp; People Operations</h2>
        <Dept
          aiHandles="Job descriptions, interview questions, 360 feedback summaries, HR comms drafts"
          needsYou="Cultural fit evaluation, hiring/firing decisions, sensitive conversations, legal compliance"
        />

        <Workflow number={10} title="Job Description Generator" saved="~30 min/posting" steps={
          <>
            <p className="text-white font-semibold mt-4 mb-1">Step 1 — Generate the JD</p>
            <pre className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 font-mono text-sm text-teal-300 whitespace-pre-wrap overflow-x-auto">{`"Job description for:
Role: [title] | Dept: [team] | Reports to: [manager]
Day-to-day: [2-3 sentences]
Salary: [range] | Location: [remote/hybrid/office]
Level: [junior/mid/senior]

Format:
1. About the role (2-3 sentences)
2. What you'll do (5-7 bullets)
3. Must-haves (4-5 points)
4. Nice-to-haves (2-3 points)
5. What we offer

Use inclusive language. Avoid jargon."`}</pre>

            <p className="text-white font-semibold mt-4 mb-1">Step 2 — Run a bias check</p>
            <pre className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 font-mono text-sm text-teal-300 whitespace-pre-wrap overflow-x-auto">{`"Review this job description for exclusionary language, unnecessary requirements, or bias. Suggest improvements."`}</pre>
          </>
        } />

        <Workflow number={11} title="Tailored Interview Question Builder" saved="~20 min/interview" steps={
          <>
            <p className="text-white font-semibold mt-4 mb-1">Step 1 — Generate questions from your JD</p>
            <pre className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 font-mono text-sm text-teal-300 whitespace-pre-wrap overflow-x-auto">{`"From this job description, generate:
[paste JD]

1. TECHNICAL (5 questions) — 'Tell me about a time...' format
2. PROBLEM-SOLVING (3 questions) — realistic scenarios
3. CULTURE (3 questions) — teamwork and communication

For each: what a GOOD answer includes vs. RED FLAG answer."`}</pre>

            <p className="text-white font-semibold mt-4 mb-1">Step 2 — Use it as your scorecard</p>
            <p className="text-zinc-300 text-sm leading-relaxed">Print with good/red flag criteria. Score each answer 1–5.</p>

            <div className="mt-4 bg-zinc-900 border border-zinc-700 rounded-lg px-5 py-4">
              <p className="text-teal-400 text-xs font-bold tracking-widest uppercase mb-2">Pro Tip</p>
              <p className="text-zinc-300 text-sm leading-relaxed">Always ask one question AI didn't generate — based on their specific resume.</p>
            </div>
          </>
        } />

        <Workflow number={12} title="Performance Feedback Summarizer" saved="~1 hr/review cycle" steps={
          <>
            <p className="text-white font-semibold mt-4 mb-1">Step 1 — Synthesize 360 feedback</p>
            <pre className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 font-mono text-sm text-teal-300 whitespace-pre-wrap overflow-x-auto">{`"Synthesize 360 feedback for [name], [role]:
Manager: [paste]
Peer 1: [paste]
Peer 2: [paste]
Self-Assessment: [paste]

Create:
1. Top 3 strengths (with examples)
2. Top 2 growth areas (with examples)
3. Overall narrative (balanced, constructive)
4. Development goals for next quarter

Focus on behaviors, not personality."`}</pre>

            <div className="mt-4 bg-zinc-900 border border-zinc-700 rounded-lg px-5 py-4">
              <p className="text-teal-400 text-xs font-bold tracking-widest uppercase mb-2">Pro Tip</p>
              <p className="text-zinc-300 text-sm leading-relaxed">Never let AI write the final review without your personal touch. The summary is the scaffold, not the document.</p>
            </div>
          </>
        } />

        {/* ═══════════════════════════════
            DEPARTMENT 5: PROJECT MGMT
        ═══════════════════════════════ */}
        <h2 className="text-teal-400 font-bold text-xl mt-12 mb-3">Department 5: Project Management</h2>
        <Dept
          aiHandles="Status updates, risk identification, scope documents, timelines"
          needsYou="Prioritization with competing stakeholders, team dynamics, adapting to reality"
        />

        <Workflow number={13} title="Project Status Update Generator" saved="~1 hr/week" steps={
          <>
            <p className="text-white font-semibold mt-4 mb-1">Step 1 — Use this prompt</p>
            <pre className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 font-mono text-sm text-teal-300 whitespace-pre-wrap overflow-x-auto">{`"Weekly project status update:
Project: [name] | Period: [dates]
[paste task list]

Format:
1. Executive Summary (3 sentences)
2. Status by workstream (GREEN / AMBER / RED)
3. Key accomplishments
4. Blockers and risks
5. Next week priorities
6. Decisions needed from stakeholders"`}</pre>

            <div className="mt-4 bg-zinc-900 border border-zinc-700 rounded-lg px-5 py-4">
              <p className="text-teal-400 text-xs font-bold tracking-widest uppercase mb-2">Pro Tip</p>
              <p className="text-zinc-300 text-sm leading-relaxed">Send at the same time every week. Consistency builds trust.</p>
            </div>
          </>
        } />

        <Workflow number={14} title="AI-Powered Risk Assessment" saved="~30 min/project" steps={
          <>
            <p className="text-white font-semibold mt-4 mb-1">Step 1 — Run the assessment</p>
            <pre className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 font-mono text-sm text-teal-300 whitespace-pre-wrap overflow-x-auto">{`"Analyze for risks:
Project: [description]
Timeline: [dates] | Team: [size] | Budget: [amount]
Status: [on track/behind]
Notes: [paste recent meeting notes]
Tasks: [paste task list]

Identify risks in: Timeline, Budget, Resources, Dependencies, Scope, Quality

For each: describe, rate Severity (H/M/L), rate Likelihood (H/M/L), suggest mitigation."`}</pre>

            <p className="text-white font-semibold mt-4 mb-1">Step 2 — Create a living risk register</p>
            <p className="text-zinc-300 text-sm leading-relaxed">Review weekly. Update status as risks materialize or resolve.</p>

            <p className="text-white font-semibold mt-4 mb-1">Step 3 — Run at every milestone</p>
            <p className="text-zinc-300 text-sm leading-relaxed">Kickoff, 25%, 50%, and any scope change.</p>

            <div className="mt-4 bg-zinc-900 border border-zinc-700 rounded-lg px-5 py-4">
              <p className="text-teal-400 text-xs font-bold tracking-widest uppercase mb-2">Pro Tip</p>
              <p className="text-zinc-300 text-sm leading-relaxed">Share your risk register proactively. Builds credibility instantly.</p>
            </div>
          </>
        } />

        <Workflow number={15} title="Scope Document Drafter from Meeting Notes" saved="~2 hrs/document" steps={
          <>
            <p className="text-white font-semibold mt-4 mb-1">Step 1 — Generate the SOW</p>
            <pre className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 font-mono text-sm text-teal-300 whitespace-pre-wrap overflow-x-auto">{`"Create a SOW from these notes:
[paste everything]

Structure:
1. Project Overview
2. Objectives (3-5 measurable)
3. Scope of Work (deliverables with descriptions)
4. Out of Scope (what's NOT included)
5. Timeline and Milestones
6. Assumptions
7. Dependencies
8. Acceptance Criteria

Flag ambiguous items with [NEEDS CLARIFICATION]."`}</pre>

            <p className="text-white font-semibold mt-4 mb-1">Step 2 — Resolve every flag before sign-off</p>
            <p className="text-zinc-300 text-sm leading-relaxed">Every [NEEDS CLARIFICATION] flag is gold. These are the scope creep risks hiding in plain sight.</p>

            <p className="text-white font-semibold mt-4 mb-1">Step 3 — Build a SOW library by project type</p>
            <p className="text-zinc-300 text-sm leading-relaxed">After 3–5 SOWs, save by type. SOW creation: 3 hours → 15 minutes.</p>

            <div className="mt-4 bg-zinc-900 border border-zinc-700 rounded-lg px-5 py-4">
              <p className="text-teal-400 text-xs font-bold tracking-widest uppercase mb-2">Pro Tip</p>
              <p className="text-zinc-300 text-sm leading-relaxed">The "Out of Scope" section is the most important part. Every word in that section is a boundary you won't have to fight for later.</p>
            </div>
          </>
        } />

        {/* Upsell */}
        <div className="mt-12 p-6 border border-teal-500/30 rounded-xl bg-teal-500/5">
          <h2 className="text-white text-xl font-bold mb-2">You have the workflows. Now build the system.</h2>
          <p className="text-zinc-300 text-sm leading-relaxed mb-1">
            The AI-Proof Playbook teaches you to audit your own job, build custom workflows for tasks nobody has templated, measure your time savings in dollars, and present it all to leadership for a promotion. Includes a 30-day implementation calendar.
          </p>
          <a
            href="https://getfluxe.gumroad.com/l/AIProofPlaybook"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block bg-teal-500 hover:bg-teal-400 text-black font-bold px-6 py-3 rounded-lg transition-colors no-underline"
          >
            Get the Playbook — $79
          </a>
        </div>

      </main>

      <footer style={{ borderTop: `1px solid ${BORDER}` }} className="py-8 text-center">
        <p className="text-zinc-500 text-sm">© 2026 The Restack. Built for the ones who didn't wait.</p>
      </footer>
    </div>
  )
}
