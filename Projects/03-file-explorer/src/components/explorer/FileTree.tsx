import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { TreeNode } from '@/components/explorer/TreeNode'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { setExpanded, setSelectedPath } from '@/lib/store/slices/explorerSlice'
import { filterTree, getVisibleNodes } from '@/lib/utils/treeHelpers'

function focusTreeItem(container: HTMLElement | null, path: string) {
  if (!container) return
  const item = container.querySelector<HTMLButtonElement>(`[data-tree-path="${CSS.escape(path)}"]`)
  item?.focus()
}

export function FileTree() {
  const dispatch = useAppDispatch()
  const { tree, expandedPaths, filterQuery, selectedPath } = useAppSelector((state) => state.explorer)
  const treeRef = useRef<HTMLDivElement>(null)
  const pendingFocusPath = useRef<string | null>(null)
  const [focusedPath, setFocusedPath] = useState<string | null>(null)

  const displayTree = useMemo(() => {
    if (!tree) return null
    if (!filterQuery.trim()) return tree
    return filterTree(tree, filterQuery)
  }, [tree, filterQuery])

  const visibleNodes = useMemo(
    () => getVisibleNodes(displayTree, expandedPaths),
    [displayTree, expandedPaths],
  )

  const activeFocusPath = useMemo(() => {
    if (visibleNodes.length === 0) return null
    const candidate = focusedPath ?? selectedPath ?? displayTree?.path ?? null
    if (candidate && visibleNodes.some((item) => item.node.path === candidate)) {
      return candidate
    }
    return visibleNodes[0]?.node.path ?? null
  }, [visibleNodes, focusedPath, selectedPath, displayTree?.path])

  const activeFocusId = visibleNodes.find((item) => item.node.path === activeFocusPath)?.node.id

  useEffect(() => {
    if (!pendingFocusPath.current) return
    const path = pendingFocusPath.current
    pendingFocusPath.current = null
    focusTreeItem(treeRef.current, path)
  }, [activeFocusPath, visibleNodes])

  const moveFocus = useCallback(
    (path: string) => {
      pendingFocusPath.current = path
      setFocusedPath(path)
      dispatch(setSelectedPath(path))
    },
    [dispatch],
  )

  const handleKeyNavigate = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>, path: string) => {
      const currentIndex = visibleNodes.findIndex((item) => item.node.path === path)
      if (currentIndex === -1) return

      const current = visibleNodes[currentIndex]?.node
      if (!current) return

      switch (event.key) {
        case 'ArrowDown': {
          event.preventDefault()
          const next = visibleNodes[currentIndex + 1]
          if (next) moveFocus(next.node.path)
          break
        }
        case 'ArrowUp': {
          event.preventDefault()
          const prev = visibleNodes[currentIndex - 1]
          if (prev) moveFocus(prev.node.path)
          break
        }
        case 'Home': {
          event.preventDefault()
          const first = visibleNodes[0]
          if (first) moveFocus(first.node.path)
          break
        }
        case 'End': {
          event.preventDefault()
          const last = visibleNodes[visibleNodes.length - 1]
          if (last) moveFocus(last.node.path)
          break
        }
        case 'ArrowRight': {
          if (current.type !== 'folder') return
          event.preventDefault()
          if (!expandedPaths[current.path]) {
            dispatch(setExpanded({ path: current.path, expanded: true }))
          } else {
            const next = visibleNodes[currentIndex + 1]
            if (next) moveFocus(next.node.path)
          }
          break
        }
        case 'ArrowLeft': {
          event.preventDefault()
          if (current.type === 'folder' && expandedPaths[current.path]) {
            dispatch(setExpanded({ path: current.path, expanded: false }))
            return
          }
          const parentPath = current.path.slice(0, current.path.lastIndexOf('/')) || current.path
          const parent = visibleNodes.find((item) => item.node.path === parentPath)
          if (parent) moveFocus(parent.node.path)
          break
        }
        case 'Enter':
        case ' ': {
          event.preventDefault()
          if (current.type === 'folder') {
            dispatch(setExpanded({ path: current.path, expanded: !expandedPaths[current.path] }))
          }
          break
        }
        default:
          break
      }
    },
    [visibleNodes, expandedPaths, dispatch, moveFocus],
  )

  if (!displayTree) {
    return (
      <p className="px-3 py-6 text-center text-sm text-slate-500">
        {filterQuery.trim() ? 'No files match your filter.' : 'No files to display.'}
      </p>
    )
  }

  return (
    <div
      ref={treeRef}
      role="tree"
      aria-label="Project files"
      aria-activedescendant={activeFocusId ? `tree-item-${activeFocusId}` : undefined}
      className="max-h-[28rem] overflow-y-auto py-1 focus:outline-none"
      onBlur={(event) => {
        if (!treeRef.current?.contains(event.relatedTarget as Node)) {
          pendingFocusPath.current = null
        }
      }}
    >
      <TreeNode
        node={displayTree}
        depth={0}
        focusedPath={activeFocusPath}
        onFocusPath={setFocusedPath}
        onKeyNavigate={handleKeyNavigate}
      />
    </div>
  )
}
