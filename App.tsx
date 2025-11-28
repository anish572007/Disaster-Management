import React, { useEffect, useState, useCallback } from "react";
import { Bell, Search, LayoutGrid, Menu } from "lucide-react";
import { generateAlert, getInitialAlerts, getInitialResources } from "./services/mockData";
import { Alert, Resource, FilterType } from "./types";
import { AlertsPanel } from "./components/AlertsPanel";
import { MapVisualization } from "./components/MapVisualization";
import { ResourcePanel } from "./components/ResourcePanel";

export default function App() {
  const [alerts, setAlerts] = useState<Alert[]>(getInitialAlerts());
  const [selectedAlertId, setSelectedAlertId] = useState<number | null>(null);
  const [resources, setResources] = useState<Resource[]>(getInitialResources());
  const [filter, setFilter] = useState<FilterType>("all");

  // Simulate real-time incoming alerts
  useEffect(() => {
    const id = setInterval(() => {
      // 30% chance to generate an alert every 8 seconds to prevent flooding
      if (Math.random() > 0.7) {
        setAlerts((prev) => {
          const newAlert = generateAlert();
          // Keep list manageable, max 20
          return [newAlert, ...prev].slice(0, 20);
        });
      }
    }, 8000);
    return () => clearInterval(id);
  }, []);

  const handleDispatch = useCallback((alertId: number) => {
    // Find alert
    const targetAlert = alerts.find(a => a.id === alertId);
    if (!targetAlert) return;

    // Find first available resource
    setResources((prev) => {
      const availableResourceIndex = prev.findIndex(r => r.available > 0);
      if (availableResourceIndex === -1) {
        window.alert("No resources available!");
        return prev;
      }
      
      const newResources = [...prev];
      newResources[availableResourceIndex] = {
        ...newResources[availableResourceIndex],
        available: newResources[availableResourceIndex].available - 1
      };
      return newResources;
    });

    setAlerts((prev) => 
      prev.map((a) => (a.id === alertId ? { ...a, status: "dispatched" } : a))
    );
  }, [alerts]);

  const handleResolve = useCallback((alertId: number) => {
    setAlerts((prev) => 
      prev.map((a) => (a.id === alertId ? { ...a, status: "resolved" } : a))
    );
    // Optionally return a resource here in a real app
    setResources((prev) => {
        // Mock returning a resource randomly to simulate cycle
        if (Math.random() > 0.5) {
             const busyResourceIndex = prev.findIndex(r => r.available < r.total);
             if (busyResourceIndex !== -1) {
                 const newResources = [...prev];
                 newResources[busyResourceIndex] = {
                     ...newResources[busyResourceIndex],
                     available: newResources[busyResourceIndex].available + 1
                 };
                 return newResources;
             }
        }
        return prev;
    })
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      
      {/* Top Navigation */}
      <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="bg-sky-600 p-2 rounded-lg text-white">
             <LayoutGrid className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Rescue<span className="text-sky-600">Command</span></h1>
        </div>

        <div className="flex-1 max-w-xl mx-8 hidden md:block">
          <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
             <input 
                type="text" 
                placeholder="Search incidents, units, or locations..." 
                className="w-full bg-slate-100 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
             />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
          <div className="h-8 w-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold">
            HQ
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <main className="flex-1 p-6 h-[calc(100vh-64px)] overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
          
          {/* Left Column: Alerts (3 cols) */}
          <div className="lg:col-span-3 h-full min-h-[400px]">
            <AlertsPanel 
              alerts={alerts}
              filter={filter}
              setFilter={setFilter}
              selectedAlertId={selectedAlertId}
              onSelectAlert={setSelectedAlertId}
              onDispatch={handleDispatch}
              onResolve={handleResolve}
            />
          </div>

          {/* Center Column: Map/Vis (6 cols) */}
          <div className="lg:col-span-6 h-full min-h-[400px]">
             <MapVisualization 
                alerts={alerts}
                selectedAlertId={selectedAlertId}
                onSelectAlert={setSelectedAlertId}
             />
          </div>

          {/* Right Column: Resources (3 cols) */}
          <div className="lg:col-span-3 h-full min-h-[400px]">
            <ResourcePanel 
              resources={resources} 
              alerts={alerts}
            />
          </div>

        </div>
      </main>
    </div>
  );
}