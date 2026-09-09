'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function AudioVisualizer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);

  const startAmbientSynth = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 3);
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      // Harmonic space drone chord frequencies (D minor celestial pad: D2, A2, F3, C4)
      const freqs = [73.42, 110.0, 174.61, 261.63, 329.63];

      oscillatorsRef.current = freqs.map((freq, i) => {
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
        const oscGain = ctx.createGain();

        osc.type = i % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        // Subtle gentle detune
        osc.detune.setValueAtTime(Math.sin(i) * 6, ctx.currentTime);

        // Low-pass filter for warm atmospheric sound
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450 + i * 80, ctx.currentTime);

        oscGain.gain.setValueAtTime(0.2 / freqs.length, ctx.currentTime);

        osc.connect(filter);
        filter.connect(oscGain);

        if (panner) {
          panner.pan.setValueAtTime(Math.sin(i * 1.5) * 0.6, ctx.currentTime);
          oscGain.connect(panner);
          panner.connect(masterGain);
        } else {
          oscGain.connect(masterGain);
        }

        osc.start();
        return osc;
      });

      setIsPlaying(true);
    } catch (e) {
      console.warn('Web Audio synthesis error:', e);
    }
  };

  const stopAmbientSynth = () => {
    if (audioCtxRef.current && gainNodeRef.current) {
      const ctx = audioCtxRef.current;
      const gain = gainNodeRef.current;
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);

      setTimeout(() => {
        oscillatorsRef.current.forEach((osc) => {
          try {
            osc.stop();
            osc.disconnect();
          } catch {}
        });
        oscillatorsRef.current = [];
        ctx.close();
        audioCtxRef.current = null;
        setIsPlaying(false);
      }, 1200);
    }
  };

  const toggleAudio = () => {
    if (isPlaying) {
      stopAmbientSynth();
    } else {
      startAmbientSynth();
    }
  };

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        try {
          audioCtxRef.current.close();
        } catch {}
      }
    };
  }, []);

  return (
    <div className="fixed bottom-5 md:bottom-10 left-6 md:left-10 z-50 pointer-events-auto">
      <button
        onClick={toggleAudio}
        className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 hover:border-indigo-500/40 transition-all text-gray-300 hover:text-white shadow-lg active:scale-95"
        title={isPlaying ? 'Mute Ambient Soundscape' : 'Play Ambient Space Synth'}
      >
        {isPlaying ? (
          <>
            <div className="flex items-end gap-[3px] h-3.5 w-3.5 mr-0.5">
              <span className="w-[2px] bg-indigo-400 rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-full" />
              <span className="w-[2px] bg-cyan-400 rounded-full animate-[pulse_0.9s_ease-in-out_infinite] h-3/4" />
              <span className="w-[2px] bg-purple-400 rounded-full animate-[pulse_0.7s_ease-in-out_infinite] h-1/2" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-300">AUDIO ON</span>
          </>
        ) : (
          <>
            <VolumeX className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-200" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 group-hover:text-gray-200">
              AUDIO
            </span>
          </>
        )}
      </button>
    </div>
  );
}
