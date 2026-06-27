import React, { useState } from 'react';
import { Search, Heart, MessageCircle } from 'lucide-react';

const MemoryCard = ({ memory }) => (
  <div className="explore-card glass">
    <img src={memory.url} alt={memory.caption} className="explore-card-img" />
    <div className="explore-card-overlay" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'flex-end',
      padding: '20px' 
    }}>
      <span className="explore-tag" style={{ 
        color: '#fff', 
        textShadow: '0px 1px 2px rgba(0,0,0,0.8)',
        fontSize: '0.9rem', 
        fontWeight: '700'
      }}>
        {memory.tags[0] || '#CampusLife'}
      </span>
      
      <div className="stats-container" style={{ 
        display: 'flex', gap: '14px', marginTop: '12px', 
        borderTop: '1px solid rgba(255, 255, 255, 0.2)', paddingTop: '8px',
        color: '#ffffff'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}>
          <Heart size={12} fill="white" />
          <span>{memory.likes}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}>
          <MessageCircle size={12} fill="white" />
          <span>{memory.comments}</span>
        </div>
      </div>
    </div>
  </div>
);

export default function ExploreView({ initialMoments, albums }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');

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

  const popularTags = ['All', '#Milan2K25', '#CampusVibes', '#HostelDiaries', '#ChennaiNights', '#Trips', '#Aaruush2025'];

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
        <h1 className="section-title" style={{ fontSize: '1.6rem', marginBottom: '8px', color: 'var(--primary)' }}>Explore Campus Memories</h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Discover spontaneous hostel moments, travel diaries, festivals, and achievements shared across campus networks.
        </p>
      </div>

      <div className="search-container" style={{ maxWidth: '480px' }}>
        <input 
          type="text" 
          className="search-input" 
          placeholder="Search Milan fest, Tech Park, University Building..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Search className="search-icon" size={18} />
      </div>

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

      <div className="explore-grid">
        {filteredMemories.map((memory) => (
          <MemoryCard key={memory.id} memory={memory} />
        ))}

        {filteredMemories.length === 0 && (
          <div style={{ gridColumn: 'span 3', textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
            No memories match your search filter. Try another keyword!
          </div>
        )}
      </div>
    </div>
  );
}