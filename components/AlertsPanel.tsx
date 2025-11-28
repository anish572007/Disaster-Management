import React from 'react';
import { Alert, FilterType, Severity } from '../types';
import { Filter, Clock, MapPin, CheckCircle, AlertTriangle } from 'lucide-react';

interface AlertsPanelProps {
  alerts: Alert[];
  filter: FilterType;
  setFilter: (f: FilterType) => void;
  selectedAlertId: number | null;
  onSelectAlert: (id: number) => void;
  onDispatch: (id: number) => void;
  onResolve: (id: number) => void;
}

const severityColor = (sev: Severity) => {
  if (sev === "high") return "bg-red-500 text-white";
  if (sev === "medium") return "bg-amber-500 text-white";
  return "bg-slate-500 text-white";
};

export const AlertsPanel: React.FC<AlertsPanelProps> = ({
  alerts,
  filter,
  setFilter,
  selectedAlertId,
  onSelectAlert,
  onDispatch,
  onResolve
}) => {
  
  const visibleAlerts = alerts.filter((a) => filter === "all" || a.severity === filter);

  return (
    <aside className="h-full flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-slate-800 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-sky-600" />
            Incoming Alerts
          </h2>
          <span className="text-xs font-mono bg-slate-100 text-slate-500 px-2 py-1 rounded-full">
            {visibleAlerts.length}
          </span>
        </div>
        <div className="flex gap-2 text-xs">
          {(['all', 'high', 'medium', 'low'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filter === f
                  ? "bg-slate-800 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
        {visibleAlerts.map((a) => (
          <div
            key={a.id}
            onClick={() => onSelectAlert(a.id)}
            className={`p-4 rounded-xl border transition-all cursor-pointer hover:shadow-md ${
              selectedAlertId === a.id
                ? "border-sky-500 bg-sky-50 ring-1 ring-sky-200"
                : "border-slate-100 bg-white hover:border-slate-300"
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full tracking-wide ${severityColor(a.severity)}`}>
                  {a.severity}
                </span>
                <span className="text-xs text-slate-400 font-mono">#{a.id}</span>
              </div>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                 a.status === 'open' ? 'bg-red-100 text-red-700' : 
                 a.status === 'dispatched' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
              }`}>
                {a.status}
              </span>
            </div>

            <h3 className="text-sm font-semibold text-slate-800 mb-1">{a.title}</h3>
            
            <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {a.location}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {a.time}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2">
               <button 
                  onClick={(e) => { e.stopPropagation(); onDispatch(a.id); }}
                  disabled={a.status !== "open"}
                  className="text-xs font-medium bg-slate-800 text-white py-1.5 rounded hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Dispatch
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onResolve(a.id); }}
                  className="text-xs font-medium border border-slate-200 text-slate-600 py-1.5 rounded hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  Resolve
                </button>
            </div>
          </div>
        ))}
        {visibleAlerts.length === 0 && (
          <div className="h-40 flex flex-col items-center justify-center text-slate-400">
            <CheckCircle className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-sm">No alerts matching filter</p>
          </div>
        )}
      </div>
    </aside>
  );
};