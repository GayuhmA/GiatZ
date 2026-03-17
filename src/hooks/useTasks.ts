import { useEffect, useCallback } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuthStore } from "@/store/useAuthStore";
import { useTaskStore, Task, TaskQuadrant } from "@/store/useTaskStore";
import { useDailyStats } from "@/hooks/useDailyStats";

export function useTasks() {
  const { user } = useAuthStore();
  const {
    tasks,
    setTasks,
    setLoading,
    setError,
    optimisticMoveTask,
    optimisticToggleTask,
    optimisticAddTask,
    optimisticDeleteTask,
    optimisticUpdateTask,
    optimisticReorderTasks,
  } = useTaskStore();
  const { addActivityUnit } = useDailyStats();

  // 1. Setup Real-time Listener
  useEffect(() => {
    if (!user?.uid) {
      setTasks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const tasksRef = collection(db, "users", user.uid, "tasks");
    const q = query(tasksRef, orderBy("position", "asc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedTasks: Task[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title,
            description: data.description,
            quadrant: data.quadrant as TaskQuadrant,
            completed: data.completed || false,
            dueDate: data.dueDate ? (data.dueDate as Timestamp).toDate() : null,
            completedAt: data.completedAt
              ? (data.completedAt as Timestamp).toDate()
              : null,
            createdAt: data.createdAt
              ? (data.createdAt as Timestamp).toDate()
              : new Date(),
            position: data.position ?? 0,
          };
        });

        setTasks(fetchedTasks);
        setError(null);
      },
      (error) => {
        console.error("Error fetching tasks:", error);
        setError("Failed to load tasks.");
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [user?.uid, setTasks, setLoading, setError]);

  // 2. Add New Task
  const addTask = useCallback(
    async (
      title: string,
      quadrant: TaskQuadrant = "DO_FIRST",
      description?: string,
      dueDate?: Date,
    ) => {
      if (!user?.uid) return;

      try {
        const tasksRef = collection(db, "users", user.uid, "tasks");
        const newTaskDoc = doc(tasksRef); // Autogenerate ID

        const newTaskData = {
          title,
          description: description || "",
          quadrant,
          completed: false,
          dueDate: dueDate ? Timestamp.fromDate(dueDate) : null,
          createdAt: serverTimestamp(),
          completedAt: null,
          position: tasks.filter((t) => t.quadrant === quadrant).length,
        };

        // Optimistic update
        optimisticAddTask({
          id: newTaskDoc.id,
          title,
          description,
          quadrant,
          completed: false,
          dueDate: dueDate || null,
          createdAt: new Date(),
          position: tasks.filter((t) => t.quadrant === quadrant).length,
        });

        // Backend update
        await setDoc(newTaskDoc, newTaskData);
      } catch (err) {
        console.error("Error adding task:", err);
        // Let the snapshot listener revert the ui on next tick if failed
      }
    },
    [user, optimisticAddTask],
  );

  // 3. Move/Update Task Quadrant (Drag and Drop)
  const moveTask = useCallback(
    async (taskId: string, newQuadrant: TaskQuadrant) => {
      if (!user?.uid) return;

      // Optimistic UI Update for instant feedback
      optimisticMoveTask(taskId, newQuadrant);

      try {
        const taskRef = doc(db, "users", user.uid, "tasks", taskId);
        await updateDoc(taskRef, {
          quadrant: newQuadrant,
          position: tasks.filter((t) => t.quadrant === newQuadrant).length,
        });
      } catch (err) {
        console.error("Error moving task:", err);
        // Error will trigger a re-fetch from the snapshot, reverting the drag
      }
    },
    [user, optimisticMoveTask],
  );

  // 4. Toggle Completion
  const toggleTask = useCallback(
    async (taskId: string, currentStatus: boolean) => {
      if (!user?.uid) return;

      // Prevent unchecking completed tasks to avoid activity unit abuse
      if (currentStatus) return;

      optimisticToggleTask(taskId);

      try {
        const taskRef = doc(db, "users", user.uid, "tasks", taskId);
        const isCompleting = !currentStatus;

        await updateDoc(taskRef, {
          completed: isCompleting,
          completedAt: isCompleting ? serverTimestamp() : null,
        });

        // If marking as completed, add 1 Activity Unit
        if (isCompleting) {
          addActivityUnit(1, "task");
        }
      } catch (err) {
        console.error("Error toggling task:", err);
      }
    },
    [user, optimisticToggleTask, addActivityUnit],
  );

  // 5. Delete Task
  const deleteTask = useCallback(
    async (taskId: string) => {
      if (!user?.uid) return;

      optimisticDeleteTask(taskId);

      try {
        const taskRef = doc(db, "users", user.uid, "tasks", taskId);
        await deleteDoc(taskRef);
      } catch (err) {
        console.error("Error deleting task:", err);
      }
    },
    [user, optimisticDeleteTask],
  );

  // 6. Update Task Configuration
  const updateTask = useCallback(
    async (taskId: string, updates: Partial<Task>) => {
      if (!user?.uid) return;

      optimisticUpdateTask(taskId, updates);

      try {
        const taskRef = doc(db, "users", user.uid, "tasks", taskId);
        // Clean up the updates object for firestore, converting Date to Timestamp if necessary
        const firestoreUpdates = { ...updates } as Record<string, unknown>;
        if (updates.dueDate !== undefined) {
          firestoreUpdates.dueDate = updates.dueDate
            ? Timestamp.fromDate(updates.dueDate)
            : null;
        }

        await updateDoc(taskRef, firestoreUpdates);
      } catch (err) {
        console.error("Error updating task:", err);
      }
    },
    [user, optimisticUpdateTask],
  );

  // 7. Reorder Tasks
  const reorderTasks = useCallback(
    async (quadrant: TaskQuadrant, reorderedTasks: Task[]) => {
      if (!user?.uid) return;

      // Optimistic UI update
      optimisticReorderTasks(quadrant, reorderedTasks);

      try {
        const batch = writeBatch(db);
        reorderedTasks.forEach((task, index) => {
          const taskRef = doc(db, "users", user.uid, "tasks", task.id);
          batch.update(taskRef, { position: index });
        });
        await batch.commit();
      } catch (err) {
        console.error("Error committing reorder batch:", err);
      }
    },
    [user, optimisticReorderTasks],
  );

  return {
    addTask,
    moveTask,
    toggleTask,
    deleteTask,
    updateTask,
    reorderTasks,
  };
}
