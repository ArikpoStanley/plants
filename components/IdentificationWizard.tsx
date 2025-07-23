"use client";
import React, { useEffect, useState, ChangeEvent } from "react";
import { getSpeciesList, identifyTree, Species, uploadImage, classifyImage } from "../lib/api";

const cardStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: '1.25rem',
  boxShadow: '0 4px 32px rgba(30, 64, 175, 0.10)',
  padding: '2.5rem 2rem 2rem 2rem',
  maxWidth: 420,
  margin: '2rem auto 0 auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  transition: 'box-shadow 0.2s',
  minHeight: 320,
};

const stepStyle: React.CSSProperties = {
  fontSize: '1.2rem',
  fontWeight: 600,
  marginBottom: '1.7rem',
  textAlign: 'center',
  color: '#2b6cb0',
};

const optionBtnStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.9rem 0',
  borderRadius: '0.7rem',
  border: 'none',
  background: 'linear-gradient(90deg, #4299e1 0%, #90cdf4 100%)',
  color: '#fff',
  fontSize: '1.08rem',
  fontWeight: 600,
  cursor: 'pointer',
  boxShadow: '0 2px 8px rgba(66, 153, 225, 0.08)',
  marginBottom: '0.2rem',
  marginTop: '0.2rem',
  transition: 'background 0.2s, transform 0.1s',
  outline: 'none',
};

const optionBtnHoverStyle: React.CSSProperties = {
  background: 'linear-gradient(90deg, #2b6cb0 0%, #63b3ed 100%)',
  transform: 'translateY(-2px) scale(1.03)',
};

const resultTitleStyle: React.CSSProperties = {
  fontSize: '1.4rem',
  fontWeight: 700,
  marginBottom: '0.7rem',
  textAlign: 'center',
  color: '#225ea8',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  justifyContent: 'center',
};

const resultSpeciesStyle: React.CSSProperties = {
  fontSize: '1.7rem',
  fontWeight: 700,
  color: '#2b6cb0',
  marginBottom: '0.7rem',
  textShadow: '0 2px 8px #e3e8f0',
};

const resultExplanationStyle: React.CSSProperties = {
  fontSize: '1.05rem',
  color: '#444',
  marginBottom: '0.7rem',
  textAlign: 'center',
};

const resultCandidatesStyle: React.CSSProperties = {
  fontSize: '0.98rem',
  color: '#718096',
  marginBottom: '0.7rem',
  textAlign: 'center',
};

const tryAgainBtnStyle: React.CSSProperties = {
  marginTop: '1.2rem',
  width: '100%',
  background: 'linear-gradient(90deg, #225ea8 0%, #4299e1 100%)',
  color: '#fff',
  padding: '0.9rem 0',
  border: 'none',
  borderRadius: '0.7rem',
  fontSize: '1.08rem',
  fontWeight: 600,
  cursor: 'pointer',
  boxShadow: '0 2px 8px rgba(66, 153, 225, 0.08)',
  transition: 'background 0.2s, transform 0.1s',
};

const tryAgainBtnHoverStyle: React.CSSProperties = {
  background: 'linear-gradient(90deg, #1a365d 0%, #2b6cb0 100%)',
  transform: 'translateY(-2px) scale(1.03)',
};

const loadingStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  color: '#3182ce',
  fontSize: '1.15rem',
  justifyContent: 'center',
  margin: '2rem 0',
};

const errorStyle: React.CSSProperties = {
  color: '#e53e3e',
  background: '#fff5f5',
  border: '1px solid #feb2b2',
  padding: '1rem',
  borderRadius: '0.7rem',
  margin: '1rem 0',
  textAlign: 'center',
};

const progressBarContainer: React.CSSProperties = {
  width: '100%',
  height: 8,
  background: '#e2e8f0',
  borderRadius: 8,
  marginBottom: 24,
  overflow: 'hidden',
};
const progressBarFill: React.CSSProperties = {
  height: '100%',
  background: 'linear-gradient(90deg, #4299e1 0%, #90cdf4 100%)',
  borderRadius: 8,
  transition: 'width 0.4s cubic-bezier(.4,2,.6,1)',
};

const checkIcon = (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#38a169" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" stroke="#38a169" strokeWidth="2.5" fill="#e6fffa"/><path d="M8 12l2 2l4-4"/></svg>
);

const errorIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e53e3e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" stroke="#e53e3e" strokeWidth="2.5" fill="#fff5f5"/><path d="M15 9l-6 6M9 9l6 6"/></svg>
);

const spinner = (
  <svg width="28" height="28" viewBox="0 0 50 50" style={{ display: 'block' }}><circle cx="25" cy="25" r="20" fill="none" stroke="#4299e1" strokeWidth="5" strokeDasharray="31.4 31.4" strokeLinecap="round"><animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="1s" repeatCount="indefinite"/></circle></svg>
);

export default function IdentificationWizard() {
  const [error, setError] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<any | null>(null);
  const [classifying, setClassifying] = useState(false);
  const [selectedImageName, setSelectedImageName] = useState<string | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImageName(file.name);
      setUploading(true);
      try {
        const url = await uploadImage(file);
        setImageUrl(url);
        setImage(url);
        setError(null);
        setClassifying(true);
        try {
          const ai = await classifyImage(url);
          setAiResult(ai);
          // Save to history with all details
          const history = JSON.parse(localStorage.getItem('tree-identification-history') || '[]');
          history.unshift({
            date: new Date().toLocaleString(),
            ...ai,
            image: url,
          });
          localStorage.setItem('tree-identification-history', JSON.stringify(history.slice(0, 50)));
        } catch {
          setAiResult(null);
        } finally {
          setClassifying(false);
        }
      } catch {
        setError("Image upload failed");
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <div style={cardStyle} aria-live="polite">
      <div style={stepStyle}>Upload a photo of the leaf or bark:</div>
      <label
        htmlFor="identify-image-upload"
        style={{
          display: 'inline-block',
          background: 'linear-gradient(90deg, #4299e1 0%, #90cdf4 100%)',
          color: '#fff',
          padding: '0.85rem 2rem',
          borderRadius: '0.7rem',
          fontWeight: 600,
          fontSize: '1.08rem',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(66, 153, 225, 0.08)',
          marginBottom: 18,
          marginTop: 4,
          border: 'none',
          transition: 'background 0.2s, transform 0.1s',
        }}
        tabIndex={0}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click();
        }}
      >
        {uploading ? 'Uploading...' : 'Choose Image'}
      </label>
      <input
        id="identify-image-upload"
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageUpload}
        style={{ display: 'none' }}
        aria-label="Upload image"
      />
      {selectedImageName && <div style={{ color: '#225ea8', marginBottom: 8, fontSize: '0.98rem' }}>Selected: {selectedImageName}</div>}
      {imageUrl && <img src={imageUrl} alt="Uploaded preview" style={{ maxWidth: 180, borderRadius: 12, marginBottom: 16, marginTop: 8 }} />}
      {classifying && <div style={{ color: '#3182ce', marginBottom: 8 }}>Classifying image...</div>}
      {aiResult && (
        <div style={{ color: '#225ea8', marginBottom: 8, width: '100%' }}>
          <b>AI Prediction:</b> {aiResult.class || 'Unknown'} ({(aiResult.confidence * 100).toFixed(1)}%)
          {aiResult.common_names && aiResult.common_names.length > 0 && (
            <div><b>Common Names:</b> {aiResult.common_names.join(', ')}</div>
          )}
          {aiResult.family && (
            <div><b>Family:</b> {aiResult.family}</div>
          )}
          {aiResult.genus && (
            <div><b>Genus:</b> {aiResult.genus}</div>
          )}
          {aiResult.synonyms && aiResult.synonyms.length > 0 && (
            <div><b>Synonyms:</b> {aiResult.synonyms.join(', ')}</div>
          )}
          {aiResult.vernacular_names && aiResult.vernacular_names.length > 0 && (
            <div><b>Vernacular Names:</b> {aiResult.vernacular_names.map((v: any) => v.name).join(', ')}</div>
          )}
          {aiResult.images && aiResult.images.length > 0 && (
            <div style={{ marginTop: 8 }}>
              <b>Reference Images:</b>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
                {aiResult.images.map((img: string, idx: number) => (
                  <img key={idx} src={img} alt="Reference" style={{ maxWidth: 60, borderRadius: 6 }} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      {error && <div style={errorStyle}>{errorIcon} {error}</div>}
    </div>
  );
} 