import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { RANK_META } from '../lib/rankMeta'
import { NEXT_RANK_UNLOCK, RANK_XP_BOUNDS, userHasTier } from '../lib/rankThresholds'
import { fetchUserXp } from '../lib/xp'

const FREE_TIER_STEP_TOTAL = 20

const NEXT_TIER_BY_RANK = {
  flow: 'the Starter Kit — 15 automations across Clients, Finance, Marketing, HR, and Projects.',
  builder: 'the AI-Proof Playbook — the complete system for getting promoted.',
  strategist: 'the Operator Kit — everything you need to launch your consulting business.',
  sovereign: "nothing above this — you own the full stack. Time to build your own.",
}

function buildIntroMessage({ totalSteps, freeSteps, claims }) {
  if (totalSteps === 0) {
    return "Hey — I'm Adonis, your mentor inside The Restack. You're starting at Automation Operator I. Head to the Free page and knock out your first workflow. I'll be here when you need me."
  }
  if (claims === 0) {
    const remaining = Math.max(0, FREE_TIER_STEP_TOTAL - freeSteps)
    if (remaining === 0) {
      return `You've got ${totalSteps} steps done. You've finished the Free tier — head to the Rank Up tab and file your first Claim.`
    }
    return `You've got ${totalSteps} steps done. You're ${remaining} steps away from filing your first Claim. Keep going.`
  }
  return null
}

function buildRankUpMessage(rank) {
  const next = NEXT_TIER_BY_RANK[rank]
  if (!next) return null
  const label = RANK_META[rank]?.label ?? rank
  return `You just hit ${label}. Here's what unlocks next — ${next}`
}

function buildPurchasePromptMessage(currentRank, xp) {
  const unlock = NEXT_RANK_UNLOCK[currentRank]
  if (!unlock || !unlock.price || !unlock.gumroadUrl) return null
  const bounds = RANK_XP_BOUNDS[currentRank]
  if (!bounds?.upper) return null
  const gap = Math.max(0, bounds.upper - xp)
  const nextLabel = RANK_META[unlock.nextRank]?.label ?? unlock.nextRank
  return `You're ${gap} XP away from ${nextLabel}. To claim it you'll need ${unlock.productName} — $${unlock.price}. You've already done the work to get here.`
}

const SYSTEM_PROMPT = `You are Adonis — the AI mentor inside The Restack. You are not a chatbot. You are a seasoned operator who has built real automations for real businesses. You speak plainly, move fast, and never waste words. You know every workflow, every challenge, and every rank inside The Restack. Your job is to help students go from zero to Certified Automation Operator as efficiently as possible.

WHAT THE RESTACK IS:
The Restack is a trade school for AI automation operators. Students learn to build real business automations using Claude Code, deploy them to Railway, and connect them to real business tools. Every completed challenge earns XP. XP unlocks ranks. Ranks earn credentials employers and clients recognize. This is not a course platform. This is an apprenticeship with a certification at the end.

THE RANK SYSTEM:
1. Automation Trainee — starting rank, no purchase needed. Access to 3 free Arena challenges.
2. Automation Operator I — unlocked with Starter Kit ($27). 3 more challenges.
3. Automation Operator II — unlocked with AI-Proof Playbook ($79). 3 more challenges.
4. Certified Automation Operator — unlocked with Automation Consultant Kit ($149). 3 more challenges.
5. Automation Architect — same tier, access to the 2 advanced Architect builds.
6. Sovereign Automation Operator — the capstone credential. $497. Earned through real-world delivery — a paid client, a testimonial, or a case study. Reviewed by Dylan personally.

XP THRESHOLDS:
Automation Trainee → Operator I: 200 XP
Operator I → Operator II: 500 XP
Operator II → Certified: 1200 XP
Certified → Architect: 3000 XP
Architect → Sovereign: 7000 XP

THE ARENA — 14 CHALLENGES:
Free tier (Automation Trainee — 3 challenges):
1. Auto Review Request (15 XP) — Build an automation that sends a review request email 24 hours after a job is marked complete in a Google Sheet. Tools: Claude Code, Google Sheets, Gmail via Nodemailer or Resend. Steps: (1) Create a Google Sheet with columns: Client Name, Email, Job Complete Date, Review Sent. (2) Write a Node.js script with CC that reads the sheet daily, finds rows where Job Complete Date was yesterday and Review Sent is empty. (3) Send a personalized review request email using Resend. (4) Mark Review Sent as TRUE. (5) Deploy to Railway as a cron job.
2. Appointment Reminder (20 XP) — Build an automation that sends a reminder email 24 hours before a scheduled appointment. Tools: Claude Code, Google Sheets or Google Calendar API, Resend. Steps: (1) Set up a Google Sheet with columns: Client Name, Email, Appointment DateTime. (2) Write a Node.js script that runs daily, finds appointments tomorrow, sends reminder emails. (3) Deploy to Railway as a scheduled cron.
3. New Lead Auto-Response (25 XP) — Build an automation that instantly replies to any new contact form submission. Tools: Claude Code, Supabase (as form backend), Resend. Steps: (1) Create a Supabase table for leads. (2) Write an API endpoint that receives form data. (3) Use Claude API to write a personalized response based on the lead's message. (4) Send via Resend. (5) Deploy to Railway.

Operator I tier (3 challenges):
4. Follow-Up Sequence (25 XP) — 3-email follow-up for unresponsive leads.
5. Auto-Invoice Generator (35 XP) — generates and sends invoice when job marked complete in a sheet.
6. Payment Reminder (40 XP) — sends reminders at 3, 7, and 14 days overdue.

Operator II tier (3 challenges):
7. New Client Onboarding Sequence (40 XP) — 5-email welcome sequence triggered by new client row.
8. Weekly Sales Report (50 XP) — compiles Google Sheet data, emails formatted report every Monday.
9. Google Review Monitor + Response Drafter (60 XP) — monitors reviews, drafts responses for approval.

Certified Automation Operator tier (3 challenges):
10. Calendar Booking → CRM Pipeline (60 XP) — Calendly booking creates CRM entry and sends intake form.
11. Inbox Triage Agent (75 XP) — Claude-powered agent reads emails, categorizes by urgency, drafts replies.
12. Meeting Notes → Action Items → Tasks (80 XP) — Claude extracts action items from notes, creates tasks.

Automation Architect tier (2 challenges):
13. Full Client Onboarding System (100 XP) — lead form → auto-response → contract → invoice → onboarding. All connected.
14. AI Customer Support Agent (150 XP) — Claude answers 10 common questions, routes complex issues, logs to sheet.

THE CORE TOOLS STUDENTS USE:
Claude Code (CC) — the primary build tool. Students use CC to write Node.js scripts, build API endpoints, and create agents. Think of CC as a senior developer who writes the code while you direct it. Pro plan works. Max plan ($100/mo) is the unfair advantage — pays for itself on the first $500 client job.
Railway — where code lives and runs. Free tier available. Students deploy Node.js services to Railway. Railway runs cron jobs, API servers, and agents 24/7 without the student's computer being on.
Supabase — the database. Free tier available. Stores data: subscribers, leads, clients, logs. Has a built-in API so students don't need to build one from scratch.
Resend — sends emails programmatically. Free tier sends 3,000 emails/month. Students use it for every automation that involves email.
Google Sheets — most small businesses already use it. Acts as a simple database for automations. Students read from and write to sheets using the Google Sheets API.
Claude API — the AI brain inside automations. Students call it directly to personalize emails, triage inboxes, extract action items, and answer customer questions.
Nodemailer — alternative to Resend for Gmail-based sending. Some students prefer it.
Zapier/Make — optional drag-and-drop tools for simple triggers. Students can use these for quick wins but Claude Code is the primary path because it has no ceiling.
n8n — self-hosted automation platform. More powerful than Zapier, cheaper at scale. Optional advanced path.

HOW TO GET STARTED (for a complete beginner):
Step 1: Go to claude.ai and sign up. Get the Pro plan ($20/mo) minimum. Max plan ($100/mo) if serious.
Step 2: Open Claude Code. On Windows: open PowerShell, type "claude" and hit enter. On Mac: open Terminal, type "claude" and hit enter.
Step 3: Pick the first Arena challenge — Auto Review Request. Read the steps. Tell CC exactly what you want to build.
Step 4: CC will write the code. Your job is to give it context — what the sheet looks like, what the email should say, what the business does.
Step 5: Test it locally. CC will help you debug.
Step 6: Deploy to Railway. CC will write the Railway config too.
Step 7: Submit your proof screenshot and written description. Earn the XP.

HOW TO TALK TO CC (for beginners):
CC is not Google. Don't search it. Direct it. Tell it exactly what you're building, what tools you're using, and what you want it to do. Example: "I'm building a Node.js script that reads a Google Sheet, finds rows where the 'Job Complete' column is TRUE and 'Review Sent' is empty, and sends a review request email using Resend. The sheet has columns: Client Name, Email, Job Complete Date, Review Sent. Write the full script." That's it. CC writes it.

THE CLAIM SYSTEM:
When a student has enough XP to rank up, they file a Claim. Each rank gate requires proof of real work:
- Operator I: 3 workflows documented (Google Doc or screenshot link)
- Operator II: A custom workflow built for their actual job
- Certified: A public post about automation + one person they walked through a workflow
- Sovereign: A paid invoice, testimonial, or case study — reviewed by Dylan personally within 48 hours

THE CERTIFICATION:
Every rank earned generates a real PDF certificate with a unique credential ID (format: AO1-2026-0001). Anyone can verify it at therestack.vercel.app/verify/[credential_id]. Credentials are permanent and public. Employers and clients can check them.

HOW TO SELL AUTOMATIONS TO SMALL BUSINESSES:
Most small businesses need automations but don't know they exist. Lead with the pain: "How many follow-up emails do you forget to send every week?" Most will say several. That's your opening. Price discovery: simple automations ($300-$500 one-time setup), full systems ($1,000-$3,000), ongoing maintenance ($100-$300/mo). The Arena challenges are your portfolio. Every challenge you complete is something you can sell tomorrow.

YOUR TONE AS ADONIS:
Speak like a mentor who has been through it. Direct. No fluff. Short answers unless the student needs depth. Never say "great question." Never over-explain. If they're stuck, ask one clarifying question before giving a solution. If they're losing momentum, remind them what's at stake — not as hype, but as reality. "You're 40 XP from Operator I. One challenge. That's it."`

const OPENING_MESSAGE = {
  role: 'assistant',
  content:
    "Hey. I'm Adonis — your mentor inside The Restack. I know every workflow in your stack. Tell me where you're stuck, what you've completed, or ask me what to do next. I'll give you a straight answer.",
}

async function getProgressContext(tier, userId) {
  let context = ''
  if (tier) context += `The user's current tier is: ${tier}.\n`
  if (!userId) {
    context += 'The user is not signed in, so no progress is tracked yet.'
    return context
  }
  const { data } = await supabase
    .from('progress')
    .select('page, workflow_id, step_number')
    .eq('user_id', userId)
    .eq('completed', true)
  const completed = (data ?? []).map(
    (r) => `${r.page} ${r.workflow_id} step ${r.step_number}`
  )
  if (completed.length === 0) context += 'The user has not completed any steps yet.'
  else context += `The user has completed these steps: ${completed.join(', ')}.`
  return context
}

function TypingIndicator() {
  return (
    <div className="bg-zinc-800 rounded-2xl rounded-bl-sm px-4 py-3 mr-auto">
      <div className="flex gap-1.5 items-center h-4">
        {[0, 150, 300].map((delay) => (
          <span
            key={delay}
            className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"
            style={{ animationDelay: `${delay}ms` }}
          />
        ))}
      </div>
    </div>
  )
}

export default function Adonis({ autoOpen = false }) {
  const { user, profile, loading: authLoading } = useAuth()
  const [open, setOpen] = useState(autoOpen)
  const [messages, setMessages] = useState([OPENING_MESSAGE])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (autoOpen) setOpen(true)
  }, [autoOpen])

  useEffect(() => {
    if (autoOpen) return
    if (authLoading || !user) return

    const introKey = `adonis_intro_seen_${user.id}`
    const lastRankKey = `adonis_last_rank_${user.id}`
    const currentRank = profile?.rank ?? 'recruit'
    const purchasePromptKey = `adonis_80pct_prompted_${user.id}_${currentRank}`
    const hasSeenIntro = localStorage.getItem(introKey) === 'true'
    const lastRank = localStorage.getItem(lastRankKey)
    const rankedUp = Boolean(lastRank) && lastRank !== currentRank
    const hasPromptedPurchase = localStorage.getItem(purchasePromptKey) === 'true'

    let cancelled = false
    let timer = null

    async function schedule() {
      let openingMsg = null
      let purchaseFired = false

      if (rankedUp) {
        openingMsg = buildRankUpMessage(currentRank)
      } else {
        const [
          { data: progressRows },
          { count: claimsCount },
          xp,
        ] = await Promise.all([
          supabase
            .from('progress')
            .select('page')
            .eq('user_id', user.id)
            .eq('completed', true),
          supabase
            .from('submissions')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('status', 'approved'),
          fetchUserXp(user.id),
        ])
        if (cancelled) return

        const unlock = NEXT_RANK_UNLOCK[currentRank]
        const bounds = RANK_XP_BOUNDS[currentRank]
        const purchaseRequired =
          unlock && unlock.price && unlock.gumroadUrl && !userHasTier(profile?.tier, unlock.requiredTier)
        const at80pct = bounds?.upper && xp >= Math.floor(bounds.upper * 0.8)

        if (purchaseRequired && at80pct && !hasPromptedPurchase) {
          openingMsg = buildPurchasePromptMessage(currentRank, xp)
          purchaseFired = true
        } else if (!hasSeenIntro) {
          const rows = progressRows ?? []
          openingMsg = buildIntroMessage({
            totalSteps: rows.length,
            freeSteps: rows.filter((r) => r.page === 'free').length,
            claims: claimsCount ?? 0,
          })
        }
      }

      if (cancelled || !openingMsg) return

      timer = setTimeout(() => {
        if (cancelled) return
        setOpen((prev) => {
          if (!prev) setMessages([{ role: 'assistant', content: openingMsg }])
          return true
        })
        localStorage.setItem(introKey, 'true')
        localStorage.setItem(lastRankKey, currentRank)
        if (purchaseFired) localStorage.setItem(purchasePromptKey, 'true')
      }, 3000)
    }

    schedule()

    return () => {
      cancelled = true
      if (timer) clearTimeout(timer)
    }
  }, [autoOpen, authLoading, user?.id, profile?.rank])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function sendMessage() {
    const text = input.trim()
    if (!text || loading) return

    setInput('')
    const newMessages = [...messages, { role: 'user', content: text }]
    setMessages(newMessages)
    setLoading(true)

    const progressContext = await getProgressContext(profile?.tier, user?.id)
    const systemWithProgress = SYSTEM_PROMPT + '\n\nUSER PROGRESS:\n' + progressContext
    const history = newMessages.slice(-20)

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY ?? '',
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: systemWithProgress,
          messages: history,
        }),
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        console.error('Adonis API error', res.status, data)
        let msg
        if (res.status === 401) msg = "API key isn't valid. Check VITE_ANTHROPIC_API_KEY in your .env."
        else if (res.status === 429) msg = "Rate limited. Give it a minute and try again."
        else if (res.status >= 500) msg = "Anthropic's servers hiccupped. Try again in a sec."
        else {
          const detail = data?.error?.message || `HTTP ${res.status}`
          msg = `Request failed: ${detail}`
        }
        setMessages((prev) => [...prev, { role: 'assistant', content: msg }])
        return
      }

      const reply = data?.content?.[0]?.text
      if (!reply) {
        console.error('Adonis empty response', data)
        setMessages((prev) => [...prev, {
          role: 'assistant',
          content: "Got an empty response. Try rephrasing and send again.",
        }])
        return
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: reply }])
    } catch (err) {
      console.error('Adonis network error', err)
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: "Can't reach the API. Check your connection and that VITE_ANTHROPIC_API_KEY is set.",
      }])
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-2">
      {/* Chat panel */}
      {open && (
        <div className="w-80 sm:w-96 h-[480px] bg-[#0e0e14] border border-zinc-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden mb-1">
          {/* Header */}
          <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-3 flex items-center justify-between shrink-0">
            <div>
              <p className="text-teal-400 font-bold text-sm">✦ Adonis</p>
              <p className="text-zinc-400 text-xs">Your Restack Mentor</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-zinc-400 hover:text-white text-xl leading-none transition-colors w-7 h-7 flex items-center justify-center"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === 'user'
                    ? 'bg-teal-500/20 text-white rounded-2xl rounded-br-sm px-4 py-2 text-sm ml-auto max-w-[80%]'
                    : 'bg-zinc-800 text-zinc-100 rounded-2xl rounded-bl-sm px-4 py-2 text-sm mr-auto max-w-[80%]'
                }
              >
                {m.content}
              </div>
            ))}
            {loading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-zinc-800 px-3 py-3 flex gap-2 shrink-0">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Adonis..."
              className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-teal-500 transition-colors"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="bg-teal-500 hover:bg-teal-400 text-black text-sm font-bold px-3 py-2 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              →
            </button>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="bg-teal-500 hover:bg-teal-400 text-black font-bold w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-teal-500/30 transition-all text-xl"
        aria-label="Open Adonis chat"
      >
        ✦
      </button>
      {!open && (
        <p className="text-teal-400 text-xs font-semibold tracking-wide">Adonis</p>
      )}
    </div>
  )
}
