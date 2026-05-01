/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useReducer, useEffect} from "react";
import type { ReactNode } from "react";
import type { TreeState, TreeAction, TreeContextValue } from "../types";
import { createNode, initialState, removeNodeAndDescendants } from "../utils/treeHelpers";


const treeReducer = (state: TreeState, action: TreeAction): TreeState => {
    switch (action.type) {
        case "ADD_NODE": {
            const { parentId, nodeType } = action.payload
            const newNode = createNode(parentId, nodeType)

            return {
                ...state,
                nodes: {
                    ...state.nodes,
                    [newNode.id]: newNode,
                    [parentId]: {
                        ...state.nodes[parentId],
                        children: [...state.nodes[parentId].children, newNode.id]
                    }
                }
            }
        }

        case "REMOVE_NODE": {
            const updateNodes = removeNodeAndDescendants(state.nodes, action.payload.id)
            return {
                ...state,
                nodes: updateNodes,
                activeNodeId: state.activeNodeId === action.payload.id ? null : state.activeNodeId
            }
        }

        case "SET_ACTIVE":
            return { ...state, activeNodeId: action.payload.id }

        case "UPDATE_CONTENT":
            return {
                ...state,
                nodes: {
                    ...state.nodes,
                    [action.payload.id]: {
                        ...state.nodes[action.payload.id],
                        content: action.payload.content
                    }
                }
            }

        case "RENAME_NODE":
            return {
                ...state,
                nodes: {
                    ...state.nodes,
                    [action.payload.id]: {
                        ...state.nodes[action.payload.id],
                        label: action.payload.label
                    }
                }
            }

        default:
            return state
    }
}

//if exisit load from localStorage or fallback to inital State
const loadState = (): TreeState => {
    try {
        const saved = localStorage.getItem("authoring-tree")
        return saved ? JSON.parse(saved) : initialState
    } catch {
        return initialState
    }
}


const TreeContext = createContext<TreeContextValue | null>(null)

//provider wraps the whole app
export const TreeProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(treeReducer, undefined, loadState)

    //on every state changes we save it to localStorage
    useEffect(() => {
        localStorage.setItem("authoring-tree", JSON.stringify(state))
    }, [state])

    return (
        <TreeContext.Provider value={{ state, dispatch }}>
            {children}
        </TreeContext.Provider>
    )
}

export const useTree = () => {
    const ctx = useContext(TreeContext);
    if (!ctx) throw new Error("useTree must be used inside TreeProvider")
    return ctx
}

