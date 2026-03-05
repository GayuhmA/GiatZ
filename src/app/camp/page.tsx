import AppLayout from "@/components/layout/AppLayout";
import Card from "@/components/ui/Card";

export default function CampPage() {
  return (
    <AppLayout showRightPanel={false}>
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-text-primary">Training Camp</h2>
            <p className="text-sm md:text-base text-text-secondary">Smart Study Engine (AI-Flashcard & Quiz)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
          {/* Flashcard Area */}
          <div className="flex flex-col">
            <h3 className="font-bold text-xl mb-4 text-text-primary">Daily Review</h3>
            <Card variant="container" className="flex-1 flex flex-col items-center justify-center p-6 md:p-8 min-h-[400px]">
              
              {/* Mock Flashcard */}
              <div className="w-full max-w-md aspect-[4/3] relative perspective-1000">
                <div className="w-full h-full bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-border flex flex-col items-center justify-center p-6 md:p-8 cursor-pointer hover:shadow-[0_15px_50px_rgba(0,0,0,0.15)] transition-all">
                  <span className="absolute top-4 right-4 md:top-6 md:right-6 text-xl md:text-2xl text-gray-300">🔄</span>
                  <span className="text-secondary text-3xl md:text-4xl mb-4 md:mb-6">⚛️</span>
                  <p className="text-xl md:text-2xl font-bold text-center text-text-primary">
                    What is the time complexity of QuickSort?
                  </p>
                  <p className="text-text-secondary mt-4 md:mt-6 text-xs md:text-sm font-bold uppercase tracking-widest">
                    Tap to flip
                  </p>
                </div>
              </div>

              {/* Progress */}
              <div className="w-full max-w-md flex items-center gap-4 mt-8">
                <span className="font-bold text-text-secondary">12/20</span>
                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[60%] rounded-full"></div>
                </div>
              </div>
            </Card>
          </div>

          {/* Mastery Heatmap Area */}
          <div className="flex flex-col">
            <h3 className="font-bold text-xl mb-4 text-text-primary">Course Mastery Radar</h3>
            <Card variant="container" className="flex-1 flex flex-col items-center justify-center p-6 md:p-8 min-h-[400px]">
              {/* Mock Radar Chart */}
              <div className="w-full max-w-[250px] aspect-square relative mb-6">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  {/* Grid Lines */}
                  {Array.from({ length: 5 }).map((_, i) => (
                    <polygon
                      key={i}
                      points="100,10 186.6,50 186.6,150 100,190 13.4,150 13.4,50"
                      fill="none"
                      stroke="var(--color-border)"
                      strokeWidth="1"
                      transform={`scale(${0.2 * (i + 1)})`}
                      style={{ transformOrigin: 'center' }}
                    />
                  ))}
                  {/* Axes */}
                  <line x1="100" y1="10" x2="100" y2="100" stroke="var(--color-border)" />
                  <line x1="186.6" y1="50" x2="100" y2="100" stroke="var(--color-border)" />
                  <line x1="186.6" y1="150" x2="100" y2="100" stroke="var(--color-border)" />
                  <line x1="100" y1="190" x2="100" y2="100" stroke="var(--color-border)" />
                  <line x1="13.4" y1="150" x2="100" y2="100" stroke="var(--color-border)" />
                  <line x1="13.4" y1="50" x2="100" y2="100" stroke="var(--color-border)" />
                  
                  {/* Data Polygon */}
                  <polygon
                    points="100,28.8 160,60 143.3,125 100,163 39.4,115 56.6,50"
                    fill="var(--color-primary)"
                    fillOpacity="0.5"
                    stroke="var(--color-primary-dark)"
                    strokeWidth="2"
                  />
                  
                  {/* Labels */}
                  <text x="100" y="-0" textAnchor="middle" fontSize="8" fontWeight="bold" fill="var(--color-text-primary)">Math</text>
                  <text x="200" y="50" textAnchor="middle" fontSize="8" fontWeight="bold" fill="var(--color-text-primary)">Physics</text>
                  <text x="200" y="160" textAnchor="middle" fontSize="8" fontWeight="bold" fill="var(--color-text-primary)">History</text>
                  <text x="100" y="210" textAnchor="middle" fontSize="8" fontWeight="bold" fill="var(--color-text-primary)">Literature</text>
                  <text x="0" y="160" textAnchor="middle" fontSize="8" fontWeight="bold" fill="var(--color-text-primary)">Chem</text>
                  <text x="0" y="50" textAnchor="middle" fontSize="8" fontWeight="bold" fill="var(--color-text-primary)">Bio</text>
                </svg>
              </div>

              <div className="w-full space-y-3">
                <div className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded-xl">
                  <span className="font-bold text-sm">Strongest Subject</span>
                  <span className="font-bold text-sm text-primary uppercase">Mathematics</span>
                </div>
                <div className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded-xl">
                  <span className="font-bold text-sm">Needs Review</span>
                  <span className="font-bold text-sm text-danger uppercase">Chemistry</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
