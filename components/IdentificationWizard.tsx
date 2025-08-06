'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { uploadImage, classifyImage, PlantNetFullResponse } from '../lib/api';

interface HistoryItem {
  scientific_name: string;
  confidence: number;
  common_names: string[];
  family: string;
  genus: string;
  synonyms: string[];
  vernacular_names: string[];
  reference_images: Array<{
    url: {
      o: string;
      m: string;
      s: string;
    };
    organ: string;
  }>;
  timestamp: string;
  imageUrl: string;
}

export default function IdentificationWizard() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PlantNetFullResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [collectionMessage, setCollectionMessage] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
      setResult(null);
      setPreviewUrl(URL.createObjectURL(file));
      setUploadedImageUrl(null); // Reset uploaded image URL on new file
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
      setUploadedImageUrl(uploadResult.url); // Save uploaded image URL
      // Classify image using PlantNet
      const classificationResult = await classifyImage(uploadResult.url);
      setResult(classificationResult);
      // Save to localStorage for history (store only the top result for history, but you could store all if desired)
      if (classificationResult.results && classificationResult.results.length > 0) {
        const top = classificationResult.results[0];
        const historyItem = {
          scientific_name: top.species.scientificNameWithoutAuthor,
          confidence: top.score,
          common_names: top.species.commonNames || [],
          family: top.species.family.scientificNameWithoutAuthor,
          genus: top.species.genus.scientificNameWithoutAuthor,
          synonyms: top.species.synonyms || [],
          vernacular_names: top.species.vernacularNames || [],
          reference_images: top.species.images || [],
          timestamp: new Date().toISOString(),
          imageUrl: uploadResult.url
        };
        const existingHistory = localStorage.getItem('plantIdentificationHistory');
        const history = existingHistory ? JSON.parse(existingHistory) : [];
        history.unshift(historyItem);
        if (history.length > 50) history.splice(50);
        localStorage.setItem('plantIdentificationHistory', JSON.stringify(history));
      }
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
    const collections: HistoryItem[] = collectionsRaw ? JSON.parse(collectionsRaw) : [];
    // When adding to collections, use the top result to construct a HistoryItem
    const top = result.results?.[0];
    if (!top) return;
    const topScientificName = top.species?.scientificNameWithoutAuthor;
    if (collections.some((item) => item.scientific_name === topScientificName)) {
      setCollectionMessage('This species is already in your collection.');
      return;
    }
    collections.unshift({
      scientific_name: top.species.scientificNameWithoutAuthor,
      confidence: top.score,
      common_names: top.species.commonNames || [],
      family: top.species.family.scientificNameWithoutAuthor,
      genus: top.species.genus.scientificNameWithoutAuthor,
      synonyms: top.species.synonyms || [],
      vernacular_names: top.species.vernacularNames || [],
      reference_images: top.species.images || [],
      timestamp: new Date().toISOString(),
      imageUrl: uploadedImageUrl || ''
    });
    localStorage.setItem('plantCollections', JSON.stringify(collections));
    setCollectionMessage('Added to your collection!');
    setTimeout(() => {
      setSelectedFile(null);
      setPreviewUrl(null);
      setResult(null);
      setError(null);
      setIsLoading(false);
      setUploadedImageUrl(null);
    }, 1000);
  };

  return (
    <div style={{ maxWidth: '700px', width: '100%', padding: '2rem', background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
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
              <Image
                src={previewUrl}
                alt="Preview"
                width={240}
                height={240}
                style={{ maxWidth: '100%', maxHeight: 240, borderRadius: 8, boxShadow: '0 2px 8px rgba(30, 64, 175, 0.10)' }}
              />
            </div>
          )}
        </div>

        {!collectionMessage && (
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
        )}
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

      {/* Display all results and meta info */}
      {result && !collectionMessage && (
        <div style={{ marginTop: '2rem' }}>
          {/* Query summary */}
          <div style={{ background: '#f1f5f9', borderRadius: 10, padding: 16, marginBottom: 24, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <div><strong>Organs:</strong> {result.query.organs?.join(', ') || 'N/A'}</div>
            <div><strong>Images:</strong> {result.query.images?.map((img, idx) => (
              <img key={idx} src={img} alt={`query-img-${idx}`} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6, marginLeft: 6 }} />
            ))}</div>
            {result.remainingIdentificationRequests !== undefined && (
              <div style={{ marginLeft: 'auto', color: '#225ea8', fontWeight: 600 }}>
                Remaining Requests: {result.remainingIdentificationRequests}
              </div>
            )}
          </div>
          {/* Results grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
            {result?.results?.map((res, idx) => (
              <div key={idx} style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 20, background: '#f9fafb', boxShadow: '0 1px 6px rgba(30,64,175,0.07)' }}>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>
                  {res.species.scientificNameWithoutAuthor}
                  <span style={{ fontWeight: 400, fontSize: 16, marginLeft: 8, color: '#718096' }}>{res.species.scientificNameAuthorship}</span>
                </h3>
                <div style={{ marginBottom: 8 }}>
                  <span style={{ background: '#225ea8', color: 'white', borderRadius: 8, padding: '2px 10px', fontWeight: 600 }}>
                    {(res.score * 100).toFixed(1)}% confident
                  </span>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <strong>Common Names:</strong>
                  {res.species.commonNames.map((name: string) => (
                    <span key={name} style={{ background: '#e6f7ff', color: '#225ea8', borderRadius: 6, padding: '2px 8px', marginLeft: 6, fontSize: 14 }}>{name}</span>
                  ))}
                </div>
                <div style={{ marginBottom: 4 }}>
                  <strong>Genus:</strong> {res.species.genus.scientificNameWithoutAuthor}
                  <span style={{ color: '#718096', marginLeft: 4 }}>{res.species.genus.scientificNameAuthorship}</span>
                </div>
                <div style={{ marginBottom: 4 }}>
                  <strong>Family:</strong> {res.species.family.scientificNameWithoutAuthor}
                  <span style={{ color: '#718096', marginLeft: 4 }}>{res.species.family.scientificNameAuthorship}</span>
                </div>
                {res?.species?.synonyms?.length > 0 && (
                  <div style={{ marginBottom: 4 }}>
                    <strong>Synonyms:</strong> {res.species.synonyms.join(', ')}
                  </div>
                )}
                {res?.species?.vernacularNames?.length > 0 && (
                  <div style={{ marginBottom: 4 }}>
                    <strong>Vernacular Names:</strong> {res.species.vernacularNames.join(', ')}
                  </div>
                )}
                {res?.species?.images?.length > 0 && (
                  <div style={{ marginTop: 8 }}>
                    <strong>Reference Images:</strong>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
                      {res.species.images.map((img, i) => (
                        <img key={i} src={img.url.s} alt={`ref-img-${i}`} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6 }} />
                      ))}
                    </div>
                  </div>
                )}
                {/* Add to Collection only for the top result */}
                {idx === 0 && (
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
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {collectionMessage && (
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <div style={{ color: '#225ea8', marginBottom: 12 }}>{collectionMessage}</div>
          <a
            href="/collections"
            style={{
              display: 'inline-block',
              marginTop: 12,
              background: '#4299e1',
              color: 'white',
              padding: '0.7rem 1.5rem',
              borderRadius: '8px',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'background 0.2s',
            }}
          >
            View Collections
          </a>
        </div>
      )}
    </div>
  );
} 