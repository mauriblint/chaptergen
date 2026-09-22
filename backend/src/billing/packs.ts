export type PackId = 'starter' | 'creator'

export interface Pack {
  id: PackId
  credits: number
  amountCents: number
}

export const PACKS: Record<PackId, Pack> = {
  starter: { id: 'starter', credits: 5, amountCents: 500 },
  creator: { id: 'creator', credits: 15, amountCents: 1200 },
}

export const PACK_LIST: Pack[] = Object.values(PACKS)

export const FREE_JOB_LIMIT = 2
export const FREE_MAX_MINUTES = 20
export const FREE_MAX_SECONDS = FREE_MAX_MINUTES * 60
export const FREE_REFINE_LIMIT = 2

/** Kept for a later duration-based price. Today every paid job costs 1 credit. */
export const MINUTES_PER_CREDIT = 60

export function isPackId(value: unknown): value is PackId {
  return value === 'starter' || value === 'creator'
}

export function stripePriceId(pack: PackId): string | null {
  const envKey = pack === 'starter' ? 'STRIPE_PRICE_STARTER' : 'STRIPE_PRICE_CREATOR'
  const id = process.env[envKey]
  return id?.trim() ? id.trim() : null
}

export function packFromPriceId(priceId: string): Pack | null {
  for (const pack of PACK_LIST) {
    if (stripePriceId(pack.id) === priceId) return pack
  }
  return null
}

export function creditsForDuration(_durationSeconds: number | null): number {
  return 1
}

export function publicSiteUrl(): string {
  return (process.env.PUBLIC_SITE_URL ?? 'http://localhost:5193').replace(/\/+$/, '')
}
