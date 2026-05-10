import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { TreeProvider } from './context/TreeContext.tsx'
import { ActiveNodeProvider } from './context/ActiveNoteProvider.tsx'
import "./styles/global.css"
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TreeProvider>
      <ActiveNodeProvider>
        <App />
      </ActiveNodeProvider>
    </TreeProvider>
  </StrictMode>,
)
