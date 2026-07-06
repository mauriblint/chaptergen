import type { NextFunction, Request, Response } from 'express'
import { verifyAdminToken } from '../utils/adminToken.js'

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  const token = header.slice(7)
  if (!verifyAdminToken(token)) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  next()
}
