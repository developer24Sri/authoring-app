import TopBar from './components/TopBar/TopBar'
import TreePanel from './components/TreePanel/TreePanel'
import Editor from './components/Editor/Editor'

function App() {
  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <TreePanel />
        <Editor />
      </div>
    </div>
  )
}

export default App