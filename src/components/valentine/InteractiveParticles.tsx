import React from 'react';
import { InteractiveParticlesProps } from '../../types/valentine';

export const InteractiveParticles: React.FC<InteractiveParticlesProps> = ({
  hearts,
  sparkles,
  theme,
}) => {
  return (
    <div className="particles-container">
      {/* Hearts */}
      {hearts.map(heart => (
        <div
          key={heart.id}
          className="floating-heart animate-heartbeat"
          style={{
            left: `${heart.x}px`,
            top: `${heart.y}px`,
            fontSize: `${heart.size}px`,
            color: heart.color || '#ff69b4',
            opacity: heart.life || heart.opacity,
            transform: `rotate(${heart.rotation}deg)`,
            pointerEvents: 'none',
            position: 'absolute',
            zIndex: 100,
            animation: 'heartFloat 3s ease-out forwards',
          }}
          aria-hidden="true"
        >
          ❤️
        </div>
      ))}

      {/* Sparkles */}
      {sparkles.map(sparkle => (
        <div
          key={sparkle.id}
          className="floating-sparkle"
          style={{
            left: `${sparkle.x}px`,
            top: `${sparkle.y}px`,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
            backgroundColor: sparkle.color || '#ffd700',
            opacity: sparkle.life || sparkle.opacity,
            transform: `rotate(${sparkle.rotation || 0}deg)`,
            pointerEvents: 'none',
            position: 'absolute',
            zIndex: 99,
            borderRadius: '50%',
            animation: 'sparkleFloat 2s ease-out forwards',
            boxShadow: `0 0 ${sparkle.size * 2}px ${sparkle.color || '#ffd700'}`,
          }}
          aria-hidden="true"
        />
      ))}
    </div>
  );
};