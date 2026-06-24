import { motion } from 'framer-motion'
import { Calendar, Hash, Tag, TrendingUp } from 'lucide-react'
import type { SearchIndexItem } from '@/lib/types/search'
import { EntityBadge } from './EntityBadge'
import { getEntitySubtitle } from '@/lib/utils/entityHelpers'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'

interface SelectedItemPanelProps {
  item: SearchIndexItem
  onClear: () => void
}

export function SelectedItemPanel({ item, onClear }: SelectedItemPanelProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
      className="glass-card overflow-hidden p-0">
      <div className="bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 px-6 py-4">
        <p className="text-sm font-medium text-white/80">Selected result</p>
        <h2 className="mt-1 text-xl font-bold text-white">{item.title}</h2>
      </div>

      <div className="space-y-4 p-6">
        <div className="flex flex-wrap items-center gap-2">
          <EntityBadge entityType={item.entityType} />
          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-500">{item.category}</span>
        </div>

        <p className="text-sm text-slate-600">{item.description}</p>
        <p className="text-sm font-medium text-indigo-600">{getEntitySubtitle(item.entityType, item.metadata)}</p>

        <div className="grid gap-3 sm:grid-cols-2">
          <DetailRow icon={Hash} label="ID" value={item.id} mono />
          <DetailRow icon={Tag} label="Slug" value={item.slug} mono />
          <DetailRow icon={TrendingUp} label="Popularity" value={String(item.popularityScore)} />
          <DetailRow icon={Calendar} label="Updated" value={new Date(item.updatedAt).toLocaleDateString()} />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {item.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs text-indigo-600">
              #{tag}
            </span>
          ))}
        </div>

        <Button variant="outline" size="sm" onClick={onClear}>
          Clear selection
        </Button>
      </div>
    </motion.section>
  )
}

function DetailRow({
  icon: Icon,
  label,
  value,
  mono = false,
}: {
  icon: typeof Hash
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="rounded-xl bg-white/60 px-3 py-2">
      <p className="flex items-center gap-1 text-xs text-slate-400">
        <Icon className="h-3 w-3" />
        {label}
      </p>
      <p className={cn('mt-0.5 truncate text-sm text-slate-700', mono && 'font-mono text-xs')}>{value}</p>
    </div>
  )
}
