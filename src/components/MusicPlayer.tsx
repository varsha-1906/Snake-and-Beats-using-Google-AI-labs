import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: 'DATA_STREAM_01',
    artist: 'UNKNOWN_ENTITY',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: 2,
    title: 'CORRUPTED_SECTOR',
    artist: 'SYS_ADMIN',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: 3,
    title: 'VOID_RESONANCE',
    artist: 'GHOST_IN_MACHINE',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
    } else if (!isPlaying && audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleEnded = () => {
    nextTrack();
  };

  return (
    <div className="bg-black border-4 border-[#0ff] p-6 w-80 flex flex-col relative shadow-[8px_8px_0px_#f0f] hover:shadow-[12px_12px_0px_#f0f] transition-shadow">
      <div className="absolute top-0 left-0 bg-[#0ff] text-black text-sm px-2 py-1 font-bold">
        AUDIO_SUBROUTINE
      </div>
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onEnded={handleEnded}
      />
      
      <div className="flex flex-col items-start mt-6 mb-6 relative z-10 border-b-2 border-[#f0f] pb-4 w-full">
        <h3 className="text-[#0ff] font-bold text-3xl tracking-wider uppercase glitch-text" data-text={currentTrack.title}>
          {currentTrack.title}
        </h3>
        <p className="text-[#f0f] text-xl mt-1">&gt; SRC: {currentTrack.artist}</p>
        <div className="w-full h-8 mt-4 border-2 border-[#0ff] flex items-center p-1 gap-1 overflow-hidden">
          {Array.from({ length: 12 }).map((_, i) => (
            <div 
              key={i} 
              className={`h-full flex-1 bg-[#f0f] ${isPlaying ? 'animate-pulse' : 'opacity-20'}`} 
              style={{ animationDelay: `${Math.random()}s`, animationDuration: `${0.2 + Math.random() * 0.5}s` }}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between w-full mb-6 relative z-10">
        <button onClick={prevTrack} className="text-[#0ff] hover:text-black hover:bg-[#0ff] p-2 transition-colors border-2 border-transparent hover:border-[#0ff]">
          <SkipBack size={32} />
        </button>
        <button 
          onClick={togglePlay} 
          className="p-4 flex items-center justify-center border-4 border-[#f0f] text-[#f0f] hover:bg-[#f0f] hover:text-black transition-all"
        >
          {isPlaying ? <Pause size={36} /> : <Play size={36} className="ml-1" />}
        </button>
        <button onClick={nextTrack} className="text-[#0ff] hover:text-black hover:bg-[#0ff] p-2 transition-colors border-2 border-transparent hover:border-[#0ff]">
          <SkipForward size={32} />
        </button>
      </div>

      <div className="flex items-center gap-3 relative z-10 w-full bg-[#0ff] text-black p-2">
        <button onClick={() => setIsMuted(!isMuted)} className="hover:text-[#f0f] transition-colors">
          {isMuted || volume === 0 ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={(e) => {
            setVolume(parseFloat(e.target.value));
            setIsMuted(false);
          }}
          className="w-full h-3 bg-black appearance-none cursor-pointer accent-[#f0f]"
        />
      </div>
    </div>
  );
}
