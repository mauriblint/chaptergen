import OpenAI from 'openai'
import {
  type Chapter,
  type TranscriptSegment,
  formatSecondsToTimestamp,
} from '../types.js'
import type { RefineOptions } from '../types/refine.js'

export interface ChapterGenerationOptions {
  chapterCount: number | null
  refine?: RefineOptions
  existingChapters?: Chapter[]
}

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

function buildRefineInstructions(
  opts: RefineOptions,
  existing?: Chapter[]
): string {
  const parts: string[] = []

  if (opts.mode === 'titles' && existing?.length) {
    parts.push(`Mantené EXACTAMENTE estos timestamps, solo reescribí los títulos:
${existing.map((c) => `[${c.time}] ${c.title}`).join('\n')}`)
  } else if (opts.mode === 'segments') {
    parts.push(
      'Reorganizá los cortes/capítulos. Los títulos pueden ajustarse pero el foco está en dónde cortar.'
    )
  } else if (opts.mode === 'both') {
    parts.push('Podés ajustar tanto los cortes como los títulos según las instrucciones siguientes.')
  }

  if (opts.mode !== 'titles') {
    const granularityMap: Record<RefineOptions['granularity'], string> = {
      detailed:
        'Creá más capítulos, con cortes más finos en cada cambio de tema.',
      balanced:
        'Equilibrá cantidad y longitud de capítulos según el contenido.',
      grouped:
        'Agrupá en menos capítulos más largos; solo cortá en cambios de tema importantes.',
    }
    parts.push(granularityMap[opts.granularity])
  }

  const contentMap: Record<RefineOptions['contentType'], string> = {
    auto: '',
    tutorial:
      'Es un tutorial: un capítulo por paso o sección práctica.',
    podcast:
      'Es un podcast/entrevista: un capítulo por pregunta, invitado o tema de conversación.',
    webinar:
      'Es un webinar/curso: un capítulo por módulo, bloque o tema de la clase.',
    review:
      'Es un review/vlog: un capítulo por producto, sección o momento destacado.',
  }
  if (opts.contentType !== 'auto') {
    parts.push(contentMap[opts.contentType])
  }

  const styleMap: Record<RefineOptions['titleStyle'], string> = {
    descriptive: 'Títulos descriptivos y claros en español.',
    short: 'Títulos cortos, máximo 40 caracteres, directos al punto.',
    seo: 'Títulos optimizados para búsqueda, con palabras clave relevantes del contenido.',
    question: 'Títulos en forma de pregunta que invite a hacer clic.',
  }
  parts.push(styleMap[opts.titleStyle])

  if (opts.instructions?.trim()) {
    parts.push(`Instrucciones adicionales del usuario: ${opts.instructions.trim()}`)
  }

  return parts.filter(Boolean).join('\n')
}

export async function generateChapters(
  segments: TranscriptSegment[],
  options: ChapterGenerationOptions = { chapterCount: null }
): Promise<Chapter[]> {
  if (segments.length === 0) {
    return [{ time: '00:00:00', title: 'Inicio' }]
  }

  const openai = getOpenAI()
  const refineBlock = options.refine
    ? buildRefineInstructions(options.refine, options.existingChapters)
    : ''
  const temperature = options.refine?.mode === 'titles' ? 0.5 : 0.3

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: `Sos un asistente que genera capítulos para videos de YouTube.
Analizá la transcripción con timestamps y agrupá los segmentos en capítulos lógicos.
${chapterCountInstruction(options.chapterCount)}
${refineBlock ? `${refineBlock}\n` : ''}Usá timestamps reales de los segmentos (el inicio del primer segmento de cada capítulo).
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
    temperature,
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
