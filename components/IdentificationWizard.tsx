'use client';

import React, { useState } from 'react';
import { uploadImage, classifyImage, PlantNetResult } from '../lib/api';

interface HistoryItem extends PlantNetResult {
  timestamp: string;
  imageUrl: string;
}

export default function IdentificationWizard() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PlantNetResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [collectionMessage, setCollectionMessage] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
      setResult(null);
      // Create a preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedFile) {
      setError('Please select a file');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Upload image to Cloudinary
      const uploadResult = await uploadImage(selectedFile);
      
      // Classify image using PlantNet
      const classificationResult = await classifyImage(uploadResult.url);
      
      setResult(classificationResult);

      // Save to localStorage for history
      const historyItem: HistoryItem = {
        ...classificationResult,
        timestamp: new Date().toISOString(),
        imageUrl: uploadResult.url
      };

      const existingHistory = localStorage.getItem('plantIdentificationHistory');
      const history = existingHistory ? JSON.parse(existingHistory) : [];
      history.unshift(historyItem);
      
      // Keep only last 50 items
      if (history.length > 50) {
        history.splice(50);
      }
      
      localStorage.setItem('plantIdentificationHistory', JSON.stringify(history));

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCollection = () => {
    if (!result) return;
    const collectionsRaw = localStorage.getItem('plantCollections');
    let collections = collectionsRaw ? JSON.parse(collectionsRaw) : [];
    // Prevent duplicates by scientific name
    if (collections.some((item: any) => item.scientific_name === result.scientific_name)) {
      setCollectionMessage('This species is already in your collection.');
      return;
    }
    collections.unshift({ ...result, imageUrl: previewUrl });
    localStorage.setItem('plantCollections', JSON.stringify(collections));
    setCollectionMessage('Added to your collection!');
  };

  return (
    <div style={{ maxWidth: '600px', width: '100%', padding: '2rem', background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
      <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#2d3748', marginBottom: '1.5rem', textAlign: 'center' }}>
        Plant Identification
      </h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="image-upload" style={{ fontSize: '1rem', fontWeight: 600, color: '#4a5568' }}>
            Upload Plant Image
          </label>
          <div style={{ 
            border: '2px dashed #cbd5e0', 
            borderRadius: '8px', 
            padding: '2rem', 
            textAlign: 'center',
            transition: 'all 0.2s ease',
            cursor: 'pointer',
            position: 'relative'
          }}>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: 0,
                cursor: 'pointer'
              }}
            />
            <div style={{ pointerEvents: 'none' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#718096', marginBottom: '0.5rem' }}>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7,10 12,15 17,10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <p style={{ color: '#718096', margin: 0 }}>
                {selectedFile ? selectedFile.name : 'Click to upload or drag and drop'}
              </p>
              <p style={{ color: '#a0aec0', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>
                PNG, JPG, JPEG up to 10MB
              </p>
            </div>
          </div>
          {previewUrl && (
            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <img
                src={previewUrl}
                alt="Preview"
                style={{ maxWidth: '100%', maxHeight: 240, borderRadius: 8, boxShadow: '0 2px 8px rgba(30, 64, 175, 0.10)' }}
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={!selectedFile || isLoading}
          style={{
            backgroundColor: selectedFile && !isLoading ? '#4299e1' : '#cbd5e0',
            color: 'white',
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: selectedFile && !isLoading ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s ease',
            transform: selectedFile && !isLoading ? 'none' : 'none'
          }}
        >
          {isLoading ? 'Identifying...' : 'Identify Plant'}
        </button>
      </form>

      {error && (
        <div style={{ 
          marginTop: '1rem', 
          padding: '1rem', 
          backgroundColor: '#fed7d7', 
          border: '1px solid #feb2b2', 
          borderRadius: '8px',
          color: '#c53030'
        }}>
          {error}
        </div>
      )}

      {result && (
        <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#f7fafc', borderRadius: '8px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#2d3748', marginBottom: '1rem' }}>
            Identification Result
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div>
              <strong style={{ color: '#4a5568' }}>Scientific Name:</strong>
              <span style={{ marginLeft: '0.5rem', color: '#2d3748' }}>{result.scientific_name}</span>
            </div>
            
            <div>
              <strong style={{ color: '#4a5568' }}>Confidence:</strong>
              <span style={{ marginLeft: '0.5rem', color: '#2d3748' }}>
                {(result.confidence * 100).toFixed(1)}%
              </span>
            </div>
            
            {result.common_names.length > 0 && (
              <div>
                <strong style={{ color: '#4a5568' }}>Common Names:</strong>
                <span style={{ marginLeft: '0.5rem', color: '#2d3748' }}>
                  {result.common_names.join(', ')}
                </span>
              </div>
            )}
            
            <div>
              <strong style={{ color: '#4a5568' }}>Family:</strong>
              <span style={{ marginLeft: '0.5rem', color: '#2d3748' }}>{result.family}</span>
            </div>
            
            <div>
              <strong style={{ color: '#4a5568' }}>Genus:</strong>
              <span style={{ marginLeft: '0.5rem', color: '#2d3748' }}>{result.genus}</span>
            </div>
            
            {result.synonyms.length > 0 && (
              <div>
                <strong style={{ color: '#4a5568' }}>Synonyms:</strong>
                <span style={{ marginLeft: '0.5rem', color: '#2d3748' }}>
                  {result.synonyms.join(', ')}
                </span>
              </div>
            )}
            
            {result.vernacular_names.length > 0 && (
              <div>
                <strong style={{ color: '#4a5568' }}>Vernacular Names:</strong>
                <span style={{ marginLeft: '0.5rem', color: '#2d3748' }}>
                  {result.vernacular_names.join(', ')}
                </span>
              </div>
            )}
          </div>
          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <button
              type="button"
              onClick={handleAddToCollection}
              style={{
                backgroundColor: '#225ea8',
                color: 'white',
                padding: '0.7rem 1.5rem',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                marginBottom: '0.5rem',
                transition: 'background 0.2s',
              }}
            >
              Add to Collection
            </button>
            {collectionMessage && <div style={{ color: '#225ea8', marginTop: 8 }}>{collectionMessage}</div>}
          </div>
        </div>
      )}
    </div>
  );
} 