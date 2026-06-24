import { AnimatePresence, motion } from 'framer-motion'
import { TreeRow } from '@/components/explorer/TreeRow'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { setSelectedPath, toggleExpanded } from '@/lib/store/slices/explorerSlice'
import type { FileSystemNode } from '@/lib/types/explorer'

interface TreeNodeProps {
  node: FileSystemNode
  depth: number
  focusedPath: string | null
  onFocusPath: (path: string) => void
  onKeyNavigate: (event: React.KeyboardEvent<HTMLButtonElement>, path: string) => void
}

/**
 * Recursive tree node — renders one row, then maps children to itself when expanded.
 * This is the core pattern interviewers test: self-similar structure at every depth.
 */
export function TreeNode({ node, depth, focusedPath, onFocusPath, onKeyNavigate }: TreeNodeProps) {
  const dispatch = useAppDispatch()
  const { expandedPaths, selectedPath } = useAppSelector((state) => state.explorer)

  const isFolder = node.type === 'folder'
  const hasChildren = isFolder && Boolean(node.children?.length)
  const isExpanded = Boolean(expandedPaths[node.path])
  const isSelected = selectedPath === node.path
  const isFocused = focusedPath === node.path

  return (
    <div>
      <TreeRow
        node={node}
        depth={depth}
        isExpanded={isExpanded}
        isSelected={isSelected}
        hasChildren={hasChildren}
        tabIndex={isFocused ? 0 : -1}
        onToggle={() => dispatch(toggleExpanded(node.path))}
        onSelect={() => {
          dispatch(setSelectedPath(node.path))
          onFocusPath(node.path)
        }}
        onKeyDown={(event) => onKeyNavigate(event, node.path)}
        onFocus={() => onFocusPath(node.path)}
      />

      <AnimatePresence initial={false}>
        {isFolder && isExpanded && hasChildren && (
          <motion.div
            key={`${node.path}-children`}
            role="group"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18, ease: [0.32, 0.72, 0, 1] }}
            className="overflow-hidden"
          >
            {node.children!.map((child) => (
              <TreeNode
                key={child.id}
                node={child}
                depth={depth + 1}
                focusedPath={focusedPath}
                onFocusPath={onFocusPath}
                onKeyNavigate={onKeyNavigate}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
