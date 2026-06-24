import type { SearchIndexItem } from "@/lib/types/search";
import searchIndexDataset from "@/data/search-index.json";

export interface SearchIndexDatasetMeta {
  schemaVersion: string;
  collection: string;
  description: string;
  count: number;
  breakdown: {
    product: number;
    city: number;
    user: number;
  };
  lastUpdated: string;
}

export interface SearchIndexDataset {
  meta: SearchIndexDatasetMeta;
  data: SearchIndexItem[];
}

const dataset = searchIndexDataset as SearchIndexDataset;

/** Mock `search_index` rows loaded from JSON — swap file or API in production */
export const MOCK_SEARCH_INDEX: SearchIndexItem[] = dataset.data;

export const SEARCH_INDEX_META = dataset.meta;
