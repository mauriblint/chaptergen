import type { NextFunction, Request, Response } from 'express'
import { getUserById, touchLastLogin, type UserRecord } from '../db/users.js'
import { readCookie, SESSION_COOKIE, setSessionCookie } from './cookies.js'
import { signSessionToken, verifyToken } from './jwt.js'

export async function attachUser(req: Request, _res: Response, next: NextFunction): Promise<void> {
  req.user = null
  const token = readCookie(req, SESSION_COOKIE)
  if (!token) {
    next()
    return
  }
  const payload = await verifyToken(token, 'session')
  if (!payload) {
    next()
    return
  }
  req.user = getUserById(payload.userId)
  next()
}

export async function establishSession(res: Response, user: UserRecord): Promise<void> {
  const token = await signSessionToken(user.id)
  setSessionCookie(res, token)
  touchLastLogin(user.id)
}

export function requireUser(req: Request, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }
  next()
}
