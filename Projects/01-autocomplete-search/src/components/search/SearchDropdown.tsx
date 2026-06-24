import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, Loader2, SearchX } from 'lucide-react'
import { MIN_QUERY_LENGTH } from '@/lib/store/slices/searchSlice'
import type { SearchIndexItem } from '@/lib/types/search'
import { SearchResultItem } from './SearchResultItem'

interface SearchDropdownProps {
  isOpen: boolean
  query: string
  debouncedQuery: string
  results: SearchIndexItem[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
  highlightedIndex: number
  metaTookMs: number | null
  total: number
  listboxId: string
  onSelect: (item: SearchIndexItem) => void
  onHover: (index: number) => void
}

export function SearchDropdown({
  isOpen,
  query,
  debouncedQuery,
  results,
  status,
  error,
  highlightedIndex,
  metaTookMs,
  total,
  listboxId,
  onSelect,
  onHover,
}: SearchDropdownProps) {
  const showDropdown = isOpen && query.length > 0
  const isDebouncing = query !== debouncedQuery && query.trim().length >= MIN_QUERY_LENGTH
  const isLoading = status === 'loading' || isDebouncing
  const queryTooShort = query.trim().length > 0 && query.trim().length < MIN_QUERY_LENGTH

  return (
    <AnimatePresence>
      {showDropdown && (
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
          className="absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-2xl border border-white/60 bg-white/90 shadow-xl shadow-indigo-500/10 backdrop-blur-xl">
          {queryTooShort && (
            <div className="flex items-center gap-2 px-4 py-3 text-sm text-slate-500">
              <SearchX className="h-4 w-4 text-slate-400" />
              Type at least {MIN_QUERY_LENGTH} characters to search
            </div>
          )}

          {isLoading && !queryTooShort && (
            <div className="flex items-center gap-3 px-4 py-4 text-sm text-slate-600">
              <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
              <span>Searching…</span>
            </div>
          )}

          {status === 'failed' && error && (
            <div className="flex items-center gap-2 px-4 py-4 text-sm text-rose-600">
              <AlertCircle className="h-5 w-5 shrink-0" />
              {error}
            </div>
          )}

          {status === 'succeeded' && !isLoading && results.length === 0 && !queryTooShort && (
            <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
              <SearchX className="h-10 w-10 text-slate-300" />
              <p className="font-medium text-slate-700">No results for &ldquo;{debouncedQuery}&rdquo;</p>
              <p className="text-sm text-slate-500">Try &ldquo;sony&rdquo;, &ldquo;tokyo&rdquo;, or &ldquo;sarah&rdquo;</p>
            </div>
          )}

          {status === 'succeeded' && !isLoading && results.length > 0 && (
            <>
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2 text-xs text-slate-400">
                <span>
                  {total} result{total !== 1 ? 's' : ''}
                </span>
                {metaTookMs != null && <span>{metaTookMs}ms</span>}
              </div>
              <ul
                id={listboxId}
                role="listbox"
                aria-label="Search suggestions"
                className="max-h-80 overflow-y-auto p-2">
                {results.map((item, index) => (
                  <SearchResultItem
                    key={item.id}
                    item={item}
                    query={debouncedQuery}
                    index={index}
                    isHighlighted={index === highlightedIndex}
                    onSelect={onSelect}
                    onHover={onHover}
                  />
                ))}
              </ul>
              <div className="border-t border-slate-100 px-4 py-2 text-xs text-slate-400">
                <kbd className="rounded bg-slate-100 px-1.5 py-0.5">↑</kbd>{' '}
                <kbd className="rounded bg-slate-100 px-1.5 py-0.5">↓</kbd> navigate ·{' '}
                <kbd className="rounded bg-slate-100 px-1.5 py-0.5">Enter</kbd> select ·{' '}
                <kbd className="rounded bg-slate-100 px-1.5 py-0.5">Esc</kbd> close
              </div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
