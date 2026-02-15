"use client";
import React, { JSX, useState } from "react";
import { AnimatePresence,useScroll, useMotionValueEvent } from "framer-motion";
import { motion as motion3D } from "framer-motion";
import { cn } from "@/libs/utils";

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

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (typeof current === "number") {
      let direction = current! - scrollYProgress.getPrevious()!;
      if (scrollYProgress.get() < 0.05) {
        setVisible(false);
      } else {
        setVisible(true)
      }
    }
  });

  return (
    <AnimatePresence mode="wait">
      <motion3D.div
        initial={{ opacity: 1, y: -100 }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{ duration: 0.2 }}
        className={cn(
          // Adjusted: Added px-10 for horizontal expansion, space-x-8 for item distance
          "flex max-w-[90vw] md:max-w-fit fixed top-5 md:top-10 inset-x-0 mx-auto border border-transparent dark:border-white/[0.2] rounded-full dark:bg-black bg-white shadow-xl z-[5000] px-8 md:px-10 py-3 items-center justify-center md:space-x-10 space-x-8",
          className
        )}
      >
        {navItems.map((navItem: any, idx: number) => (
          <a
            key={`link=${idx}`}
            href={navItem.link}
            className={cn(
              "relative items-center flex space-x-1 transition-all duration-300 ease-out",
              "text-neutral-600 dark:text-neutral-50 font-medium",
              "border-b-2 border-transparent pb-1", 
              "hover:text-blue-500 hover:border-blue-500",
              "hover:shadow-[0_15px_30px_-10px_rgba(59,130,246,0.8)]",
              "hover:-translate-y-0.5"
            )}
          >
            <span className="block sm:hidden">{navItem.icon}</span>
            <span className="hidden sm:block text-sm tracking-wide">{navItem.name}</span>
          </a>
        ))}
      </motion3D.div>
    </AnimatePresence>
  );
};