"use client";
import { motion } from "framer-motion";
import { User, GraduationCap, Code2, Heart } from "lucide-react";

import { FloatingNav } from "@/components/ui/floating-navbar";
import { IconHome, IconMessage, IconUser } from "@tabler/icons-react";
import ContactSection from "@/components/ContactSection";

export default function page() {
  const stats = [
    { label: "Current Focus", value: "Image Classification (Python)", icon: Code2 },
    { label: "Education", value: "BCA, MSU Baroda", icon: GraduationCap },
    { label: "Status", value: "Available for Projects", icon: User },
  ];
const navItems = [
    {
      name: "Home",
      link: "/",
      icon: <IconHome className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "About",
      link: "/about",
      icon: <IconUser className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "Contact",
      link: "#contact",
      icon: (
        <IconMessage className="h-4 w-4 text-neutral-500 dark:text-white" />
      ),
    },
  ];
  return (
    <section className="relative min-h-screen py-20 px-10 flex flex-col items-center justify-center overflow-hidden">
       <FloatingNav navItems={navItems} />
      {/* Background Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 z-10">
        
        {/* LEFT: TEXT CONTENT */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col justify-center"
        >
          <h2 className="text-indigo-400 font-black uppercase tracking-[0.3em] mb-4 flex items-center gap-3">
            <span className="w-10 h-[2px] bg-indigo-500"></span>
            About Section
          </h2>
          <h1 className="text-white text-6xl font-black uppercase tracking-tighter mb-8 italic">
            Architect of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">
              Intelligence
            </span>
          </h1>
          
          <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-lg">
            I am <span className="text-white font-bold">Neel Bhatt</span>, a BCA student at <span className="text-indigo-300">MSU Baroda</span> with a passion for building seamless digital experiences and exploring the depths of AI. 
            Currently, I specialize in <span className="text-white font-semibold">Python</span> and deep learning, specifically crafting image classification models using <span className="text-blue-400">TensorFlow and Keras</span>.
          </p>

          <div className="flex flex-wrap gap-4">
            {stats.map((stat, i) => (
              <div key={i} className="px-5 py-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                <stat.icon className="text-indigo-500" size={18} />
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">{stat.label}</span>
                  <span className="text-white text-sm font-semibold">{stat.value}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* RIGHT: THE "GLASS" CARD */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative bg-zinc-950 border border-white/10 rounded-[2.5rem] p-10 overflow-hidden">
            
            {/* Inner "System" styling */}
            <div className="mb-10 flex items-center justify-between">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
              </div>
              <span className="text-[10px] text-gray-600 font-mono tracking-widest">NEEL_PROFILE_V2.0</span>
            </div>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Code2 className="text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Engineering with Code</h3>
                  <p className="text-gray-500 text-sm">Passionate about Web Development and building responsive React Native applications like my recent SpotifyClone project.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Heart className="text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Interests & Hobbies</h3>
                  <p className="text-gray-500 text-sm">When the screen fades to black, the pulse of the engine replaces the rhythm of the keyboard. I am a rider of the open road, seeking the silent wisdom carved into ancient stone.

Between the hum of a moving bike and the weathered geometry of heritage monuments, I find the same structural beauty I seek in code: a balance of history, geometry, and the thrill of the unknown.</p>
                </div>
              </div>
            </div>

            {/* Shine effect across the card */}
            <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-40 animate-shine pointer-events-none" />
          </div>
        </motion.div>
      </div>
       <section id="contact" className=" mt-40 relative z-10 w-full"><ContactSection /></section>
    </section>
    
  );
}