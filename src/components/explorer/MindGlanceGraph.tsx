"use client";

import {
  ReactFlow,
  Controls,
  Background,
  Connection,
  Edge,
  Node,
  OnNodesChange,
  OnEdgesChange,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import CustomNoteNode from "./CustomNoteNode";
import CustomCategoryNode from "./CustomCategoryNode";
import { ExplorerNode, ExplorerNodeType } from "@/store/useExplorerStore";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";

const nodeTypes = {
  noteNode: CustomNoteNode,
  categoryNode: CustomCategoryNode,
};

interface MindGlanceGraphProps {
  nodes: ExplorerNode[];
  edges: Edge[];
  onNodesChange: OnNodesChange<ExplorerNode>;
  onEdgesChange: OnEdgesChange;
  onConnect: (params: Connection | Edge) => void;
  onNodeDragStop?: (event: React.MouseEvent, node: Node) => void;
  onDeleteNode?: (id: string, type: ExplorerNodeType) => void;
  onDeleteEdge?: (id: string) => void;
}

export default function MindGlanceGraph({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeDragStop,
  onDeleteNode,
  onDeleteEdge,
}: MindGlanceGraphProps) {
  const router = useRouter();
  const [menu, setMenu] = useState<{
    id: string;
    type: "node" | "edge";
    nodeType?: ExplorerNodeType;
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
  } | null>(null);

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      if (node.type === "noteNode") {
        router.push(`/explorer/editor/${node.id}`);
      }
    },
    [router],
  );

  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: Node) => {
      event.preventDefault();
      setMenu({
        id: node.id,
        type: "node",
        nodeType: node.type as ExplorerNodeType,
        top: event.clientY,
        left: event.clientX,
      });
    },
    [],
  );

  const onEdgeContextMenu = useCallback(
    (event: React.MouseEvent, edge: Edge) => {
      event.preventDefault();
      setMenu({
        id: edge.id,
        type: "edge",
        top: event.clientY,
        left: event.clientX,
      });
    },
    [],
  );

  const onPaneClick = useCallback(() => setMenu(null), []);

  const handleDelete = () => {
    if (!menu) return;
    if (menu.type === "node" && onDeleteNode && menu.nodeType) {
      onDeleteNode(menu.id, menu.nodeType);
    } else if (menu.type === "edge" && onDeleteEdge) {
      onDeleteEdge(menu.id);
    }
    setMenu(null);
  };

  return (
    <div className="w-full h-full relative border border-[#E5E5E5] rounded-3xl overflow-hidden shadow-sm bg-white group">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        onNodeClick={onNodeClick}
        onNodeContextMenu={onNodeContextMenu}
        onEdgeContextMenu={onEdgeContextMenu}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2, maxZoom: 1.4 }}
        minZoom={0.5}
        maxZoom={2}
      >
        <Background gap={24} size={1} color="#E5E5E5" />
        <Controls
          position="top-right"
          className="bg-white rounded-xl shadow-sm border border-[#E5E5E5] fill-[#3C3C3C] overflow-hidden [&>button]:border-b [&>button]:border-[#E5E5E5] [&>button:last-child]:border-0 [&>button:hover]:bg-gray-50 flex flex-col pointer-events-auto"
          showInteractive={false}
          fitViewOptions={{ padding: 0.2, maxZoom: 1.4 }}
        />
      </ReactFlow>

      {/* Custom Context Menu */}
      {menu && (
        <div
          style={{
            position: "fixed",
            top: menu.top,
            left: menu.left,
            zIndex: 1000,
          }}
          className="bg-white rounded-2xl shadow-2xl border border-[#E5E5E5] p-2 min-w-[160px] animate-in fade-in zoom-in duration-200"
        >
          <button
            onClick={handleDelete}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-500 hover:bg-red-50 transition-colors text-xs font-black uppercase tracking-wider"
          >
            <TrashIcon className="w-4 h-4" />
            Hapus Note
          </button>
        </div>
      )}
    </div>
  );
}
