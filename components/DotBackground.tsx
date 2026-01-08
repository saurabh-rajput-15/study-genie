import React from 'react';

const DotBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 h-full w-full bg-black overflow-hidden">
      {/* Dot grid pattern */}
      <div
        className="absolute inset-0 h-full w-full"
        style={{
          backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.15) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      {/* Gradient overlay for depth effect */}
      <div 
        className="absolute inset-0 h-full w-full"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(120, 119, 198, 0.3), transparent)',
        }}
      />
      {/* Subtle vignette effect */}
      <div 
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.5) 100%)',
        }}
      />
      {/* Animated glow spots */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
    </div>
  );
};

export default DotBackground;