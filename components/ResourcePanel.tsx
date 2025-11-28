import React from 'react';
import { Alert, Resource } from '../types';
import { Activity, BarChart2, Shield, Radio } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';

interface ResourcePanelProps {
  resources: Resource[];
  alerts: Alert[];
}

export const ResourcePanel: React.FC<ResourcePanelProps> = ({ resources, alerts }) => {
  
  // Calculate stats for chart
  const openAlerts = alerts.filter(a => a.status === 'open').length;
  const activeMissions = alerts.filter(a => a.status === 'dispatched').length;
  const resolved = alerts.filter(a => a.status === 'resolved').length;

  const chartData = [
    { name: 'Open', value: openAlerts, color: '#ef4444' },
    { name: 'Active', value: activeMissions, color: '#3b82f6' },
    { name: 'Done', value: resolved, color: '#10b981' },
  ];

  return (
    <aside className="h-full flex flex-col gap-4">
      
      {/* System Status Card */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <h2 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-emerald-600" />
          System Status
        </h2>
        
        <div className="h-32 w-full">
           <ResponsiveContainer width="100%" height="100%">
             <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
               <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
               <RechartsTooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
               />
               <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                 {chartData.map((entry, index) => (
                   <Cell key={`cell-${index}`} fill={entry.color} />
                 ))}
               </Bar>
             </BarChart>
           </ResponsiveContainer>
        </div>
        <div className="mt-2 text-center text-xs text-slate-500">Live Incident Breakdown</div>
      </div>

      {/* Resources List */}
      <div className="flex-1 bg-white p-4 rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        <h2 className="font-bold text-slate-800 flex items-center gap-2 mb-3">
          <Shield className="w-5 h-5 text-sky-600" />
          Available Assets
        </h2>
        
        <div className="space-y-3 overflow-y-auto custom-scrollbar pr-1">
          {resources.map((r) => {
             const usagePercent = ((r.total - r.available) / r.total) * 100;
             return (
              <div key={r.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-medium text-sm text-slate-800">{r.name}</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wide">{r.type}</div>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${r.available === 0 ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                    {r.available}/{r.total}
                  </span>
                </div>
                
                {/* Usage Bar */}
                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${usagePercent > 80 ? 'bg-red-500' : 'bg-sky-500'}`} 
                    style={{ width: `${usagePercent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Command & Control</h3>
        <button className="w-full flex items-center justify-center gap-2 bg-slate-800 text-white py-2 rounded-lg text-sm hover:bg-slate-700 transition-colors mb-2">
          <Radio className="w-4 h-4" />
          Broadcast Alert
        </button>
        <button className="w-full flex items-center justify-center gap-2 border border-slate-300 text-slate-700 py-2 rounded-lg text-sm hover:bg-slate-50 transition-colors">
          <BarChart2 className="w-4 h-4" />
          Export Report
        </button>
      </div>

    </aside>
  );
};