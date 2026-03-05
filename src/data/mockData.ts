export interface Aircraft {
  id: string;
  model: string;
  manufacturer: string;
  engineType: string;
  year: number;
  status: "operational" | "maintenance" | "grounded";
  lastInspection: string;
  totalFlightHours: number;
}

export interface UploadedDocument {
  id: string;
  fileName: string;
  fileType: string;
  uploadDate: string;
  aircraftId: string;
  size: string;
}

export interface InspectionReport {
  id: string;
  aircraftId: string;
  aircraftModel: string;
  date: string;
  enginePressure: number;
  engineTemp: number;
  vibrationLevel: number;
  hydraulicPressure: number;
  fuelFlow: string;
  status: "green" | "yellow" | "red";
  issues: string[];
  causes: string[];
  recommendations: string[];
}

export const initialAircraft: Aircraft[] = [
  { id: "ac-1", model: "Boeing 737-800", manufacturer: "Boeing", engineType: "CFM56-7B", year: 2018, status: "operational", lastInspection: "2026-02-28", totalFlightHours: 12450 },
  { id: "ac-2", model: "Airbus A320neo", manufacturer: "Airbus", engineType: "PW1100G", year: 2021, status: "operational", lastInspection: "2026-03-01", totalFlightHours: 5820 },
  { id: "ac-3", model: "ATR 72-600", manufacturer: "ATR", engineType: "PW127M", year: 2019, status: "maintenance", lastInspection: "2026-02-15", totalFlightHours: 8930 },
];

export const initialDocuments: UploadedDocument[] = [
  { id: "doc-1", fileName: "engine_manual_737.pdf", fileType: "PDF", uploadDate: "2026-02-20", aircraftId: "ac-1", size: "12.4 MB" },
  { id: "doc-2", fileName: "maintenance_log_2025.xlsx", fileType: "Excel", uploadDate: "2026-02-22", aircraftId: "ac-1", size: "3.2 MB" },
  { id: "doc-3", fileName: "failure_log_2023.xlsx", fileType: "Excel", uploadDate: "2026-02-25", aircraftId: "ac-2", size: "1.8 MB" },
  { id: "doc-4", fileName: "hydraulic_system_spec.pdf", fileType: "PDF", uploadDate: "2026-03-01", aircraftId: "ac-2", size: "8.7 MB" },
  { id: "doc-5", fileName: "atr72_service_bulletin.pdf", fileType: "PDF", uploadDate: "2026-02-18", aircraftId: "ac-3", size: "5.1 MB" },
];

export const initialReports: InspectionReport[] = [
  {
    id: "rpt-1", aircraftId: "ac-1", aircraftModel: "Boeing 737-800", date: "2026-02-28",
    enginePressure: 42, engineTemp: 620, vibrationLevel: 2.1, hydraulicPressure: 3000, fuelFlow: "Normal",
    status: "green", issues: [], causes: [], recommendations: ["Continue routine maintenance schedule"],
  },
  {
    id: "rpt-2", aircraftId: "ac-2", aircraftModel: "Airbus A320neo", date: "2026-03-01",
    enginePressure: 48, engineTemp: 710, vibrationLevel: 3.8, hydraulicPressure: 2750, fuelFlow: "Normal",
    status: "yellow",
    issues: ["Engine pressure above safe threshold", "Vibration slightly elevated"],
    causes: ["Possible fuel pump malfunction", "Turbine blade misalignment"],
    recommendations: ["Inspect turbine blades", "Check pressure regulator", "Schedule detailed engine inspection"],
  },
  {
    id: "rpt-3", aircraftId: "ac-3", aircraftModel: "ATR 72-600", date: "2026-02-15",
    enginePressure: 55, engineTemp: 780, vibrationLevel: 5.2, hydraulicPressure: 2200, fuelFlow: "Irregular",
    status: "red",
    issues: ["Critical engine pressure", "High vibration detected", "Hydraulic pressure low", "Irregular fuel flow"],
    causes: ["Compressor stall risk", "Bearing wear", "Hydraulic leak suspected"],
    recommendations: ["Ground aircraft immediately", "Full engine teardown inspection", "Replace hydraulic seals", "Fuel system diagnostic"],
  },
];

export const healthChartData = [
  { name: "Boeing 737", health: 92, target: 95 },
  { name: "A320neo", health: 74, target: 95 },
  { name: "ATR 72", health: 45, target: 95 },
];

export const inspectionActivityData = [
  { month: "Sep", inspections: 12 },
  { month: "Oct", inspections: 18 },
  { month: "Nov", inspections: 15 },
  { month: "Dec", inspections: 22 },
  { month: "Jan", inspections: 19 },
  { month: "Feb", inspections: 25 },
  { month: "Mar", inspections: 8 },
];

export const safeThresholds = {
  enginePressure: { min: 30, max: 45, unit: "PSI" },
  engineTemp: { min: 400, max: 700, unit: "°C" },
  vibrationLevel: { min: 0, max: 3.0, unit: "mm/s" },
  hydraulicPressure: { min: 2800, max: 3200, unit: "PSI" },
};

export const chatResponses: Record<string, { answer: string; sources: string[] }> = {
  "vibration": {
    answer: "Increasing engine vibration can be caused by several factors:\n\n1. **Turbine blade imbalance** — Worn or damaged blades create uneven rotational forces\n2. **Bearing wear** — Degraded bearings in the N1/N2 spool cause excessive play\n3. **Foreign Object Damage (FOD)** — Ingested debris can chip fan blades\n4. **Compressor stall** — Airflow disruption causes pulsating vibration patterns\n\nRecommended action: Perform borescope inspection and check vibration spectrum analysis data.",
    sources: ["engine_manual_737.pdf — Section 7.3 Vibration Analysis", "failure_log_2023.xlsx — Vibration Events Tab"],
  },
  "hydraulic": {
    answer: "Hydraulic pressure drops are commonly caused by:\n\n1. **Seal degradation** — O-ring or seal wear in actuators\n2. **Fluid contamination** — Particulate matter blocking valves\n3. **Pump cavitation** — Air ingestion in the hydraulic reservoir\n4. **Line leaks** — Micro-fractures in high-pressure lines\n\nImmediate steps: Check fluid level, inspect for visible leaks, and review hydraulic system BITE data.",
    sources: ["hydraulic_system_spec.pdf — Chapter 4: Troubleshooting", "maintenance_log_2025.xlsx — Hydraulic Section"],
  },
  "temperature": {
    answer: "Safe engine temperature ranges vary by engine type:\n\n- **CFM56-7B (Boeing 737):** Normal EGT 400–650°C, Max 700°C\n- **PW1100G (A320neo):** Normal EGT 420–680°C, Max 720°C  \n- **PW127M (ATR 72):** Normal ITT 750–850°C, Max 900°C\n\nTemperatures exceeding limits require immediate throttle reduction and maintenance inspection.",
    sources: ["engine_manual_737.pdf — Section 2.1 Operating Limits", "atr72_service_bulletin.pdf — Temperature Guidelines"],
  },
  "default": {
    answer: "Based on the available maintenance documentation, I can provide guidance on this topic. The RAG system has analyzed relevant documents in the knowledge base.\n\nFor specific technical queries, I recommend consulting the aircraft-specific maintenance manual and recent service bulletins. Would you like me to search for more specific information?",
    sources: ["maintenance_log_2025.xlsx", "engine_manual_737.pdf"],
  },
};
