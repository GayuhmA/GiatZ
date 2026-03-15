import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import { X, Settings2 } from 'lucide-react';
import Button from '../shared/Button';
import { useAuthStore } from '@/store/useAuthStore';

interface DailyGoalSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DailyGoalSettingsModal({ isOpen, onClose }: DailyGoalSettingsModalProps) {
  const { user, updateDailyGoal } = useAuthStore();
  const [goal, setGoal] = useState<number>(user?.dailyGoalUnits || 5);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user?.dailyGoalUnits) {
      setGoal(user.dailyGoalUnits);
    }
  }, [user?.dailyGoalUnits]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updateDailyGoal(goal);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-100" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
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
              <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-start mb-4">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-extrabold leading-6 text-text-primary flex items-center gap-2"
                  >
                    <Settings2 className="w-6 h-6 text-orange-500" />
                    Set Daily Goal
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="mt-4">
                  <p className="text-sm text-text-secondary mb-4">
                    Choose how many Activity Units you want to target each day.
                  </p>

                  <div className="flex items-center justify-center gap-6 my-6">
                    <button
                      onClick={() => setGoal(Math.max(1, goal - 1))}
                      className="w-12 h-12 flex items-center justify-center rounded-full bg-orange-100 text-orange-600 hover:bg-orange-200 font-extrabold text-2xl transition-colors"
                    >
                      -
                    </button>
                    <div className="text-4xl font-black text-text-primary tracking-tighter w-16 text-center">
                      {goal}
                    </div>
                    <button
                      onClick={() => setGoal(goal + 1)}
                      className="w-12 h-12 flex items-center justify-center rounded-full bg-orange-100 text-orange-600 hover:bg-orange-200 font-extrabold text-2xl transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="mt-6">
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    variant="primary"
                    className="w-full justify-center disabled:opacity-50 font-bold"
                  >
                    {isSaving ? "Saving..." : "Save Goal"}
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
