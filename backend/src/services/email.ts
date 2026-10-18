import { Resend } from 'resend'
import { publicSiteUrl } from '../billing/packs.js'
import type { AppLocale } from '../types/locale.js'
import { signMagicToken } from '../auth/jwt.js'

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

const copy = {
  en: {
    purchaseSubject: (credits: number) => `Your ${credits} ChapterGen credits are ready`,
    purchaseHeading: 'Thanks for your purchase',
    purchaseBody: (credits: number, remaining: number) =>
      `We added ${credits} credits to your account. You now have ${remaining} credits. Each credit gives you chapters, a transcript and subtitles for one video.`,
    dashboardCta: 'Open your library',
    loginHint: 'Next time, go to chaptergen.com/login and we will email you a sign-in code. No password needed.',
    magicSubject: 'Sign in to ChapterGen',
    magicHeading: 'Sign in to ChapterGen',
    magicBody: 'Click the button below to open your library. This link expires in 20 minutes.',
    magicCta: 'Sign in',
    codeSubject: (code: string) => `${code} is your ChapterGen code`,
    codeHeading: 'Your verification code',
    codeBody: 'Enter this code to confirm your email. It expires in 10 minutes.',
    readySubject: (name: string) => `Your chapters for ${name} are ready`,
    readyHeading: 'Your video is ready',
    readyBody: (name: string) =>
      `Chapters, transcript and subtitles for <strong>${name}</strong> are ready to copy and download.`,
    readyCta: 'Open results',
    failedSubject: (name: string) => `We could not process ${name}`,
    failedHeading: 'Something went wrong',
    failedBody: (name: string) =>
      `We could not finish processing <strong>${name}</strong>. If a credit was used, it has been returned to your account.`,
    failedCta: 'See details',
    ignore: 'If you did not request this, you can ignore this email.',
  },
  es: {
    purchaseSubject: (credits: number) => `Tus ${credits} créditos de ChapterGen están listos`,
    purchaseHeading: 'Gracias por tu compra',
    purchaseBody: (credits: number, remaining: number) =>
      `Sumamos ${credits} créditos a tu cuenta. Ahora tienes ${remaining} créditos. Cada crédito te da capítulos, transcripción y subtítulos de un video.`,
    dashboardCta: 'Abrir tu biblioteca',
    loginHint:
      'La próxima vez entra a chaptergen.com/login y te enviamos un código de acceso. No hace falta contraseña.',
    magicSubject: 'Entrar a ChapterGen',
    magicHeading: 'Entrar a ChapterGen',
    magicBody: 'Haz clic en el botón para abrir tu biblioteca. Este enlace vence en 20 minutos.',
    magicCta: 'Entrar',
    codeSubject: (code: string) => `${code} es tu código de ChapterGen`,
    codeHeading: 'Tu código de verificación',
    codeBody: 'Ingresa este código para confirmar tu email. Vence en 10 minutos.',
    readySubject: (name: string) => `Los capítulos de ${name} están listos`,
    readyHeading: 'Tu video está listo',
    readyBody: (name: string) =>
      `Los capítulos, la transcripción y los subtítulos de <strong>${name}</strong> están listos para copiar y descargar.`,
    readyCta: 'Ver resultados',
    failedSubject: (name: string) => `No pudimos procesar ${name}`,
    failedHeading: 'Algo salió mal',
    failedBody: (name: string) =>
      `No pudimos terminar de procesar <strong>${name}</strong>. Si se usó un crédito, ya volvió a tu cuenta.`,
    failedCta: 'Ver detalles',
    ignore: 'Si no pediste esto, puedes ignorar este correo.',
  },
} as const

function layout(title: string, body: string): string {
  return `<!doctype html>
<html><body style="margin:0;background:#f6f6f8;font-family:Helvetica,Arial,sans-serif;color:#111318;line-height:1.55">
  <div style="max-width:520px;margin:0 auto;padding:32px 20px">
    <p style="margin:0 0 20px;font-size:18px;font-weight:800;letter-spacing:-0.02em">chapter<span style="color:#4c3ff0">gen</span></p>
    <div style="background:#ffffff;border:1px solid #e7e7eb;border-radius:16px;padding:28px">
      <h1 style="font-size:22px;line-height:1.25;margin:0 0 12px">${title}</h1>
      ${body}
    </div>
    <p style="color:#5e6166;font-size:12px;margin:20px 0 0">ChapterGen · chaptergen.com</p>
  </div>
</body></html>`
}

function button(href: string, label: string): string {
  return `<p style="margin:24px 0 8px"><a href="${href}" style="background:#111318;color:#ffffff;text-decoration:none;font-weight:600;padding:12px 20px;border-radius:10px;display:inline-block">${label}</a></p>`
}

async function send(input: {
  to: string
  subject: string
  html: string
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
    replyTo: input.replyTo,
  })
  if (error) {
    throw new Error(error.message)
  }
}

export async function sendPurchaseEmail(input: {
  email: string
  locale: AppLocale
  creditsGranted: number
  creditsRemaining: number
}): Promise<void> {
  const t = copy[input.locale]
  const dashboard = `${publicSiteUrl()}/library`
  const html = layout(
    t.purchaseHeading,
    `<p>${t.purchaseBody(input.creditsGranted, input.creditsRemaining)}</p>
     ${button(dashboard, t.dashboardCta)}
     <p>${t.loginHint}</p>`
  )
  try {
    await send({
      to: input.email,
      subject: t.purchaseSubject(input.creditsGranted),
      html,
    })
  } catch (err) {
    console.error('Resend error:', err)
  }
}

export async function sendMagicLinkEmail(input: {
  email: string
  locale: AppLocale
  token: string
}): Promise<void> {
  const t = copy[input.locale]
  const href = `${publicSiteUrl()}/login?token=${encodeURIComponent(input.token)}`
  const html = layout(
    t.magicHeading,
    `<p>${t.magicBody}</p>${button(href, t.magicCta)}<p style="color:#64748b;font-size:13px">${t.ignore}</p>`
  )
  try {
    await send({ to: input.email, subject: t.magicSubject, html })
  } catch (err) {
    console.error('Resend error:', err)
  }
}

export async function sendSupportEmail(input: {
  fromEmail: string
  userId: string
  subject: string
  message: string
}): Promise<void> {
  const to = supportAddress()
  if (!to) {
    throw new Error('Support email is not configured')
  }
  const subject = input.subject.trim().slice(0, 200)
  const body = escapeHtml(input.message.trim()).replace(/\n/g, '<br>')
  const html = layout(
    'Support request',
    `<p><strong>From:</strong> ${escapeHtml(input.fromEmail)}</p>
     <p><strong>User ID:</strong> ${escapeHtml(input.userId)}</p>
     <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
     <p>${body}</p>`
  )
  await send({
    to,
    subject: `[ChapterGen] ${subject}`,
    html,
    replyTo: input.fromEmail,
  })
}

export async function sendVerificationCodeEmail(input: {
  email: string
  locale: AppLocale
  code: string
}): Promise<void> {
  const t = copy[input.locale]
  const html = layout(
    t.codeHeading,
    `<p>${t.codeBody}</p>
     <p style="margin:24px 0;font-family:Menlo,Consolas,monospace;font-size:34px;font-weight:700;letter-spacing:0.3em">${input.code}</p>
     <p style="color:#5e6166;font-size:13px">${t.ignore}</p>`
  )
  await send({ to: input.email, subject: t.codeSubject(input.code), html })
}

export async function sendJobReadyEmail(input: {
  email: string
  locale: AppLocale
  userId: string
  jobId: string
  fileName: string
  ok: boolean
}): Promise<void> {
  const t = copy[input.locale]
  // The link signs the user in, so it works from any device.
  const token = await signMagicToken(input.userId, input.email, '7d')
  const next = `/videos/${input.jobId}`
  const href = `${publicSiteUrl()}/login?token=${encodeURIComponent(token)}&next=${encodeURIComponent(next)}`
  const name = escapeHtml(input.fileName)
  const html = input.ok
    ? layout(t.readyHeading, `<p>${t.readyBody(name)}</p>${button(href, t.readyCta)}`)
    : layout(t.failedHeading, `<p>${t.failedBody(name)}</p>${button(href, t.failedCta)}`)
  await send({
    to: input.email,
    subject: input.ok ? t.readySubject(input.fileName) : t.failedSubject(input.fileName),
    html,
  })
}
