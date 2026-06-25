import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { StoreProvider } from '@/components/providers/StoreProvider'
import { App } from '@/App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoreProvider>
      <BrowserRouter>
        <div className="app-bg flex min-h-screen flex-col">
          <App />
        </div>
      </BrowserRouter>
    </StoreProvider>
  </StrictMode>,
)
