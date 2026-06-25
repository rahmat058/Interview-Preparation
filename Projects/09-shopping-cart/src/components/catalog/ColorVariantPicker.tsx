import type { ProductVariant } from "@/lib/types/cart";
import { cn } from "@/lib/utils/cn";

interface ColorVariantPickerProps {
  variants: ProductVariant[];
  selectedId: string;
  onChange: (variantId: string) => void;
}

export function ColorVariantPicker({
  variants,
  selectedId,
  onChange,
}: ColorVariantPickerProps) {
  return (
    <div className="space-y-2">
      <span className="text-xs font-semibold text-slate-700">Color</span>
      <div className="flex flex-wrap gap-2">
        {variants.map((variant) => {
          const selected = variant.id === selectedId;
          const outOfStock = variant.stock < 1;

          return (
            <button
              key={variant.id}
              type="button"
              disabled={outOfStock}
              onClick={() => onChange(variant.id)}
              title={`${variant.color}${outOfStock ? " (out of stock)" : ""}`}
              className={cn(
                "group relative flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition-all",
                selected
                  ? "border-teal-500 bg-teal-50 text-teal-800 shadow-sm"
                  : "border-slate-200 bg-white/80 text-slate-600 hover:border-teal-300",
                outOfStock && "cursor-not-allowed opacity-40",
              )}
            >
              <span
                className={cn(
                  "h-4 w-4 rounded-full border shadow-inner",
                  selected ? "border-teal-400" : "border-slate-200",
                )}
                style={{ backgroundColor: variant.hex }}
              />
              {variant.color}
            </button>
          );
        })}
      </div>
    </div>
  );
}
