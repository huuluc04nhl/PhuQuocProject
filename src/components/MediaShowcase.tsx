'use client';

import React, { useState, useEffect } from 'react';
import { Unit } from '@/types/unit';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

interface MediaShowcaseProps {
  unit: Unit;
}

const getYouTubeEmbedUrl = (url?: string) => {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (match && match[1]) {
    return `https://www.youtube-nocookie.com/embed/${match[1]}?autoplay=1&mute=1&loop=1&playlist=${match[1]}&modestbranding=1&rel=0`;
  }
  return null;
};

export const MediaShowcase: React.FC<MediaShowcaseProps> = ({ unit }) => {
  const [activeTab, setActiveTab] = useState<'video' | 'slider'>('video');
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const youtubeEmbedUrl = getYouTubeEmbedUrl(unit.videoUrl);

  // Reset to first slide and video on unit change
  useEffect(() => {
    setCurrentSlide(0);
    if (unit.videoUrl) {
      setActiveTab('video');
      setIsPlaying(true);
    } else {
      setActiveTab('slider');
    }
  }, [unit]);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % unit.images.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + unit.images.length) % unit.images.length);
  };

  const toggleVideoPlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="relative w-full h-full bg-black rounded-3xl overflow-hidden flex flex-col group select-none shadow-sm">
      {/* Top minimal switcher */}
      <div className="absolute top-2.5 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-1 bg-black/60 backdrop-blur-sm p-1 rounded-xl pointer-events-auto text-[11px] font-bold text-white">
          {unit.videoUrl && (
            <button
              onClick={() => setActiveTab('video')}
              className={`px-2.5 py-0.5 rounded-lg transition-all ${
                activeTab === 'video' ? 'bg-white text-black font-extrabold' : 'text-slate-300 hover:text-white'
              }`}
            >
              VIDEO REVIEW
            </button>
          )}
          <button
            onClick={() => setActiveTab('slider')}
            className={`px-2.5 py-0.5 rounded-lg transition-all ${
              activeTab === 'slider' ? 'bg-white text-black font-extrabold' : 'text-slate-300 hover:text-white'
            }`}
          >
            IMAGE ({unit.images.length})
          </button>
        </div>

        <div className="bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-lg text-[10px] font-bold text-white pointer-events-auto">
          {activeTab === 'video' ? 'REVIEW CĂN HỘ' : `${currentSlide + 1}/${unit.images.length}`}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative w-full h-full flex-1 overflow-hidden flex items-center justify-center">
        {activeTab === 'video' && unit.videoUrl ? (
          <div className="relative w-full h-full bg-black">
            {youtubeEmbedUrl ? (
              <iframe
                key={unit.id}
                src={youtubeEmbedUrl}
                title={`Video review ${unit.name}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0 pointer-events-auto"
              />
            ) : (
              <>
                <video
                  ref={videoRef}
                  src={unit.videoUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                {/* Play/Pause Button */}
                <button
                  onClick={toggleVideoPlay}
                  className="absolute bottom-3 left-3 z-20 p-2 rounded-full bg-black/60 text-white hover:bg-black transition"
                  title={isPlaying ? 'Tạm dừng' : 'Phát tiếp'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="relative w-full h-full">
            {unit.images.map((img, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-300 ${
                  index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                <img
                  src={img}
                  alt={`${unit.name} - ảnh ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}

            {/* Navigation Arrows */}
            <button
              onClick={handlePrevSlide}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 p-1.5 rounded-full bg-black/50 text-white hover:bg-black transition"
              title="Ảnh trước"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextSlide}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 p-1.5 rounded-full bg-black/50 text-white hover:bg-black transition"
              title="Ảnh tiếp"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
              {unit.images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === currentSlide ? 'w-5 bg-white' : 'w-1.5 bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
