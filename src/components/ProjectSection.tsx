"use client";
import React from 'react';
import { motion } from 'framer-motion';

const ProjectSection = () => {
  const projects = [
    { title: "Spotify Clone", tech: "React Native", desc: "Mobile music streaming app." },
    { title: "Blogging System", tech: "Next.js", desc: "Full-stack CMS platform." },
    { title: "AI Chatbot", tech: "Gemini API", desc: "Intelligent conversational UI." },
    { title: "Portfolio 3D", tech: "Three.js", desc: "Interactive 3D web experience." },
  ];

  return (
    <div className="relative min-h-screen py-20 bg-transparent">
      {/* PROJECT HEADING in the LEFT corner */}
      <div className="max-w-7xl mx-auto px-10 mb-5">
         <h2 className="text-white text-7xl font-black uppercase tracking-tighter italic opacity-10">
            Projects
          </h2>
      </div>

      {/* GRID VIEW: Constrained to the LEFT to make room for Avatar on the Right */}
      <div className="relative z-10 w-full lg:w-[60%] px-10 lg:pl-20 pb-40">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-indigo-500/50 transition-all shadow-2xl"
            >
              <span className="text-indigo-400 font-bold text-sm uppercase">{project.tech}</span>
              <h3 className="text-white text-3xl font-bold mt-2">{project.title}</h3>
              <p className="text-gray-400 mt-4">{project.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectSection;