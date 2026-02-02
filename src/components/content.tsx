"use client";
import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';

const Content = ({ onCVClick }: { onCVClick: () => void }) => {
  const name = "Neel Bhatt";
  const roles = ["Web Development", "Mobile Development", "FrontEnd Designing", "3D Interactive Specialization"];
  
  const [displayText, setDisplayText] = useState("");
  const [roleIndex, setRoleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [speed, setSpeed] = useState(150);

  useEffect(() => {
    const handleTyping = () => {
      const currentRole = roles[roleIndex];
      
      if (isDeleting) {
        setDisplayText(currentRole.substring(0, displayText.length - 1));
        setSpeed(50);
      } else {
        setDisplayText(currentRole.substring(0, displayText.length + 1));
        setSpeed(150);
      }

      if (!isDeleting && displayText === currentRole) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && displayText === "") {
        setIsDeleting(false);
        setRoleIndex((prev) => (prev + 1) % roles.length);
      }
    };

    const timer = setTimeout(handleTyping, speed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, roleIndex, speed, roles]);

  const nameContainer = {
    show: { transition: { staggerChildren: 0.1 } }
  };

  const nameLetter = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="h-full flex flex-col justify-center items-start pl-20 relative z-10 pointer-events-none">
      
      {/* --- GLASS CARD START --- */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="p-10 rounded-[2.5rem] border-amber-100 bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl pointer-events-auto"
      >
        <motion.h1 
          variants={nameContainer}
          initial="hidden"
          animate="show"
          className="text-white text-6xl font-black uppercase flex flex-wrap"
        >
          {name.split("").map((char, i) => (
            <motion.span key={i} variants={nameLetter}>
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </motion.h1>

        <div className="h-10 mt-4 flex items-center">
          <p className="text-gray-200 text-2xl font-medium tracking-wide">
            The Architect of Intelligence refined in <span className="text-indigo-400">{displayText}</span>
            <span className="animate-pulse border-r-2 border-indigo-500 ml-1"></span>
          </p>
        </div>
      </motion.div>
      {/* --- GLASS CARD END --- */}

      {/* Footer Elements */}
      <div className="fixed bottom-10 left-0 w-full px-10 flex justify-between items-end z-50 pointer-events-none">
        <div className="flex-1" /> 
        <button className="pointer-events-auto flex items-center gap-2 px-8 py-3 bg-white text-black rounded-full font-bold shadow-xl hover:bg-gray-200 transition-colors">
          CONNECT <span>+</span>
        </button>
        <div className="flex-1 flex justify-end">
          <a href="/cv.pdf" className="pointer-events-auto text-gray-400 hover:text-white underline">
            CV
          </a>
        </div>
      </div>
    </div>
  );
};

export default Content;