// Web Audio API Sci-Fi Synthesizer (Zero-latency, no external audio files required)

class SoundFX {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Futuristic holographic chirp on tab switch
  playHoloChirp(pitchMultiplier: number = 1.0) {
    const ctx = this.getContext();
    if (!ctx || !this.enabled) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(580 * pitchMultiplier, now);
      osc.frequency.exponentialRampToValueAtTime(1450 * pitchMultiplier, now + 0.08);
      osc.frequency.exponentialRampToValueAtTime(880 * pitchMultiplier, now + 0.16);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.2);
    } catch {
      // Audio context might be blocked prior to user interaction
    }
  }

  // Subtle hover blip
  playHoverBlip() {
    const ctx = this.getContext();
    if (!ctx || !this.enabled) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(2400, now + 0.03);

      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // Ignore audio block
    }
  }

  // Epic Overdrive Warp Sound (Bass drop + rising cosmic sweep)
  playOverdriveWarp(active: boolean) {
    const ctx = this.getContext();
    if (!ctx || !this.enabled) return;

    try {
      const now = ctx.currentTime;

      if (active) {
        // Power UP Warp
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc1.type = 'sawtooth';
        osc2.type = 'sine';

        osc1.frequency.setValueAtTime(120, now);
        osc1.frequency.exponentialRampToValueAtTime(880, now + 0.6);

        osc2.frequency.setValueAtTime(60, now);
        osc2.frequency.exponentialRampToValueAtTime(220, now + 0.6);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(300, now);
        filter.frequency.exponentialRampToValueAtTime(4000, now + 0.6);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.75);
        osc2.stop(now + 0.75);
      } else {
        // Power DOWN hum
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(90, now + 0.35);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.45);
      }
    } catch {
      // Ignore audio block
    }
  }
}

export const sfx = new SoundFX();
