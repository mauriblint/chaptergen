import type { Request } from 'express'

export interface RequestMeta {
  clientIp: string | null
  country: string | null
  userAgent: string | null
  acceptLanguage: string | null
  referer: string | null
  clientId: string | null
}

function headerValue(req: Request, name: string): string | null {
  const value = req.headers[name]
  if (typeof value === 'string' && value.trim()) return value.trim()
  if (Array.isArray(value) && value[0]?.trim()) return value[0].trim()
  return null
}

export function getClientIp(req: Request): string | null {
  const forwarded = headerValue(req, 'x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]?.trim() ?? null

  return headerValue(req, 'x-real-ip') ?? req.socket.remoteAddress ?? null
}

export function getCountry(req: Request): string | null {
  return (
    headerValue(req, 'cf-ipcountry') ??
    headerValue(req, 'x-vercel-ip-country') ??
    headerValue(req, 'x-country-code') ??
    null
  )
}

export function extractRequestMeta(req: Request): RequestMeta {
  return {
    clientIp: getClientIp(req),
    country: getCountry(req),
    userAgent: headerValue(req, 'user-agent'),
    acceptLanguage: headerValue(req, 'accept-language'),
    referer: headerValue(req, 'referer'),
    clientId: headerValue(req, 'x-client-id'),
  }
}
