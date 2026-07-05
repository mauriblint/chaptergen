import { Router, type Request, type Response } from 'express'
import { generateChapters } from '../services/generateChapters.js'
import { formatChapters, type TranscriptSegment } from '../types.js'

export const chaptersRouter = Router()

chaptersRouter.post('/chapters', async (req: Request, res: Response) => {
  const { segments, chapterCount, auto } = req.body as {
    segments?: TranscriptSegment[]
    chapterCount?: number
    auto?: boolean
  }

  if (!segments || !Array.isArray(segments) || segments.length === 0) {
    res.status(400).json({ error: 'Se requieren segmentos de transcripción' })
    return
  }

  const useAuto = auto !== false && chapterCount == null

  const count = useAuto
    ? null
    : Math.min(20, Math.max(3, Number(chapterCount) || 10))

  try {
    const chapters = await generateChapters(segments, { chapterCount: count })
    const formatted = formatChapters(chapters)
    res.json({ chapters, formatted })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido'
    res.status(500).json({ error: message })
  }
})
