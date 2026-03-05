import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppData } from "@/contexts/AppContext";
import { Upload, FileText, CheckCircle, Loader2, Sparkles, Database, Scissors } from "lucide-react";

const pipelineSteps = [
  { label: "Extracting text", icon: FileText },
  { label: "Splitting into chunks", icon: Scissors },
  { label: "Generating embeddings", icon: Sparkles },
  { label: "Storing in vector DB", icon: Database },
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
    setUploading(true);
    setProgress(0);
    setPipelineStep(0);

    const steps = [0, 1, 2, 3, 4];
    let i = 0;
    const interval = setInterval(() => {
      setProgress((i + 1) * 20);
      setPipelineStep(steps[i]);
      i++;
      if (i >= steps.length) {
        clearInterval(interval);
        setTimeout(() => {
          addDocument({ fileName, fileType, aircraftId: selectedAircraft || "ac-1", size: `${(Math.random() * 10 + 1).toFixed(1)} MB` });
          setUploading(false);
          setPipelineStep(-1);
          setProgress(0);
        }, 600);
      }
    }, 800);
  }, [addDocument, selectedAircraft]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      const ext = file.name.split(".").pop()?.toUpperCase() || "TXT";
      simulateUpload(file.name, ext);
    }
  }, [simulateUpload]);

  const handleFileSelect = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.xlsx,.csv,.txt,.docx";
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const ext = file.name.split(".").pop()?.toUpperCase() || "TXT";
        simulateUpload(file.name, ext);
      }
    };
    input.click();
  };

  const typeColor: Record<string, string> = { PDF: "bg-destructive/20 text-destructive", Excel: "bg-success/20 text-success", CSV: "bg-accent/20 text-accent", TXT: "bg-muted text-muted-foreground", DOCX: "bg-primary/20 text-primary", XLSX: "bg-success/20 text-success" };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold">Document Upload</h1>
          <p className="text-muted-foreground font-heading">Upload maintenance documents for RAG processing</p>
        </div>

        <div className="flex gap-4 items-end">
          <div className="w-64">
            <p className="text-sm text-muted-foreground font-heading mb-1">Associate with aircraft</p>
            <Select value={selectedAircraft} onValueChange={setSelectedAircraft}>
              <SelectTrigger className="bg-muted/50 border-border"><SelectValue placeholder="Select aircraft" /></SelectTrigger>
              <SelectContent className="glass-strong border-border">
                {aircraft.map(ac => <SelectItem key={ac.id} value={ac.id}>{ac.model}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Drop zone */}
        <motion.div
          onDragOver={e => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={!uploading ? handleFileSelect : undefined}
          className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300 ${
            dragActive ? "border-primary bg-primary/5 glow-cyan" : "border-border hover:border-primary/50"
          }`}
        >
          {uploading ? (
            <div className="space-y-6">
              <Loader2 className="h-10 w-10 mx-auto text-primary animate-spin" />
              <Progress value={progress} className="max-w-md mx-auto h-2" />
              <div className="flex justify-center gap-2">
                {pipelineSteps.map((step, i) => (
                  <motion.div
                    key={step.label}
                    initial={{ opacity: 0.3 }}
                    animate={{ opacity: i <= pipelineStep ? 1 : 0.3 }}
                    className="flex flex-col items-center gap-1 text-xs"
                  >
                    <step.icon className={`h-5 w-5 ${i <= pipelineStep ? "text-primary" : "text-muted-foreground"}`} />
                    <span className={`font-heading ${i === pipelineStep ? "text-primary" : "text-muted-foreground"}`}>{step.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="font-heading text-lg text-foreground">Drag & drop files here</p>
              <p className="text-sm text-muted-foreground mt-1">or click to browse — PDF, Excel, CSV, TXT, DOCX</p>
            </>
          )}
        </motion.div>

        {/* Document list */}
        <Card className="glass border-border">
          <CardHeader><CardTitle className="font-heading text-lg">Uploaded Documents</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {documents.map((doc, i) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-heading text-sm font-medium">{doc.fileName}</p>
                      <p className="text-xs text-muted-foreground">{doc.uploadDate} • {doc.size}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={typeColor[doc.fileType] || "bg-muted text-muted-foreground"}>{doc.fileType}</Badge>
                    <Badge variant="outline" className="text-xs">{aircraft.find(a => a.id === doc.aircraftId)?.model || "Unassigned"}</Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
};

export default DocumentsPage;
