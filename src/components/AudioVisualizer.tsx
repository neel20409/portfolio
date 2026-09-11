'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';

/**
 * CALMING & FRIENDLY GENERATIVE AMBIENT MUSIC ENGINE
 * Inspired by peaceful lofi ambient piano & zen harmonic soundscapes.
 * Uses pure Web Audio API synthesis (0 latency, 0 external files).
 */

// Calming Pentatonic Melodic Scale (Frequencies in Hz: C4, D4, E4, G4, A4, C5, D5, E5, G5, A5)
const PENTATONIC_SCALE = [
  261.63, // C4
  293.66, // D4
  329.63, // E4
  392.00, // G4
  440.00, // A4
  523.25, // C5
  587.33, // D5
  659.25, // E5
  783.99, // G5
  880.00, // A5
];

// Relaxing & Friendly Warm Chord Progressions
const CHORD_PROGRESSIONS = [
  // C Major 9 (Peaceful, uplifting)
  [130.81, 196.00, 246.94, 329.63, 392.00], // C3, G3, B3, E4, G4
  // F Major 7 (Warm, friendly)
  [174.61, 220.00, 261.63, 329.63, 440.00], // F3, A3, C4, E4, A4
  // A minor 9 (Reflective, cozy)
  [110.00, 164.81, 220.00, 261.63, 329.63], // A2, E3, A3, C4, E4
  // Gsus4 / G6 (Open, breezy)
  [146.83, 196.00, 246.94, 293.66, 392.00], // D3, G3, B3, D4, G4
];

export default function AudioVisualizer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const padGainsRef = useRef<GainNode[]>([]);
  const melodyTimerRef = useRef<NodeJS.Timeout | null>(null);
  const chordTimerRef = useRef<NodeJS.Timeout | null>(null);
  const currentChordIdxRef = useRef<number>(0);

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

  // Play a soft, warm bell / Rhodes-like acoustic note
  const playGentleMelodyNote = useCallback((ctx: AudioContext, master: GainNode) => {
    if (ctx.state !== 'running') return;
    try {
      const noteFreq = PENTATONIC_SCALE[Math.floor(Math.random() * PENTATONIC_SCALE.length)];
      const now = ctx.currentTime;

      // Soft tone oscillator (pure sine for gentle bell quality)
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();

      // Subtle warm sub-harmonics for body
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();

      // Warm low-pass filter to remove sharp treble
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(900, now);
      filter.Q.setValueAtTime(0.7, now);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(noteFreq, now);

      subOsc.type = 'triangle';
      subOsc.frequency.setValueAtTime(noteFreq * 0.5, now);

      // Velvet acoustic envelope (soft attack, long peaceful release)
      const noteVolume = 0.045 + Math.random() * 0.03;
      oscGain.gain.setValueAtTime(0.0001, now);
      oscGain.gain.linearRampToValueAtTime(noteVolume, now + 0.06);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);

      subGain.gain.setValueAtTime(0.0001, now);
      subGain.gain.linearRampToValueAtTime(noteVolume * 0.35, now + 0.08);
      subGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);

      osc.connect(oscGain);
      subOsc.connect(subGain);
      oscGain.connect(filter);
      subGain.connect(filter);
      filter.connect(master);

      osc.start(now);
      subOsc.start(now);
      osc.stop(now + 3.0);
      subOsc.stop(now + 3.0);
    } catch {
      // ignore
    }
  }, []);

  // Transition to next cozy background pad chord
  const transitionToChord = useCallback((ctx: AudioContext, master: GainNode, chordIdx: number) => {
    try {
      const chord = CHORD_PROGRESSIONS[chordIdx];
      const now = ctx.currentTime;
      const fadeTime = 4.0;

      // Soft lowpass filter for silky smooth warmth
      const padFilter = ctx.createBiquadFilter();
      padFilter.type = 'lowpass';
      padFilter.frequency.setValueAtTime(450, now); // Warm, non-harsh cutoff
      padFilter.connect(master);

      const newGains: GainNode[] = [];

      chord.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        // Organic analog chorus detuning
        const detune = (Math.sin(i * 1.5) * 4);
        osc.frequency.setValueAtTime(freq, now);
        osc.detune.setValueAtTime(detune, now);

        // Very soft velvet background volume
        const voiceVol = (0.015 / chord.length) * (1 - i * 0.12);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(voiceVol, now + fadeTime);

        osc.connect(gain);
        gain.connect(padFilter);
        osc.start(now);

        newGains.push(gain);
      });

      // Fade out previous pad voices
      if (padGainsRef.current.length > 0) {
        padGainsRef.current.forEach((g) => {
          try {
            g.gain.linearRampToValueAtTime(0.0001, now + fadeTime);
          } catch {}
        });
      }

      padGainsRef.current = newGains;
    } catch {
      // ignore
    }
  }, []);

  const startCalmingMusic = async () => {
    try {
      const ctx = getOrCreateContext();
      if (!ctx) return;

      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      const now = ctx.currentTime;

      // Master output gain with gentle 2-second fade-in
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.0001, now);
      masterGain.gain.linearRampToValueAtTime(0.08, now + 2.0); // Peaceful soft volume
      masterGain.connect(ctx.destination);
      masterGainRef.current = masterGain;

      // Start initial warm chord
      currentChordIdxRef.current = 0;
      transitionToChord(ctx, masterGain, 0);

      // Schedule gentle chord changes every 9 seconds
      chordTimerRef.current = setInterval(() => {
        currentChordIdxRef.current = (currentChordIdxRef.current + 1) % CHORD_PROGRESSIONS.length;
        if (audioCtxRef.current && masterGainRef.current) {
          transitionToChord(audioCtxRef.current, masterGainRef.current, currentChordIdxRef.current);
        }
      }, 9000);

      // Generative soft melody notes every 1.8 - 3.2 seconds
      const scheduleNextMelodyNote = () => {
        const delay = 1600 + Math.random() * 1800;
        melodyTimerRef.current = setTimeout(() => {
          if (audioCtxRef.current && masterGainRef.current) {
            playGentleMelodyNote(audioCtxRef.current, masterGainRef.current);
            scheduleNextMelodyNote();
          }
        }, delay);
      };

      // Play first melody note after 1s
      setTimeout(() => {
        if (audioCtxRef.current && masterGainRef.current) {
          playGentleMelodyNote(audioCtxRef.current, masterGainRef.current);
          scheduleNextMelodyNote();
        }
      }, 1000);

      setIsPlaying(true);
    } catch (e) {
      console.warn('Audio start error:', e);
    }
  };

  const stopCalmingMusic = () => {
    try {
      if (melodyTimerRef.current) clearInterval(melodyTimerRef.current);
      if (chordTimerRef.current) clearInterval(chordTimerRef.current);

      const ctx = audioCtxRef.current;
      const master = masterGainRef.current;
      if (ctx && master) {
        const now = ctx.currentTime;
        master.gain.linearRampToValueAtTime(0.0001, now + 1.2);
        setTimeout(() => {
          setIsPlaying(false);
        }, 1200);
      } else {
        setIsPlaying(false);
      }
    } catch {
      setIsPlaying(false);
    }
  };

  const toggleAudio = async () => {
    if (isPlaying) {
      stopCalmingMusic();
    } else {
      await startCalmingMusic();
    }
  };

  useEffect(() => {
    return () => {
      if (melodyTimerRef.current) clearInterval(melodyTimerRef.current);
      if (chordTimerRef.current) clearInterval(chordTimerRef.current);
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
      className={`pointer-events-auto group flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-full backdrop-blur-xl border transition-all shadow-lg active:scale-95 cursor-pointer ${
        isPlaying
          ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-emerald-950/40'
          : 'bg-zinc-950/80 hover:bg-zinc-900 border-white/10 hover:border-emerald-500/30 text-gray-400 hover:text-white'
      }`}
      title={isPlaying ? 'Pause Peaceful Ambient Music' : 'Play Calming & Friendly Music'}
      aria-label="Toggle Calming Music"
    >
      {isPlaying ? (
        <>
          <div className="flex items-end gap-[2px] sm:gap-[3px] h-3 sm:h-3.5 w-3 sm:w-3.5">
            <span className="w-[2px] bg-emerald-400 rounded-full animate-[pulse_1.2s_ease-in-out_infinite] h-full" />
            <span className="w-[2px] bg-cyan-400 rounded-full animate-[pulse_1.6s_ease-in-out_infinite] h-3/4" />
            <span className="w-[2px] bg-indigo-400 rounded-full animate-[pulse_1.4s_ease-in-out_infinite] h-1/2" />
          </div>
          <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-emerald-300 font-bold hidden xs:inline">
            CALM MUSIC
          </span>
        </>
      ) : (
        <>
          <VolumeX className="w-3.5 h-3.5 text-gray-400 group-hover:text-emerald-300" />
          <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-gray-400 group-hover:text-emerald-300 hidden xs:inline">
            MUSIC
          </span>
        </>
      )}
    </button>
  );
}
