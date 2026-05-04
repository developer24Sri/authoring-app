import { useEffect, useRef, useState } from 'react'
import { useTree } from '../../context/TreeContext'
import { TrashCanIcon } from '../SVG/useSVG'

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
    const { state } = useTree()
    const activeNodeId = state.activeNodeId
    const [tooltip, setTooltip] = useState<TooltipState | null>(null)
    const tooltipRef = useRef<HTMLDivElement>(null)
    const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

    const getComments = (): Comment[] => {
        if (!activeNodeId) return []
        return JSON.parse(localStorage.getItem(`comments-${activeNodeId}`) ?? '[]')
    }

    const formatDate = (iso: string) =>
        new Date(iso).toLocaleString(undefined, {
            month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        })

    const deleteComment = (id: string) => {
        if (!activeNodeId) return
        const updated = getComments().filter(c => c.id !== id)
        localStorage.setItem(`comments-${activeNodeId}`, JSON.stringify(updated))

        // Remove yellow highlight from all marks — simplest approach
        setTooltip(null)

        // Force re-render by dispatching a storage event
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
        const editorEl = document.querySelector('.tiptap')
        if (!editorEl) return

        const handleMouseOver = (e: Event) => {
            const target = e.target as HTMLElement
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

        editorEl.addEventListener('mouseover', handleMouseOver)
        editorEl.addEventListener('mouseout', handleMouseOut)

        
        return () => {
            // 1. Remove listeners to prevent memory leaks
            editorEl.removeEventListener('mouseover', handleMouseOver)
            editorEl.removeEventListener('mouseout', handleMouseOut)

            // 2. Clear tooltip and timers when switching nodes or unmounting
            setTooltip(null)
            if (hideTimer.current) clearTimeout(hideTimer.current)
        }
    }, [activeNodeId]) // Only re-runs when switching nodes

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
            <div
                className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-3 h-3 bg-gray-900 rotate-45 rounded-sm"
            />

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
                    <TrashCanIcon width={20} height={20} />
                    Delete
                </button>
            </div>
        </div>
    )
}

export default CommentTooltip