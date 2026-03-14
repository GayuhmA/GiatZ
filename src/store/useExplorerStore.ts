import { create } from "zustand";
import {
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  applyNodeChanges,
  applyEdgeChanges,
  Connection,
  addEdge,
} from "@xyflow/react";

export type ExplorerNodeType = "noteNode" | "categoryNode";

export interface ExplorerNodeData {
  label: string;
  icon?: string;
  isActive?: boolean;
  [key: string]: unknown;
}

export type ExplorerNode = Node<ExplorerNodeData, ExplorerNodeType>;

interface ExplorerState {
  noteNodes: ExplorerNode[];
  categoryNodes: ExplorerNode[];
  edges: Edge[];
  loading: boolean;
  error: string | null;

  setNoteNodes: (nodes: ExplorerNode[]) => void;
  setCategoryNodes: (nodes: ExplorerNode[]) => void;
  setEdges: (edges: Edge[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  onNodesChange: OnNodesChange<ExplorerNode>;
  onEdgesChange: OnEdgesChange;
  onConnect: (connection: Connection) => void;

  getMergedNodes: () => ExplorerNode[];
}

export const useExplorerStore = create<ExplorerState>((set, get) => ({
  noteNodes: [],
  categoryNodes: [],
  edges: [],
  loading: true,
  error: null,

  setNoteNodes: (nodes) => set({ noteNodes: nodes, loading: false }),
  setCategoryNodes: (nodes) => set({ categoryNodes: nodes, loading: false }),
  setEdges: (edges) => set({ edges }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error, loading: false }),

  onNodesChange: (changes) => {
    set((state) => ({
      noteNodes: applyNodeChanges(changes, state.noteNodes) as ExplorerNode[],
      categoryNodes: applyNodeChanges(
        changes,
        state.categoryNodes,
      ) as ExplorerNode[],
    }));
  },

  onEdgesChange: (changes) =>
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges),
    })),

  onConnect: (connection) =>
    set((state) => ({
      edges: addEdge(connection, state.edges),
    })),

  getMergedNodes: () => {
    const { noteNodes, categoryNodes } = get();
    return [...noteNodes, ...categoryNodes];
  },
}));
