/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import SnakeGame from "./components/SnakeGame";
import MusicPlayer from "./components/MusicPlayer";
import { motion } from "motion/react";
import { Terminal, Database, Shield, Zap } from "lucide-react";

export default function App() {
  return (
    <div className="min-h-screen w-full relative flex flex-col p-4 md:p-8 selection:bg-neon-magenta selection:text-white">
      {/* Background Layer: Noise and Scanlines */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-black"></div>
        <div className="absolute inset-0 opacity-[0.03] animate-noise bg-[url('https://grain-y.com/wp-content/uploads/2017/02/Noise-Texture-1-scaled.jpg')]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-40"></div>
        
        {/* Animated Scanline */}
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
          <div className="w-full h-1 bg-neon-cyan/5 absolute top-0 animate-scanline"></div>
        </div>
      </div>

      {/* Header */}
      <header className="relative z-10 mb-8 flex justify-between items-end border-b border-neon-cyan/20 pb-4">
        <div>
          <h1 
            className="text-4xl md:text-6xl font-pixel text-neon-cyan glitch-text leading-none" 
            data-text="GLITCH_SNAKE"
          >
            GLITCH_SNAKE
          </h1>
          <p className="text-[10px] uppercase tracking-[0.4em] text-neon-magenta mt-1 italic animate-pulse">
            Neural_Interface_v2.0.48_Ready
          </p>
        </div>
        
        <div className="hidden lg:flex gap-6 text-[10px] uppercase font-mono text-neon-cyan/40">
          <div className="flex items-center gap-2">
            <Database size={12} />
            <span>Buffer: 99%</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield size={12} />
            <span>Crypto: Active</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap size={12} className="text-neon-green" />
            <span>Sync: 0.1ms</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar Info - Left */}
        <div className="hidden xl:block lg:col-span-2 space-y-8">
          <section className="space-y-4">
            <h2 className="text-[10px] font-bold text-neon-magenta uppercase tracking-widest border-l-2 border-neon-magenta pl-2">
              System_Logs
            </h2>
            <div className="text-[9px] font-mono space-y-2 opacity-50">
              <p className="text-neon-cyan">Booting core_sys...</p>
              <p>Loading snake_engine...</p>
              <p>Initializing synth_rack...</p>
              <p className="text-neon-green">Connection established.</p>
              <p className="animate-pulse">_</p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-[10px] font-bold text-neon-magenta uppercase tracking-widest border-l-2 border-neon-magenta pl-2">
              Status
            </h2>
            <div className="space-y-1">
              <div className="flex justify-between text-[9px] uppercase">
                <span>CPU_LOAD</span>
                <span>42%</span>
              </div>
              <div className="h-0.5 bg-white/5 w-full">
                <div className="h-full bg-neon-cyan w-[42%]"></div>
              </div>
            </div>
          </section>
        </div>

        {/* Game Area - Center */}
        <div className="lg:col-span-8 xl:col-span-7 flex flex-col items-center">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full flex justify-center"
          >
            <SnakeGame />
          </motion.div>
        </div>

        {/* Music Player Area - Right */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-8 flex flex-col items-center lg:items-end">
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="w-full"
          >
            <div className="mb-4 text-right">
              <h2 className="text-[10px] font-bold text-neon-magenta uppercase tracking-widest inline-block border-r-2 border-neon-magenta pr-2">
                Audio_Output
              </h2>
            </div>
            <MusicPlayer />
          </motion.div>

          <div className="w-full max-w-md p-4 neon-border bg-black/40 text-[10px] font-mono leading-relaxed opacity-60">
            <div className="flex items-center gap-2 mb-2 text-neon-cyan">
              <Terminal size={14} />
              <span>COMMAND_BUFFER</span>
            </div>
            <p className="text-white">
              SNAKE MOVE [ARROW_KEYS]<br/>
              RETRY [R_KEY]<br/>
              VOLUME [AUTO_MAX]<br/>
              AUDIO_ENCODING [AAC_320K]<br/>
              GLITCH_MODE [ENABLED]
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-8 pt-4 border-t border-neon-cyan/10 flex justify-between items-center text-[8px] uppercase tracking-widest text-neon-cyan/30">
        <div className="flex gap-4">
          <span>Uptime: 00:34:12</span>
          <span>Nodes: 12</span>
          <span>Session: 4x-f92</span>
        </div>
        <div className="text-neon-magenta/40">
          DESIGNED FOR NEURAL INTERFACE // 2026
        </div>
      </footer>
    </div>
  );
}
