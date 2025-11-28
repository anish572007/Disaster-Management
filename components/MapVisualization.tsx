import React from 'react';
import { Alert } from '../types';
import { MapPin, Info, Navigation, Users } from 'lucide-react';

interface MapVisualizationProps {
  alerts: Alert[];
  selectedAlertId: number | null;
  onSelectAlert: (id: number) => void;
}

export const MapVisualization: React.FC<MapVisualizationProps> = ({ alerts, selectedAlertId, onSelectAlert }) => {
  const selectedAlert = alerts.find(a => a.id === selectedAlertId);

  return (
    <div className="h-full flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative">
      {/* Map Header Overlay */}
      <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm border border-slate-200 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
        <span className="text-xs font-semibold text-slate-700">Live Incident Map</span>
      </div>

      {/* The Visual Map Area */}
      <div className="flex-1 bg-slate-50 relative group cursor-crosshair overflow-hidden">
        {/* Abstract Grid Pattern Background */}
        <div className="absolute inset-0 opacity-10" 
             style={{ 
               backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)', 
               backgroundSize: '20px 20px' 
             }}>
        </div>

        {/* City Zones (Decorations) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
           <path d="M 0 50 Q 200 150 400 50 T 800 50" stroke="#cbd5e1" strokeWidth="2" fill="none" strokeDasharray="5,5" />
           <circle cx="50%" cy="50%" r="150" stroke="#e2e8f0" strokeWidth="20" fill="none" opacity="0.5" />
        </svg>

        {/* Render Alerts as Pins */}
        {alerts.map((alert) => (
          <button
            key={alert.id}
            onClick={() => onSelectAlert(alert.id)}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 group-hover:scale-100 ${
              selectedAlertId === alert.id ? 'z-20 scale-125' : 'z-10 scale-100 hover:scale-110'
            }`}
            style={{ left: `${alert.coordinates.x}%`, top: `${alert.coordinates.y}%` }}
          >
            {/* Ping Effect for High Severity */}
            {alert.severity === 'high' && alert.status === 'open' && (
              <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping"></span>
            )}
            
            <div className={`relative rounded-full shadow-lg p-1.5 transition-colors ${
              selectedAlertId === alert.id 
                ? 'bg-slate-800 text-white' 
                : alert.severity === 'high' ? 'bg-red-500 text-white' 
                : alert.severity === 'medium' ? 'bg-amber-500 text-white'
                : 'bg-slate-500 text-white'
            }`}>
              <MapPin className="w-4 h-4" />
            </div>
            
            {/* Tooltip on hover or selection */}
            {(selectedAlertId === alert.id) && (
              <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-30">
                {alert.location}
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Bottom Detail Panel */}
      <div className="h-48 border-t border-slate-200 bg-white p-4">
        {selectedAlert ? (
          <div className="h-full flex flex-col">
            <div className="flex items-start justify-between">
               <div>
                  <h3 className="font-bold text-lg text-slate-800">{selectedAlert.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                    <Navigation className="w-4 h-4" />
                    {selectedAlert.location}
                    <span className="text-slate-300">|</span>
                    <span>{selectedAlert.time}</span>
                  </div>
               </div>
               <div className="flex flex-col items-end">
                 <span className={`text-xs font-bold uppercase tracking-wider ${
                    selectedAlert.status === 'open' ? 'text-red-600' : 'text-slate-600'
                 }`}>
                   Status: {selectedAlert.status}
                 </span>
               </div>
            </div>

            <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-100 text-sm text-slate-700 flex-1 overflow-y-auto">
              <p className="leading-relaxed">{selectedAlert.description}</p>
            </div>

            {selectedAlert.status === 'dispatched' && (
              <div className="mt-2 flex items-center gap-2 text-xs text-blue-600 font-medium bg-blue-50 px-3 py-2 rounded">
                <Users className="w-4 h-4" />
                Response team en route to coordinates {selectedAlert.coordinates.x}, {selectedAlert.coordinates.y}
              </div>
            )}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400">
            <Info className="w-8 h-8 mb-2 opacity-50" />
            <p>Select an incident on the map or list to view details</p>
          </div>
        )}
      </div>
    </div>
  );
};