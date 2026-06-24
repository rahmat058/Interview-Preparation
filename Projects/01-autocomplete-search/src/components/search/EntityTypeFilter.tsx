import { motion } from 'framer-motion'
import type { EntityType } from '@/lib/types/search'
import { cn } from '@/lib/utils/cn'
import { MapPin, Package, Users } from 'lucide-react'

const FILTERS: { value: EntityType | 'all'; label: string; icon?: typeof Package }[] = [
  { value: 'all', label: 'All' },
  { value: 'product', label: 'Products', icon: Package },
  { value: 'city', label: 'Cities', icon: MapPin },
  { value: 'user', label: 'Users', icon: Users },
]

interface EntityTypeFilterProps {
  value: EntityType | 'all'
  onChange: (value: EntityType | 'all') => void
}

export function EntityTypeFilter({ value, onChange }: EntityTypeFilterProps) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by type">
      {FILTERS.map((filter) => {
        const Icon = filter.icon
        const isActive = value === filter.value

        return (
          <motion.button
            key={filter.value}
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onChange(filter.value)}
            className={cn(
              'inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-200',
              isActive
                ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/25'
                : 'bg-white/70 text-slate-600 hover:bg-white hover:text-indigo-600',
            )}>
            {Icon && <Icon className="h-3.5 w-3.5" />}
            {filter.label}
          </motion.button>
        )
      })}
    </div>
  )
}
