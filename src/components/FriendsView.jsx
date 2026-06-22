import React, { useState } from 'react';
import { Search, MessageSquare, Heart, Award } from 'lucide-react';

export default function FriendsView({ friends, onFriendChatClick }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFriends = friends.filter(friend => 
    friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.university.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 className="section-title" style={{ fontSize: '1.6rem', marginBottom: '8px' }}>
          <span>👥</span>
          <span>Active Friends & Milestones</span>
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Keep track of your friendships and the shared milestones you've achieved through collaborative albums and trips.
        </p>
      </div>

      {/* Friends Search */}
      <div className="search-container" style={{ maxWidth: '400px' }}>
        <input 
          type="text" 
          className="search-input" 
          placeholder="Search friends or universities..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Search className="search-icon" size={18} />
      </div>

      {/* Friends Grid */}
      <div className="friends-grid">
        {filteredFriends.map((friend) => (
          <div key={friend.id} className="friend-card glass glass-hover">
            <div className="friend-avatar-container">
              <img src={friend.avatar} alt={friend.name} className="friend-card-avatar" />
              <span className={`status-indicator ${friend.status === 'call' ? 'call' : friend.status === 'online' ? 'online' : 'offline'}`}></span>
            </div>
            
            <div className="friend-card-info">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 className="friend-card-name">{friend.name}</h3>
                  <div className="friend-card-univ">{friend.university}</div>
                </div>
                
                <button 
                  className="friend-action-chat-btn" 
                  onClick={() => onFriendChatClick(friend)}
                  title={`Chat with ${friend.name}`}
                >
                  <MessageSquare size={16} />
                </button>
              </div>

              <p className="friend-card-bio">{friend.bio}</p>
              
              <div className="friend-milestone">
                <Award size={14} />
                <span>{friend.sharedCount} Shared Memories</span>
              </div>
            </div>
          </div>
        ))}

        {filteredFriends.length === 0 && (
          <div style={{ 
            gridColumn: 'span 2', 
            textAlign: 'center', 
            padding: '32px', 
            color: 'var(--text-muted)' 
          }}>
            No friends found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
