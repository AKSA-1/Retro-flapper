import React from 'react';

type BirdProps = {
  birdPosition: number;
  birdSize: number;
};

export function Bird({ birdPosition, birdSize }: BirdProps) {
  return (
    <div
      style={{
        position: 'absolute',
        top: birdPosition,
        left: 100,
        width: birdSize,
        height: birdSize,
      }}
      aria-label="Player's bird"
    >
      <svg viewBox="0 0 100 100" style={{ width: '120%', height: '120%', transform: 'translate(-8%, -8%)' }}>
          <defs>
            <radialGradient id="grad-body" cx="50%" cy="50%" r="50%" fx="65%" fy="35%">
              <stop offset="0%" style={{stopColor: '#ff6b6b'}} />
              <stop offset="100%" style={{stopColor: '#c0392b'}} />
            </radialGradient>
            <radialGradient id="grad-belly" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" style={{stopColor: '#fdfbfb'}} />
              <stop offset="100%" style={{stopColor: '#ebedee'}} />
            </radialGradient>
          </defs>
          <circle cx="50" cy="53" r="40" fill="url(#grad-body)" stroke="#3d1e1e" strokeWidth="4" />
          <path d="M 30 65 C 40 85, 60 85, 70 65" fill="url(#grad-belly)" />
          <circle cx="65" cy="45" r="12" fill="white" stroke="black" strokeWidth="1" />
          <circle cx="68" cy="45" r="5" fill="black" />
          <circle cx="35" cy="45" r="12" fill="white" stroke="black" strokeWidth="1" />
          <circle cx="38" cy="45" r="5" fill="black" />
          <path d="M 20 32 L 45 38" stroke="#3d1e1e" strokeWidth="6" strokeLinecap="round" transform="rotate(-15, 32.5, 35)" />
          <path d="M 55 38 L 80 32" stroke="#3d1e1e" strokeWidth="6" strokeLinecap="round" transform="rotate(15, 67.5, 35)" />
          <polygon points="45,60 55,60 50,72" fill="#f39c12" stroke="#e67e22" strokeWidth="2" strokeLinejoin="round" />
        </svg>
    </div>
  );
}
