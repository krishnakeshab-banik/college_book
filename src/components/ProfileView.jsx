import React, { useState } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Sparkles, 
  Grid, 
  FolderHeart, 
  Bookmark,
  MapPin,
  BadgeCheck,
  Share2,
  Camera,
  Settings
} from 'lucide-react';

export default function ProfileView({ userStats, moments, albums }) {
  const [activeSubTab, setActiveSubTab] = useState('memories');
  const [hoveredMemory, setHoveredMemory] = useState(null);

  const bookmarkedMoments = moments?.filter(m => m.hasBookmarked) || [];

  const personalMemories = [
    { id: 'p1', url: '/assets/graduation.png', likes: 512, comments: 45 },
    { id: 'p2', url: '/assets/hostel_life.png', likes: 320, comments: 28 },
    { id: 'p3', url: '/assets/goa_trip.png', likes: 482, comments: 38 },
    { id: 'p4', url: '/assets/campus_fest.png', likes: 212, comments: 18 },
    { id: 'p5', url: '/assets/campfire.png', likes: 185, comments: 12 },
    { id: 'p6', url: '/assets/lake_view.png', likes: 290, comments: 24 }
  ];

  return (
    <div className="main-content" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Cover and profile*/}
      <section style={{ display: 'flex', flexDirection: 'column', position: 'relative', borderRadius: '24px', overflow: 'hidden', minHeight: '320px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        
        {/* Background Cover Image */}
        <img 
          src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80" 
          alt="Cover Banner"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        
        {/* Dark Gradient Overlay (Makes white text readable) */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.4) 40%, transparent 100%)' }}></div>

        {/* Top Right: Edit Cover Button */}
        <div style={{ position: 'absolute', top: '24px', right: '24px', zIndex: 10 }}>
          <button className="glass-hover" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(0,0,0,0.5)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', fontWeight: '600', backdropFilter: 'blur(8px)', cursor: 'pointer', transition: 'all 0.2s' }}>
            <Camera size={16} /> Edit Cover
          </button>
        </div>

        <div className="profile-details-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '32px', position: 'relative', zIndex: 10, marginTop: 'auto' }}>
          
          {/* Avatar and Name Group */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <img 
              src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80" 
              alt="Profile Avatar" 
              className="profile-main-avatar" 
              style={{ width: '130px', height: '130px', borderRadius: '50%', border: '4px solid rgba(255,255,255,0.85)', objectFit: 'cover', background: 'white', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}
            />
            <div className="profile-main-info">
              <h1 className="profile-main-name" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '2.2rem', fontWeight: '800', margin: 0, color: 'white', textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
                Aditya Verma
                <BadgeCheck size={24} style={{ color: '#818cf8', fill: 'white' }} title="Verified Student" />
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.9)', fontSize: '1rem', marginTop: '8px', fontWeight: '500', textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
                <MapPin size={16} />
                <span>SRM Institute of Science and Technology</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              className="glass-hover"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', fontWeight: '600', cursor: 'pointer', backdropFilter: 'blur(8px)', transition: 'all 0.2s' }}
            >
              <Share2 size={16} /> Share
            </button>
            <button 
              style={{ padding: '10px 24px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)' }}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              Edit Profile
            </button>
          </div>
        </div>
      </section>

      {/* summary */}
      <section className="glass" style={{ padding: '24px', borderRadius: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '65%' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--primary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            <Sparkles size={16} />
            <span>Open Innovation & AI Enthusiast</span>
          </span>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 }}>
            Building unofficial campus resources and exploring the intersection of AI/ML, full-stack web dev, and semiconductor engineering. Day Zero 2.0 Hackathon competitor.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '32px', paddingRight: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)' }}>24</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.5px' }}>Albums</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)' }}>482</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.5px' }}>Memories</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)' }}>1.2k</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.5px' }}>Followers</span>
          </div>
        </div>
      </section>

      {/* Profile Archives tabs */}
      <section className="profile-grid-tabs">
        <div className="tabs-header" style={{ display: 'flex', gap: '24px', borderBottom: '2px solid var(--border-glass-light)', marginBottom: '20px' }}>
          <button 
            className={`tab-btn ${activeSubTab === 'memories' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('memories')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 4px', background: 'transparent', border: 'none', borderBottom: activeSubTab === 'memories' ? '2px solid var(--primary)' : '2px solid transparent', color: activeSubTab === 'memories' ? 'var(--primary)' : 'var(--text-secondary)', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            <Grid size={18} /> My Memories
          </button>
          <button 
            className={`tab-btn ${activeSubTab === 'albums' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('albums')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 4px', background: 'transparent', border: 'none', borderBottom: activeSubTab === 'albums' ? '2px solid var(--primary)' : '2px solid transparent', color: activeSubTab === 'albums' ? 'var(--primary)' : 'var(--text-secondary)', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            <FolderHeart size={18} /> Collaborative Albums
          </button>
          <button 
            className={`tab-btn ${activeSubTab === 'bookmarks' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('bookmarks')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 4px', background: 'transparent', border: 'none', borderBottom: activeSubTab === 'bookmarks' ? '2px solid var(--primary)' : '2px solid transparent', color: activeSubTab === 'bookmarks' ? 'var(--primary)' : 'var(--text-secondary)', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            <Bookmark size={18} /> Bookmarks
          </button>

          {/* Settings & Privacy*/}
          <button 
            className={`tab-btn ${activeSubTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('settings')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 4px', background: 'transparent', border: 'none', borderBottom: activeSubTab === 'settings' ? '2px solid var(--text-main)' : '2px solid transparent', color: activeSubTab === 'settings' ? 'var(--text-main)' : 'var(--text-secondary)', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', marginLeft: 'auto' }}
          >
            <Settings size={18} /> Settings & Privacy
          </button>
        </div>

        {/* Tab content grids */}
        <div className="layout-grid profile-grid-content">
          {activeSubTab === 'memories' && personalMemories.map((med) => (
            <div 
              key={med.id} 
              className="profile-media-card glass glass-hover" 
              style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', cursor: 'pointer', aspectRatio: '1' }}
              onMouseEnter={() => setHoveredMemory(med.id)}
              onMouseLeave={() => setHoveredMemory(null)}
            >
              <img src={med.url} alt="Memory" className="profile-media-img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              
              <div className="profile-media-overlay" style={{ 
                position: 'absolute', inset: 0, 
                background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%)', 
                display: 'flex', alignItems: 'flex-end', padding: '20px', gap: '16px', 
                opacity: hoveredMemory === med.id ? 1 : 0, 
                transition: 'opacity 0.2s ease-in-out' 
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'white', fontWeight: '600' }}>
                  <Heart size={18} fill="white" /> <span>{med.likes}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'white', fontWeight: '600' }}>
                  <MessageCircle size={18} fill="white" /> <span>{med.comments}</span>
                </div>
              </div>
            </div>
          ))}

          {activeSubTab === 'albums' && albums?.filter(a => a.isJoined).map((album) => (
            <div key={album.id} className="profile-media-card glass glass-hover" style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', cursor: 'pointer', aspectRatio: '1' }}>
              <img src={album.coverImage} alt={album.title} className="profile-media-img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div className="profile-media-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.7)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: '700', color: 'white', textAlign: 'center' }}>{album.title}</span>
                <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginTop: '6px' }}>{album.media.length} Shared Photos</span>
              </div>
            </div>
          ))}

          {activeSubTab === 'bookmarks' && bookmarkedMoments.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)', fontSize: '1rem', background: 'var(--border-glass-light)', borderRadius: '16px' }}>
              <Bookmark size={40} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
              No bookmarked memories yet. Save posts in the Home feed to see them here!
            </div>
          )}

          {/* Settings */}
          {activeSubTab === 'settings' && (
            <div style={{ gridColumn: '1 / -1', padding: '48px 32px', background: 'var(--border-glass-light)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <h3 style={{ margin: '0 0 12px 0', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.4rem' }}>
                <Settings size={24} style={{ color: 'var(--primary)' }}/> Account Preferences
              </h3>
              <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.95rem', lineHeight: '1.6', maxWidth: '600px' }}>
                Manage your privacy, notifications, password, and active sessions here. 
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}