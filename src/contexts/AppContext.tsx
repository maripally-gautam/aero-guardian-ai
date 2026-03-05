import React, { createContext, useContext, useState, ReactNode } from "react";
import {
  Aircraft, UploadedDocument, InspectionReport,
  initialAircraft, initialDocuments, initialReports,
} from "@/data/mockData";

interface AppContextType {
  aircraft: Aircraft[];
  addAircraft: (a: Omit<Aircraft, "id" | "status" | "lastInspection" | "totalFlightHours">) => void;
  documents: UploadedDocument[];
  addDocument: (d: Omit<UploadedDocument, "id" | "uploadDate">) => void;
  reports: InspectionReport[];
  addReport: (r: Omit<InspectionReport, "id" | "date">) => void;
}

const AppContext = createContext<AppContextType>({} as AppContextType);
export const useAppData = () => useContext(AppContext);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [aircraft, setAircraft] = useState<Aircraft[]>(initialAircraft);
  const [documents, setDocuments] = useState<UploadedDocument[]>(initialDocuments);
  const [reports, setReports] = useState<InspectionReport[]>(initialReports);

  const addAircraft = (a: Omit<Aircraft, "id" | "status" | "lastInspection" | "totalFlightHours">) => {
    setAircraft(prev => [...prev, {
      ...a, id: `ac-${Date.now()}`, status: "operational",
      lastInspection: new Date().toISOString().split("T")[0], totalFlightHours: 0,
    }]);
  };

  const addDocument = (d: Omit<UploadedDocument, "id" | "uploadDate">) => {
    setDocuments(prev => [...prev, {
      ...d, id: `doc-${Date.now()}`, uploadDate: new Date().toISOString().split("T")[0],
    }]);
  };

  const addReport = (r: Omit<InspectionReport, "id" | "date">) => {
    setReports(prev => [{
      ...r, id: `rpt-${Date.now()}`, date: new Date().toISOString().split("T")[0],
    }, ...prev]);
  };

  return (
    <AppContext.Provider value={{ aircraft, addAircraft, documents, addDocument, reports, addReport }}>
      {children}
    </AppContext.Provider>
  );
};
