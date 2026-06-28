import React, { useState } from 'react';
import { formatTime } from '../utils/time';
import { 
  Heart, 
  MessageCircle, 
  Bookmark, 
  MapPin, 
  Star, 
  Play, 
  BadgeCheck, 
  X,
  Search,
  TrendingUp,
  Image as ImageIcon
} from 'lucide-react';

export default function MainFeed({
  stories,
  seenStories,
  featuredMemory,
  moments,
  onStoryClick,
  onAddStoryClick,
  onLikeFeatured,
  onViewFeaturedAlbum,
  onLikeMoment,
  onBookmarkMoment,
  onComposeMoment,
  onMomentClick,
  // Widget props
  friends,
  onFriendChatClick,
  albums,
  onJoinSuggestedAlbum,
  onTrendingClick,
  onRightSearchSubmit,
  rightPanelSearch,
  setRightPanelSearch
}) {
  const [description, setDescription] = useState('');
  const [imageSrc, setImageSrc] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setImageSrc(uploadEvent.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (!description.trim() && !imageSrc) return;
    
    onComposeMoment({
      description,
      image: imageSrc
    });
    
    setDescription('');
    setImageSrc('');
  };

  return (
    <div className="main-content-studio-feed">
      {/* 1. CLEAN POLAROID STORIES TRAY */}
      <section className="polaroid-section">
        <div className="section-bar">
          <h2 className="section-title">
            <span>✨</span>
            <span>Classmate Ephemeral Tray (24h)</span>
          </h2>
          <span className="tech-badge">☁️ Cloudflare R2 Pipeline: 1080x1920 Faststart MP4</span>
        </div>

        <div className="polaroid-grid">
          {/* Add story card */}
          <div className="clean-polaroid" onClick={onAddStoryClick}>
            <div className="polaroid-img" style={{ background: '#eff6ff', color: 'var(--primary)', fontSize: '24px', fontWeight: '800' }}>+</div>
            <span className="polaroid-name">+ Add Story</span>
            <span className="polaroid-sub">Direct PUT</span>
          </div>

          {/* Stories list */}
          {stories
            .filter(story => !story.isAdd && story.slides && story.slides.length > 0)
            .map((story) => {
              const isSeen = seenStories && seenStories.includes(story.id);
              const firstSlide = story.slides?.[0];
              const thumbnail = firstSlide?.url || story.avatar;
              return (
                <div key={story.id} className="clean-polaroid" onClick={() => onStoryClick(story)}>
                  <div 
                    className="polaroid-img" 
                    style={{ backgroundImage: `url(${thumbnail})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                  >
                    {!isSeen && <div className="status-dot"></div>}
                  </div>
                  <span className="polaroid-name">{story.name}</span>
                  <span className="polaroid-sub">{firstSlide?.timestamp || '2h'}</span>
                </div>
              );
            })}
        </div>
      </section>

      {/* 2. MAIN FEED + SIDEBAR WIDGETS GRID */}
      <div className="feed-grid">
        <div className="feed-main">
          {/* Share Memory Panel (Post Composer) */}
          <section className="studio-post" style={{ marginBottom: '32px' }}>
            <form onSubmit={handlePostSubmit}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div className="avatar-sq">
                  <img 
                    src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80" 
                    alt="Aditya Verma" 
                  />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <textarea 
                    className="chat-input composer-textarea"
                    placeholder="Share a college memory, Aditya..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{ resize: 'none', minHeight: '60px', width: '100%', padding: '12px 14px', border: '1px solid var(--border-default)', borderRadius: '14px', outline: 'none' }}
                  />
                  
                  {imageSrc && (
                    <div style={{ position: 'relative', width: '120px', height: '120px', borderRadius: '12px', overflow: 'hidden' }}>
                      <img src={imageSrc} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button 
                        type="button" 
                        className="modal-close-btn"
                        style={{ top: '6px', right: '6px', width: '20px', height: '20px', background: 'rgba(15, 23, 42, 0.6)', color: 'white', border: 'none' }}
                        onClick={() => setImageSrc('')}
                      >
                        <X size={10} />
                      </button>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="composer-file-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.82rem', color: 'var(--primary)', fontWeight: '600' }}>
                      <input 
                        type="file" 
                        accept="image/*" 
                        style={{ display: 'none' }} 
                        onChange={handleFileChange} 
                      />
                      <ImageIcon size={16} />
                      <span>Add Photo</span>
                    </label>
                    
                    <button type="submit" className="btn-solid" style={{ padding: '8px 18px', fontSize: '13px' }}>
                      Share Memory
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </section>

          {/* Featured Album Section (redesigned) */}
          <section 
            className="studio-post"
            style={{ cursor: 'pointer', overflow: 'hidden', padding: '0', borderRadius: '24px', position: 'relative', height: '320px', display: 'flex', flexDirection: 'column', justifycontent: 'flex-end', marginBottom: '32px' }}
            onClick={onViewFeaturedAlbum}
          >
            <img 
              src={featuredMemory.image} 
              alt={featuredMemory.title} 
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(12, 19, 34, 0.9) 20%, rgba(12, 19, 34, 0.3) 100%)', zIndex: 2 }}></div>
            
            <div style={{ position: 'relative', zIndex: 3, padding: '24px', color: 'white' }}>
              <span style={{ fontSize: '11px', fontWeight: '800', background: 'var(--primary)', color: 'white', padding: '4px 10px', borderRadius: '100px', display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: '10px' }}>
                <Star size={12} fill="white" />
                <span>{featuredMemory.subtitle}</span>
              </span>
              
              <h1 style={{ fontSize: '24px', fontWeight: '800', letterSpacing: '-0.5px', marginBottom: '10px' }}>{featuredMemory.title}</h1>
              
              <div style={{ display: 'flex', gap: '16px', fontSize: '12px', opacity: 0.8, marginBottom: '16px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={12} />
                  <span>{featuredMemory.location}</span>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ImageIcon size={12} />
                  <span>{featuredMemory.memoryCount} Memories</span>
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="contributor-group" style={{ display: 'flex', alignItems: 'center' }}>
                  {featuredMemory.contributors.slice(0, 3).map((contrib, idx) => (
                    <img 
                      key={idx} 
                      src={contrib.avatar} 
                      alt={contrib.name} 
                      className="contrib-avatar" 
                      style={{ width: '24px', height: '24px', borderRadius: '50%', border: '2px solid #0c1322', marginLeft: idx > 0 ? '-8px' : '0' }}
                    />
                  ))}
                  <span style={{ fontSize: '11px', color: 'var(--text-dim)', marginLeft: '8px' }}>
                    {featuredMemory.contributors.map(c => c.name.split(' ')[0]).join(', ')} + others
                  </span>
                </div>

                <button 
                  className={`featured-like-btn ${featuredMemory.hasLiked ? 'liked' : ''}`}
                  onClick={(e) => { e.stopPropagation(); onLikeFeatured(); }}
                  style={{ background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(4px)', border: 'none', color: 'white', padding: '8px', borderRadius: '50%', cursor: 'pointer' }}
                >
                  <Heart size={16} fill={featuredMemory.hasLiked ? 'currentColor' : 'none'} />
                </button>
              </div>
            </div>
          </section>

          {/* Recent Moments Stream */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {moments.map((moment) => (
              <article key={moment.id} className="studio-post">
                <div className="post-top">
                  <div className="author-box">
                    <div className="avatar-sq">
                      <img src={moment.user.avatar} alt={moment.user.name} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ fontWeight: '700', fontSize: '14px' }}>{moment.user.name}</span>
                        <BadgeCheck size={14} style={{ color: 'var(--primary)' }} />
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{moment.user.university}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{formatTime(moment.timestamp)}</span>
                </div>

                {moment.image && (
                  <div className="media-stage" onClick={() => onMomentClick(moment)} style={{ cursor: 'pointer' }}>
                    <img src={moment.image} alt="Memory" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div className="location-badge">📍 {moment.user.university.split(' ')[0]}</div>
                    {moment.id === 'moment-2' && (
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.25)',
                        backdropFilter: 'blur(4px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        border: '1px solid rgba(255, 255, 255, 0.4)'
                      }}>
                        <Play size={18} fill="white" style={{ marginLeft: '2px' }} />
                      </div>
                    )}
                  </div>
                )}

                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6', marginTop: '16px' }}>
                  {moment.description}
                </p>

                <div className="reaction-bar">
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      className="btn-minimal"
                      style={{ color: moment.hasLiked ? 'var(--rose)' : '', borderColor: moment.hasLiked ? '#fecdd3' : '' }}
                      onClick={() => onLikeMoment(moment.id)}
                    >
                      <Heart size={14} fill={moment.hasLiked ? 'currentColor' : 'none'} />
                      <span>Endorse ({moment.likes})</span>
                    </button>
                    <button className="btn-minimal" onClick={() => onMomentClick(moment)}>
                      <MessageCircle size={14} />
                      <span>Discussions ({moment.comments ? moment.comments.length : moment.commentsCount})</span>
                    </button>
                  </div>
                  
                  <button 
                    className="btn-minimal"
                    style={{ color: moment.hasBookmarked ? 'var(--primary)' : '', borderColor: moment.hasBookmarked ? '#bfdbfe' : '' }}
                    onClick={() => onBookmarkMoment(moment.id)}
                  >
                    <Bookmark size={14} fill={moment.hasBookmarked ? 'currentColor' : 'none'} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* 3. SIDEBAR WIDGETS COLUMN */}
        <aside>
          {/* Search widget */}
          <div className="clean-widget" style={{ padding: '16px' }}>
            <form onSubmit={onRightSearchSubmit} style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-muted)', padding: '10px 16px', borderRadius: '100px', border: '1px solid var(--border-default)' }}>
              <input 
                type="text" 
                placeholder="Search memories, tags..." 
                value={rightPanelSearch}
                onChange={(e) => setRightPanelSearch(e.target.value)}
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: '13px' }}
              />
              <button type="submit" style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <Search size={16} />
              </button>
            </form>
          </div>

          {/* Profile Card summary */}
          <div className="clean-widget" style={{ background: 'var(--obsidian)', color: 'white' }}>
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '20px' }}>
              <div className="avatar-sq" style={{ width: '48px', height: '48px', border: '2px solid rgba(255,255,255,0.2)' }}>
                <img 
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80" 
                  alt="Aditya Verma" 
                />
              </div>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: '800' }}>Aditya Verma</h3>
                <p style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Lovely Professional University</p>
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '14px' }}>
              <div>
                <span style={{ display: 'block', fontSize: '15px', fontWeight: '800' }}>24</span>
                <span style={{ display: 'block', fontSize: '9px', color: 'var(--text-dim)' }}>Albums</span>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '15px', fontWeight: '800' }}>482</span>
                <span style={{ display: 'block', fontSize: '9px', color: 'var(--text-dim)' }}>Posts</span>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '15px', fontWeight: '800' }}>320</span>
                <span style={{ display: 'block', fontSize: '9px', color: 'var(--text-dim)' }}>Friends</span>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '15px', fontWeight: '800' }}>1.2k</span>
                <span style={{ display: 'block', fontSize: '9px', color: 'var(--text-dim)' }}>Followers</span>
              </div>
            </div>
          </div>

          {/* Active Friends widget */}
          <div className="clean-widget">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 className="widget-head" style={{ margin: 0 }}>Active Friends</h3>
              <span className="see-all" onClick={() => { window.location.hash = '#/friends'; }}>See all</span>
            </div>
            <div className="friends-list-sm">
              {friends.slice(0, 4).map((friend) => (
                <div 
                  key={friend.id} 
                  className="friend-item-sm"
                  onClick={() => onFriendChatClick(friend)}
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
                  <button className="chat-btn-sm" style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
                    <MessageCircle size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Trending topics widget */}
          <div className="clean-widget">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 className="widget-head" style={{ margin: 0 }}>Trending Topics</h3>
              <span className="see-all" onClick={() => { window.location.hash = '#/explore'; }}>See all</span>
            </div>
            <div className="trending-list">
              <div className="trend-row" onClick={() => onTrendingClick('#Holi2K24')} style={{ cursor: 'pointer' }}>
                <span style={{ fontWeight: '700', fontSize: '14px', color: 'var(--primary)' }}>#Holi2K24</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>1,840 Stories Shared</span>
              </div>
              <div className="trend-row" onClick={() => onTrendingClick('#CollegeVibes')} style={{ cursor: 'pointer' }}>
                <span style={{ fontWeight: '700', fontSize: '14px', color: 'var(--obsidian)' }}>#CollegeVibes</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>12.5k Memories</span>
              </div>
              <div className="trend-row" onClick={() => onTrendingClick('#TechFest2024')} style={{ cursor: 'pointer' }}>
                <span style={{ fontWeight: '700', fontSize: '14px', color: 'var(--obsidian)' }}>#TechFest2024</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>968 Verified Posts</span>
              </div>
            </div>
          </div>

          {/* Suggested Albums widget */}
          <div className="clean-widget">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 className="widget-head" style={{ margin: 0 }}>Suggested Albums</h3>
              <span className="see-all" onClick={() => { window.location.hash = '#/albums'; }}>See all</span>
            </div>
            
            {albums.filter(a => !a.isJoined).slice(0, 1).map(album => (
              <div key={album.id} className="suggested-album-card" style={{ display: 'flex', gap: '12px', alignItems: 'center', background: 'var(--bg-subtle)', padding: '10px', borderRadius: '12px' }}>
                <img src={album.cover || '/assets/lake_view.png'} alt="Suggested Album" className="suggested-cover" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                <div className="suggested-info" style={{ flex: 1 }}>
                  <div className="suggested-title" style={{ fontSize: '13px', fontWeight: '700' }}>{album.title}</div>
                  <div className="suggested-subtitle" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{album.contributors?.length || 18} contributors</div>
                </div>
                <button 
                  className="btn-solid"
                  onClick={() => onJoinSuggestedAlbum(album.id)}
                  style={{ padding: '6px 14px', fontSize: '11px' }}
                >
                  Join
                </button>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
