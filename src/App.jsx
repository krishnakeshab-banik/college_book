import React, { useState } from 'react';
import { 
  Search, 
  TrendingUp, 
  BellRing,
  Heart,
  MessageCircle,
  FolderHeart,
  UserPlus,
  Sparkles
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
import CosmicBackground from './components/CosmicBackground';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  
  // State
  const [friends, setFriends] = useState(initialActiveFriends);
  const [stories, setStories] = useState(initialStories);
  const [featuredMemory, setFeaturedMemory] = useState(initialFeaturedMemory);
  const [moments, setMoments] = useState(initialMoments);
  const [albums, setAlbums] = useState(initialAlbums);
  const [messages, setMessages] = useState(initialMessages);
  
  // Active selected states
  const [activeChatFriend, setActiveChatFriend] = useState(null);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [activeStory, setActiveStory] = useState(null);
  
  // Modals
  const [showCreateAlbumModal, setShowCreateAlbumModal] = useState(false);
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
        return {
          ...m,
          hasLiked: !m.hasLiked,
          likes: m.hasLiked ? m.likes - 1 : m.likes + 1
        };
      }
      return m;
    }));
  };

  const handleBookmarkMoment = (momentId) => {
    setMoments(prev => prev.map(m => {
      if (m.id === momentId) {
        return {
          ...m,
          hasBookmarked: !m.hasBookmarked
        };
      }
      return m;
    }));
  };

  const handleCreateAlbum = (newAlbum) => {
    setAlbums(prev => [newAlbum, ...prev]);
    setShowCreateAlbumModal(false);
    setSelectedAlbum(newAlbum);
    setActiveTab('albums');
  };

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
            featuredMemory={featuredMemory}
            moments={moments}
            onStoryClick={setActiveStory}
            onAddStoryClick={() => alert('Add Story feature: Simply upload from your gallery!')}
            onLikeFeatured={handleLikeFeatured}
            onViewFeaturedAlbum={handleViewFeaturedAlbum}
            onLikeMoment={handleLikeMoment}
            onBookmarkMoment={handleBookmarkMoment}
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
      <div className="cosmic-background-wrapper">
        <div className="cosmic-background-image"></div>
      </div>
      <CosmicBackground />
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
          story={activeStory} 
          onClose={() => setActiveStory(null)} 
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
    </div>
  );
}
