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
    <section className="min-h-screen flex flex-col items-center justify-center p-10 bg-transparent text-white">
      <h2 className="text-4xl font-bold mb-6">Get in Touch</h2>
      <p className="mb-8 text-gray-400">Thank you for visiting! Feel free to drop a message.</p>
      
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <input
          type="text"
          placeholder="Your Name"
          className="w-full p-3 rounded bg-white/10 border border-white/20 focus:outline-none focus:border-blue-500"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Your Email"
          className="w-full p-3 rounded bg-white/10 border border-white/20 focus:outline-none focus:border-blue-500"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <textarea
          placeholder="Your Message"
          rows={5}
          className="w-full p-3 rounded bg-white/10 border border-white/20 focus:outline-none focus:border-blue-500"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          required
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded font-bold transition-colors disabled:opacity-50"
        >
          {status === "sending" ? "Sending..." : "Send Message"}
        </button>
        
        {status === "success" && <p className="text-green-400 text-center">Message sent successfully!</p>}
        {status === "error" && <p className="text-red-400 text-center">Something went wrong. Please try again.</p>}
      </form>
    </section>
  );
}