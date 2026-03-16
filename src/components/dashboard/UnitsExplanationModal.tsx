import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { X, CheckCircle2, Sparkles, Rocket, Trophy, BookOpen } from 'lucide-react';
import Button from '../shared/Button';

interface UnitsExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UnitsExplanationModal({ isOpen, onClose }: UnitsExplanationModalProps) {
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-start mb-4">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-extrabold leading-6 text-text-primary flex items-center gap-2"
                  >
                    <Sparkles className="w-6 h-6 text-orange-500" />
                    Cara Dapetin Activity Units
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="mt-4 space-y-4">
                  <p className="text-sm text-text-secondary">
                    Activity Units adalah ukuran produktivitas harian kamu. Kamu bisa dapetin mereka dengan konsisten menyelesaikan task dan sesi belajar.
                  </p>

                  <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex gap-4">
                    <CheckCircle2 className="w-6 h-6 text-success shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold tracking-tight text-text-primary text-sm">Task Matrix</h4>
                      <p className="text-xs text-text-secondary mt-1">
                        Selesaikan 1 task dari kuadran mana pun buat dapetin <strong className="text-primary font-bold">1 Unit</strong>.
                      </p>
                    </div>
                  </div>

                  <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex gap-4">
                    <Rocket className="w-6 h-6 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold tracking-tight text-text-primary text-sm">Focus Orbit</h4>
                      <p className="text-xs text-text-secondary mt-1">
                        Selesaikan sesi fokus Pomodoro 25 menit buat dapetin <strong className="text-primary font-bold">1 Unit</strong>.
                      </p>
                    </div>
                  </div>

                  <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex gap-4">
                    <BookOpen className="w-6 h-6 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold tracking-tight text-text-primary text-sm">Mind Glance</h4>
                      <p className="text-xs text-text-secondary mt-1">
                        Buat note atau node baru buat memperkuat belajar dan dapetin <strong className="text-primary font-bold">1 Unit</strong>.
                      </p>
                    </div>
                  </div>

                  <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex gap-4">
                    <Trophy className="w-6 h-6 text-warning shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold tracking-tight text-text-primary text-sm">Train Camp</h4>
                      <p className="text-xs text-text-secondary mt-1">
                        Selesaikan Quiz atau review set Flashcard buat menguji pengetahuan dan dapetin <strong className="text-primary font-bold">1 Unit</strong>.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <Button
                    onClick={onClose}
                    variant="primary"
                    className="w-full flex items-center justify-center font-bold font-heading"
                  >
                    Oke, paham!
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
