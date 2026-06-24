import type { FileSystemNode, VisibleTreeNode } from '@/lib/types/explorer'

export function findNodeByPath(root: FileSystemNode | null, path: string): FileSystemNode | null {
  if (!root) return null
  if (root.path === path) return root

  if (root.type === 'folder' && root.children) {
    for (const child of root.children) {
      const found = findNodeByPath(child, path)
      if (found) return found
    }
  }

  return null
}

export function collectFolderPaths(root: FileSystemNode | null): string[] {
  if (!root || root.type !== 'folder') return []

  const paths = [root.path]
  for (const child of root.children ?? []) {
    paths.push(...collectFolderPaths(child))
  }
  return paths
}

export function countTreeNodes(root: FileSystemNode | null): number {
  if (!root) return 0
  if (root.type === 'file') return 1
  return 1 + (root.children ?? []).reduce((sum, child) => sum + countTreeNodes(child), 0)
}

export function filterTree(root: FileSystemNode, query: string): FileSystemNode | null {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return root

  if (root.type === 'file') {
    return root.name.toLowerCase().includes(normalized) ? root : null
  }

  const matchingChildren = (root.children ?? [])
    .map((child) => filterTree(child, normalized))
    .filter((child): child is FileSystemNode => child !== null)

  if (root.name.toLowerCase().includes(normalized) || matchingChildren.length > 0) {
    return { ...root, children: matchingChildren }
  }

  return null
}

export function getVisibleNodes(
  root: FileSystemNode | null,
  expandedPaths: Record<string, boolean>,
): VisibleTreeNode[] {
  if (!root) return []

  const visible: VisibleTreeNode[] = []

  function walk(node: FileSystemNode, depth: number) {
    visible.push({ node, depth })

    if (node.type === 'folder' && expandedPaths[node.path] && node.children) {
      for (const child of node.children) {
        walk(child, depth + 1)
      }
    }
  }

  walk(root, 0)
  return visible
}

export function formatFileSize(bytes?: number): string {
  if (bytes === undefined) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function formatModifiedDate(iso?: string): string {
  if (!iso) return '—'
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(iso))
}
