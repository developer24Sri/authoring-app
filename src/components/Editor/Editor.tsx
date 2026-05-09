import { useCallback, useEffect, useMemo } from 'react'
import useDebounce from '../../hooks/useDebounce'
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
import { getAncestors } from '../../utils/treeHelpers'
import { useActiveNode } from "../../context/ActiveNodeContext";


const Editor = () => {
    const { state, dispatch } = useTree()
    const { activeNodeId, setActiveNodeId } = useActiveNode();

    const activeNode = activeNodeId
        ? state.nodes[activeNodeId] //we removed the state.activeNodeId as now it has its own
        : null

    const debounceHandler = useCallback((id: string, html: string) => {
        dispatch({
            type: "UPDATE_CONTENT",
            payload: { id, content: { type: "text", data: html } }
        })
    }, [dispatch]);

    const { debounced: debouncedDispatch, cancel: cancelDebounce } = useDebounce(debounceHandler, 300);

    const ancestors = useMemo(() =>
        getAncestors(state.nodes, activeNode?.id || ""),
        [state.nodes, activeNode?.id])

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
            if (!activeNodeId) return
            debouncedDispatch(activeNodeId, editor.getHTML());
        },

    }, []);

    // Memoize context value to avoid unnecessary re-renders
    const providerValue = useMemo(() => ({ editor }), [editor])

    useEffect(() => {
        if (!editor || !activeNode) return
        cancelDebounce();
        const currentHTML = editor.getHTML()
        const newHTML = activeNode.content.data ?? ''
        if (currentHTML !== newHTML) {
            //  v3 fix — pass options object instead of boolean
            editor.commands.setContent(newHTML, { emitUpdate: false })
        }
    }, [activeNodeId]) // eslint-disable-line react-hooks/exhaustive-deps


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
                        {/* Breadcrumb */}
                        <div className="flex items-center gap-1 flex-wrap">
                            {ancestors.map((ancestor) => (
                                <div key={ancestor.id} className="flex items-center gap-1">
                                    <button
                                        onClick={() =>
                                            setActiveNodeId(ancestor.id)
                                        }
                                        className="text-xs text-gray-400 hover:text-blue-500 transition-colors hover:underline"
                                    >
                                        {ancestor.label}
                                    </button>
                                    <svg
                                        className="w-3 h-3 text-gray-300 shrink-0"
                                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            ))}
                            {/* Current active node — not clickable */}
                            <h2 className="text-sm font-semibold text-gray-800 leading-tight">
                                {activeNode.label}
                            </h2>
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