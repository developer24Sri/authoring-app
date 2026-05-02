import React, { useEffect, useRef, useState } from "react";
import { useTree } from "../../context/TreeContext";
import type { NodeType } from "../../types";
import { DownArrowIcon } from "../SVG/useSVG";

interface TreeNodeProps {
    id: string,
    depth?: number
}

const TreeNode = ({ id, depth = 0 }: TreeNodeProps) => {
    const { state, dispatch } = useTree();
    const node = state.nodes[id];
    const isActive = state.activeNodeId === id;
    const [isExpanded, setIsExpanded] = useState(true);
    const [isHovered, setIsHovered] = useState(false);
    const [isRenaming, setIsRenaming] = useState(false);
    const [labelInput, setLabelInput] = useState(node.label);
    const renameRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isRenaming) renameRef.current?.focus();
    }, [isRenaming])

    if (!node) return null

    const isContainer = node.type === "container"

    const handleSelect = () => {
        dispatch({ type: "SET_ACTIVE", payload: { id } })
    }

    const commitRename = () => {
        const trimmed = labelInput.trim();
        if (trimmed) dispatch({ type: "RENAME_NODE", payload: { id, label: trimmed } })
        else setLabelInput(node.label);
        setIsRenaming(false);
    }

    const handleRename = () => {
        setIsRenaming(true);
    }

    const handleAddNode = (nodeType: NodeType, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isContainer) return
        dispatch({ type: "ADD_NODE", payload: { parentId: id, nodeType } })
        setIsExpanded(true);
    }

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (id === state.rootId) return
        dispatch({ type: "REMOVE_NODE", payload: { id } })
    }

    return (
        <div className="select-none">
            {/* Node row */}
            <div className={`group flex items-center gap-1 px-2 py-1.5 rounded-md cursor-pointer transition-colors duration-100 relative
                ${isActive ? "bg-blue-100 text-blue-800" : "hover:bg-gray-100 text-gray-700"} `}
                style={{ paddingLeft: `${depth * 16 + 8}px` }}
                onClick={handleSelect}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* expand collapse containers */}
                {isContainer ? (
                    <button
                        onClick={(e) => { e.stopPropagation(); setIsExpanded(p => !p) }}
                        className="w-4 h-4 flex items-center justify-center text-gray-400 hover:text-gray-600 shrink-0"
                    >
                        <DownArrowIcon
                         className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                         fill="#RRRRRR"
                         />
                    </button>
                ) : (
                    <span className="w-4 shrink-0" />
                )}
                {/* icon */}
                {/* <span className="text-sm shrink-0">
                    {isContainer ? "📁" : "📄"}
                </span> */}
                {/* label or rename input */}
                {isRenaming ? (
                    <input
                        ref={renameRef}
                        value={labelInput}
                        onChange={e => setLabelInput(e.target.value)}
                        onBlur={commitRename}
                        onKeyDown={e => {
                            if (e.key === "Enter") commitRename();
                            if (e.key === "Escape") {
                                setLabelInput(node.label);
                                setIsRenaming(false);
                            }
                        }}
                        onClick={e => e.stopPropagation()}
                        className="flex-1 text-sm bg-white border border-blue-400 rounded px-1 outline-none min-w-0"
                    />
                ) : (
                    <span className="font-inter-semibold flex-1 text-sm truncate" onDoubleClick={(e) => { e.stopPropagation(); handleRename() }}>
                        {node.label}
                    </span>
                )}
                {/* hover buttons */}
                {isHovered && !isRenaming && (
                    <div className="flex items-center gap-0.5 ml-auto shrink-0">
                        {isContainer && (
                            <>
                                <button
                                    title="Add Section"
                                    onClick={e => handleAddNode("container", e)}
                                    className="p-1 rounded hover:bg-blue-100 text-gray-400 hover:text-blue-600 text-xs"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </button>
                                <button
                                    title="Add item"
                                    onClick={e => handleAddNode("leaf", e)}
                                    className="p-1 rounded hover:bg-green-100 text-gray-400 hover:text-green-600 text-xs"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </button>
                            </>
                        )}
                        {id !== state.rootId && (
                            <button
                                title="Delete"
                                onClick={handleRemove}
                                className="p-1 rounded hover:bg-red-100 text-gray-400 hover:text-red-500 text-xs">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        )}
                    </div>
                )}
            </div>

        {/* Render children */}
        {isContainer && isExpanded && node.children.length > 0 && (
            <div>
                {node.children.map(childrenId => (
                    <TreeNode key={childrenId} id={childrenId} depth={depth + 1}/>
                ))}
            </div>
        )}
        </div>
    )
}

export default TreeNode;