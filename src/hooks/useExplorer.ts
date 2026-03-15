import { useDailyStats } from "@/hooks/useDailyStats";
import { db } from "@/lib/firebase";
import { useAuthStore } from "@/store/useAuthStore";
import {
  ExplorerNode,
  ExplorerNodeType,
  useExplorerStore,
} from "@/store/useExplorerStore";
import { Edge } from "@xyflow/react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc
} from "firebase/firestore";
import { useCallback, useEffect } from "react";

export function useExplorer() {
  const { user } = useAuthStore();
  const { setNoteNodes, setCategoryNodes, setEdges, setLoading, setError } =
    useExplorerStore();
  const { addActivityUnit } = useDailyStats();

  // 1. Sync Notes -> NoteNodes
  useEffect(() => {
    if (!user?.uid) return;

    const notesRef = collection(db, "users", user.uid, "notes");
    const q = query(notesRef);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const nodes: ExplorerNode[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          let position = data.position;

          if (!position) {
            position = {
              x: Math.random() * 800,
              y: Math.random() * 600,
            };
            // Persist the generated position
            const nodeRef = doc(db, "users", user.uid, "notes", docSnap.id);
            updateDoc(nodeRef, { position }).catch(console.error);
          }

          return {
            id: docSnap.id,
            type: "noteNode",
            position,
            data: {
              label: data.title || "Untitled Note",
              icon: data.icon || "📝",
              category: data.category || "GENERAL",
              updatedAt: data.updatedAt,
              createdAt: data.createdAt,
              isActive: false,
            },
          };
        });
        setNoteNodes(nodes);
      },
      (err) => {
        console.error("Notes Sync Error:", err);
        setError(err.message);
      },
    );

    return () => unsubscribe();
  }, [user?.uid, setNoteNodes, setError]);

  // 2. Sync Categories -> CategoryNodes
  useEffect(() => {
    if (!user?.uid) return;

    const categoriesRef = collection(db, "users", user.uid, "categories");
    const q = query(categoriesRef);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const nodes: ExplorerNode[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          let position = data.position;

          if (!position) {
            position = {
              x: Math.random() * 800,
              y: Math.random() * 600,
            };
            // Persist the generated position
            const nodeRef = doc(
              db,
              "users",
              user.uid,
              "categories",
              docSnap.id,
            );
            updateDoc(nodeRef, { position }).catch(console.error);
          }

          return {
            id: docSnap.id,
            type: "categoryNode",
            position,
            data: {
              label: data.name || "New Category",
            },
          };
        });
        setCategoryNodes(nodes);
      },
      (err) => {
        console.error("Categories Sync Error:", err);
        setError(err.message);
      },
    );

    return () => unsubscribe();
  }, [user?.uid, setCategoryNodes, setError]);

  // 3. Sync Edges
  useEffect(() => {
    if (!user?.uid) {
      setEdges([]);
      return;
    }

    const edgesRef = collection(db, "users", user.uid, "edges");
    const q = query(edgesRef);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const edges: Edge[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            source: data.source,
            target: data.target,
            style: {
              stroke: "#CCCCCC",
              strokeDasharray: "5,5",
              strokeWidth: 2,
            },
          };
        });
        setEdges(edges);
      },
      (err) => {
        console.error("Edges Sync Error:", err);
        setError(err.message);
      },
    );

    return () => unsubscribe();
  }, [user?.uid, setEdges, setError]);

  // Actions
  const addCategory = useCallback(
    async (name: string, position?: { x: number; y: number }) => {
      if (!user?.uid) return;
      try {
        const initialPosition = position || {
          x: Math.random() * 800,
          y: Math.random() * 600,
        };
        const categoriesRef = collection(db, "users", user.uid, "categories");
        await addDoc(categoriesRef, {
          name: name.toUpperCase(),
          position: initialPosition,
          createdAt: serverTimestamp(),
        });
      } catch (err) {
        console.error("Add Category Error:", err);
      }
    },
    [user?.uid],
  );

  const updateNodePosition = useCallback(
    async (
      id: string,
      type: ExplorerNodeType,
      position: { x: number; y: number },
    ) => {
      if (!user?.uid) return;
      try {
        const collectionName = type === "noteNode" ? "notes" : "categories";
        const docRef = doc(db, "users", user.uid, collectionName, id);
        await updateDoc(docRef, { position });
      } catch (err) {
        console.error("Update Position Error:", err);
      }
    },
    [user?.uid],
  );

  const connectNodes = useCallback(
    async (source: string, target: string) => {
      if (!user?.uid) return;
      try {
        const edgesRef = collection(db, "users", user.uid, "edges");
        await addDoc(edgesRef, {
          source,
          target,
          createdAt: serverTimestamp(),
        });
      } catch (err) {
        console.error("Connect Nodes Error:", err);
      }
    },
    [user?.uid],
  );

  const updateNote = useCallback(
    async (noteId: string, updates: any) => {
      if (!user?.uid) return null;
      try {
        if (noteId === "new") {
          const initialPosition = updates.position || {
            x: Math.random() * 800,
            y: Math.random() * 600,
          };
          const notesRef = collection(db, "users", user.uid, "notes");
          const docRef = await addDoc(notesRef, {
            ...updates,
            position: initialPosition,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
          
          addActivityUnit(1, 'note');
          
          return docRef.id;
        } else {
          const noteRef = doc(db, "users", user.uid, "notes", noteId);
          await updateDoc(noteRef, {
            ...updates,
            updatedAt: serverTimestamp(),
          });
          return noteId;
        }
      } catch (err) {
        console.error("Update Note Error:", err);
        return null;
      }
    },
    [user?.uid],
  );

  const disconnectNodes = useCallback(
    async (edgeId: string) => {
      if (!user?.uid) return;
      try {
        const edgeRef = doc(db, "users", user.uid, "edges", edgeId);
        await deleteDoc(edgeRef);
      } catch (err) {
        console.error("Disconnect Nodes Error:", err);
      }
    },
    [user?.uid],
  );

  const createTask = useCallback(
    async (taskData: any) => {
      if (!user?.uid) return;
      try {
        const tasksRef = collection(db, "users", user.uid, "tasks");
        await addDoc(tasksRef, {
          ...taskData,
          createdAt: serverTimestamp(),
        });
      } catch (err) {
        console.error("Create Task Error:", err);
      }
    },
    [user?.uid],
  );

  const deleteNode = useCallback(
    async (id: string, type: ExplorerNodeType) => {
      if (!user?.uid) return;
      try {
        const collectionName = type === "noteNode" ? "notes" : "categories";

        // 1. Delete associated edges first
        const { edges } = useExplorerStore.getState();
        const edgesToDelete = edges.filter(
          (e) => e.source === id || e.target === id,
        );
        for (const edge of edgesToDelete) {
          await deleteDoc(doc(db, "users", user.uid, "edges", edge.id));
        }

        // 2. Delete the node document
        await deleteDoc(doc(db, "users", user.uid, collectionName, id));
      } catch (err) {
        console.error("Delete Node Error:", err);
      }
    },
    [user?.uid],
  );

  return {
    addCategory,
    updateNodePosition,
    connectNodes,
    updateNote,
    disconnectNodes,
    createTask,
    deleteNode,
  };
}
