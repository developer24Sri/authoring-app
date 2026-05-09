import type { NodeType } from '../../types'

interface TreeNodeViewProps {
  id: string
  label: string
  nodeType: NodeType
  depth: number
  isActive: boolean
  isExpanded: boolean
  isHovered: boolean
  isRenaming: boolean
  isRoot: boolean
  labelInput: string
  onSelect: () => void
  onToggleExpand: (e: React.MouseEvent) => void
  onAddNode: (type: NodeType, e: React.MouseEvent) => void
  onRemove: (e: React.MouseEvent) => void
  onHoverEnter: () => void
  onHoverLeave: () => void
  onDoubleClickLabel: (e: React.MouseEvent) => void
  onLabelChange: (val: string) => void
  onRenameBlur: () => void
  onRenameKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
  renameRef: React.RefObject<HTMLInputElement | null>
  children?: React.ReactNode
}

const TreeNodeView = ({
  label, nodeType, depth, isActive, isExpanded,
  isHovered, isRenaming, isRoot, labelInput,
  onSelect, onToggleExpand, onAddNode, onRemove,
  onHoverEnter, onHoverLeave, onDoubleClickLabel,
  onLabelChange, onRenameBlur, onRenameKeyDown,
  renameRef, children
}: TreeNodeViewProps) => {
  const isContainer = nodeType === 'container'

  return (
    <div className="select-none">
      <div
        className={`
          group flex items-center gap-1 px-2 py-1.5 rounded-md cursor-pointer
          transition-colors duration-100 relative
          ${isActive
            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
            : 'hover:bg-gray-100 text-gray-700 dark:hover:bg-gray-700 dark:text-gray-300'}
        `}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={onSelect}
        onMouseEnter={onHoverEnter}
        onMouseLeave={onHoverLeave}
      >
        {/* Expand / Collapse */}
        {isContainer ? (
          <button
            onClick={onToggleExpand}
            className="w-4 h-4 flex items-center justify-center text-gray-400 hover:text-gray-600 shrink-0"
          >
            <svg
              className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
              fill="currentColor" viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M7.293 4.707a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L10.586 10 7.293 6.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        ) : (
          <span className="w-4 shrink-0" />
        )}

        {/* Icon */}
        <span className="text-sm shrink-0">
          {isContainer ? '📁' : '📄'}
        </span>

        {/* Label or rename input */}
        {isRenaming ? (
          <input
            ref={renameRef}
            value={labelInput}
            onChange={e => onLabelChange(e.target.value)}
            onBlur={onRenameBlur}
            onKeyDown={onRenameKeyDown}
            onClick={e => e.stopPropagation()}
            className="flex-1 text-sm bg-white border border-blue-400 rounded px-1 outline-none min-w-0 dark:bg-gray-800"
          />
        ) : (
          <span
            className="flex-1 text-sm truncate"
            onDoubleClick={onDoubleClickLabel}
          >
            {label}
          </span>
        )}

        {/* Hover actions */}
        {isHovered && !isRenaming && (
          <div className="flex items-center gap-0.5 ml-auto shrink-0">
            {isContainer && (
              <>
                <button
                  title="Add section"
                  onClick={e => onAddNode('container', e)}
                  className="p-1 rounded hover:bg-blue-100 text-gray-400 hover:text-blue-600"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
                <button
                  title="Add item"
                  onClick={e => onAddNode('leaf', e)}
                  className="p-1 rounded hover:bg-green-100 text-gray-400 hover:text-green-600"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </button>
              </>
            )}
            {!isRoot && (
              <button
                title="Delete"
                onClick={onRemove}
                className="p-1 rounded hover:bg-red-100 text-gray-400 hover:text-red-500"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Children — passed in from container */}
      {isContainer && isExpanded && children}
    </div>
  )
}

export default TreeNodeView