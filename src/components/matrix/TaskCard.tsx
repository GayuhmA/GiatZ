"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Card from "@/components/shared/Card";
import { Task } from "@/store/useTaskStore";
import { CheckCircleIcon, TrashIcon } from "@heroicons/react/24/outline";
import { ClockIcon, EllipsisVerticalIcon } from "@heroicons/react/24/solid";

interface TaskCardProps {
  task: Task;
  onToggleComplete?: (id: string, currentStatus: boolean) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (id: string) => void;
}

export default function TaskCard({ task, onToggleComplete, onEdit, onDelete }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  if (isDragging) {
    return (
      <div 
        ref={setNodeRef} 
        style={style} 
        className="opacity-50"
      >
        <Card className="border-2 border-primary shadow-lg ring-2 ring-primary/20">
          <div className="h-16 bg-gray-100 rounded-xl" />
        </Card>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`touch-none ${task.completed ? "opacity-60" : ""}`}
    >
      <Card className="border border-border hover:shadow-card-hover transition-shadow relative group cursor-grab active:cursor-grabbing" onClick={() => onEdit?.(task)}>
        <div className="flex gap-3">
          <button 
            type="button"
            className="mt-1 shrink-0"
            onPointerDown={(e) => {
              // Prevent drag when clicking the complete button
              e.stopPropagation();
            }}
            onClick={(e) => {
              e.stopPropagation();
              onToggleComplete?.(task.id, task.completed);
            }}
          >
            <CheckCircleIcon className={`w-5 h-5 ${task.completed ? "text-success fill-success/20" : "text-border hover:text-success transition-colors"}`} />
          </button>
          
          <div className="flex-1 min-w-0">
            <h4 
              className={`font-bold text-sm md:text-base wrap-break-word 
                ${task.completed ? "text-text-secondary line-through" : "text-text-primary"}`
              }
            >
              {task.title}
            </h4>
            
            {task.description && (
              <p className="text-xs text-text-secondary mt-1 line-clamp-2">
                {task.description}
              </p>
            )}

            {task.dueDate && (
              <div className="mt-3 flex items-center gap-1 text-[10px] md:text-xs font-bold text-text-secondary bg-gray-100 w-fit px-2 py-1 rounded-full uppercase">
                <ClockIcon className="w-3.5 h-3.5" /> {task.dueDate.toLocaleDateString()}
              </div>
            )}
            
            
          </div>
          <div className="flex items-center justify-center shrink-0 opacity-0 group-hover:opacity-100 transition-opacity gap-2">
            <button 
              type="button" 
              className="p-1 hover:bg-gray-100 rounded-md transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(task.id);
              }}
            >
              <TrashIcon className="w-5 h-5 text-text-secondary hover:text-danger" />
            </button>
            <div className="cursor-grab active:cursor-grabbing p-1">
              <EllipsisVerticalIcon className="w-6 h-6 text-text-secondary" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
