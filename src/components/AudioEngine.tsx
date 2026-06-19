import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Wind, Trophy } from 'lucide-react';

export default function AudioEngine() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHowling, setIsHowling] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  
  // Synthesizer connection nodes
  const windVolumeNodeRef = useRef<GainNode | null>(null);
  const windOscsRef = useRef<OscillatorNode[]>([]);
  const windGainsRef = useRef<GainNode[]>([]);
  const lfoRef = useRef<OscillatorNode | null>(null);

  // Initialize Audio
  const initAudio = () => {
    if (audioCtxRef.current) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      // Master wind gain node
      const masterWindGain = ctx.createGain();
      masterWindGain.gain.setValueAtTime(0.0, ctx.currentTime);
      masterWindGain.connect(ctx.destination);
      windVolumeNodeRef.current = masterWindGain;

      // We synthesize wind using three low-frequency warm-toned oscillators with narrow spacing
      // modulated dynamically by a slow-pitch wave (LFO)
      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.08, ctx.currentTime); // very slow sweep (12 seconds)
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(15, ctx.currentTime); // sweep range
      
      lfo.connect(lfoGain);
      lfo.start();
      lfoRef.current = lfo;

      const baseFreqs = [120, 185, 240];
      baseFreqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        // Slow modulation of center frequencies
        lfoGain.connect(osc.frequency);

        // Low pass filtering for the wind "roar"
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.Q.setValueAtTime(12 - idx * 2, ctx.currentTime);
        filter.frequency.setValueAtTime(freq * 1.5, ctx.currentTime);

        const oscGain = ctx.createGain();
        oscGain.gain.setValueAtTime(0.08 - idx * 0.02, ctx.currentTime);

        osc.connect(filter);
        filter.connect(oscGain);
        oscGain.connect(masterWindGain);

        osc.start();
        windOscsRef.current.push(osc);
        windGainsRef.current.push(oscGain);
      });

    } catch (e) {
      console.error('Failed to initialize Web Audio API synthesis:', e);
    }
  };

  const toggleSound = async () => {
    if (!audioCtxRef.current) {
      initAudio();
    }

    const ctx = audioCtxRef.current;
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    if (isPlaying) {
      // Fade out
      windVolumeNodeRef.current?.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
      setIsPlaying(false);
    } else {
      // Fade in
      windVolumeNodeRef.current?.gain.setValueAtTime(windVolumeNodeRef.current.gain.value, ctx.currentTime);
      windVolumeNodeRef.current?.gain.exponentialRampToValueAtTime(0.8, ctx.currentTime + 2.0);
      setIsPlaying(true);
    }
  };

  // Synthesize a majestic wolf howl
  const triggerHowl = async () => {
    if (!audioCtxRef.current) {
      initAudio();
    }

    const ctx = audioCtxRef.current;
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    if (isHowling) return;
    setIsHowling(true);

    try {
      const now = ctx.currentTime;
      
      // We will model the wolf's howl using an oscillator with a stylized envelope
      const howlOsc = ctx.createOscillator();
      howlOsc.type = 'triangle'; // triangle is warmer, like a natural biological sound
      
      // Wolf's voice pitch sweep profile
      howlOsc.frequency.setValueAtTime(180, now); // start low
      // slide up to throat growl
      howlOsc.frequency.exponentialRampToValueAtTime(260, now + 0.5);
      // soar to peak majestic howl
      howlOsc.frequency.exponentialRampToValueAtTime(540, now + 1.4);
      // quiver a little bit using another parameter, or just smooth wobble
      howlOsc.frequency.linearRampToValueAtTime(510, now + 2.2);
      howlOsc.frequency.linearRampToValueAtTime(530, now + 2.8);
      // falling pitch trail off
      howlOsc.frequency.exponentialRampToValueAtTime(150, now + 4.5);

      // Volume envelope of howls (Fade in -> swell -> tremolo -> fade out)
      const howlGain = ctx.createGain();
      howlGain.gain.setValueAtTime(0.0001, now);
      howlGain.gain.exponentialRampToValueAtTime(0.12, now + 0.6); // growl
      howlGain.gain.linearRampToValueAtTime(0.15, now + 1.4);      // head peak howl
      howlGain.gain.linearRampToValueAtTime(0.10, now + 2.5);      // taper
      howlGain.gain.exponentialRampToValueAtTime(0.0001, now + 4.6); // end

      // Connect bandpass filter to give "howl in a cavernous desert" chest resonance
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.Q.setValueAtTime(2.0, now);
      filter.frequency.setValueAtTime(450, now);
      filter.frequency.exponentialRampToValueAtTime(550, now + 1.5);
      filter.frequency.exponentialRampToValueAtTime(250, now + 4.5);

      // Add a slight echo/delay feedback node to synthesize Canyon Echo
      const delay = ctx.createDelay();
      delay.delayTime.setValueAtTime(0.28, now); // echo delay
      const feedback = ctx.createGain();
      feedback.gain.setValueAtTime(0.42, now); // reflection decay

      howlOsc.connect(filter);
      filter.connect(howlGain);

      // Connect echo network
      howlGain.connect(delay);
      delay.connect(feedback);
      feedback.connect(delay); // feedback loop
      feedback.connect(ctx.destination); // feed echo to master

      howlGain.connect(ctx.destination);

      howlOsc.start(now);
      howlOsc.stop(now + 4.8);

      setTimeout(() => {
        setIsHowling(false);
      }, 4800);

    } catch (err) {
      console.error(err);
      setIsHowling(false);
    }
  };

  // Safe cleanup
  useEffect(() => {
    return () => {
      // stop oscs
      windOscsRef.current.forEach(osc => {
        try { osc.stop(); } catch(e) {}
      });
      try { lfoRef.current?.stop(); } catch(e) {}
    };
  }, []);

  return (
    <div 
      id="ambient-sound-control" 
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-black/80 backdrop-blur-md border border-emerald-500/30 p-2.5 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all duration-300 hover:scale-105 hover:border-emerald-500/60"
    >
      <div className="flex flex-col items-start px-2 hidden sm:flex">
        <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-semibold">Desert Wind</span>
        <span className="text-[9px] text-gray-400 font-mono">Ambient Audio Synth</span>
      </div>

      {/* Wind Synthesizer Node Switch */}
      <button
        id="toggle-wind-ambient"
        onClick={toggleSound}
        className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 cursor-pointer ${
          isPlaying 
            ? 'bg-emerald-500 text-black shadow-[0_0_12px_rgba(16,185,129,0.5)]' 
            : 'bg-zinc-800 text-zinc-400 hover:text-emerald-400'
        }`}
        title="Toggle Atmospheric Ambient Synth"
      >
        {isPlaying ? (
          <Volume2 className="w-5 h-5 animate-pulse" />
        ) : (
          <VolumeX className="w-5 h-5" />
        )}
      </button>

      {/* Wolf Howl Generator */}
      <button
        id="trigger-wolf-howl"
        onClick={triggerHowl}
        disabled={isHowling}
        className={`flex items-center gap-2 px-3.5 h-10 rounded-full transition-all duration-300 cursor-pointer text-xs font-semibold uppercase tracking-wider ${
          isHowling 
            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 cursor-wait' 
            : 'bg-amber-500 text-black hover:bg-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
        }`}
        title="Synthesize Wolf Canyon Howl"
      >
        <span className="relative flex h-2 w-2">
          {isHowling && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          )}
          <span className={`relative inline-flex rounded-full h-2 w-2 ${isHowling ? 'bg-amber-300' : 'bg-black/55'}`}></span>
        </span>
        {isHowling ? 'Howling...' : 'Wolf Howl'}
      </button>
    </div>
  );
}
