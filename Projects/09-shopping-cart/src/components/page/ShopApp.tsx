import { motion } from "framer-motion";
import { Calculator, Package, ShoppingCart } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  selectCatalogError,
  selectCatalogStatus,
} from "@/lib/store/selectors/cartSelectors";
import { loadProductCatalog } from "@/lib/store/slices/cartSlice";
import { useCartPersistence } from "@/hooks/useCartPersistence";
import { useCatalogLoader } from "@/hooks/useCatalogLoader";
import { CategoryFilter } from "@/components/catalog/CategoryFilter";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { CatalogSkeleton } from "@/components/catalog/CatalogSkeleton";
import { CatalogError } from "@/components/catalog/CatalogError";
import { CartPanel } from "@/components/cart/CartPanel";

const TIPS = [
  { icon: ShoppingCart, text: "Normalized cart state" },
  { icon: Calculator, text: "Pure pricing pipeline" },
  { icon: Package, text: "Stock-aware quantities" },
];

export function ShopApp() {
  const dispatch = useAppDispatch();
  const catalogStatus = useAppSelector(selectCatalogStatus);
  const catalogError = useAppSelector(selectCatalogError);

  useCartPersistence();
  useCatalogLoader();

  return (
    <main className="mx-auto max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
        className="text-center"
      >
        <h2 className="bg-linear-to-r from-teal-600 via-teal-500 to-cyan-500 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
          Shopping Cart
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-slate-500 sm:text-base">
          Add items, update quantities, and watch subtotal, tax, shipping, and
          discounts recalculate via Redux selectors.
        </p>
      </motion.div>

      {catalogStatus === "loading" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8"
        >
          <div className="glass-card p-5 sm:p-6">
            <CatalogSkeleton />
          </div>
        </motion.div>
      )}

      {catalogStatus === "failed" && catalogError && (
        <div className="mt-8">
          <CatalogError
            message={catalogError}
            onRetry={() => dispatch(loadProductCatalog())}
          />
        </div>
      )}

      {catalogStatus === "succeeded" && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.45 }}
          className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.9fr)]"
        >
          <section
            className="glass-card p-5 sm:p-6"
            aria-label="Product catalog"
          >
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-sm font-semibold text-slate-800">Catalog</h3>
              <CategoryFilter variant="pills" />
            </div>
            <ProductGrid />
          </section>

          <CartPanel />
        </motion.div>
      )}

      <div className="mx-auto mt-4 flex max-w-lg flex-wrap justify-center gap-4">
        {TIPS.map(({ icon: Icon, text }) => (
          <span
            key={text}
            className="flex items-center gap-1.5 text-xs text-slate-400"
          >
            <Icon className="h-3.5 w-3.5 text-teal-400" />
            {text}
          </span>
        ))}
      </div>
    </main>
  );
}
