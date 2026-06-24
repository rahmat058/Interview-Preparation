import { motion } from 'framer-motion'
import type { SearchIndexItem } from '@/lib/types/search'
import { highlightMatch } from '@/lib/utils/helpers'
import { cn } from '@/lib/utils/cn'
import { EntityBadge, EntityIcon } from './EntityBadge'
import { getEntitySubtitle } from '@/lib/utils/entityHelpers'

interface SearchResultItemProps {
  item: SearchIndexItem
  query: string
  isHighlighted: boolean
  index: number
  onSelect: (item: SearchIndexItem) => void
  onHover: (index: number) => void
}

export function SearchResultItem({
  item,
  query,
  isHighlighted,
  index,
  onSelect,
  onHover,
}: SearchResultItemProps) {
  const titleParts = highlightMatch(item.title, query)

  return (
    <motion.li
      role="option"
      aria-selected={isHighlighted}
      id={`search-option-${index}`}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04, duration: 0.2 }}
      onMouseEnter={() => onHover(index)}
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => onSelect(item)}>
      <button
        type="button"
        className={cn(
          'flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-200',
          isHighlighted
            ? 'bg-gradient-to-r from-indigo-50 to-violet-50 shadow-sm ring-1 ring-indigo-200/60'
            : 'hover:bg-white/80',
        )}>
        <EntityIcon entityType={item.entityType} />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate font-medium text-slate-800">
              {titleParts.map((part, i) =>
                part.match ? (
                  <mark key={i} className="rounded bg-indigo-200/60 px-0.5 text-indigo-900">
                    {part.text}
                  </mark>
                ) : (
                  <span key={i}>{part.text}</span>
                ),
              )}
            </p>
            <EntityBadge entityType={item.entityType} />
          </div>
          <p className="mt-0.5 truncate text-xs text-slate-500">
            {getEntitySubtitle(item.entityType, item.metadata)}
          </p>
        </div>

        <span className="shrink-0 text-xs text-slate-400">{item.category}</span>
      </button>
    </motion.li>
  )
}
