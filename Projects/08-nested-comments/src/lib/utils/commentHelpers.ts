import type { Comment } from '@/lib/types/comments'

export function formatRelativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime()
  const minutes = Math.floor(diffMs / 60_000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(iso).toLocaleDateString()
}

export function formatScore(score: number): string {
  if (Math.abs(score) >= 1000) {
    return `${(score / 1000).toFixed(1)}k`
  }
  return String(score)
}

export function getAuthorInitials(username: string): string {
  return username.slice(0, 2).toUpperCase()
}

export function getDisplayScore(comment: Comment, override?: number): number {
  return override ?? comment.score
}
