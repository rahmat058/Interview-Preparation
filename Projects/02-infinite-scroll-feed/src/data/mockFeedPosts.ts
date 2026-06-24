import type { FeedPost } from '@/lib/types/feed'
import feedDataset from '@/data/feed-posts.json'

export interface FeedDatasetMeta {
  schemaVersion: string
  collection: string
  description: string
  count: number
  pageSize: number
  lastUpdated: string
}

export interface FeedDataset {
  meta: FeedDatasetMeta
  data: FeedPost[]
}

const dataset = feedDataset as FeedDataset

export const MOCK_FEED_POSTS: FeedPost[] = dataset.data
export const FEED_DATASET_META = dataset.meta
