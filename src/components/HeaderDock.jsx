import React from 'react';
import { Sparkles } from 'lucide-react';

export default function HeaderDock({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'home', label: 'Chronicle Feed' },
    { id: 'albums', label: 'Collab Albums' },
    { id: 'friends', label: 'Find a Friend' },
    { id: 'memories', label: 'Yearbook Timeline' },
    { id: 'messages', label: 'Messages' },
    { id: 'explore', label: 'Explore' }
  ];

  return (
    <div className="header-dock-container">
      <header className="header-dock">
        <div className="brand-pill">
          <div className="brand-icon">
            <Sparkles size={14} fill="white" />
          </div>
          <span className="brand-name">College Book</span>
        </div>

        <nav className="nav-pills">
          {navItems.map((item) => (
            <div 
              key={item.id}
              className={`nav-pill ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              {item.label}
            </div>
          ))}
        </nav>

        <div className="user-badge-pill" onClick={() => setActiveTab('profile')}>
          <div className="user-avatar">AV</div>
          <span className="user-label">Aditya V.</span>
        </div>
      </header>
    </div>
  );
}
