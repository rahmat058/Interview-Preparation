import { useState } from 'react'
import { motion } from 'framer-motion'
import { Filter, Layers, SlidersHorizontal } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import {
  selectCatalogError,
  selectCatalogStatus,
  selectCategoryFilter,
} from '@/lib/store/selectors/cartSelectors'
import { loadProductCatalog } from '@/lib/store/slices/cartSlice'
import { useCartPersistence } from '@/hooks/useCartPersistence'
import { useCatalogLoader } from '@/hooks/useCatalogLoader'
import { CatalogToolbar } from '@/components/catalog/CatalogToolbar'
import { AdvancedProductGrid } from '@/components/catalog/AdvancedProductGrid'
import { CatalogSkeleton } from '@/components/catalog/CatalogSkeleton'
import { CatalogError } from '@/components/catalog/CatalogError'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { FloatingCartButton } from '@/components/cart/FloatingCartButton'

const CATEGORY_LABELS: Record<string, string> = {
  all: 'All Products',
  electronics: 'Electronics',
  books: 'Books',
  home: 'Home',
  fashion: 'Fashion',
}

const TIPS = [
  { icon: SlidersHorizontal, text: 'Price range filter' },
  { icon: Filter, text: 'Rating & stock filters' },
  { icon: Layers, text: 'Grid or list view' },
]

export function AdvancedCatalogPage() {
  const dispatch = useAppDispatch()
  const catalogStatus = useAppSelector(selectCatalogStatus)
  const catalogError = useAppSelector(selectCatalogError)
  const categoryFilter = useAppSelector(selectCategoryFilter)
  const [cartOpen, setCartOpen] = useState(false)

  useCartPersistence()
  useCatalogLoader()

  const openCart = () => setCartOpen(true)

  return (
    <>
      <main className="mx-auto max-w-7xl flex-1 px-4 py-8 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <h2 className="bg-linear-to-r from-teal-600 via-teal-500 to-cyan-500 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
            {CATEGORY_LABELS[categoryFilter] ?? 'Catalog'}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Browse with filters, switch grid or list view, and open your cart anytime.
          </p>
        </motion.div>

        {catalogStatus === 'loading' && (
          <div className="glass-card p-6">
            <CatalogSkeleton />
          </div>
        )}

        {catalogStatus === 'failed' && catalogError && (
          <CatalogError message={catalogError} onRetry={() => dispatch(loadProductCatalog())} />
        )}

        {catalogStatus === 'succeeded' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.35 }}
            className="grid gap-6 lg:grid-cols-[272px_minmax(0,1fr)]"
          >
            <section
              className="glass-card p-5 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:self-start"
              aria-label="Filters"
            >
              <CatalogToolbar />
            </section>

            <section className="glass-card p-5 sm:p-6" aria-label="Filtered products">
              <AdvancedProductGrid onBuyNow={openCart} />
            </section>
          </motion.div>
        )}

        <div className="mx-auto mt-6 flex max-w-lg flex-wrap justify-center gap-4">
          {TIPS.map(({ icon: Icon, text }) => (
            <span key={text} className="flex items-center gap-1.5 text-xs text-slate-400">
              <Icon className="h-3.5 w-3.5 text-teal-400" />
              {text}
            </span>
          ))}
        </div>
      </main>

      <FloatingCartButton onClick={openCart} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}
