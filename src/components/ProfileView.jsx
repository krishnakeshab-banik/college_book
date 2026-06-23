import React, { useState } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Sparkles, 
  Grid, 
  FolderHeart, 
  Bookmark,
  MapPin,
  Camera
} from 'lucide-react';

export default function ProfileView({ userStats, moments, albums }) {
  const [activeSubTab, setActiveSubTab] = useState('memories');

  // Filter bookmarked memories
  const bookmarkedMoments = moments.filter(m => m.hasBookmarked);

  // User's private/personal memory grid
  const personalMemories = [
    { id: 'p1', url: '/assets/graduation.png', likes: 512, comments: 45 },
    { id: 'p2', url: '/assets/hostel_life.png', likes: 320, comments: 28 },
    { id: 'p3', url: '/assets/goa_trip.png', likes: 482, comments: 38 },
    { id: 'p4', url: '/assets/campus_fest.png', likes: 212, comments: 18 },
    { id: 'p5', url: '/assets/campfire.png', likes: 185, comments: 12 },
    { id: 'p6', url: '/assets/lake_view.png', likes: 290, comments: 24 }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Cover and Profile details header */}
      <section style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="profile-cover-section">
          <div className="profile-cover-overlay"></div>
        </div>

        <div className="profile-details-row">
          <img 
            src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80" 
            alt="Aditya Verma" 
            className="profile-main-avatar" 
          />
          <div className="profile-main-info">
            <h1 className="profile-main-name">Aditya Verma</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
              <MapPin size={14} />
              <span>Lovely Professional University</span>
            </div>
          </div>
        </div>
      </section>

      {/* Biography & Achievements summary */}
      <section className="glass" style={{ padding: '20px', borderRadius: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxWidth: '70%' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '700', textTransform: 'uppercase' }}>
            <Sparkles size={14} />
            <span>Digital Yearbook Lead</span>
          </span>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
            Capturing the moments we will talk about for the rest of our lives. Tech lead for the annual college memory archive.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '20px', paddingRight: '20px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--primary)' }}>24</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Albums</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--accent)' }}>482</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Memories</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'white' }}>1.2k</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Followers</div>
          </div>
        </div>
      </section>

      {/* Profile Archives tabs */}
      <section className="profile-grid-tabs">
        <div className="tabs-header">
          <button 
            className={`tab-btn ${activeSubTab === 'memories' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('memories')}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Grid size={16} />
              My Memories
            </span>
          </button>
          <button 
            className={`tab-btn ${activeSubTab === 'albums' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('albums')}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FolderHeart size={16} />
              Collaborative Albums
            </span>
          </button>
          <button 
            className={`tab-btn ${activeSubTab === 'bookmarks' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('bookmarks')}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bookmark size={16} />
              Bookmarks
            </span>
          </button>
        </div>

        {/* Tab content grids */}
        <div className="profile-grid-content">
          {activeSubTab === 'memories' && personalMemories.map((med) => (
            <div key={med.id} className="profile-media-card glass">
              <img src={med.url} alt="Memory" className="profile-media-img" />
              <div className="profile-media-overlay">
                <div className="profile-stat-icon-btn">
                  <Heart size={14} fill="white" />
                  <span>{med.likes}</span>
                </div>
                <div className="profile-stat-icon-btn">
                  <MessageCircle size={14} fill="white" />
                  <span>{med.comments}</span>
                </div>
              </div>
            </div>
          ))}

          {activeSubTab === 'albums' && albums.filter(a => a.isJoined).map((album) => (
            <div key={album.id} className="profile-media-card glass">
              <img src={album.coverImage} alt={album.title} className="profile-media-img" />
              <div className="profile-media-overlay" style={{ flexDirection: 'column', padding: '16px', opacity: 1, background: 'rgba(7, 5, 15, 0.75)' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: '700', textAlign: 'center' }}>{album.title}</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  {album.media.length} Shared Photos
                </span>
              </div>
            </div>
          ))}

          {activeSubTab === 'bookmarks' && bookmarkedMoments.map((moment) => (
            <div key={moment.id} className="profile-media-card glass" style={{ minHeight: '150px' }}>
              {moment.image ? (
                <img src={moment.image} alt={moment.user.name} className="profile-media-img" />
              ) : (
                <div style={{
                  padding: '16px',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, var(--bg-card) 0%, rgba(99, 102, 241, 0.05) 100%)',
                  textAlign: 'center'
                }}>
                  <p style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-main)',
                    display: '-webkit-box',
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    lineHeight: '1.4',
                    fontWeight: '500'
                  }}>
                    {moment.description}
                  </p>
                </div>
              )}
              <div className="profile-media-overlay">
                <div className="profile-stat-icon-btn">
                  <Heart size={14} fill="white" />
                  <span>{moment.likes}</span>
                </div>
              </div>
            </div>
          ))}

          {activeSubTab === 'bookmarks' && bookmarkedMoments.length === 0 && (
            <div style={{ gridColumn: 'span 3', textAlign: 'center', padding: '40px', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              No bookmarked memories yet. Bookmark posts in the Home feed to see them here!
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
