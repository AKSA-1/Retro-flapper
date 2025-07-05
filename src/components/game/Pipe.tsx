import React from 'react';

type PipeProps = {
  pipeX: number;
  pipeWidth: number;
  gapY: number;
  gapSize: number;
  gameHeight: number;
};

export function Pipe({ pipeX, pipeWidth, gapY, gapSize, gameHeight }: PipeProps) {
  const topPipeHeight = gapY - gapSize / 2;
  const bottomPipeHeight = gameHeight - (gapY + gapSize / 2);

  return (
    <div style={{ position: 'absolute', left: pipeX, top: 0, width: pipeWidth, height: gameHeight, zIndex: 10 }} aria-hidden="true">
      {/* Top Pipe */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          width: '100%',
          height: topPipeHeight,
          background: 'linear-gradient(to right, #72BF6A, #5A9A53)',
          borderLeft: '5px solid #487A42',
          borderRight: '5px solid #487A42',
          boxSizing: 'border-box'
        }}
      >
        <div 
          style={{
            position: 'absolute',
            bottom: 0,
            left: '-10px',
            width: 'calc(100% + 20px)',
            height: '40px',
            background: 'linear-gradient(to right, #82CF7A, #6ABF63)',
            border: '5px solid #487A42',
            borderRadius: '10px',
            boxSizing: 'border-box'
          }}
        />
      </div>
      {/* Bottom Pipe */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          height: bottomPipeHeight,
          background: 'linear-gradient(to right, #72BF6A, #5A9A53)',
          borderLeft: '5px solid #487A42',
          borderRight: '5px solid #487A42',
          boxSizing: 'border-box'
        }}
      >
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: '-10px',
            width: 'calc(100% + 20px)',
            height: '40px',
            background: 'linear-gradient(to right, #82CF7A, #6ABF63)',
            border: '5px solid #487A42',
            borderRadius: '10px',
            boxSizing: 'border-box'
          }}
        />
      </div>
    </div>
  );
}
