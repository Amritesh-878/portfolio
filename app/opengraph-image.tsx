import { ImageResponse } from 'next/og';

export const alt = 'Amritesh Praveen: AI/ML Engineer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '80px',
        background: '#17140f',
        color: '#ece7de',
      }}
    >
      <div style={{ display: 'flex', fontSize: 34, color: '#fbac23' }}>
        Amritesh Praveen
      </div>
      <div
        style={{
          display: 'flex',
          fontSize: 70,
          fontWeight: 700,
          marginTop: 12,
        }}
      >
        AI/ML Engineer
      </div>
      <div
        style={{
          display: 'flex',
          fontSize: 30,
          color: '#a89f8f',
          marginTop: 24,
        }}
      >
        RAG systems · reinforcement learning · NLP
      </div>
      <div
        style={{
          display: 'flex',
          fontSize: 22,
          color: '#6f675b',
          marginTop: 48,
        }}
      >
        a documentation site, with an AI twin and a playable RL game
      </div>
    </div>,
    { ...size },
  );
}
