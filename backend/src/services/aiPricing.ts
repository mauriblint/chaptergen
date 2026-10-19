// OpenAI list prices in USD, used to price every call when it happens. The
// cost is stored with the call, so changing a price here only affects new
// calls. Check https://openai.com/api/pricing when adding or switching models.
interface ModelPrice {
  /** Per minute of audio (whisper-1 bills this way). */
  perMinute?: number
  /** Per 1M tokens. */
  input?: number
  cachedInput?: number
  /** Audio input tokens, for the gpt-4o transcribe models. */
  audioInput?: number
  output?: number
}

const PRICES: Record<string, ModelPrice> = {
  'whisper-1': { perMinute: 0.006 },
  'gpt-4o-transcribe': { perMinute: 0.006, input: 2.5, audioInput: 6, output: 10 },
  'gpt-4o-mini-transcribe': { perMinute: 0.003, input: 1.25, audioInput: 3, output: 5 },
  // Groq bills Whisper per hour of audio ($0.04 turbo, $0.111 large-v3), at least 10 s per request.
  'whisper-large-v3-turbo': { perMinute: 0.04 / 60 },
  'whisper-large-v3': { perMinute: 0.111 / 60 },
  'gpt-4o-mini': { input: 0.15, cachedInput: 0.075, output: 0.6 },
  'gpt-4o': { input: 2.5, cachedInput: 1.25, output: 10 },
  'gpt-4.1': { input: 2, cachedInput: 0.5, output: 8 },
  'gpt-4.1-mini': { input: 0.4, cachedInput: 0.1, output: 1.6 },
  'gpt-4.1-nano': { input: 0.1, cachedInput: 0.025, output: 0.4 },
}

/** Dated snapshots ("gpt-4o-mini-2024-07-18") are priced like their base model. */
function priceFor(model: string): ModelPrice | null {
  if (PRICES[model]) return PRICES[model]
  const base = Object.keys(PRICES)
    .filter((name) => model.startsWith(`${name}-`))
    .sort((a, b) => b.length - a.length)[0]
  return base ? PRICES[base] : null
}

export interface UsageAmounts {
  inputTokens?: number
  cachedInputTokens?: number
  audioInputTokens?: number
  outputTokens?: number
  audioSeconds?: number
}

/** Cost in USD; null when the model has no known price. Tokens win over minutes when both are known. */
export function costFor(model: string, usage: UsageAmounts): number | null {
  const price = priceFor(model)
  if (!price) return null

  const hasTokens = (usage.inputTokens ?? 0) + (usage.audioInputTokens ?? 0) + (usage.outputTokens ?? 0) > 0
  if (hasTokens && price.output != null) {
    const cached = usage.cachedInputTokens ?? 0
    const text = Math.max(0, (usage.inputTokens ?? 0) - cached)
    return (
      (text * (price.input ?? 0) +
        cached * (price.cachedInput ?? price.input ?? 0) +
        (usage.audioInputTokens ?? 0) * (price.audioInput ?? price.input ?? 0) +
        (usage.outputTokens ?? 0) * price.output) /
      1_000_000
    )
  }

  if (price.perMinute != null && usage.audioSeconds != null) {
    return (usage.audioSeconds / 60) * price.perMinute
  }
  return null
}
