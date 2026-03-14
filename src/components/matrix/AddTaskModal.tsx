"use client";

import { useEffect, Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Button from "@/components/shared/Button";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { ExclamationCircleIcon, CalendarDaysIcon, UserGroupIcon, TrashIcon } from "@heroicons/react/24/solid";
import { TaskQuadrant, Task } from "@/store/useTaskStore";
import CustomDatePicker from "@/components/shared/CustomDatePicker";

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, quadrant: TaskQuadrant, desc?: string, date?: Date) => void;
  initialTask?: Task;
}

export default function AddTaskModal({ isOpen, onClose, onSave, initialTask }: AddTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [quadrant, setQuadrant] = useState<TaskQuadrant>("DO_FIRST");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    if (isOpen) {
      if (initialTask) {
        setTitle(initialTask.title);
        setDescription(initialTask.description || "");
        setQuadrant(initialTask.quadrant);
        setDueDate(initialTask.dueDate || undefined);
      } else {
        setTitle("");
        setDescription("");
        setQuadrant("DO_FIRST");
        setDueDate(undefined);
      }
    }
  }, [isOpen, initialTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave(title.trim(), quadrant, description.trim(), dueDate);
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-visible rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-bold leading-6 text-text-primary"
                  >
                    {initialTask ? "Edit Task" : "Add New Task"}
                  </Dialog.Title>
                  <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-text-primary mb-1">Task Title *</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      placeholder="e.g. Finish Calculus Homework"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-text-primary mb-1">Quadrant Priority</label>
                    <div className="grid grid-cols-2 gap-2">
                      <label className={`cursor-pointer border rounded-xl p-2 flex flex-col items-center justify-center gap-1 text-xs font-bold uppercase transition-colors ${quadrant === 'DO_FIRST' ? 'bg-danger text-white border-danger' : 'border-border text-text-secondary hover:bg-gray-50'}`}>
                        <input type="radio" className="hidden" checked={quadrant === 'DO_FIRST'} onChange={() => setQuadrant('DO_FIRST')} />
                        <ExclamationCircleIcon className="w-5 h-5" />
                        Do First
                      </label>
                      <label className={`cursor-pointer border rounded-xl p-2 flex flex-col items-center justify-center gap-1 text-xs font-bold uppercase transition-colors ${quadrant === 'SCHEDULE' ? 'bg-success text-white border-success' : 'border-border text-text-secondary hover:bg-gray-50'}`}>
                        <input type="radio" className="hidden" checked={quadrant === 'SCHEDULE'} onChange={() => setQuadrant('SCHEDULE')} />
                        <CalendarDaysIcon className="w-5 h-5" />
                        Schedule
                      </label>
                      <label className={`cursor-pointer border rounded-xl p-2 flex flex-col items-center justify-center gap-1 text-xs font-bold uppercase transition-colors ${quadrant === 'DELEGATE' ? 'bg-secondary text-white border-secondary' : 'border-border text-text-secondary hover:bg-gray-50'}`}>
                        <input type="radio" className="hidden" checked={quadrant === 'DELEGATE'} onChange={() => setQuadrant('DELEGATE')} />
                        <UserGroupIcon className="w-5 h-5" />
                        Delegate
                      </label>
                      <label className={`cursor-pointer border rounded-xl p-2 flex flex-col items-center justify-center gap-1 text-xs font-bold uppercase transition-colors ${quadrant === 'ELIMINATE' ? 'bg-warning text-white border-warning' : 'border-border text-text-secondary hover:bg-gray-50'}`}>
                        <input type="radio" className="hidden" checked={quadrant === 'ELIMINATE'} onChange={() => setQuadrant('ELIMINATE')} />
                        <TrashIcon className="w-5 h-5" />
                        Eliminate
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-text-primary mb-1">Description (Optional)</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none h-20"
                      placeholder="Add supplementary details..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-text-primary mb-1">Due Date (Optional)</label>
                    <CustomDatePicker 
                      selected={dueDate}
                      onSelect={setDueDate}
                      placeholder="Select a deadline..."
                    />
                  </div>

                  <div className="pt-4">
                    <Button type="submit" className="w-full">
                      {initialTask ? "Update Task" : "Save Task"}
                    </Button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
