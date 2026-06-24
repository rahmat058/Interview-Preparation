import { motion } from 'framer-motion'
import { Calendar, FileType2, FolderOpen, HardDrive, Hash } from 'lucide-react'
import { FileIcon } from '@/components/explorer/FileIcon'
import { useAppSelector } from '@/lib/store/hooks'
import { findNodeByPath, formatFileSize, formatModifiedDate } from '@/lib/utils/treeHelpers'

export function FileDetailPanel() {
  const { tree, selectedPath } = useAppSelector((state) => state.explorer)
  const selected = findNodeByPath(tree, selectedPath ?? '')

  if (!selected) {
    return (
      <div className="flex h-full min-h-[20rem] flex-col items-center justify-center px-6 text-center">
        <FolderOpen className="mb-3 h-10 w-10 text-emerald-300" />
        <p className="text-sm text-slate-500">Select a file or folder to view details</p>
      </div>
    )
  }

  const isFolder = selected.type === 'folder'
  const childCount = isFolder ? (selected.children?.length ?? 0) : 0

  return (
    <motion.div
      key={selected.path}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex h-full min-h-[20rem] flex-col p-5 sm:p-6"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
          <FileIcon node={selected} isExpanded className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-semibold text-slate-800">{selected.name}</h3>
          <p className="mt-0.5 truncate font-mono text-xs text-slate-400">{selected.path}</p>
        </div>
      </div>

      <dl className="mt-6 space-y-3 text-sm">
        <DetailRow icon={Hash} label="Type" value={isFolder ? 'Folder' : `File (.${selected.extension ?? 'unknown'})`} />
        {!isFolder && (
          <DetailRow icon={HardDrive} label="Size" value={formatFileSize(selected.sizeBytes)} />
        )}
        {isFolder && (
          <DetailRow icon={FolderOpen} label="Items" value={`${childCount} direct ${childCount === 1 ? 'child' : 'children'}`} />
        )}
        <DetailRow icon={Calendar} label="Modified" value={formatModifiedDate(selected.modifiedAt)} />
        {!isFolder && selected.extension && (
          <DetailRow icon={FileType2} label="Extension" value={selected.extension.toUpperCase()} />
        )}
      </dl>

      <div className="mt-auto rounded-xl border border-emerald-100 bg-emerald-50/50 px-4 py-3 text-xs text-emerald-800">
        {isFolder
          ? 'Folders expand inline via recursive TreeNode components — the same pattern VS Code uses.'
          : 'Files are leaf nodes with no children — recursion stops at this depth.'}
      </div>
    </motion.div>
  )
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Hash
  label: string
  value: string
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-emerald-50 pb-3 last:border-0">
      <dt className="flex items-center gap-2 text-slate-500">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </dt>
      <dd className="font-medium text-slate-700">{value}</dd>
    </div>
  )
}
