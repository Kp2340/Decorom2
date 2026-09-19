import React, { useMemo, useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Volume2, VolumeX, Play } from "lucide-react";
import { responsiveImageProps } from "../utils/imageUtils";

const ImageCarousel = ({ images = [], videoUrl = null }) => {
  // If videoUrl is provided, slide 0 is the video, followed by images
  const hasVideo = Boolean(videoUrl);
  const totalSlides = (images?.length || 0) + (hasVideo ? 1 : 0);

  const [current, setCurrent] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [imageLoaded, setImageLoaded] = useState({});
  const touchStartX = useRef(null);
  const videoRef = useRef(null);
  const idleTimerRef = useRef(null);
  const isHoveredRef = useRef(false);

  const responsive = useMemo(
    () => (images || []).map((img) => responsiveImageProps(img)),
    [images],
  );

  // Desktop 4s idle auto-advance effect (runs only when not hovering and on desktop)
  useEffect(() => {
    // Only auto-advance if more than 1 slide exists
    if (totalSlides <= 1) return;

    const startIdleTimer = () => {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        if (!isHoveredRef.current && window.innerWidth >= 768) {
          // If currently on video slide, don't advance until video finishes
          if (!(hasVideo && current === 0)) {
            setCurrent((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
          }
        }
      }, 4000);
    };

    startIdleTimer();

    return () => clearTimeout(idleTimerRef.current);
  }, [current, totalSlides, hasVideo]);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  const handleVideoEnded = () => {
    // Crossfade / advance to first product image when video finishes
    if (totalSlides > 1) {
      setCurrent(1);
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  if (totalSlides === 0) return null;

  const isCurrentVideo = hasVideo && current === 0;
  const imageIndex = hasVideo ? current - 1 : current;

  return (
    <div
      className="relative w-full mx-auto overflow-hidden rounded-2xl shadow-xs border border-slate-200 bg-white group"
      onMouseEnter={() => {
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
      }}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return;
        const delta = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(delta) > 40) {
          delta > 0 ? prevSlide() : nextSlide();
        }
        touchStartX.current = null;
      }}
      style={{ touchAction: "pan-y" }}
    >
      {/* Media Viewport */}
      <div className="relative aspect-[4/3] sm:aspect-[1/1] w-full bg-slate-50 overflow-hidden flex items-center justify-center">
        {isCurrentVideo ? (
          <div className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden">
            <video
              ref={videoRef}
              src={videoUrl}
              muted={isMuted}
              autoPlay
              playsInline
              onEnded={handleVideoEnded}
              className="w-full h-full object-contain animate-ken-burns"
            />
            {/* Audio Toggle Pill */}
            <button
              onClick={toggleMute}
              className="absolute bottom-4 right-4 z-20 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-xs text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              aria-label={isMuted ? "Unmute video" : "Mute video"}
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>Unmute</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-[#E59500]" />
                  <span>Mute</span>
                </>
              )}
            </button>

            {/* Video Badge */}
            <div className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-md bg-[#0F172A]/80 backdrop-blur-xs text-white text-[11px] font-semibold flex items-center gap-1.5 shadow-xs">
              <Play className="w-3 h-3 fill-current text-[#E59500]" />
              <span>Craftsmanship Video</span>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Soft Cream Luxury Skeleton Shimmer during image load */}
            {!imageLoaded[imageIndex] && (
              <div className="absolute inset-0 skeleton-shimmer z-0" />
            )}

            <img
              src={responsive[imageIndex]?.src || images[imageIndex]}
              srcSet={responsive[imageIndex]?.srcSet}
              sizes={responsive[imageIndex]?.sizes}
              loading="lazy"
              decoding="async"
              onLoad={() => setImageLoaded((prev) => ({ ...prev, [imageIndex]: true }))}
              onError={(e) => {
                e.currentTarget.src = images[imageIndex];
                setImageLoaded((prev) => ({ ...prev, [imageIndex]: true }));
              }}
              alt={`Product preview ${imageIndex + 1}`}
              className={`w-full h-full object-contain transition-opacity duration-300 ${
                imageLoaded[imageIndex] ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>
        )}
      </div>

      {/* Navigation Arrows (Visible if more than 1 item) */}
      {totalSlides > 1 && (
        <>
          <button
            onClick={prevSlide}
            aria-label="Previous image"
            className="absolute top-1/2 left-3 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-[#0F172A] hover:text-white text-[#2C3E50] shadow-md flex items-center justify-center transition-colors opacity-90 hover:opacity-100 cursor-pointer z-20"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={nextSlide}
            aria-label="Next image"
            className="absolute top-1/2 right-3 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-[#0F172A] hover:text-white text-[#2C3E50] shadow-md flex items-center justify-center transition-colors opacity-90 hover:opacity-100 cursor-pointer z-20"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots / Thumbnails Indicator */}
          <div className="absolute bottom-3 inset-x-0 flex justify-center items-center gap-1.5 z-20 px-4">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  index === current
                    ? "w-6 bg-[#E59500]"
                    : "w-2 bg-slate-300/80 hover:bg-slate-400"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ImageCarousel;
