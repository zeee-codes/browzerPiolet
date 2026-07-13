"use client";
import { useState, useRef, useEffect } from "react";
import { Send, Square } from "lucide-react";
import type { Message, AIProvider } from "@/app/agent/page";

interface ChatInterfaceProps {
  history: Message[];
  onSendMessage: (text: string) => void;
  isRunning: boolean;
  onStop: () => void;
  provider: AIProvider;
}

const SUGGESTION_PROMPTS = [
  "Go to Wikipedia and search for Artificial Intelligence",
  "Search Google for 'Next.js tutorials' and extract top 3 results",
  "Navigate to github.com and find trending repositories",
  "Go to news.ycombinator.com and get today's top stories",
];

export default function ChatInterface({ history, onSendMessage, isRunning, onStop, provider }: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isRunning) return;
    onSendMessage(input.trim());
    setInput("");
  };

  return (
    <div className="flex-1 bg-white border-4 border-black flex flex-col h-full overflow-hidden"
      style={{ boxShadow: "8px 8px 0 0 #000" }}>
      {/* Header */}
      <div className="bg-[#0055FF] text-white font-black uppercase text-sm p-3 border-b-4 border-black tracking-widest flex justify-between items-center flex-shrink-0">
        <span>🗣️ ORCHESTRATOR</span>
        <span className="text-xs font-mono bg-white text-[#0055FF] px-2 py-1 border-2 border-white">
          {provider === "gemini" ? "✦ GEMINI" : "⬡ GPT-4O"}
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-[#fafafa]">
        {history.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[88%] p-3 border-4 border-black font-bold text-sm leading-relaxed ${
                msg.sender === "user"
                  ? "bg-[#FF0055] text-white -rotate-1"
                  : "bg-[#DFFF00] text-black rotate-1"
              }`}
              style={{ boxShadow: "4px 4px 0 0 #000" }}
            >
              <p className="text-xs uppercase tracking-widest opacity-70 mb-1 font-mono">
                {msg.sender === "user" ? "YOU" : "AGENT"}
              </p>
              <p className="whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}

        {isRunning && (
          <div className="flex justify-start">
            <div className="bg-white border-4 border-black p-3 rotate-1" style={{ boxShadow: "4px 4px 0 0 #000" }}>
              <p className="text-xs uppercase tracking-widest opacity-70 mb-2 font-mono">AGENT</p>
              <div className="flex gap-2 items-center">
                <span className="w-3 h-3 bg-[#0055FF] border-2 border-black animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-3 h-3 bg-[#FF0055] border-2 border-black animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-3 h-3 bg-[#DFFF00] border-2 border-black animate-bounce" style={{ animationDelay: "300ms" }} />
                <span className="font-mono text-xs ml-1 text-slate-500">Executing...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {!isRunning && history.length < 3 && (
        <div className="px-3 pb-2 flex flex-col gap-1 flex-shrink-0 border-t-4 border-black bg-slate-50 pt-2">
          <p className="font-mono text-xs text-slate-500 uppercase tracking-wider mb-1">Try these:</p>
          {SUGGESTION_PROMPTS.map((s, i) => (
            <button
              key={i}
              onClick={() => { setInput(s); }}
              className="text-left text-xs font-bold px-3 py-2 bg-white border-2 border-black hover:bg-[#DFFF00] transition-colors"
              style={{ boxShadow: "2px 2px 0 0 #000" }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-3 border-t-4 border-black bg-white flex gap-2 flex-shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isRunning}
          placeholder={isRunning ? "Agent is running..." : "Command the browser..."}
          className="flex-1 px-3 py-2.5 border-4 border-black font-bold text-sm disabled:bg-slate-100 disabled:cursor-not-allowed focus:outline-none focus:bg-yellow-50"
          style={{ boxShadow: "inset 2px 2px 6px rgba(0,0,0,0.15)" }}
        />
        {isRunning ? (
          <button
            type="button"
            onClick={onStop}
            className="px-4 bg-[#FF0055] text-white border-4 border-black flex items-center justify-center"
            style={{ boxShadow: "4px 4px 0 0 #000" }}
          >
            <Square size={20} strokeWidth={3} />
          </button>
        ) : (
          <button
            type="submit"
            disabled={!input.trim()}
            className="px-4 bg-[#0055FF] text-white border-4 border-black flex items-center justify-center disabled:opacity-40"
            style={{ boxShadow: "4px 4px 0 0 #000" }}
          >
            <Send size={20} strokeWidth={3} />
          </button>
        )}
      </form>
    </div>
  );
}
