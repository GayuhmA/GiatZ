import AppLayout from "@/components/layout/AppLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function OrbitPage() {
  return (
    <AppLayout
      rightPanel={
        <div className="space-y-6">
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-text-primary">Sound Mixer</h3>
              <button className="text-text-secondary hover:text-primary">
                <span className="text-lg">⚙️</span>
              </button>
            </div>
            
            <div className="flex justify-around mb-6">
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full border-2 border-secondary text-secondary flex items-center justify-center text-xl bg-secondary-light">💧</div>
                <span className="text-xs font-bold uppercase text-text-label">Rain</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full border-2 border-primary text-primary flex items-center justify-center text-xl bg-primary-light">☕</div>
                <span className="text-xs font-bold uppercase text-text-label">Cafe</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full border-2 border-success text-success flex items-center justify-center text-xl bg-success-light">🌲</div>
                <span className="text-xs font-bold uppercase text-text-label">Forest</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold uppercase text-text-label">Mix Status</span>
                <span className="text-xs font-bold text-primary">Active</span>
              </div>
              <div className="flex h-3 gap-1 w-full rounded-full overflow-hidden bg-gray-100">
                <div className="bg-secondary w-1/3"></div>
                <div className="bg-primary w-1/4"></div>
                <div className="bg-success w-1/5"></div>
              </div>
            </div>
          </Card>
        </div>
      }
    >
      <div className="flex flex-col items-center justify-center h-full min-h-[500px] md:min-h-[600px]">
        <Card variant="container" className="w-full max-w-2xl flex flex-col items-center p-8 md:p-12 relative overflow-hidden">
          {/* Mock Orbit Visualization */}
          <div className="relative w-[250px] h-[250px] md:w-[300px] md:h-[300px] flex items-center justify-center mb-8">
            {/* Orbit Path */}
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary opacity-40"></div>
            
            {/* Center Planet / Timer */}
            <div className="w-[150px] h-[150px] md:w-[180px] md:h-[180px] bg-primary rounded-full shadow-[0_8px_32px_rgba(255,150,0,0.4)] flex flex-col items-center justify-center text-white z-10">
              <span className="text-4xl md:text-5xl font-extrabold tracking-tighter">15:32</span>
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest opacity-90 mt-1">Remaining</span>
            </div>

            {/* Orbiting Elements (Static Mock) */}
            <div className="absolute top-0 right-4 md:right-10 text-xl md:text-2xl">🚀</div>
            <div className="absolute bottom-6 md:bottom-10 left-0 text-xl md:text-2xl">🌲</div>
            <div className="absolute -top-4 text-xl md:text-2xl">📖</div>
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold text-text-primary mb-2 text-center">Deep Work Orbit</h2>
          <p className="text-sm md:text-base text-text-secondary mb-8 text-center max-w-md">
            You're orbiting success! Keep the momentum going.
          </p>

          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <Button className="w-full md:w-auto">Pause Session</Button>
            <Button variant="ghost" className="w-full md:w-auto bg-gray-100 border border-border">Skip</Button>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
