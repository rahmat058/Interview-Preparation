import { X } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface ModalHeaderProps {
  title: string
  titleId: string
  onClose?: () => void
  showCloseButton?: boolean
}

export function ModalHeader({ title, titleId, onClose, showCloseButton = true }: ModalHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-violet-100/80 px-5 py-4 sm:px-6">
      <h2 id={titleId} className="text-lg font-semibold text-slate-800">
        {title}
      </h2>
      {showCloseButton && onClose && (
        <button
          type="button"
          onClick={onClose}
          className={cn(
            'rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-violet-50 hover:text-violet-600',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300',
          )}
          aria-label="Close dialog"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
