// Last time someone polled each job page. Used to skip the "ready" email when
// the user saw the result on the page. In memory on purpose: after a restart
// the worst case is one extra email.
const lastSeen = new Map<string, number>()

export function markJobWatched(jobId: string): void {
  lastSeen.set(jobId, Date.now())
}

/** True if the job page polled at or after `since` (ms timestamp). */
export function wasJobSeenSince(jobId: string, since: number): boolean {
  const at = lastSeen.get(jobId)
  return at != null && at >= since
}

export function forgetJob(jobId: string): void {
  lastSeen.delete(jobId)
}
