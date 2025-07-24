"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

interface ReferenceImage {
  url: {
    o: string;
    m: string;
    s: string;
  };
  organ: string;
}

interface CollectionItem {
  scientific_name: string;
  confidence: number;
  common_names: string[];
  family: string;
  genus: string;
  synonyms: string[];
  vernacular_names: string[];
  reference_images: ReferenceImage[];
  imageUrl?: string;
}

export default function CollectionsPage() {
  const [collections, setCollections] = useState<CollectionItem[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem("plantCollections");
    setCollections(raw ? JSON.parse(raw) : []);
  }, []);

  const handleDelete = (scientific_name: string) => {
    const updated = collections.filter(item => item.scientific_name !== scientific_name);
    setCollections(updated);
    localStorage.setItem("plantCollections", JSON.stringify(updated));
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f4f8fb', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1a365d', marginBottom: '2rem', textAlign: 'center' }}>
          My Collections
        </h1>
        {collections.length === 0 ? (
          <div style={{ color: '#888', textAlign: 'center', fontSize: '1.2rem' }}>No species in your collection yet.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem', padding: '0 1rem' }}>
            {collections.map((item, idx) => (
              <div key={item.scientific_name + idx} style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', border: '1px solid #e2e8f0', position: 'relative' }}>
                {item.imageUrl && (
                  <Image src={item.imageUrl} alt={item.scientific_name} width={400} height={200} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem' }} />
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div>
                    <strong style={{ color: '#4a5568' }}>Scientific Name:</strong>
                    <span style={{ marginLeft: '0.5rem', color: '#2d3748' }}>{item.scientific_name}</span>
                  </div>
                  <div>
                    <strong style={{ color: '#4a5568' }}>Confidence:</strong>
                    <span style={{ marginLeft: '0.5rem', color: '#2d3748' }}>{(item.confidence * 100).toFixed(1)}%</span>
                  </div>
                  {item.common_names.length > 0 && (
                    <div>
                      <strong style={{ color: '#4a5568' }}>Common Names:</strong>
                      <span style={{ marginLeft: '0.5rem', color: '#2d3748' }}>{item.common_names.join(', ')}</span>
                    </div>
                  )}
                  <div>
                    <strong style={{ color: '#4a5568' }}>Family:</strong>
                    <span style={{ marginLeft: '0.5rem', color: '#2d3748' }}>{item.family}</span>
                  </div>
                  <div>
                    <strong style={{ color: '#4a5568' }}>Genus:</strong>
                    <span style={{ marginLeft: '0.5rem', color: '#2d3748' }}>{item.genus}</span>
                  </div>
                  {item.synonyms.length > 0 && (
                    <div>
                      <strong style={{ color: '#4a5568' }}>Synonyms:</strong>
                      <span style={{ marginLeft: '0.5rem', color: '#2d3748' }}>{item.synonyms.join(', ')}</span>
                    </div>
                  )}
                  {item.vernacular_names.length > 0 && (
                    <div>
                      <strong style={{ color: '#4a5568' }}>Vernacular Names:</strong>
                      <span style={{ marginLeft: '0.5rem', color: '#2d3748' }}>{item.vernacular_names.join(', ')}</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(item.scientific_name)}
                  style={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    background: '#e53e3e',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '0.5rem 1rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(66, 153, 225, 0.08)',
                  }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 