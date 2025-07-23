import IdentificationWizard from "../../components/IdentificationWizard";
import "../globals.css";

const heroStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: '3rem',
  marginBottom: '2rem',
};

export default function IdentifyPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#f4f8fb', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <section style={heroStyle}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#1a365d', letterSpacing: '-1px', textAlign: 'center', marginBottom: '0.5rem' }}>Identify a Plant</h1>
        <p style={{ color: '#4a5568', marginBottom: '2.5rem', textAlign: 'center', maxWidth: 600, fontSize: '1.15rem' }}>
          Upload a photo of a leaf or bark to identify the plant species using AI.
        </p>
      </section>
      <IdentificationWizard />
    </main>
  );
} 