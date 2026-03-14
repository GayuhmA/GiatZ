"use client";

import { useCallback } from "react";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Controls,
  Background,
  Connection,
  Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import CustomNoteNode, { NoteNodeData } from "./CustomNoteNode";

const nodeTypes = {
  noteNode: CustomNoteNode,
};

const initialNodes: NoteNodeData[] = [
  {
    id: "1",
    type: "noteNode",
    position: { x: 300, y: 150 },
    data: { label: "Calculus Integrals", icon: "🧮" },
  },
  {
    id: "2",
    type: "noteNode",
    position: { x: 500, y: 280 },
    data: { label: "Linear Algebra Matrix", icon: "▦", isActive: true },
  },
  {
    id: "3",
    type: "noteNode",
    position: { x: 280, y: 400 },
    data: { label: "JLPT N5 Kanji", icon: "文" },
  },
  {
    id: "4",
    type: "noteNode",
    position: { x: 650, y: 450 },
    data: { label: "React.js App Router", icon: "⚛️" },
  },
];

const initialEdges: Edge[] = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    animated: false,
    style: { stroke: "#CCCCCC", strokeDasharray: "5,5", strokeWidth: 2 },
  },
  {
    id: "e2-3",
    source: "2",
    target: "3",
    style: { stroke: "#CCCCCC", strokeDasharray: "5,5", strokeWidth: 2 },
  },
  {
    id: "e2-4",
    source: "2",
    target: "4",
    style: { stroke: "#CCCCCC", strokeDasharray: "5,5", strokeWidth: 2 },
  },
];

export default function MindGlanceGraph() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <div className="w-full h-full relative border border-[#E5E5E5] rounded-3xl overflow-hidden shadow-sm bg-white group">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
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
    </div>
  );
}
