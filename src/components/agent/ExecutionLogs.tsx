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

  return (
    <div className="flex-1 bg-black text-white border-4 border-black brutal-shadow flex flex-col h-full overflow-hidden">
      {/* Title Header */}
      <div className="bg-[#1a1a1a] text-accent-yellow font-black uppercase text-lg p-4 border-b-4 border-black tracking-widest flex justify-between items-center">
        <span>🤖 WORKFLOW LOGS</span>
        <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
      </div>

      {/* Logs Viewport */}
      <div 
        ref={containerRef}
        className="flex-1 p-4 font-mono text-sm space-y-2 overflow-y-auto bg-black scrollbar-thin scrollbar-thumb-white select-text"
      >
        {logs.map((log, idx) => {
          let color = "text-white";
          if (log.startsWith("SYSTEM:")) color = "text-accent-blue";
          if (log.startsWith("AGENT:")) color = "text-accent-yellow";
          if (log.startsWith("USER:")) color = "text-accent-pink font-bold";

          return (
            <div key={idx} className={`${color} leading-relaxed break-all`}>
              {log}
            </div>
          );
        })}
      </div>
    </div>
  );
}
