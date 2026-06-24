import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { FolderTree, GitBranch, Keyboard } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { loadFileTree } from '@/lib/store/slices/explorerSlice'
import { ExplorerToolbar } from '@/components/explorer/ExplorerToolbar'
import { FileTree } from '@/components/explorer/FileTree'
import { FileDetailPanel } from '@/components/explorer/FileDetailPanel'
import { ExplorerSkeleton } from '@/components/explorer/ExplorerSkeleton'
import { ExplorerError } from '@/components/explorer/ExplorerError'

const TIPS = [
  { icon: GitBranch, text: 'Recursive TreeNode components' },
  { icon: FolderTree, text: 'Expand / collapse nested folders' },
  { icon: Keyboard, text: 'Arrow keys + Enter navigation' },
]

export function ExplorerApp() {
  const dispatch = useAppDispatch()
  const { status, error } = useAppSelector((state) => state.explorer)

  useEffect(() => {
    const promise = dispatch(loadFileTree())
    return () => {
      promise.abort()
    }
  }, [dispatch])

  return (
    <main className="mx-auto max-w-5xl flex-1 px-4 py-10 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
        className="text-center"
      >
        <h2 className="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-500 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
          File Explorer
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm text-slate-500 sm:text-base">
          VS Code–style nested tree with recursive components. Click folders to expand, or use arrow keys to navigate.
        </p>
      </motion.div>

      {status === 'loading' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8"
        >
          <ExplorerSkeleton />
        </motion.div>
      )}

      {status === 'failed' && error && (
        <div className="mt-8">
          <ExplorerError message={error} />
        </div>
      )}

      {status === 'succeeded' && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.45 }}
          className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]"
        >
          <section className="glass-card p-5 sm:p-6" aria-label="File tree panel">
            <ExplorerToolbar />
            <div className="mt-4">
              <FileTree />
            </div>
          </section>

          <section className="glass-card overflow-hidden" aria-label="File details panel">
            <FileDetailPanel />
          </section>
        </motion.div>
      )}

      <div className="mx-auto mt-4 flex max-w-3xl flex-wrap justify-center gap-4">
        {TIPS.map(({ icon: Icon, text }) => (
          <span key={text} className="flex items-center gap-1.5 text-xs text-slate-400">
            <Icon className="h-3.5 w-3.5 text-emerald-400" />
            {text}
          </span>
        ))}
      </div>
    </main>
  )
}
