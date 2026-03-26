/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-[#0ff] font-mono selection:bg-[#f0f] selection:text-black overflow-hidden relative screen-tear">
      <div className="static-noise" />
      <div className="scanline" />

      <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col relative z-10">
        <header className="flex flex-col items-start mb-8 w-full max-w-5xl mx-auto border-b-4 border-[#f0f] pb-4">
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-[#0ff] glitch-text" data-text="SYS.TERMINAL_V9.4">
            SYS.TERMINAL_V9.4
          </h1>
          <p className="text-[#f0f] tracking-widest text-xl mt-2 animate-pulse">
            &gt; NEURAL_LINK_ESTABLISHED // AWAITING_COMMAND...
          </p>
        </header>

        <main className="flex-1 flex flex-col lg:flex-row items-start justify-center gap-8 lg:gap-16 mt-4">
          <div className="w-full lg:w-auto flex justify-center order-2 lg:order-1 mt-8">
            <MusicPlayer />
          </div>
          
          <div className="w-full lg:w-auto flex justify-center order-1 lg:order-2">
            <SnakeGame />
          </div>
        </main>
      </div>
    </div>
  );
}
