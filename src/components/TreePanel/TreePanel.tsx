import { useState } from 'react'
import { useTree } from '../../context/TreeContext'
import TreeNode from './TreeNode'
import HamburgerDrawer from './HamburgerDrawer'
import { HamburgerIcon } from '../SVG/useSVG'

type ViewMode = 'tree' | 'graph'

const TreePanel = () => {
  const { state, dispatch } = useTree()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('tree')

  const handleAddRoot = (type: 'container' | 'leaf') => {
    dispatch({ type: 'ADD_NODE', payload: { parentId: state.rootId, nodeType: type } })
  }

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200 w-72 flex-shrink-0">

      {/* Top bar of panel */}
      <div className="flex items-center gap-2 px-3 py-3 border-b border-gray-100">
        {/* Hamburger */}
        <button
          onClick={() => setDrawerOpen(true)}
          className="p-1.5 rounded hover:bg-gray-100 text-gray-500"
          title="Menu"
        >
          <HamburgerIcon width={12} height={12} />
        </button>

        {/* Tree / Graph toggle */}
        <div className="flex items-center bg-gray-100 rounded-lg p-0.5 ml-auto">
          {(['tree', 'graph'] as ViewMode[]).map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`
                px-3 py-1 rounded-md text-xs font-medium capitalize transition-colors
                ${viewMode === mode
                  ? 'bg-white text-gray-800 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'}
              `}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Add container/leaf buttons */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100">
        <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">Add</span>
        <button
          onClick={() => handleAddRoot('container')}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Section
        </button>
        <button
          onClick={() => handleAddRoot('leaf')}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Item
        </button>
      </div>

      {/* Tree view or Graph placeholder */}
      <div className="flex-1 overflow-y-auto py-2 px-1">
        {viewMode === 'tree' ? (
          <TreeNode id={state.rootId} depth={0} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
            <svg className="w-12 h-12 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
            </svg>
            <span className="text-sm">Graph view</span>
            <span className="text-xs opacity-60">Coming soon</span>
          </div>
        )}
      </div>

      <HamburgerDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  )
}

export default TreePanel