import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Send, Bot, User, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/physio-chat`;

const quickPrompts = [
  "I have knee pain after running",
  "Best stretches for lower back",
  "Shoulder rehab after surgery",
  "How to improve my posture",
];

const AIAssistant = () => {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Hello! 👋 I'm **PhysioAI**, your personal rehabilitation assistant. Tell me about your condition — which area hurts, how long you've had the issue — and I'll create a tailored recovery plan for you.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const streamChat = async (allMessages: Msg[]) => {
    setIsLoading(true);
    let assistantSoFar = "";

    const upsert = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && prev.length > 1 && last === prev[prev.length - 1]) {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: allMessages }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Request failed" }));
        upsert(err.error || "Sorry, something went wrong. Please try again.");
        setIsLoading(false);
        return;
      }

      if (!resp.body) {
        upsert("Sorry, I couldn't connect to the AI service.");
        setIsLoading(false);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let streamDone = false;

      // Create the assistant message slot
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantSoFar += content;
              setMessages((prev) =>
                prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m))
              );
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Final flush
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (raw.startsWith(":") || raw.trim() === "") continue;
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantSoFar += content;
              setMessages((prev) =>
                prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m))
              );
            }
          } catch {
            /* ignore */
          }
        }
      }
    } catch (e) {
      console.error("Chat error:", e);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I'm having trouble connecting. Please try again in a moment." },
      ]);
    }

    setIsLoading(false);
  };

  const handleSend = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || isLoading) return;
    const userMsg: Msg = { role: "user", content: msg };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    await streamChat(newMessages);
  };

  return (
    <section id="ai-assistant" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12 space-y-3">
          <Badge variant="outline" className="border-primary/30 text-primary font-medium px-4 py-1">
            <Brain className="h-3 w-3 mr-1" /> AI Assistant
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-foreground">
            Smart Rehabilitation Guidance
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Get instant, personalized exercise recommendations powered by AI.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
            {/* Chat messages */}
            <div ref={scrollRef} className="h-96 overflow-y-auto p-6 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""} animate-fade-in`}>
                  {msg.role === "assistant" && (
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-secondary text-secondary-foreground rounded-bl-md"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <div className="prose prose-sm max-w-none prose-headings:text-secondary-foreground prose-p:text-secondary-foreground prose-li:text-secondary-foreground prose-strong:text-secondary-foreground">
                        <ReactMarkdown>{msg.content || "..."}</ReactMarkdown>
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                  {msg.role === "user" && (
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-accent flex items-center justify-center">
                      <User className="h-4 w-4 text-accent-foreground" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
                <div className="flex gap-3">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="bg-secondary rounded-2xl rounded-bl-md px-4 py-3">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-border p-4">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                  placeholder="Describe your condition or ask for exercises..."
                  className="flex-1 rounded-full bg-secondary px-5 py-3 text-sm text-secondary-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  disabled={isLoading}
                />
                <Button
                  onClick={() => handleSend()}
                  className="rounded-full h-11 w-11 p-0"
                  size="icon"
                  disabled={isLoading || !input.trim()}
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {quickPrompts.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSend(q)}
                    disabled={isLoading}
                    className="text-xs rounded-full border border-border px-3 py-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIAssistant;
