import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import QRCode from 'qrcode'
import { supabase } from './supabase'
import { RANK_META } from './rankMeta'

// ── Colors ──────────────────────────────────────────────────────────────────
const C_BG   = rgb(0.039, 0.039, 0.063)   // #0a0a10
const C_TEAL = rgb(0,     0.831, 0.667)   // #00D4AA
const C_GOLD = rgb(0.984, 0.749, 0.141)   // #FBBF24
const C_WHITE = rgb(1,    1,     1)
const C_GRAY  = rgb(0.6,  0.6,   0.65)
const C_DIM   = rgb(0.35, 0.35,  0.4)

// ── Credential ID ────────────────────────────────────────────────────────────

export async function generateCredentialId(rank) {
  const meta = RANK_META[rank]
  if (!meta?.code) throw new Error(`No credential code for rank: ${rank}`)
  const { data, error } = await supabase.rpc('next_credential_id', { rank_code: meta.code })
  if (error) throw error
  return data
}

// ── PDF certificate ──────────────────────────────────────────────────────────

export async function generateCertificate({ credentialId, fullName, jobTitle, company, state, rank }) {
  const meta = RANK_META[rank]
  if (!meta?.code) throw new Error(`No credential code for rank: ${rank}`)

  // Page: US Letter landscape
  const W = 792
  const H = 612

  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([W, H])

  const bold    = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const regular = await pdfDoc.embedFont(StandardFonts.Helvetica)

  // ── Background ──────────────────────────────────────────────────────────
  page.drawRectangle({ x: 0, y: 0, width: W, height: H, color: C_BG })

  // Outer border
  page.drawRectangle({
    x: 24, y: 24, width: W - 48, height: H - 48,
    borderColor: C_TEAL, borderWidth: 0.6,
  })
  // Inner decorative line
  page.drawRectangle({
    x: 32, y: 32, width: W - 64, height: H - 64,
    borderColor: C_TEAL, borderWidth: 0.15, opacity: 0.25,
  })

  // ── Wordmark ─────────────────────────────────────────────────────────────
  const wordmark = 'THE RESTACK'
  const wordmarkSize = 11
  const wordmarkW = bold.widthOfTextAtSize(wordmark, wordmarkSize)
  page.drawText(wordmark, {
    x: (W - wordmarkW) / 2, y: 543,
    size: wordmarkSize, font: bold, color: C_TEAL, characterSpacing: 3,
  })

  // Line under wordmark
  page.drawLine({
    start: { x: 150, y: 533 }, end: { x: W - 150, y: 533 },
    thickness: 0.4, color: C_TEAL, opacity: 0.3,
  })

  // ── Rank icon ────────────────────────────────────────────────────────────
  const iconText = meta.icon
  const iconSize = 30
  const iconW = bold.widthOfTextAtSize(iconText, iconSize)
  page.drawText(iconText, {
    x: (W - iconW) / 2, y: 487,
    size: iconSize, font: bold, color: C_GOLD,
  })

  // ── Rank display name ────────────────────────────────────────────────────
  const rankLabelSize = 19
  const rankLabelW = bold.widthOfTextAtSize(meta.label, rankLabelSize)
  page.drawText(meta.label, {
    x: (W - rankLabelW) / 2, y: 452,
    size: rankLabelSize, font: bold, color: C_TEAL, characterSpacing: 1.5,
  })

  // ── "This certifies that" ────────────────────────────────────────────────
  const certifyText = 'This certifies that'
  const certifySize = 8.5
  const certifyW = regular.widthOfTextAtSize(certifyText, certifySize)
  page.drawText(certifyText, {
    x: (W - certifyW) / 2, y: 412,
    size: certifySize, font: regular, color: C_GRAY, characterSpacing: 0.4,
  })

  // ── Full name ────────────────────────────────────────────────────────────
  let nameSize = 30
  let nameW = bold.widthOfTextAtSize(fullName, nameSize)
  while (nameW > 620 && nameSize > 16) {
    nameSize -= 1
    nameW = bold.widthOfTextAtSize(fullName, nameSize)
  }
  page.drawText(fullName, {
    x: (W - nameW) / 2, y: 372,
    size: nameSize, font: bold, color: C_WHITE,
  })

  // ── Subtitle (job title / company) ───────────────────────────────────────
  let dividerY = 344
  const subParts = [jobTitle, company].filter(Boolean)
  if (subParts.length > 0) {
    const subText = subParts.join(', ')
    const subSize = 10
    const subW = regular.widthOfTextAtSize(subText, subSize)
    page.drawText(subText, {
      x: (W - subW) / 2, y: dividerY,
      size: subSize, font: regular, color: C_GRAY,
    })
    dividerY -= 22
  }

  // ── Divider ──────────────────────────────────────────────────────────────
  page.drawLine({
    start: { x: 190, y: dividerY }, end: { x: W - 190, y: dividerY },
    thickness: 0.4, color: C_DIM,
  })

  // ── Date + credential ID ─────────────────────────────────────────────────
  const issuedText = `Issued ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`
  const issuedW = regular.widthOfTextAtSize(issuedText, 8.5)
  page.drawText(issuedText, {
    x: (W - issuedW) / 2, y: dividerY - 18,
    size: 8.5, font: regular, color: C_GRAY,
  })

  const credText = `Credential ID: ${credentialId}`
  const credW = regular.widthOfTextAtSize(credText, 8.5)
  page.drawText(credText, {
    x: (W - credW) / 2, y: dividerY - 34,
    size: 8.5, font: regular, color: C_DIM,
  })

  // ── QR code ──────────────────────────────────────────────────────────────
  const verifyUrl = `${window.location.origin}/verify/${credentialId}`
  const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
    margin: 1, width: 140,
    color: { dark: '#FFFFFF', light: '#0a0a10' },
  })
  const qrBase64 = qrDataUrl.split(',')[1]
  const qrBytes = Uint8Array.from(atob(qrBase64), (c) => c.charCodeAt(0))
  const qrImage = await pdfDoc.embedPng(qrBytes)
  const qrSize = 68
  const qrX = W - qrSize - 46
  page.drawImage(qrImage, { x: qrX, y: 46, width: qrSize, height: qrSize })

  const scanText = 'Scan to verify'
  const scanW = regular.widthOfTextAtSize(scanText, 6.5)
  page.drawText(scanText, {
    x: qrX + (qrSize - scanW) / 2, y: 37,
    size: 6.5, font: regular, color: C_DIM,
  })

  // ── Bottom left ──────────────────────────────────────────────────────────
  page.drawText('therestack.com', { x: 48, y: 46, size: 7.5, font: regular, color: C_DIM })
  if (state) {
    page.drawText(state, { x: 48, y: 35, size: 6.5, font: regular, color: C_DIM })
  }

  // ── Upload to Supabase Storage ───────────────────────────────────────────
  const pdfBytes = await pdfDoc.save()
  const filename = `${credentialId}.pdf`

  const { error: uploadError } = await supabase.storage
    .from('certifications')
    .upload(filename, pdfBytes, { contentType: 'application/pdf', upsert: true })

  if (uploadError) throw uploadError

  const { data: { publicUrl } } = supabase.storage
    .from('certifications')
    .getPublicUrl(filename)

  return publicUrl
}
