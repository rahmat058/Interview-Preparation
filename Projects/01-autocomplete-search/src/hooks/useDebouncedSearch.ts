import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  DEBOUNCE_MS,
  fetchSearchResults,
  setDebouncedQuery,
} from "@/lib/store/slices/searchSlice";
import { debounce } from "@/lib/utils/helpers";

export function useDebouncedSearch() {
  const dispatch = useAppDispatch();
  const query = useAppSelector((state) => state.search.query);
  const debouncedQuery = useAppSelector((state) => state.search.debouncedQuery);
  const entityTypeFilter = useAppSelector(
    (state) => state.search.entityTypeFilter,
  );

  useEffect(() => {
    const debouncedDispatch = debounce((value: string) => {
      dispatch(setDebouncedQuery(value));
    }, DEBOUNCE_MS);

    debouncedDispatch(query);

    return () => debouncedDispatch.cancel();
  }, [dispatch, query]);

  useEffect(() => {
    const promise = dispatch(fetchSearchResults(debouncedQuery));
    return () => {
      promise.abort();
    };
  }, [dispatch, debouncedQuery, entityTypeFilter]);
}
