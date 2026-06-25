import { useAppSelector } from '@/lib/store/hooks'
import {
  selectAdvancedFilteredProducts,
  selectFilteredProducts,
} from '@/lib/store/selectors/cartSelectors'
import { CatalogViewToggle } from '@/components/catalog/CatalogViewToggle'

export function CatalogResultsBar() {
  const filtered = useAppSelector(selectAdvancedFilteredProducts)
  const categoryProducts = useAppSelector(selectFilteredProducts)

  return (
    <div className="mb-5 flex flex-col gap-3 border-b border-teal-100/80 pb-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-600">
        Showing{' '}
        <span className="font-semibold text-slate-800">{filtered.length}</span> of{' '}
        <span className="font-semibold text-slate-800">{categoryProducts.length}</span> products
      </p>

      <CatalogViewToggle />
    </div>
  )
}
