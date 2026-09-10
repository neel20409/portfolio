"use client";
import React, { JSX, useState } from "react";
import { AnimatePresence, useScroll, useMotionValueEvent, motion } from "framer-motion";
import { cn } from "@/libs/utils";
import { sfx } from "@/utils/sfx";

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: JSX.Element;
  }[];
  className?: string;
}) => {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("Home");

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (typeof current === "number") {
      if (scrollYProgress.get() < 0.02) {
        setVisible(true);
      } else {
        setVisible(true);
      }
    }
  });

  return (
    <AnimatePresence mode="wait">
      <motion.nav
        initial={{ opacity: 0, y: -40 }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className={cn(
          "fixed top-3.5 sm:top-5 md:top-8 inset-x-0 mx-auto max-w-fit rounded-full",
          "bg-zinc-950/80 backdrop-blur-2xl border border-white/12",
          "shadow-[0_10px_35px_rgba(0,0,0,0.8),0_0_20px_rgba(99,102,241,0.15)]",
          "z-40 px-2 sm:px-4 py-1.5 flex items-center gap-1 sm:gap-2",
          className
        )}
      >
        {navItems.map((navItem, idx) => {
          const isActive = activeTab === navItem.name;

          return (
            <a
              key={`nav-${idx}`}
              href={navItem.link}
              onClick={() => {
                setActiveTab(navItem.name);
                sfx.playHoverBlip();
              }}
              onMouseEnter={() => sfx.playHoverBlip()}
              className={cn(
                "relative flex items-center gap-1 sm:gap-1.5 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-xs md:text-sm font-medium transition-all duration-300",
                isActive 
                  ? "text-white font-semibold" 
                  : "text-gray-400 hover:text-gray-100"
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="activeNavPill"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-600/70 to-cyan-500/60 border border-indigo-400/50 shadow-[0_0_15px_rgba(99,102,241,0.4)]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1 sm:gap-1.5">
                {navItem.icon && <span className="text-indigo-400">{navItem.icon}</span>}
                <span className="tracking-wide">{navItem.name}</span>
              </span>
            </a>
          );
        })}
      </motion.nav>
    </AnimatePresence>
  );
};