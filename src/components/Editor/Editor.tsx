import { useEffect, useMemo } from 'react'
import { useEditor, EditorContent, EditorContext } from '@tiptap/react'  // add EditorContext
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { Placeholder } from '@tiptap/extensions'
import { useTree } from '../../context/TreeContext'
import Toolbar from './Toolbar'
import Link from '@tiptap/extension-link'
import HightLight from "@tiptap/extension-highlight"
import WidgetInserter from './WidgetInserter'
import CommentTooltip from './CommentToolTip'

const Editor = () => {
    const { state, dispatch } = useTree()
    const activeNode = state.activeNodeId
        ? state.nodes[state.activeNodeId]
        : null

    const editor = useEditor({
        extensions: [
            StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
            Image.configure({ inline: false, allowBase64: true }),
            Placeholder.configure({
                placeholder: 'Start writing, or press + to insert content…',
            }),
            Link.configure({
                openOnClick: false, // don't navigate while editing
                HTMLAttributes: {
                    class: 'text-blue-500 underline cursor-pointer hover:text-blue-700',
                },
            }),
            HightLight.configure({ multicolor: true })
        ],
        content: activeNode?.content.data ?? '',
        editorProps: {
            attributes: {
                class: 'prose prose-sm prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl max-w-none outline-none min-h-full px-12 py-10',
            },
        },
        onUpdate: ({ editor }) => {
            if (!state.activeNodeId) return
            dispatch({
                type: 'UPDATE_CONTENT',
                payload: {
                    id: state.activeNodeId,
                    content: { type: 'text', data: editor.getHTML() }
                }
            })
        },

    })

    // Memoize context value to avoid unnecessary re-renders
    const providerValue = useMemo(() => ({ editor }), [editor])

    useEffect(() => {
        if (!editor || !activeNode) return
        const currentHTML = editor.getHTML()
        const newHTML = activeNode.content.data ?? ''
        if (currentHTML !== newHTML) {
            //  v3 fix — pass options object instead of boolean
            editor.commands.setContent(newHTML, { emitUpdate: false })
        }
    }, [state.activeNodeId]) // eslint-disable-line react-hooks/exhaustive-deps

    if (!activeNode) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                <div className="text-5xl mb-4">✍️</div>
                <p className="text-base font-medium text-gray-500">Nothing selected</p>
                <p className="text-sm mt-1">Click a node in the tree to start editing</p>
            </div>
        )
    }

    return (
        <EditorContext.Provider value={providerValue}>
            <div className="flex-1 flex flex-col bg-white overflow-hidden">

                <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <span className="text-sm">
                            {activeNode.type === 'container' ? '📁' : '📄'}
                        </span>
                        <div>
                            <h2 className="text-sm font-semibold text-gray-800 leading-tight">
                                {activeNode.label}
                            </h2>
                            <p className="text-xs text-gray-400 capitalize">{activeNode.type}</p>
                        </div>
                    </div>
                </div>

                {editor && (
                    <div className="flex items-center gap-3 px-6 py-2 border-b border-gray-50 bg-gray-50/50">
                        <span className="text-xs text-gray-400 font-medium">Insert</span>
                        <WidgetInserter editor={editor} />
                    </div>
                )}

                <div className="flex-1 overflow-y-auto">
                    {editor && <Toolbar />}
                    <EditorContent editor={editor} className="h-full" />
                </div>
            </div>
            {/* Comment ToolTip */}
            <CommentTooltip />
        </EditorContext.Provider>
    )
}

export default Editor