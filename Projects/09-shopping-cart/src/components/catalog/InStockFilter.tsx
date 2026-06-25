import { Truck } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { setFreeDeliveryOnly, setInStockOnly } from '@/lib/store/slices/cartSlice'
import { selectAdvancedFilters } from '@/lib/store/selectors/cartSelectors'
import { FilterCheckbox } from '@/components/ui/FilterCheckbox'

export function InStockFilter() {
  const dispatch = useAppDispatch()
  const { inStockOnly, freeDeliveryOnly } = useAppSelector(selectAdvancedFilters)

  return (
    <div className="space-y-2">
      <FilterCheckbox
        id="filter-in-stock"
        label="In stock only"
        description="Hide sold-out items"
        checked={inStockOnly}
        onChange={(checked) => dispatch(setInStockOnly(checked))}
      />
      <FilterCheckbox
        id="filter-free-delivery"
        label="Free delivery"
        description="Orders $50 and above"
        icon={Truck}
        checked={freeDeliveryOnly}
        onChange={(checked) => dispatch(setFreeDeliveryOnly(checked))}
      />
    </div>
  )
}
