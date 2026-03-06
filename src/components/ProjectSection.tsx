"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ProjectSection = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const projects = [
    {
      title: "Spotify Clone",
      tech: "React Native",
      desc: "Mobile music streaming app.",
      link: "https://expo.dev/artifacts/eas/mLAQ4QzzANBrZz6SUTYsYm.apk",
      image: "/proof/pic2.jpeg"
    },
    {
      title: "Blogging System",
      tech: "Next.js",
      desc: "Full-stack CMS platform.",
      link: "https://github.com",
      image: null
    },
    {
      title: "AI Chatbot",
      tech: "Gemini API",
      desc: "Intelligent conversational UI.",
      link: "https://neels-bot.vercel.app/",
      image: "/proof/Pic1.png"
    },
    {
      title: "Portfolio 3D",
      tech: "Three.js",
      desc: "Interactive 3D web experience.",
      link: "https://github.com",
      image: null
    },
  ];

  return (
    <div className="relative min-h-screen py-20 bg-transparent">
      {/* Lightbox / Popup Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 md:p-10 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-5xl w-full max-h-[90vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage}
                alt="Project Proof"
                className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl border border-white/10"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 text-white/70 hover:text-white flex items-center gap-2 group transition-colors"
              >
                <span className="text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">Close</span>
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
              whileHover={{ y: -10 }}
              onClick={() => window.open(project.link, "_blank")}
              className="group relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-indigo-500/50 transition-all duration-500 shadow-2xl cursor-pointer flex flex-col h-full"
            >
              {/* Image Container with Click-to-Expand Overlay */}
              {project.image && (
                <div
                  className="relative h-48 w-full overflow-hidden cursor-zoom-in"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(project.image);
                  }}
                >
                  <motion.img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-60" />

                  {/* Subtle "Expand" Hint */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/10 backdrop-blur-md p-3 rounded-full border border-white/20 text-white">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}

              {/* Content Container */}
              <div className="p-8 relative z-10 flex flex-col flex-grow">
                <span className="text-indigo-400 font-bold text-sm uppercase tracking-wider">{project.tech}</span>
                <h3 className="text-white text-3xl font-bold mt-2 group-hover:text-indigo-300 transition-colors duration-300">{project.title}</h3>
                <p className="text-gray-400 mt-4 line-clamp-2 flex-grow">{project.desc}</p>

                <div className="mt-8 flex items-center text-indigo-400 font-bold text-sm group-hover:translate-x-2 transition-transform duration-300">
                  <span>Explore Project</span>
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>

              {/* Subtle background glow on hover */}
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectSection;
