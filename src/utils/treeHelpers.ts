// import { v4 as uuidv4 } from "uuid";
import { NODE_LABELS, TREE_CONFIG } from "../constants";
import type { TreeNode, TreeState, NodeType } from "../types";

export const createNode = (
    parentId: string,
    nodeType: NodeType,
    id: string
): TreeNode => ({
    id,
    label: nodeType === "container" ? NODE_LABELS.DEFAULT_CONTAINER : NODE_LABELS.DEFAULT_LEAF,
    type: nodeType,
    parentId,
    children: [],
    content: { type: "text", data: "" }
})

export const initialState: TreeState = {
    rootId: TREE_CONFIG.ROOT_ID,
    // activeNodeId: null,
    nodes: {
        root: {
            id: TREE_CONFIG.ROOT_ID,
            label: NODE_LABELS.ROOT,
            type: "container",
            parentId: null,
            children: ["chapter-1"],
            content: { type: "text", data: "" }
        },
        "chapter-1": {
            id: 'chapter-1',
            label: 'Chapter 1',
            type: 'container',
            parentId: TREE_CONFIG.ROOT_ID,
            children: ['lesson-1'],
            content: { type: 'text', data: '' }
        },
        "lesson-1": {
            id: 'lesson-1',
            label: 'Lesson 1',
            type: 'leaf',
            parentId: 'chapter-1',
            children: [],
            content: { type: 'text', data: '<p>Start writing here...</p>' }
        }
    }
}

//remove a node AND all its descendants cleanly
export const removeNodeAndDescendants = (
    nodes: Record<string, TreeNode>,
    nodeId: string
): Record<string, TreeNode> => {
    const toRemove = new Set<string>();

    const collect = (id: string) => {
        toRemove.add(id);
        nodes[id]?.children.forEach(collect);
    }
    collect(nodeId);

    const updated = { ...nodes }
    toRemove.forEach(id => delete updated[id]);

    const parentId = nodes[nodeId]?.parentId
    if (parentId && updated[parentId]) {
        updated[parentId] = {
            ...updated[parentId],
            children: updated[parentId].children.filter(id => id !== nodeId)
        }
    }
    return updated
}

export const getAncestors = (
  nodes: Record<string, TreeNode>,
  nodeId: string
): TreeNode[] => {
  const ancestors: TreeNode[] = []
  let current = nodes[nodeId]
  while (current?.parentId) {
    const parent = nodes[current.parentId]
    if (parent) ancestors.unshift(parent)
    current = parent
  }
  return ancestors
}