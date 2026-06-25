import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Minus, Plus, Star } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  addItem,
  decrementQuantity,
  incrementQuantity,
} from "@/lib/store/slices/cartSlice";
import {
  selectCatalogStatus,
  selectProductById,
  selectVariantQuantity,
} from "@/lib/store/selectors/cartSelectors";
import { useCatalogLoader } from "@/hooks/useCatalogLoader";
import {
  getCartLineKey,
  getDefaultVariantId,
  getProductDisplayEmoji,
  getProductStock,
  type Product,
} from "@/lib/types/cart";
import { formatCurrency } from "@/lib/utils/cartPricing";
import { ColorVariantPicker } from "@/components/catalog/ColorVariantPicker";
import { CatalogSkeleton } from "@/components/catalog/CatalogSkeleton";
import { Button } from "@/components/ui/Button";

export function ProductDetailPage() {
  const { productId = "" } = useParams();
  const catalogStatus = useAppSelector(selectCatalogStatus);
  const product = useAppSelector(selectProductById(productId));

  useCatalogLoader();

  if (catalogStatus === "loading" || catalogStatus === "idle") {
    return (
      <main className="mx-auto max-w-4xl flex-1 px-4 py-10 sm:px-6">
        <div className="glass-card p-6">
          <CatalogSkeleton />
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="mx-auto max-w-4xl flex-1 px-4 py-10 text-center sm:px-6">
        <p className="text-slate-500">Product not found.</p>
        <Link
          to="/catalog"
          className="mt-4 inline-block text-sm font-medium text-teal-600 hover:underline"
        >
          Back to catalog
        </Link>
      </main>
    );
  }

  return <ProductDetailView key={productId} product={product} />;
}

function ProductDetailView({ product }: { product: Product }) {
  const dispatch = useAppDispatch();
  const [selectedVariantId, setSelectedVariantId] = useState(
    () => getDefaultVariantId(product) ?? undefined,
  );

  const activeVariantId = selectedVariantId ?? getDefaultVariantId(product);
  const quantity = useAppSelector(
    selectVariantQuantity(product.id, activeVariantId),
  );
  const stock = getProductStock(product, activeVariantId);
  const lineKey = getCartLineKey(product.id, activeVariantId);
  const atMax = quantity >= stock;
  const displayEmoji = getProductDisplayEmoji(product, activeVariantId);
  const selectedVariant = product.variants?.find(
    (variant) => variant.id === activeVariantId,
  );

  return (
    <main className="mx-auto max-w-4xl flex-1 px-4 py-10 sm:px-6">
      <Link
        to="/catalog"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-teal-600 hover:text-teal-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to catalog
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card overflow-hidden"
      >
        <div className="grid gap-8 p-6 sm:grid-cols-2 sm:p-8">
          <div className="flex aspect-square items-center justify-center rounded-2xl bg-linear-to-br from-teal-50 to-cyan-50 text-8xl">
            {displayEmoji}
          </div>

          <div className="flex flex-col">
            <span className="text-xs font-medium uppercase tracking-wide text-teal-600">
              {product.category}
            </span>
            <h1 className="mt-1 text-2xl font-bold text-slate-800 sm:text-3xl">
              {product.name}
            </h1>

            <div className="mt-2 flex items-center gap-2 text-sm text-amber-500">
              <Star className="h-4 w-4 fill-current" />
              <span className="font-semibold">{product.rating}</span>
              <span className="text-slate-400">
                ·{" "}
                {selectedVariant
                  ? `${selectedVariant.stock} in this color`
                  : `${product.stock} in stock`}
              </span>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              {product.description}
            </p>

            <p className="mt-6 text-3xl font-bold text-teal-700">
              {formatCurrency(product.price)}
            </p>

            {product.variants &&
              product.variants.length > 0 &&
              activeVariantId && (
                <div className="mt-6">
                  <ColorVariantPicker
                    variants={product.variants}
                    selectedId={activeVariantId}
                    onChange={setSelectedVariantId}
                  />
                </div>
              )}

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {quantity > 0 ? (
                <div className="flex items-center rounded-xl border border-teal-200 bg-white">
                  <button
                    type="button"
                    onClick={() => dispatch(decrementQuantity(lineKey))}
                    className="rounded-l-xl px-3 py-2 text-teal-700 hover:bg-teal-50"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="min-w-10 border-x border-teal-100 px-3 py-2 text-center text-sm font-semibold tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => dispatch(incrementQuantity(lineKey))}
                    disabled={atMax}
                    className="rounded-r-xl px-3 py-2 text-teal-700 hover:bg-teal-50 disabled:opacity-40"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <Button
                  size="lg"
                  disabled={stock < 1}
                  onClick={() =>
                    dispatch(
                      addItem({
                        productId: product.id,
                        variantId: activeVariantId,
                      }),
                    )
                  }
                >
                  Add to cart
                </Button>
              )}

              {quantity > 0 && (
                <span className="text-sm font-medium text-teal-700">
                  {quantity} in cart ·{" "}
                  {formatCurrency(product.price * quantity)}
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
