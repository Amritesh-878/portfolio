import { ImageResponse } from 'next/og';

export const alt = 'Amritesh Praveen: AI/ML Engineer, documented like a system';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const CREAM = '#f2ede4';
const INK = '#1c1611';
const GOLD = '#b8792a';
const MUTED = '#6f6656';
const LINE = '#2c241b';

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        padding: 60,
        background: CREAM,
      }}
    >
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '56px 64px',
          background: CREAM,
          border: `4px solid ${LINE}`,
          borderRadius: 10,
          boxShadow: `12px 12px 0 ${LINE}`,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            marginBottom: 40,
          }}
        >
          <svg width="48" height="48" viewBox="0 0 32 32">
            <rect
              width="32"
              height="32"
              rx="7"
              fill="#ffffff"
              stroke={LINE}
              strokeWidth="1.5"
            />
            <g fill={INK}>
              <path d="M7 4 L13.5 13 L6.5 12.5 Z" />
              <path d="M25 4 L18.5 13 L25.5 12.5 Z" />
              <circle cx="16" cy="17.5" r="9" />
            </g>
            <circle cx="12.5" cy="16.5" r="1.9" fill="#ffffff" />
            <circle cx="19.5" cy="16.5" r="1.9" fill="#ffffff" />
          </svg>
          <div
            style={{
              display: 'flex',
              fontSize: 30,
              fontWeight: 600,
              color: INK,
            }}
          >
            Amritesh Praveen
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 26,
            color: GOLD,
            letterSpacing: 8,
            fontWeight: 600,
          }}
        >
          AI / ML ENGINEER
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: 14,
            fontSize: 98,
            fontWeight: 700,
            lineHeight: 1,
            color: INK,
          }}
        >
          <div style={{ display: 'flex' }}>Documented</div>
          <div style={{ display: 'flex', color: GOLD }}>like a system.</div>
        </div>
        <div
          style={{ display: 'flex', fontSize: 27, color: MUTED, marginTop: 40 }}
        >
          Read the docs, play the game, or ask my AI twin.
        </div>
      </div>
    </div>,
    { ...size },
  );
}
