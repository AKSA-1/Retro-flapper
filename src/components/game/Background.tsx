import React from 'react';

export function Background() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-sky">
      <div className="bg-volcano" data-ai-hint="volcano mountain" />
      <div className="bg-cold-mountains" data-ai-hint="snowy mountains" />
      <div className="bg-mountains" data-ai-hint="dark mountains" />
      <div className="bg-hills" data-ai-hint="green hills" />
    </div>
  );
}
