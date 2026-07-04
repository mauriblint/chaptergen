import OpenAI from 'openai'
import {
  type Chapter,
  type TranscriptSegment,
  formatSecondsToTimestamp,
} from '../types.js'

function getOpenAI(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY no está configurada')
  }
  return new OpenAI({ apiKey })
}

function buildSegmentList(segments: TranscriptSegment[]): string {
  return segments
    .map(
      (seg) =>
        `[${formatSecondsToTimestamp(seg.start)} - ${formatSecondsToTimestamp(seg.end)}] ${seg.text}`
    )
    .join('\n')
}

function chapterCountInstruction(chapterCount: number | null): string {
  if (chapterCount == null) {
    return `Generá la cantidad de capítulos que tenga sentido según los cambios de tema del video.
Típicamente entre 5 y 15 capítulos, según la duración y densidad del contenido.
No fuerces capítulos innecesarios ni agrupes temas distintos.`
  }

  const minChapters = Math.max(3, chapterCount - 3)
  const maxChapters = chapterCount + 3
  return `Generá entre ${minChapters} y ${maxChapters} capítulos.`
}

export async function generateChapters(
  segments: TranscriptSegment[],
  chapterCount: number | null
): Promise<Chapter[]> {
  if (segments.length === 0) {
    return [{ time: '00:00:00', title: 'Inicio' }]
  }

  const openai = getOpenAI()

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: `Sos un asistente que genera capítulos para videos de YouTube.
Analizá la transcripción con timestamps y agrupá los segmentos en capítulos lógicos.
${chapterCountInstruction(chapterCount)}
Usá timestamps reales de los segmentos (el inicio del primer segmento de cada capítulo).
Los títulos deben ser descriptivos y en español.
Respondé SOLO con JSON válido en este formato:
{"chapters": [{"time": "00:01:29", "title": "Título del capítulo"}]}
El campo "time" debe estar en formato HH:MM:SS.`,
      },
      {
        role: 'user',
        content: `Transcripción con timestamps:\n\n${buildSegmentList(segments)}`,
      },
    ],
    temperature: 0.3,
  })

  const content = response.choices[0]?.message?.content
  if (!content) {
    throw new Error('No response from GPT')
  }

  const parsed = JSON.parse(content) as { chapters: Chapter[] }
  const chapters = parsed.chapters ?? []

  if (chapters.length === 0) {
    return [
      {
        time: formatSecondsToTimestamp(segments[0].start),
        title: segments[0].text.slice(0, 80),
      },
    ]
  }

  return chapters.map((ch) => ({
    time: ch.time,
    title: ch.title.trim(),
  }))
}
