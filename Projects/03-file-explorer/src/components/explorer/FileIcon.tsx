import {
  Braces,
  Code2,
  File,
  FileCode2,
  FileJson2,
  FileText,
  Folder,
  FolderOpen,
  Image,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import type { FileSystemNode } from '@/lib/types/explorer'

interface FileIconProps {
  node: FileSystemNode
  isExpanded?: boolean
  className?: string
}

const EXTENSION_ICON: Record<string, typeof File> = {
  ts: Code2,
  tsx: FileCode2,
  js: Code2,
  jsx: FileCode2,
  json: FileJson2,
  md: FileText,
  css: Braces,
  svg: Image,
  png: Image,
  yml: FileText,
  yaml: FileText,
  mjs: Code2,
}

export function FileIcon({ node, isExpanded = false, className }: FileIconProps) {
  if (node.type === 'folder') {
    const FolderIcon = isExpanded ? FolderOpen : Folder
    return <FolderIcon className={cn('h-4 w-4 shrink-0 text-amber-500', className)} aria-hidden />
  }

  const ext = node.extension?.toLowerCase() ?? ''
  const Icon = EXTENSION_ICON[ext] ?? File
  const color =
    ext === 'tsx' || ext === 'ts'
      ? 'text-sky-500'
      : ext === 'json'
        ? 'text-amber-600'
        : ext === 'md'
          ? 'text-slate-500'
          : 'text-slate-400'

  return <Icon className={cn('h-4 w-4 shrink-0', color, className)} aria-hidden />
}
