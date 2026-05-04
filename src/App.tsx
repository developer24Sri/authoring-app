import TopBar from './components/TopBar/TopBar'
import TreePanel from './components/TreePanel/TreePanel'
import { lazy, Suspense } from 'react'

const Editor = lazy(() => import("./components/Editor/Editor"));

function App() {
  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <TreePanel />
         <Suspense fallback={
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="text-3xl mb-2 animate-pulse">✍️</div>
              <p className="text-sm">Loading editor...</p>
            </div>
          </div>
        }>
          <Editor />
        </Suspense>
      </div>
    </div>
  )
}

export default App