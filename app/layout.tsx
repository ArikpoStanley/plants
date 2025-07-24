import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tree Identification Expert System",
  description: "AI-powered plant and tree identification system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav style={{
          background: 'linear-gradient(90deg, #1e40af 0%, #3b82f6 100%)',
          padding: '1rem 2rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          position: 'sticky',
          top: 0,
          zIndex: 1000
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Link href="/" style={{
              color: 'white',
              textDecoration: 'none',
              fontSize: '1.5rem',
              fontWeight: 'bold'
            }}>
              🌳 Tree ID Expert
            </Link>
            <div style={{ display: 'flex', gap: '2rem' }}>
              <Link href="/" style={{
                color: 'white',
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'opacity 0.2s'
              }}>
                Home
              </Link>
              <Link href="/identify" style={{
                color: 'white',
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'opacity 0.2s'
              }}>
                Identify
              </Link>
              <Link href="/history" style={{
                color: 'white',
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'opacity 0.2s'
              }}>
                History
              </Link>
              <Link href="/collections" style={{
                color: 'white',
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'opacity 0.2s'
              }}>
                Collections
              </Link>
              <Link href="/admin" style={{
                color: 'white',
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'opacity 0.2s'
              }}>
                Admin
              </Link>
            </div>
          </div>
        </nav>
        <main style={{ width: '100vw', minHeight: '100vh' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
