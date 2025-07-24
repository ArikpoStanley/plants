"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import Image from "next/image";
import { getSpeciesList, createSpecies, deleteSpecies, uploadImage, Species } from "../../lib/api";

const ADMIN_PASSWORD = "treeadmin123";

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
const inputStyle: React.CSSProperties = {
  padding: '0.7rem',
  borderRadius: '0.5rem',
  border: '1px solid #cbd5e1',
  marginBottom: '1rem',
  width: '100%',
  fontSize: '1rem',
};
const btnStyle: React.CSSProperties = {
  background: 'linear-gradient(90deg, #225ea8 0%, #4299e1 100%)',
  color: '#fff',
  padding: '0.7rem 1.5rem',
  border: 'none',
  borderRadius: '0.7rem',
  fontSize: '1.08rem',
  fontWeight: 600,
  cursor: 'pointer',
  marginBottom: '1rem',
  marginTop: '0.5rem',
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

interface SpeciesForm {
  name: string;
  leaf_shape: string;
  bark_texture: string;
  fruit_type: string;
  growth_habit: string;
  image_url: string;
}

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [species, setSpecies] = useState<Species[]>([]);
  const [form, setForm] = useState<SpeciesForm>({
    name: "",
    leaf_shape: "",
    bark_texture: "",
    fruit_type: "",
    growth_habit: "",
    image_url: "",
  });
  const [uploading, setUploading] = useState(false);
  const [selectedImageName, setSelectedImageName] = useState<string | null>(null);

  useEffect(() => {
    if (loggedIn) fetchSpecies();
  }, [loggedIn]);

  const fetchSpecies = async () => {
    try {
      const data = await getSpeciesList();
      setSpecies(data);
    } catch {
      setError("Failed to fetch species from backend");
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setLoggedIn(true);
      setError(null);
    } else {
      setError("Incorrect password");
    }
  };

  const handleFormChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImageName(file.name);
      setUploading(true);
      try {
        const uploadResult = await uploadImage(file);
        setForm(f => ({ ...f, image_url: uploadResult.url }));
        setError(null);
      } catch {
        setError("Image upload failed");
      } finally {
        setUploading(false);
      }
    }
  };

  const handleAddSpecies = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return setError("Name is required");
    try {
      await createSpecies(form);
      setForm({ name: "", leaf_shape: "", bark_texture: "", fruit_type: "", growth_habit: "", image_url: "" });
      setError(null);
      fetchSpecies();
    } catch {
      setError("Failed to add species");
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    try {
      await deleteSpecies(id);
      fetchSpecies();
    } catch {
      setError("Failed to delete species");
    }
  };

  if (!loggedIn) {
    return (
      <div style={cardStyle}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', color: '#1a365d' }}>Admin Login</h2>
        <form onSubmit={handleLogin} style={{ width: '100%' }}>
          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={inputStyle}
            aria-label="Admin password"
          />
          <button type="submit" style={btnStyle}>Login</button>
        </form>
        {error && <div style={errorStyle}>{error}</div>}
      </div>
    );
  }

  return (
    <div style={cardStyle}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', color: '#1a365d' }}>Manage Tree Species</h2>
      <form onSubmit={handleAddSpecies} style={{ width: '100%' }}>
        <input
          name="name"
          placeholder="Species Name"
          value={form.name}
          onChange={handleFormChange}
          style={inputStyle}
          required
        />
        <input
          name="leaf_shape"
          placeholder="Leaf Shape"
          value={form.leaf_shape}
          onChange={handleFormChange}
          style={inputStyle}
        />
        <input
          name="bark_texture"
          placeholder="Bark Texture"
          value={form.bark_texture}
          onChange={handleFormChange}
          style={inputStyle}
        />
        <input
          name="fruit_type"
          placeholder="Fruit Type"
          value={form.fruit_type}
          onChange={handleFormChange}
          style={inputStyle}
        />
        <input
          name="growth_habit"
          placeholder="Growth Habit"
          value={form.growth_habit}
          onChange={handleFormChange}
          style={inputStyle}
        />
        <input
          type="text"
          name="image_url"
          placeholder="Image URL (or upload below)"
          value={form.image_url}
          onChange={handleFormChange}
          style={inputStyle}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: 16 }}>
          <label
            htmlFor="admin-image-upload"
            style={{
              background: 'linear-gradient(90deg, #4299e1 0%, #90cdf4 100%)',
              color: '#fff',
              padding: '0.85rem 2rem',
              borderRadius: '0.7rem',
              fontWeight: 600,
              fontSize: '1.08rem',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(66, 153, 225, 0.08)',
              border: 'none',
              transition: 'background 0.2s, transform 0.1s',
              margin: 0
            }}
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') document.getElementById('admin-image-upload')?.click();
            }}
          >
            {uploading ? 'Uploading...' : 'Choose Image'}
          </label>
          <button type="submit" style={{ ...btnStyle, margin: 0 }}>Add Species</button>
        </div>
        <input
          id="admin-image-upload"
          type="file"
          accept="image/*"
          onChange={handleImageFile}
          style={{ display: 'none' }}
          aria-label="Upload image"
        />
        {selectedImageName && <div style={{ color: '#225ea8', marginBottom: 8, fontSize: '0.98rem' }}>Selected: {selectedImageName}</div>}
        {uploading && <div style={{ color: '#3182ce', marginBottom: 8 }}>Uploading...</div>}
        {/^(https?:)?\/\//.test(form.image_url || '') && (
          <Image src={form.image_url!} alt="Preview" width={240} height={240} style={{ width: '100%', maxWidth: 240, borderRadius: 8, marginBottom: 12, marginTop: 8, objectFit: 'cover', display: 'block' }} />
        )}
      </form>
      {error && <div style={errorStyle}>{error}</div>}
      <div style={{ width: '100%', marginTop: 24 }}>
        <h3 style={{ fontWeight: 600, color: '#2b6cb0', marginBottom: 8 }}>Current Species</h3>
        {species.length === 0 ? (
          <div style={{ color: '#888' }}>No species yet.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: '#f4f8fb', borderRadius: 8, boxShadow: '0 1px 6px rgba(30,64,175,0.07)', marginBottom: 16 }}>
              <thead>
                <tr style={{ background: '#e2e8f0' }}>
                  <th style={{ padding: '0.7rem', fontWeight: 700, color: '#225ea8', textAlign: 'left' }}>Name</th>
                  <th style={{ padding: '0.7rem', fontWeight: 700, color: '#225ea8', textAlign: 'left' }}>Leaf Shape</th>
                  <th style={{ padding: '0.7rem', fontWeight: 700, color: '#225ea8', textAlign: 'left' }}>Bark Texture</th>
                  <th style={{ padding: '0.7rem', fontWeight: 700, color: '#225ea8', textAlign: 'left' }}>Fruit Type</th>
                  <th style={{ padding: '0.7rem', fontWeight: 700, color: '#225ea8', textAlign: 'left' }}>Growth Habit</th>
                  <th style={{ padding: '0.7rem', fontWeight: 700, color: '#225ea8', textAlign: 'left' }}>Image</th>
                  <th style={{ padding: '0.7rem', fontWeight: 700, color: '#225ea8', textAlign: 'left' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {species.map((sp, idx) => (
                  <tr key={sp._id || idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '0.7rem' }}>{sp.name}</td>
                    <td style={{ padding: '0.7rem' }}>{sp.leaf_shape}</td>
                    <td style={{ padding: '0.7rem' }}>{sp.bark_texture}</td>
                    <td style={{ padding: '0.7rem' }}>{sp.fruit_type}</td>
                    <td style={{ padding: '0.7rem' }}>{sp.growth_habit}</td>
                    <td style={{ padding: '0.7rem' }}>
                      {/^(https?:)?\/\//.test(sp.image_url || '') && (
                        <Image src={sp.image_url!} alt="Species" width={60} height={60} style={{ maxWidth: 60, borderRadius: 6 }} />
                      )}
                    </td>
                    <td style={{ padding: '0.7rem' }}>
                      <button onClick={() => handleDelete(sp._id)} style={{ ...btnStyle, background: '#e53e3e', color: '#fff', margin: 0, padding: '0.5rem 1rem' }}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
        )}
      </div>
    </div>
  );
} 