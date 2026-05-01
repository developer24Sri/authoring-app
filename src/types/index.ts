export type NodeType = "container" | "leaf"

export interface NodeContent {
    type: "text" | "image" | "video"
    data: string
}

export interface TreeNode {
    id: string
    label: string
    type: NodeType
    parentId: string | null
    children: string[]
    content: NodeContent
}

export interface TreeState {
    nodes: Record<string, TreeNode>
    rootId: string
    activeNodeId: string | null
}

export type TreeAction =
    | { type: 'ADD_NODE'; payload: { parentId: string; nodeType: NodeType } }
    | { type: 'REMOVE_NODE'; payload: { id: string } }
    | { type: 'SET_ACTIVE'; payload: { id: string } }
    | { type: 'UPDATE_CONTENT'; payload: { id: string; content: NodeContent } }
    | { type: 'RENAME_NODE'; payload: { id: string; label: string } }

export interface TreeContextValue {
    state: TreeState;
    dispatch: React.Dispatch<TreeAction>;
}