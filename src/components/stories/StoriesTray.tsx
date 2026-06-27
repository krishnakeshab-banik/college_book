"use client";

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import StoryViewerModal, { UserStoryGroup } from './StoryViewerModal';
import StoryUploader from './StoryUploader';

interface StoriesTrayProps {
  userGroups: UserStoryGroup[];
  currentUserId: string;
  currentUserAvatar: string;
  onDeleteStory?: (storyId: string) => Promise<void>;
  onRefresh?: () => void;
}

export default function StoriesTray({
  userGroups,
  currentUserId,
  currentUserAvatar,
  onDeleteStory,
  onRefresh,
}: StoriesTrayProps) {
  const [selectedGroupIdx, setSelectedGroupIdx] = useState<number | null>(null);
  const [showUploader, setShowUploader] = useState(false);
  const [viewedGroupIds, setViewedGroupIds] = useState<string[]>([]);

  const handleOpenGroup = (index: number) => {
    const group = userGroups[index];
    if (!group) return;
    
    // Mark as viewed
    if (!viewedGroupIds.includes(group.userId)) {
      setViewedGroupIds(prev => [...prev, group.userId]);
    }
    
    setSelectedGroupIdx(index);
  };

  const handleUploaderSuccess = (storyId: string) => {
    setShowUploader(false);
    if (onRefresh) onRefresh();
  };

  return (
    <div className="w-full">
      {/* Tray list container */}
      <div className="flex items-center gap-4 overflow-x-auto py-3 px-1 scrollbar-hide">
        
        {/* Current user 'Add Story' bubble */}
        <div className="flex flex-col items-center flex-shrink-0 cursor-pointer group">
          <div 
            onClick={() => setShowUploader(true)}
            className="relative w-16 h-16 rounded-full p-[2px] bg-slate-800 hover:bg-indigo-600 transition-colors flex items-center justify-center mb-1.5"
          >
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center overflow-hidden relative">
              <img 
                src={currentUserAvatar} 
                alt="My profile" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <Plus className="w-5 h-5 text-white stroke-[3px]" />
              </div>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-slate-400 group-hover:text-white transition-colors">Your Story</span>
        </div>

        {/* Dynamic Classmate Story Groups */}
        {userGroups.map((group, idx) => {
          const isViewed = viewedGroupIds.includes(group.userId);
          const hasUnviewed = !isViewed && group.userId !== currentUserId;

          return (
            <div 
              key={group.userId}
              onClick={() => handleOpenGroup(idx)}
              className="flex flex-col items-center flex-shrink-0 cursor-pointer"
            >
              <div 
                className={`w-16 h-16 rounded-full p-[3px] flex items-center justify-center mb-1.5 transition-transform active:scale-95 ${
                  hasUnviewed 
                    ? 'bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 animate-pulse' 
                    : 'bg-slate-800'
                }`}
              >
                <div className="w-full h-full rounded-full bg-slate-950 p-[2px] overflow-hidden">
                  <img 
                    src={group.userAvatar} 
                    alt={group.userName} 
                    className="w-full h-full rounded-full object-cover" 
                  />
                </div>
              </div>
              <span className={`text-[11px] font-semibold tracking-wide truncate max-w-[70px] ${
                hasUnviewed ? 'text-white font-bold' : 'text-slate-500'
              }`}>
                {group.userName.split(' ')[0]}
              </span>
            </div>
          );
        })}
      </div>

      {/* Global Story Uploader Modal */}
      {showUploader && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <StoryUploader 
            onSuccess={handleUploaderSuccess}
            onClose={() => setShowUploader(false)}
          />
        </div>
      )}

      {/* Global Story Player Modal */}
      {selectedGroupIdx !== null && (
        <StoryViewerModal
          userGroups={userGroups}
          initialGroupIndex={selectedGroupIdx}
          initialSlideIndex={0}
          currentUserId={currentUserId}
          onClose={() => setSelectedGroupIdx(null)}
          onDeleteStory={onDeleteStory}
        />
      )}
    </div>
  );
}
