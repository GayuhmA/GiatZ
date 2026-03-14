import { memo, useState } from "react";
import { Handle, Position, NodeProps, Node } from "@xyflow/react";
import { motion } from "framer-motion";

export type CategoryNodeData = Node<
  {
    label: string;
    isActive?: boolean;
  },
  "categoryNode"
>;

export default memo(function CustomCategoryNode({
  data,
  isConnectable,
}: NodeProps<CategoryNodeData>) {
  const { label } = data;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative min-w-[180px] max-w-[260px] flex items-center justify-center gap-3 border transition-all duration-200 cursor-pointer h-12 px-5 rounded-full bg-[#FF9600] text-white font-black border-[#FF9600] shadow-md drop-shadow-sm z-10"
    >
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="!bg-transparent !border-none !w-2 !h-2 rounded-full"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="!bg-transparent !border-none !w-2 !h-2 rounded-full"
      />
      <Handle
        type="source"
        position={Position.Left}
        isConnectable={isConnectable}
        className="!bg-transparent !border-none !w-2 !h-2 rounded-full"
      />
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="!bg-transparent !border-none !w-2 !h-2 rounded-full"
      />

      <span className="text-sm truncate uppercase tracking-wider font-bold">
        {label}
      </span>
    </motion.div>
  );
});
