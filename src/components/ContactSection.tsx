"use client";
import { useState } from "react";

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

  return (
    <section className="relative min-h-screen flex items-center z-10 bg-transparent">
      {/* Container constrained to the LEFT for 3D Avatar visibility */}
      <div className="w-full lg:w-[60%] px-10 lg:pl-20">
        <div className="max-w-md">
          <h2 className="text-white text-7xl font-black uppercase tracking-tighter italic opacity-10 mb-8">
            Contact
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4 p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
            {/* Name Input */}
            <input
              type="text"
              placeholder="Your Name"
              className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-indigo-500 transition-all"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            {/* Email Input */}
            <input
              type="email"
              placeholder="Your Email"
              className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-indigo-500 transition-all"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />

            {/* Message Textarea */}
            <textarea
              placeholder="Your Message"
              rows={5}
              className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-indigo-500 transition-all resize-none"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
            />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all disabled:opacity-50 shadow-lg shadow-indigo-500/20"
            >
              {status === "sending" ? "Sending..." : "Send Mail"}
            </button>
            
            {status === "success" && (
              <p className="text-green-400 text-center mt-4 font-medium">Message sent successfully!</p>
            )}
            {status === "error" && (
              <p className="text-red-400 text-center mt-4 font-medium">Something went wrong. Please try again.</p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}