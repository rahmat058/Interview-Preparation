import { cn } from '@/lib/utils/cn'

interface ModalBodyProps {
  children: React.ReactNode
  className?: string
  descriptionId?: string
}

export function ModalBody({ children, className, descriptionId }: ModalBodyProps) {
  return (
    <div id={descriptionId} className={cn('px-5 py-4 text-sm text-slate-600 sm:px-6', className)}>
      {children}
    </div>
  )
}
