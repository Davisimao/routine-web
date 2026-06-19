import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from '@/app/App'
import { RotinasProvider } from '@/features/rotinas/context/RotinasProvider'
import './index.css'

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Elemento #root não encontrado')
}

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <RotinasProvider>
        <App />
      </RotinasProvider>
    </BrowserRouter>
  </StrictMode>
)
