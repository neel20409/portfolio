'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function AudioVisualizer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const nodesRef = useRef<{ oscs: OscillatorNode[]; lfo?: OscillatorNode }>({ oscs: [] });

  const getOrCreateContext = useCallback(() => {
    if (typeof window === 'undefined') return null;
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    return audioCtxRef.current;
  }, []);

  const startAmbientSynth = async () => {
    try {
      const ctx = getOrCreateContext();
      if (!ctx) return;

      // Crucial for iOS / Android mobile browsers: resume on user gesture
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      const now = ctx.currentTime;

      // Master gain node with smooth fade-in
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, now);
      masterGain.gain.exponentialRampToValueAtTime(0.18, now + 1.5);
      masterGain.connect(ctx.destination);
      masterGainRef.current = masterGain;

      // Mobile speaker optimized chord frequencies (A Major 9 Celestial Ambient Space Pad)
      const chord = [
        { freq: 220.00, type: 'sine' as OscillatorType, gain: 0.28 },
        { freq: 277.18, type: 'triangle' as OscillatorType, gain: 0.24 },
        { freq: 329.63, type: 'sine' as OscillatorType, gain: 0.22 },
        { freq: 415.30, type: 'triangle' as OscillatorType, gain: 0.18 },
        { freq: 554.37, type: 'sine' as OscillatorType, gain: 0.14 },
        { freq: 659.25, type: 'sine' as OscillatorType, gain: 0.10 },
      ];

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1600, now);
      filter.Q.setValueAtTime(1.5, now);
      filter.connect(masterGain);

      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(0.18, now);
      lfoGain.gain.setValueAtTime(250, now);
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start(now);

      const oscs: OscillatorNode[] = [];

      chord.forEach((voice, i) => {
        const osc = ctx.createOscillator();
        const vGain = ctx.createGain();

        osc.type = voice.type;
        osc.frequency.setValueAtTime(voice.freq, now);

        const detuneAmount = Math.sin(i * 1.7) * 8;
        osc.detune.setValueAtTime(detuneAmount, now);

        vGain.gain.setValueAtTime(voice.gain, now);

        osc.connect(vGain);
        vGain.connect(filter);

        osc.start(now);
        oscs.push(osc);
      });

      nodesRef.current = { oscs, lfo };
      setIsPlaying(true);
    } catch (e) {
      console.warn('Web Audio start error:', e);
    }
  };

  const stopAmbientSynth = () => {
    try {
      const ctx = audioCtxRef.current;
      const master = masterGainRef.current;
      if (ctx && master) {
        const now = ctx.currentTime;
        master.gain.exponentialRampToValueAtTime(0.0001, now + 1.0);

        setTimeout(() => {
          nodesRef.current.oscs.forEach((osc) => {
            try {
              osc.stop();
              osc.disconnect();
            } catch {}
          });
          if (nodesRef.current.lfo) {
            try {
              nodesRef.current.lfo.stop();
              nodesRef.current.lfo.disconnect();
            } catch {}
          }
          nodesRef.current = { oscs: [] };
          setIsPlaying(false);
        }, 1000);
      }
    } catch {
      setIsPlaying(false);
    }
  };

  const toggleAudio = async () => {
    if (isPlaying) {
      stopAmbientSynth();
    } else {
      await startAmbientSynth();
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
    <button
      onClick={toggleAudio}
      onTouchEnd={(e) => {
        e.stopPropagation();
      }}
      className="pointer-events-auto group flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-full bg-zinc-950/80 hover:bg-zinc-900 backdrop-blur-xl border border-white/10 hover:border-indigo-500/40 transition-all text-gray-300 hover:text-white shadow-lg active:scale-95 cursor-pointer"
      title={isPlaying ? 'Mute Ambient Soundscape' : 'Play Ambient Space Synth'}
      aria-label="Toggle Audio Soundscape"
    >
      {isPlaying ? (
        <>
          <div className="flex items-end gap-[2px] sm:gap-[3px] h-3 sm:h-3.5 w-3 sm:w-3.5">
            <span className="w-[2px] bg-indigo-400 rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-full" />
            <span className="w-[2px] bg-cyan-400 rounded-full animate-[pulse_0.9s_ease-in-out_infinite] h-3/4" />
            <span className="w-[2px] bg-purple-400 rounded-full animate-[pulse_0.7s_ease-in-out_infinite] h-1/2" />
          </div>
          <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-indigo-300 font-bold hidden xs:inline">ON</span>
        </>
      ) : (
        <>
          <VolumeX className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-200" />
          <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-gray-400 group-hover:text-gray-200 hidden xs:inline">
            AUDIO
          </span>
        </>
      )}
    </button>
  );
}
