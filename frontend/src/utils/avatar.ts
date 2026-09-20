import type { AuthUser } from '../composables/useAuth'

export function userAvatarUrl(user: Pick<AuthUser, 'email' | 'pictureUrl'>): string {
  if (user.pictureUrl) return user.pictureUrl
  return `https://blobatar.dev/avatar/${encodeURIComponent(user.email)}`
}
