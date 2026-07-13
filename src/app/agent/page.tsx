"use client";
import { useState } from "react";
import ChatInterface from "@/components/agent/ChatInterface";
import BrowserPreview from "@/components/agent/BrowserPreview";
import ExecutionLogs from "@/components/agent/ExecutionLogs";
import Link from "next/link";

export default function AgentPage() {
  const [url, setUrl] = useState("https://google.com");
  const [screenshot, setScreenshot] = useState<string>("");
  const [logs, setLogs] = useState<string[]>([
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

    const eventSource = new EventSource(`/api/agent?prompt=${encodeURIComponent(text)}`);

    eventSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.type === "log") {
          addLog(payload.data);
          if (payload.data.includes("SYSTEM: Task complete.")) {
            setChatHistory((prev) => [...prev, { sender: 'agent', text: "I have completed the automation task!" }]);
            eventSource.close();
          }
        } else if (payload.type === "screenshot") {
          setScreenshot(payload.data);
        } else if (payload.type === "url") {
          setUrl(payload.data);
        } else if (payload.type === "error") {
          addLog(payload.data);
          setChatHistory((prev) => [...prev, { sender: 'agent', text: `An error occurred: ${payload.data}` }]);
          eventSource.close();
        }
      } catch (err: any) {
        addLog(`SYSTEM: Failed to parse event: ${err.message}`);
      }
    };

    eventSource.onerror = () => {
      addLog("SYSTEM: Connection closed.");
      eventSource.close();
    };
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
          <BrowserPreview currentUrl={url} screenshot={screenshot} />
        </div>

        {/* Right Panel: Execution Logs */}
        <div className="lg:col-span-3 h-full flex flex-col">
          <ExecutionLogs logs={logs} />
        </div>
      </div>
    </div>
  );
}
