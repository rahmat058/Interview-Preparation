import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ModalHost } from '@/components/modal/ModalHost'
import { ModalApp } from '@/components/page/ModalApp'

export function App() {
  return (
    <>
      <Header />
      <ModalApp />
      <Footer />
      <ModalHost />
    </>
  )
}
