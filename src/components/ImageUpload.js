import React, { useState, useRef } from 'react';
import api from '../api';
import toast from 'react-hot-toast';
import './ImageUpload.css';

/**
 * ImageUpload
 * Props:
 *   value      – current image URL string
 *   onChange   – callback(newUrl) called after successful upload or when URL typed
 *   label      – optional label text
 */
const ImageUpload = ({ value, onChange, label = 'Image' }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value || '');
  const [mode, setMode] = useState('upload'); // 'upload' | 'url'
  const fileRef = useRef();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Local preview immediately
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);

    // Upload to server
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const { data } = await api.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setPreview(data.imageUrl);
      onChange(data.imageUrl);
      toast.success('Image uploaded');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
      setPreview(value || '');
    } finally {
      setUploading(false);
    }
  };

  const handleUrlChange = (e) => {
    setPreview(e.target.value);
    onChange(e.target.value);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      // Simulate file input change
      const dt = new DataTransfer();
      dt.items.add(file);
      fileRef.current.files = dt.files;
      handleFileChange({ target: { files: [file] } });
    }
  };

  return (
    <div className="image-upload-wrapper">
      <div className="image-upload-label-row">
        <label>{label}</label>
        <div className="mode-toggle">
          <button
            type="button"
            className={mode === 'upload' ? 'mode-btn active' : 'mode-btn'}
            onClick={() => setMode('upload')}
          >
            📁 Upload
          </button>
          <button
            type="button"
            className={mode === 'url' ? 'mode-btn active' : 'mode-btn'}
            onClick={() => setMode('url')}
          >
            🔗 URL
          </button>
        </div>
      </div>

      {mode === 'upload' ? (
        <div
          className={`drop-zone ${uploading ? 'uploading' : ''}`}
          onClick={() => !uploading && fileRef.current.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && fileRef.current.click()}
          aria-label="Click or drag to upload image"
        >
          {uploading ? (
            <div className="upload-spinner">
              <span className="spinner" />
              <span>Uploading...</span>
            </div>
          ) : preview ? (
            <div className="preview-container">
              <img
                src={preview}
                alt="Preview"
                className="upload-preview"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div className="preview-overlay">
                <span>Click to change</span>
              </div>
            </div>
          ) : (
            <div className="drop-placeholder">
              <span className="drop-icon">🖼️</span>
              <p>Click or drag & drop an image</p>
              <p className="drop-hint">JPG, PNG, WEBP · Max 5 MB</p>
            </div>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </div>
      ) : (
        <div className="url-input-wrap">
          <input
            type="url"
            value={preview}
            onChange={handleUrlChange}
            placeholder="https://example.com/image.jpg"
            className="url-input"
          />
          {preview && (
            <img
              src={preview}
              alt="URL preview"
              className="url-preview"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
