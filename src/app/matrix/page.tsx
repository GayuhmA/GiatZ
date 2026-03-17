"use client";

import { useMemo, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import Card from "@/components/shared/Card";
import Button from "@/components/shared/Button";
import { PlusIcon } from "@heroicons/react/24/outline";
import {
  ExclamationCircleIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";

import { useTasks } from "@/hooks/useTasks";
import { useTaskStore, TaskQuadrant, Task } from "@/store/useTaskStore";

import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates, arrayMove } from "@dnd-kit/sortable";
import QuadrantZone from "@/components/matrix/QuadrantZone";
import TaskCard, { TaskCardUI } from "@/components/matrix/TaskCard";
import AddTaskModal from "@/components/matrix/AddTaskModal";

export default function MatrixPage() {
  const { tasks } = useTaskStore();
  const {
    moveTask,
    toggleTask,
    addTask,
    updateTask,
    deleteTask,
    reorderTasks,
  } = useTasks();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeTaskToEdit, setActiveTaskToEdit] = useState<Task | undefined>(
    undefined,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1, // smaller distance for faster reaction
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Group tasks
  const doFirstTasks = useMemo(
    () =>
      tasks
        .filter((t) => t.quadrant === "DO_FIRST")
        .sort((a, b) => a.position - b.position),
    [tasks],
  );
  const scheduleTasks = useMemo(
    () =>
      tasks
        .filter((t) => t.quadrant === "SCHEDULE")
        .sort((a, b) => a.position - b.position),
    [tasks],
  );
  const delegateTasks = useMemo(
    () =>
      tasks
        .filter((t) => t.quadrant === "DELEGATE")
        .sort((a, b) => a.position - b.position),
    [tasks],
  );
  const eliminateTasks = useMemo(
    () =>
      tasks
        .filter((t) => t.quadrant === "ELIMINATE")
        .sort((a, b) => a.position - b.position),
    [tasks],
  );

  const handleEditTask = (task: Task) => {
    setActiveTaskToEdit(task);
    setIsModalOpen(true);
  };

  // Find active task for overlay
  const activeTask = useMemo(
    () => tasks.find((t) => t.id === activeId),
    [activeId, tasks],
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;

    if (!over) return;

    const activeIdVal = active.id as string;

    const activeTaskData = active.data.current?.task;
    const overType = over.data.current?.type;

    if (!activeTaskData) return;

    let targetQuadrant: TaskQuadrant | null = null;

    if (overType === "Quadrant") {
      targetQuadrant = over.data.current?.quadrant as TaskQuadrant;
    } else if (overType === "Task") {
      targetQuadrant = over.data.current?.task.quadrant as TaskQuadrant;
    }

    // Only update if the quadrant changed OR if it's a reorder in the same quadrant
    if (targetQuadrant) {
      if (targetQuadrant !== activeTaskData.quadrant) {
        // Cross-quadrant move
        moveTask(activeIdVal, targetQuadrant);
      } else if (over.id !== activeIdVal) {
        // Same-quadrant reorder
        const quadrantTasks = tasks
          .filter((t) => t.quadrant === targetQuadrant)
          .sort((a, b) => a.position - b.position);

        const oldIndex = quadrantTasks.findIndex((t) => t.id === activeIdVal);
        const newIndex = quadrantTasks.findIndex((t) => t.id === over.id);

        if (oldIndex !== -1 && newIndex !== -1) {
          const newOrderedTasks = arrayMove(quadrantTasks, oldIndex, newIndex);
          reorderTasks(targetQuadrant, newOrderedTasks);
        }
      }
    }
  };

  const handleDragOver = (event: any) => {
    const { active, over } = event;
    if (!over) return;

    const activeIdVal = active.id as string;
    const overIdVal = over.id as string;

    if (activeIdVal === overIdVal) return;

    const activeTaskData = active.data.current?.task as Task;
    const overType = over.data.current?.type;

    if (!activeTaskData) return;

    let targetQuadrant: TaskQuadrant | null = null;
    if (overType === "Quadrant") {
      targetQuadrant = over.data.current?.quadrant as TaskQuadrant;
    } else if (overType === "Task") {
      targetQuadrant = over.data.current?.task.quadrant as TaskQuadrant;
    }

    if (targetQuadrant && targetQuadrant !== activeTaskData.quadrant) {
      // Logic for cross-quadrant drag over can be added here if needed for live preview
      // For now, dnd-kit handles sorting in same quadrant automatically via SortableContext items
    }
  };

  return (
    <AppLayout showRightPanel={false}>
      <div className="min-h-full flex flex-col">
        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-text-primary">
              Task Matrix
            </h2>
            <p className="text-text-secondary mt-1 flex items-center gap-2 font-medium">
              Sistem Produktivitas Eisenhower 2.0
            </p>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <Button
              onClick={() => {
                setActiveTaskToEdit(undefined);
                setIsModalOpen(true);
              }}
              className="w-full md:w-auto flex items-center justify-center gap-2"
            >
              <PlusIcon className="w-5 h-5" />
              Tambah Task Baru
            </Button>
          </div>
        </div>

        {/* Matrix Grid with DndContext */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 relative min-h-0 mt-8 md:mt-10 ml-4 md:ml-16">
            {/* Column Labels */}
            <div className="hidden md:flex absolute -top-8 left-0 w-full justify-around text-text-label font-bold uppercase tracking-widest text-sm z-0 pointer-events-none">
              <div className="w-1/2 text-center">Mendesak</div>
              <div className="w-1/2 text-center">Tidak Mendesak</div>
            </div>

            {/* Row Labels */}
            <div className="hidden md:flex absolute -left-16 top-0 h-full flex-col justify-around items-center w-12 z-0 pointer-events-none">
              <div className="h-1/2 flex items-center justify-center -rotate-90 text-text-label font-bold uppercase tracking-widest text-sm whitespace-nowrap">
                Penting
              </div>
              <div className="h-1/2 flex items-center justify-center -rotate-90 text-text-label font-bold uppercase tracking-widest text-sm whitespace-nowrap">
                Tidak Penting
              </div>
            </div>

            {/* Do First (Urgent & Important) */}
            <Card
              variant="tinted-danger"
              className="flex flex-col p-4 md:p-5 relative z-10 min-h-48 md:min-h-64"
            >
              <div className="flex justify-between items-center mb-4 shrink-0">
                <h3 className="text-[10px] md:text-sm font-extrabold uppercase tracking-widest text-danger">
                  Do First
                </h3>
                <ExclamationCircleIcon className="w-5 h-5 md:w-6 md:h-6 text-danger" />
              </div>
              <QuadrantZone
                id="DO_FIRST"
                tasks={doFirstTasks}
                onToggleComplete={toggleTask}
                onEdit={handleEditTask}
                onDelete={deleteTask}
              />
            </Card>

            {/* Schedule (Not Urgent & Important) */}
            <Card
              variant="tinted-success"
              className="flex flex-col p-4 md:p-5 relative z-10 min-h-48 md:min-h-64"
            >
              <div className="flex justify-between items-center mb-4 shrink-0">
                <h3 className="text-[10px] md:text-sm font-extrabold uppercase tracking-widest text-success">
                  Schedule
                </h3>
                <CalendarDaysIcon className="w-5 h-5 md:w-6 md:h-6 text-success" />
              </div>
              <QuadrantZone
                id="SCHEDULE"
                tasks={scheduleTasks}
                onToggleComplete={toggleTask}
                onEdit={handleEditTask}
                onDelete={deleteTask}
              />
            </Card>

            {/* Delegate (Urgent & Not Important) */}
            <Card
              variant="tinted-info"
              className="flex flex-col p-4 md:p-5 relative z-10 min-h-48 md:min-h-64"
            >
              <div className="flex justify-between items-center mb-4 shrink-0">
                <h3 className="text-[10px] md:text-sm font-extrabold uppercase tracking-widest text-secondary">
                  Delegate
                </h3>
                <UserGroupIcon className="w-5 h-5 md:w-6 md:h-6 text-secondary" />
              </div>
              <QuadrantZone
                id="DELEGATE"
                tasks={delegateTasks}
                onToggleComplete={toggleTask}
                onEdit={handleEditTask}
                onDelete={deleteTask}
              />
            </Card>

            {/* Eliminate (Not Urgent & Not Important) */}
            <Card
              variant="tinted-warning"
              className="flex flex-col p-4 md:p-5 relative z-10 min-h-48 md:min-h-64"
            >
              <div className="flex justify-between items-center mb-4 shrink-0">
                <h3 className="text-[10px] md:text-sm font-extrabold uppercase tracking-widest text-warning">
                  Eliminate
                </h3>
                <TrashIcon className="w-5 h-5 md:w-6 md:h-6 text-warning" />
              </div>
              <QuadrantZone
                id="ELIMINATE"
                tasks={eliminateTasks}
                onToggleComplete={toggleTask}
                onEdit={handleEditTask}
                onDelete={deleteTask}
              />
            </Card>
          </div>

          <DragOverlay adjustScale={false} zIndex={1000} dropAnimation={{ duration: 250, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)'}}>
            {activeId && activeTask ? (
              <TaskCardUI task={activeTask} isOverlay />
            ) : null}
          </DragOverlay>
        </DndContext>

        <AddTaskModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setActiveTaskToEdit(undefined);
          }}
          initialTask={activeTaskToEdit}
          onSave={(title, quadrant, desc, date) => {
            if (activeTaskToEdit) {
              updateTask(activeTaskToEdit.id, {
                title,
                quadrant,
                description: desc,
                dueDate: date,
              });
            } else {
              addTask(title, quadrant, desc, date);
            }
          }}
        />
      </div>
    </AppLayout>
  );
}
