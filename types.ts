export type Severity = 'high' | 'medium' | 'low';
export type AlertStatus = 'open' | 'dispatched' | 'resolved';

export interface Alert {
  id: number;
  title: string;
  location: string;
  coordinates: { x: number; y: number }; // Percentage 0-100 for the mock map
  time: string;
  severity: Severity;
  status: AlertStatus;
  description: string;
}

export interface Resource {
  id: string;
  name: string;
  type: string;
  available: number;
  total: number;
}

export type FilterType = 'all' | Severity;