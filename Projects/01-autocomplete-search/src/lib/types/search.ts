export type EntityType = 'product' | 'city' | 'user'

export interface ProductMetadata {
  sku: string
  price: number
  currency: string
  stockQuantity: number
  brand: string
}

export interface CityMetadata {
  countryCode: string
  countryName: string
  region: string
  population: number
  timezone: string
  iataCode: string | null
}

export interface UserMetadata {
  email: string
  username: string
  role: 'admin' | 'editor' | 'viewer'
  department: string
  avatarUrl: string | null
}

export type SearchItemMetadata = ProductMetadata | CityMetadata | UserMetadata

/** Mirrors a `search_index` table row — ready for Postgres / Elasticsearch migration */
export interface SearchIndexItem {
  id: string
  entityType: EntityType
  title: string
  slug: string
  description: string
  category: string
  tags: string[]
  popularityScore: number
  isActive: boolean
  thumbnailUrl: string | null
  createdAt: string
  updatedAt: string
  metadata: SearchItemMetadata
}

export interface SearchQueryParams {
  q: string
  limit?: number
  offset?: number
  entityType?: EntityType | 'all'
}

export interface SearchResponseMeta {
  query: string
  total: number
  limit: number
  offset: number
  tookMs: number
  hasMore: boolean
}

export interface SearchResponse {
  data: SearchIndexItem[]
  meta: SearchResponseMeta
}

export type SearchStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

export interface SearchState {
  query: string
  debouncedQuery: string
  results: SearchIndexItem[]
  meta: SearchResponseMeta | null
  status: SearchStatus
  error: string | null
  isDropdownOpen: boolean
  highlightedIndex: number
  selectedItem: SearchIndexItem | null
  entityTypeFilter: EntityType | 'all'
}
