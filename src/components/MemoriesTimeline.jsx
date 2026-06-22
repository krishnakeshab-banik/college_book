import React, { useState } from 'react';
import { Sparkles, CalendarDays } from 'lucide-react';
import { timelineEvents } from '../MockData';

export default function MemoriesTimeline() {
  const [selectedTag, setSelectedTag] = useState('All');

  const tags = ['All', 'Milestone', 'Hostel', 'Trips', 'Festivals', 'Achievement', 'Farewell'];

  const filteredEvents = selectedTag === 'All'
    ? timelineEvents
    : timelineEvents.filter(ev => ev.tags.includes(selectedTag));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 className="section-title" style={{ fontSize: '1.6rem', marginBottom: '8px' }}>
          <Sparkles size={20} style={{ color: 'var(--primary)' }} />
          <span>My College Journey Timeline</span>
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          A chronological archive of key milestones, achievements, and events from Freshman year to Graduation.
        </p>
      </div>

      {/* Timeline Filter */}
      <div className="album-filter-container">
        {tags.map((t) => (
          <button 
            key={t} 
            className={`filter-chip ${selectedTag === t ? 'active' : ''}`}
            onClick={() => setSelectedTag(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Vertical Timeline */}
      <div className="timeline-container">
        <div className="timeline-line"></div>

        {filteredEvents.map((ev, index) => (
          <div key={ev.id} className="timeline-node">
            <div className="timeline-dot"></div>
            
            <div className="timeline-card-wrapper">
              <div className="timeline-card glass glass-hover">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="timeline-badge">{ev.tags[0]}</span>
                  <span className="timeline-year">{ev.year} • {ev.term}</span>
                </div>
                
                <h3 className="timeline-card-title">{ev.title}</h3>
                <p className="timeline-card-desc">{ev.description}</p>
                
                {ev.image && (
                  <img src={ev.image} alt={ev.title} className="timeline-img" />
                )}
              </div>
            </div>
            
            {/* Empty column balance on desktop */}
            <div className="timeline-card-wrapper" style={{ visibility: 'hidden' }}></div>
          </div>
        ))}

        {filteredEvents.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>
            No timeline milestones match this category.
          </div>
        )}
      </div>
    </div>
  );
}
