/* eslint-disable no-console */
/**
 * Snape — end-to-end walkthrough bot for The Restack.
 *
 * Snape simulates a real user going through the app from sign-in to Arena
 * submission, logging every step as PASS or FAIL and printing a final report.
 *
 * Usage:
 *   node tests/snape.js
 *   HEADLESS=1 node tests/snape.js
 *   BASE_URL=http://localhost:5173 node tests/snape.js
 *
 * Prerequisites:
 *   1. npm i -D playwright && npx playwright install chromium
 *   2. Seed the test user by running tests/snape-seed.sql in the Supabase
 *      SQL Editor. Credentials:
 *        email:    snape@therestack.com
 *        password: TestSnape123!
 */

import { chromium } from 'playwright'

const BASE_URL  = process.env.BASE_URL  || 'https://therestack.vercel.app'
const EMAIL     = process.env.SNAPE_EMAIL    || 'snape@therestack.com'
const PASSWORD  = process.env.SNAPE_PASSWORD || 'TestSnape123!'
const HEADLESS  = process.env.HEADLESS === '1'
const PROOF_URL = 'https://snape.example/test-proof-from-snape'

const results = []

function record(step, name, status, note = '') {
  results.push({ step, name, status, note })
  const icon = status === 'PASS' ? '✓' : '✗'
  const line = `${icon} [${status}] Step ${step}: ${name}`
  console.log(note ? `${line}\n    └─ ${note}` : line)
}

function divider() {
  console.log('─'.repeat(64))
}

async function runStep(step, name, fn) {
  console.log(`\n[${step}] ${name}`)
  try {
    const note = await fn()
    record(step, name, 'PASS', typeof note === 'string' ? note : '')
  } catch (err) {
    const msg = (err && err.message) ? err.message.split('\n')[0] : String(err)
    record(step, name, 'FAIL', msg)
  }
}

async function main() {
  const browser = await chromium.launch({
    headless: HEADLESS,
    slowMo: HEADLESS ? 0 : 100,
  })
  const context = await browser.newContext()
  const page = await context.newPage()

  page.on('console', (msg) => {
    if (msg.type() === 'error') console.log(`  [console.error] ${msg.text()}`)
  })
  page.on('pageerror', (err) => console.log(`  [pageerror] ${err.message}`))

  // ── 1. Navigate to landing ─────────────────────────────────────────────────
  await runStep(1, 'Navigate to landing page', async () => {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' })
    await page.waitForLoadState('networkidle').catch(() => {})
    return `loaded ${page.url()}`
  })

  // ── 2. Click Sign in → sign in ────────────────────────────────────────────
  await runStep(2, `Sign in as ${EMAIL}`, async () => {
    const signInLink = page.getByRole('link', { name: /^Sign in$/i }).first()
    if (await signInLink.count() > 0) {
      await signInLink.click()
    } else {
      await page.goto(`${BASE_URL}/login`, { waitUntil: 'domcontentloaded' })
    }
    await page.locator('input[type="email"]').fill(EMAIL)
    await page.locator('input[type="password"]').fill(PASSWORD)
    await page.getByRole('button', { name: /^Sign in/i }).click()
    await page.waitForURL(/\/profile/, { timeout: 10000 })
    return `signed in, landed at ${page.url()}`
  })

  // ── 3. Confirm redirect to /profile ───────────────────────────────────────
  await runStep(3, 'Confirm redirect to /profile', async () => {
    if (!/\/profile(\?|#|\/|$)/.test(page.url())) {
      throw new Error(`current url is ${page.url()}, expected /profile`)
    }
    return `on ${page.url()}`
  })

  // ── 4. Click Free in nav → verify /free content ───────────────────────────
  await runStep(4, 'Click "Free" in nav and verify /free loads', async () => {
    const freeLink = page.getByRole('link', { name: /^Free$/ }).first()
    if (await freeLink.count() === 0) throw new Error('no "Free" link in nav')
    await freeLink.click()
    await page.waitForURL(/\/free/, { timeout: 10000 })
    await page.waitForLoadState('networkidle').catch(() => {})
    if (/\/upgrade/.test(page.url())) {
      throw new Error('redirected to /upgrade — test user lacks free tier access (profile.tier may be null)')
    }
    const hasWorkflow = await page.getByText(/Email Drafting/i).count()
    if (hasWorkflow === 0) throw new Error('no workflow content visible on /free')
    return '/free loaded with workflow content'
  })

  // ── 5. Check 3 workflow checkboxes, refresh, confirm persistence ──────────
  await runStep(5, 'Check 3 workflow checkboxes and confirm persistence across refresh', async () => {
    const boxes = page.locator('input[type="checkbox"]')
    const n = await boxes.count()
    if (n === 0) throw new Error('no checkboxes visible on /free')

    let newlyChecked = 0
    let alreadyChecked = 0
    const indicesChecked = []
    for (let i = 0; i < n && newlyChecked + alreadyChecked < 3; i++) {
      const cb = boxes.nth(i)
      if (await cb.isChecked()) {
        alreadyChecked++
        indicesChecked.push(i)
      } else {
        await cb.check()
        newlyChecked++
        indicesChecked.push(i)
        await page.waitForTimeout(220) // let the supabase upsert land
      }
    }
    if (newlyChecked + alreadyChecked < 3) {
      throw new Error(`only ${newlyChecked + alreadyChecked} checkboxes available on this tab`)
    }

    // Reload and verify persistence
    await page.reload({ waitUntil: 'domcontentloaded' })
    await page.waitForLoadState('networkidle').catch(() => {})
    const boxesAfter = page.locator('input[type="checkbox"]')
    let stillChecked = 0
    for (const idx of indicesChecked) {
      const cb = boxesAfter.nth(idx)
      if (await cb.count() > 0 && await cb.isChecked()) stillChecked++
    }
    if (stillChecked < indicesChecked.length) {
      throw new Error(`checked ${indicesChecked.length} boxes but only ${stillChecked} persisted after reload`)
    }
    return `${newlyChecked} newly checked + ${alreadyChecked} pre-existing, all ${stillChecked} persisted`
  })

  // ── 6. Navigate to /arena, verify section header ──────────────────────────
  await runStep(6, 'Navigate to /arena and verify "Automation Trainee Challenges" section', async () => {
    await page.goto(`${BASE_URL}/arena`, { waitUntil: 'domcontentloaded' })
    await page.waitForLoadState('networkidle').catch(() => {})
    const header = page.getByText(/Automation Trainee Challenges/i).first()
    await header.waitFor({ state: 'visible', timeout: 8000 })
    return 'section header visible'
  })

  // ── 7. Confirm first 3 challenges unlocked ────────────────────────────────
  await runStep(7, 'First 3 challenges are unlocked (no Upgrade/Unlock Access button)', async () => {
    const firstSection = page.locator('section').first()
    // Challenge cards in the section — each has a +XP tag
    const cards = firstSection.locator('div.rounded-2xl').filter({ has: page.locator('text=/\\+\\s*\\d+ XP/') })
    const count = await cards.count()
    if (count < 3) throw new Error(`expected ≥3 cards, found ${count}`)
    for (let i = 0; i < 3; i++) {
      const card = cards.nth(i)
      const hasUpgrade = await card.getByRole('link', { name: /Upgrade/i }).count()
      const hasUnlock = await card.getByRole('link', { name: /Unlock Access/i }).count()
      if (hasUpgrade > 0 || hasUnlock > 0) {
        throw new Error(`card ${i + 1} is locked (upgrade/unlock link visible)`)
      }
    }
    return 'all 3 free-tier cards unlocked'
  })

  // ── 8. Submit Proof on challenge 1 ────────────────────────────────────────
  await runStep(8, 'Submit Proof on challenge 1 and confirm green completion state', async () => {
    const firstSection = page.locator('section').first()
    const card1 = firstSection
      .locator('div.rounded-2xl')
      .filter({ has: page.locator('text=/\\+\\s*\\d+ XP/') })
      .first()

    if (await card1.getByText(/✓\s*Completed/).count() > 0) {
      return 'already completed from prior run — card already green'
    }

    await card1.getByRole('button', { name: /Submit Proof/i }).click()

    // Modal opens — try URL input first, fall back to textarea
    const urlInput = page.locator('input[type="url"]').last()
    const textarea = page.locator('textarea').last()
    if (await urlInput.count() > 0) {
      await urlInput.fill(PROOF_URL)
    } else if (await textarea.count() > 0) {
      await textarea.fill('Test proof from Snape')
    } else {
      throw new Error('no proof input found in submission modal')
    }

    await page.getByRole('button', { name: /Complete Challenge/i }).click()

    // Wait for the green completed badge on the card
    await card1
      .getByText(/✓\s*Completed/)
      .waitFor({ state: 'visible', timeout: 8000 })
    return 'card turned green (✓ Completed)'
  })

  // ── 9. Confirm XP bar updated ─────────────────────────────────────────────
  await runStep(9, 'XP bar shows non-zero XP after submission', async () => {
    // Force a fresh read of the XP element
    const xpEl = page.getByText(/\d[\d,]*\s*XP/).first()
    if (await xpEl.count() === 0) throw new Error('no XP text visible on /arena')
    const text = (await xpEl.textContent()) || ''
    const n = parseInt(text.replace(/[^\d]/g, ''), 10)
    if (!Number.isFinite(n) || n <= 0) {
      throw new Error(`XP reads "${text.trim()}" — expected > 0`)
    }
    return `XP shows "${text.trim()}"`
  })

  // ── 10. /profile shows XP ─────────────────────────────────────────────────
  await runStep(10, 'Navigate to /profile and confirm XP is displayed', async () => {
    await page.goto(`${BASE_URL}/profile`, { waitUntil: 'domcontentloaded' })
    await page.waitForLoadState('networkidle').catch(() => {})
    const xpEl = page.getByText(/\d[\d,]*\s*XP/).first()
    if (await xpEl.count() === 0) throw new Error('no XP text on /profile')
    const text = (await xpEl.textContent()) || ''
    return `profile XP: "${text.trim()}"`
  })

  // ── 11. Ask Adonis; response is not an error ──────────────────────────────
  await runStep(11, 'Ask Adonis "explain the first challenge" and verify no error', async () => {
    // Open Adonis if not already open
    let input = page.getByPlaceholder(/Ask Adonis/i)
    if (!(await input.isVisible().catch(() => false))) {
      const toggle = page.getByRole('button', { name: /Open Adonis chat/i })
      if (await toggle.count() === 0) throw new Error('Adonis toggle button not found')
      await toggle.click()
      await page.waitForTimeout(400)
      input = page.getByPlaceholder(/Ask Adonis/i)
      await input.waitFor({ state: 'visible', timeout: 4000 })
    }

    const bubbleSelector = 'div.bg-zinc-800'
    const before = await page.locator(bubbleSelector).count()
    await input.fill('explain the first challenge')
    await input.press('Enter')

    // Wait up to 30s for a new assistant bubble
    const deadline = Date.now() + 30000
    let after = before
    while (Date.now() < deadline) {
      await page.waitForTimeout(500)
      after = await page.locator(bubbleSelector).count()
      if (after > before) break
    }
    if (after <= before) throw new Error('no Adonis response within 30s')

    const reply = (await page.locator(bubbleSelector).last().textContent()) || ''
    const errorPatterns = [
      /Connection error/i,
      /Something went wrong on my end/i,
      /VITE_ANTHROPIC_API_KEY/i,
    ]
    for (const p of errorPatterns) {
      if (p.test(reply)) {
        throw new Error(`Adonis returned error: "${reply.trim().slice(0, 120)}"`)
      }
    }
    const preview = reply.trim().replace(/\s+/g, ' ').slice(0, 80)
    return `Adonis replied: "${preview}${reply.length > 80 ? '…' : ''}"`
  })

  // ── 12. /arena/verify (if exists) ─────────────────────────────────────────
  await runStep(12, 'Navigate to /arena/verify (if exists)', async () => {
    const errors = []
    const listener = (err) => errors.push(err.message)
    page.on('pageerror', listener)
    try {
      await page.goto(`${BASE_URL}/arena/verify`, { waitUntil: 'domcontentloaded' })
    } catch (e) {
      page.off('pageerror', listener)
      throw new Error(`navigation failed: ${e.message}`)
    }
    await page.waitForTimeout(1500)
    page.off('pageerror', listener)

    if (errors.length > 0) throw new Error(`page error: ${errors[0]}`)

    // Route isn't wired in App.jsx at time of writing — expect either a
    // verify-specific page or a blank fall-through. As long as the app
    // didn't crash, log as pass with a note.
    const body = (await page.locator('body').textContent()) || ''
    const hasVerifyContent = /verify/i.test(body)
    return hasVerifyContent
      ? 'verify page rendered content'
      : 'no verify route in App.jsx (page did not crash)'
  })

  // ── Final report ──────────────────────────────────────────────────────────
  console.log('\n')
  divider()
  console.log('                      SNAPE REPORT')
  divider()
  for (const r of results) {
    const icon = r.status === 'PASS' ? '✓' : '✗'
    const base = `${icon} [${r.status}] Step ${r.step}: ${r.name}`
    console.log(r.note ? `${base}\n    └─ ${r.note}` : base)
  }
  divider()
  const passed = results.filter((r) => r.status === 'PASS').length
  const failed = results.filter((r) => r.status === 'FAIL').length
  console.log(`Total: ${passed} passed · ${failed} failed · ${results.length} steps`)
  divider()

  await browser.close()
  if (failed > 0) process.exitCode = 1
}

main().catch((err) => {
  console.error('\n✗ Snape crashed:', err && err.message ? err.message : err)
  process.exitCode = 1
})
