import { useState } from "react";
import { useTree } from "../../context/TreeContext";

const TreeNode = ({ nodeId }: { nodeId: string }) => {
    const { state, dispatch } = useTree();
    const [isOpen, setIsOpen] = useState(false);

    const node = state.nodes[nodeId];

    if (!node) return null;

    const handleSelect = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (node.type === "leaf") {
            dispatch({ type: "SET_ACTIVE", payload: { id: nodeId } }); //for feature 7
        } else {
            setIsOpen(!isOpen);
        }
    };

    return (
        <div className="select-none">
            <div
                className={`flex items-center p-2 hover:bg-gray-100 cursor-pointer border-b border-gray-50 transition-colors ${state.activeNodeId === nodeId ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
                    }`}
                onClick={handleSelect}
            >
                {/* Parent Node */}
                <span className="w-4 mr-1 text-gray-400">
                    {node.type === "container" && (isOpen ? "V" : ">")}
                </span>

                {/* 2. Label & Icon */}
                <span className={`flex-1 ${node.type === "container" ? "font-semibold" : "text-gray-700"}`}>
                    {node.type === "container" ? "📁" : "📄"} {node.label}
                </span>

                {/* 3. Action Buttons for the feature 6 */}
                {node.type === "container" && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            dispatch({ type: 'ADD_NODE', payload: { parentId: nodeId, nodeType: 'leaf' } });
                        }}
                        className="opacity-0 group-hover:opacity-100 hover:text-green-600 px-2"
                    >
                        +
                    </button>
                )}
            </div>

            {/* rendering children */}
            {isOpen && node.children && (
                <div className="ml-4 border-l border-gray-200">
                    {node.children.map((childId: string) => (
                        // We ONLY pass the nodeId string here
                        <TreeNode key={childId} nodeId={childId} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default TreeNode;