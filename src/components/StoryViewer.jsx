import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function StoryViewer({ activeStoryId, stories, onClose, onStorySeen }) {
  const [currentStoryId, setCurrentStoryId] = useState(activeStoryId);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // Sync state with prop if activeStoryId changes from parent
  useEffect(() => {
    setCurrentStoryId(activeStoryId);
    setCurrentSlideIndex(0);
  }, [activeStoryId]);

  const currentStory = stories.find(s => s.id === currentStoryId);
  const slides = currentStory ? (currentStory.slides || []) : [];
  const currentSlide = slides[currentSlideIndex] || {};

  // Mark story as seen when currentStoryId changes
  useEffect(() => {
    if (currentStoryId && onStorySeen) {
      onStorySeen(currentStoryId);
    }
  }, [currentStoryId, onStorySeen]);

  useEffect(() => {
    // Reset progress when slide or story changes
    setProgress(0);
  }, [currentSlideIndex, currentStoryId]);

  useEffect(() => {
    if (slides.length === 0) return;
    const duration = 4000; // 4 seconds per story slide
    const intervalTime = 40; // update progress bar every 40ms
    const step = (intervalTime / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNextSlide();
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [currentSlideIndex, currentStoryId, slides.length]);

  const handleNextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex((prev) => prev + 1);
    } else {
      const currentStoryIdx = stories.findIndex(s => s.id === currentStoryId);
      if (currentStoryIdx !== -1 && currentStoryIdx < stories.length - 1) {
        setCurrentStoryId(stories[currentStoryIdx + 1].id);
        setCurrentSlideIndex(0);
      } else {
        onClose(); // Close story viewer when finished all stories
      }
    }
  };

  const handlePrevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1);
    } else {
      const currentStoryIdx = stories.findIndex(s => s.id === currentStoryId);
      if (currentStoryIdx > 0) {
        const prevStory = stories[currentStoryIdx - 1];
        setCurrentStoryId(prevStory.id);
        setCurrentSlideIndex((prevStory.slides || []).length - 1 || 0);
      }
    }
  };

  if (!currentStory || slides.length === 0) return null;

  // Determine if there is a previous story or slide to navigate back to
  const currentStoryIdx = stories.findIndex(s => s.id === currentStoryId);
  const hasPrev = currentSlideIndex > 0 || currentStoryIdx > 0;

  return (
    <div className="story-player-overlay" onClick={onClose}>
      <div 
        className="story-player-content glass"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress Bar Segments */}
        <div className="story-player-progress-bar">
          {slides.map((_, idx) => (
            <div key={idx} className="story-progress-segment">
              <div 
                className="story-progress-fill" 
                style={{ 
                  width: idx < currentSlideIndex 
                    ? '100%' 
                    : idx === currentSlideIndex 
                      ? `${progress}%` 
                      : '0%' 
                }}
              />
            </div>
          ))}
        </div>

        {/* Story Header */}
        <div className="story-player-header">
          <img src={currentStory.avatar} alt={currentStory.name} className="story-player-avatar" />
          <span className="story-player-username">{currentStory.name}</span>
          <span className="story-player-time">{currentSlide.timestamp || 'Just now'}</span>
          <button className="story-player-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Image Content */}
        <div className="story-player-image-container">
          <img 
            src={currentSlide.url} 
            alt="Story content" 
            className="story-player-image" 
          />
          
          {/* Navigation Click Fields */}
          <div className="story-player-nav prev" onClick={handlePrevSlide}>
            {hasPrev && (
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '6px', borderRadius: '50%' }}>
                <ChevronLeft size={20} style={{ color: 'white' }} />
              </div>
            )}
          </div>
          
          <div className="story-player-nav next" onClick={handleNextSlide}>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '6px', borderRadius: '50%' }}>
              <ChevronRight size={20} style={{ color: 'white' }} />
            </div>
          </div>
        </div>

        {/* Story Caption */}
        {currentSlide.caption && (
          <div className="story-player-caption-container">
            <p className="story-player-caption">{currentSlide.caption}</p>
          </div>
        )}
      </div>
    </div>
  );
}
