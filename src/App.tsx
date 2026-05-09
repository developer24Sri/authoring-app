import TopBar from './components/TopBar/TopBar'
import TreePanel from './components/TreePanel/TreePanel'
import { lazy, Suspense } from 'react'
import { useTheme } from './context/ThemeContext';

const Editor = lazy(() => import("./components/Editor/Editor"));

function App() {
  const {isDark, toggleTheme} = useTheme()
  return (
    <div className="flex flex-col h-screen bg-red-500 dark:bg-blue-500 overflow-hidden">
        {/* TEMP: visible test button */}
      <button
        onClick={toggleTheme}
        className="fixed bottom-4 right-4 z-50 px-4 py-2 rounded-lg
          bg-gray-200 dark:bg-gray-700
          text-gray-900 dark:text-white
          border border-gray-300 dark:border-gray-600"
      >
        {isDark ? '☀️ Light' : '🌙 Dark'}
      </button>
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