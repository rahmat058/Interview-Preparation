import { cn } from '@/lib/utils/cn'
import { formatStatusLabel, getStatusStyles } from '@/lib/utils/tableQuery'

interface StatusBadgeProps {
  status: string
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase',
        getStatusStyles(status),
      )}
    >
      {formatStatusLabel(status)}
    </span>
  )
}
