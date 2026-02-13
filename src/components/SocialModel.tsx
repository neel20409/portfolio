"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Instagram, Twitter, MessageCircle, Github, Mail, X } from "lucide-react";

export default function SocialModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const handles = [
    { name: "Instagram", link: "https://www.instagram.com/_neel204", icon: Instagram, color: "group-hover:text-pink-500" },
    { name: "Twitter", link: "https://twitter.com/techwithneel", icon: Twitter, color: "group-hover:text-blue-400" },
    { name: "WhatsApp", link: "https://wa.me/9265982724", icon: MessageCircle, color: "group-hover:text-green-500" },
    { name: "GitHub", link: "https://github.com/neel20409", icon: Github, color: "group-hover:text-white" },
    { name: "Email", link: "mailto:bhattneel2004@gmail.com", icon: Mail, color: "group-hover:text-indigo-400" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-sm rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl pointer-events-auto"
          >
            <div className="mb-6 flex items-center justify-between text-white">
              <h3 className="text-2xl font-black italic uppercase tracking-tighter">Connect</h3>
              <button onClick={onClose} className="text-white/50 hover:text-white"><X size={24} /></button>
            </div>

            <div className="grid gap-4">
              {handles.map((social) => (
                <a
                  key={social.name}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  /* Apply the CSS class here */
                  className="glass-shine-effect flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-4 text-white/80 transition-all hover:bg-white/20 hover:border-white/30 group"
                >
                  <div className="flex items-center gap-4">
                    <social.icon size={20} className={`transition-colors duration-300 ${social.color}`} />
                    <span className="font-bold tracking-widest uppercase text-[10px]">{social.name}</span>
                  </div>
                  <span className="group-hover:translate-x-1 transition-transform opacity-50">→</span>
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}