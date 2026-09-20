import type { UserRecord } from '../db/users.js'

declare global {
  namespace Express {
    interface Request {
      user?: UserRecord | null
    }
  }
}

export {}
