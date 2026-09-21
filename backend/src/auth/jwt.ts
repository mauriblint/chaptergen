import { SignJWT, jwtVerify } from 'jose'

type TokenType = 'session' | 'magic'

function getSecretKey(): Uint8Array {
  const secret =
    process.env.AUTH_SECRET ??
    (process.env.NODE_ENV === 'production' ? '' : 'dev-auth-secret-change-me')
  if (!secret) {
    throw new Error('AUTH_SECRET is not configured')
  }
  return new TextEncoder().encode(secret)
}

async function signToken(input: {
  userId: string
  email?: string
  typ: TokenType
  expiresIn: string
}): Promise<string> {
  const jwt = new SignJWT({ typ: input.typ, email: input.email })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(input.userId)
    .setIssuedAt()
    .setExpirationTime(input.expiresIn)
  return jwt.sign(getSecretKey())
}

export function signSessionToken(userId: string): Promise<string> {
  return signToken({ userId, typ: 'session', expiresIn: '30d' })
}

export function signMagicToken(userId: string, email: string): Promise<string> {
  return signToken({ userId, email, typ: 'magic', expiresIn: '20m' })
}

export async function verifyToken(
  token: string,
  typ: TokenType
): Promise<{ userId: string; email?: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), { algorithms: ['HS256'] })
    if (payload.typ !== typ || typeof payload.sub !== 'string') return null
    const email = typeof payload.email === 'string' ? payload.email : undefined
    return { userId: payload.sub, email }
  } catch {
    return null
  }
}
