'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Copy, 
  Check, 
  MessageCircle, 
  Download, 
  Mail, 
  ExternalLink, 
  X, 
  Calendar, 
  MapPin, 
  Clock, 
  Code2,
  Sparkles
} from 'lucide-react';
import { sound } from '@/utils/soundEngine';

export default function RecruiterModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const copyText = (text: string, type: 'email' | 'phone') => {
    sound.playChime();
    navigator.clipboard.writeText(text);
    if (type === 'email') {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } else {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
          />

          {/* Recruiter Modal Box */}
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 26, stiffness: 350 }}
            className="relative w-full max-w-lg rounded-3xl bg-zinc-950/95 border border-indigo-500/30 shadow-[0_0_80px_rgba(99,102,241,0.25)] backdrop-blur-2xl overflow-hidden pointer-events-auto p-6 md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                  <Zap className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg flex items-center gap-2">
                    <span>Recruiter Fast Track</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono uppercase font-bold">
                      Available
                    </span>
                  </h3>
                  <p className="text-gray-400 text-xs mt-0.5">Quick connection & direct candidate access for hiring managers.</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-2.5 mb-6">
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
                <span className="text-[10px] text-gray-500 uppercase font-mono block font-bold">Role Focus</span>
                <span className="text-white font-semibold text-xs mt-0.5 block truncate">Full-Stack / ML</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
                <span className="text-[10px] text-gray-500 uppercase font-mono block font-bold">Location</span>
                <span className="text-white font-semibold text-xs mt-0.5 block truncate">Vadodara / Remote</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
                <span className="text-[10px] text-gray-500 uppercase font-mono block font-bold">Notice Period</span>
                <span className="text-emerald-400 font-semibold text-xs mt-0.5 block truncate">Immediate</span>
              </div>
            </div>

            {/* 1-Click Action Buttons */}
            <div className="space-y-3">
              {/* WhatsApp Direct Chat */}
              <a
                href="https://wa.me/919265982724?text=Hi%20Neel,%20I%20reviewed%20your%20portfolio%20and%20would%20like%20to%20discuss%20an%20opportunity."
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sound.playClick()}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-semibold text-xs md:text-sm transition-all shadow-md group active:scale-98"
              >
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-emerald-400" />
                  <span>Chat on WhatsApp (Direct Message)</span>
                </div>
                <ExternalLink className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
              </a>

              {/* Copy Email Button */}
              <button
                onClick={() => copyText('bhattneel2004@gmail.com', 'email')}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 text-xs md:text-sm font-medium transition-all group active:scale-98 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-indigo-400" />
                  <span>bhattneel2004@gmail.com</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-mono text-gray-400 group-hover:text-white">
                  {copiedEmail ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400 font-semibold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Email</span>
                    </>
                  )}
                </div>
              </button>

              {/* Download CV */}
              <a
                href="/NeelBhatt_Resume.pdf"
                download="NeelBhatt_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sound.playClick()}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 font-semibold text-xs md:text-sm transition-all shadow-md group active:scale-98"
              >
                <div className="flex items-center gap-3">
                  <Download className="w-5 h-5 text-indigo-400" />
                  <span>Download Complete ATS Resume (PDF)</span>
                </div>
                <span className="text-xs font-mono text-indigo-300">1-Click</span>
              </a>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-500 font-mono">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                Response time: &lt; 2 hours
              </span>
              <span>IST (UTC+5:30)</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
