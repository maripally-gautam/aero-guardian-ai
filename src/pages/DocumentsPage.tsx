import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppData } from "@/contexts/AppContext";
import { Upload, FileText, CheckCircle, Loader2, Sparkles, Database, Scissors, CloudUpload } from "lucide-react";

const pipelineSteps = [
  { label: "Extracting text", icon: FileText },
  { label: "Chunking", icon: Scissors },
  { label: "Embeddings", icon: Sparkles },
  { label: "Vector Store", icon: Database },
  { label: "Complete", icon: CheckCircle },
];

const DocumentsPage = () => {
  const { documents, addDocument, aircraft } = useAppData();
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pipelineStep, setPipelineStep] = useState(-1);
  const [selectedAircraft, setSelectedAircraft] = useState("");

  const simulateUpload = useCallback((fileName: string, fileType: string) => {
    setUploading(true); setProgress(0); setPipelineStep(0);
    let i = 0;
    const interval = setInterval(() => {
      setProgress((i + 1) * 20); setPipelineStep(i); i++;
      if (i >= 5) {
        clearInterval(interval);
        setTimeout(() => {
          addDocument({ fileName, fileType, aircraftId: selectedAircraft || "ac-1", size: `${(Math.random() * 10 + 1).toFixed(1)} MB` });
          setUploading(false); setPipelineStep(-1); setProgress(0);
        }, 600);
      }
    }, 800);
  }, [addDocument, selectedAircraft]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) simulateUpload(file.name, file.name.split(".").pop()?.toUpperCase() || "TXT");
  }, [simulateUpload]);

  const handleFileSelect = () => {
    const input = document.createElement("input");
    input.type = "file"; input.accept = ".pdf,.xlsx,.csv,.txt,.docx";
    input.onchange = (e: any) => { const file = e.target.files[0]; if (file) simulateUpload(file.name, file.name.split(".").pop()?.toUpperCase() || "TXT"); };
    input.click();
  };

  const typeColor: Record<string, string> = { PDF: "bg-destructive/15 text-destructive border-destructive/20", Excel: "bg-success/15 text-success border-success/20", CSV: "bg-accent/15 text-accent border-accent/20", TXT: "bg-muted text-muted-foreground", DOCX: "bg-primary/15 text-primary border-primary/20", XLSX: "bg-success/15 text-success border-success/20" };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div>
          <h1 className="text-3xl font-heading font-bold">Document Upload</h1>
          <p className="text-muted-foreground font-heading mt-1">Upload maintenance documents for RAG processing</p>
        </div>

        <div className="flex gap-4 items-end">
          <div className="w-64">
            <p className="text-sm text-muted-foreground font-heading mb-1.5">Associate with aircraft</p>
            <Select value={selectedAircraft} onValueChange={setSelectedAircraft}>
              <SelectTrigger className="bg-secondary/30 border-border/50 rounded-lg"><SelectValue placeholder="Select aircraft" /></SelectTrigger>
              <SelectContent className="glass-strong border-border/50 rounded-xl">
                {aircraft.map(ac => <SelectItem key={ac.id} value={ac.id}>{ac.model}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <motion.div
          onDragOver={e => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={!uploading ? handleFileSelect : undefined}
          whileHover={!uploading ? { scale: 1.005 } : undefined}
          className={`border-2 border-dashed rounded-2xl p-14 text-center cursor-pointer transition-all duration-500 ${
            dragActive ? "border-primary bg-primary/5 glow-primary" : "border-border/50 hover:border-primary/40 hover:bg-primary/[0.02]"
          }`}
        >
          {uploading ? (
            <div className="space-y-6">
              <div className="w-16 h-16 mx-auto rounded-2xl gradient-primary flex items-center justify-center glow-primary">
                <Loader2 className="h-8 w-8 text-primary-foreground animate-spin" />
              </div>
              <Progress value={progress} className="max-w-sm mx-auto h-2 rounded-full" />
              <div className="flex justify-center gap-4">
                {pipelineSteps.map((step, i) => (
                  <motion.div key={step.label} initial={{ opacity: 0.3 }} animate={{ opacity: i <= pipelineStep ? 1 : 0.3 }} className="flex flex-col items-center gap-1.5 text-xs">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${i <= pipelineStep ? "bg-primary/15 text-primary" : "bg-secondary/30 text-muted-foreground"}`}>
                      <step.icon className="h-4 w-4" />
                    </div>
                    <span className={`font-heading ${i === pipelineStep ? "text-primary" : "text-muted-foreground"}`}>{step.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <CloudUpload className="h-14 w-14 mx-auto text-muted-foreground/40 mb-4" />
              <p className="font-heading text-xl text-foreground">Drag & drop files here</p>
              <p className="text-sm text-muted-foreground mt-2 font-heading">or click to browse — PDF, Excel, CSV, TXT, DOCX</p>
            </>
          )}
        </motion.div>

        <div className="premium-card">
          <CardHeader><CardTitle className="font-heading text-lg">Uploaded Documents</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {documents.map((doc, i) => (
                <motion.div key={doc.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-secondary/20 hover:bg-secondary/40 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-heading text-sm font-medium group-hover:text-primary transition-colors">{doc.fileName}</p>
                      <p className="text-xs text-muted-foreground font-heading">{doc.uploadDate} • {doc.size}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`${typeColor[doc.fileType] || "bg-muted text-muted-foreground"} border text-xs font-display`}>{doc.fileType}</Badge>
                    <Badge variant="outline" className="text-xs font-heading border-border/50">{aircraft.find(a => a.id === doc.aircraftId)?.model || "Unassigned"}</Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default DocumentsPage;
