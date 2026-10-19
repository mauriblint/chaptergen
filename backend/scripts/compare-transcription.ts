// Runs the same audio through each transcription provider and compares
// speed, cost and output, chapters included. Nothing is written to the DB.
//
//   npx tsx scripts/compare-transcription.ts <file> [--start 0] [--duration 1800] [--language es] [--out report.md]
import 'dotenv/config'
import fs from 'fs'
import os from 'os'
import path from 'path'
import { extractAudioSlice, getMediaDurationSeconds, prepareAudioForTranscription } from '../src/services/extractAudio.js'
import { transcribe, type TranscribeProvider } from '../src/services/transcribe.js'
import { generateChapters } from '../src/services/generateChapters.js'
import { costFor } from '../src/services/aiPricing.js'
import type { TranscriptSegment } from '../src/types.js'

const MODELS: Record<TranscribeProvider, string> = { openai: 'whisper-1', groq: 'whisper-large-v3-turbo' }

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`)
  return i > 0 ? process.argv[i + 1] : undefined
}

function words(segments: TranscriptSegment[]): string[] {
  return segments
    .flatMap((s) => s.text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').split(/\s+/))
    .map((w) => w.replace(/[^\p{L}\p{N}']/gu, ''))
    .filter(Boolean)
}

/** Word-level edit distance over the reference length (a WER, with OpenAI as reference). */
function wordDifference(ref: string[], hyp: string[]): number {
  if (!ref.length) return hyp.length ? 1 : 0
  let prev = new Int32Array(hyp.length + 1).map((_, j) => j)
  for (let i = 1; i <= ref.length; i++) {
    const cur = new Int32Array(hyp.length + 1)
    cur[0] = i
    for (let j = 1; j <= hyp.length; j++) {
      cur[j] = Math.min(prev[j]! + 1, cur[j - 1]! + 1, prev[j - 1]! + (ref[i - 1] === hyp[j - 1] ? 0 : 1))
    }
    prev = cur
  }
  return prev[hyp.length]! / ref.length
}

function clock(seconds: number): string {
  const s = Math.round(seconds)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

async function main() {
  const input = process.argv[2]
  if (!input || !fs.existsSync(input)) {
    console.error('Usage: npx tsx scripts/compare-transcription.ts <file> [--start s] [--duration s] [--language xx] [--out file]')
    process.exit(1)
  }
  const start = Number(arg('start') ?? 0)
  const duration = arg('duration') ? Number(arg('duration')) : null
  const language = arg('language') ?? null
  const providers = (arg('providers') ?? 'openai,groq').split(',') as TranscribeProvider[]

  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cg-compare-'))
  let source = input
  if (start > 0 || duration) {
    const total = (await getMediaDurationSeconds(input)) ?? 0
    source = path.join(dir, 'slice.mp3')
    await extractAudioSlice(input, source, start, duration ?? total - start)
  }
  // Same compression as production before transcribing.
  const audio = await prepareAudioForTranscription(source, dir)
  const seconds = (await getMediaDurationSeconds(audio)) ?? 0
  const sizeMb = fs.statSync(audio).size / 1024 / 1024

  const lines: string[] = [
    `# ${path.basename(input)}`,
    '',
    `Audio: ${clock(seconds)} (${(seconds / 60).toFixed(1)} min), ${sizeMb.toFixed(1)} MB after compression${start || duration ? `, from ${clock(start)}` : ''}. Language: ${language ?? 'auto-detect'}.`,
    '',
  ]

  const results: Partial<Record<TranscribeProvider, { segments: TranscriptSegment[]; words: string[] }>> = {}
  const summary: string[] = ['| | ' + providers.join(' | ') + ' |', '|---|' + providers.map(() => '---').join('|') + '|']
  const rows: Record<string, string[]> = { Model: [], Time: [], 'Cost': [], 'Cost per hour of audio': [], Language: [], Segments: [], Words: [], 'Avg segment': [], Chapters: [] }
  const chapterBlocks: string[] = []
  const sampleBlocks: string[] = []

  for (const provider of providers) {
    const model = MODELS[provider]
    const began = Date.now()
    let transcript
    try {
      transcript = await transcribe(audio, language, undefined, provider)
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      for (const key of Object.keys(rows)) rows[key]!.push(key === 'Model' ? model : key === 'Time' ? `failed: ${message.slice(0, 80)}` : '—')
      continue
    }
    const elapsed = (Date.now() - began) / 1000
    const cost = costFor(model, { audioSeconds: seconds }) ?? 0
    const w = words(transcript.segments)
    results[provider] = { segments: transcript.segments, words: w }
    const chapters = await generateChapters(transcript.segments, { chapterCount: null, language: transcript.language })

    rows.Model!.push(`\`${model}\``)
    rows.Time!.push(`${elapsed.toFixed(1)} s (${(seconds / elapsed).toFixed(0)}x real time)`)
    rows.Cost!.push(`$${cost.toFixed(4)}`)
    rows['Cost per hour of audio']!.push(`$${((cost / seconds) * 3600).toFixed(3)}`)
    rows.Language!.push(transcript.language ?? '—')
    rows.Segments!.push(String(transcript.segments.length))
    rows.Words!.push(w.length.toLocaleString('en-US'))
    rows['Avg segment']!.push(
      transcript.segments.length
        ? `${(transcript.segments.reduce((n, s) => n + (s.end - s.start), 0) / transcript.segments.length).toFixed(1)} s`
        : '—'
    )
    rows.Chapters!.push(String(chapters.length))

    chapterBlocks.push(`### Chapters — ${provider}`, '', ...chapters.map((c) => `- ${c.time} ${c.title}`), '')
    sampleBlocks.push(
      `### First segments — ${provider}`,
      '',
      ...transcript.segments.slice(0, 6).map((s) => `- [${clock(s.start)}–${clock(s.end)}] ${s.text}`),
      ''
    )
    console.error(`${provider}: ${elapsed.toFixed(1)} s, ${w.length} words`)
  }

  for (const [key, values] of Object.entries(rows)) summary.push(`| ${key} | ${values.join(' | ')} |`)
  lines.push(...summary, '')

  if (results.openai && results.groq) {
    const diff = wordDifference(results.openai.words, results.groq.words)
    lines.push(`**Word difference, Groq vs OpenAI:** ${(diff * 100).toFixed(1)}% of words differ (0% = identical text).`, '')
  }

  lines.push(...sampleBlocks, ...chapterBlocks)
  const report = lines.join('\n')
  const out = arg('out')
  if (out) fs.writeFileSync(out, report)
  console.log(report)
  fs.rmSync(dir, { recursive: true, force: true })
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
