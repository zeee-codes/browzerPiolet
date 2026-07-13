"use client";
import { motion, Variants } from "framer-motion";
import Link from "next/link";

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  }
};

const item: Variants = {
  hidden: { y: 60, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 200, damping: 20 } }
};

export default function LandingHero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-32 bg-[#EAEAEA]">
      {/* Dot grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(#bbb 1px, transparent 1px)", backgroundSize: "22px 22px" }}
      />

      <div className="container relative z-10 mx-auto px-6 flex flex-col items-center text-center">
        <motion.h1
          variants={container}
          initial="hidden"
          animate="show"
          className="text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter mb-8 leading-[0.9]"
        >
          <motion.div variants={item} className="overflow-hidden py-2">
            <span className="inline-block bg-[#DFFF00] px-4 border-4 border-black -rotate-2"
              style={{ boxShadow: "8px 8px 0px 0px #000" }}>
              Your
            </span>
          </motion.div>
          <motion.div variants={item} className="overflow-hidden py-2">
            <span className="inline-block bg-white px-4 border-4 border-black rotate-1"
              style={{ boxShadow: "8px 8px 0px 0px #000" }}>
              Browser.
            </span>
          </motion.div>
          <motion.div variants={item} className="overflow-hidden py-2">
            <span className="inline-block bg-[#0055FF] text-white px-4 border-4 border-black"
              style={{ boxShadow: "8px 8px 0px 0px #000" }}>
              Autonomous.
            </span>
          </motion.div>
        </motion.h1>

        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="max-w-2xl text-xl md:text-2xl font-bold bg-white border-4 border-black p-6 mb-12"
          style={{ boxShadow: "8px 8px 0px 0px #000" }}
        >
          BrowserPilot AI understands instructions and interacts with any website on your behalf.
          Watch it click, type, and extract data.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="flex items-center gap-6 flex-wrap justify-center"
        >
          <Link href="/agent">
            <motion.span
              whileHover={{ x: 4, y: 4, boxShadow: "4px 4px 0px 0px #000" }}
              whileTap={{ x: 8, y: 8, boxShadow: "0px 0px 0px 0px #000" }}
              className="block px-10 py-5 bg-[#FF0055] text-white font-black text-xl uppercase tracking-wider border-4 border-black cursor-pointer"
              style={{ boxShadow: "8px 8px 0px 0px #000" }}
            >
              Start Automating →
            </motion.span>
          </Link>
          <motion.button
            whileHover={{ x: 4, y: 4, boxShadow: "4px 4px 0px 0px #000" }}
            whileTap={{ x: 8, y: 8, boxShadow: "0px 0px 0px 0px #000" }}
            className="px-10 py-5 bg-white font-black text-xl uppercase tracking-wider border-4 border-black"
            style={{ boxShadow: "8px 8px 0px 0px #000" }}
          >
            Watch Demo
          </motion.button>
        </motion.div>
      </div>

      {/* Floating browser mockup */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.9, type: "spring", stiffness: 80, damping: 18 }}
        className="mt-20 w-full max-w-5xl mx-auto px-6"
      >
        <div
          className="rounded-lg border-8 border-black bg-[#e0dcd3] p-4 flex flex-col"
          style={{ boxShadow: "12px 12px 0px 0px #000", aspectRatio: "16/9" }}
        >
          {/* Browser top bar */}
          <div
            className="h-16 border-4 border-black bg-white flex items-center px-4 gap-4 mb-4"
            style={{ boxShadow: "4px 4px 0px 0px #000" }}
          >
            <div className="flex gap-2">
              <div className="w-5 h-5 rounded-full bg-[#FF0055] border-2 border-black" />
              <div className="w-5 h-5 rounded-full bg-[#DFFF00] border-2 border-black" />
              <div className="w-5 h-5 rounded-full bg-green-500 border-2 border-black" />
            </div>
            <div
              className="ml-4 flex-1 bg-[#f0f0f0] h-9 border-4 border-black flex items-center px-4 font-mono font-bold text-sm"
              style={{ boxShadow: "inset 2px 2px 6px rgba(0,0,0,0.2)" }}
            >
              https://example.com/automation
            </div>
          </div>

          {/* Screen */}
          <div
            className="flex-1 border-4 border-black bg-white relative overflow-hidden flex items-center justify-center"
            style={{ boxShadow: "inset 4px 4px 10px rgba(0,0,0,0.15)" }}
          >
            {/* Scanlines */}
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.04) 3px, rgba(0,0,0,0.04) 4px)" }} />

            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              className="w-28 h-28 border-8 border-dashed border-[#0055FF] rounded-full absolute opacity-20"
            />

            <div
              className="relative z-10 bg-white border-4 border-black p-5 rotate-2"
              style={{ boxShadow: "6px 6px 0px 0px #000" }}
            >
              <p className="text-[#FF0055] font-black font-mono tracking-widest uppercase text-lg">Agent Active</p>
              <h3 className="text-3xl font-black mt-1">Analyzing DOM...</h3>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
