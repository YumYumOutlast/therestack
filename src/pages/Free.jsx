import Navbar from '../components/Navbar'

const BORDER = '#2a2a38'

export default function Free() {
  return (
    <div className="min-h-screen text-white flex flex-col" style={{ backgroundColor: '#111118' }}>
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 pt-16 pb-24 w-full flex-1">

        {/* Page header */}
        <div className="mb-10">
          <p className="text-teal-400 text-xs font-semibold tracking-widest uppercase mb-3">Free Tier</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight leading-tight mb-4">
            FlowState Free Guide
          </h1>
          <p className="text-zinc-400 text-lg">5 AI Workflows That Eliminate Half Your Workload</p>
        </div>

        {/* Welcome banner */}
        <div className="border-l-4 border-teal-400 bg-zinc-900 rounded-r-xl px-6 py-5 mb-14">
          <p className="text-zinc-300 text-sm leading-relaxed">
            The system was hiding these from you. Now you have them. Set up one workflow today — just one — and you'll understand why this changes everything.
          </p>
        </div>

        {/* ── WORKFLOW 1 ── */}
        <section className="mb-16">
          <h2 className="text-teal-400 font-bold text-xl mt-8 mb-3">
            Workflow 1: Email Drafting on Autopilot
          </h2>
          <div className="flex flex-wrap gap-4 mb-4">
            <span className="text-xs font-semibold bg-teal-500/10 border border-teal-500/30 text-teal-300 px-3 py-1 rounded-full">⏱ ~45 min/day saved</span>
            <span className="text-xs font-semibold bg-zinc-800 border border-zinc-700 text-zinc-300 px-3 py-1 rounded-full">🛠 ChatGPT + Gmail / Outlook</span>
          </div>

          <p className="text-white font-semibold mt-4 mb-1">Step 1 — Save these 5 prompt templates</p>
          <p className="text-zinc-300 text-sm leading-relaxed mb-3">Copy them into a pinned doc right now. You'll use them every day.</p>
          <pre className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 font-mono text-sm text-teal-300 whitespace-pre-wrap overflow-x-auto">{`1. Client Update:
"Write a professional email updating [client name] on [project]. Key points: [bullet points]. Tone: confident but warm."

2. Meeting Follow-Up:
"Write a follow-up email for a meeting about [topic]. Action items: [list]. Next meeting: [date]."

3. Status Report:
"Write a status report email to my manager. Completed: [list]. In progress: [list]. Blockers: [list]."

4. Cold Outreach:
"Write a short outreach email to [person/role] at [company]. I want to [goal]. Keep it under 100 words."

5. Difficult Reply:
"Help me respond professionally to this email: [paste email]. I want to [your goal] without [what to avoid]."`}</pre>

          <p className="text-white font-semibold mt-4 mb-1">Step 2 — Open ChatGPT and paste your filled-in template</p>
          <p className="text-zinc-300 text-sm leading-relaxed">Be specific — the more context, the better the output.</p>

          <p className="text-white font-semibold mt-4 mb-1">Step 3 — Edit for 30 seconds, then send</p>
          <p className="text-zinc-300 text-sm leading-relaxed">You're the editor, not the audience. Change anything that doesn't sound like you.</p>

          <p className="text-white font-semibold mt-4 mb-1">Step 4 — Build your prompt library over time</p>
          <p className="text-zinc-300 text-sm leading-relaxed">Every new email type = save the prompt. After 2 weeks you'll have a library that covers 90% of your communication.</p>

          <div className="mt-5 bg-zinc-900 border border-zinc-700 rounded-lg px-5 py-4">
            <p className="text-teal-400 text-xs font-bold tracking-widest uppercase mb-2">Pro Tip</p>
            <p className="text-zinc-300 text-sm leading-relaxed">Start a new ChatGPT conversation for each email category. Title them "Client Updates," "Follow-Ups," etc. Context builds over time.</p>
          </div>
        </section>

        {/* ── WORKFLOW 2 ── */}
        <section className="mb-16">
          <h2 className="text-teal-400 font-bold text-xl mt-8 mb-3">
            Workflow 2: Meeting Notes That Write Themselves
          </h2>
          <div className="flex flex-wrap gap-4 mb-4">
            <span className="text-xs font-semibold bg-teal-500/10 border border-teal-500/30 text-teal-300 px-3 py-1 rounded-full">⏱ ~30 min/day saved</span>
            <span className="text-xs font-semibold bg-zinc-800 border border-zinc-700 text-zinc-300 px-3 py-1 rounded-full">🛠 ChatGPT + Otter.ai (free) + Google Docs</span>
          </div>

          <p className="text-white font-semibold mt-4 mb-1">Step 1 — Set up free transcription</p>
          <div className="text-zinc-300 text-sm leading-relaxed space-y-1.5">
            <p><span className="text-teal-400 font-semibold">Option A:</span> Otter.ai free tier (300 min/month). Record on your phone during meetings.</p>
            <p><span className="text-teal-400 font-semibold">Option B:</span> Zoom AI Companion (free with Zoom). Auto-generates summaries after calls.</p>
            <p><span className="text-teal-400 font-semibold">Option C:</span> Take rough bullet points. Even messy notes work.</p>
          </div>

          <p className="text-white font-semibold mt-4 mb-1">Step 2 — Paste the transcript into ChatGPT with this prompt</p>
          <pre className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 font-mono text-sm text-teal-300 whitespace-pre-wrap overflow-x-auto">{`"Here's a transcript from a meeting about [topic]. Summarize it into:
1. Key decisions made
2. Action items (with who is responsible)
3. Open questions
4. Next steps and deadlines
Keep it under 200 words. Use bullet points."

[paste transcript below]`}</pre>

          <p className="text-white font-semibold mt-4 mb-1">Step 3 — Send the summary within 5 minutes of the meeting ending</p>
          <p className="text-zinc-300 text-sm leading-relaxed">While everyone else is still organizing their notes, you've already sent a clean summary to the whole team.</p>

          <p className="text-white font-semibold mt-4 mb-1">Step 4 — Build a running meeting log</p>
          <p className="text-zinc-300 text-sm leading-relaxed">Google Doc called "Meeting Notes 2026." Paste each summary with date and attendees. Searchable archive of every meeting you've attended.</p>
        </section>

        {/* ── WORKFLOW 3 ── */}
        <section className="mb-16">
          <h2 className="text-teal-400 font-bold text-xl mt-8 mb-3">
            Workflow 3: Spreadsheet Cleanup in 60 Seconds
          </h2>
          <div className="flex flex-wrap gap-4 mb-4">
            <span className="text-xs font-semibold bg-teal-500/10 border border-teal-500/30 text-teal-300 px-3 py-1 rounded-full">⏱ ~1 hr/week saved</span>
            <span className="text-xs font-semibold bg-zinc-800 border border-zinc-700 text-zinc-300 px-3 py-1 rounded-full">🛠 ChatGPT + Google Sheets / Excel</span>
          </div>

          <p className="text-white font-semibold mt-4 mb-1">Step 1 — Learn these 3 prompts</p>
          <pre className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 font-mono text-sm text-teal-300 whitespace-pre-wrap overflow-x-auto">{`FORMULA BUILDER:
"I have a Google Sheet with [describe columns]. I need a formula that [what you want]. Give me the exact formula I can paste into cell [cell reference]."

DATA CLEANER:
"I have a column of [messy data — e.g. 'phone numbers in different formats']. Give me a formula or step-by-step process to standardize them all to [desired format]."

REPORT BUILDER:
"I have a spreadsheet with columns: [list columns]. Create a summary that shows [what you need]. Give me the exact steps and formulas."`}</pre>

          <p className="text-white font-semibold mt-4 mb-1">Step 2 — Copy the exact situation from your spreadsheet</p>
          <p className="text-zinc-300 text-sm leading-relaxed">Paste 2–3 rows of sample data. Specificity gets perfect formulas.</p>

          <p className="text-white font-semibold mt-4 mb-1">Step 3 — Paste the formula, test on one row, drag down</p>
          <p className="text-zinc-300 text-sm leading-relaxed">If it errors: <span className="text-teal-300 font-mono text-xs">"That formula returned an error. Here's what happened: [error]. Here's my data: [paste]. Fix it."</span></p>

          <p className="text-white font-semibold mt-4 mb-1">Step 4 — Save every formula that works in a "Formula Library" tab</p>
          <p className="text-zinc-300 text-sm leading-relaxed">After a month you're the spreadsheet expert on your team.</p>
        </section>

        {/* ── WORKFLOW 4 ── */}
        <section className="mb-16">
          <h2 className="text-teal-400 font-bold text-xl mt-8 mb-3">
            Workflow 4: Auto-Pilot Recurring Tasks with Zapier
          </h2>
          <div className="flex flex-wrap gap-4 mb-4">
            <span className="text-xs font-semibold bg-teal-500/10 border border-teal-500/30 text-teal-300 px-3 py-1 rounded-full">⏱ ~2 hrs/week saved</span>
            <span className="text-xs font-semibold bg-zinc-800 border border-zinc-700 text-zinc-300 px-3 py-1 rounded-full">🛠 Zapier (free) + Gmail + Sheets + Slack</span>
          </div>

          <p className="text-white font-semibold mt-4 mb-1">Step 1 — Create a free Zapier account at zapier.com</p>
          <p className="text-zinc-300 text-sm leading-relaxed">Free tier: 100 tasks/month, 5 active Zaps. Zapier logic: <span className="text-teal-300 font-semibold">TRIGGER → ACTION</span>.</p>

          <p className="text-white font-semibold mt-4 mb-3">Step 2 — Set up these 3 starter Zaps</p>
          <div className="space-y-3">
            {[
              { title: 'Zap 1 — Email to Spreadsheet Log', trigger: 'New email with specific Gmail label', action: 'Add row to Google Sheets (sender, subject, date)', use: 'Auto-log all client emails or invoices' },
              { title: 'Zap 2 — Form to Notification', trigger: 'New Google Forms / Typeform submission', action: 'Send Slack message or email to your team', use: 'Instant alerts when customers contact you' },
              { title: 'Zap 3 — Calendar to Prep Reminder', trigger: 'Event starting in 1 hour (Google Calendar)', action: 'Email yourself a prep checklist', use: 'Never walk into a meeting unprepared' },
            ].map((zap) => (
              <div key={zap.title} className="bg-zinc-900 border border-zinc-700 rounded-lg px-5 py-4">
                <p className="text-white font-semibold text-sm mb-2">{zap.title}</p>
                <p className="text-zinc-400 text-xs mb-0.5"><span className="text-zinc-500 uppercase tracking-wider text-xs">Trigger:</span> {zap.trigger}</p>
                <p className="text-zinc-400 text-xs mb-0.5"><span className="text-zinc-500 uppercase tracking-wider text-xs">Action:</span> {zap.action}</p>
                <p className="text-teal-400 text-xs mt-1">Use case: {zap.use}</p>
              </div>
            ))}
          </div>

          <p className="text-white font-semibold mt-4 mb-1">Step 3 — Test each Zap with the built-in test feature before relying on it</p>

          <p className="text-white font-semibold mt-4 mb-1">Step 4 — Use ChatGPT to design more complex Zaps</p>
          <pre className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 font-mono text-sm text-teal-300 whitespace-pre-wrap overflow-x-auto">{`"I want to automate this process in Zapier: [describe your manual process step by step]. What trigger and actions should I use? What apps do I need to connect?"`}</pre>

          <p className="text-white font-semibold mt-6 mb-3">5 Power Zaps to Build Next</p>
          <ol className="space-y-1.5">
            {[
              'New Slack message with keyword → Create task in Todoist / Asana',
              'New row in spreadsheet → Send personalized email to that contact',
              'New email attachment → Save to specific Google Drive folder',
              'Daily schedule trigger → Send yourself a Slack summary of today\'s tasks',
              'New invoice email → Log amount in budget spreadsheet + notify manager',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-zinc-300 text-sm">
                <span className="text-teal-400 font-bold shrink-0">{i + 1}.</span>
                {item}
              </li>
            ))}
          </ol>
        </section>

        {/* ── WORKFLOW 5 ── */}
        <section className="mb-16">
          <h2 className="text-teal-400 font-bold text-xl mt-8 mb-3">
            Workflow 5: One-Prompt Reports That Impress Your Boss
          </h2>
          <div className="flex flex-wrap gap-4 mb-4">
            <span className="text-xs font-semibold bg-teal-500/10 border border-teal-500/30 text-teal-300 px-3 py-1 rounded-full">⏱ ~3 hrs/week saved</span>
            <span className="text-xs font-semibold bg-zinc-800 border border-zinc-700 text-zinc-300 px-3 py-1 rounded-full">🛠 ChatGPT + Google Docs / Word</span>
          </div>

          <p className="text-white font-semibold mt-4 mb-1">Step 1 — Save this report template prompt</p>
          <pre className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 font-mono text-sm text-teal-300 whitespace-pre-wrap overflow-x-auto">{`"I need a [weekly/monthly] [report type] for [audience]. Here's my raw data:
[paste data]

Structure the report as:
1. Executive Summary (3 sentences max)
2. Key Metrics (table format)
3. What's Working
4. What Needs Attention
5. Recommended Next Steps

Tone: professional, concise, data-driven. Keep it under 1 page."`}</pre>

          <p className="text-white font-semibold mt-4 mb-1">Step 2 — Feed it your actual numbers</p>
          <p className="text-zinc-300 text-sm leading-relaxed">Copy raw data from your spreadsheet, CRM, or dashboard. Paste messy data — ChatGPT will organize it.</p>

          <p className="text-white font-semibold mt-4 mb-1">Step 3 — Polish and personalize (5 minutes max)</p>
          <ul className="space-y-1 mt-1">
            {['Add context only you know', 'Adjust tone for your specific audience', 'Add one insight that shows YOU are thinking'].map((item) => (
              <li key={item} className="flex items-start gap-2 text-zinc-300 text-sm">
                <span className="text-teal-400 mt-0.5">→</span>{item}
              </li>
            ))}
          </ul>

          <p className="text-white font-semibold mt-4 mb-2">Step 4 — Build a report library</p>
          <div className="flex flex-wrap gap-2">
            {['Weekly status', 'Monthly performance', 'Quarterly review', 'Project update', 'Budget summary'].map((t) => (
              <span key={t} className="text-xs bg-zinc-800 border border-zinc-700 text-zinc-300 px-3 py-1 rounded-full">{t}</span>
            ))}
          </div>
        </section>

        {/* Total saved */}
        <div className="border border-teal-500/30 bg-teal-500/5 rounded-xl px-6 py-5 mb-14 text-center">
          <p className="text-teal-400 text-xs font-bold tracking-widest uppercase mb-2">Total Saved Across All 5 Workflows</p>
          <p className="text-white text-2xl font-bold mb-1">7+ hours per week</p>
          <p className="text-zinc-400 text-sm">30+ hours per month. An entire work month back every year.</p>
        </div>

        {/* Upsell */}
        <div className="mt-12 p-6 border border-teal-500/30 rounded-xl bg-teal-500/5">
          <h2 className="text-white text-xl font-bold mb-2">You just reclaimed 7 hours a week. Want 15?</h2>
          <p className="text-zinc-300 text-sm leading-relaxed mb-1">
            The Starter Kit goes deeper — 15 advanced workflows across every department: clients, finance, marketing, HR, and project management. Step-by-step with exact prompts.
          </p>
          <a
            href="https://getfluxe.gumroad.com/l/FlowStateStarterKit"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block bg-teal-500 hover:bg-teal-400 text-black font-bold px-6 py-3 rounded-lg transition-colors no-underline"
          >
            Get the Starter Kit — $27
          </a>
        </div>

      </main>

      <footer style={{ borderTop: `1px solid ${BORDER}` }} className="py-8 text-center">
        <p className="text-zinc-500 text-sm">© 2026 The Restack. Built for the ones who didn't wait.</p>
      </footer>
    </div>
  )
}
