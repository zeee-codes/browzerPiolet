"use client";
import { motion } from "framer-motion";

interface BrowserPreviewProps {
  currentUrl: string;
}

export default function BrowserPreview({ currentUrl }: BrowserPreviewProps) {
  return (
    <div className="flex-1 bg-[#e0dcd3] border-4 border-black brutal-shadow p-4 flex flex-col h-full overflow-hidden">
      {/* Physical Address Bar & Browser top navigation */}
      <div className="h-16 border-4 border-black bg-white flex items-center px-4 gap-4 mb-4 brutal-shadow skeuo-inner">
        <div className="flex gap-2">
          <div className="w-4 h-4 rounded-full bg-accent-pink border-2 border-black skeuo-button" />
          <div className="w-4 h-4 rounded-full bg-accent-yellow border-2 border-black skeuo-button" />
          <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-black skeuo-button" />
        </div>
        <div className="ml-4 flex-1 bg-[#f0f0f0] h-10 border-4 border-black brutal-shadow flex items-center px-4 font-mono font-bold text-sm overflow-hidden whitespace-nowrap text-ellipsis skeuo-inner">
          {currentUrl}
        </div>
      </div>

      {/* Screen Area */}
      <div className="flex-1 border-4 border-black bg-white relative overflow-hidden skeuo-inner flex flex-col">
        {/* Scanline overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,0,0,0.05)_50%)] bg-[length:100%_4px] pointer-events-none z-10" />

        {/* Browser viewport simulation */}
        <div className="w-full h-full p-6 flex flex-col items-center justify-center text-center relative">
          <motion.div 
            animate={{ 
              scale: [1, 1.02, 1],
              opacity: [0.3, 0.6, 0.3] 
            }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="w-40 h-40 bg-accent-blue/10 rounded-full blur-2xl absolute"
          />
          
          <div className="relative z-10 max-w-md border-4 border-black bg-white p-6 brutal-shadow -rotate-1">
            <h4 className="text-xl font-black uppercase mb-2">Browser Viewport</h4>
            <p className="font-mono text-sm text-slate-500 mb-4">{currentUrl}</p>
            <div className="border-t-4 border-black pt-4 font-bold text-lg">
              {currentUrl.includes("google.com") ? (
                <div className="space-y-4">
                  <div className="text-3xl font-black text-accent-blue tracking-tighter">Google</div>
                  <div className="h-10 border-2 border-black bg-slate-50 flex items-center px-3 font-mono text-xs skeuo-inner">
                    Search term filled...
                  </div>
                  <div className="w-full py-2 bg-accent-yellow border-2 border-black font-black uppercase text-xs skeuo-button">
                    Google Search
                  </div>
                </div>
              ) : (
                <div className="text-slate-400 font-mono">Loading document...</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
