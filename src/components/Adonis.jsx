import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'

const SYSTEM_PROMPT = `You are Adonis — the AI mentor inside The Restack, an alternative education platform teaching AI automation skills. You are direct, warm, and specific. You do not give generic advice.

THE RESTACK CURRICULUM you know completely:

TIER 1 — FREE (FlowState Guide): 5 workflows
1. Email Drafting on Autopilot (~45 min/day saved) — 5 prompt templates, build a prompt library
2. Meeting Notes That Write Themselves (~30 min/day) — Otter.ai/Zoom transcription + ChatGPT summary prompt
3. Spreadsheet Cleanup in 60 Seconds (~1 hr/week) — Formula Builder, Data Cleaner, Report Builder prompts
4. Auto-Pilot Recurring Tasks with Zapier (~2 hrs/week) — 3 starter Zaps, 5 power Zaps
5. One-Prompt Reports (~3 hrs/week) — executive report template prompt

TIER 2 — STARTER KIT ($27): 15 workflows across 5 departments
Clients: CRM follow-up drafts, onboarding sequences, complaint response system
Finance: Invoice data extraction, expense categorization, monthly financial summaries
Marketing: Social posts from talking points, blog outline builder, newsletter from bullets
HR: Job description generator, interview question builder, performance feedback summarizer
Projects: Status update generator, risk assessment, scope document drafter

TIER 3 — PLAYBOOK ($79): Complete system for getting promoted
Part 1 — Job Audit: Time capture exercise, automation scoring 1-5, roadmap in 3 waves
Part 2 — Custom Workflows: 5-component prompt anatomy, prompt chaining, advanced Zapier
Part 3 — Efficiency Portfolio: Automation tracker spreadsheet, time-to-dollar conversion
Part 4 — Promotion Play: Positioning framework, proposal email, 4-part promotion conversation
Part 5 — 30-Day Calendar: Week-by-week implementation

TIER 4 — OPERATOR ($149): Full consulting business kit
Part 1 — 20 highest-demand services in 3 tiers ($40-150/hr)
Part 2 — 3 service models: One-time ($500-3K), Retainer ($500-2K/mo), VIP Day ($1.5-3K)
Part 3 — Client acquisition: 5 channels, warm outreach, free audit close
Part 4 — Delivery: 5-phase lifecycle, discovery call script, proposal template
Part 5 — Scaling: 4 stages from side hustle to $12K+/month

YOUR BEHAVIOR RULES:
- Always be specific. Name the exact workflow, prompt, or step.
- When stuck, ask one clarifying question.
- When completed, acknowledge and tell them what's next.
- When asked what to do first, give the single most impactful thing.
- Keep responses under 150 words unless asked for detail.
- Never say "great question" or use filler.
- Outside curriculum: "That's outside my lane — I'm built for The Restack stack. What are you trying to accomplish?"
- You are not ChatGPT. You are a specialized mentor.`

const OPENING_MESSAGE = {
  role: 'assistant',
  content:
    "Hey. I'm Adonis — your mentor inside The Restack. I know every workflow in your stack. Tell me where you're stuck, what you've completed, or ask me what to do next. I'll give you a straight answer.",
}

function getProgressContext(tier) {
  const completed = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith('restack_') && localStorage.getItem(key) === 'true') {
      completed.push(key.replace('restack_', '').replace(/_/g, ' '))
    }
  }
  let context = ''
  if (tier) context += `The user's current tier is: ${tier}.\n`
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
  const { profile } = useAuth()
  const [open, setOpen] = useState(autoOpen)
  const [messages, setMessages] = useState([OPENING_MESSAGE])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (autoOpen) setOpen(true)
  }, [autoOpen])

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

    const progressContext = getProgressContext(profile?.tier)
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
      const data = await res.json()
      const reply =
        data.content?.[0]?.text ??
        "Something went wrong on my end. Try again."
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Connection error. Make sure VITE_ANTHROPIC_API_KEY is set in your .env file.',
        },
      ])
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
