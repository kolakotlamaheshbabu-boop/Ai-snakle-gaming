/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AnimatePresence, motion } from "motion/react";
import { Pause, Play, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Track } from "../types";

const DUMMY_TRACKS: Track[] = [
  {
    id: "1",
    title: "NEURAL_OVERDRIVE",
    artist: "GEN_AI_01",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    color: "#00ffff",
  },
  {
    id: "2",
    title: "SYNTHETIC_DREAMS",
    artist: "GEN_AI_02",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    color: "#ff00ff",
  },
  {
    id: "3",
    title: "VIRTUAL_PULSE_99",
    artist: "GEN_AI_03",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    color: "#39ff14",
  },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleEnded = () => {
    handleNext();
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="w-full max-w-md p-6 bg-black/80 neon-border rounded-lg relative overflow-hidden backdrop-blur-md">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
      
      {/* Visualizer bars (dummy) */}
      <div className="absolute top-0 left-0 w-full h-1 flex items-end gap-1 px-4 opacity-30">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="flex-1 bg-neon-cyan"
            animate={{
              height: isPlaying ? [2, 12, 4, 16, 2] : 2,
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              delay: i * 0.05,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="flex items-center gap-6">
        <div className="relative group">
          <motion.div
            key={currentTrack.id}
            initial={{ rotate: -10, opacity: 0, scale: 0.8 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            className="w-24 h-24 neon-magenta-border flex items-center justify-center bg-black overflow-hidden relative"
          >
            {/* Minimalist Tech Art for album cover */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,#ff00ff,transparent)]"></div>
            <div className="z-10 text-[8px] font-pixel text-center leading-tight">
              {currentTrack.id}<br/>DATA_STREAM<br/>---<br/>{currentTrack.title.substring(0, 8)}
            </div>
          </motion.div>
          {isPlaying && (
            <motion.div
              layoutId="glow"
              className="absolute -inset-1 blur-md bg-neon-magenta/20 -z-10"
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          )}
        </div>

        <div className="flex-1 space-y-2 overflow-hidden">
          <div className="space-y-0.5">
            <h3 
              className="text-lg font-bold text-neon-cyan truncate glitch-text" 
              data-text={currentTrack.title}
            >
              {currentTrack.title}
            </h3>
            <p className="text-xs text-neon-magenta/70 font-mono tracking-widest uppercase">
              {currentTrack.artist}
            </p>
          </div>

          <div className="h-1 bg-white/10 w-full rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-neon-cyan shadow-[0_0_8px_#00ffff]"
              style={{ width: `${progress}%` }}
              transition={{ type: "spring", bounce: 0, duration: 0.1 }}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={handlePrev}
            className="p-2 text-neon-cyan hover:text-white transition-colors hover:scale-110 active:scale-95"
          >
            <SkipBack size={20} />
          </button>
          <button 
            onClick={togglePlay}
            className="p-3 bg-neon-cyan text-black rounded-full hover:shadow-[0_0_15px_#00ffff] transition-all hover:scale-110 active:scale-95"
          >
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
          </button>
          <button 
            onClick={handleNext}
            className="p-2 text-neon-cyan hover:text-white transition-colors hover:scale-110 active:scale-95"
          >
            <SkipForward size={20} />
          </button>
        </div>

        <div className="flex items-center gap-2 text-neon-cyan/50">
          <Volume2 size={16} />
          <div className="w-16 h-1 bg-white/5 rounded-full relative">
            <div className="absolute inset-y-0 left-0 w-3/4 bg-neon-cyan/30 rounded-full"></div>
          </div>
        </div>
      </div>
      
      {/* Decorative track list overlay (dummy) */}
      <div className="mt-4 pt-4 border-t border-white/5 space-y-1">
        {DUMMY_TRACKS.map((track, idx) => (
          <div 
            key={track.id} 
            className={`flex justify-between items-center text-[10px] uppercase font-mono px-2 py-1 rounded cursor-pointer transition-colors ${idx === currentTrackIndex ? 'bg-neon-cyan/10 text-neon-cyan' : 'text-neon-cyan/30 hover:text-neon-cyan/60'}`}
            onClick={() => {
              setCurrentTrackIndex(idx);
              setIsPlaying(true);
            }}
          >
            <span className="flex items-center gap-2">
              <span className="w-1 h-1 bg-current opacity-50"></span>
              {track.title}
            </span>
            <span>{track.id.padStart(2, '0')}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
