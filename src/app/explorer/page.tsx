"use client";

import { useState, useCallback } from "react";
import {
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  OnNodesChange,
  OnEdgesChange,
} from "@xyflow/react";
import AppLayout from "@/components/layout/AppLayout";
import MindGlanceGraph from "../../components/explorer/MindGlanceGraph";
import RightPanel from "../../components/explorer/RightPanel";
import SearchBar from "../../components/explorer/SearchBar";
import AddCategoryModal from "../../components/explorer/AddCategoryModal";
import AllNotesModal from "../../components/explorer/AllNotesModal";
import { useExplorerStore } from "@/store/useExplorerStore";
import { useExplorer } from "@/hooks/useExplorer";

export default function MindGlancePage() {
  const {
    noteNodes,
    getMergedNodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
  } = useExplorerStore();

  const {
    addCategory,
    updateNodePosition,
    connectNodes,
    deleteNode,
    disconnectNodes,
  } = useExplorer();

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isAllNotesOpen, setIsAllNotesOpen] = useState(false);

  const nodes = getMergedNodes();

  const handleConfirmCategory = (name: string) => {
    addCategory(name);
  };

  const handleNodeDragStop = useCallback(
    (_: React.MouseEvent, node: Node) => {
      updateNodePosition(node.id, node.type as any, node.position);
    },
    [updateNodePosition],
  );

  const handleConnect = useCallback(
    (params: Connection | Edge) => {
      if (
        "source" in params &&
        params.source &&
        "target" in params &&
        params.target
      ) {
        onConnect(params as Connection); // Optimistic
        connectNodes(params.source, params.target);
      }
    },
    [onConnect, connectNodes],
  );

  const handleDeleteNode = useCallback(
    (id: string, type: any) => {
      deleteNode(id, type);
    },
    [deleteNode],
  );

  const handleDeleteEdge = useCallback(
    (id: string) => {
      disconnectNodes(id);
    },
    [disconnectNodes],
  );

  return (
    <AppLayout
      rightPanel={
        <RightPanel
          onAddCategory={() => setIsCategoryModalOpen(true)}
          onViewAllNotes={() => setIsAllNotesOpen(true)}
        />
      }
    >
      <div className="flex flex-col h-[calc(100vh-120px)] md:h-[calc(100vh-60px)]">
        {/* Header Content */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full mb-6">
          <div className="w-full relative z-10 flex flex-col items-start gap-1">
            <h2 className="text-2xl md:text-[32px] font-extrabold text-[#3C3C3C] flex items-center font-heading tracking-wide">
              Interactive Graph Canvas
            </h2>
            <p className="text-[#AFAFAF] font-bold text-sm mt-1 tracking-wide">
              Connect the dots of your learning journey
            </p>
          </div>

          {/* Desktop Only: Top Controls */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <SearchBar />
          </div>
        </div>

        {/* Canvas Area Container */}
        <div className="w-full flex-1 relative min-h-[400px]">
          <MindGlanceGraph
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={handleConnect}
            onNodeDragStop={handleNodeDragStop}
            onDeleteNode={handleDeleteNode}
            onDeleteEdge={handleDeleteEdge}
          />
        </div>
      </div>

      <AddCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onConfirm={handleConfirmCategory}
      />

      <AllNotesModal
        isOpen={isAllNotesOpen}
        onClose={() => setIsAllNotesOpen(false)}
        notes={noteNodes}
      />
    </AppLayout>
  );
}
