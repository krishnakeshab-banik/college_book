import React, { useState } from 'react';
import { Search, Heart, MessageCircle } from 'lucide-react';

export default function ExploreView({ initialMoments, albums }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');

  // Extract all media items from collaborative albums to display a rich set of explore memories
  const allExploreMemories = [
    ...initialMoments.map(m => ({
      id: m.id,
      url: m.image,
      caption: m.description,
      likes: m.likes,
      comments: m.commentsCount,
      tags: m.description.match(/#\w+/g) || []
    })),
    ...albums.flatMap(a => a.media.map((med, idx) => ({
      id: `${a.id}-med-${idx}`,
      url: med.url,
      caption: med.caption,
      likes: Math.floor(Math.random() * 150) + 40,
      comments: Math.floor(Math.random() * 15) + 2,
      tags: [`#${a.category}`, '#CampusLife']
    })))
  ];

  const popularTags = ['All', '#Goa2K24', '#CampusVibes', '#HostelDiaries', '#SpitiValley', '#Trips', '#Fest2024'];

  const filteredMemories = allExploreMemories.filter(memory => {
    const matchesSearch = memory.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
      memory.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesTag = selectedTag === 'All' || 
      memory.tags.some(t => t.toLowerCase() === selectedTag.toLowerCase());

    return matchesSearch && matchesTag;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 className="section-title" style={{ fontSize: '1.6rem', marginBottom: '8px' }}>Explore Campus Memories</h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Discover spontaneous hostel moments, travel diaries, festivals, and achievements shared across campus networks.
        </p>
      </div>

      {/* Interactive Search */}
      <div className="search-container" style={{ maxWidth: '480px' }}>
        <input 
          type="text" 
          className="search-input" 
          placeholder="Search captions, tags, albums..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Search className="search-icon" size={18} />
      </div>

      {/* Trending Tags */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Trending Hashtags</span>
        <div className="album-filter-container">
          {popularTags.map(tag => (
            <button 
              key={tag}
              className={`filter-chip ${selectedTag === tag ? 'active' : ''}`}
              onClick={() => setSelectedTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Explore Grid */}
      <div className="explore-grid">
        {filteredMemories.map((memory) => (
          <div key={memory.id} className="explore-card glass">
            <img src={memory.url} alt={memory.caption} className="explore-card-img" />
            <div className="explore-card-overlay">
              <span className="explore-tag">
                {memory.tags[0] || '#CampusLife'}
              </span>
              <p className="explore-title">{memory.caption}</p>
              
              {/* Overlay Hover stats */}
              <div style={{ 
                display: 'flex', 
                gap: '14px', 
                marginTop: '10px', 
                borderTop: '1px solid rgba(255, 255, 255, 0.1)', 
                paddingTop: '8px' 
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem' }}>
                  <Heart size={12} fill="white" />
                  <span>{memory.likes}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem' }}>
                  <MessageCircle size={12} fill="white" />
                  <span>{memory.comments}</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredMemories.length === 0 && (
          <div style={{ 
            gridColumn: 'span 3', 
            textAlign: 'center', 
            padding: '48px', 
            color: 'var(--text-muted)' 
          }}>
            No memories match your search filter. Try another keyword!
          </div>
        )}
      </div>
    </div>
  );
}
