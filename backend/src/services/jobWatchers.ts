// Last time someone polled each job page. Used to skip the "ready" email when
// the user is still looking at the page. In memory on purpose: after a restart
// the worst case is one extra email.
const lastSeen = new Map<string, number>()

export function markJobWatched(jobId: string): void {
  lastSeen.set(jobId, Date.now())
}

export function isJobWatched(jobId: string, withinMs = 20_000): boolean {
  const at = lastSeen.get(jobId)
  return at != null && Date.now() - at < withinMs
}

export function forgetJob(jobId: string): void {
  lastSeen.delete(jobId)
}
