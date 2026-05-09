import { useEffect, useRef, useState } from 'react'
import { useCurrentEditor } from '@tiptap/react'
import { TrashCanIcon } from '../SVG/useSVG'
import { useActiveNode } from '../../context/ActiveNodeContext'

interface Comment {
    id: string
    text: string
    selectedText: string
    from: number
    to: number
    createdAt: string
}

interface TooltipState {
    comment: Comment
    x: number
    y: number
}

const CommentTooltip = () => {
    // const { state } = useTree()
    const {activeNodeId} = useActiveNode();
    const { editor } = useCurrentEditor()
    const [tooltip, setTooltip] = useState<TooltipState | null>(null)
    const tooltipRef = useRef<HTMLDivElement>(null)
    const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

    const getComments = (): Comment[] => {
        if (!activeNodeId) return []
        return JSON.parse(
            localStorage.getItem(`comments-${activeNodeId}`) ?? '[]'
        )
    }

    const formatDate = (iso: string) =>
        new Date(iso).toLocaleString(undefined, {
            month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        })

    const deleteComment = (id: string) => {
        if (!activeNodeId) return
        const updated = getComments().filter(c => c.id !== id)
        localStorage.setItem(
            `comments-${activeNodeId}`,
            JSON.stringify(updated)
        )
        setTooltip(null)
        window.dispatchEvent(new Event('storage'))
    }

    const showTooltip = (comment: Comment, x: number, y: number) => {
        if (hideTimer.current) clearTimeout(hideTimer.current)
        setTooltip({ comment, x, y })
    }

    const scheduleHide = () => {
        hideTimer.current = setTimeout(() => setTooltip(null), 200)
    }

    const cancelHide = () => {
        if (hideTimer.current) clearTimeout(hideTimer.current)
    }

    useEffect(() => {

        // Use editor.view.dom instead of document.querySelector('.tiptap')
        if (!editor || editor.isDestroyed || !editor.view) return
        const editorDom = editor.view.dom

        const handleMouseOver = (e: Event) => {
            const target = e.target as HTMLElement

            // Updated the editor API to check node type at cursor position
            // rather than checking DOM class names
            const mark = target.closest('mark')
            if (!mark) return

            const comments = getComments()
            if (comments.length === 0) return

            const markText = mark.textContent ?? ''
            const matched = comments.find(c =>
                c.selectedText === markText ||
                markText.includes(c.selectedText) ||
                c.selectedText.includes(markText)
            )
            if (!matched) return

            const rect = mark.getBoundingClientRect()
            showTooltip(matched, rect.left + rect.width / 2, rect.top - 8)
        }

        const handleMouseOut = (e: Event) => {
            const target = e.target as HTMLElement
            if (target.closest('mark')) scheduleHide()
        }

        editorDom.addEventListener('mouseover', handleMouseOver)
        editorDom.addEventListener('mouseout', handleMouseOut)

        return () => {
            setTooltip(null)
            editor.view?.dom?.removeEventListener('mouseover', handleMouseOver)
            editor.view?.dom?.removeEventListener('mouseout', handleMouseOut)
        }
    }, [activeNodeId, editor])

    if (!tooltip) return null

    return (
        <div
            ref={tooltipRef}
            onMouseEnter={cancelHide}
            onMouseLeave={scheduleHide}
            style={{
                position: 'fixed',
                left: tooltip.x,
                top: tooltip.y,
                transform: 'translate(-50%, -100%)',
                zIndex: 9999,
            }}
            className="bg-gray-900 text-white rounded-xl shadow-2xl p-3 w-64 pointer-events-auto"
        >
            {/* Arrow */}
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-3 h-3 bg-gray-900 rotate-45 rounded-sm" />

            {/* Quoted text */}
            <div className="flex gap-1.5 mb-2">
                <div className="w-0.5 bg-yellow-400 rounded flex-shrink-0" />
                <p className="text-xs text-gray-400 italic truncate">
                    "{tooltip.comment.selectedText}"
                </p>
            </div>

            {/* Comment text */}
            <p className="text-sm text-white leading-relaxed mb-2">
                {tooltip.comment.text}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-700">
                <span className="text-xs text-gray-500">
                    {formatDate(tooltip.comment.createdAt)}
                </span>
                <button
                    onClick={() => deleteComment(tooltip.comment.id)}
                    className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors"
                >
                    <TrashCanIcon />
                    Delete
                </button>
            </div>
        </div>
    )
}

export default CommentTooltip