import React, { useState } from 'react';
import { Search, MessageSquare, Award, X, User, MapPin, GraduationCap } from 'lucide-react';

export default function FriendsView({ friends, onFriendChatClick }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFriend, setSelectedFriend] = useState(null);

  // Updated filter to search by the new campus and batch fields
  const filteredFriends = friends.filter(friend => {
    const campus = friend.campus || 'SRM-Ktr';
    const batch = friend.batch ? friend.batch.toString() : '2027';
    
    return friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           campus.toLowerCase().includes(searchQuery.toLowerCase()) ||
           batch.includes(searchQuery);
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative' }}>
      <div>
        <h1 className="section-title" style={{ fontSize: '1.6rem', marginBottom: '8px' }}>
          <span>👥</span>
          <span> Classmate Directory</span>
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Discover peers, find study partners, and keep track of your shared campus milestones.
        </p>
      </div>

      {/* Friends Search */}
      <div className="search-container" style={{ maxWidth: '400px' }}>
        <input 
          type="text" 
          className="search-input" 
          placeholder="Search by name, campus (SRM-Ktr), or batch..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Search className="search-icon" size={18} />
      </div>

      {/* Friends Grid */}
      <div className="friends-grid">
        {filteredFriends.map((friend) => (
          <div 
            key={friend.id} 
            className="friend-card glass glass-hover" 
            style={{ cursor: 'pointer' }}
            onClick={() => setSelectedFriend(friend)} 
          >
            <div className="friend-avatar-container">
              <img src={friend.avatar} alt={friend.name} className="friend-card-avatar" />
              <span className={`status-indicator ${friend.status === 'call' ? 'call' : friend.status === 'online' ? 'online' : 'offline'}`}></span>
            </div>
            
            <div className="friend-card-info">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 className="friend-card-name">{friend.name}</h3>
                  {/* Updated to show Campus and Batch side-by-side */}
                  <div className="friend-card-univ" style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    <span>{friend.campus || 'SRM-Ktr'}</span>
                    <span>•</span>
                    <span>Batch '{friend.batch ? friend.batch.toString().slice(-2) : '27'}</span>
                  </div>
                </div>
                
                <button 
                  className="friend-action-chat-btn" 
                  onClick={(e) => {
                    e.stopPropagation(); 
                    onFriendChatClick(friend);
                  }}
                  title={`Chat with ${friend.name}`}
                >
                  <MessageSquare size={16} />
                </button>
              </div>

              <p className="friend-card-bio" style={{ marginTop: '8px' }}>{friend.bio}</p>
              
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
            No classmates found matching your search.
          </div>
        )}
      </div>

      {/* Classmate Profile Modal (High Contrast + Campus/Batch) */}
      {selectedFriend && (
        <div 
          className="modal-overlay" 
          style={{ 
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
            backgroundColor: 'rgba(0, 0, 0, 0.75)', 
            backdropFilter: 'blur(8px)',
            display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 
          }}
          onClick={() => setSelectedFriend(null)}
        >
          <div 
            className="modal-content glass" 
            style={{ 
              width: '90%', maxWidth: '400px', padding: '32px', 
              borderRadius: '24px', position: 'relative', textAlign: 'center',
              backgroundColor: '#1e1e24', 
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              onClick={() => setSelectedFriend(null)}
            >
              <X size={24} />
            </button>

            <img 
              src={selectedFriend.avatar} 
              alt={selectedFriend.name} 
              style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 16px', border: '4px solid var(--primary)' }} 
            />
            
            <h2 style={{ margin: '0 0 8px 0', fontSize: '1.8rem', color: '#ffffff', fontWeight: '700' }}>
              {selectedFriend.name}
            </h2>
            
            {/* Replaced university with MapPin (Campus) and GraduationCap (Batch) */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', color: '#cbd5e1', marginBottom: '16px', fontSize: '0.95rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={16} />
                <span>{selectedFriend.campus || 'SRM-Ktr'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <GraduationCap size={16} />
                <span>Batch of {selectedFriend.batch || '2027'}</span>
              </div>
            </div>

            <p style={{ color: '#94a3b8', lineHeight: '1.6', marginBottom: '24px', fontSize: '0.95rem' }}>
              {selectedFriend.bio}
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
               <button 
                  style={{ padding: '10px 24px', borderRadius: '12px', border: 'none', backgroundColor: 'var(--primary)', color: '#ffffff', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                  onClick={() => {
                    setSelectedFriend(null);
                    onFriendChatClick(selectedFriend);
                  }}
                >
                  <MessageSquare size={18} />
                  Message
               </button>
               <button 
                  style={{ padding: '10px 24px', borderRadius: '12px', border: '1px solid var(--primary)', backgroundColor: 'transparent', color: 'var(--primary)', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <User size={18} />
                  View Full Profile
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}