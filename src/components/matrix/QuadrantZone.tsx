"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Task, TaskQuadrant } from "@/store/useTaskStore";
import TaskCard from "./TaskCard";

interface QuadrantZoneProps {
  id: TaskQuadrant;
  tasks: Task[];
  onToggleComplete: (id: string, currentStatus: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export default function QuadrantZone({
  id,
  tasks,
  onToggleComplete,
  onEdit,
  onDelete,
}: QuadrantZoneProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
    data: {
      type: "Quadrant",
      quadrant: id,
    },
  });

  // Decide border/ring color on hover based on quadrant
  const getBorderColor = () => {
    switch (id) {
      case "DO_FIRST":
        return "border-danger ring-danger";
      case "SCHEDULE":
        return "border-success ring-success";
      case "DELEGATE":
        return "border-secondary ring-secondary";
      case "ELIMINATE":
        return "border-warning ring-warning";
      default:
        return "border-border ring-border";
    }
  };

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 flex flex-col min-h-0 rounded-2xl p-1 px-3 transition-colors overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
        ${isOver ? `bg-white/50 ring-2 ${getBorderColor()}` : ""}
      `}
    >
      <SortableContext
        items={tasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        {tasks.length > 0 ? (
          <div className="space-y-4 py-2">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleComplete={onToggleComplete}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        ) : (
          <div
            className={`flex-1 border-2 border-dashed rounded-2xl flex items-center justify-center opacity-50 ${getBorderColor()}`}
          >
            <span className="text-sm font-bold uppercase">Drop Here</span>
          </div>
        )}
      </SortableContext>
    </div>
  );
}
