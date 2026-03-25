
"use client";

import { LineChart, Loader2 } from "lucide-react";

interface Progress {
  date: string;
  weight: number;
  bmi: number;
  bodyFat: number;
}

export default function ProgressTracker() {
  



  return (
    <div className="space-y-6">
       <title>Progress | Dashboard - Flexify</title>
      {/* Header */}
      <div className="flex items-center gap-3">
        <LineChart className="text-[var(--primary)]" />
        <h2 className="text-xl font-black uppercase tracking-tight text-[var(--text-primary)]">
          Progress Tracker
        </h2>
      </div>

     

      {/* Table */}
      <div className="border border-[var(--border-color)] rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[var(--bg-secondary)]">
            <tr className="text-left text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
              <th className="p-3">Date</th>
              <th>Weight</th>
              <th>BMI</th>
              <th>Fat %</th>
            </tr>
          </thead>
          <tbody>
            
              <tr
                
                className="border-t border-[var(--border-color)]"
              >
                <td className="p-3">Date</td>
                <td>weight</td>
                <td>bmi</td>
                <td>bodyFat</td>
              </tr>
            
          </tbody>
        </table>
      </div>
    </div>
  );
}