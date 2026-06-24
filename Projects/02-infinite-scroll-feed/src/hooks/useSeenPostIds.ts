import { useRef } from 'react'

/** Tracks post IDs that have already mounted — prevents re-animation on scroll/load-more */
export function useSeenPostIds() {
  const seenIdsRef = useRef(new Set<string>())

  const markSeen = (id: string) => {
    const isNew = !seenIdsRef.current.has(id)
    if (isNew) seenIdsRef.current.add(id)
    return isNew
  }

  return { markSeen }
}
