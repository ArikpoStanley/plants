'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { PlantNetResult } from '../../lib/api';

interface HistoryItem extends PlantNetResult {
  timestamp: string;
  imageUrl: string;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('plantIdentificationHistory');
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory) as HistoryItem[];
        setHistory(parsedHistory);
      } catch (error) {
        console.error('Failed to parse history:', error);
      }
    }
  }, []);

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (history.length === 0) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#f4f8fb', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '2rem 1rem' 
      }}>
        <div style={{ 
          maxWidth: '800px', 
          width: '100%', 
          textAlign: 'center',
          background: 'white',
          padding: '3rem',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 800, 
            color: '#1a365d', 
            marginBottom: '1rem' 
          }}>
            Identification History
          </h1>
          <p style={{ 
            fontSize: '1.2rem', 
            color: '#4a5568', 
            marginBottom: '2rem' 
          }}>
            No identification history found. Start by identifying some plants!
          </p>
          <a 
            href="/identify" 
            style={{
              display: 'inline-block',
              backgroundColor: '#4299e1',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 600,
              transition: 'background-color 0.2s ease'
            }}
          >
            Start Identifying
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#f4f8fb', 
      padding: '2rem 1rem' 
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto' 
      }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 800, 
          color: '#1a365d', 
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          Identification History
        </h1>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '1.5rem',
          padding: '0 1rem'
        }}>
          {history.map((item, index) => (
            <div key={index} style={{
              background: 'white',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ marginBottom: '1rem' }}>
                <Image 
                  src={item.imageUrl} 
                  alt="Plant" 
                  width={400}
                  height={200}
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'contain',
                    borderRadius: '8px',
                    marginBottom: '1rem'
                  }}
                />
                <p style={{ 
                  color: '#718096', 
                  fontSize: '0.875rem',
                  margin: 0
                }}>
                  {formatDate(item.timestamp)}
                </p>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div>
                  <strong style={{ color: '#4a5568' }}>Scientific Name:</strong>
                  <span style={{ marginLeft: '0.5rem', color: '#2d3748' }}>
                    {item.scientific_name}
                  </span>
                </div>
                
                <div>
                  <strong style={{ color: '#4a5568' }}>Confidence:</strong>
                  <span style={{ marginLeft: '0.5rem', color: '#2d3748' }}>
                    {(item.confidence * 100).toFixed(1)}%
                  </span>
                </div>
                
                {item.common_names.length > 0 && (
                  <div>
                    <strong style={{ color: '#4a5568' }}>Common Names:</strong>
                    <span style={{ marginLeft: '0.5rem', color: '#2d3748' }}>
                      {item.common_names.join(', ')}
                    </span>
                  </div>
                )}
                
                <div>
                  <strong style={{ color: '#4a5568' }}>Family:</strong>
                  <span style={{ marginLeft: '0.5rem', color: '#2d3748' }}>
                    {item.family}
                  </span>
                </div>
                
                <div>
                  <strong style={{ color: '#4a5568' }}>Genus:</strong>
                  <span style={{ marginLeft: '0.5rem', color: '#2d3748' }}>
                    {item.genus}
                  </span>
                </div>
                
                {item.synonyms.length > 0 && (
                  <div>
                    <strong style={{ color: '#4a5568' }}>Synonyms:</strong>
                    <span style={{ marginLeft: '0.5rem', color: '#2d3748' }}>
                      {item.synonyms.join(', ')}
                    </span>
                  </div>
                )}
                
                {item.vernacular_names.length > 0 && (
                  <div>
                    <strong style={{ color: '#4a5568' }}>Vernacular Names:</strong>
                    <span style={{ marginLeft: '0.5rem', color: '#2d3748' }}>
                      {item.vernacular_names.join(', ')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 