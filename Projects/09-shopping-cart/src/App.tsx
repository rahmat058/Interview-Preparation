import { Routes, Route } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ShopApp } from '@/components/page/ShopApp'
import { AdvancedCatalogPage } from '@/components/page/AdvancedCatalogPage'
import { ProductDetailPage } from '@/components/page/ProductDetailPage'

export function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<ShopApp />} />
        <Route path="/catalog" element={<AdvancedCatalogPage />} />
        <Route path="/products/:productId" element={<ProductDetailPage />} />
      </Routes>
      <Footer />
    </>
  )
}
