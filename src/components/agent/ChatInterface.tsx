"use client";
import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

interface Message {
  sender: 'user' | 'agent';
  text: string;
}

interface ChatInterfaceProps {
  history: Message[];
  onSendMessage: (text: string) => void;
}

export default function ChatInterface({ history, onSendMessage }: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input);
    setInput("");
  };

  return (
    <div className="flex-1 bg-white border-4 border-black brutal-shadow flex flex-col h-full overflow-hidden">
      {/* Title Header */}
      <div className="bg-accent-blue text-white font-black uppercase text-lg p-4 border-b-4 border-black tracking-widest">
        🗣️ AGENT ORCHESTRATOR CHAT
      </div>

      {/* Message List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50 skeuo-inner">
        {history.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] p-4 border-4 border-black brutal-shadow font-bold ${
                msg.sender === 'user'
                  ? 'bg-accent-pink text-white -rotate-1'
                  : 'bg-accent-yellow text-black rotate-1'
              }`}
            >
              <div className="text-xs uppercase tracking-widest opacity-70 mb-1 font-mono">
                {msg.sender === 'user' ? 'USER' : 'AGENT'}
              </div>
              <p className="text-lg leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-4 border-t-4 border-black bg-white flex gap-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Command the browser (e.g. 'Search for next.js on Google')..."
          className="flex-1 px-4 py-3 border-4 border-black font-bold text-lg brutal-shadow skeuo-inner focus:outline-none focus:bg-slate-50"
        />
        <button
          type="submit"
          className="px-6 bg-accent-blue text-white border-4 border-black brutal-shadow brutal-shadow-hover skeuo-button flex items-center justify-center"
        >
          <Send size={24} strokeWidth={3} />
        </button>
      </form>
    </div>
  );
}
