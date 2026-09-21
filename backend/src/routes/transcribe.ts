import { Router, type Request, type Response } from 'express'

export const transcribeRouter = Router()

transcribeRouter.post('/transcribe', (_req: Request, res: Response) => {
  res.status(410).json({
    error: 'This endpoint has been removed. Use chunked uploads instead.',
    code: 'GONE',
  })
})
