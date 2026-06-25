import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useAppDispatch } from '@/lib/store/hooks'
import { clearCart } from '@/lib/store/slices/cartSlice'
import { CartContent } from '@/components/cart/CartContent'

interface CartDrawerProps {
  open: boolean
  onClose: () => void
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[2px]"
            onClick={onClose}
            aria-label="Close cart"
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="fixed top-0 right-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
            aria-label="Shopping cart"
            role="dialog"
            aria-modal="true"
          >
            <header className="flex items-center justify-between bg-linear-to-r from-teal-600 via-teal-600 to-cyan-600 px-5 py-4 text-white">
              <h2 className="text-base font-semibold tracking-wide">Shopping Cart</h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => dispatch(clearCart())}
                  className="rounded px-2 py-1 text-xs font-medium text-teal-100 transition-colors hover:bg-white/15 hover:text-white"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg p-1.5 text-teal-100 transition-colors hover:bg-white/15 hover:text-white"
                  aria-label="Close cart drawer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </header>

            <CartContent variant="drawer" onClose={onClose} />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
