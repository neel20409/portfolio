'use client';
import { useEffect, useState } from "react";

export default function NightSky() {
  // Define the structure of our star data
  const [stars, setStars] = useState<{
    top: string; 
    right: string; 
    delay: string; 
    duration: string;
  }[]>([]);

  useEffect(() => {
    // Generate the random values ONLY once after the component mounts
    // This satisfies the React 19/Next.js purity requirements
    const generatedStars = Array.from({ length: 50 }).map(() => ({
      top: `${Math.random() * -20 - 10}%`,
      right: `${Math.random() * 100}%`,
      delay: `${Math.random() * 10}s`,
      duration: `${2 + Math.random() * 2}s`,
    }));
    setStars(generatedStars);
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] bg-[#000000] overflow-hidden">
      {/* Cloudy Night Atmosphere */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-slate-800/20 blur-[120px] rounded-full animate-pulse" />

      <div className="absolute inset-0 pointer-events-none">
        {stars.map((star, i) => (
          <div
            key={i}
            className="absolute w-[1.5px] h-[120px] bg-gradient-to-t from-white to-transparent animate-shooting"
            style={{
              // Use the stable values from state instead of Math.random()
              top: star.top, 
              right: star.right,
              animationDelay: star.delay,
              animationDuration: star.duration,
              opacity: 0, 
            }}
          />
        ))}
      </div>
    </div>
  );
}