"use client";

import { useMemo, useState } from "react";
import Card from "@/components/shared/Card";

interface ActivityHeatmapProps {
  heatmapData: Record<string, number>;
}

export default function ActivityHeatmap({ heatmapData }: ActivityHeatmapProps) {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const years = [currentYear, currentYear - 1, currentYear - 2, currentYear - 3].filter(y => y >= 2024); // Assuming app started in 2024 or later

  const { columns, monthLabels } = useMemo(() => {
    const days: (Date | null)[] = [];
    const startDate = new Date(selectedYear, 0, 1);
    const endDate = new Date(selectedYear, 11, 31);
    
    // Fill empty days at start for alignment (Sunday = 0, Monday = 1)
    for (let i = 0; i < startDate.getDay(); i++) {
        days.push(null);
    }
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        days.push(new Date(d));
    }
    
    const cols = [];
    const labels = [];
    
    for (let i = 0; i < days.length; i += 7) {
        const chunk = days.slice(i, i + 7);
        cols.push(chunk);
        
        // Find if any day in this chunk is the first of a new month
        const firstDayOfMonth = chunk.find(d => d && d.getDate() === 1);
        if (firstDayOfMonth) {
           labels.push({ 
               label: firstDayOfMonth.toLocaleString('default', { month: 'short' }), 
               colIndex: cols.length - 1 
           });
        }
    }
    
    return { columns: cols, monthLabels: labels };
  }, [selectedYear]);

  // Handle color
  const getColor = (units: number) => {
      if (units === 0) return "bg-[#ebedf0]";
      if (units <= 2) return "bg-[#9be9a8]";
      if (units <= 5) return "bg-[#40c463]";
      if (units <= 8) return "bg-[#30a14e]";
      return "bg-[#216e39]";
  };

  const totalContributions = useMemo(() => {
     let total = 0;
     Object.keys(heatmapData).forEach(key => {
         if (key.startsWith(selectedYear.toString())) {
             total += heatmapData[key];
         }
     });
     return total;
  }, [heatmapData, selectedYear]);

  return (
    <Card variant="static-content" className="p-5 md:p-6 border border-gray-100 shadow-sm w-full font-body">
      <div className="flex justify-between items-center mb-6">
         <div>
            <h3 className="font-extrabold text-xl lg:text-2xl text-text-primary capitalize mb-1">
               {totalContributions} units di {selectedYear}
            </h3>
            <p className="text-text-secondary text-sm">Heatmap Produktivitas</p>
         </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6 w-full">
         <div className="flex-1 overflow-x-auto scrollbar-hide pb-4 pt-8 -mt-8">
            {/* Months Header - offset by left label column width + gaps */}
            <div className="relative h-6 min-w-max mb-1 ml-9 mt-8">
               {monthLabels.map(m => (
                 <span 
                   key={m.colIndex} 
                   className="absolute text-xs text-text-secondary"
                   style={{ left: `${m.colIndex * 15}px` }}
                 >
                    {m.label}
                 </span>
               ))}
            </div>

            {/* Grid Container */}
            <div className="flex gap-1 min-w-max">
               {/* Days Label Column */}
               <div className="flex flex-col gap-1 text-[10px] text-text-secondary w-8 pr-1 pt-0.5">
                  <span className="h-3"></span>
                  <span className="h-3 leading-3">Sen</span>
                  <span className="h-3"></span>
                  <span className="h-3 leading-3">Rab</span>
                  <span className="h-3"></span>
                  <span className="h-3 leading-3">Jum</span>
                  <span className="h-3"></span>
               </div>
               
               {/* Columns & Cells */}
               {columns.map((col, colIndex) => (
                 <div key={colIndex} className="flex flex-col gap-1 group/col">
                   {col.map((day, rowIndex) => {
                     if (!day) return <div key={`empty-${rowIndex}`} className="w-3 h-3 bg-transparent" />;
                     
                     const dateStr = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
                     const units = heatmapData[dateStr] || 0;
                     const bgColor = getColor(units);
                     
                     const isFuture = day > new Date();
                     
                     return (
                        <div key={dateStr} className="group/cell relative w-3 h-3">
                          <div 
                            className={`w-full h-full rounded-[2px] ${isFuture ? "bg-transparent" : bgColor} border border-black/5 hover:border-black/30 outline-none transition-colors duration-200 cursor-pointer`}
                          />
                          {!isFuture && (
                            <div className="absolute z-[100] invisible group-hover/cell:visible opacity-0 group-hover/cell:opacity-100 transition-opacity duration-200 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 text-white text-xs whitespace-nowrap rounded font-medium shadow-xl pointer-events-none flex flex-col items-center">
                              <span>{units === 0 ? "Nggak ada aktivitas" : `${units} units`} pada {day.toLocaleString('id-ID', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                              {/* Arrow */}
                              <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-slate-800"></div>
                            </div>
                          )}
                        </div>
                     );
                   })}
                 </div>
               ))}
            </div>
            
            {/* Legend inside grid area below */}
            <div className="flex items-center gap-1.5 mt-4 text-xs text-text-secondary ml-9">
               <span>Sedikit</span>
               <div className="w-3 h-3 rounded-[2px] border border-black/5 bg-[#ebedf0]"></div>
               <div className="w-3 h-3 rounded-[2px] border border-black/5 bg-[#9be9a8]"></div>
               <div className="w-3 h-3 rounded-[2px] border border-black/5 bg-[#40c463]"></div>
               <div className="w-3 h-3 rounded-[2px] border border-black/5 bg-[#30a14e]"></div>
               <div className="w-3 h-3 rounded-[2px] border border-black/5 bg-[#216e39]"></div>
               <span>Banyak</span>
            </div>
         </div>

         {/* Year Filter column */}
         <div className="flex flex-row xl:flex-col gap-2 shrink-0 border-t xl:border-t-0 xl:border-l border-border pt-4 xl:pt-0 xl:pl-6 min-w-[100px] overflow-x-auto scrollbar-hide justify-start xl:justify-start">
            {years.map(y => (
              <button
                key={y}
                onClick={() => setSelectedYear(y)}
                className={`py-2 px-4 rounded-md text-sm text-left transition-all duration-200 whitespace-nowrap outline-none ${
                   selectedYear === y 
                   ? "bg-primary text-white font-bold shadow-md" 
                   : "text-text-secondary hover:bg-gray-100 font-medium"
                }`}
              >
                {y}
              </button>
            ))}
         </div>
      </div>
    </Card>
  );
}
