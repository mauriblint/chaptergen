import { Resend } from 'resend'
import { publicSiteUrl } from '../billing/packs.js'
import type { AppLocale } from '../types/locale.js'
import type { Chapter } from '../types.js'
import { signMagicToken } from '../auth/jwt.js'
import { timeToSeconds, youtubeTimestamp } from './exports.js'

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY
  if (!key) return null
  return new Resend(key)
}

function fromAddress(): string {
  return process.env.RESEND_FROM ?? 'ChapterGen <noreply@chaptergen.com>'
}

function supportAddress(): string | null {
  const value = process.env.SUPPORT_EMAIL?.trim()
  return value || null
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// ---------------------------------------------------------------------------
// Layout. Email clients ignore most CSS, so everything is tables and inline
// styles with system fonts.

const C = {
  ink: '#111318',
  text: '#3c3f45',
  muted: '#5e6166',
  faint: '#8a8d93',
  line: '#e7e7eb',
  soft: '#f6f6f8',
  accent: '#4c3ff0',
  accentSoft: '#eeedfe',
  green: '#116b3a',
  greenSoft: '#e6f6ec',
  red: '#b42318',
  redSoft: '#fff6f5',
  redLine: '#f5c2c0',
}
const SANS = "-apple-system,'Segoe UI',Helvetica,Arial,sans-serif"
const MONO = "'SF Mono',Menlo,Consolas,monospace"

function layout(input: { preheader: string; body: string; footer: string; locale: AppLocale }): string {
  const site = publicSiteUrl()
  const help = input.locale === 'es' ? 'Ayuda' : 'Help'
  return `<!doctype html>
<html lang="${input.locale}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>ChapterGen</title></head>
<body style="margin:0;padding:0;background:${C.soft};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(input.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.soft};">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;font-family:${SANS};color:${C.ink};">
<tr><td style="padding:0 4px 20px;">
<table role="presentation" cellpadding="0" cellspacing="0"><tr>
<td style="padding-right:10px;vertical-align:middle;"><img src="${site}/android-chrome-192x192.png" width="30" height="30" alt="" style="display:block;border:0;border-radius:8px;"></td>
<td style="vertical-align:middle;font-size:20px;font-weight:800;letter-spacing:-0.03em;color:${C.ink};">chapter<span style="color:${C.accent};">gen</span></td>
</tr></table>
</td></tr>
<tr><td style="background:#ffffff;border:1px solid ${C.line};border-radius:16px;padding:32px 32px 28px;">${input.body}</td></tr>
<tr><td style="padding:20px 4px 0;font-size:12px;line-height:1.6;color:${C.faint};">
${input.footer}<br>ChapterGen · <a href="${site}" style="color:${C.faint};text-decoration:underline;">chaptergen.com</a> · <a href="mailto:${supportAddress() ?? 'hello@chaptergen.com'}" style="color:${C.faint};text-decoration:underline;">${help}</a>
</td></tr>
</table>
</td></tr>
</table>
</body></html>`
}

const h1 = (text: string) =>
  `<h1 style="margin:0 0 14px;font-size:26px;line-height:1.25;font-weight:800;letter-spacing:-0.02em;color:${C.ink};">${text}</h1>`
const p = (html: string, color = C.text) =>
  `<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:${color};">${html}</p>`
const note = (html: string) =>
  `<div style="margin:0 0 16px;padding:14px 16px;border-radius:10px;background:${C.soft};font-size:13px;line-height:1.55;color:${C.muted};">${html}</div>`
const button = (href: string, label: string) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:4px 0 18px;"><tr><td style="border-radius:10px;background:${C.ink};"><a href="${href}" style="display:inline-block;padding:14px 24px;font-family:${SANS};font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:10px;">${label}</a></td></tr></table>`
const fallback = (href: string, label: string) =>
  `<p style="margin:0;font-size:12px;line-height:1.6;color:${C.faint};">${label}<br><a href="${href}" style="color:${C.accent};word-break:break-all;">${href}</a></p>`

// ---------------------------------------------------------------------------
// Copy

const copy = {
  en: {
    help: 'Help',
    fallback: 'Button not working? Copy this link:',
    codeSubject: (code: string) => `${code} is your ChapterGen code`,
    codePreheader: 'Enter it to confirm your email. It expires in 10 minutes.',
    codeHeading: 'Your verification code',
    codeIntro: 'Your ChapterGen verification code is:',
    codeBody: 'Enter this code in ChapterGen to confirm your email. It expires in 10 minutes.',
    codeIgnore: "If you didn't try to sign in to ChapterGen, you can ignore this email. Nobody can get in without this code.",
    codeFooter: 'You received this because someone entered this address on chaptergen.com.',
    readySubject: (name: string) => `Your chapters for ${name} are ready`,
    readyPreheader: 'Chapters, transcript and subtitles are ready to copy.',
    readyHeading: 'Your video is ready',
    readyBody: (name: string, duration: string | null) =>
      `<strong>${name}</strong>${duration ? ` (${duration})` : ''} finished processing. Everything is ready to copy and download.`,
    chaptersTag: (n: number) => `${n} chapters`,
    wordsTag: (n: string) => `Transcript · ${n} words`,
    subtitlesTag: 'Subtitles SRT · VTT',
    previewTitle: 'Chapters preview',
    more: (n: number) => `+ ${n} more`,
    readyCta: 'Open results',
    readyFooter: 'You received this because you uploaded a video to ChapterGen and left the page before it finished.',
    failedSubject: (name: string) => `We couldn't process ${name}`,
    failedPreheader: 'Here is what happened.',
    failedPreheaderRefund: 'Your credit was returned. Here is what happened.',
    failedHeading: "We couldn't process your video",
    failedBody: (name: string) => `Something went wrong with <strong>${name}</strong>.`,
    refunded: '✓ Your credit was returned. You can try again at no cost.',
    failedCta: 'Upload again',
    failedHelp: 'Need help? Just reply to this email.',
    failedFooter: 'You received this because you uploaded a video to ChapterGen.',
    reasons: {
      no_speech: ['No speech detected', "We couldn't hear anyone talking in this file. Check that it has a voice track and try again."],
      no_audio: ['This file has no audio', 'The file only contains video. Downloads from YouTube are often split into video and audio; use a file that includes sound.'],
      audio_too_large: ['This file is too long to process', 'The audio is too large to transcribe. Try splitting it into shorter parts.'],
      duration_over_free_limit: ['Longer than 20 minutes', 'Free videos can be up to 20 minutes. Buy credits to process videos of any length.'],
      insufficient_credits: ['Not enough credits', 'This video needs a credit and your balance is empty.'],
      generic: ['Processing error', "We couldn't finish processing this file. Try uploading it again, or reply to this email if it keeps failing."],
    } as Record<string, [string, string]>,
    purchaseSubject: (credits: number) => `Your ${credits} ChapterGen credits are ready`,
    purchasePreheader: 'Thanks for your purchase. Credits never expire.',
    purchaseHeading: 'Thanks for your purchase',
    purchaseBody: (credits: number) =>
      `We added <strong>${credits} credits</strong> to your account. Each credit gives you chapters, a transcript and subtitles for one video.`,
    rows: { pack: 'Pack', credits: 'Credits', paid: 'Paid', date: 'Date', balance: 'Your balance' },
    creditsValue: (n: number) => `+${n} videos`,
    balanceValue: (n: number) => `${n} credits`,
    purchaseCta: 'Upload a video',
    purchaseNote:
      'Credits never expire. To sign in later, go to chaptergen.com/login and we will email you a code.',
    purchaseFooter: 'You received this because you bought credits on chaptergen.com.',
  },
  es: {
    help: 'Ayuda',
    fallback: '¿El botón no funciona? Copia este enlace:',
    codeSubject: (code: string) => `${code} es tu código de ChapterGen`,
    codePreheader: 'Ingrésalo para confirmar tu email. Vence en 10 minutos.',
    codeHeading: 'Tu código de verificación',
    codeIntro: 'Tu código de verificación de ChapterGen es:',
    codeBody: 'Ingresa este código en ChapterGen para confirmar tu email. Vence en 10 minutos.',
    codeIgnore: 'Si no intentaste entrar a ChapterGen, puedes ignorar este correo. Nadie puede entrar sin este código.',
    codeFooter: 'Recibiste este correo porque alguien ingresó esta dirección en chaptergen.com.',
    readySubject: (name: string) => `Los capítulos de ${name} están listos`,
    readyPreheader: 'Capítulos, transcripción y subtítulos listos para copiar.',
    readyHeading: 'Tu video está listo',
    readyBody: (name: string, duration: string | null) =>
      `<strong>${name}</strong>${duration ? ` (${duration})` : ''} terminó de procesarse. Todo está listo para copiar y descargar.`,
    chaptersTag: (n: number) => `${n} capítulos`,
    wordsTag: (n: string) => `Transcripción · ${n} palabras`,
    subtitlesTag: 'Subtítulos SRT · VTT',
    previewTitle: 'Vista previa de capítulos',
    more: (n: number) => `+ ${n} más`,
    readyCta: 'Ver resultados',
    readyFooter: 'Recibiste este correo porque subiste un video a ChapterGen y saliste de la página antes de que terminara.',
    failedSubject: (name: string) => `No pudimos procesar ${name}`,
    failedPreheader: 'Te contamos qué pasó.',
    failedPreheaderRefund: 'Tu crédito volvió a tu cuenta. Te contamos qué pasó.',
    failedHeading: 'No pudimos procesar tu video',
    failedBody: (name: string) => `Algo salió mal con <strong>${name}</strong>.`,
    refunded: '✓ Tu crédito volvió a tu cuenta. Puedes intentarlo de nuevo sin costo.',
    failedCta: 'Subir de nuevo',
    failedHelp: '¿Necesitas ayuda? Responde este correo.',
    failedFooter: 'Recibiste este correo porque subiste un video a ChapterGen.',
    reasons: {
      no_speech: ['No detectamos voz', 'No escuchamos a nadie hablando en este archivo. Revisa que tenga pista de voz e intenta de nuevo.'],
      no_audio: ['El archivo no tiene audio', 'El archivo solo tiene imagen. Las descargas de YouTube suelen venir separadas en video y audio; usa un archivo que incluya sonido.'],
      audio_too_large: ['El archivo es demasiado largo', 'El audio es demasiado pesado para transcribirlo. Prueba dividirlo en partes más cortas.'],
      duration_over_free_limit: ['Dura más de 20 minutos', 'Los videos gratis pueden durar hasta 20 minutos. Compra créditos para procesar videos de cualquier duración.'],
      insufficient_credits: ['No tienes créditos suficientes', 'Este video necesita un crédito y tu saldo está vacío.'],
      generic: ['Error al procesar', 'No pudimos terminar de procesar este archivo. Prueba subirlo de nuevo, o responde este correo si sigue fallando.'],
    } as Record<string, [string, string]>,
    purchaseSubject: (credits: number) => `Tus ${credits} créditos de ChapterGen están listos`,
    purchasePreheader: 'Gracias por tu compra. Los créditos no vencen.',
    purchaseHeading: 'Gracias por tu compra',
    purchaseBody: (credits: number) =>
      `Sumamos <strong>${credits} créditos</strong> a tu cuenta. Cada crédito te da capítulos, transcripción y subtítulos de un video.`,
    rows: { pack: 'Paquete', credits: 'Créditos', paid: 'Pagado', date: 'Fecha', balance: 'Tu saldo' },
    creditsValue: (n: number) => `+${n} videos`,
    balanceValue: (n: number) => `${n} créditos`,
    purchaseCta: 'Subir un video',
    purchaseNote:
      'Los créditos no vencen. Para entrar más adelante, ve a chaptergen.com/login y te enviamos un código.',
    purchaseFooter: 'Recibiste este correo porque compraste créditos en chaptergen.com.',
  },
} as const

async function send(input: {
  to: string
  subject: string
  html: string
  /** Plain-text alternative; mail apps look for one-time codes in it. */
  text?: string
  replyTo?: string
}): Promise<void> {
  const resend = getResend()
  if (!resend) {
    throw new Error('Email is not configured')
  }
  const { error } = await resend.emails.send({
    from: fromAddress(),
    to: input.to,
    subject: input.subject,
    html: input.html,
    text: input.text,
    replyTo: input.replyTo,
  })
  if (error) {
    throw new Error(error.message)
  }
}

function formatDuration(seconds: number | null): string | null {
  return seconds != null && seconds > 0 ? youtubeTimestamp(seconds) : null
}

// ---------------------------------------------------------------------------
// Emails

export async function sendVerificationCodeEmail(input: {
  email: string
  locale: AppLocale
  code: string
}): Promise<void> {
  const t = copy[input.locale]
  // One selectable block, so the code copies and pastes in one go.
  const body = `${h1(t.codeHeading)}${p(t.codeBody)}
<div style="margin:0 0 20px;"><span style="display:inline-block;padding:16px 22px;border:1px solid ${C.line};border-radius:12px;background:${C.soft};font-family:${MONO};font-size:34px;font-weight:700;letter-spacing:0.32em;color:${C.ink};">${input.code}</span></div>
${note(t.codeIgnore)}`
  // The code alone on its line, right after the sentence naming it.
  const text = [t.codeIntro, '', input.code, '', t.codeBody, '', t.codeIgnore].join('\n')
  await send({
    to: input.email,
    subject: t.codeSubject(input.code),
    html: layout({ preheader: t.codePreheader, body, footer: t.codeFooter, locale: input.locale }),
    text,
  })
}

export async function sendJobReadyEmail(input: {
  email: string
  locale: AppLocale
  userId: string
  jobId: string
  fileName: string
  ok: boolean
  durationSeconds: number | null
  chapters: Chapter[] | null
  wordCount: number
  failureReason: string | null
  refunded: boolean
}): Promise<void> {
  const t = copy[input.locale]
  // The link signs the user in, so it works from any device.
  const token = await signMagicToken(input.userId, input.email, '7d')
  const next = input.ok ? `/videos/${input.jobId}` : '/new'
  const href = `${publicSiteUrl()}/login?token=${encodeURIComponent(token)}&next=${encodeURIComponent(next)}`
  const name = escapeHtml(input.fileName)

  if (input.ok) {
    const chapters = input.chapters ?? []
    const tag = (text: string) =>
      `<span style="display:inline-block;margin:0 6px 6px 0;padding:4px 10px;border-radius:999px;background:${C.accentSoft};color:${C.accent};font-size:12px;font-weight:600;">✓ ${text}</span>`
    const rows = chapters
      .slice(0, 4)
      .map(
        (c) => `<tr><td style="padding:8px 0;border-top:1px solid ${C.line};width:64px;font-family:${MONO};font-size:13px;font-weight:700;color:${C.accent};">${youtubeTimestamp(timeToSeconds(c.time))}</td><td style="padding:8px 0;border-top:1px solid ${C.line};font-size:14px;color:${C.ink};">${escapeHtml(c.title)}</td></tr>`
      )
      .join('')
    const preview = chapters.length
      ? `<div style="margin:0 0 20px;padding:14px 18px;border:1px solid ${C.line};border-radius:12px;">
<div style="margin-bottom:4px;font-size:12px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:${C.muted};">${t.previewTitle}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>
${chapters.length > 4 ? `<div style="padding-top:8px;font-size:13px;color:${C.muted};">${t.more(chapters.length - 4)}</div>` : ''}
</div>`
      : ''
    const body = `${h1(t.readyHeading)}${p(t.readyBody(name, formatDuration(input.durationSeconds)))}
<div style="margin:0 0 14px;">${chapters.length ? tag(t.chaptersTag(chapters.length)) : ''}${tag(t.wordsTag(input.wordCount.toLocaleString(input.locale)))}${tag(t.subtitlesTag)}</div>
${preview}${button(href, t.readyCta)}${fallback(href, t.fallback)}`
    await send({
      to: input.email,
      subject: t.readySubject(input.fileName),
      html: layout({ preheader: t.readyPreheader, body, footer: t.readyFooter, locale: input.locale }),
    })
    return
  }

  const [reasonTitle, reasonBody] = t.reasons[input.failureReason ?? ''] ?? t.reasons.generic
  const body = `${h1(t.failedHeading)}${p(t.failedBody(name))}
<div style="margin:0 0 16px;padding:16px 18px;border-radius:12px;background:${C.redSoft};border:1px solid ${C.redLine};">
<div style="font-size:14px;font-weight:700;color:${C.red};">${reasonTitle}</div>
<div style="margin-top:4px;font-size:14px;line-height:1.55;color:${C.text};">${reasonBody}</div>
</div>
${input.refunded ? `<div style="margin:0 0 18px;padding:12px 16px;border-radius:10px;background:${C.greenSoft};color:${C.green};font-size:14px;font-weight:600;">${t.refunded}</div>` : ''}
${button(href, t.failedCta)}${p(t.failedHelp, C.muted)}`
  await send({
    to: input.email,
    subject: t.failedSubject(input.fileName),
    html: layout({
      preheader: input.refunded ? t.failedPreheaderRefund : t.failedPreheader,
      body,
      footer: t.failedFooter,
      locale: input.locale,
    }),
    replyTo: supportAddress() ?? undefined,
  })
}

export async function sendPurchaseEmail(input: {
  email: string
  locale: AppLocale
  packName: string
  creditsGranted: number
  amountCents: number
  creditsBalance: number
  paidAt: Date
}): Promise<void> {
  const t = copy[input.locale]
  const value = (input.amountCents / 100).toFixed(2)
  const amount = `$${input.locale === 'es' ? value.replace('.', ',') : value}`
  const date = input.paidAt.toLocaleDateString(input.locale === 'es' ? 'es' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
  const row = (label: string, value: string, strong = false) =>
    `<tr><td style="padding:10px 0;border-top:1px solid ${C.line};font-size:14px;color:${C.muted};">${label}</td><td align="right" style="padding:10px 0;border-top:1px solid ${C.line};font-size:14px;font-weight:${strong ? 700 : 500};color:${C.ink};">${value}</td></tr>`
  const body = `${h1(t.purchaseHeading)}${p(t.purchaseBody(input.creditsGranted))}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;">
${row(t.rows.pack, escapeHtml(input.packName))}${row(t.rows.credits, t.creditsValue(input.creditsGranted))}${row(t.rows.paid, `${amount} USD`)}${row(t.rows.date, date)}${row(t.rows.balance, t.balanceValue(input.creditsBalance), true)}
</table>
${button(`${publicSiteUrl()}/new`, t.purchaseCta)}${note(t.purchaseNote)}`
  try {
    await send({
      to: input.email,
      subject: t.purchaseSubject(input.creditsGranted),
      html: layout({ preheader: t.purchasePreheader, body, footer: t.purchaseFooter, locale: input.locale }),
    })
  } catch (err) {
    console.error('Resend error:', err)
  }
}

export async function sendSupportEmail(input: {
  fromEmail: string
  userId: string
  subject: string
  message: string
  credits: number
  videos: number
  locale: AppLocale
  memberSince: string
  page: string | null
  /** The video the message is about, when the user picked one. */
  job?: { id: string; fileName: string; status: string; failureReason: string | null } | null
}): Promise<void> {
  const to = supportAddress()
  const adminUrl = (process.env.ADMIN_URL ?? 'https://admin.chaptergen.com').replace(/\/+$/, '')
  const job = input.job
  const jobRow = job
    ? `<a href="${adminUrl}/jobs/${encodeURIComponent(job.id)}" style="color:${C.accent};">${escapeHtml(job.fileName)}</a> · ${escapeHtml(job.status)}${job.failureReason ? ` (${escapeHtml(job.failureReason)})` : ''}`
    : null
  if (!to) {
    throw new Error('Support email is not configured')
  }
  const subject = input.subject.trim().slice(0, 200)
  const message = escapeHtml(input.message.trim()).replace(/\n/g, '<br>')
  const row = (label: string, value: string) =>
    `<tr><td style="padding:8px 0;border-top:1px solid ${C.line};width:120px;font-size:13px;color:${C.muted};">${label}</td><td style="padding:8px 0;border-top:1px solid ${C.line};font-size:13px;color:${C.ink};">${value}</td></tr>`
  const body = `<div style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:${C.accent};">Support request</div>
${h1(escapeHtml(subject))}
<div style="margin:0 0 20px;padding:16px 18px;border-radius:12px;background:${C.soft};font-size:14px;line-height:1.6;color:#2c2f35;">${message}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 16px;">
${row('From', escapeHtml(input.fromEmail))}
${row('Account', `${input.credits} credits · ${input.videos} videos · since ${escapeHtml(input.memberSince)}`)}
${row('Language', input.locale === 'es' ? 'Spanish' : 'English')}
${jobRow ? row('Video', jobRow) : ''}
${input.page ? row('Sent from', escapeHtml(input.page)) : ''}
${row('User ID', escapeHtml(input.userId))}
</table>
${p('Reply to this email to answer the user directly.', C.muted)}`
  await send({
    to,
    subject: `[Support] ${subject}`,
    html: layout({ preheader: `From ${input.fromEmail}`, body, footer: 'Internal notification sent to the support inbox.', locale: 'en' }),
    replyTo: input.fromEmail,
  })
}
