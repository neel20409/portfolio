"use client";
import { useState } from "react";
import { Button } from "./ui/moving-border";

export default function ContactSection() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("bhattneel2004@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section className="relative min-h-screen flex items-center z-10 bg-transparent py-16 sm:py-20">
      {/* Container constrained to the LEFT for 3D Avatar visibility */}
      <div className="w-full lg:w-[60%] px-4 sm:px-6 md:px-10 lg:pl-20">
        <div className="max-w-md mx-auto lg:mx-0">
          <h2 className="text-white text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tighter italic opacity-10 mb-4">
            Contact
          </h2>

          {/* Quick Direct Email Pill */}
          <div className="mb-5 flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-lg">
            <div className="flex items-center gap-2.5 truncate">
              <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
              <span className="text-xs sm:text-sm text-gray-300 font-mono truncate">bhattneel2004@gmail.com</span>
            </div>
            <button
              onClick={handleCopyEmail}
              type="button"
              className="ml-2.5 px-3 py-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/60 border border-indigo-400/30 text-indigo-200 text-xs font-semibold transition-all flex-shrink-0 flex items-center gap-1.5 active:scale-95 cursor-pointer"
            >
              {copied ? "✓ Copied!" : "Copy"}
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4 p-5 sm:p-7 md:p-8 rounded-3xl bg-zinc-950/70 backdrop-blur-xl border border-white/10 shadow-2xl">
            {/* Name Input */}
            <input
              type="text"
              placeholder="Your Name"
              className="w-full p-3.5 sm:p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-indigo-500 transition-all text-base"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            {/* Email Input */}
            <input
              type="email"
              placeholder="Your Email"
              className="w-full p-3.5 sm:p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-indigo-500 transition-all text-base"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />

            {/* Message Textarea */}
            <textarea
              placeholder="Your Message"
              rows={4}
              className="w-full p-3.5 sm:p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-indigo-500 transition-all resize-none text-base"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
            />

            {/* Submit Button */}
            <Button
              borderRadius="1.75rem"
              className="w-full p-3.5 sm:p-4 bg-indigo-900 hover:bg-indigo-800 text-white rounded-xl flex items-center justify-center font-bold transition-all disabled:opacity-50 shadow-lg shadow-indigo-500/20 text-sm sm:text-base cursor-pointer"
              type="submit"
              disabled={status === "sending"}
            >
              {status === "sending" ? "Sending..." : "Send Message"}
            </Button>
            {status === "success" && (
              <p className="text-emerald-400 text-center mt-3 text-xs sm:text-sm font-medium">✓ Message sent successfully!</p>
            )}
            {status === "error" && (
              <p className="text-red-400 text-center mt-3 text-xs sm:text-sm font-medium">Could not send right now. Feel free to copy my email above!</p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}