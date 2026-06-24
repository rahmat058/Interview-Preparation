import { useAppSelector } from '@/lib/store/hooks'
import { selectSortedFilteredProducts } from '@/lib/store/selectors/cartSelectors'
import { ProductCard } from '@/components/catalog/ProductCard'

export function ProductGrid() {
  const products = useAppSelector(selectSortedFilteredProducts)

  if (products.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-slate-400">No products in this category.</p>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  )
}
