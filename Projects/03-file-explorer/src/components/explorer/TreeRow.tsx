import { ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { FileIcon } from '@/components/explorer/FileIcon'
import { cn } from '@/lib/utils/cn'
import type { FileSystemNode } from '@/lib/types/explorer'

const INDENT_PX = 16

interface TreeRowProps {
  node: FileSystemNode
  depth: number
  isExpanded: boolean
  isSelected: boolean
  hasChildren: boolean
  onToggle: () => void
  onSelect: () => void
  tabIndex?: number
  onKeyDown?: (event: React.KeyboardEvent<HTMLButtonElement>) => void
  onFocus?: () => void
}

export function TreeRow({
  node,
  depth,
  isExpanded,
  isSelected,
  hasChildren,
  onToggle,
  onSelect,
  tabIndex = -1,
  onKeyDown,
  onFocus,
}: TreeRowProps) {
  const isFolder = node.type === 'folder'

  function handleClick() {
    onSelect()
    if (isFolder && hasChildren) {
      onToggle()
    }
  }

  return (
    <button
      type="button"
      id={`tree-item-${node.id}`}
      data-tree-path={node.path}
      role="treeitem"
      aria-expanded={isFolder ? isExpanded : undefined}
      aria-selected={isSelected}
      tabIndex={tabIndex}
      onKeyDown={onKeyDown}
      onFocus={onFocus}
      onClick={handleClick}
      style={{ paddingLeft: `${depth * INDENT_PX + 8}px` }}
      className={cn(
        'group flex w-full items-center gap-1.5 rounded-lg py-1.5 pr-2 text-left text-sm transition-colors',
        isSelected
          ? 'bg-emerald-100/80 text-emerald-900'
          : 'text-slate-700 hover:bg-white/70 hover:text-emerald-800',
      )}
    >
      <span
        className={cn(
          'flex h-5 w-5 shrink-0 items-center justify-center rounded transition-colors',
          isFolder && hasChildren ? 'hover:bg-emerald-100' : 'invisible',
        )}
        onClick={(event) => {
          if (!isFolder || !hasChildren) return
          event.stopPropagation()
          onToggle()
        }}
        onKeyDown={(event) => event.stopPropagation()}
        role="presentation"
      >
        {isFolder && hasChildren && (
          <motion.span
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.15 }}
            className="inline-flex"
          >
            <ChevronRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-emerald-600" />
          </motion.span>
        )}
      </span>

      <FileIcon node={node} isExpanded={isExpanded} />
      <span className="truncate font-medium">{node.name}</span>
    </button>
  )
}
