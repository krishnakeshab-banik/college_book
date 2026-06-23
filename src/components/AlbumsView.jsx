import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Calendar, 
  Users, 
  ArrowLeft, 
  UploadCloud, 
  Check, 
  MessageSquare,
  Plus
} from 'lucide-react';
import { formatTime } from '../utils/time';

export default function AlbumsView({ 
  albums, 
  setAlbums, 
  onAlbumClick, 
  selectedAlbum, 
  setSelectedAlbum 
}) {
  const [filter, setFilter] = useState('All');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newPhotoCaption, setNewPhotoCaption] = useState('');
  const [newPhotoBase64, setNewPhotoBase64] = useState('');
  const [commentText, setCommentText] = useState('');
  const [albumComments, setAlbumComments] = useState(() => {
    const saved = localStorage.getItem('college_book_album_comments');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    const initialAlbumComments = {
      'goa-trip-2k24': [
        { user: 'Rohan Verma', text: 'Literally the best 5 days of my life! Let us repeat this next year.', time: '2d ago' },
        { user: 'Ananya Iyer', text: 'The sunset at Vagator beach was magical. Thanks for capturing this, Aditya!', time: '1d ago' }
      ],
      'campus-fest-2024': [
        { user: 'Diya Sharma', text: 'OMG, who took that video of Rohan dancing on stage? Post it here please! 😂', time: '1d ago' },
        { user: 'Karthik Iyer', text: 'The organizing team did a stellar job this year.', time: '10h ago' }
      ]
    };
    localStorage.setItem('college_book_album_comments', JSON.stringify(initialAlbumComments));
    return initialAlbumComments;
  });

  useEffect(() => {
    localStorage.setItem('college_book_album_comments', JSON.stringify(albumComments));
  }, [albumComments]);

  const categories = ['All', 'Trips', 'Festivals', 'Hostel'];

  const filteredAlbums = filter === 'All' 
    ? albums 
    : albums.filter(album => album.category === filter);

  const handleJoinAlbum = (albumId, e) => {
    e.stopPropagation();
    setAlbums(prev => prev.map(album => {
      if (album.id === albumId) {
        return {
          ...album,
          isJoined: true,
          contributorCount: album.contributorCount + 1,
          contributors: [
            ...album.contributors,
            { name: 'Aditya Verma', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=80&q=80' }
          ]
        };
      }
      return album;
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setNewPhotoBase64(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSimulatedUpload = (e) => {
    e.preventDefault();
    if (!newPhotoCaption || !newPhotoBase64) return;

    const newMediaItem = {
      url: newPhotoBase64,
      caption: newPhotoCaption,
      addedBy: 'Aditya Verma'
    };

    setAlbums(prev => prev.map(a => {
      if (a.id === selectedAlbum.id) {
        const updatedAlbum = {
          ...a,
          media: [...a.media, newMediaItem]
        };
        // Update currently opened album details too
        setSelectedAlbum(updatedAlbum);
        return updatedAlbum;
      }
      return a;
    }));

    // Reset upload form
    setNewPhotoCaption('');
    setNewPhotoBase64('');
    setShowUploadModal(false);
  };

  const handlePostComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = {
      user: 'Aditya Verma',
      text: commentText,
      time: new Date().toISOString()
    };

    const albumId = selectedAlbum.id;
    setAlbumComments(prev => ({
      ...prev,
      [albumId]: [...(prev[albumId] || []), newComment]
    }));

    setCommentText('');
  };

  // 1. ALBUM DETAILS VIEW
  if (selectedAlbum) {
    const commentsList = albumComments[selectedAlbum.id] || [];

    return (
      <div className="album-details-container">
        <button className="back-btn" onClick={() => setSelectedAlbum(null)}>
          <ArrowLeft size={16} />
          <span>Back to Albums</span>
        </button>

        <header className="album-details-header glass">
          <img 
            src={selectedAlbum.coverImage} 
            alt={selectedAlbum.title} 
            className="album-details-cover" 
          />
          <div className="album-details-info">
            <h1 className="album-details-title">{selectedAlbum.title}</h1>
            <p className="album-details-desc">{selectedAlbum.description}</p>
            
            <div className="featured-meta" style={{ marginBottom: '16px' }}>
              <span className="meta-item">
                <MapPin size={14} />
                <span>{selectedAlbum.location}</span>
              </span>
              <span className="meta-item">
                <Calendar size={14} />
                <span>{selectedAlbum.dates}</span>
              </span>
              <span className="meta-item">
                <Users size={14} />
                <span>{selectedAlbum.contributorCount} Contributors</span>
              </span>
            </div>

            <div className="contributor-group">
              {selectedAlbum.contributors.map((contrib, idx) => (
                <img 
                  key={idx} 
                  src={contrib.avatar} 
                  alt={contrib.name} 
                  title={contrib.name} 
                  className="contrib-avatar" 
                />
              ))}
            </div>
          </div>
        </header>

        {/* Media Gallery Section */}
        <section className="media-gallery-section">
          <h2 className="section-title">Shared Memory Gallery</h2>
          
          <div className="gallery-grid">
            {selectedAlbum.isJoined && (
              <div className="upload-card-btn" onClick={() => setShowUploadModal(true)}>
                <UploadCloud size={32} className="upload-icon" />
                <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Add Memory Photo</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Drag or click to upload</span>
              </div>
            )}

            {selectedAlbum.media.map((item, idx) => (
              <div key={idx} className="gallery-card glass">
                <img src={item.url} alt={item.caption} className="gallery-img" />
                <div className="gallery-card-overlay">
                  <div className="gallery-card-caption">{item.caption}</div>
                  <div className="gallery-card-author">Added by {item.addedBy}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Conversation Stream Section */}
        <section className="media-gallery-section" style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '24px' }}>
          <h2 className="section-title">
            <MessageSquare size={18} />
            <span>Album Discussion & Stories</span>
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '640px', marginTop: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {commentsList.map((c, i) => (
                <div key={i} className="glass" style={{ padding: '12px 16px', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: '700' }}>{c.user}</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{formatTime(c.time)}</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{c.text}</p>
                </div>
              ))}
            </div>

            {selectedAlbum.isJoined && (
              <form onSubmit={handlePostComment} style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <input 
                  type="text" 
                  className="chat-input"
                  placeholder="Share a story or comment about this album..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <button type="submit" className="join-btn" style={{ borderRadius: '12px', padding: '0 20px' }}>
                  Post
                </button>
              </form>
            )}
          </div>
        </section>

        {/* Upload Modal (Simulated) */}
        {showUploadModal && (
          <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
            <div className="modal-content glass" onClick={(e) => e.stopPropagation()}>
              <h2 className="modal-title">Share a New Memory</h2>
              <form onSubmit={handleSimulatedUpload}>
                <div className="form-group">
                  <label className="form-label">Caption / Story</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Describe this memory..."
                    value={newPhotoCaption}
                    onChange={(e) => setNewPhotoCaption(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Select Photo</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    className="form-input" 
                    onChange={handleFileChange}
                    required
                  />
                </div>
                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowUploadModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-submit">
                    Post Memory
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 2. ALBUMS LIST VIEW
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="section-title" style={{ fontSize: '1.6rem' }}>Collaborative Albums</h1>
      </div>

      {/* Album Filters */}
      <div className="album-filter-container">
        {categories.map((cat) => (
          <button 
            key={cat} 
            className={`filter-chip ${filter === cat ? 'active' : ''}`}
            onClick={() => setFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Albums Grid */}
      <div className="albums-grid">
        {filteredAlbums.map((album) => (
          <div 
            key={album.id} 
            className="album-card glass glass-hover"
            onClick={() => onAlbumClick(album)}
          >
            <div className="album-cover-container">
              <img 
                src={album.coverImage} 
                alt={album.title} 
                className="album-cover-img" 
              />
              <span className="album-category-badge">{album.category}</span>
            </div>

            <div className="album-card-body">
              <h3 className="album-card-title">{album.title}</h3>
              <p className="album-card-desc">{album.description}</p>
              
              <div className="album-card-footer">
                <span className="album-members-text">
                  {album.contributorCount} Contributors
                </span>

                {album.isJoined ? (
                  <span className="joined-label-outline">
                    <Check size={14} />
                    <span>Collaborating</span>
                  </span>
                ) : (
                  <button 
                    className="join-album-btn-outline"
                    onClick={(e) => handleJoinAlbum(album.id, e)}
                  >
                    Join Album
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
