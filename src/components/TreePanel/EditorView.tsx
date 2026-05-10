import { Editor } from '@tiptap/react'
import { EditorContent } from '@tiptap/react'
import type { TreeNode } from '../../types'
import Toolbar from '../Editor/Toolbar'
import WidgetInserter from '../Editor/WidgetInserter'

interface EditorViewProps {
  activeNode: TreeNode
  editor: Editor | null
  breadcrumbs: TreeNode[]
  onBreadcrumbClick: (id: string) => void
}

const EditorView = ({
  activeNode,
  editor,
  breadcrumbs,
  onBreadcrumbClick
}: EditorViewProps) => {
  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">

      {/* Header with breadcrumb */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100">
        <div className="flex items-center gap-1 flex-wrap">
          {breadcrumbs.map(ancestor => (
            <div key={ancestor.id} className="flex items-center gap-1">
              <button
                onClick={() => onBreadcrumbClick(ancestor.id)}
                className="text-xs text-gray-400 hover:text-blue-500 transition-colors hover:underline"
              >
                {ancestor.label}
              </button>
              <svg className="w-3 h-3 text-gray-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          ))}
          <h2 className="text-sm font-semibold text-gray-800 leading-tight">
            {activeNode.label}
          </h2>
        </div>
      </div>

      {/* Widget inserter */}
      {editor && (
        <div className="flex items-center gap-3 px-6 py-2 border-b border-gray-50 bg-gray-50/50">
          <span className="text-xs text-gray-400 font-medium">Insert</span>
          <WidgetInserter editor={editor} />
        </div>
      )}

      {/* Editor content */}
      <div className="flex-1 overflow-y-auto">
        {editor && <Toolbar />}
        <EditorContent editor={editor} className="h-full" />
      </div>
    </div>
  )
}

export default EditorView