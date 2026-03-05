import AppLayout from "@/components/layout/AppLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function MatrixPage() {
  return (
    <AppLayout showRightPanel={false}>
      <div className="h-full flex flex-col">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-text-primary">Task Matrix</h2>
            <p className="text-sm md:text-base text-text-secondary">Eisenhower 2.0 Productivity System</p>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-auto">
              <input 
                type="text" 
                placeholder="Search quests..." 
                className="pl-10 pr-4 py-2.5 rounded-full border border-border bg-white text-sm w-full md:w-64 focus:outline-none focus:border-primary"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            </div>
            <Button className="w-full md:w-auto">+ Add New Quest</Button>
          </div>
        </div>

        {/* Matrix Grid */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 grid-rows-4 md:grid-rows-2 gap-4 md:gap-6 relative min-h-[800px] md:min-h-[600px] mt-4 md:mt-0">
          {/* Axis Labels (Hidden on mobile for simplicity, or adjusted) */}
          <div className="hidden md:block absolute -left-8 top-1/2 -translate-y-1/2 -rotate-90 text-xs font-bold uppercase tracking-widest text-text-label">Importance</div>
          <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-[-10px] text-xs font-bold uppercase tracking-widest text-text-label z-10 bg-bg-page px-4">Urgency</div>

          {/* Do First (Urgent & Important) */}
          <Card variant="tinted-danger" className="flex flex-col border-2 border-transparent">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[10px] md:text-xs font-extrabold uppercase tracking-widest text-danger">Do First</h3>
              <span className="text-danger font-bold">!</span>
            </div>
            <div className="flex-1 space-y-3">
              <Card className="border border-border">
                <h4 className="font-bold text-text-primary mb-2 text-sm md:text-base">Finalize Scholarship Proposal</h4>
                <div className="flex items-center gap-1 text-[10px] md:text-xs font-bold text-danger bg-danger-light w-fit px-2 py-1 rounded-full uppercase">
                  <span>🔴</span> Due in 2H
                </div>
              </Card>
              
              {/* Drop Zone active example */}
              <div className="border-2 border-dashed border-danger rounded-2xl p-4 flex items-center justify-center opacity-70">
                <span className="text-sm font-bold uppercase text-danger">Drop Here</span>
              </div>
            </div>
          </Card>

          {/* Schedule (Not Urgent & Important) */}
          <Card variant="tinted-success" className="flex flex-col border-2 border-transparent">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[10px] md:text-xs font-extrabold uppercase tracking-widest text-success">Schedule</h3>
              <span className="text-success">📅</span>
            </div>
            <div className="flex-1 space-y-3">
              <Card className="border border-border">
                <h4 className="font-bold text-text-primary mb-2 text-gray-400 line-through text-sm md:text-base">Deep Work: Thesis Chapter 3</h4>
                <div className="flex items-center gap-1 text-[10px] md:text-xs font-bold text-success bg-success-light w-fit px-2 py-1 rounded-full uppercase opacity-70">
                  <span>📅</span> Tomorrow, 09:00
                </div>
              </Card>
            </div>
          </Card>

          {/* Minimize / Delegate (Urgent & Not Important) */}
          <Card variant="tinted-info" className="flex flex-col border-2 border-transparent">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[10px] md:text-xs font-extrabold uppercase tracking-widest text-secondary">Minimize</h3>
              <span className="text-secondary">👥</span>
            </div>
            <div className="flex-1 space-y-3">
              <Card className="border border-border">
                <h4 className="font-bold text-text-primary mb-2 text-sm md:text-base">Reply to Library Inquiry</h4>
                <div className="flex items-center gap-1 text-[10px] md:text-xs font-bold text-secondary bg-secondary-light w-fit px-2 py-1 rounded-full uppercase">
                  <span>✉️</span> Delegate to Admin
                </div>
              </Card>
            </div>
          </Card>

          {/* Eliminate (Not Urgent & Not Important) */}
          <Card variant="tinted-warning" className="flex flex-col border-2 border-transparent">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[10px] md:text-xs font-extrabold uppercase tracking-widest text-warning">Eliminate</h3>
              <span className="text-warning">🗑️</span>
            </div>
            <div className="flex-1 space-y-3">
              <Card className="border border-border">
                <h4 className="font-bold text-text-primary mb-2 text-sm md:text-base">Scroll LinkedIn Feed</h4>
                <div className="flex items-center gap-1 text-[10px] md:text-xs font-bold text-warning bg-warning-light w-fit px-2 py-1 rounded-full uppercase">
                  <span>🚫</span> Avoid Today
                </div>
              </Card>
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
