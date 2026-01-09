import { useState } from 'react';
import './App.css';
import FacialFrameworkRatings from './components/FacialFrameworkRatings';
import JawlineRatings from './components/JawlineRatings';
import Chin from './components/Chin';
import MandibleRatings from './components/MandibleRatings';
import CheekboneRatings from './components/CheekboneRatings';
import MidfaceRatings from './components/MidfaceRatings';
import EyeRatings from './components/EyeRatings';
import BrowForeheadRatings from './components/BrowForeheadRatings';
import NasalBoneStructureRatings from './components/NasalBoneStructureRatings';
import LipPerioralArea from './components/LipPerioralArea';
import SkinRating from './components/SkinRating';
import ProfileView from './components/ProfileView';

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const processFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      setError('');
      setResponse('');
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setError('Please select a valid image file');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedImage) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError('');
    setResponse('');

    try {
      const formData = new FormData();
      formData.append('image', selectedImage);

      const API_URL = process.env.REACT_APP_API_URL || 'https://mogcheck-api.onrender.com';
      const res = await fetch(`${API_URL}/api/gemini/`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Failed to get response');
      }

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>MogCheck</h1>
        
        <div 
          className={`drop-zone ${isDragging ? 'drag-active' : ''} ${imagePreview ? 'has-image' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{ marginTop: '20px' }}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            id="file-input"
            style={{ display: 'none' }}
          />
          {imagePreview ? (
            <div className="preview-container">
              <img
                src={imagePreview}
                alt="Preview"
                className="preview-image"
              />
              <button
                className="change-image-btn"
                onClick={() => document.getElementById('file-input').click()}
              >
                Change Image
              </button>
            </div>
          ) : (
            <div 
              className="drop-zone-content"
              onClick={() => document.getElementById('file-input').click()}
            >
              <svg
                className="upload-icon"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              <p className="drop-zone-text">
                Drag and drop an image here, or <span className="click-to-browse">click to browse</span>
              </p>
              <p className="drop-zone-hint">Supports: JPG, PNG, GIF, WebP</p>
            </div>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!selectedImage || loading}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            cursor: selectedImage && !loading ? 'pointer' : 'not-allowed',
            marginTop: '10px'
          }}
        >
          {loading ? 'Processing...' : 'Begin Facial Analysis'}
        </button>

        {error && (
          <div style={{ color: 'red', marginTop: '20px', padding: '10px' }}>
            Error: {error}
          </div>
        )}

        {response && (
          <div style={{
            marginTop: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            maxWidth: '1200px',
            width: '100%'
          }}>
            <FacialFrameworkRatings data={response} />
            <JawlineRatings data={response} />
            <Chin data={response} />
            <MandibleRatings data={response} />
            <CheekboneRatings data={response} />
            <MidfaceRatings data={response} />
            <EyeRatings data={response} />
            <BrowForeheadRatings data={response} />
            <NasalBoneStructureRatings data={response} />
            <LipPerioralArea data={response} />
            <SkinRating data={response} />
            <ProfileView data={response} />
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
