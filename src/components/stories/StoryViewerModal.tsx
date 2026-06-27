"use client";

import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Eye, Trash2, Play, Pause, ChevronUp } from 'lucide-react';

export interface StorySlide {
  id: string;
  mediaUrl: string;
  thumbnailUrl: string | null;
  mediaType: 'IMAGE' | 'VIDEO';
  createdAt: string;
  viewsCount: number;
  userId: string;
}

export interface UserStoryGroup {
  userId: string;
  userName: string;
  userAvatar: string;
  slides: StorySlide[];
}

interface StoryViewerModalProps {
  userGroups: UserStoryGroup[];
  initialGroupIndex: number;
  initialSlideIndex: number;
  currentUserId: string;
  onClose: () => void;
  onDeleteStory?: (storyId: string) => Promise<void>;
}

export default function StoryViewerModal({
  userGroups,
  initialGroupIndex,
  initialSlideIndex,
  currentUserId,
  onClose,
  onDeleteStory,
}: StoryViewerModalProps) {
  const [groupIndex, setGroupIndex] = useState(initialGroupIndex);
  const [slideIndex, setSlideIndex] = useState(initialSlideIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(5000); // default 5s for images
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [viewers, setViewers] = useState<Array<{ name: string; avatar: string; time: string }>>([]);

  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const startTimeRef = useRef<number>(0);
  const elapsedPausedRef = useRef<number>(0);

  const currentGroup = userGroups[groupIndex];
  const currentSlide = currentGroup?.slides[slideIndex];
  const isOwner = currentSlide?.userId === currentUserId;

  // Handle slide transitions
  const handleNext = () => {
    if (!currentGroup) return;
    
    if (slideIndex < currentGroup.slides.length - 1) {
      setSlideIndex(prev => prev + 1);
      setProgress(0);
      elapsedPausedRef.current = 0;
    } else if (groupIndex < userGroups.length - 1) {
      setGroupIndex(prev => prev + 1);
      setSlideIndex(0);
      setProgress(0);
      elapsedPausedRef.current = 0;
    } else {
      onClose(); // End of all stories
    }
  };

  const handlePrev = () => {
    if (slideIndex > 0) {
      setSlideIndex(prev => prev - 1);
      setProgress(0);
      elapsedPausedRef.current = 0;
    } else if (groupIndex > 0) {
      const prevGroup = userGroups[groupIndex - 1];
      setGroupIndex(prev => prev - 1);
      setSlideIndex(prevGroup.slides.length - 1);
      setProgress(0);
      elapsedPausedRef.current = 0;
    } else {
      // At the very beginning, restart slide
      setProgress(0);
      elapsedPausedRef.current = 0;
    }
  };

  // Video duration management
  const handleVideoLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const videoDuration = e.currentTarget.duration * 1000;
    setDuration(videoDuration);
  };

  // Handle play/pause via hold interactions
  const handlePressStart = () => {
    setIsPaused(true);
    if (videoRef.current) videoRef.current.pause();
  };

  const handlePressEnd = () => {
    setIsPaused(false);
    if (videoRef.current) videoRef.current.play().catch(() => {});
  };

  // Click navigation zones (Left 30% / Right 70%)
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (showAnalytics) {
      setShowAnalytics(false);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;

    if (clickX < width * 0.3) {
      handlePrev();
    } else {
      handleNext();
    }
  };

  // Progress Bar timer logic
  useEffect(() => {
    if (!currentSlide) return;

    // Reset default duration if switching to image
    if (currentSlide.mediaType === 'IMAGE') {
      setDuration(5000);
    }

    setProgress(0);
    setIsPaused(false);
    setShowAnalytics(false);
    elapsedPausedRef.current = 0;
  }, [groupIndex, slideIndex]);

  useEffect(() => {
    if (isPaused || !currentSlide) {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      return;
    }

    const intervalStep = 50; // Update progress every 50ms
    startTimeRef.current = Date.now() - elapsedPausedRef.current;

    progressIntervalRef.current = setInterval(() => {
      const timePassed = Date.now() - startTimeRef.current;
      const currentProgress = (timePassed / duration) * 100;

      if (currentProgress >= 100) {
        setProgress(100);
        clearInterval(progressIntervalRef.current!);
        handleNext();
      } else {
        setProgress(currentProgress);
        elapsedPausedRef.current = timePassed;
      }
    }, intervalStep);

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [isPaused, duration, groupIndex, slideIndex]);

  // Load analytics when drawer is pulled up
  useEffect(() => {
    if (showAnalytics && currentSlide) {
      // Mock fetching viewers list from API (/api/v1/stories/:id/viewers)
      setViewers([
        { name: 'Ananya Iyer', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80', time: '2h ago' },
        { name: 'Rohan Verma', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80', time: '4h ago' },
        { name: 'Karthik Iyer', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80', time: '6h ago' },
      ]);
    }
  }, [showAnalytics, currentSlide]);

  const handleDelete = async () => {
    if (!currentSlide || !onDeleteStory) return;
    const confirmDelete = window.confirm("Are you sure you want to delete this story?");
    if (confirmDelete) {
      try {
        await onDeleteStory(currentSlide.id);
        handleNext();
      } catch (err) {
        alert("Failed to delete story.");
      }
    }
  };

  if (!currentGroup || !currentSlide) return null;

  return (
    <div className="fixed inset-0 z-[2000] bg-black flex items-center justify-center select-none">
      {/* Background blur */}
      <div 
        className="absolute inset-0 bg-cover bg-center blur-2xl opacity-40 scale-105 pointer-events-none"
        style={{ backgroundImage: `url(${currentSlide.thumbnailUrl || currentSlide.mediaUrl})` }}
      />

      {/* Main 9:16 vertical player shell */}
      <div className="relative w-full max-w-[480px] h-full sm:h-[85vh] sm:rounded-2xl overflow-hidden bg-slate-950 flex flex-col justify-between shadow-2xl border border-slate-900">
        
        {/* Story Head Banner (Progress Bars & User details) */}
        <div className="absolute top-0 left-0 right-0 z-50 p-3 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
          {/* Segmented Progress Bars */}
          <div className="flex gap-1.5 mb-3">
            {currentGroup.slides.map((_, idx) => {
              let width = '0%';
              if (idx < slideIndex) width = '100%';
              if (idx === slideIndex) width = `${progress}%`;
              return (
                <div key={idx} className="flex-1 bg-slate-700/50 h-1 rounded-full overflow-hidden">
                  <div 
                    className="bg-white h-full rounded-full transition-all duration-[50ms]"
                    style={{ width }}
                  />
                </div>
              );
            })}
          </div>

          {/* User Profile Header */}
          <div className="flex justify-between items-center pointer-events-auto">
            <div className="flex items-center gap-3">
              <img 
                src={currentGroup.userAvatar} 
                alt={currentGroup.userName} 
                className="w-9 h-9 rounded-full border border-white/20 object-cover"
              />
              <div>
                <p className="text-sm font-semibold text-white">{currentGroup.userName}</p>
                <p className="text-[10px] text-slate-300">Active Campus Story</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {isOwner && onDeleteStory && (
                <button 
                  onClick={handleDelete}
                  className="p-1.5 rounded-full hover:bg-white/10 text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
              <button 
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-white/10 text-slate-200 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Media Frame wrapper */}
        <div 
          onMouseDown={handlePressStart}
          onMouseUp={handlePressEnd}
          onTouchStart={handlePressStart}
          onTouchEnd={handlePressEnd}
          onClick={handleOverlayClick}
          className="relative flex-1 w-full h-full flex items-center justify-center cursor-pointer"
        >
          {currentSlide.mediaType === 'VIDEO' ? (
            <video
              ref={videoRef}
              src={currentSlide.mediaUrl}
              autoPlay
              playsInline
              muted={false}
              onLoadedMetadata={handleVideoLoadedMetadata}
              className="w-full h-full object-cover"
            />
          ) : (
            <img 
              src={currentSlide.mediaUrl} 
              alt="Story Content" 
              className="w-full h-full object-cover"
            />
          )}

          {/* Pause overlay cue indicator */}
          {isPaused && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-sm p-4 rounded-full pointer-events-none">
              <Pause className="w-6 h-6 text-white" />
            </div>
          )}
        </div>

        {/* Story Footer Controls / Analytics Drawer Launcher */}
        <div className="relative z-50 bg-gradient-to-t from-black/90 to-transparent p-4 flex justify-between items-center">
          {isOwner ? (
            <button 
              onClick={() => {
                setIsPaused(true);
                if (videoRef.current) videoRef.current.pause();
                setShowAnalytics(true);
              }}
              className="mx-auto flex flex-col items-center gap-1 text-white hover:text-indigo-300 transition-colors"
            >
              <ChevronUp className="w-4 h-4 animate-bounce" />
              <div className="flex items-center gap-1.5 bg-slate-900/60 border border-slate-800 py-1.5 px-4 rounded-full text-xs font-semibold">
                <Eye className="w-4 h-4" />
                <span>{currentSlide.viewsCount} Views</span>
              </div>
            </button>
          ) : (
            <div className="w-full flex justify-center py-2">
              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">CollegeBook Stories</span>
            </div>
          )}
        </div>

        {/* Analytics Drawer Overlay */}
        {showAnalytics && isOwner && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md z-[100] flex flex-col justify-end transition-all">
            <div className="bg-slate-900 border-t border-slate-800 rounded-t-3xl max-h-[60%] flex flex-col p-5 animate-slideUp">
              <div className="flex justify-between items-center mb-5">
                <div className="flex items-center gap-2 text-white font-bold">
                  <Eye className="w-5 h-5 text-indigo-400" />
                  <span>Story Views ({currentSlide.viewsCount})</span>
                </div>
                <button 
                  onClick={() => {
                    setShowAnalytics(false);
                    setIsPaused(false);
                    if (videoRef.current) videoRef.current.play().catch(() => {});
                  }}
                  className="p-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="overflow-y-auto flex-1 flex flex-col gap-3 pr-1">
                {viewers.length > 0 ? (
                  viewers.map((viewer, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2 border-b border-slate-800 last:border-0">
                      <div className="flex items-center gap-3">
                        <img src={viewer.avatar} alt={viewer.name} className="w-8 h-8 rounded-full object-cover" />
                        <span className="text-sm font-semibold text-slate-200">{viewer.name}</span>
                      </div>
                      <span className="text-xs text-slate-500">{viewer.time}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 text-center py-6">No views yet. Share this with your college mates!</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sidebar Desktop Navigation Arrows */}
      <button 
        onClick={handlePrev}
        className="hidden md:flex absolute left-8 p-3 rounded-full bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900 transition-all shadow-lg"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button 
        onClick={handleNext}
        className="hidden md:flex absolute right-8 p-3 rounded-full bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900 transition-all shadow-lg"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
}
