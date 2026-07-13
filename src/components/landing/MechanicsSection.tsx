"use client";
import { useRef, useEffect } from "react";
import { motion } from "framer-motion";

const phrases = [
  { text: "Tell the agent what you want.", bg: "bg-[#DFFF00]", textColor: "text-black" },
  { text: "It plans the optimal path.", bg: "bg-[#0055FF]", textColor: "text-white" },
  { text: "Interacts just like a human.", bg: "bg-[#FF0055]", textColor: "text-white" },
  { text: "Extracts what you need.", bg: "bg-black", textColor: "text-white" },
];

export default function MechanicsSection() {
  return (
    <section className="py-40 bg-white border-t-8 border-black border-b-8 relative z-10">
      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{ background: "linear-gradient(to right,#000 2px,transparent 2px),linear-gradient(to bottom,#000 2px,transparent 2px)", backgroundSize: "80px 80px" }}
      />

      <div className="container mx-auto px-6 max-w-6xl relative z-10 space-y-32">
        {phrases.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: i % 2 === 0 ? -80 : 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
          >
            <h2 className="text-4xl md:text-6xl lg:text-8xl font-black uppercase tracking-tighter w-max max-w-[90vw]">
              <span
                className={`inline-block px-6 py-3 ${item.bg} ${item.textColor} border-4 border-black`}
                style={{ boxShadow: "8px 8px 0px 0px #000" }}
              >
                {item.text}
              </span>
            </h2>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
