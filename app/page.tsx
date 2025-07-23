import Link from "next/link";
import Image from "next/image";
import "./globals.css";

const heroStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: '3rem',
  marginBottom: '2rem',
};

const features = [
  {
    title: "AI-Powered Identification",
    description: "Upload a photo of a leaf or bark and let our AI identify the plant species for you.",
    icon: "/globe.svg",
  },
  {
    title: "Expert Knowledge",
    description: "Combines AI with expert-curated data for more accurate results.",
    icon: "/file.svg",
  },
  {
    title: "History Tracking",
    description: "View all your past identifications in one place.",
    icon: "/window.svg",
  },
];

export default function Home() {
  return (
    <main style={{ minHeight: '100vh', background: '#f4f8fb', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <section style={heroStyle}>
        <Image src="/globe.svg" alt="Plant" width={80} height={80} style={{ marginBottom: 24 }} />
        <h1 style={{ fontSize: '2.7rem', fontWeight: 800, color: '#1a365d', letterSpacing: '-1px', textAlign: 'center', marginBottom: '0.5rem' }}>
          Tree Species Expert System
        </h1>
        <p style={{ color: '#4a5568', marginBottom: '2.5rem', textAlign: 'center', maxWidth: 600, fontSize: '1.15rem' }}>
          Instantly identify tree species by uploading a photo. Powered by AI and expert knowledge.
        </p>
        <Link href="/identify">
          <button style={{
            background: 'linear-gradient(90deg, #4299e1 0%, #90cdf4 100%)',
            color: '#fff',
            padding: '1rem 2.2rem',
            border: 'none',
            borderRadius: '0.7rem',
            fontSize: '1.15rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(66, 153, 225, 0.08)',
            marginTop: 16,
            marginBottom: 32,
          }}>
            Start Identifying
          </button>
        </Link>
      </section>
      <section style={{ width: '100%', maxWidth: 900, margin: '0 auto 3rem auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#225ea8', marginBottom: 24 }}>Features</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, justifyContent: 'center' }}>
          {features.map((f, idx) => (
            <div key={idx} style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(30,64,175,0.07)', padding: 24, minWidth: 220, maxWidth: 280, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Image src={f.icon} alt={f.title} width={40} height={40} style={{ marginBottom: 12 }} />
              <div style={{ fontWeight: 700, fontSize: '1.15rem', color: '#2b6cb0', marginBottom: 8 }}>{f.title}</div>
              <div style={{ color: '#444', fontSize: '1rem', textAlign: 'center' }}>{f.description}</div>
            </div>
          ))}
        </div>
      </section>
      <section style={{ width: '100%', maxWidth: 900, margin: '0 auto 3rem auto', background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(30,64,175,0.07)', padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#225ea8', marginBottom: 24 }}>How It Works</h2>
        <ol style={{ color: '#444', fontSize: '1.08rem', lineHeight: 1.7, maxWidth: 700 }}>
          <li>Click <b>Start Identifying</b> and upload a clear photo of a leaf or bark.</li>
          <li>Our AI analyzes the image and returns the most likely species, with detailed information.</li>
          <li>View your identification history at any time from the navigation bar.</li>
        </ol>
      </section>
      <section style={{ width: '100%', maxWidth: 900, margin: '0 auto 3rem auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#225ea8', marginBottom: 24 }}>Get Started</h2>
        <Link href="/identify">
          <button style={{
            background: 'linear-gradient(90deg, #4299e1 0%, #90cdf4 100%)',
            color: '#fff',
            padding: '1rem 2.2rem',
            border: 'none',
            borderRadius: '0.7rem',
            fontSize: '1.15rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(66, 153, 225, 0.08)',
            marginTop: 8,
          }}>
            Go to Identify Page
          </button>
        </Link>
      </section>
    </main>
  );
} 