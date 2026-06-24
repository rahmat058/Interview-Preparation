import type { EntityType } from '@/lib/types/search'
import { MapPin, Package, Users } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

const ENTITY_CONFIG: Record<
  EntityType,
  { label: string; icon: typeof Package; badge: string; badgeText: string }
> = {
  product: {
    label: 'Product',
    icon: Package,
    badge: 'bg-violet-100 text-violet-700',
    badgeText: 'PRD',
  },
  city: {
    label: 'City',
    icon: MapPin,
    badge: 'bg-cyan-100 text-cyan-700',
    badgeText: 'CTY',
  },
  user: {
    label: 'User',
    icon: Users,
    badge: 'bg-indigo-100 text-indigo-700',
    badgeText: 'USR',
  },
}

interface EntityBadgeProps {
  entityType: EntityType
  className?: string
}

export function EntityBadge({ entityType, className }: EntityBadgeProps) {
  const config = ENTITY_CONFIG[entityType]
  const Icon = config.icon

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium',
        config.badge,
        className,
      )}>
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  )
}

export function EntityIcon({ entityType }: { entityType: EntityType }) {
  const config = ENTITY_CONFIG[entityType]
  const Icon = config.icon

  return (
    <div
      className={cn(
        'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
        entityType === 'product' && 'bg-violet-100',
        entityType === 'city' && 'bg-cyan-100',
        entityType === 'user' && 'bg-indigo-100',
      )}>
      <Icon
        className={cn(
          'h-4 w-4',
          entityType === 'product' && 'text-violet-600',
          entityType === 'city' && 'text-cyan-600',
          entityType === 'user' && 'text-indigo-600',
        )}
      />
    </div>
  )
}
