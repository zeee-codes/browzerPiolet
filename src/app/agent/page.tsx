"use client";
import { useState, useRef } from "react";
import ChatInterface from "@/components/agent/ChatInterface";
import BrowserPreview from "@/components/agent/BrowserPreview";
import ExecutionLogs from "@/components/agent/ExecutionLogs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export type AIProvider = "gemini" | "openai" | "groq";
export type Message = { sender: "user" | "agent"; text: string };
export type TaskEntry = { id: string; prompt: string; timestamp: string; provider: AIProvider };

export default function AgentPage() {
  const [url, setUrl] = useState("https://google.com");
  const [screenshot, setScreenshot] = useState<string>("");
  const [logs, setLogs] = useState<string[]>(["SYSTEM: Ready for command."]);
  const [chatHistory, setChatHistory] = useState<Message[]>([
    { sender: "agent", text: "BrowserPilot AI is ready. Choose your AI provider and give me a task!" },
  ]);
  const [provider, setProvider] = useState<AIProvider>("groq");
  const [approvalMode, setApprovalMode] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [taskHistory, setTaskHistory] = useState<TaskEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);
  const router = useRouter();

  useEffect(() => {
    const session = localStorage.getItem("mvp_session");
    if (!session) {
      router.push("/login");
    }
  }, [router]);

  const addLog = (msg: string) => setLogs((prev) => [...prev, msg]);

  const handleStop = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setIsRunning(false);
    addLog("SYSTEM: Task manually stopped by user.");
    setChatHistory((prev) => [...prev, { sender: "agent", text: "Task stopped." }]);
  };

  const handleSendMessage = (text: string) => {
    if (isRunning) return;
    setIsRunning(true);
    setChatHistory((prev) => [...prev, { sender: "user", text }]);
    addLog(`USER: ${text}`);
    setLogs(["SYSTEM: New task started..."]);
    setScreenshot("");

    const task: TaskEntry = {
      id: Date.now().toString(),
      prompt: text,
      timestamp: new Date().toLocaleTimeString(),
      provider,
    };
    setTaskHistory((prev) => [task, ...prev.slice(0, 9)]);

    const params = new URLSearchParams({
      prompt: text,
      provider,
      approval: approvalMode.toString(),
    });

    const es = new EventSource(`/api/agent?${params.toString()}`);
    eventSourceRef.current = es;

    es.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.type === "log") {
          addLog(payload.data);
        } else if (payload.type === "screenshot") {
          setScreenshot(payload.data);
        } else if (payload.type === "url") {
          setUrl(payload.data);
        } else if (payload.type === "result") {
          setChatHistory((prev) => [...prev, { sender: "agent", text: payload.data }]);
        } else if (payload.type === "error") {
          addLog(payload.data);
          setChatHistory((prev) => [...prev, { sender: "agent", text: `❌ Error: ${payload.data}` }]);
          setIsRunning(false);
          es.close();
        }
      } catch (err: any) {
        addLog(`SYSTEM: Parse error — ${err.message}`);
      }
    };

    es.onerror = () => {
      addLog("SYSTEM: Connection closed.");
      setIsRunning(false);
      es.close();
      setChatHistory((prev) => [...prev, { sender: "agent", text: "Task complete! What would you like me to do next?" }]);
    };
  };

  return (
    <div className="min-h-screen bg-[#EAEAEA] flex flex-col">
      {/* Header */}
      <header className="h-16 border-b-4 border-black bg-[#DFFF00] flex items-center justify-between px-4 z-10"
        style={{ boxShadow: "0 4px 0 0 #000" }}>
        <Link href="/" className="text-xl font-black uppercase tracking-tight hover:underline">
          📟 BROWSERPILOT AI
        </Link>

        {/* Provider toggle */}
        <div className="flex items-center gap-3">
          <div className="border-4 border-black bg-white flex overflow-hidden" style={{ boxShadow: "4px 4px 0 0 #000" }}>
            <button
              onClick={() => setProvider("groq")}
              className={`px-4 py-1.5 font-black text-sm uppercase tracking-wider transition-all ${provider === "groq" ? "bg-[#0055FF] text-white" : "bg-white text-black"}`}
            >
              ⚡ Groq
            </button>
            <button
              onClick={() => setProvider("gemini")}
              className={`px-4 py-1.5 font-black text-sm uppercase tracking-wider border-l-4 border-black transition-all ${provider === "gemini" ? "bg-[#0055FF] text-white" : "bg-white text-black"}`}
            >
              Gemini
            </button>
            <button
              onClick={() => setProvider("openai")}
              className={`px-4 py-1.5 font-black text-sm uppercase tracking-wider border-l-4 border-black transition-all ${provider === "openai" ? "bg-[#0055FF] text-white" : "bg-white text-black"}`}
            >
              GPT-4o
            </button>
          </div>

          {/* Approval Mode Toggle */}
          <button
            onClick={() => setApprovalMode((v) => !v)}
            className={`px-4 py-2 border-4 border-black font-black text-sm uppercase ${approvalMode ? "bg-[#FF0055] text-white" : "bg-white text-black"}`}
            style={{ boxShadow: "4px 4px 0 0 #000" }}
          >
            {approvalMode ? "✋ APPROVAL ON" : "APPROVAL OFF"}
          </button>

          {/* Task History */}
          <button
            onClick={() => setShowHistory((v) => !v)}
            className="px-4 py-2 border-4 border-black bg-white font-black text-sm uppercase"
            style={{ boxShadow: "4px 4px 0 0 #000" }}
          >
            📋 HISTORY ({taskHistory.length})
          </button>

          {/* Status */}
          <div className={`px-4 py-2 border-4 border-black font-mono font-bold text-sm ${isRunning ? "bg-green-400 animate-pulse" : "bg-white"}`}
            style={{ boxShadow: "4px 4px 0 0 #000" }}>
            {isRunning ? "● RUNNING" : "○ IDLE"}
          </div>

          {/* Sign Out Button */}
          <button
            onClick={() => {
              localStorage.removeItem("mvp_session");
              router.push("/login");
            }}
            className="px-4 py-2 border-4 border-black bg-[#FF0055] text-white font-black text-sm uppercase hover:bg-pink-600 transition-colors"
            style={{ boxShadow: "4px 4px 0 0 #000" }}
          >
            SIGN OUT
          </button>
        </div>
      </header>

      {/* Task History Dropdown */}
      {showHistory && (
        <div className="border-b-4 border-black bg-[#1a1a1a] text-white px-4 py-3 flex gap-3 overflow-x-auto">
          {taskHistory.length === 0 ? (
            <p className="font-mono text-sm text-slate-400">No tasks yet.</p>
          ) : taskHistory.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setShowHistory(false);
                if (!isRunning) handleSendMessage(t.prompt);
              }}
              className="flex-shrink-0 border-4 border-[#DFFF00] bg-black px-4 py-2 text-left hover:bg-[#1a1a1a]"
              style={{ boxShadow: "4px 4px 0 0 #DFFF00" }}
            >
              <p className="font-mono text-xs text-[#DFFF00]">[{t.provider.toUpperCase()}] {t.timestamp}</p>
              <p className="font-bold text-sm text-white mt-1 max-w-xs truncate">{t.prompt}</p>
            </button>
          ))}
        </div>
      )}

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 p-4 gap-4" style={{ height: "calc(100vh - 4rem)", overflow: "hidden" }}>
        {/* Left: Chat */}
        <div className="lg:col-span-4 h-full flex flex-col overflow-hidden">
          <ChatInterface
            history={chatHistory}
            onSendMessage={handleSendMessage}
            isRunning={isRunning}
            onStop={handleStop}
            provider={provider}
          />
        </div>

        {/* Center: Browser */}
        <div className="lg:col-span-5 h-full flex flex-col overflow-hidden">
          <BrowserPreview currentUrl={url} screenshot={screenshot} isRunning={isRunning} />
        </div>

        {/* Right: Logs */}
        <div className="lg:col-span-3 h-full flex flex-col overflow-hidden">
          <ExecutionLogs logs={logs} />
        </div>
      </div>
    </div>
  );
}
