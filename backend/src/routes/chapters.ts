import { Router, type Request, type Response } from 'express'

export const chaptersRouter = Router()

chaptersRouter.post('/chapters', (_req: Request, res: Response) => {
  res.status(410).json({
    error: 'This endpoint has been removed. Use /jobs/:id/refine instead.',
    code: 'GONE',
  })
})
