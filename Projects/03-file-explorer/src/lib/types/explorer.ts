export type FileNodeType = 'folder' | 'file'

export interface FileSystemNode {
  id: string
  name: string
  type: FileNodeType
  path: string
  extension?: string
  sizeBytes?: number
  modifiedAt?: string
  children?: FileSystemNode[]
}

export interface FileTreeMeta {
  schemaVersion: string
  collection: string
  rootPath: string
  totalNodes: number
  totalFolders: number
  totalFiles: number
  generatedAt: string
}

export interface FileTreeResponse {
  meta: FileTreeMeta
  data: FileSystemNode
}

export type ExplorerStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

export interface ExplorerState {
  tree: FileSystemNode | null
  meta: FileTreeMeta | null
  expandedPaths: Record<string, boolean>
  selectedPath: string | null
  filterQuery: string
  status: ExplorerStatus
  error: string | null
}

export interface VisibleTreeNode {
  node: FileSystemNode
  depth: number
}
