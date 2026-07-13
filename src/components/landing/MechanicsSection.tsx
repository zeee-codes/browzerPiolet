"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function MechanicsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRefs = useRef<(HTMLHeadingElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      textRefs.current.forEach((text, i) => {
        if (!text) return;
        
        // Find the marker span inside the heading
        const marker = text.querySelector('.marker-highlight');
        
        gsap.fromTo(text, 
          { x: -50, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.5,
            scrollTrigger: {
              trigger: text,
              start: "top 85%",
              end: "top 50%",
              scrub: 1, // Add some smoothing to the scrub
            }
          }
        );

        if (marker) {
          gsap.fromTo(marker,
            { width: "0%" },
            {
              width: "100%",
              duration: 1,
              scrollTrigger: {
                trigger: text,
                start: "top 75%",
                end: "top 40%",
                scrub: 1,
              }
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const mechanics = [
    { text: "Tell the agent what you want.", highlight: "bg-accent-yellow" },
    { text: "It plans the optimal path.", highlight: "bg-accent-blue text-white" },
    { text: "Interacts just like a human.", highlight: "bg-accent-pink text-white" },
    { text: "Extracts what you need.", highlight: "bg-black text-white" },
  ];

  return (
    <section ref={sectionRef} className="py-40 bg-white relative border-t-8 border-black border-b-8 z-10">
      {/* Background brutalist grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#000_2px,transparent_2px),linear-gradient(to_bottom,#000_2px,transparent_2px)] bg-[size:100px_100px] opacity-5 pointer-events-none" />
      
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="space-y-32">
          {mechanics.map((item, i) => (
            <h2 
              key={i} 
              ref={(el) => { textRefs.current[i] = el; }}
              className="text-4xl md:text-6xl lg:text-8xl font-black uppercase tracking-tighter text-black w-max max-w-[90vw]"
            >
              <span className="relative inline-block px-4 py-2">
                <span className={`absolute inset-0 marker-highlight ${item.highlight} -z-10 brutal-border origin-left`} />
                <span className="relative z-10 mix-blend-difference text-white">{item.text}</span>
              </span>
            </h2>
          ))}
        </div>
      </div>
    </section>
  );
}
