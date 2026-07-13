"use client";
import { motion } from "framer-motion";
import { MessageSquare, MousePointer2, Settings } from "lucide-react";

export default function DemoSection() {
  return (
    <section className="py-32 bg-[#EAEAEA] relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20 max-w-4xl mx-auto border-4 border-black p-10 bg-white brutal-shadow">
          <h2 className="text-4xl md:text-6xl font-black mb-6 uppercase tracking-tight">See it in action</h2>
          <p className="text-black text-xl font-bold">
            Experience the seamless integration of natural language and autonomous browsing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {/* Feature 1 */}
          <motion.div 
            whileHover={{ y: 0, scale: 0.98 }}
            className="p-8 bg-accent-yellow border-4 border-black brutal-shadow brutal-shadow-hover flex flex-col items-start gap-6 cursor-pointer"
          >
            <div className="w-16 h-16 rounded-full bg-white border-4 border-black flex items-center justify-center text-black skeuo-inner">
              <MessageSquare size={32} strokeWidth={3} />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-wide">Natural Language</h3>
            <p className="text-black font-medium text-lg border-t-4 border-black pt-4">
              Just tell the agent what to do in plain English. It understands complex multi-step instructions and executes them flawlessly.
            </p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div 
            whileHover={{ y: 0, scale: 0.98 }}
            className="p-8 bg-accent-blue text-white border-4 border-black brutal-shadow brutal-shadow-hover flex flex-col items-start gap-6 cursor-pointer"
          >
            <div className="w-16 h-16 rounded-full bg-white border-4 border-black flex items-center justify-center text-accent-blue skeuo-inner">
              <MousePointer2 size={32} strokeWidth={3} />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-wide">Smart Interaction</h3>
            <p className="text-white font-medium text-lg border-t-4 border-white pt-4">
              The agent can click, scroll, type, and navigate just like a human, interpreting visual context to find elements.
            </p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div 
            whileHover={{ y: 0, scale: 0.98 }}
            className="p-8 bg-accent-pink text-white border-4 border-black brutal-shadow brutal-shadow-hover flex flex-col items-start gap-6 cursor-pointer"
          >
            <div className="w-16 h-16 rounded-full bg-white border-4 border-black flex items-center justify-center text-accent-pink skeuo-inner">
              <Settings size={32} strokeWidth={3} />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-wide">Human in Loop</h3>
            <p className="text-white font-medium text-lg border-t-4 border-white pt-4">
              Keep control with approval mode. The agent asks for confirmation before executing critical actions.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
