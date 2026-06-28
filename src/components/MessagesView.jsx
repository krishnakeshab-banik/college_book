import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, ChevronLeft, Phone, Video, Info, Search } from 'lucide-react';

export default function MessagesView({ 
  friends, 
  activeChatFriend, 
  setActiveChatFriend, 
  messages, 
  setMessages 
}) {
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [typingFriend, setTypingFriend] = useState(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll messages window
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingFriend]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activeChatFriend) return;

    const currentFriendId = activeChatFriend.id;
    const userMessage = {
      sender: 'me',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Update messages
    setMessages(prev => ({
      ...prev,
      [currentFriendId]: [...(prev[currentFriendId] || []), userMessage]
    }));

    setInputText('');

    // Trigger simulated reply after a short delay
    setTypingFriend(currentFriendId);
    setTimeout(() => {
      // Pick reply from mock array
      const replies = activeChatFriend.replies || ["Hey! I'm in class right now, talk later?"];
      // Randomly pick a reply or pick sequentially
      const randomIndex = Math.floor(Math.random() * replies.length);
      const friendReply = {
        sender: 'them',
        text: replies[randomIndex],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => ({
        ...prev,
        [currentFriendId]: [...(prev[currentFriendId] || []), friendReply]
      }));
      setTypingFriend(null);
    }, 1500);
  };

  const activeThread = activeChatFriend ? (messages[activeChatFriend.id] || []) : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--obsidian)' }}>Campus Lounges</h2>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Real-time messaging with verified classmates</p>
      </div>

      <div className="chat-layout">
        {/* Conversations List Sidebar */}
        <div className="conversations-sidebar" style={{ borderRight: '1px solid var(--border-subtle)', padding: '16px', background: 'var(--bg-subtle)', overflowY: 'auto' }}>
          <div className="convos-header" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            <div style={{ fontWeight: '800', fontSize: '14px', color: 'var(--obsidian)' }}>Conversations</div>
            <div style={{ position: 'relative', width: '100%' }}>
              <input 
                type="text" 
                className="chat-input"
                placeholder="Search classmates..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ fontSize: '0.8rem', padding: '8px 12px 8px 32px', borderRadius: '100px', border: '1px solid var(--border-default)', outline: 'none', width: '100%' }}
              />
              <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>
          
          <div className="conversations-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {friends
              .filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((friend) => {
                const thread = messages[friend.id] || [];
                const lastMsg = thread[thread.length - 1]?.text || friend.bio;
                const lastTime = thread[thread.length - 1]?.time || 'Joined';

                return (
                  <div 
                    key={friend.id}
                    className={`convo-item ${activeChatFriend?.id === friend.id ? 'active' : ''}`}
                    onClick={() => setActiveChatFriend(friend)}
                    style={{ display: 'flex', gap: '10px', padding: '10px', borderRadius: '14px', cursor: 'pointer', background: activeChatFriend?.id === friend.id ? 'white' : 'transparent', boxShadow: activeChatFriend?.id === friend.id ? 'var(--shadow-subtle)' : 'none', border: activeChatFriend?.id === friend.id ? '1px solid var(--border-default)' : '1px solid transparent' }}
                  >
                    <div className="friend-avatar-container" style={{ position: 'relative' }}>
                      <img src={friend.avatar} alt={friend.name} className="friend-avatar-sm" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                      <span className={`status-indicator ${friend.status === 'call' ? 'call' : friend.status === 'online' ? 'online' : 'offline'}`} style={{ position: 'absolute', bottom: 0, right: 0, width: '8px', height: '8px', borderRadius: '50%', border: '1.5px solid white' }}></span>
                    </div>

                    <div className="convo-details" style={{ flex: 1, minWidth: 0 }}>
                      <div className="convo-name" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '750', color: 'var(--obsidian)' }}>
                        <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{friend.name}</span>
                        <span className="convo-time" style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '400' }}>{lastTime}</span>
                      </div>
                      <div className="convo-last-msg" style={{ fontSize: '11px', color: 'var(--text-secondary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', marginTop: '2px' }}>{lastMsg}</div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Active Chat Area */}
        {activeChatFriend ? (
          <div className="active-chat-area" style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'white' }}>
            <header className="chat-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img src={activeChatFriend.avatar} alt={activeChatFriend.name} className="chat-header-avatar" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <div className="chat-header-name" style={{ fontWeight: '800', fontSize: '14px', color: 'var(--obsidian)' }}>{activeChatFriend.name}</div>
                  <div className="chat-header-status" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {typingFriend === activeChatFriend.id ? 'typing...' : activeChatFriend.statusText}
                  </div>
                </div>
              </div>
              
              {/* Header Actions */}
              <div style={{ display: 'flex', gap: '16px', color: 'var(--text-secondary)' }}>
                <button style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: '4px' }} onClick={() => alert(`Starting voice call with ${activeChatFriend.name}...`)}>
                  <Phone size={16} />
                </button>
                <button style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: '4px' }} onClick={() => alert(`Starting video call with ${activeChatFriend.name}...`)}>
                  <Video size={16} />
                </button>
                <button style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: '4px' }} onClick={() => alert(`${activeChatFriend.name} details:\nUniversity: ${activeChatFriend.university}\nBio: ${activeChatFriend.bio}`)}>
                  <Info size={16} />
                </button>
              </div>
            </header>

            <div className="chat-messages" style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ background: '#fef3c7', padding: '12px 16px', borderRadius: '12px', fontSize: '13px', color: '#b45309', marginBottom: '8px' }}>
                🎉 Mutual Match Confirmed! Unlocked Instagram: <strong>{activeChatFriend.instagram || '@classmate'}</strong>
              </div>
              
              {activeThread.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`msg-bubble ${msg.sender}`}
                  style={{ 
                    alignSelf: msg.sender === 'me' ? 'flex-end' : 'flex-start',
                    background: msg.sender === 'me' ? 'var(--obsidian)' : 'var(--bg-muted)',
                    color: msg.sender === 'me' ? 'white' : 'var(--text-main)',
                    padding: '10px 16px',
                    borderRadius: '16px',
                    fontSize: '13px',
                    maxWidth: '70%',
                    position: 'relative'
                  }}
                >
                  <div>{msg.text}</div>
                  <div className="msg-time" style={{ fontSize: '9px', color: msg.sender === 'me' ? 'var(--text-dim)' : 'var(--text-muted)', textAlign: 'right', marginTop: '4px' }}>{msg.time}</div>
                </div>
              ))}
              
              {typingFriend === activeChatFriend.id && (
                <div className="msg-bubble them" style={{ alignSelf: 'flex-start', background: 'var(--bg-muted)', color: 'var(--text-main)', display: 'flex', gap: '4px', padding: '10px 14px', borderRadius: '16px' }}>
                  <span className="typing-dot" style={{ animation: 'bounce 1.4s infinite 0ms', width: '6px', height: '6px', background: 'var(--text-secondary)', borderRadius: '50%' }}></span>
                  <span className="typing-dot" style={{ animation: 'bounce 1.4s infinite 200ms', width: '6px', height: '6px', background: 'var(--text-secondary)', borderRadius: '50%' }}></span>
                  <span className="typing-dot" style={{ animation: 'bounce 1.4s infinite 400ms', width: '6px', height: '6px', background: 'var(--text-secondary)', borderRadius: '50%' }}></span>
                  <style>{`
                    @keyframes bounce {
                      0%, 80%, 100% { transform: translateY(0); }
                      40% { transform: translateY(-4px); }
                    }
                  `}</style>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '10px', padding: '16px 20px', borderTop: '1px solid var(--border-subtle)' }}>
              <input 
                type="text" 
                className="chat-input" 
                placeholder={`Message ${activeChatFriend.name.split(' ')[0]}...`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                style={{ flex: 1, padding: '12px 20px', borderRadius: '100px', border: '1px solid var(--border-default)', outline: 'none', fontSize: '13px' }}
              />
              <button type="submit" className="btn-solid" style={{ borderRadius: '100px', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Send
              </button>
            </form>
          </div>
        ) : (
          <div className="no-chat-selected" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '12px', background: 'white' }}>
            <MessageSquare size={48} style={{ color: 'var(--text-muted)' }} />
            <div style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: '600' }}>Select a conversation to start messaging</div>
          </div>
        )}
      </div>
    </div>
  );
}
