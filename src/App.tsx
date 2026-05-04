import TreePanel from './components/TreePanel/TreePanel'
import Editor from './components/Editor/Editor'

function App() {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <TreePanel />
      <Editor />
    </div>
  )
}

export default App