"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Instagram, 
  Twitter, 
  MessageCircle, 
  Github, 
  Mail, 
  X, 
  Linkedin, 
  Copy, 
  Check, 
  Calendar, 
  ExternalLink, 
  Sparkles,
  Zap,
  Globe
} from "lucide-react";
import { sound } from "@/utils/soundEngine";

interface SocialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SocialModal({ isOpen, onClose }: SocialModalProps) {
  const [copied, setCopied] = useState(false);
  const emailAddress = "bhattneel2004@gmail.com";

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(emailAddress);
    setCopied(true);
    sound.playChime();
    setTimeout(() => setCopied(false), 2500);
  };

  const handleClose = () => {
    sound.playClick();
    onClose();
  };

  const primaryActions = [
    {
      name: "WhatsApp Direct",
      desc: "Fastest response (< 15 mins)",
      link: "https://wa.me/919265982724?text=Hi%20Neel,%20I%20saw%20your%20portfolio%20and%20wanted%20to%20connect!",
      icon: MessageCircle,
      accent: "from-emerald-500/20 via-green-500/10 to-transparent",
      border: "hover:border-emerald-500/50",
      iconColor: "text-emerald-400 group-hover:scale-110",
      badge: "Instant Chat",
      badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    },
    {
      name: "Email Directly",
      desc: "bhattneel2004@gmail.com",
      link: `mailto:${emailAddress}`,
      icon: Mail,
      accent: "from-indigo-500/20 via-violet-500/10 to-transparent",
      border: "hover:border-indigo-500/50",
      iconColor: "text-indigo-400 group-hover:scale-110",
      badge: "Inquiries & Projects",
      badgeColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
      isEmail: true,
    },
    {
      name: "Schedule a Call",
      desc: "15-min discovery & consultation",
      link: "https://cal.com/neel-bhatt", // or booking link
      icon: Calendar,
      accent: "from-amber-500/20 via-orange-500/10 to-transparent",
      border: "hover:border-amber-500/50",
      iconColor: "text-amber-400 group-hover:scale-110",
      badge: "Book Slot",
      badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    },
  ];

  const socialProfiles = [
    { 
      name: "GitHub", 
      link: "https://github.com/neel20409", 
      icon: Github, 
      color: "hover:text-white hover:border-white/40" 
    },
    { 
      name: "LinkedIn", 
      link: "https://linkedin.com/in/neel-bhatt", 
      icon: Linkedin, 
      color: "hover:text-sky-400 hover:border-sky-400/40" 
    },
    { 
      name: "Twitter / X", 
      link: "https://twitter.com/techwithneel", 
      icon: Twitter, 
      color: "hover:text-blue-400 hover:border-blue-400/40" 
    },
    { 
      name: "Instagram", 
      link: "https://www.instagram.com/_neel204", 
      icon: Instagram, 
      color: "hover:text-pink-400 hover:border-pink-400/40" 
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 select-none">
          {/* Backdrop Blur */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="relative w-full max-w-lg rounded-3xl border border-white/20 bg-zinc-950/90 p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.95)] backdrop-blur-2xl pointer-events-auto overflow-hidden"
          >
            {/* Ambient Background Glow */}
            <div className="absolute -top-24 -left-24 w-60 h-60 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-60 h-60 rounded-full bg-fuchsia-500/15 blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white font-mono flex items-center gap-2">
                    Let's Connect
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[11px] font-mono text-emerald-400 font-medium">
                      Available for projects & roles
                    </span>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleClose} 
                className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-white/50 hover:text-white transition-all cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Quick Action Cards */}
            <div className="space-y-3 mb-6">
              <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 font-bold">
                Direct Channels
              </span>

              {primaryActions.map((action) => (
                <div
                  key={action.name}
                  className={`relative group flex items-center justify-between rounded-2xl border border-white/10 bg-gradient-to-r ${action.accent} p-3.5 sm:p-4 transition-all duration-300 ${action.border} hover:bg-white/10`}
                >
                  <a
                    href={action.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => sound.playClick()}
                    className="flex items-center gap-3.5 flex-1 min-w-0"
                  >
                    <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-white/10 text-white group-hover:border-white/30 transition-all">
                      <action.icon size={20} className={`transition-transform duration-300 ${action.iconColor}`} />
                    </div>
                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white tracking-wide">{action.name}</span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${action.badgeColor}`}>
                          {action.badge}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 font-mono truncate mt-0.5">{action.desc}</p>
                    </div>
                  </a>

                  {/* Copy Button for Email */}
                  {action.isEmail ? (
                    <button
                      onClick={handleCopyEmail}
                      title="Copy Email"
                      className="ml-2 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      {copied ? (
                        <>
                          <Check size={14} className="text-emerald-400" />
                          <span className="text-[10px] font-mono text-emerald-400 font-bold">COPIED</span>
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          <span className="text-[10px] font-mono text-zinc-300">COPY</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <a
                      href={action.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => sound.playClick()}
                      className="ml-2 p-2 rounded-xl bg-white/5 group-hover:bg-white/20 text-zinc-400 group-hover:text-white transition-all"
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}
                </div>
              ))}
            </div>

            {/* Social Profile Grid */}
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 font-bold mb-3 block">
                Social Profiles
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {socialProfiles.map((social) => (
                  <a
                    key={social.name}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => sound.playClick()}
                    onMouseEnter={() => sound.playHover()}
                    className={`flex items-center justify-center gap-2 py-3 px-2 rounded-xl border border-white/10 bg-zinc-900/60 text-zinc-400 text-xs font-mono font-medium transition-all duration-300 hover:bg-white/10 ${social.color} group`}
                  >
                    <social.icon size={16} className="transition-transform group-hover:scale-110" />
                    <span>{social.name}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Footer Location & Status */}
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-zinc-500">
              <span className="flex items-center gap-1.5">
                <Globe size={13} className="text-cyan-400" /> Gujarat, India (IST / UTC+5:30)
              </span>
              <span className="text-zinc-400">Response time: ~1 hour</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}