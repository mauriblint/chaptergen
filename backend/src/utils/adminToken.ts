import crypto from 'crypto'

const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000

function getSecret(): string | null {
  return process.env.ADMIN_SESSION_SECRET ?? null
}

export function signAdminToken(): string | null {
  const secret = getSecret()
  if (!secret) return null

  const exp = Date.now() + TOKEN_TTL_MS
  const payload = Buffer.from(JSON.stringify({ exp })).toString('base64url')
  const sig = crypto.createHmac('sha256', secret).update(payload).digest('base64url')
  return `${payload}.${sig}`
}

export function verifyAdminToken(token: string): boolean {
  const secret = getSecret()
  if (!secret) return false

  const parts = token.split('.')
  if (parts.length !== 2) return false

  const [payload, sig] = parts
  const expected = crypto.createHmac('sha256', secret).update(payload).digest('base64url')
  const sigBuf = Buffer.from(sig)
  const expectedBuf = Buffer.from(expected)
  if (sigBuf.length !== expectedBuf.length) return false
  if (!crypto.timingSafeEqual(sigBuf, expectedBuf)) return false

  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString()) as { exp?: number }
    return typeof data.exp === 'number' && data.exp > Date.now()
  } catch {
    return false
  }
}
