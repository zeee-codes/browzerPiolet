"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { motion } from "framer-motion";
import Link from "next/link";

export default function LandingHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      
      tl.from(".reveal-block", {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "back.out(1.7)",
        delay: 0.2
      });

      tl.from(".fade-in", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out"
      }, "-=0.4");
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-32">
      <div className="container relative z-10 mx-auto px-6 flex flex-col items-center text-center">
        <h1 ref={titleRef} className="text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter mb-8 leading-[0.9]">
          <div className="overflow-hidden p-2">
            <span className="inline-block reveal-block bg-accent-yellow px-4 border-4 border-black brutal-shadow -rotate-2">Your</span>
          </div>
          <div className="overflow-hidden p-2">
            <span className="inline-block reveal-block bg-white px-4 border-4 border-black brutal-shadow rotate-1">Browser.</span>
          </div>
          <div className="overflow-hidden p-2">
            <span className="inline-block reveal-block bg-accent-blue text-white px-4 border-4 border-black brutal-shadow">Autonomous.</span>
          </div>
        </h1>
        
        <p ref={subtitleRef} className="fade-in max-w-2xl text-xl md:text-2xl font-bold bg-white border-4 border-black p-6 brutal-shadow mb-12">
          BrowserPilot AI understands instructions and interacts with any website on your behalf.
          Watch it click, type, and extract data.
        </p>

        <div className="fade-in flex items-center gap-6">
          <Link href="/agent" className="px-10 py-5 bg-accent-pink text-white font-black text-xl uppercase tracking-wider brutal-border brutal-shadow brutal-shadow-hover skeuo-button active:skeuo-inner inline-block">
            Start Automating
          </Link>
          <button className="px-10 py-5 bg-white font-black text-xl uppercase tracking-wider brutal-border brutal-shadow brutal-shadow-hover skeuo-button">
            Watch Demo
          </button>
        </div>
      </div>

      {/* Heavy Physical Browser Mockup */}
      <motion.div 
        className="mt-24 w-full max-w-5xl mx-auto px-6 fade-in relative z-20"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8, type: "spring", stiffness: 100, damping: 20 }}
      >
        {/* Physical thick beige plastic casing */}
        <div className="relative rounded-lg border-8 border-black bg-[#e0dcd3] brutal-shadow p-4 aspect-video flex flex-col">
          
          {/* Hardware Browser Top Bar */}
          <div className="h-16 border-4 border-black bg-white flex items-center px-4 gap-4 mb-4 brutal-shadow skeuo-inner">
            {/* Physical Buttons */}
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-accent-pink border-4 border-black brutal-shadow skeuo-button" />
              <div className="w-6 h-6 rounded-full bg-accent-yellow border-4 border-black brutal-shadow skeuo-button" />
              <div className="w-6 h-6 rounded-full bg-green-500 border-4 border-black brutal-shadow skeuo-button" />
            </div>
            
            {/* Address Bar */}
            <div className="ml-4 flex-1 bg-[#f0f0f0] h-10 border-4 border-black brutal-shadow flex items-center px-4 font-mono font-bold text-lg skeuo-inner">
              https://example.com/automation
            </div>
          </div>
          
          {/* Fake Screen Content */}
          <div className="flex-1 border-4 border-black bg-white relative overflow-hidden skeuo-inner flex flex-col items-center justify-center">
            {/* Scanline effect over screen */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,0,0,0.05)_50%)] bg-[length:100%_4px] pointer-events-none z-10" />
            
            <motion.div 
              animate={{ 
                rotate: 360
              }}
              transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
              className="w-32 h-32 border-8 border-dashed border-accent-blue rounded-full absolute"
            />
            
            <div className="relative z-10 text-center bg-white border-4 border-black p-4 brutal-shadow rotate-2">
              <p className="text-accent-pink font-black font-mono tracking-widest uppercase text-xl">Agent Active</p>
              <h3 className="text-3xl font-black mt-2">Analyzing DOM...</h3>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
