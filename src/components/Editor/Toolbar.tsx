import { useCurrentEditor, useEditorState } from '@tiptap/react'
import { BubbleMenu } from '@tiptap/react/menus'

// ✅ No props needed — editor comes from context
const Toolbar = () => {
  const { editor } = useCurrentEditor()

  const editorState = useEditorState({
  editor,
  selector: ({ editor: e }) => {
    if (!e) return {
      isBold: false,
      isItalic: false,
      isStrike: false,
      isCode: false,
      isH1: false,
      isH2: false,
      isH3: false,
      isBulletList: false,
      isOrderedList: false,
      isBlockquote: false,
    }
    return {
      isBold:        e.isActive('bold'),
      isItalic:      e.isActive('italic'),
      isStrike:      e.isActive('strike'),
      isCode:        e.isActive('code'),
      isH1:          e.isActive('heading', { level: 1 }),
      isH2:          e.isActive('heading', { level: 2 }),
      isH3:          e.isActive('heading', { level: 3 }),
      isBulletList:  e.isActive('bulletList'),
      isOrderedList: e.isActive('orderedList'),
      isBlockquote:  e.isActive('blockquote'),
    }
  },
})

  if (!editor) return null

  const btn = (isActive: boolean) =>
    `px-2.5 py-1.5 text-sm rounded transition-colors hover:bg-gray-100 ${
      isActive ? 'bg-gray-200 text-gray-900 font-medium' : 'text-gray-600'
    }`

  return (
    <BubbleMenu
      options={{ placement: 'top', offset: 6 }}
      className="flex items-center gap-0.5 bg-white border border-gray-200 rounded-lg shadow-lg px-1 py-1 z-50"
    >
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
          className={`${btn(!!editorState?.[`isH${level}` as 'isH1'|'isH2'|'isH3'])} text-xs`}>
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
    </BubbleMenu>
  )
}

export default Toolbar