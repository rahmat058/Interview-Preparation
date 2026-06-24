import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ToastHost } from '@/components/toast/ToastHost'
import { ToastApp } from '@/components/page/ToastApp'

export function App() {
  return (
    <>
      <Header />
      <ToastApp />
      <Footer />
      <ToastHost />
    </>
  )
}
