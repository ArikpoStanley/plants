import Link from "next/link";
import { usePathname } from "next/navigation";
import "./globals.css";

const navStyle: React.CSSProperties = {
  width: '100%',
  background: '#fff',
  boxShadow: '0 2px 12px rgba(30,64,175,0.07)',
  padding: '0.5rem 0',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '2.5rem',
  position: 'sticky',
  top: 0,
  zIndex: 10,
};
const linkStyle: React.CSSProperties = {
  color: '#2b6cb0',
  fontWeight: 600,
  fontSize: '1.08rem',
  textDecoration: 'none',
  padding: '0.5rem 1rem',
  borderRadius: '0.5rem',
  transition: 'background 0.2s, color 0.2s',
};
const activeLinkStyle: React.CSSProperties = {
  background: 'linear-gradient(90deg, #4299e1 0%, #90cdf4 100%)',
  color: '#fff',
};

function NavBar() {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  return (
    <nav style={navStyle}>
      <Link href="/" style={{ ...linkStyle, ...(pathname === '/' ? activeLinkStyle : {}) }}>Home</Link>
      <Link href="/identify" style={{ ...linkStyle, ...(pathname === '/identify' ? activeLinkStyle : {}) }}>Identify</Link>
      <Link href="/history" style={{ ...linkStyle, ...(pathname === '/history' ? activeLinkStyle : {}) }}>History</Link>
      <Link href="/admin" style={{ ...linkStyle, ...(pathname === '/admin' ? activeLinkStyle : {}) }}>Admin</Link>
    </nav>
  );
}

export const metadata = {
  title: 'Tree Species Expert System',
  description: 'Identify tree species by answering a few questions about their physical characteristics. Powered by AI and expert knowledge.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: '#f4f8fb', width: '100vw', minHeight: '100vh', boxSizing: 'border-box' }}>
        <NavBar />
        <div style={{ width: '100vw', minHeight: '100vh', boxSizing: 'border-box' }}>
        {children}
        </div>
      </body>
    </html>
  );
}
