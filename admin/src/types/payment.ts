export type PaymentStatus = 'paid' | 'refunded'
export type PackId = 'starter' | 'creator'

export interface AdminPayment {
  id: string
  userId: string
  userEmail: string | null
  stripeCheckoutSessionId: string
  stripePaymentIntentId: string | null
  pack: PackId
  creditsGranted: number
  amountCents: number
  status: PaymentStatus
  createdAt: string
}

export interface PaymentsListResponse {
  payments: AdminPayment[]
  total: number
}
