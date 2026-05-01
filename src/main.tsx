import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { TreeProvider } from './context/TreeContext.tsx'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TreeProvider>
    <App />
    </TreeProvider>
  </StrictMode>,
)
