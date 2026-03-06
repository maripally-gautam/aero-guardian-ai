import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User, FileText, Loader2, Sparkles, AlertCircle } from "lucide-react";

// ── RAG Backend URL ──
const RAG_API_URL = import.meta.env.VITE_RAG_API_URL || "http://localhost:8000";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: string[];
  error?: boolean;
}

const AssistantPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I'm the AeroGuardian AI Maintenance Assistant, powered by RAG technology.\n\nI can answer questions about aircraft maintenance by searching through official manuals including:\n• FAA Maintenance Technician Handbook\n• AMT Powerplant Handbook\n• Boeing 737NG Manual\n• AMT General Handbook\n\nAsk me anything about engine diagnostics, maintenance procedures, or troubleshooting!",
      sources: [],
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [backendStatus, setBackendStatus] = useState<"unknown" | "online" | "offline">("unknown");
  const bottomRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  // Check backend health on mount
  useEffect(() => {
    fetch(`${RAG_API_URL}/health`)
      .then((res) => res.json())
      .then((data) => {
        setBackendStatus(data.status === "ready" ? "online" : "offline");
      })
      .catch(() => setBackendStatus("offline"));
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || typing) return;

    const userQuestion = input;
    setMessages((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, role: "user", content: userQuestion },
    ]);
    setInput("");
    setTyping(true);

    try {
      const response = await fetch(`${RAG_API_URL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userQuestion }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "Server error" }));
        throw new Error(errorData.detail || `HTTP ${response.status}`);
      }

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          content: data.answer,
          sources: data.sources || [],
        },
      ]);
    } catch (error: any) {
      console.error("RAG query failed:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: `e-${Date.now()}`,
          role: "assistant",
          content: `I couldn't connect to the RAG backend.\n\n**Error:** ${error.message}\n\n**To fix this:**\n1. Make sure the backend is running: \`uvicorn main:app --reload\`\n2. Ensure PDFs are in \`backend/docs/\`\n3. Check that \`GOOGLE_API_KEY\` is set in \`.env\``,
          sources: [],
          error: true,
        },
      ]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col h-[calc(100vh-8rem)]"
      >
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold flex items-center gap-2">
              <Sparkles className="h-7 w-7 text-primary" />
              AI Maintenance Assistant
            </h1>
            <p className="text-muted-foreground font-heading mt-1">
              RAG-powered aircraft maintenance chatbot
            </p>
          </div>

          {/* Backend status indicator */}
          <div className="flex items-center gap-2 text-xs font-heading">
            <span
              className={`w-2 h-2 rounded-full ${backendStatus === "online"
                  ? "bg-emerald-500"
                  : backendStatus === "offline"
                    ? "bg-red-500"
                    : "bg-yellow-500 animate-pulse"
                }`}
            />
            <span className="text-muted-foreground">
              RAG {backendStatus === "online" ? "Online" : backendStatus === "offline" ? "Offline" : "Checking..."}
            </span>
          </div>
        </div>

        {/* Chat area */}
        <div className="premium-card flex-1 flex flex-col min-h-0 overflow-hidden">
          <CardContent className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.map((msg, i) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i === messages.length - 1 ? 0.1 : 0 }}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-1 ${msg.error
                        ? "bg-red-500/20"
                        : "gradient-primary glow-primary-sm"
                      }`}
                  >
                    {msg.error ? (
                      <AlertCircle className="h-4 w-4 text-red-400" />
                    ) : (
                      <Bot className="h-4 w-4 text-primary-foreground" />
                    )}
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-2xl p-4 ${msg.role === "user"
                      ? "gradient-primary text-primary-foreground"
                      : msg.error
                        ? "bg-red-500/5 border border-red-500/20"
                        : "bg-secondary/40 border border-border/30"
                    }`}
                >
                  <div className="text-sm font-body whitespace-pre-line leading-relaxed">
                    {msg.content}
                  </div>
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-border/30">
                      <p className="text-xs text-muted-foreground font-heading mb-1">Sources:</p>
                      {msg.sources.map((s, j) => (
                        <div key={j} className="flex items-center gap-1.5 text-xs text-primary py-0.5">
                          <FileText className="h-3 w-3" />
                          {s}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {msg.role === "user" && (
                  <div className="w-9 h-9 rounded-xl bg-accent/20 flex items-center justify-center shrink-0 mt-1">
                    <User className="h-4 w-4 text-accent" />
                  </div>
                )}
              </motion.div>
            ))}

            {typing && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shrink-0 glow-primary-sm">
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="bg-secondary/40 border border-border/30 rounded-2xl p-4 flex items-center gap-3">
                  <Loader2 className="h-4 w-4 text-primary animate-spin" />
                  <span className="text-sm text-muted-foreground font-heading">
                    Searching manuals & generating answer...
                  </span>
                </div>
              </motion.div>
            )}
            <div ref={bottomRef} />
          </CardContent>

          {/* Input area */}
          <div className="p-4 border-t border-border/30">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="flex gap-3"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about engine vibration, hydraulic pressure, maintenance procedures..."
                className="bg-secondary/30 border-border/50 font-body rounded-xl"
              />
              <Button
                type="submit"
                disabled={!input.trim() || typing}
                className="gradient-primary text-primary-foreground glow-primary shrink-0 rounded-xl px-4 hover:opacity-90 transition-all"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default AssistantPage;
