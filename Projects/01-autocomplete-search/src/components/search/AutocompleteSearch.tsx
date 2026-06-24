import { useId, useRef, type KeyboardEvent } from 'react'
import { motion } from 'framer-motion'
import { Loader2, Search, X } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import {
  clearSelection,
  closeDropdown,
  moveHighlightDown,
  moveHighlightUp,
  openDropdown,
  selectHighlighted,
  selectItem,
  setHighlightedIndex,
  setQuery,
} from '@/lib/store/slices/searchSlice'
import { useDebouncedSearch } from '@/hooks/useDebouncedSearch'
import { useClickOutside } from '@/hooks/useClickOutside'
import { cn } from '@/lib/utils/cn'
import { SearchDropdown } from './SearchDropdown'

export function AutocompleteSearch() {
  const dispatch = useAppDispatch()
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useClickOutside<HTMLDivElement>(() => dispatch(closeDropdown()))
  const listboxId = useId()

  const {
    query,
    debouncedQuery,
    results,
    status,
    error,
    isDropdownOpen,
    highlightedIndex,
    meta,
    selectedItem,
  } = useAppSelector((state) => state.search)

  useDebouncedSearch()

  const hasCommittedSelection = Boolean(selectedItem && query === selectedItem.title)
  const showDropdown = isDropdownOpen && query.length > 0 && !hasCommittedSelection

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        dispatch(moveHighlightDown())
        break
      case 'ArrowUp':
        e.preventDefault()
        dispatch(moveHighlightUp())
        break
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0) {
          dispatch(selectHighlighted())
        }
        break
      case 'Escape':
        e.preventDefault()
        dispatch(closeDropdown())
        inputRef.current?.blur()
        break
      case 'Tab':
        dispatch(closeDropdown())
        break
    }
  }

  const isDebouncing = query !== debouncedQuery && query.trim().length >= 2
  const showInputSpinner = status === 'loading' || isDebouncing

  return (
    <div
      ref={containerRef}
      className="relative z-30 w-full"
      role="combobox"
      aria-expanded={showDropdown}
      aria-haspopup="listbox">
      <motion.div
        className={cn(
          'flex items-center gap-3 rounded-2xl border bg-white/80 px-4 py-3 shadow-sm backdrop-blur-sm transition-all duration-300',
          showDropdown
            ? 'border-indigo-300 ring-2 ring-indigo-200/80 shadow-indigo-500/10'
            : 'border-white/60 hover:border-indigo-200',
        )}
        animate={showDropdown ? { scale: 1.01 } : { scale: 1 }}
        transition={{ duration: 0.2 }}>
        {showInputSpinner ? (
          <Loader2 className="h-5 w-5 shrink-0 animate-spin text-indigo-500" />
        ) : (
          <Search className="h-5 w-5 shrink-0 text-indigo-500" />
        )}

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => dispatch(setQuery(e.target.value))}
          onFocus={() => dispatch(openDropdown())}
          onKeyDown={handleKeyDown}
          placeholder="Search products, cities, or users…"
          aria-label="Search"
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-activedescendant={
            highlightedIndex >= 0 ? `search-option-${highlightedIndex}` : undefined
          }
          className="min-w-0 flex-1 bg-transparent text-base text-slate-800 placeholder:text-slate-400 focus:outline-none"
          autoComplete="off"
          spellCheck={false}
        />

        {query.length > 0 && (
          <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => {
              dispatch(clearSelection())
              inputRef.current?.focus()
            }}
            className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            aria-label="Clear search">
            <X className="h-4 w-4" />
          </motion.button>
        )}
      </motion.div>

      <SearchDropdown
        isOpen={showDropdown}
        query={query}
        debouncedQuery={debouncedQuery}
        results={results}
        status={status}
        error={error}
        highlightedIndex={highlightedIndex}
        metaTookMs={meta?.tookMs ?? null}
        total={meta?.total ?? 0}
        listboxId={listboxId}
        onSelect={(item) => dispatch(selectItem(item))}
        onHover={(index) => dispatch(setHighlightedIndex(index))}
      />
    </div>
  )
}
