import React, { useState, useEffect } from 'react';
import { 
  Search, 
  TrendingUp, 
  BellRing,
  Heart,
  MessageCircle,
  FolderHeart,
  UserPlus,
  Sparkles,
  Home,
  Compass,
  PlusCircle
} from 'lucide-react';

// Data
import { 
  initialActiveFriends, 
  initialStories, 
  initialFeaturedMemory, 
  initialMoments, 
  initialAlbums, 
  initialMessages 
} from './MockData';

// Components
import HeaderDock from './components/HeaderDock';
import MainFeed from './components/MainFeed';
import StoryViewer from './components/StoryViewer';
import AlbumsView from './components/AlbumsView';
import ExploreView from './components/ExploreView';
import MemoriesTimeline from './components/MemoriesTimeline';
import FriendsView from './components/FriendsView';
import MessagesView from './components/MessagesView';
import ProfileView from './components/ProfileView';
import CreateAlbumModal from './components/CreateAlbumModal';
import PostDetailsModal from './components/PostDetailsModal';
import AddStoryModal from './components/AddStoryModal';
import { formatTime } from './utils/time';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  
  // LocalStorage Database Helpers
  const getInitialMoments = () => {
    const saved = localStorage.getItem('college_book_moments');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    
    // Injected comments for rich initial feed
    const momentsWithComments = initialMoments.map(moment => {
      if (moment.id === 'moment-1') {
        return {
          ...moment,
          comments: [
            { user: 'Rohan Verma', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80', text: 'This was literally the best performance ever! EDM night rocks! 🎸⚡', time: '1h ago' },
            { user: 'Ananya Iyer', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80', text: 'Great capture! I remember losing my voice from screaming.', time: '45m ago' }
          ]
        };
      } else if (moment.id === 'moment-2') {
        return {
          ...moment,
          comments: [
            { user: 'Diya Sharma', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80', text: 'The guitar session around the fire was so beautiful. Let us plan another trip!', time: '3h ago' },
            { user: 'Rohan Verma', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80', text: 'Bro Rohan, you promised you wouldn\'t mention that sleep fail! 😂', time: '2h ago' }
          ]
        };
      } else if (moment.id === 'moment-3') {
        return {
          ...moment,
          comments: [
            { user: 'Simran Kaur', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=80&q=80', text: 'Cold water, high peaks, pure peace. Definitely going back.', time: '6h ago' }
          ]
        };
      }
      return { ...moment, comments: [] };
    });
    localStorage.setItem('college_book_moments', JSON.stringify(momentsWithComments));
    return momentsWithComments;
  };

  const getInitialStories = () => {
    const saved = localStorage.getItem('college_book_stories');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    localStorage.setItem('college_book_stories', JSON.stringify(initialStories));
    return initialStories;
  };
  
  const getInitialMessages = () => {
    const saved = localStorage.getItem('college_book_messages');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    localStorage.setItem('college_book_messages', JSON.stringify(initialMessages));
    return initialMessages;
  };

  const getInitialAlbums = () => {
    const saved = localStorage.getItem('college_book_albums');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    localStorage.setItem('college_book_albums', JSON.stringify(initialAlbums));
    return initialAlbums;
  };

  const getInitialFriends = () => {
    const saved = localStorage.getItem('college_book_friends');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    localStorage.setItem('college_book_friends', JSON.stringify(initialActiveFriends));
    return initialActiveFriends;
  };

  const getInitialFeaturedMemory = () => {
    const saved = localStorage.getItem('college_book_featured_memory');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    localStorage.setItem('college_book_featured_memory', JSON.stringify(initialFeaturedMemory));
    return initialFeaturedMemory;
  };

  const getInitialNotifications = () => {
    const saved = localStorage.getItem('college_book_notifications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    const defaultNotifs = [
      { id: 1, type: 'like', user: 'Ananya Iyer', text: 'liked your photo in Goa Trip 2K24', time: '5m ago', read: false },
      { id: 2, type: 'comment', user: 'Rohan Verma', text: 'commented: "Literally the best 5 days of my life!"', time: '2h ago', read: false },
      { id: 3, type: 'collab', user: 'Simran Kaur', text: 'invited you to collaborate on Spiti Valley Road Trip', time: '1d ago', read: true },
      { id: 4, type: 'request', user: 'Sanya Malhotra', text: 'sent you a friend request', time: '2d ago', read: true, action: true }
    ];
    localStorage.setItem('college_book_notifications', JSON.stringify(defaultNotifs));
    return defaultNotifs;
  };

  // State
  const [friends, setFriends] = useState(getInitialFriends);
  const [stories, setStories] = useState(getInitialStories);
  const [featuredMemory, setFeaturedMemory] = useState(getInitialFeaturedMemory);
  const [moments, setMoments] = useState(getInitialMoments);
  const [albums, setAlbums] = useState(getInitialAlbums);
  const [messages, setMessages] = useState(getInitialMessages);
  
  const [seenStories, setSeenStories] = useState(() => {
    const saved = localStorage.getItem('college_book_seen_stories');
    return saved ? JSON.parse(saved) : [];
  });

  const handleStorySeen = (storyId) => {
    setSeenStories(prev => {
      if (prev.includes(storyId)) return prev;
      const updated = [...prev, storyId];
      localStorage.setItem('college_book_seen_stories', JSON.stringify(updated));
      return updated;
    });
  };
  
  // Active selected states
  const [activeChatFriend, setActiveChatFriend] = useState(null);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [activeStory, setActiveStory] = useState(null);
  const [activePostDetails, setActivePostDetails] = useState(null);
  
  // Modals
  const [showCreateAlbumModal, setShowCreateAlbumModal] = useState(false);
  const [showAddStoryModal, setShowAddStoryModal] = useState(false);
  const [rightPanelSearch, setRightPanelSearch] = useState('');

  // Notifications
  const [notifications, setNotifications] = useState(getInitialNotifications);

  // Actions
  const handleLikeFeatured = () => {
    setFeaturedMemory(prev => ({
      ...prev,
      hasLiked: !prev.hasLiked,
      likes: prev.hasLiked ? prev.likes - 1 : prev.likes + 1
    }));
  };

  const handleViewFeaturedAlbum = () => {
    window.location.hash = '#/albums/goa-trip-2k24';
  };

  const handleLikeMoment = (momentId) => {
    setMoments(prev => prev.map(m => {
      if (m.id === momentId) {
        const updated = {
          ...m,
          hasLiked: !m.hasLiked,
          likes: m.hasLiked ? m.likes - 1 : m.likes + 1
        };
        if (activePostDetails && activePostDetails.id === momentId) {
          setActivePostDetails(updated);
        }
        return updated;
      }
      return m;
    }));
  };

  const handleBookmarkMoment = (momentId) => {
    setMoments(prev => prev.map(m => {
      if (m.id === momentId) {
        const updated = {
          ...m,
          hasBookmarked: !m.hasBookmarked
        };
        if (activePostDetails && activePostDetails.id === momentId) {
          setActivePostDetails(updated);
        }
        return updated;
      }
      return m;
    }));
  };

  const handleComposeMoment = (desc, img) => {
    const newMoment = {
      id: `moment-${Date.now()}`,
      user: {
        name: 'Aditya Verma',
        university: 'Lovely Professional University',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80'
      },
      timestamp: new Date().toISOString(),
      image: img || '',
      likes: 0,
      commentsCount: 0,
      hasLiked: false,
      hasBookmarked: false,
      description: desc,
      comments: []
    };
    setMoments(prev => [newMoment, ...prev]);
  };

  const handlePostComment = (momentId, text) => {
    const newComment = {
      user: 'Aditya Verma',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=80&q=80',
      text: text,
      time: new Date().toISOString()
    };
    setMoments(prev => prev.map(m => {
      if (m.id === momentId) {
        const updatedComments = [...(m.comments || []), newComment];
        const updated = {
          ...m,
          comments: updatedComments,
          commentsCount: updatedComments.length
        };
        if (activePostDetails && activePostDetails.id === momentId) {
          setActivePostDetails(updated);
        }
        return updated;
      }
      return m;
    }));
  };

  const handleAddStory = (img, caption) => {
    setStories(prev => {
      const userStoryIdx = prev.findIndex(s => s.id === 'user-story');
      const newSlide = {
        url: img,
        caption: caption || 'Class of 2024! 🎓',
        timestamp: new Date().toISOString()
      };
      if (userStoryIdx > -1) {
        const updatedStories = [...prev];
        const currentStory = updatedStories[userStoryIdx];
        updatedStories[userStoryIdx] = {
          ...currentStory,
          slides: [newSlide, ...(currentStory.slides || [])]
        };
        return updatedStories;
      } else {
        const newStory = {
          id: 'user-story',
          name: 'Your Story',
          avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
          glow: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
          slides: [newSlide]
        };
        const updated = [...prev];
        updated.splice(1, 0, newStory);
        return updated;
      }
    });
    setShowAddStoryModal(false);
  };

  const handleCreateAlbum = (newAlbum) => {
    setAlbums(prev => [newAlbum, ...prev]);
    setShowCreateAlbumModal(false);
    window.location.hash = `#/albums/${newAlbum.id}`;
  };

  // Sync state changes to localStorage
  useEffect(() => {
    localStorage.setItem('college_book_moments', JSON.stringify(moments));
  }, [moments]);

  useEffect(() => {
    localStorage.setItem('college_book_stories', JSON.stringify(stories));
  }, [stories]);

  useEffect(() => {
    localStorage.setItem('college_book_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('college_book_albums', JSON.stringify(albums));
    if (selectedAlbum) {
      const updated = albums.find(a => a.id === selectedAlbum.id);
      if (updated) {
        setSelectedAlbum(updated);
      }
    }
  }, [albums, selectedAlbum]);

  useEffect(() => {
    localStorage.setItem('college_book_friends', JSON.stringify(friends));
  }, [friends]);

  useEffect(() => {
    localStorage.setItem('college_book_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('college_book_featured_memory', JSON.stringify(featuredMemory));
  }, [featuredMemory]);

  // Routing Listener (Hash Change)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || '#/home';
      const parts = hash.replace(/^#\/?/, '').split('/');
      const tab = parts[0] || 'home';
      const param = parts[1];

      setActiveTab(tab);

      if (tab === 'albums') {
        if (param) {
          const album = albums.find(a => a.id === param);
          if (album) setSelectedAlbum(album);
        } else {
          setSelectedAlbum(null);
        }
      } else {
        setSelectedAlbum(null);
      }

      if (tab === 'messages') {
        if (param) {
          const friend = friends.find(f => f.id === param);
          if (friend) setActiveChatFriend(friend);
        } else {
          setActiveChatFriend(null);
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    // Initial check
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [albums, friends]);

  const handleFriendChatClick = (friend) => {
    window.location.hash = `#/messages/${friend.id}`;
  };

  const handleTrendingClick = (hashtag) => {
    window.location.hash = '#/explore';
  };

  const handleJoinSuggestedAlbum = (albumId) => {
    setAlbums(prev => prev.map(album => {
      if (album.id === albumId) {
        return {
          ...album,
          isJoined: true,
          contributorCount: album.contributorCount + 1,
          contributors: [
            ...album.contributors,
            { name: 'Aditya Verma', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=80&q=80' }
          ]
        };
      }
      return album;
    }));
  };

  const handleRightSearchSubmit = (e) => {
    e.preventDefault();
    if (!rightPanelSearch.trim()) return;
    window.location.hash = '#/explore';
  };

  // Render correct middle view
  const renderMiddleSection = () => {
    switch (activeTab) {
      case 'home':
        return (
          <MainFeed 
            stories={stories}
            seenStories={seenStories}
            featuredMemory={featuredMemory}
            moments={moments}
            onStoryClick={setActiveStory}
            onAddStoryClick={() => setShowAddStoryModal(true)}
            onLikeFeatured={handleLikeFeatured}
            onViewFeaturedAlbum={handleViewFeaturedAlbum}
            onLikeMoment={handleLikeMoment}
            onBookmarkMoment={handleBookmarkMoment}
            onComposeMoment={handleComposeMoment}
            onMomentClick={setActivePostDetails}
            friends={friends}
            onFriendChatClick={handleFriendChatClick}
            albums={albums}
            onJoinSuggestedAlbum={handleJoinSuggestedAlbum}
            onTrendingClick={handleTrendingClick}
            onRightSearchSubmit={handleRightSearchSubmit}
            rightPanelSearch={rightPanelSearch}
            setRightPanelSearch={setRightPanelSearch}
          />
        );
      case 'albums':
        return (
          <AlbumsView 
            albums={albums}
            setAlbums={setAlbums}
            friends={friends}
            onAlbumClick={(album) => {
              window.location.hash = `#/albums/${album.id}`;
            }}
            selectedAlbum={selectedAlbum}
            setSelectedAlbum={(album) => {
              window.location.hash = album ? `#/albums/${album.id}` : '#/albums';
            }}
          />
        );
      case 'explore':
        return (
          <ExploreView 
            initialMoments={moments}
            albums={albums}
          />
        );
      case 'memories':
        return <MemoriesTimeline />;
      case 'friends':
        return (
          <FriendsView 
            friends={friends}
            onFriendChatClick={handleFriendChatClick}
          />
        );
      case 'messages':
        return (
          <MessagesView 
            friends={friends}
            activeChatFriend={activeChatFriend}
            setActiveChatFriend={(friend) => {
              window.location.hash = friend ? `#/messages/${friend.id}` : '#/messages';
            }}
            messages={messages}
            setMessages={setMessages}
          />
        );
      case 'profile':
        return (
          <ProfileView 
            userStats={{ albums: 24, memories: 482, friends: 320 }}
            moments={moments}
            albums={albums}
          />
        );
      case 'notifications':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <h1 className="section-title" style={{ fontSize: '1.6rem', marginBottom: '8px' }}>
                <BellRing size={22} className="trend-arrow" />
                <span>Notifications & Activity</span>
              </h1>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Stay up to date with comments, likes, invitations, and classmate interactions.
              </p>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '640px' }}>
              {notifications.map((notif) => (
                <div 
                  key={notif.id} 
                  className={`glass ${!notif.read ? 'active' : ''}`} 
                  style={{ 
                    padding: '16px 20px', 
                    borderRadius: '16px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    borderLeft: !notif.read ? '3px solid var(--primary)' : '1px solid var(--border-glass)',
                    background: !notif.read ? 'rgba(99, 102, 241, 0.04)' : 'var(--bg-card)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: notif.type === 'like' ? 'rgba(236,72,153,0.1)' : notif.type === 'comment' ? 'rgba(99,102,241,0.1)' : 'rgba(16,185,129,0.1)',
                      color: notif.type === 'like' ? 'var(--accent)' : notif.type === 'comment' ? 'var(--primary)' : 'var(--success)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {notif.type === 'like' && <Heart size={16} fill="currentColor" />}
                      {notif.type === 'comment' && <MessageCircle size={16} />}
                      {notif.type === 'collab' && <FolderHeart size={16} />}
                      {notif.type === 'request' && <UserPlus size={16} />}
                    </div>

                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: '500' }}>
                        <span style={{ fontWeight: '700', marginRight: '4px' }}>{notif.user}</span>
                        <span>{notif.text}</span>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>{notif.time}</div>
                    </div>
                  </div>

                  {notif.action && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        className="join-btn" 
                        style={{ padding: '6px 12px', fontSize: '0.72rem' }}
                        onClick={() => {
                          alert('Friend Request Accepted!');
                          setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, action: false } : n));
                        }}
                      >
                        Accept
                      </button>
                      <button 
                        className="join-album-btn-outline" 
                        style={{ padding: '6px 12px', fontSize: '0.72rem', borderRadius: '8px' }}
                        onClick={() => {
                          setNotifications(prev => prev.filter(n => n.id !== notif.id));
                        }}
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return <div>Tab under construction</div>;
    }
  };

  return (
    <div className="app-container-studio">
      {/* Floating Dynamic Island Header */}
      <HeaderDock 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          window.location.hash = `#/${tab}`;
        }}
      />

      {/* Main Studio Canvas */}
      <div className="canvas-container">
        {renderMiddleSection()}
      </div>

      {/* Global Story Viewer Overlay */}
      {activeStory && (
        <StoryViewer 
          activeStoryId={activeStory.id}
          stories={stories.filter(s => !s.isAdd && s.slides && s.slides.length > 0)}
          onClose={() => setActiveStory(null)}
          onStorySeen={handleStorySeen}
        />
      )}

      {/* Global Create Album Modal */}
      {showCreateAlbumModal && (
        <CreateAlbumModal 
          friends={friends}
          onClose={() => setShowCreateAlbumModal(false)}
          onCreateAlbum={handleCreateAlbum}
        />
      )}

      {/* Global Post Details Modal */}
      {activePostDetails && (
        <PostDetailsModal
          moment={activePostDetails}
          onClose={() => setActivePostDetails(null)}
          onLike={handleLikeMoment}
          onBookmark={handleBookmarkMoment}
          onAddComment={handlePostComment}
        />
      )}

      {/* Global Add Story Modal */}
      {showAddStoryModal && (
        <AddStoryModal
          onClose={() => setShowAddStoryModal(false)}
          onAddStory={handleAddStory}
        />
      )}
    </div>
  );
}
