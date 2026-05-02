import TreePanel from "./components/TreePanel/TreePanel"


function App() {


  return (
    <>
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        <TreePanel />

        <div className="flex-1 flex items-center justify-center text-gray-400">
          <div className="text-center">
            <div className="text-4xl mb-3">✍️</div>
            <p className="text-sm">Select a node to start editing</p>

          </div>
        </div>
      </div>
    </>
  )
}

export default App
