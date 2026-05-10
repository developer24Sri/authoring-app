import { useState, useRef, useEffect, memo } from 'react'
import { useTree } from '../../context/TreeContext'
import { useActiveNode } from '../../context/ActiveNodeContext'
import type { NodeType } from '../../types'
import TreeNodeView from './TreeNodeView'

interface TreeNodeProps {
  id: string
  depth?: number
}

const TreeNode = ({ id, depth = 0 }: TreeNodeProps) => {
  const { state, dispatch } = useTree()
  const { activeNodeId, setActiveNodeId } = useActiveNode()
  const node = state.nodes[id]
  const isActive = activeNodeId === id
  const [isExpanded, setIsExpanded] = useState(true)
  const [isHovered, setIsHovered] = useState(false)
  const [isRenaming, setIsRenaming] = useState(false)
  const [labelInput, setLabelInput] = useState(node?.label ?? '')
  const renameRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (isRenaming) renameRef.current?.focus()
  }, [isRenaming])

  if (!node) return null

  const handleAddNode = (nodeType: NodeType, e: React.MouseEvent) => {
    e.stopPropagation()
    if (node.type !== 'container') return
    const newId = crypto.randomUUID()
    dispatch({ type: 'ADD_NODE', payload: { parentId: id, nodeType, id: newId } })
    setActiveNodeId(newId)
    setIsExpanded(true)
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (id === state.rootId) return
    const confirmDelete = window.confirm(
      `Delete "${node.label}"? This will also delete all its children.`
    )
    if (!confirmDelete) return
    dispatch({ type: 'REMOVE_NODE', payload: { id } })
    //clear active node if the deleted node was selected
    if(activeNodeId === id) setActiveNodeId(null);
  }

  const commitRename = () => {
    const trimmed = labelInput.trim()
    if (trimmed) {
      dispatch({ type: 'RENAME_NODE', payload: { id, label: trimmed } })
    } else {
      setLabelInput(node.label)
    }
    setIsRenaming(false)
  }

  return (
    <TreeNodeView
      id={id}
      label={node.label}
      nodeType={node.type}
      depth={depth}
      isActive={isActive}
      isExpanded={isExpanded}
      isHovered={isHovered}
      isRenaming={isRenaming}
      isRoot={id === state.rootId}
      labelInput={labelInput}
      renameRef={renameRef}
      onSelect={() => setActiveNodeId(id)}
      onToggleExpand={e => { e.stopPropagation(); setIsExpanded(p => !p) }}
      onAddNode={handleAddNode}
      onRemove={handleRemove}
      onHoverEnter={() => setIsHovered(true)}
      onHoverLeave={() => setIsHovered(false)}
      onDoubleClickLabel={e => { e.stopPropagation(); setIsRenaming(true) }}
      onLabelChange={setLabelInput}
      onRenameBlur={commitRename}
      onRenameKeyDown={e => {
        if (e.key === 'Enter') commitRename()
        if (e.key === 'Escape') {
          setLabelInput(node.label)
          setIsRenaming(false)
        }
      }}
    >
      {/* Recursion stays in the container */}
      {node.children.map(childId => (
        <TreeNode key={childId} id={childId} depth={depth + 1} />
      ))}
    </TreeNodeView>
  )
}

export default memo(TreeNode)