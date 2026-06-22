import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare } from 'lucide-react';

export default function MessagesView({ 
  friends, 
  activeChatFriend, 
  setActiveChatFriend, 
  messages, 
  setMessages 
}) {
  const [inputText, setInputText] = useState('');
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
    <div className="messages-container glass">
      {/* Conversations List Sidebar */}
      <div className="conversations-sidebar">
        <div className="convos-header">Conversations</div>
        <div className="conversations-list">
          {friends.map((friend) => {
            const thread = messages[friend.id] || [];
            const lastMsg = thread[thread.length - 1]?.text || friend.bio;
            const lastTime = thread[thread.length - 1]?.time || 'Joined';

            return (
              <div 
                key={friend.id}
                className={`convo-item ${activeChatFriend?.id === friend.id ? 'active' : ''}`}
                onClick={() => setActiveChatFriend(friend)}
              >
                <div className="friend-avatar-container">
                  <img src={friend.avatar} alt={friend.name} className="friend-avatar-sm" />
                  <span className={`status-indicator ${friend.status === 'call' ? 'call' : friend.status === 'online' ? 'online' : 'offline'}`}></span>
                </div>

                <div className="convo-details">
                  <div className="convo-name">
                    <span>{friend.name}</span>
                    <span className="convo-time">{lastTime}</span>
                  </div>
                  <div className="convo-last-msg">{lastMsg}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Chat Area */}
      {activeChatFriend ? (
        <div className="active-chat-area">
          <header className="chat-header">
            <img src={activeChatFriend.avatar} alt={activeChatFriend.name} className="chat-header-avatar" />
            <div>
              <div className="chat-header-name">{activeChatFriend.name}</div>
              <div className="chat-header-status">
                {typingFriend === activeChatFriend.id ? 'typing...' : activeChatFriend.statusText}
              </div>
            </div>
          </header>

          <div className="chat-messages">
            {activeThread.map((msg, idx) => (
              <div key={idx} className={`msg-bubble ${msg.sender}`}>
                <div>{msg.text}</div>
                <div className="msg-time">{msg.time}</div>
              </div>
            ))}
            
            {typingFriend === activeChatFriend.id && (
              <div className="msg-bubble them" style={{ display: 'flex', gap: '4px', padding: '10px 14px' }}>
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

          <form onSubmit={handleSendMessage} className="chat-input-area">
            <input 
              type="text" 
              className="chat-input" 
              placeholder={`Message ${activeChatFriend.name.split(' ')[0]}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button type="submit" className="chat-send-btn">
              <Send size={18} />
            </button>
          </form>
        </div>
      ) : (
        <div className="no-chat-selected">
          <MessageSquare size={48} style={{ color: 'var(--text-muted)' }} />
          <div>Select a conversation to start messaging</div>
        </div>
      )}
    </div>
  );
}
