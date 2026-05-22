import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Bahia Palace Tickets — Skip the Line in Marrakech';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #3D2817 0%, #5C3D20 50%, #3D2817 100%)',
          fontFamily: 'serif',
          position: 'relative',
        }}
      >
        {/* Decorative border */}
        <div style={{
          position: 'absolute', inset: 20,
          border: '2px solid rgba(232,163,61,0.4)',
          borderRadius: 16,
          display: 'flex',
        }} />

        {/* Gold label */}
        <div style={{
          fontSize: 18, fontWeight: 700, letterSpacing: '0.3em',
          textTransform: 'uppercase', color: '#E8A33D', marginBottom: 16,
          display: 'flex',
        }}>
          Bahia Palace · Marrakech
        </div>

        {/* Main headline */}
        <div style={{
          fontSize: 72, fontWeight: 700, color: '#FFFFFF',
          lineHeight: 1, textAlign: 'center', marginBottom: 12,
          display: 'flex',
        }}>
          Skip the Line
        </div>

        {/* Sub */}
        <div style={{
          fontSize: 28, color: 'rgba(255,255,255,0.65)',
          fontStyle: 'italic', marginBottom: 40,
          display: 'flex',
        }}>
          Instant tickets · No waiting
        </div>

        {/* Price pill */}
        <div style={{
          background: '#C4452D', color: '#fff',
          fontSize: 22, fontWeight: 700,
          padding: '12px 32px', borderRadius: 50,
          display: 'flex',
        }}>
          From $10 per person
        </div>
      </div>
    ),
    { ...size },
  );
}
