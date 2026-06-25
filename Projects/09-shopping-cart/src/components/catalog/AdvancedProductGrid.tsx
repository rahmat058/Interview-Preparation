import { useAppSelector } from '@/lib/store/hooks'
import {
  selectAdvancedFilteredProducts,
  selectAdvancedFilters,
} from '@/lib/store/selectors/cartSelectors'
import { CatalogResultsBar } from '@/components/catalog/CatalogResultsBar'
import { ProductCard } from '@/components/catalog/ProductCard'
import { cn } from '@/lib/utils/cn'

interface AdvancedProductGridProps {
  onBuyNow?: () => void
}

export function AdvancedProductGrid({ onBuyNow }: AdvancedProductGridProps) {
  const products = useAppSelector(selectAdvancedFilteredProducts)
  const { viewMode } = useAppSelector(selectAdvancedFilters)
  const isList = viewMode === 'list'

  if (products.length === 0) {
    return (
      <>
        <CatalogResultsBar />
        <p className="py-16 text-center text-sm text-slate-400">
          No products match your filters. Try adjusting price range or category.
        </p>
      </>
    )
  }

  return (
    <div>
      <CatalogResultsBar />

      <div
        className={cn(
          isList ? 'flex flex-col gap-3' : 'grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4',
        )}
      >
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            index={index}
            layout={isList ? 'catalog-list' : 'catalog-grid'}
            onBuyNow={onBuyNow}
          />
        ))}
      </div>
    </div>
  )
}
