import { useState, useRef, useEffect } from 'react'
import { Editor } from '@tiptap/react'

interface WidgetInserterProps {
  editor: Editor
}

type WidgetType = 'image' | 'video' | null

const WidgetInserter = ({ editor }: WidgetInserterProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeWidget, setActiveWidget] = useState<WidgetType>(null)
  const [urlInput, setUrlInput] = useState('')
  const menuRef = useRef<HTMLDivElement>(null)

  //  Fix 1 — declare close BEFORE useEffect that uses it
  const close = () => {
    setIsOpen(false)
    setActiveWidget(null)
    setUrlInput('')
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        close()
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const handleInsertImage = () => {
    if (!urlInput.trim()) return
    editor.chain().focus().setImage({ src: urlInput.trim() }).run()
    close()
  }

  const handleInsertVideo = () => {
    if (!urlInput.trim()) return
    editor.chain().focus().insertContent(
      `<p><a href="${urlInput.trim()}" target="_blank"
        class="inline-flex items-center gap-2 px-3 py-2 bg-gray-100
        rounded-lg text-sm text-blue-600 hover:bg-gray-200">
        🎬 Video: ${urlInput.trim()}
      </a></p>`
    ).run()
    close()
  }

  const widgets = [
    { type: 'image' as const, icon: '🖼️', label: 'Image' },
    { type: 'video' as const, icon: '🎬', label: 'Video' },
  ]

  return (
    <div className="relative" ref={menuRef}>
      {/* + button */}
      <button
        onClick={() => setIsOpen(p => !p)}
        className={`
          w-7 h-7 rounded-full border-2 flex items-center justify-center
          text-gray-400 transition-all duration-150
          ${isOpen
            ? 'border-blue-400 text-blue-500 rotate-45 bg-blue-50'
            : 'border-gray-300 hover:border-blue-400 hover:text-blue-500'}
        `}
        title="Insert widget"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* Popup menu */}
      {isOpen && (
        <div className="absolute left-10 top-0 z-20 bg-white border border-gray-200 rounded-xl shadow-xl p-3 w-56">
          {activeWidget === null ? (
            <>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-2 px-1">
                Insert
              </p>
              <div className="flex flex-col gap-1">
                {widgets.map(w => (
                  <button
                    key={w.type}
                    onClick={() => setActiveWidget(w.type)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-sm text-gray-700 text-left transition-colors"
                  >
                    <span className="text-lg">{w.icon}</span>
                    <span>{w.label}</span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-3">
                <button
                  onClick={() => { setActiveWidget(null); setUrlInput('') }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                  {activeWidget === 'image' ? '🖼️ Image URL' : '🎬 Video URL'}
                </p>
              </div>
              <input
                autoFocus
                type="url"
                value={urlInput}
                onChange={e => setUrlInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    //  Fix 2 — wrap in block so TS treats as statement not expression
                    if (activeWidget === 'image') {
                      handleInsertImage()
                    } else {
                      handleInsertVideo()
                    }
                  }
                  if (e.key === 'Escape') close()
                }}
                placeholder={activeWidget === 'image' ? 'https://...' : 'https://youtube.com/...'}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 mb-2"
              />
              <button
                // Fix 2.1 — explicit arrow function instead of ternary expression
                onClick={() => {
                  if (activeWidget === 'image') {
                    handleInsertImage()
                  } else {
                    handleInsertVideo()
                  }
                }}
                disabled={!urlInput.trim()}
                className="w-full py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Insert
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default WidgetInserter