export interface AdminUser {
  id: string
  email: string
  googleId: string | null
  stripeCustomerId: string | null
  creditsRemaining: number
  freeCredits: number
  emailVerifiedAt: string | null
  locale: 'en' | 'es'
  createdAt: string
  lastLoginAt: string | null
  jobCount: number
  paymentCount: number
}

export interface UsersListResponse {
  users: AdminUser[]
  total: number
}
