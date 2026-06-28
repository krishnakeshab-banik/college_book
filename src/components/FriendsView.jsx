import React, { useState } from 'react';
import { Search, MessageSquare, Heart, Award, Sparkles } from 'lucide-react';

export default function FriendsView({ friends, onFriendChatClick }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [matchIdx, setMatchIdx] = useState(0);
  const [showMatchToast, setShowMatchToast] = useState(false);

  const filteredFriends = friends.filter(friend => 
    friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.university.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Hardcoded discovery classmates list for the matchmaker
  const discoveryPeers = [
    {
      name: 'Vikram Kashyap, 21',
      avatar: '👨‍💻',
      major: 'B.Tech CSE Core • Kattankulathur',
      bio: 'Looking for competitive coding teammates for the Milan Hackathon! Let\'s build something cool.',
      instagram: '@vikram_codes',
      snapchat: 'vikram.k'
    },
    {
      name: 'Priya Patel, 20',
      avatar: '💃',
      major: 'B.Tech Biotech • Vadodara',
      bio: 'Milan Cultural Lead. Interested in classical music and fusion dance. Let\'s collaborate!',
      instagram: '@priya_srm26',
      snapchat: 'priya.dance'
    },
    {
      name: 'Rohan Sharma, 22',
      avatar: '🎸',
      major: 'B.Arch • Ramapuram',
      bio: 'Lead guitarist of the campus band. Looking for singers or bassists for a gig.',
      instagram: '@rohan_acoustic',
      snapchat: 'rohan.strums'
    }
  ];

  const currentPeer = discoveryPeers[matchIdx % discoveryPeers.length];

  const handleMutualLike = () => {
    setShowMatchToast(true);
  };

  const handleNextMatch = () => {
    setMatchIdx(prev => prev + 1);
    setShowMatchToast(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      
      {/* 1. PEER DISCOVER MATCHMAKER CARD */}
      <section style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
          <span style={{ fontSize: '11px', fontWeight: '850', color: 'var(--primary)', letterSpacing: '1px', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Sparkles size={12} fill="currentColor" /> Confidential Matchmaker
          </span>
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--obsidian)' }}>Discover New Peer Matches</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Interest matching unlocked strictly upon mutual interest endorsement</p>
        </div>

        <div className="match-card-clean">
          <div style={{ height: '240px', borderRadius: '16px', background: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)', display: 'flex', alignItems: 'center', justifyOrigin: 'center', justifyContent: 'center', fontSize: '80px', marginBottom: '20px', userSelect: 'none' }}>
            {currentPeer.avatar}
          </div>
          
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--obsidian)' }}>{currentPeer.name}</h2>
          
          <span style={{ display: 'inline-block', fontSize: '12px', fontWeight: '700', color: 'var(--primary)', background: '#eff6ff', padding: '4px 12px', borderRadius: '100px', margin: '8px 0 12px 0' }}>
            {currentPeer.major}
          </span>
          
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.5', margin: '0 0 20px 0', minHeight: '44px' }}>
            {currentPeer.bio}
          </p>
          
          {showMatchToast ? (
            <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '12px', borderRadius: '14px', fontSize: '12px', color: '#065f46', marginBottom: '20px', textAlign: 'left', animation: 'fadeSerene 0.3s ease' }}>
              <div style={{ fontWeight: '800', marginBottom: '2px' }}>🎉 Mutual Like Established!</div>
              <div>Socials unlocked: <strong>Instagram:</strong> {currentPeer.instagram} | <strong>Snapchat:</strong> {currentPeer.snapchat}</div>
            </div>
          ) : (
            <div style={{ background: 'var(--bg-subtle)', padding: '10px', borderRadius: '10px', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '20px' }}>
              🔒 Social handles unlocked strictly upon mutual interest endorsement
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-minimal" style={{ flex: 1, justifyContent: 'center' }} onClick={handleNextMatch}>
              {showMatchToast ? 'Next Peer' : 'Pass'}
            </button>
            {!showMatchToast && (
              <button className="btn-solid" style={{ flex: 1, justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '6px' }} onClick={handleMutualLike}>
                <Heart size={14} fill="white" />
                <span>Mutual Like ♥</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 2. CLASSMATE DIRECTORY */}
      <section style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--obsidian)' }}>Classmate Directory</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>Your active network and verified classmates</p>
          </div>
          
          <div className="search-container" style={{ maxWidth: '300px', display: 'flex', alignItems: 'center', background: 'var(--bg-muted)', padding: '8px 16px', borderRadius: '100px', border: '1px solid var(--border-default)' }}>
            <input 
              type="text" 
              placeholder="Search directory..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: '13px' }}
            />
            <Search size={16} style={{ color: 'var(--text-muted)' }} />
          </div>
        </div>

        <div className="friends-grid">
          {filteredFriends.map((friend) => (
            <div key={friend.id} className="friend-card glass glass-hover" style={{ background: 'white', border: '1px solid var(--border-subtle)', padding: '20px', borderRadius: '20px', display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div className="friend-avatar-container" style={{ position: 'relative' }}>
                <img src={friend.avatar} alt={friend.name} className="friend-card-avatar" style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
                <span className={`status-indicator ${friend.status === 'call' ? 'call' : friend.status === 'online' ? 'online' : 'offline'}`} style={{ position: 'absolute', bottom: 0, right: 0, width: '10px', height: '10px', borderRadius: '50%', border: '2px solid white' }}></span>
              </div>
              
              <div className="friend-card-info" style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 className="friend-card-name" style={{ fontSize: '15px', fontWeight: '700', color: 'var(--obsidian)' }}>{friend.name}</h3>
                    <div className="friend-card-univ" style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{friend.university}</div>
                  </div>
                  
                  <button 
                    className="btn-minimal" 
                    style={{ padding: '6px', borderRadius: '50%' }}
                    onClick={() => onFriendChatClick(friend)}
                    title={`Chat with ${friend.name}`}
                  >
                    <MessageSquare size={14} />
                  </button>
                </div>

                <div className="friend-milestone" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--primary)', marginTop: '8px', fontWeight: '600' }}>
                  <Award size={12} />
                  <span>{friend.sharedCount} Shared Memories</span>
                </div>
              </div>
            </div>
          ))}

          {filteredFriends.length === 0 && (
            <div style={{ gridColumn: 'span 2', textAlign: 'center', padding: '32px', color: 'var(--text-muted)', fontSize: '14px' }}>
              No classmates found matching your search.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
