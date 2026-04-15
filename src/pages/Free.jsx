import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Adonis from '../components/Adonis'
import TabDashboard from '../components/TabDashboard'
import WorkflowCard from '../components/WorkflowCard'
import WorkflowStep from '../components/WorkflowStep'
import PromptBlock from '../components/PromptBlock'
import PromptLibrary from '../components/PromptLibrary'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

const TOTAL_STEPS = 20

// ── All prompts for Prompt Library tab ────────────────────────────────────
const ALL_PROMPTS = [
  { label: 'Email — Client Update', content: `"Write a professional email updating [client name] on [project]. Key points: [bullet points]. Tone: confident but warm."` },
  { label: 'Email — Meeting Follow-Up', content: `"Write a follow-up email for a meeting about [topic]. Action items: [list]. Next meeting: [date]."` },
  { label: 'Email — Status Report', content: `"Write a status report email to my manager. Completed: [list]. In progress: [list]. Blockers: [list]."` },
  { label: 'Email — Cold Outreach', content: `"Write a short outreach email to [person/role] at [company]. I want to [goal]. Keep it under 100 words."` },
  { label: 'Email — Difficult Reply', content: `"Help me respond professionally to this email: [paste email]. I want to [your goal] without [what to avoid]."` },
  { label: 'Meeting Notes Summarizer', content: `"Here's a transcript from a meeting about [topic]. Summarize it into:\n1. Key decisions made\n2. Action items (with who is responsible)\n3. Open questions\n4. Next steps and deadlines\nKeep it under 200 words. Use bullet points."\n\n[paste transcript below]` },
  { label: 'Spreadsheet — Formula Builder', content: `"I have a Google Sheet with [describe columns]. I need a formula that [what you want]. Give me the exact formula I can paste into cell [cell reference]."` },
  { label: 'Spreadsheet — Data Cleaner', content: `"I have a column of [messy data]. Give me a formula or step-by-step process to standardize them all to [desired format]."` },
  { label: 'Spreadsheet — Report Builder', content: `"I have a spreadsheet with columns: [list columns]. Create a summary that shows [what you need]. Give me the exact steps and formulas."` },
  { label: 'Zapier — Zap Designer', content: `"I want to automate this process in Zapier: [describe your manual process step by step]. What trigger and actions should I use? What apps do I need to connect?"` },
  { label: 'One-Prompt Report Template', content: `"I need a [weekly/monthly] [report type] for [audience]. Here's my raw data:\n[paste data]\n\nStructure the report as:\n1. Executive Summary (3 sentences max)\n2. Key Metrics (table format)\n3. What's Working\n4. What Needs Attention\n5. Recommended Next Steps\n\nTone: professional, concise, data-driven. Keep it under 1 page."` },
]

// ── Progress bar shown on Start Here ──────────────────────────────────────
function ProgressSummary() {
  const { user } = useAuth()
  const [completed, setCompleted] = useState(0)
  useEffect(() => {
    if (!user) {
      setCompleted(0)
      return
    }
    supabase
      .from('progress')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('page', 'free')
      .eq('completed', true)
      .then(({ count }) => setCompleted(count ?? 0))
  }, [user])
  const total = TOTAL_STEPS
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

// ── Pro tip card ───────────────────────────────────────────────────────────
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
  const workflows = [
    { id: 'email',   name: 'Email Drafting on Autopilot',              saved: '~45 min/day',  desc: 'Turn any email situation into a polished draft in under 2 minutes.' },
    { id: 'meeting', name: 'Meeting Notes That Write Themselves',       saved: '~30 min/day',  desc: 'Transcribe, summarize, and send meeting notes before anyone else has started.' },
    { id: 'sheets',  name: 'Spreadsheet Cleanup in 60 Seconds',        saved: '~1 hr/week',   desc: 'Get the exact formula you need without knowing Excel.' },
    { id: 'zapier',  name: 'Auto-Pilot Recurring Tasks with Zapier',   saved: '~2 hrs/week',  desc: 'Connect your apps and let them do the repetitive work.' },
    { id: 'reports', name: 'One-Prompt Reports That Impress Your Boss', saved: '~3 hrs/week',  desc: 'Turn raw data into clean reports your boss will notice.' },
  ]
  return (
    <div>
      <h2 className="text-white font-bold text-2xl mb-2">Start here. Pick one workflow. Do it today.</h2>
      <p className="text-zinc-400 text-sm leading-relaxed mb-8">
        You have 5 workflows. Each one saves real time. Don't read all of them — pick the one that hurts most and set it up right now.
      </p>
      <div className="space-y-3">
        {workflows.map((wf) => (
          <div key={wf.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-white font-bold">{wf.name}</span>
                <span className="bg-zinc-800 text-teal-400 text-xs px-2 py-0.5 rounded-full">{wf.saved}</span>
              </div>
              <p className="text-zinc-400 text-sm">{wf.desc}</p>
            </div>
            <button
              onClick={() => setActiveTab(wf.id)}
              className="shrink-0 text-teal-400 border border-teal-500/40 text-sm font-medium px-4 py-2 rounded-lg hover:bg-teal-500/10 transition-colors whitespace-nowrap"
            >
              Go to workflow →
            </button>
          </div>
        ))}
      </div>
      <ProgressSummary />
    </div>
  )
}

function EmailDraftingTab() {
  return (
    <WorkflowCard title="Email Drafting on Autopilot" timeSaved="~45 min/day" tools="ChatGPT + Gmail / Outlook" id="email">
      <WorkflowStep stepNumber={1} title="Save these 5 prompt templates" workflowId="free_email">
        <p className="text-zinc-300 text-sm mb-3">Copy them into a pinned doc right now. You'll use them every day.</p>
        <PromptBlock content={`1. Client Update:\n"Write a professional email updating [client name] on [project]. Key points: [bullet points]. Tone: confident but warm."\n\n2. Meeting Follow-Up:\n"Write a follow-up email for a meeting about [topic]. Action items: [list]. Next meeting: [date]."\n\n3. Status Report:\n"Write a status report email to my manager. Completed: [list]. In progress: [list]. Blockers: [list]."\n\n4. Cold Outreach:\n"Write a short outreach email to [person/role] at [company]. I want to [goal]. Keep it under 100 words."\n\n5. Difficult Reply:\n"Help me respond professionally to this email: [paste email]. I want to [your goal] without [what to avoid]."`} />
      </WorkflowStep>
      <WorkflowStep stepNumber={2} title="Open ChatGPT and paste your filled-in template" workflowId="free_email">
        <p className="text-zinc-300 text-sm">Be specific — the more context, the better the output.</p>
      </WorkflowStep>
      <WorkflowStep stepNumber={3} title="Edit for 30 seconds, then send" workflowId="free_email">
        <p className="text-zinc-300 text-sm">You're the editor, not the audience. Change anything that doesn't sound like you.</p>
      </WorkflowStep>
      <WorkflowStep stepNumber={4} title="Build your prompt library over time" workflowId="free_email">
        <p className="text-zinc-300 text-sm">Every new email type = save the prompt. After 2 weeks you'll have a library that covers 90% of your communication.</p>
      </WorkflowStep>
      <ProTip>Start a new ChatGPT conversation for each email category. Title them "Client Updates," "Follow-Ups," etc. Context builds over time.</ProTip>
    </WorkflowCard>
  )
}

function MeetingNotesTab() {
  return (
    <WorkflowCard title="Meeting Notes That Write Themselves" timeSaved="~30 min/day" tools="ChatGPT + Otter.ai (free) + Google Docs" id="meeting">
      <WorkflowStep stepNumber={1} title="Set up free transcription" workflowId="free_meeting">
        <div className="text-zinc-300 text-sm leading-relaxed space-y-1.5">
          <p><span className="text-teal-400 font-semibold">Option A:</span> Otter.ai free tier (300 min/month). Record on your phone during meetings.</p>
          <p><span className="text-teal-400 font-semibold">Option B:</span> Zoom AI Companion (free with Zoom). Auto-generates summaries after calls.</p>
          <p><span className="text-teal-400 font-semibold">Option C:</span> Take rough bullet points. Even messy notes work.</p>
        </div>
      </WorkflowStep>
      <WorkflowStep stepNumber={2} title="Paste the transcript into ChatGPT with this prompt" workflowId="free_meeting">
        <PromptBlock content={`"Here's a transcript from a meeting about [topic]. Summarize it into:\n1. Key decisions made\n2. Action items (with who is responsible)\n3. Open questions\n4. Next steps and deadlines\nKeep it under 200 words. Use bullet points."\n\n[paste transcript below]`} />
      </WorkflowStep>
      <WorkflowStep stepNumber={3} title="Send the summary within 5 minutes of the meeting ending" workflowId="free_meeting">
        <p className="text-zinc-300 text-sm">While everyone else is still organizing their notes, you've already sent a clean summary to the whole team.</p>
      </WorkflowStep>
      <WorkflowStep stepNumber={4} title="Build a running meeting log" workflowId="free_meeting">
        <p className="text-zinc-300 text-sm">Google Doc called "Meeting Notes 2026." Paste each summary with date and attendees. Searchable archive of every meeting you've attended.</p>
      </WorkflowStep>
    </WorkflowCard>
  )
}

function SpreadsheetsTab() {
  return (
    <WorkflowCard title="Spreadsheet Cleanup in 60 Seconds" timeSaved="~1 hr/week" tools="ChatGPT + Google Sheets / Excel" id="sheets">
      <WorkflowStep stepNumber={1} title="Learn these 3 prompts" workflowId="free_sheets">
        <PromptBlock label="Formula Builder" content={`"I have a Google Sheet with [describe columns]. I need a formula that [what you want]. Give me the exact formula I can paste into cell [cell reference]."`} />
        <PromptBlock label="Data Cleaner" content={`"I have a column of [messy data — e.g. 'phone numbers in different formats']. Give me a formula or step-by-step process to standardize them all to [desired format]."`} />
        <PromptBlock label="Report Builder" content={`"I have a spreadsheet with columns: [list columns]. Create a summary that shows [what you need]. Give me the exact steps and formulas."`} />
      </WorkflowStep>
      <WorkflowStep stepNumber={2} title="Copy the exact situation from your spreadsheet" workflowId="free_sheets">
        <p className="text-zinc-300 text-sm">Paste 2–3 rows of sample data. Specificity gets perfect formulas.</p>
      </WorkflowStep>
      <WorkflowStep stepNumber={3} title="Paste the formula, test on one row, drag down" workflowId="free_sheets">
        <p className="text-zinc-300 text-sm mb-2">If it errors:</p>
        <PromptBlock content={`"That formula returned an error. Here's what happened: [error]. Here's my data: [paste]. Fix it."`} />
      </WorkflowStep>
      <WorkflowStep stepNumber={4} title={`Save every formula that works in a "Formula Library" tab`} workflowId="free_sheets">
        <p className="text-zinc-300 text-sm">After a month you're the spreadsheet expert on your team.</p>
      </WorkflowStep>
    </WorkflowCard>
  )
}

function ZapierTab() {
  return (
    <WorkflowCard title="Auto-Pilot Recurring Tasks with Zapier" timeSaved="~2 hrs/week" tools="Zapier (free) + Gmail + Sheets + Slack" id="zapier">
      <WorkflowStep stepNumber={1} title="Create a free Zapier account at zapier.com" workflowId="free_zapier">
        <p className="text-zinc-300 text-sm">Free tier: 100 tasks/month, 5 active Zaps. Zapier logic: <span className="text-teal-300 font-semibold">TRIGGER → ACTION</span>.</p>
      </WorkflowStep>
      <WorkflowStep stepNumber={2} title="Set up these 3 starter Zaps" workflowId="free_zapier">
        <div className="space-y-3 mt-2">
          {[
            { title: 'Zap 1 — Email to Spreadsheet Log', trigger: 'New email with specific Gmail label', action: 'Add row to Google Sheets (sender, subject, date)', use: 'Auto-log all client emails or invoices' },
            { title: 'Zap 2 — Form to Notification', trigger: 'New Google Forms / Typeform submission', action: 'Send Slack message or email to your team', use: 'Instant alerts when customers contact you' },
            { title: 'Zap 3 — Calendar to Prep Reminder', trigger: 'Event starting in 1 hour (Google Calendar)', action: 'Email yourself a prep checklist', use: 'Never walk into a meeting unprepared' },
          ].map((zap) => (
            <div key={zap.title} className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3">
              <p className="text-white font-semibold text-sm mb-1.5">{zap.title}</p>
              <p className="text-zinc-400 text-xs mb-0.5"><span className="text-zinc-500 uppercase tracking-wider">Trigger:</span> {zap.trigger}</p>
              <p className="text-zinc-400 text-xs mb-0.5"><span className="text-zinc-500 uppercase tracking-wider">Action:</span> {zap.action}</p>
              <p className="text-teal-400 text-xs mt-1.5">Use case: {zap.use}</p>
            </div>
          ))}
        </div>
      </WorkflowStep>
      <WorkflowStep stepNumber={3} title="Test each Zap with the built-in test feature before relying on it" workflowId="free_zapier">
        <p className="text-zinc-300 text-sm">Never trust a Zap you haven't tested. One click in the Zapier editor sends a real test event through the whole chain.</p>
      </WorkflowStep>
      <WorkflowStep stepNumber={4} title="Use ChatGPT to design more complex Zaps" workflowId="free_zapier">
        <PromptBlock content={`"I want to automate this process in Zapier: [describe your manual process step by step]. What trigger and actions should I use? What apps do I need to connect?"`} />
      </WorkflowStep>
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mt-4">
        <p className="text-white font-semibold text-sm mb-3">5 Power Zaps to Build Next</p>
        <ol className="space-y-1.5">
          {[
            'New Slack message with keyword → Create task in Todoist / Asana',
            'New row in spreadsheet → Send personalized email to that contact',
            'New email attachment → Save to specific Google Drive folder',
            "Daily schedule trigger → Send yourself a Slack summary of today's tasks",
            'New invoice email → Log amount in budget spreadsheet + notify manager',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-zinc-300 text-sm">
              <span className="text-teal-400 font-bold shrink-0">{i + 1}.</span>{item}
            </li>
          ))}
        </ol>
      </div>
    </WorkflowCard>
  )
}

function ReportsTab() {
  return (
    <WorkflowCard title="One-Prompt Reports That Impress Your Boss" timeSaved="~3 hrs/week" tools="ChatGPT + Google Docs / Word" id="reports">
      <WorkflowStep stepNumber={1} title="Save this report template prompt" workflowId="free_reports">
        <PromptBlock content={`"I need a [weekly/monthly] [report type] for [audience]. Here's my raw data:\n[paste data]\n\nStructure the report as:\n1. Executive Summary (3 sentences max)\n2. Key Metrics (table format)\n3. What's Working\n4. What Needs Attention\n5. Recommended Next Steps\n\nTone: professional, concise, data-driven. Keep it under 1 page."`} />
      </WorkflowStep>
      <WorkflowStep stepNumber={2} title="Feed it your actual numbers" workflowId="free_reports">
        <p className="text-zinc-300 text-sm">Copy raw data from your spreadsheet, CRM, or dashboard. Paste messy data — ChatGPT will organize it.</p>
      </WorkflowStep>
      <WorkflowStep stepNumber={3} title="Polish and personalize (5 minutes max)" workflowId="free_reports">
        <ul className="space-y-1 mt-1">
          {['Add context only you know', 'Adjust tone for your specific audience', 'Add one insight that shows YOU are thinking'].map((item) => (
            <li key={item} className="flex items-start gap-2 text-zinc-300 text-sm"><span className="text-teal-400">→</span>{item}</li>
          ))}
        </ul>
      </WorkflowStep>
      <WorkflowStep stepNumber={4} title="Build a report library" workflowId="free_reports">
        <div className="flex flex-wrap gap-2 mt-1">
          {['Weekly status', 'Monthly performance', 'Quarterly review', 'Project update', 'Budget summary'].map((t) => (
            <span key={t} className="text-xs bg-zinc-800 border border-zinc-700 text-zinc-300 px-3 py-1 rounded-full">{t}</span>
          ))}
        </div>
      </WorkflowStep>
      {/* Upsell lives on the last workflow tab */}
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
    </WorkflowCard>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// PAGE
// ══════════════════════════════════════════════════════════════════════════

export default function Free() {
  const [activeTab, setActiveTab] = useState('start')

  const tabs = [
    { id: 'start',   label: 'Start Here',          content: <StartHereTab setActiveTab={setActiveTab} /> },
    { id: 'email',   label: 'Email Drafting',       content: <EmailDraftingTab /> },
    { id: 'meeting', label: 'Meeting Notes',        content: <MeetingNotesTab /> },
    { id: 'sheets',  label: 'Spreadsheets',         content: <SpreadsheetsTab /> },
    { id: 'zapier',  label: 'Zapier Automations',   content: <ZapierTab /> },
    { id: 'reports', label: 'One-Prompt Reports',   content: <ReportsTab /> },
    { id: 'prompts', label: 'Prompt Library',       content: <PromptLibrary prompts={ALL_PROMPTS} /> },
  ]

  return (
    <div className="min-h-screen text-white flex flex-col" style={{ backgroundColor: '#111118' }}>
      <Navbar />
      <TabDashboard
        tabs={tabs}
        pageTitle="FlowState Free Guide"
        pageSubtitle="5 AI Workflows That Eliminate Half Your Workload"
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <footer className="py-8 text-center" style={{ borderTop: '1px solid #2a2a38' }}>
        <p className="text-zinc-500 text-sm">© 2026 The Restack. Built for the ones who didn't wait.</p>
      </footer>
      <Adonis />
    </div>
  )
}
