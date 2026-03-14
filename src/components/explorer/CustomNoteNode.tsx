import { memo, useState } from "react";
import { Handle, Position, NodeProps, Node } from "@xyflow/react";
import { motion, AnimatePresence } from "framer-motion";

export type NoteNodeData = Node<
  {
    label: string;
    icon?: string; // Emoji
    isActive?: boolean;
  },
  "noteNode"
>;

export default memo(function CustomNoteNode({
  data,
  isConnectable,
}: NodeProps<NoteNodeData>) {
  const { label, icon, isActive } = data;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative min-w-[180px] max-w-[260px] flex items-center justify-center gap-3 border transition-all duration-200 cursor-pointer h-12
        ${
          isActive
            ? "px-5 rounded-full bg-[#FF9600] text-white font-bold border-[#FF9600] shadow-md drop-shadow-sm z-10"
            : "px-5 rounded-2xl bg-white border-[#E5E5E5] text-[#3C3C3C] hover:border-[#FF9600] shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-md"
        }`}
    >
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.9 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-gray-900 text-white rounded-lg px-3 py-1.5 text-[9px] font-bold whitespace-nowrap pointer-events-none drop-shadow-lg"
            style={{ zIndex: 100 }}
          >
            Click to open notes!
            {/* Tooltip Arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-[6px] border-transparent border-t-gray-900" />
          </motion.div>
        )}
      </AnimatePresence>

      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="!bg-transparent !border-none w-full"
      />

      {icon && (
        <span
          className={`text-xl leading-none flex items-center justify-center ${!isActive && "opacity-80"}`}
        >
          {icon}
        </span>
      )}
      <span className="text-sm truncate">{label}</span>

      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="!bg-transparent !border-none w-full"
      />
    </motion.div>
  );
});
