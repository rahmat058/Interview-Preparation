import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outPath = join(__dirname, '../src/data/products.json')

const products = [
  {
    id: 'prd_001',
    name: 'Sony WH-1000XM5 Headphones',
    category: 'electronics',
    price: 349.99,
    stock: 12,
    rating: 4.8,
    emoji: '🎧',
    description: 'Industry-leading noise cancellation with 30-hour battery.',
  },
  {
    id: 'prd_002',
    name: 'Mechanical Keyboard K2',
    category: 'electronics',
    price: 89.99,
    stock: 25,
    rating: 4.6,
    emoji: '⌨️',
    description: 'Compact wireless mechanical keyboard with hot-swappable switches.',
  },
  {
    id: 'prd_003',
    name: 'USB-C Hub 7-in-1',
    category: 'electronics',
    price: 49.99,
    stock: 40,
    rating: 4.4,
    emoji: '🔌',
    description: 'HDMI, SD card, and 100W PD pass-through for laptops.',
  },
  {
    id: 'prd_004',
    name: 'JavaScript: The Good Parts',
    category: 'books',
    price: 29.99,
    stock: 50,
    rating: 4.7,
    emoji: '📘',
    description: 'Classic Douglas Crockford guide — interview staple.',
  },
  {
    id: 'prd_005',
    name: 'Designing Data-Intensive Applications',
    category: 'books',
    price: 44.99,
    stock: 18,
    rating: 4.9,
    emoji: '📗',
    description: 'Deep dive into scalable systems — Martin Kleppmann.',
  },
  {
    id: 'prd_006',
    name: 'Ceramic Pour-Over Set',
    category: 'home',
    price: 34.5,
    stock: 30,
    rating: 4.5,
    emoji: '☕',
    description: 'Minimal dripper + carafe for slow mornings.',
  },
  {
    id: 'prd_007',
    name: 'Linen Throw Blanket',
    category: 'home',
    price: 59.0,
    stock: 15,
    rating: 4.3,
    emoji: '🛋️',
    description: 'Breathable stonewashed linen — sage green.',
  },
  {
    id: 'prd_008',
    name: 'Desk Plant — Monstera',
    category: 'home',
    price: 24.99,
    stock: 22,
    rating: 4.2,
    emoji: '🪴',
    description: 'Low-maintenance faux monstera for WFH setups.',
  },
  {
    id: 'prd_009',
    name: 'Merino Wool Tee',
    category: 'fashion',
    price: 68.0,
    stock: 20,
    rating: 4.6,
    emoji: '👕',
    description: 'Odor-resistant base layer — charcoal heather.',
  },
  {
    id: 'prd_010',
    name: 'Everyday Crossbody Bag',
    category: 'fashion',
    price: 79.99,
    stock: 14,
    rating: 4.4,
    emoji: '👜',
    description: 'Water-resistant nylon with padded laptop sleeve.',
  },
  {
    id: 'prd_011',
    name: 'Running Shoes — Glide 5',
    category: 'fashion',
    price: 119.99,
    stock: 10,
    rating: 4.7,
    emoji: '👟',
    description: 'Lightweight daily trainer with responsive foam.',
  },
  {
    id: 'prd_012',
    name: '4K Webcam Pro',
    category: 'electronics',
    price: 129.99,
    stock: 8,
    rating: 4.5,
    emoji: '📷',
    description: 'Auto-framing and dual noise-canceling mics.',
  },
]

const payload = {
  meta: {
    schemaVersion: '1.0.0',
    collection: 'products',
    totalProducts: products.length,
    categories: ['electronics', 'books', 'home', 'fashion'],
    currency: 'USD',
    generatedAt: new Date().toISOString(),
  },
  data: products,
}

mkdirSync(dirname(outPath), { recursive: true })
writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`)
console.log(`Wrote ${products.length} products → ${outPath}`)
