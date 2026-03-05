import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { chatResponses } from "@/data/mockData";
import { Send, Bot, User, FileText, Loader2, Sparkles } from "lucide-react";

interface Message { id: string; role: "user" | "assistant"; content: string; sources?: string[]; }

const AssistantPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome", role: "assistant", content: "Hello! I'm the AeroGuardian AI Maintenance Assistant. Ask me anything about aircraft maintenance, engine diagnostics, or inspection procedures.", sources: [] },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

  const sendMessage = () => {
    if (!input.trim() || typing) return;
    setMessages(prev => [...prev, { id: `u-${Date.now()}`, role: "user", content: input }]);
    const query = input;
    setInput(""); setTyping(true);
    setTimeout(() => {
      const lower = query.toLowerCase();
      let response = chatResponses["default"];
      if (lower.includes("vibration")) response = chatResponses["vibration"];
      else if (lower.includes("hydraulic") || lower.includes("pressure drop")) response = chatResponses["hydraulic"];
      else if (lower.includes("temperature") || lower.includes("temp")) response = chatResponses["temperature"];
      setMessages(prev => [...prev, { id: `a-${Date.now()}`, role: "assistant", content: response.answer, sources: response.sources }]);
      setTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col h-[calc(100vh-8rem)]">
        <div className="mb-4">
          <h1 className="text-3xl font-heading font-bold flex items-center gap-2">
            <Sparkles className="h-7 w-7 text-primary" />
            AI Maintenance Assistant
          </h1>
          <p className="text-muted-foreground font-heading mt-1">RAG-powered aircraft maintenance chatbot</p>
        </div>

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
                  <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shrink-0 mt-1 glow-primary-sm">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
                <div className={`max-w-[75%] rounded-2xl p-4 ${
                  msg.role === "user" ? "gradient-primary text-primary-foreground" : "bg-secondary/40 border border-border/30"
                }`}>
                  <div className="text-sm font-body whitespace-pre-line leading-relaxed">{msg.content}</div>
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-border/30">
                      <p className="text-xs text-muted-foreground font-heading mb-1">Sources:</p>
                      {msg.sources.map((s, j) => (
                        <div key={j} className="flex items-center gap-1.5 text-xs text-primary py-0.5">
                          <FileText className="h-3 w-3" />{s}
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
                  <span className="text-sm text-muted-foreground font-heading animate-pulse-glow">Analyzing documents...</span>
                </div>
              </motion.div>
            )}
            <div ref={bottomRef} />
          </CardContent>
          <div className="p-4 border-t border-border/30">
            <form onSubmit={e => { e.preventDefault(); sendMessage(); }} className="flex gap-3">
              <Input
                value={input} onChange={e => setInput(e.target.value)}
                placeholder="Ask about engine vibration, hydraulic pressure, temperatures..."
                className="bg-secondary/30 border-border/50 font-body rounded-xl"
              />
              <Button type="submit" disabled={!input.trim() || typing} className="gradient-primary text-primary-foreground glow-primary shrink-0 rounded-xl px-4 hover:opacity-90 transition-all">
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
