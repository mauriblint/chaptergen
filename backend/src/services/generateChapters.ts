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
  language?: string | null
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
    return `Generate as many chapters as make sense given topic changes in the video.
Typically 5 to 15 chapters, depending on duration and content density.
Do not force unnecessary chapters or group distinct topics together.`
  }

  const minChapters = Math.max(3, chapterCount - 3)
  const maxChapters = chapterCount + 3
  return `Generate between ${minChapters} and ${maxChapters} chapters.`
}

function sanitizeLanguage(language?: string | null): string | null {
  const trimmed = language?.trim()
  if (!trimmed || trimmed.length > 64) return null
  return trimmed
}

function languageInstruction(language?: string | null): string {
  const detected = sanitizeLanguage(language)
  if (detected) {
    return `The transcript language is ${detected}. Write every chapter title in ${detected}. Do not translate into another language.`
  }
  return 'Write every chapter title in the same language as the transcript. Do not translate.'
}

function fallbackStartTitle(language?: string | null): string {
  const lang = (sanitizeLanguage(language) ?? '').toLowerCase()
  if (lang.startsWith('es') || lang.includes('spanish')) return 'Inicio'
  if (lang.startsWith('pt') || lang.includes('portuguese')) return 'Início'
  if (lang.startsWith('fr') || lang.includes('french')) return 'Début'
  if (lang.startsWith('de') || lang.includes('german')) return 'Beginn'
  if (lang.startsWith('it') || lang.includes('italian')) return 'Inizio'
  return 'Start'
}

function buildRefineInstructions(
  opts: RefineOptions,
  existing?: Chapter[]
): string {
  const parts: string[] = []

  if (opts.mode === 'titles' && existing?.length) {
    parts.push(`Keep these timestamps EXACTLY. Only rewrite the titles:
${existing.map((c) => `[${c.time}] ${c.title}`).join('\n')}`)
  } else if (opts.mode === 'segments') {
    parts.push(
      'Reorganize the chapter cuts. Titles may be adjusted, but the focus is where to cut.'
    )
  } else if (opts.mode === 'both') {
    parts.push('You may adjust both cuts and titles according to the instructions below.')
  }

  if (opts.mode !== 'titles') {
    const granularityMap: Record<RefineOptions['granularity'], string> = {
      detailed:
        'Create more chapters, with finer cuts at each topic change.',
      balanced:
        'Balance chapter count and length according to the content.',
      grouped:
        'Group into fewer, longer chapters; only cut at major topic changes.',
    }
    parts.push(granularityMap[opts.granularity])
  }

  const contentMap: Record<RefineOptions['contentType'], string> = {
    auto: '',
    tutorial:
      'This is a tutorial: one chapter per step or practical section.',
    podcast:
      'This is a podcast/interview: one chapter per question, guest, or conversation topic.',
    webinar:
      'This is a webinar/course: one chapter per module, block, or lesson topic.',
    review:
      'This is a review/vlog: one chapter per product, section, or highlight.',
  }
  if (opts.contentType !== 'auto') {
    parts.push(contentMap[opts.contentType])
  }

  const styleMap: Record<RefineOptions['titleStyle'], string> = {
    descriptive: 'Clear, descriptive titles.',
    short: 'Short titles, 40 characters max, straight to the point.',
    seo: 'Search-optimized titles using relevant keywords from the content.',
    question: 'Titles phrased as questions that invite a click.',
  }
  parts.push(styleMap[opts.titleStyle])

  if (opts.instructions?.trim()) {
    parts.push(`Additional user instructions: ${opts.instructions.trim()}`)
  }

  return parts.filter(Boolean).join('\n')
}

export async function generateChapters(
  segments: TranscriptSegment[],
  options: ChapterGenerationOptions = { chapterCount: null }
): Promise<Chapter[]> {
  if (segments.length === 0) {
    return [{ time: '00:00:00', title: fallbackStartTitle(options.language) }]
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
        content: `You are an assistant that generates YouTube video chapters.
Analyze the timestamped transcript and group segments into logical chapters.
${chapterCountInstruction(options.chapterCount)}
${languageInstruction(options.language)}
${refineBlock ? `${refineBlock}\n` : ''}Use real timestamps from the segments (the start of the first segment in each chapter).
Titles must be descriptive.
Respond ONLY with valid JSON in this format:
{"chapters": [{"time": "00:01:29", "title": "Chapter title"}]}
The "time" field must be HH:MM:SS.`,
      },
      {
        role: 'user',
        content: `Timestamped transcript:\n\n${buildSegmentList(segments)}`,
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
