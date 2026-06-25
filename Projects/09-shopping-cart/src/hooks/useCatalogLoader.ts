import { useEffect } from "react";
import { useAppDispatch } from "@/lib/store/hooks";
import { loadProductCatalog } from "@/lib/store/slices/cartSlice";

export function useCatalogLoader() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const promise = dispatch(loadProductCatalog());
    return () => {
      promise.abort();
    };
  }, [dispatch]);
}
