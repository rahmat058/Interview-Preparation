import { cn } from '@/lib/utils/cn'

interface ModalFooterProps {
  children: React.ReactNode
  className?: string
}

export function ModalFooter({ children, className }: ModalFooterProps) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-end gap-2 border-t border-violet-100/80 px-5 py-4 sm:px-6',
        className,
      )}
    >
      {children}
    </div>
  )
}
