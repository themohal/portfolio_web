"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";

export default function VideoShowreel() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [hasAutoPlayed, setHasAutoPlayed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.5 });

  useEffect(() => {
    if (isInView && !hasAutoPlayed && videoRef.current) {
      videoRef.current.play();
      setHasAutoPlayed(true);
    }
  }, [isInView, hasAutoPlayed]);

  function togglePlay() {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }

  function toggleMute() {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(!isMuted);
  }

  const videoSrc = "https://wfvpal0tey6amxal.public.blob.vercel-storage.com/intro_video.mp4";

  return (
    <section ref={sectionRef} className="py-24 px-4 tech-grid-bg">
      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="px-4 py-1.5 text-xs font-mono tracking-[0.3em] uppercase text-blue-400 border border-blue-500/30 rounded-full bg-blue-500/5 inline-block mb-4">
            Showreel
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white neon-text">
            See My Work in Action
          </h2>
          <p className="text-gray-400 mt-3 max-w-lg mx-auto text-sm">
            A quick look at the projects, technologies, and solutions I&apos;ve built.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative rounded-2xl overflow-hidden tech-border group"
        >
          {/* Video container */}
          <div className="relative aspect-video bg-gray-950 flex items-center justify-center">
            {videoSrc ? (
              <video
                ref={videoRef}
                src={videoSrc}
                className="w-full h-full object-cover"
                playsInline
                muted
                controlsList="nodownload nofullscreen noremoteplayback"
                disablePictureInPicture
                onContextMenu={(e) => e.preventDefault()}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
              />
            ) : (
              /* Placeholder when no video is set */
              <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex flex-col items-center justify-center">
                {/* Animated grid lines */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `
                      linear-gradient(rgba(59,130,246,0.15) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(59,130,246,0.15) 1px, transparent 1px)
                    `,
                    backgroundSize: '40px 40px'
                  }} />
                </div>

                {/* Placeholder content */}
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="relative z-10 text-center"
                >
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full border-2 border-blue-500/30 flex items-center justify-center">
                    <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 font-mono text-sm">VIDEO.SOURCE_PENDING</p>
                  <p className="text-gray-600 text-xs mt-1">Add your video URL in VideoShowreel.tsx</p>
                </motion.div>

                {/* Corner decorations */}
                <div className="absolute top-4 left-4 w-8 h-8 border-l border-t border-blue-500/20" />
                <div className="absolute top-4 right-4 w-8 h-8 border-r border-t border-blue-500/20" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-l border-b border-blue-500/20" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-r border-b border-blue-500/20" />
              </div>
            )}

            {/* Play/Pause overlay (only when video is set) */}
            {videoSrc && (
              <button
                onClick={togglePlay}
                className={`absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity duration-300 ${
                  isPlaying ? "opacity-0 hover:opacity-100" : "opacity-100"
                }`}
              >
                <div className="w-20 h-20 rounded-full border-2 border-white/30 flex items-center justify-center backdrop-blur-sm bg-white/5 hover:bg-white/10 hover:border-white/50 transition-all duration-300 hover:scale-110">
                  {isPlaying ? (
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                    </svg>
                  ) : (
                    <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </div>
              </button>
            )}

            {/* Mute/Unmute button */}
            {videoSrc && (
              <button
                onClick={toggleMute}
                className="absolute bottom-16 right-4 z-10 w-10 h-10 rounded-full border border-white/30 flex items-center justify-center backdrop-blur-sm bg-black/40 hover:bg-white/10 hover:border-white/50 transition-all duration-300"
              >
                {isMuted ? (
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                  </svg>
                )}
              </button>
            )}

            {/* Scan line effect */}
            <div className="absolute inset-0 pointer-events-none scan-line opacity-30" />
          </div>

          {/* Bottom info bar */}
          <div className="bg-white/[0.03] border-t border-white/5 px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs font-mono text-gray-500">
              <span className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-red-500 animate-pulse' : 'bg-gray-600'}`} />
                {isPlaying ? "PLAYING" : "READY"}
              </span>
              <span className="text-gray-700">|</span>
              <span>SHOWREEL.MP4</span>
            </div>
            <div className="text-xs font-mono text-gray-600">
              HD 1080p
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
