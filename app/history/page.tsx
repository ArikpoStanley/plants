"use client";
import React, { useEffect, useState } from "react";

const cardStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: '1.25rem',
  boxShadow: '0 4px 32px rgba(30, 64, 175, 0.10)',
  padding: '2rem 2rem 1.5rem 2rem',
  maxWidth: '100%',
  margin: '2rem auto 0 auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  transition: 'box-shadow 0.2s',
};

const titleStyle: React.CSSProperties = {
  fontSize: '2rem',
  fontWeight: 700,
  color: '#1a365d',
  marginBottom: '1.5rem',
  textAlign: 'center',
};

const historyListStyle: React.CSSProperties = {
  width: '100%',
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '1.5rem',
};

const historyItemStyle: React.CSSProperties = {
  background: '#f4f8fb',
  borderRadius: '0.7rem',
  padding: '1rem',
  boxShadow: '0 1px 6px rgba(30,64,175,0.07)',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
};

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const data = localStorage.getItem('tree-identification-history');
    if (data) setHistory(JSON.parse(data));
  }, []);

  return (
    <>
      <style>{`
        @media (min-width: 640px) {
          .history-list-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (min-width: 1024px) {
          .history-list-grid {
            grid-template-columns: repeat(5, 1fr) !important;
          }
        }
      `}</style>
      <div style={cardStyle}>
        <div style={titleStyle}>Identification History</div>
        <div style={{ ...historyListStyle }} className="history-list-grid">
          {history.length === 0 ? (
            <div style={{ color: '#888', textAlign: 'center' }}>No history yet.</div>
          ) : (
            history.map((item, idx) => (
              <div key={idx} style={historyItemStyle}>
                <div><b>Date:</b> {item.date}</div>
                <div><b>Scientific Name:</b> {item.class || 'Unknown'}</div>
                <div><b>Confidence:</b> {item.confidence !== undefined ? (item.confidence * 100).toFixed(1) + '%' : 'N/A'}</div>
                {item.common_names && item.common_names.length > 0 && (
                  <div><b>Common Names:</b> {item.common_names.join(', ')}</div>
                )}
                {item.family && (
                  <div><b>Family:</b> {item.family}</div>
                )}
                {item.genus && (
                  <div><b>Genus:</b> {item.genus}</div>
                )}
                {item.synonyms && item.synonyms.length > 0 && (
                  <div><b>Synonyms:</b> {item.synonyms.join(', ')}</div>
                )}
                {item.vernacular_names && item.vernacular_names.length > 0 && (
                  <div><b>Vernacular Names:</b> {item.vernacular_names.map((v: any) => v.name).join(', ')}</div>
                )}
                {item.image && <img src={item.image} alt="Uploaded" style={{ maxWidth: 120, borderRadius: 8, marginTop: 8 }} />}
                {item.images && item.images.length > 0 && (
                  <div style={{ marginTop: 8 }}>
                    <b>Reference Images:</b>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
                      {item.images.map((img: string, i: number) => (
                        <img key={i} src={img} alt="Reference" style={{ maxWidth: 60, borderRadius: 6 }} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
} 