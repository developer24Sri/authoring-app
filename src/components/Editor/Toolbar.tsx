import { useCurrentEditor, useEditorState } from '@tiptap/react'
import { BubbleMenu } from '@tiptap/react/menus'
import { useState } from 'react'
import { useTree } from '../../context/TreeContext'
import { CommentBoxIcon, LinkIcon } from '../SVG/useSVG'

const Toolbar = () => {
    const { editor } = useCurrentEditor()
    const { state } = useTree();
    const activeNodeId = state.activeNodeId;
    const [showLinkInput, setShowLinkInput] = useState(false)
    const [linkUrl, setLinkUrl] = useState('')

    const editorState = useEditorState({
        editor,
        selector: ({ editor: e }) => {
            if (!e) return {
                isBold: false, isItalic: false, isStrike: false,
                isCode: false, isH1: false, isH2: false, isH3: false,
                isBulletList: false, isOrderedList: false,
                isBlockquote: false, isLink: false,
            }
            return {
                isBold: e.isActive('bold'),
                isItalic: e.isActive('italic'),
                isStrike: e.isActive('strike'),
                isCode: e.isActive('code'),
                isH1: e.isActive('heading', { level: 1 }),
                isH2: e.isActive('heading', { level: 2 }),
                isH3: e.isActive('heading', { level: 3 }),
                isBulletList: e.isActive('bulletList'),
                isOrderedList: e.isActive('orderedList'),
                isBlockquote: e.isActive('blockquote'),
                isLink: e.isActive('link'),
            }
        },
    })

    if (!editor) return null

    const btn = (isActive: boolean) =>
        `px-2.5 py-1.5 text-sm rounded transition-colors hover:bg-gray-100 ${isActive ? 'bg-gray-200 text-gray-900 font-medium' : 'text-gray-600'
        }`

    const handleSetLink = () => {
        if (!linkUrl.trim()) return
        editor.chain().focus().setLink({ href: linkUrl.trim() }).run()
        setLinkUrl('')
        setShowLinkInput(false)
    }

    const handleRemoveLink = () => {
        editor.chain().focus().unsetLink().run()
        setShowLinkInput(false)
    }

    const handleCommentAdd = () => {
        const { from, to } = editor.state.selection
        if (from === to) return

        const selectedText = editor.state.doc.textBetween(from, to)
        const commentText = window.prompt(`Add comment for: "${selectedText}"`)
        if (!commentText?.trim()) return

        const key = `comments-${activeNodeId ?? 'unknown'}`
        const existing = JSON.parse(localStorage.getItem(key) ?? '[]')
        const newComment = {
            id: crypto.randomUUID(),
            text: commentText.trim(),
            selectedText,
            from,
            to,
            createdAt: new Date().toISOString(),
        }
        localStorage.setItem(key, JSON.stringify([...existing, newComment]))
        editor.chain().focus().setMark('highlight', { color: '#FEF08A' }).run()
        alert(`Comment saved: "${commentText}"`)
    }

    return (
        <BubbleMenu
            options={{ placement: 'top', offset: 6 }}
            className="flex items-center gap-0.5 bg-white border border-gray-200 rounded-lg shadow-lg px-1 py-1 z-50"
        >
            {/* Link input mode */}
            {showLinkInput ? (
                <div className="flex items-center gap-1 px-1">
                    <input
                        autoFocus
                        type="url"
                        value={linkUrl}
                        onChange={e => setLinkUrl(e.target.value)}
                        onKeyDown={e => {
                            if (e.key === 'Enter') handleSetLink()
                            if (e.key === 'Escape') {
                                setShowLinkInput(false)
                                setLinkUrl('')
                            }
                        }}
                        placeholder="https://..."
                        className="text-xs border border-gray-200 rounded px-2 py-1 w-44 outline-none focus:border-blue-400"
                    />
                    <button
                        onClick={handleSetLink}
                        className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Set
                    </button>
                    {editorState?.isLink && (
                        <button
                            onClick={handleRemoveLink}
                            className="text-xs px-2 py-1 bg-red-50 text-red-500 rounded hover:bg-red-100"
                        >
                            Remove
                        </button>
                    )}
                    <button
                        onClick={() => { setShowLinkInput(false); setLinkUrl('') }}
                        className="text-gray-400 hover:text-gray-600 px-1"
                    >
                        ✕
                    </button>
                </div>
            ) : (
                <>
                    {/* Normal toolbar */}
                    <button onClick={() => editor.chain().focus().toggleBold().run()}
                        className={btn(!!editorState?.isBold)}><strong>B</strong></button>

                    <button onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={btn(!!editorState?.isItalic)}><em>I</em></button>

                    <button onClick={() => editor.chain().focus().toggleStrike().run()}
                        className={btn(!!editorState?.isStrike)}>
                        <span className="line-through">S</span>
                    </button>

                    <button onClick={() => editor.chain().focus().toggleCode().run()}
                        className={`${btn(!!editorState?.isCode)} font-mono text-xs`}>
                        {'</>'}
                    </button>

                    <div className="w-px h-5 bg-gray-200 mx-1" />

                    {([1, 2, 3] as const).map(level => (
                        <button key={level}
                            onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
                            className={`${btn(!!editorState?.[`isH${level}` as 'isH1' | 'isH2' | 'isH3'])} text-xs`}>
                            H{level}
                        </button>
                    ))}

                    <div className="w-px h-5 bg-gray-200 mx-1" />

                    <button onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={btn(!!editorState?.isBulletList)} title="Bullet list">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                    </button>

                    <button onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        className={btn(!!editorState?.isOrderedList)} title="Ordered list">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h10M7 16h10M3 8h.01M3 12h.01M3 16h.01" />
                        </svg>
                    </button>

                    <div className="w-px h-5 bg-gray-200 mx-1" />

                    <button onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        className={btn(!!editorState?.isBlockquote)} title="Blockquote">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10.5h.01M12 10.5h.01M8 14.5h.01M12 14.5h.01M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </button>

                    <div className="w-px h-5 bg-gray-200 mx-1" />

                    {/* Link button */}
                    <button
                        onClick={() => {
                            // if already a link, prefill the current href
                            if (editorState?.isLink) {
                                const href = editor.getAttributes('link').href ?? ''
                                setLinkUrl(href)
                            }
                            setShowLinkInput(true)
                        }}
                        className={btn(!!editorState?.isLink)}
                        title="Add link"
                    >
                        <LinkIcon width={18} height={18} noFill />
                    </button>

                    {/* Comment button */}
                    <button
                        onClick={handleCommentAdd}
                        className={btn(false)}
                        title="Add comment"
                    >
                        <CommentBoxIcon width={18} height={18} />
                    </button>
                </>
            )}
        </BubbleMenu>
    )
}

export default Toolbar