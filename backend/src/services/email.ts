import { Resend } from 'resend'
import { publicSiteUrl } from '../billing/packs.js'
import type { AppLocale } from '../types/locale.js'

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
      `We added ${credits} credits to your account. You now have ${remaining} credits to generate chapters.`,
    dashboardCta: 'Open dashboard',
    loginHint: 'Next time, go to chaptergen.com/login and we will email you a sign-in link. No password needed.',
    magicSubject: 'Sign in to ChapterGen',
    magicHeading: 'Sign in to ChapterGen',
    magicBody: 'Click the button below to access your dashboard. This link expires in 20 minutes.',
    magicCta: 'Sign in',
    ignore: 'If you did not request this, you can ignore this email.',
  },
  es: {
    purchaseSubject: (credits: number) => `Tus ${credits} créditos de ChapterGen están listos`,
    purchaseHeading: 'Gracias por tu compra',
    purchaseBody: (credits: number, remaining: number) =>
      `Sumamos ${credits} créditos a tu cuenta. Ahora tenés ${remaining} créditos para generar capítulos.`,
    dashboardCta: 'Abrir dashboard',
    loginHint:
      'La próxima vez entrá a chaptergen.com/login y te mandamos un enlace de acceso. No hace falta contraseña.',
    magicSubject: 'Entrar a ChapterGen',
    magicHeading: 'Entrar a ChapterGen',
    magicBody: 'Hacé clic en el botón para abrir tu dashboard. Este enlace vence en 20 minutos.',
    magicCta: 'Entrar',
    ignore: 'Si no pediste esto, podés ignorar este correo.',
  },
} as const

function layout(title: string, body: string): string {
  return `<!doctype html>
<html><body style="font-family:Inter,system-ui,sans-serif;color:#0f172a;line-height:1.5;padding:24px">
  <h1 style="font-size:20px;margin:0 0 12px">${title}</h1>
  ${body}
  <p style="color:#64748b;font-size:12px;margin-top:32px">ChapterGen</p>
</body></html>`
}

function button(href: string, label: string): string {
  return `<p style="margin:24px 0"><a href="${href}" style="background:#6366f1;color:#fff;text-decoration:none;padding:10px 16px;border-radius:8px;display:inline-block">${label}</a></p>`
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
  const dashboard = `${publicSiteUrl()}/dashboard`
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
