import React from 'react';
import { 
  Home, 
  FolderHeart, 
  Compass, 
  CalendarDays, 
  Users2, 
  MessageSquareCode, 
  BellRing, 
  UserCircle,
  PlusCircle,
  Sparkles
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, onCreateAlbumClick, pulseUsers }) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'albums', label: 'Albums', icon: FolderHeart },
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'memories', label: 'Memories', icon: CalendarDays },
    { id: 'friends', label: 'Friends', icon: Users2 },
    { id: 'messages', label: 'Messages', icon: MessageSquareCode, badge: '3' },
    { id: 'notifications', label: 'Notifications', icon: BellRing, badge: '8', badgeColor: 'pink' },
    { id: 'profile', label: 'Profile', icon: UserCircle }
  ];

  return (
    <aside className="sidebar glass">
      <div className="logo-container">
        <Sparkles className="logo-icon" size={24} />
        <span className="logo-text">CollegeBook</span>
      </div>

      <ul className="nav-links">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <li 
              key={item.id} 
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon size={20} />
              <span>{item.label}</span>
              {item.badge && (
                <span className={`nav-badge ${item.badgeColor === 'pink' ? 'pink' : ''}`}>
                  {item.badge}
                </span>
              )}
            </li>
          );
        })}
      </ul>

      <button className="create-album-btn" onClick={onCreateAlbumClick}>
        <PlusCircle size={18} />
        <span>Create Album</span>
      </button>

      <div className="memory-pulse-panel glass">
        <div className="pulse-header">
          <span className="pulse-dot"></span>
          <span>Memory Pulse</span>
        </div>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
          Live • 48 shares today
        </div>
        <div className="pulse-avatars">
          {pulseUsers.slice(0, 4).map((user, idx) => (
            <img 
              key={idx} 
              src={user.avatar} 
              alt={user.name} 
              className="pulse-avatar" 
            />
          ))}
          <div className="pulse-more">+24</div>
        </div>
      </div>
    </aside>
  );
}
