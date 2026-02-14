'use client';
import { useEffect, useState } from "react";

/* src/components/NightSky.tsx */
export default function NightSky() {
  const starCount = 15; 
 const [stars, setStars] = useState<{top: string, right: string, delay: string}[]>([]);

  useEffect(() => {
    // Generate the random values ONLY once after the component mounts
    const generatedStars = Array.from({ length: 50 }).map(() => ({
      top: `${Math.random() * -20 - 10}%`,
      right: `${Math.random() * 100}%`,
      delay: `${Math.random() * 10}s`,
    }));
    setStars(generatedStars);
  }, []);
  return (
    <div className="fixed inset-0 z-[-1] bg-[#000000] overflow-hidden">
      {/* Cloudy Night Atmosphere */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-slate-800/20 blur-[120px] rounded-full animate-pulse" />

      <div className="absolute inset-0 pointer-events-none">
        {stars.map((_, i) => (
          <div
            key={i}
            className="absolute w-[1.5px] h-[120px] bg-gradient-to-t from-white to-transparent animate-shooting"
            style={{
              // Start significantly higher off-screen (-30% to -10%) 
              // to ensure they aren't visible until the animation moves them
              top: `${Math.random() * -20 - 10}%`, 
              right: `${Math.random() * 100}%`,
              
              // Spread delays out so they enter the screen at different times
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
              opacity: 0, // Initial state before animation starts
            }}
          />
        ))}
      </div>
    </div>
  );
}