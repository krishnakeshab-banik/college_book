import React, { useState } from 'react';
import { X, Image as ImageIcon, Sparkles } from 'lucide-react';

export default function AddStoryModal({ onClose, onAddStory }) {
  const [caption, setCaption] = useState('');
  const [imageSrc, setImageSrc] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setImageSrc(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!imageSrc) {
      alert('Please select an image for your story!');
      return;
    }
    onAddStory(imageSrc, caption.trim());
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <Sparkles size={20} style={{ color: 'var(--accent)' }} />
          <span>Add to Your Story</span>
        </h3>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Image Upload Area */}
          <div className="form-group">
            <label className="form-label">Upload Story Photo</label>
            {!imageSrc ? (
              <label className="upload-card-btn" style={{ height: '240px', margin: 0 }}>
                <input 
                  type="file" 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                  onChange={handleImageChange} 
                />
                <ImageIcon size={32} className="upload-icon" />
                <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Choose Photo</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>Supports JPG, PNG</span>
              </label>
            ) : (
              <div className="story-upload-preview-container" style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', height: '240px' }}>
                <img 
                  src={imageSrc} 
                  alt="Story preview" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
                <button 
                  type="button" 
                  className="modal-close-btn" 
                  style={{ top: '10px', right: '10px', background: 'rgba(15, 23, 42, 0.6)', color: 'white', border: 'none' }}
                  onClick={() => setImageSrc('')}
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Caption Input */}
          <div className="form-group">
            <label className="form-label" htmlFor="story-caption">Caption (Optional)</label>
            <input
              id="story-caption"
              type="text"
              className="form-input"
              placeholder="Share what is happening..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              maxLength={120}
            />
          </div>

          {/* Actions */}
          <div className="form-actions" style={{ marginTop: '8px' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              Share Story
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
