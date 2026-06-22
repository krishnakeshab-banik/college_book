import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function CreateAlbumModal({ friends, onClose, onCreateAlbum }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Trips');
  const [location, setLocation] = useState('');
  const [dates, setDates] = useState('');
  const [selectedCollabIds, setSelectedCollabIds] = useState([]);

  const handleToggleCollab = (friendId) => {
    setSelectedCollabIds(prev => 
      prev.includes(friendId)
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !description) return;

    // Pick a default cover image based on category
    let coverImage = '/assets/lake_view.png';
    if (category === 'Trips') coverImage = '/assets/goa_trip.png';
    else if (category === 'Festivals') coverImage = '/assets/campus_fest.png';
    else if (category === 'Hostel') coverImage = '/assets/hostel_life.png';

    // Get selected friends details
    const selectedContributors = friends.filter(f => selectedCollabIds.includes(f.id));
    // Always include user
    selectedContributors.unshift({
      name: 'Aditya Verma',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=80&q=80'
    });

    const newAlbum = {
      id: `album-${Date.now()}`,
      title,
      description,
      category,
      location: location || 'Campus',
      dates: dates || 'Ongoing',
      coverImage,
      contributorCount: selectedContributors.length,
      isJoined: true,
      contributors: selectedContributors,
      media: [
        {
          url: coverImage,
          caption: 'Album created! Initial photo added.',
          addedBy: 'Aditya Verma'
        }
      ]
    };

    onCreateAlbum(newAlbum);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={16} />
        </button>

        <h2 className="modal-title">Create Collaborative Album</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Album Title</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Spiti Valley Road Trip"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea 
              className="form-input" 
              style={{ minHeight: '60px', resize: 'vertical' }}
              placeholder="What are these memories about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select 
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Trips">Trips</option>
                <option value="Festivals">Festivals</option>
                <option value="Hostel">Hostel</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Location</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. Goa, India"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Dates</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. May 10 – May 15, 2024"
              value={dates}
              onChange={(e) => setDates(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Invite Collaborators (Classmates)</label>
            <div className="collaborators-select-grid">
              {friends.map((friend) => (
                <div 
                  key={friend.id}
                  className={`collab-select-item ${selectedCollabIds.includes(friend.id) ? 'selected' : ''}`}
                  onClick={() => handleToggleCollab(friend.id)}
                >
                  <img 
                    src={friend.avatar} 
                    alt={friend.name} 
                    style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }} 
                  />
                  <span style={{ fontSize: '0.78rem', fontWeight: '500' }}>
                    {friend.name.split(' ')[0]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              Create & Invite
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
