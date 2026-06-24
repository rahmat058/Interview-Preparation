import type { EntityType } from '@/lib/types/search'

export function getEntitySubtitle(entityType: EntityType, metadata: unknown): string {
  if (entityType === 'product') {
    const m = metadata as { brand: string; price: number; currency: string }
    return `${m.brand} · $${m.price.toFixed(2)}`
  }
  if (entityType === 'city') {
    const m = metadata as { countryName: string; iataCode: string | null }
    return `${m.countryName}${m.iataCode ? ` · ${m.iataCode}` : ''}`
  }
  const m = metadata as { email: string; department: string }
  return `${m.department} · ${m.email}`
}
