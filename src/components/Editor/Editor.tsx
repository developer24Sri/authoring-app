import { useEffect, useMemo } from 'react'
import { useEditor, EditorContext } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { Placeholder } from '@tiptap/extensions'
import Link from '@tiptap/extension-link'
import Highlight from '@tiptap/extension-highlight'
import { useTree } from '../../context/TreeContext'
import { useActiveNode } from '../../context/ActiveNodeContext'
import { getAncestors } from '../../utils/treeHelpers'
import useDebounce from '../../hooks/useDebounce'
// import EditorView from './EditorView'
// import CommentTooltip from './CommentTooltip'
import EditorView from '../TreePanel/EditorView'
import CommentTooltip from './CommentToolTip'
import { EDITOR_CONFIG } from '../../constants'

const Editor = () => {
  const { state, dispatch } = useTree()
  const { activeNodeId, setActiveNodeId } = useActiveNode()
  const activeNode = activeNodeId ? state.nodes[activeNodeId] : null
  const breadcrumbs = activeNodeId
    ? getAncestors(state.nodes, activeNodeId)
    : []

  const { debounced: debouncedDispatch, cancel: cancelDebounce } = useDebounce(
    (id: string, html: string) => {
      dispatch({
        type: 'UPDATE_CONTENT',
        payload: { id, content: { type: 'text', data: html } }
      })
    },
    EDITOR_CONFIG.DEBOUNCE_MS
  )

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Image.configure({ inline: false, allowBase64: true }),
      Placeholder.configure({
        placeholder: EDITOR_CONFIG.PLACEHOLDER_TEXT,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 underline cursor-pointer hover:text-blue-700',
        },
      }),
      Highlight.configure({ multicolor: true }),
    ],
    content: activeNode?.content.data ?? '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl max-w-none outline-none min-h-full px-12 py-10',
      },
    },
    onUpdate: ({ editor }) => {
      if (!activeNodeId) return
      debouncedDispatch(activeNodeId, editor.getHTML())
    },
  })

  const providerValue = useMemo(() => ({ editor }), [editor])

  useEffect(() => {
    if (!editor || !activeNode) return
    cancelDebounce()
    const currentHTML = editor.getHTML()
    const newHTML = activeNode.content.data ?? ''
    if (currentHTML !== newHTML) {
      editor.commands.setContent(newHTML, { emitUpdate: false })
    }
  }, [activeNodeId]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!activeNode) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50 dark:bg-gray-900">
        <div className="text-5xl mb-4">✍️</div>
        <p className="text-base font-medium text-gray-500">Nothing selected</p>
        <p className="text-sm mt-1">Click a node in the tree to start editing</p>
      </div>
    )
  }

  return (
    <EditorContext.Provider value={providerValue}>
      <EditorView
        activeNode={activeNode}
        editor={editor}
        breadcrumbs={breadcrumbs}
        onBreadcrumbClick={setActiveNodeId}
      />
      <CommentTooltip />
    </EditorContext.Provider>
  )
}

export default Editor