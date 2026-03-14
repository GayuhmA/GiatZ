import { create } from 'zustand';

export type TaskQuadrant = 'DO_FIRST' | 'SCHEDULE' | 'DELEGATE' | 'ELIMINATE';

export interface Task {
  id: string;
  title: string;
  description?: string;
  quadrant: TaskQuadrant;
  completed: boolean;
  completedAt?: Date | null;
  dueDate?: Date | null;
  createdAt: Date;
}

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  setTasks: (tasks: Task[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Optimistic UI updates
  optimisticMoveTask: (taskId: string, newQuadrant: TaskQuadrant) => void;
  optimisticToggleTask: (taskId: string) => void;
  optimisticAddTask: (task: Task) => void;
  optimisticDeleteTask: (taskId: string) => void;
  optimisticUpdateTask: (taskId: string, updates: Partial<Task>) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  loading: true,
  error: null,
  
  setTasks: (tasks) => set({ tasks, loading: false }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error, loading: false }),

  optimisticMoveTask: (taskId, newQuadrant) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, quadrant: newQuadrant } : t
      ),
    })),

  optimisticToggleTask: (taskId) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { 
          ...t, 
          completed: !t.completed,
          completedAt: !t.completed ? new Date() : null
        } : t
      ),
    })),

  optimisticAddTask: (task) =>
    set((state) => ({
      tasks: [...state.tasks, task]
    })),

  optimisticDeleteTask: (taskId) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== taskId)
    })),

  optimisticUpdateTask: (taskId, updates) =>
    set((state) => ({
      tasks: state.tasks.map((t) => 
        t.id === taskId ? { ...t, ...updates } : t
      )
    })),
}));
