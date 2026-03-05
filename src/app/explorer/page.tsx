import AppLayout from "@/components/layout/AppLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

export default function ExplorerPage() {
  return (
    <AppLayout
      rightPanel={
        <div className="space-y-6">
          <Button className="w-full justify-center bg-success border-success-dark">
            <span className="mr-2">+</span> Create New Note
          </Button>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-text-secondary mb-4">Recent Notes</h3>
            <div className="space-y-3">
              <Card className="flex gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-900 rounded-full flex-shrink-0 flex items-center justify-center text-lg md:text-xl overflow-hidden text-white">🌌</div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-text-primary leading-tight mb-1 truncate">Definite Integrals</h4>
                  <p className="text-xs text-text-secondary line-clamp-2 mb-2">Properties and fundamental limits of integration in calculus.</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="warning" size="sm" className="bg-orange-100 text-orange-600">Math</Badge>
                    <span className="text-[10px] md:text-xs text-gray-400">✦ 12 Conn.</span>
                  </div>
                </div>
              </Card>

              <Card className="flex gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-100 rounded-full flex-shrink-0 flex items-center justify-center text-lg md:text-xl">⚛️</div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-text-primary leading-tight mb-1 truncate">Next.js App Router</h4>
                  <p className="text-xs text-text-secondary line-clamp-2 mb-2">Layouts, loading states, and error boundaries in App Router.</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="info" size="sm" className="bg-blue-100 text-blue-600">Comp Sci</Badge>
                    <span className="text-[10px] md:text-xs text-gray-400">✦ 8 Conn.</span>
                  </div>
                </div>
              </Card>
            </div>
            
            <Button variant="ghost" className="w-full mt-4 border-2 border-dashed border-border text-text-secondary">
              View All Notes
            </Button>
          </div>
        </div>
      }
    >
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-text-primary">Interactive Graph</h2>
            <p className="text-sm md:text-base text-text-secondary">Connect the dots of your learning</p>
          </div>
          <div className="flex gap-2">
            <button className="w-8 h-8 md:w-10 md:h-10 bg-white border border-border rounded-full shadow-sm flex items-center justify-center hover:bg-gray-50 text-lg md:text-xl text-text-secondary">
              +
            </button>
            <button className="w-8 h-8 md:w-10 md:h-10 bg-white border border-border rounded-full shadow-sm flex items-center justify-center hover:bg-gray-50 text-lg md:text-xl text-text-secondary">
              -
            </button>
          </div>
        </div>

        <Card variant="container" className="flex-1 min-h-[500px] md:min-h-[600px] relative overflow-hidden bg-dot-pattern bg-[length:20px_20px] p-0 md:p-5">
          {/* Mock Node 1 - Active */}
          <div className="absolute top-[30%] left-[50%] md:left-[30%] -translate-x-1/2 -translate-y-1/2 z-20">
            {/* Tooltip */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] md:text-xs px-2 md:px-3 py-1.5 rounded-xl whitespace-nowrap font-bold shadow-lg">
              Click to open tasks!
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
            </div>
            
            {/* Glow */}
            <div className="absolute -inset-4 bg-primary opacity-20 blur-xl rounded-full"></div>
            
            {/* Node */}
            <div className="relative bg-primary text-white font-bold px-4 md:px-5 py-2 md:py-2.5 rounded-full shadow-lg flex items-center gap-2 cursor-pointer text-sm md:text-base whitespace-nowrap">
              <span>ƒx</span>
              Calculus Integrals
            </div>
          </div>

          {/* Connected Line Mock */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <path d="M 50% 30% Q 50% 45% 50% 60%" fill="none" stroke="var(--color-primary)" strokeWidth="2" className="md:hidden" />
            <path d="M 30% 30% Q 40% 40% 50% 40%" fill="none" stroke="var(--color-primary)" strokeWidth="2" className="hidden md:block" />
            
            <path d="M 50% 60% Q 30% 75% 30% 85%" fill="none" stroke="#CCCCCC" strokeWidth="2" strokeDasharray="5,5" className="md:hidden" />
            <path d="M 50% 40% Q 40% 60% 40% 70%" fill="none" stroke="#CCCCCC" strokeWidth="2" strokeDasharray="5,5" className="hidden md:block" />
          </svg>

          {/* Mock Node 2 - Default */}
          <div className="absolute top-[60%] md:top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2">
            <div className="bg-white border border-border text-text-primary font-bold px-3 md:px-4 py-1.5 md:py-2 rounded-2xl md:rounded-full shadow-sm flex items-center gap-2 cursor-pointer hover:shadow-md transition-all text-sm md:text-base whitespace-nowrap">
              <span className="text-secondary">▦</span>
              Linear Algebra Matrix
            </div>
          </div>

          {/* Mock Node 3 - Inactive */}
          <div className="absolute top-[85%] md:top-[70%] left-[30%] md:left-[40%] -translate-x-1/2 -translate-y-1/2">
            <div className="bg-white border border-border text-text-secondary font-bold px-2.5 md:px-3 py-1 md:py-1.5 rounded-full text-xs md:text-sm shadow-sm flex items-center gap-1 md:gap-2 cursor-pointer hover:text-text-primary transition-all whitespace-nowrap">
              <span className="text-pink-500">文</span>
              JLPT N5 Kanji
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
