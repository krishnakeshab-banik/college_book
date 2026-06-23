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
import Sidebar from './components/Sidebar';
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
  
  // State
  const [friends, setFriends] = useState(initialActiveFriends);
  const [stories, setStories] = useState(getInitialStories);
  const [featuredMemory, setFeaturedMemory] = useState(initialFeaturedMemory);
  const [moments, setMoments] = useState(getInitialMoments);
  const [albums, setAlbums] = useState(initialAlbums);
  const [messages, setMessages] = useState(initialMessages);
  
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

  // Notifications Mock Data
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'like', user: 'Ananya Iyer', text: 'liked your photo in Goa Trip 2K24', time: '5m ago', read: false },
    { id: 2, type: 'comment', user: 'Rohan Verma', text: 'commented: "Literally the best 5 days of my life!"', time: '2h ago', read: false },
    { id: 3, type: 'collab', user: 'Simran Kaur', text: 'invited you to collaborate on Spiti Valley Road Trip', time: '1d ago', read: true },
    { id: 4, type: 'request', user: 'Sanya Malhotra', text: 'sent you a friend request', time: '2d ago', read: true, action: true }
  ]);

  // Actions
  const handleLikeFeatured = () => {
    setFeaturedMemory(prev => ({
      ...prev,
      hasLiked: !prev.hasLiked,
      likes: prev.hasLiked ? prev.likes - 1 : prev.likes + 1
    }));
  };

  const handleViewFeaturedAlbum = () => {
    const goaAlbum = albums.find(a => a.id === 'goa-trip-2k24');
    if (goaAlbum) {
      setSelectedAlbum(goaAlbum);
      setActiveTab('albums');
    }
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
      timestamp: 'Just now',
      image: img || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80',
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
      time: 'Just now'
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
        timestamp: 'Just now'
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
    setSelectedAlbum(newAlbum);
    setActiveTab('albums');
  };

  // Sync state changes to localStorage
  useEffect(() => {
    localStorage.setItem('college_book_moments', JSON.stringify(moments));
  }, [moments]);

  useEffect(() => {
    localStorage.setItem('college_book_stories', JSON.stringify(stories));
  }, [stories]);

  const handleFriendChatClick = (friend) => {
    setActiveChatFriend(friend);
    setActiveTab('messages');
  };

  const handleTrendingClick = (hashtag) => {
    setActiveTab('explore');
    // We will let ExploreView filter handle this automatically
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
    setActiveTab('explore');
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
          />
        );
      case 'albums':
        return (
          <AlbumsView 
            albums={albums}
            setAlbums={setAlbums}
            onAlbumClick={(album) => setSelectedAlbum(album)}
            selectedAlbum={selectedAlbum}
            setSelectedAlbum={setSelectedAlbum}
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
            setActiveChatFriend={setActiveChatFriend}
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
    <div className="app-container">
      {/* Mobile Top Header (Instagram style) */}
      <header className="mobile-header">
        <div className="mobile-logo-container">
          <Sparkles className="logo-icon" size={20} />
          <span className="logo-text">CollegeBook</span>
        </div>
        <div className="mobile-header-actions">
          <button className="mobile-action-btn" onClick={() => setActiveTab('notifications')}>
            <BellRing size={22} />
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="mobile-badge pink">{notifications.filter(n => !n.read).length}</span>
            )}
          </button>
          <button className="mobile-action-btn" onClick={() => { setActiveTab('messages'); setActiveChatFriend(null); }}>
            <MessageCircle size={22} />
            <span className="mobile-badge">3</span>
          </button>
        </div>
      </header>

      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'albums') setSelectedAlbum(null);
        }} 
        onCreateAlbumClick={() => setShowCreateAlbumModal(true)}
        pulseUsers={friends}
      />

      {/* Main middle feed view */}
      <main className="main-content-wrapper" style={{ flex: 1 }}>
        {renderMiddleSection()}
      </main>

      {/* Right Sidebar Widgets Panel */}
      <aside className="right-panel glass">
        {/* Search */}
        <form onSubmit={handleRightSearchSubmit} className="search-container">
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search memories, tags..." 
            value={rightPanelSearch}
            onChange={(e) => setRightPanelSearch(e.target.value)}
          />
          <Search className="search-icon" size={18} />
          <span className="search-shortcut">⌘ K</span>
        </form>

        {/* Aditya profile summary */}
        <div className="profile-card glass">
          <div className="profile-header-sm">
            <img 
              src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80" 
              alt="Aditya Verma" 
              className="profile-avatar-lg" 
            />
            <div>
              <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>Aditya Verma</div>
              <div className="profile-univ">Lovely Professional University</div>
            </div>
          </div>
          <div className="profile-stats-grid">
            <div className="stat-item">
              <span className="stat-val">24</span>
              <span className="stat-lbl">Albums</span>
            </div>
            <div className="stat-item">
              <span className="stat-val">482</span>
              <span className="stat-lbl">Memories</span>
            </div>
            <div className="stat-item">
              <span className="stat-val">320</span>
              <span className="stat-lbl">Friends</span>
            </div>
            <div className="stat-item">
              <span className="stat-val">1.2k</span>
              <span className="stat-lbl">Followers</span>
            </div>
          </div>
        </div>

        {/* Active Friends */}
        <div>
          <div className="section-title-sm">
            <span>Active Friends</span>
            <span className="see-all" onClick={() => setActiveTab('friends')}>See all</span>
          </div>
          <div className="friends-list-sm">
            {friends.map((friend) => (
              <div 
                key={friend.id} 
                className="friend-item-sm"
                onClick={() => handleFriendChatClick(friend)}
              >
                <div className="friend-avatar-container">
                  <img src={friend.avatar} alt={friend.name} className="friend-avatar-sm" />
                  <span className={`status-indicator ${friend.status === 'call' ? 'call' : friend.status === 'online' ? 'online' : 'offline'}`}></span>
                </div>
                <div className="friend-info-sm">
                  <div className="friend-name-sm">{friend.name}</div>
                  <div className="friend-status-text">
                    {friend.status === 'call' ? 'In a call' : friend.status === 'online' ? 'Online' : 'Active 5m ago'}
                  </div>
                </div>
                <button className="chat-btn-sm">
                  <MessageCircle size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Trending on Campus */}
        <div>
          <div className="section-title-sm">
            <span>Trending on Campus</span>
            <span className="see-all" onClick={() => setActiveTab('explore')}>See all</span>
          </div>
          <div className="trending-list">
            <div className="trending-item" onClick={() => handleTrendingClick('#Holi2K24')}>
              <div className="trending-details">
                <span className="trending-name">Holi 2K24</span>
                <span className="trending-count">1.8k memories</span>
              </div>
              <TrendingUp size={14} className="trend-arrow" />
            </div>
            
            <div className="trending-item" onClick={() => handleTrendingClick('#CollegeVibes')}>
              <div className="trending-details">
                <span className="trending-name">#CollegeVibes</span>
                <span className="trending-count">12.5k memories</span>
              </div>
              <TrendingUp size={14} className="trend-arrow" />
            </div>

            <div className="trending-item" onClick={() => handleTrendingClick('#TechFest2024')}>
              <div className="trending-details">
                <span className="trending-name">Tech Fest 2024</span>
                <span className="trending-count">968 memories</span>
              </div>
              <TrendingUp size={14} className="trend-arrow" />
            </div>
          </div>
        </div>

        {/* Suggested Albums */}
        <div>
          <div className="section-title-sm">
            <span>Suggested Albums</span>
            <span className="see-all" onClick={() => setActiveTab('albums')}>See all</span>
          </div>
          
          {albums.find(a => a.id === 'spiti-valley-road-trip' && !a.isJoined) && (
            <div className="suggested-album-card glass">
              <img src="/assets/lake_view.png" alt="Suggested Album" className="suggested-cover" />
              <div className="suggested-info">
                <div className="suggested-title">Spiti Valley Road Trip</div>
                <div className="suggested-subtitle">21 contributors</div>
              </div>
              <button 
                className="join-btn"
                onClick={() => handleJoinSuggestedAlbum('spiti-valley-road-trip')}
              >
                Join
              </button>
            </div>
          )}
        </div>
      </aside>

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

      {/* Mobile Bottom Navigation Bar (Instagram style) */}
      <nav className="mobile-bottom-nav">
        <button 
          className={`mobile-nav-btn ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => { setActiveTab('home'); setSelectedAlbum(null); }}
        >
          <Home size={22} />
        </button>
        <button 
          className={`mobile-nav-btn ${activeTab === 'explore' ? 'active' : ''}`}
          onClick={() => { setActiveTab('explore'); setSelectedAlbum(null); }}
        >
          <Compass size={22} />
        </button>
        <button 
          className="mobile-nav-btn create"
          onClick={() => setShowCreateAlbumModal(true)}
        >
          <PlusCircle size={24} />
        </button>
        <button 
          className={`mobile-nav-btn ${activeTab === 'albums' ? 'active' : ''}`}
          onClick={() => setActiveTab('albums')}
        >
          <FolderHeart size={22} />
        </button>
        <button 
          className={`mobile-nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => { setActiveTab('profile'); setSelectedAlbum(null); }}
        >
          <img 
            src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=80&q=80" 
            alt="Profile" 
            className="mobile-profile-avatar"
          />
        </button>
      </nav>
    </div>
  );
}
