import { RotateCcw } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { resetAdvancedFilters } from "@/lib/store/slices/cartSlice";
import {
  selectAdvancedFilterResultCount,
  selectAdvancedFilters,
} from "@/lib/store/selectors/cartSelectors";
import { CategoryFilter } from "@/components/catalog/CategoryFilter";
import { PriceRangeFilter } from "@/components/catalog/PriceRangeFilter";
import { SortSelect } from "@/components/catalog/SortSelect";
import { RatingFilter } from "@/components/catalog/RatingFilter";
import { InStockFilter } from "@/components/catalog/InStockFilter";
import { getSortLabel } from "@/lib/utils/productCatalog";
import { Button } from "@/components/ui/Button";

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-teal-100/80 pb-5">
      <h4 className="mb-3 text-sm font-semibold text-slate-800">{title}</h4>
      {children}
    </section>
  );
}

export function CatalogToolbar() {
  const dispatch = useAppDispatch();
  const resultCount = useAppSelector(selectAdvancedFilterResultCount);
  const { sortBy } = useAppSelector(selectAdvancedFilters);

  return (
    <aside className="space-y-5" aria-label="Catalog filters">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-800">Filters</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => dispatch(resetAdvancedFilters())}
          className="px-2! py-1! text-xs"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </Button>
      </div>

      <FilterSection title="Category">
        <CategoryFilter />
      </FilterSection>

      <FilterSection title="Price Range">
        <PriceRangeFilter />
      </FilterSection>

      <FilterSection title="Sort By">
        <p className="mb-2 text-xs text-slate-500">
          Current:{" "}
          <span className="font-medium text-teal-700">
            {getSortLabel(sortBy)}
          </span>
        </p>
        <SortSelect />
      </FilterSection>

      <FilterSection title="Rating">
        <RatingFilter />
      </FilterSection>

      <FilterSection title="Availability">
        <InStockFilter />
      </FilterSection>

      <p className="text-xs text-slate-500">
        <span className="font-semibold text-teal-700">{resultCount}</span>{" "}
        product
        {resultCount === 1 ? "" : "s"} · sorted by{" "}
        <span className="font-medium text-slate-600">
          {getSortLabel(sortBy)}
        </span>
      </p>
    </aside>
  );
}
