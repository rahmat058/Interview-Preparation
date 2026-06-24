import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeftRight, LayoutGrid, Layers } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { loadKanbanBoard } from '@/lib/store/slices/kanbanSlice'
import { KanbanBoard } from '@/components/kanban/KanbanBoard'
import { BoardSkeleton } from '@/components/kanban/BoardSkeleton'
import { BoardError } from '@/components/kanban/BoardError'

const TIPS = [
  { icon: ArrowLeftRight, text: '@dnd-kit drag & drop' },
  { icon: Layers, text: 'Cross-column reordering' },
  { icon: LayoutGrid, text: 'Normalized Redux state' },
]

export function BoardApp() {
  const dispatch = useAppDispatch()
  const { status, error } = useAppSelector((state) => state.kanban)

  useEffect(() => {
    const promise = dispatch(loadKanbanBoard())
    return () => {
      promise.abort()
    }
  }, [dispatch])

  return (
    <main className="mx-auto max-w-[1400px] flex-1 px-4 py-10 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
        className="text-center"
      >
        <h2 className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-500 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
          Kanban Board
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-slate-500 sm:text-base">
          Drag cards between columns or reorder within a column. State updates flow through a single{' '}
          <code className="rounded bg-violet-100 px-1.5 py-0.5 text-xs text-violet-700">moveCard</code>{' '}
          reducer.
        </p>
      </motion.div>

      <div className="mt-8">
        {status === 'loading' && <BoardSkeleton />}
        {status === 'failed' && error && <BoardError message={error} />}
        {status === 'succeeded' && <KanbanBoard />}
      </div>

      <div className="mx-auto mt-4 flex max-w-3xl flex-wrap justify-center gap-4">
        {TIPS.map(({ icon: Icon, text }) => (
          <span key={text} className="flex items-center gap-1.5 text-xs text-slate-400">
            <Icon className="h-3.5 w-3.5 text-violet-400" />
            {text}
          </span>
        ))}
      </div>
    </main>
  )
}
