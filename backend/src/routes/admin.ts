import { Router, type Request, type Response } from 'express'
import {
  countJobsByUserId,
  getJobSummary,
  listJobs,
  listJobsByUserId,
  type JobStatus,
} from '../db/jobs.js'
import {
  countPaymentsByUserId,
  listAdminPaymentsByUserId,
  listPayments,
} from '../db/payments.js'
import { getUserById, listUsers } from '../db/users.js'
import { requireAdmin } from '../middleware/adminAuth.js'
import { signAdminToken } from '../utils/adminToken.js'

export const adminRouter = Router()

const VALID_STATUSES = new Set<JobStatus>([
  'pending',
  'extracting',
  'transcribing',
  'generating',
  'regenerating',
  'completed',
  'failed',
])

function parsePage(req: Request): { limit: number; offset: number } {
  const limit = Math.min(Math.max(Number(req.query.limit) || 50, 1), 100)
  const offset = Math.max(Number(req.query.offset) || 0, 0)
  return { limit, offset }
}

adminRouter.post('/admin/login', (req: Request, res: Response) => {
  const password = process.env.ADMIN_PASSWORD
  if (!password || !process.env.ADMIN_SESSION_SECRET) {
    res.status(503).json({ error: 'Admin is not configured' })
    return
  }

  const { password: submitted } = req.body as { password?: string }
  if (!submitted || submitted !== password) {
    res.status(401).json({ error: 'Wrong password' })
    return
  }

  const token = signAdminToken()
  if (!token) {
    res.status(503).json({ error: 'Admin is not configured' })
    return
  }

  res.json({ token })
})

adminRouter.get('/admin/jobs', requireAdmin, (req: Request, res: Response) => {
  const { limit, offset } = parsePage(req)
  const statusRaw = req.query.status as string | undefined
  const status =
    statusRaw && VALID_STATUSES.has(statusRaw as JobStatus)
      ? (statusRaw as JobStatus)
      : undefined

  res.json(listJobs({ limit, offset, status }))
})

adminRouter.get('/admin/jobs/:id', requireAdmin, (req: Request, res: Response) => {
  const id = req.params.id as string
  const job = getJobSummary(id)
  if (!job) {
    res.status(404).json({ error: 'Job not found' })
    return
  }
  res.json(job)
})

adminRouter.get('/admin/users', requireAdmin, (req: Request, res: Response) => {
  res.json(listUsers(parsePage(req)))
})

adminRouter.get('/admin/users/:id', requireAdmin, (req: Request, res: Response) => {
  const id = req.params.id as string
  const user = getUserById(id)
  if (!user) {
    res.status(404).json({ error: 'User not found' })
    return
  }

  res.json({
    user: {
      ...user,
      jobCount: countJobsByUserId(user.id),
      paymentCount: countPaymentsByUserId(user.id),
    },
    jobs: listJobsByUserId(user.id, 100),
    payments: listAdminPaymentsByUserId(user.id),
  })
})

adminRouter.get('/admin/payments', requireAdmin, (req: Request, res: Response) => {
  res.json(listPayments(parsePage(req)))
})
