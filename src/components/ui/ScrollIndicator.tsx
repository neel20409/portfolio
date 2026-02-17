"use client";
import { motion } from "framer-motion";

export const ScrollIndicator = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 2 }}
className="absolute bottom-10 left-8 md:left-10 flex flex-col items-center gap-2 z-20 pointer-events-none"
    >
      <span className="text-gray-400 text-[10px] uppercase tracking-[0.2em] font-medium">
        Scroll Down
      </span>
      {/* Mouse Icon Visual */}
      <div className="w-[20px] h-[35px] border-2 border-white/20 rounded-full flex justify-center p-1">
        <motion.div 
          animate={{ 
            y: [0, 12, 0],
            opacity: [1, 0, 1] 
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="w-1 h-2 bg-indigo-400 rounded-full"
        />
      </div>
    </motion.div>
  );
};