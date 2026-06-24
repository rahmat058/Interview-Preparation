import { Search } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface HeaderProps {
  className?: string
}

export function Header({ className }: HeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b border-indigo-200/80 bg-white/50 shadow-[0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-xl',
        className,
      )}>
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30">
            <Search className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-lg font-bold text-transparent">
              QueryLens
            </h1>
            <p className="text-xs text-slate-500">Autocomplete Search Demo</p>
          </div>
        </div>
        <span className="hidden rounded-full bg-teal-100 px-3 py-1 text-xs font-medium text-teal-700 sm:inline">
          Mock API · 300ms debounce
        </span>
      </div>
    </header>
  )
}
