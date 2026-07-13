"use client";
import { useState } from "react";
import ChatInterface from "@/components/agent/ChatInterface";
import BrowserPreview from "@/components/agent/BrowserPreview";
import ExecutionLogs from "@/components/agent/ExecutionLogs";
import Link from "next/link";

export default function AgentPage() {
  const [url, setUrl] = useState("https://google.com");
  const [logs, setLogs] = useState<string[]>([
    "SYSTEM: Initialize Playwright Session...",
    "SYSTEM: Launching headless Chromium instance...",
    "SYSTEM: Ready for command."
  ]);
  const [chatHistory, setChatHistory] = useState<{ sender: 'user' | 'agent', text: string }[]>([
    { sender: 'agent', text: "Ready. Tell me what automation task you need executed." }
  ]);

  const addLog = (msg: string) => {
    setLogs((prev) => [...prev, msg]);
  };

  const handleSendMessage = (text: string) => {
    setChatHistory((prev) => [...prev, { sender: 'user', text }]);
    addLog(`USER: ${text}`);
    
    // Simulate Agent Steps
    setTimeout(() => {
      addLog("AGENT: Decomposing instruction into plan steps...");
      addLog("AGENT: STEP 1 - Navigate to google.com");
      setUrl("https://google.com");
    }, 1000);

    setTimeout(() => {
      addLog("AGENT: STEP 2 - Click search input field");
    }, 2500);

    setTimeout(() => {
      addLog(`AGENT: STEP 3 - Fill search input with '${text}'`);
    }, 4000);

    setTimeout(() => {
      setChatHistory((prev) => [...prev, { sender: 'agent', text: `Search performed successfully for: "${text}"` }]);
      addLog("SYSTEM: Task complete. Awaiting new instructions.");
    }, 5500);
  };

  return (
    <div className="min-h-screen bg-[#EAEAEA] flex flex-col">
      {/* Header bar */}
      <header className="h-16 border-b-4 border-black bg-accent-yellow flex items-center justify-between px-6 z-10 brutal-shadow">
        <Link href="/" className="text-2xl font-black uppercase tracking-tight hover:underline">
          📟 BROWSERPILOT AI
        </Link>
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-white border-2 border-black font-mono font-bold text-sm skeuo-inner">
            SESSION: ACTIVE (CHROMIUM)
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 p-6 gap-6 h-[calc(100vh-4rem)] overflow-hidden">
        {/* Left Panel: Chat Interface */}
        <div className="lg:col-span-4 h-full flex flex-col">
          <ChatInterface history={chatHistory} onSendMessage={handleSendMessage} />
        </div>

        {/* Center Panel: Interactive Browser */}
        <div className="lg:col-span-5 h-full flex flex-col">
          <BrowserPreview currentUrl={url} />
        </div>

        {/* Right Panel: Execution Logs */}
        <div className="lg:col-span-3 h-full flex flex-col">
          <ExecutionLogs logs={logs} />
        </div>
      </div>
    </div>
  );
}
