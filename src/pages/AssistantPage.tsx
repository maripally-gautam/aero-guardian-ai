import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { chatResponses } from "@/data/mockData";
import { Send, Bot, User, FileText, Loader2 } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: string[];
}

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
    const userMsg: Message = { id: `u-${Date.now()}`, role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      const lower = input.toLowerCase();
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
          <h1 className="text-2xl font-display font-bold">AI Maintenance Assistant</h1>
          <p className="text-muted-foreground font-heading">RAG-powered aircraft maintenance chatbot</p>
        </div>

        <Card className="glass border-border flex-1 flex flex-col min-h-0">
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i === messages.length - 1 ? 0.1 : 0 }}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                )}
                <div className={`max-w-[75%] rounded-xl p-4 ${
                  msg.role === "user" ? "bg-primary/20 text-foreground" : "bg-muted/50"
                }`}>
                  <div className="text-sm font-body whitespace-pre-line">{msg.content}</div>
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-border">
                      <p className="text-xs text-muted-foreground font-heading mb-1">Sources:</p>
                      {msg.sources.map((s, j) => (
                        <div key={j} className="flex items-center gap-1 text-xs text-primary">
                          <FileText className="h-3 w-3" />{s}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center shrink-0 mt-1">
                    <User className="h-4 w-4 text-accent" />
                  </div>
                )}
              </motion.div>
            ))}
            {typing && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="bg-muted/50 rounded-xl p-4 flex items-center gap-2">
                  <Loader2 className="h-4 w-4 text-primary animate-spin" />
                  <span className="text-sm text-muted-foreground animate-pulse-glow">Analyzing documents...</span>
                </div>
              </motion.div>
            )}
            <div ref={bottomRef} />
          </CardContent>
          <div className="p-4 border-t border-border">
            <form onSubmit={e => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
              <Input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask about engine vibration, hydraulic pressure, temperatures..."
                className="bg-muted/50 border-border font-body"
              />
              <Button type="submit" disabled={!input.trim() || typing} className="glow-cyan shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
};

export default AssistantPage;
