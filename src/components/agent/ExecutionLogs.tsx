"use client";
import { useRef, useEffect } from "react";

interface ExecutionLogsProps {
  logs: string[];
}

export default function ExecutionLogs({ logs }: ExecutionLogsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  const getLogStyle = (log: string) => {
    if (log.startsWith("SYSTEM ERROR") || log.includes("ERROR")) return "text-[#FF0055]";
    if (log.startsWith("SYSTEM:")) return "text-[#0055FF]";
    if (log.startsWith("AGENT THOUGHT:")) return "text-[#DFFF00]";
    if (log.startsWith("AGENT ACTION:")) return "text-green-400 font-bold";
    if (log.startsWith("AGENT:")) return "text-[#DFFF00]";
    if (log.startsWith("BROWSER:")) return "text-cyan-400";
    if (log.startsWith("USER:")) return "text-[#FF0055] font-bold";
    if (log.startsWith("APPROVAL:")) return "text-orange-400 font-bold";
    return "text-white";
  };

  return (
    <div className="flex-1 bg-black text-white border-4 border-black flex flex-col h-full overflow-hidden"
      style={{ boxShadow: "8px 8px 0 0 #000" }}>
      {/* Header */}
      <div className="bg-[#111] text-[#DFFF00] font-black uppercase text-xs p-3 border-b-4 border-black tracking-widest flex justify-between items-center flex-shrink-0">
        <span>🤖 WORKFLOW LOGS</span>
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-mono">{logs.length} lines</span>
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
        </div>
      </div>

      {/* Log viewport */}
      <div
        ref={containerRef}
        className="flex-1 p-3 font-mono text-xs space-y-1 overflow-y-auto"
        style={{ background: "linear-gradient(to bottom, #0a0a0a, #000)" }}
      >
        {logs.map((log, idx) => (
          <div key={idx} className={`${getLogStyle(log)} leading-relaxed break-all`}>
            <span className="text-slate-600 mr-2 select-none">{String(idx + 1).padStart(3, "0")}</span>
            {log}
          </div>
        ))}

        {/* Cursor blink */}
        <div className="text-[#DFFF00] flex items-center gap-1 mt-1">
          <span className="text-slate-600 mr-2">---</span>
          <span className="w-2 h-4 bg-[#DFFF00] animate-pulse" />
        </div>
      </div>
    </div>
  );
}
