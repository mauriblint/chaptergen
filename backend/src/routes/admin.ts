import { Router, type Request, type Response } from 'express'
import { getJobSummary, listJobs, type JobStatus } from '../db/jobs.js'
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

adminRouter.post('/admin/login', (req: Request, res: Response) => {
  const password = process.env.ADMIN_PASSWORD
  if (!password || !process.env.ADMIN_SESSION_SECRET) {
    res.status(503).json({ error: 'Admin no configurado' })
    return
  }

  const { password: submitted } = req.body as { password?: string }
  if (!submitted || submitted !== password) {
    res.status(401).json({ error: 'Contraseña incorrecta' })
    return
  }

  const token = signAdminToken()
  if (!token) {
    res.status(503).json({ error: 'Admin no configurado' })
    return
  }

  res.json({ token })
})

adminRouter.get('/admin/jobs', requireAdmin, (req: Request, res: Response) => {
  const limit = Math.min(Math.max(Number(req.query.limit) || 50, 1), 100)
  const offset = Math.max(Number(req.query.offset) || 0, 0)
  const statusRaw = req.query.status as string | undefined
  const status =
    statusRaw && VALID_STATUSES.has(statusRaw as JobStatus)
      ? (statusRaw as JobStatus)
      : undefined

  const result = listJobs({ limit, offset, status })
  res.json(result)
})

adminRouter.get('/admin/jobs/:id', requireAdmin, (req: Request, res: Response) => {
  const id = req.params.id as string
  const job = getJobSummary(id)
  if (!job) {
    res.status(404).json({ error: 'Job no encontrado' })
    return
  }
  res.json(job)
})
