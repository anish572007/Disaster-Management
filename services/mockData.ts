import { Alert, Resource, Severity } from '../types';

let _id = 100;

const LOCATIONS = [
  "East Park Sector", 
  "North Ridge Heights", 
  "Riverbank Industrial", 
  "Hillview Estates", 
  "Downtown Core",
  "Westside Docks",
  "Central Station"
];

const DESCRIPTIONS = [
  "Reported flooding and trapped civilians. Roads may be blocked.",
  "Structural damage reported after tremor. Potential gas leak.",
  "Power outage affecting critical infrastructure. Traffic signals down.",
  "Medical emergency reported, multiple injuries. Access difficult.",
  "Fire alarm triggered in residential block. Smoke visible."
];

export function generateAlert(): Alert {
  const sev: Severity = (['high', 'medium', 'low'] as const)[Math.floor(Math.random() * 3)];
  _id += 1;
  const location = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
  
  return {
    id: _id,
    title: `${sev.toUpperCase()} - Incident #${_id}`,
    location: location,
    coordinates: {
      x: Math.floor(Math.random() * 90) + 5, // 5% to 95%
      y: Math.floor(Math.random() * 90) + 5
    },
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    severity: sev,
    status: 'open',
    description: DESCRIPTIONS[Math.floor(Math.random() * DESCRIPTIONS.length)],
  };
}

export function getInitialAlerts(): Alert[] {
  return Array.from({ length: 4 }).map(() => generateAlert());
}

export function getInitialResources(): Resource[] {
  return [
    { id: "r1", name: "Rescue Team Alpha", type: "Ground Unit", available: 3, total: 5 },
    { id: "r2", name: "Ambulance Squad B", type: "Medical", available: 2, total: 4 },
    { id: "r3", name: "Helicopter Air-1", type: "Airlift", available: 1, total: 2 },
    { id: "r4", name: "Fire Brigade 404", type: "Fire/Rescue", available: 4, total: 6 },
  ];
}