import { useTree } from "../../context/TreeContext";
import TreeNode from "./TreeNode";

const TreePanel = () => {
  const { state } = useTree();

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      <div className="p-4 border-b bg-white">
        <h2 className="text-xs font-bold uppercase text-gray-500 tracking-wider">
          Course Content
        </h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        <TreeNode nodeId={state.rootId} />
      </div>
    </div>
  );
};

export default TreePanel;