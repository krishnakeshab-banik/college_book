import React from 'react';
import { 
  Heart, 
  MessageCircle, 
  Bookmark, 
  MapPin, 
  Calendar, 
  Image as ImageIcon,
  Star,
  Play,
  SlidersHorizontal,
  LayoutGrid
} from 'lucide-react';

export default function MainFeed({
  stories,
  featuredMemory,
  moments,
  onStoryClick,
  onAddStoryClick,
  onLikeFeatured,
  onViewFeaturedAlbum,
  onLikeMoment,
  onBookmarkMoment
}) {
  return (
    <div className="main-content">
      {/* Stories Section */}
      <section className="stories-container">
        {stories.map((story) => {
          if (story.isAdd) {
            return (
              <div key={story.id} className="story-card-wrapper" onClick={onAddStoryClick}>
                <div className="story-ring-outer add-story-ring">
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--primary)' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: 'light', lineHeight: 1 }}>+</span>
                  </div>
                </div>
                <span className="story-label">{story.name}</span>
              </div>
            );
          }
          return (
            <div key={story.id} className="story-card-wrapper" onClick={() => onStoryClick(story)}>
              <div 
                className="story-ring-outer" 
                style={{ background: story.glow || 'var(--border-glass-light)' }}
              >
                <div className="story-ring-inner">
                  <img src={story.avatar} alt={story.name} className="story-avatar-img" />
                </div>
              </div>
              <span className="story-label">{story.name}</span>
            </div>
          );
        })}
      </section>

      {/* Featured Album Section */}
      <section 
        className="featured-memory-card glass"
        style={{ cursor: 'pointer' }}
        onClick={onViewFeaturedAlbum}
      >
        <img 
          src={featuredMemory.image} 
          alt={featuredMemory.title} 
          className="featured-img-bg" 
        />
        <div className="featured-overlay"></div>
        
        <div className="featured-content">
          <span className="featured-tag">
            <Star size={14} className="featured-star" />
            <span>{featuredMemory.subtitle}</span>
          </span>
          
          <h1 className="featured-title">{featuredMemory.title}</h1>
          
          <div className="featured-meta">
            <span className="meta-item">
              <MapPin size={14} />
              <span>{featuredMemory.location}</span>
            </span>
            <span className="meta-item">
              <Calendar size={14} />
              <span>{featuredMemory.dates}</span>
            </span>
            <span className="meta-item">
              <ImageIcon size={14} />
              <span>{featuredMemory.memoryCount} Memories</span>
            </span>
          </div>

          <div className="featured-footer" onClick={(e) => e.stopPropagation()}>
            <div className="contributor-group">
              {featuredMemory.contributors.map((contrib, idx) => (
                <img 
                  key={idx} 
                  src={contrib.avatar} 
                  alt={contrib.name} 
                  title={contrib.name} 
                  className="contrib-avatar" 
                />
              ))}
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginLeft: '16px' }}>
                Rohan, Ananya + 15 others
              </span>
            </div>

            <div className="featured-actions">
              <button 
                className={`featured-like-btn ${featuredMemory.hasLiked ? 'liked' : ''}`}
                onClick={onLikeFeatured}
              >
                <Heart size={20} fill={featuredMemory.hasLiked ? 'currentColor' : 'none'} />
              </button>
              
              <button className="view-album-btn" onClick={onViewFeaturedAlbum}>
                <span>View Album</span>
                <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Moments Section */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="moments-header">
          <h2 className="section-title">
            <span>✨</span>
            <span>Moments from your network</span>
          </h2>
          
          <div className="moments-controls">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <SlidersHorizontal size={14} />
              <span>Sort by:</span>
              <select className="sort-dropdown">
                <option>Recent</option>
                <option>Most Liked</option>
              </select>
            </div>
            <LayoutGrid size={16} style={{ cursor: 'pointer', color: 'var(--text-main)' }} />
          </div>
        </div>

        <div className="layout-grid">
          {moments.map((moment) => (
            <article key={moment.id} className="moment-card glass glass-hover">
              <div className="moment-header">
                <img 
                  src={moment.user.avatar} 
                  alt={moment.user.name} 
                  className="moment-user-avatar" 
                />
                <div>
                  <div className="moment-user-name">{moment.user.name}</div>
                  <div className="moment-user-univ">{moment.user.university}</div>
                </div>
                <span className="moment-time">{moment.timestamp}</span>
              </div>

              <div className="moment-img-container">
                <img src={moment.image} alt="Memory" className="moment-img" />
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

              <p className="moment-caption">{moment.description}</p>

              <div className="moment-actions">
                <button 
                  className={`moment-action-btn ${moment.hasLiked ? 'liked' : ''}`}
                  onClick={() => onLikeMoment(moment.id)}
                >
                  <Heart size={16} fill={moment.hasLiked ? 'currentColor' : 'none'} />
                  <span>{moment.likes}</span>
                </button>

                <button className="moment-action-btn">
                  <MessageCircle size={16} />
                  <span>{moment.commentsCount}</span>
                </button>

                <button 
                  className={`moment-action-btn ${moment.hasBookmarked ? 'bookmarked' : ''}`}
                  onClick={() => onBookmarkMoment(moment.id)}
                  style={{ marginLeft: 'auto' }}
                >
                  <Bookmark size={16} fill={moment.hasBookmarked ? 'currentColor' : 'none'} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
