import React, { useRef } from 'react';
import { Particles } from '@tsparticles/react';
import { AcceptedStageProps } from '../../types/valentine';
import { InteractiveParticles } from './InteractiveParticles';
import { Controls } from './Controls';
import { SettingsPanel } from './SettingsPanel';
import ThreeHeart from '../ThreeHeart';

export const AcceptedStage: React.FC<AcceptedStageProps> = ({
  name,
  lang,
  theme,
  hearts,
  sparkles,
  onMouseClick,
  onMouseMove,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onToggleLang,
  onCycleTheme,
  showSettings,
  onToggleSettings,
  particleIntensity,
  onParticleIntensityChange,
  onReset,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const accentByTheme: Record<string, string> = {
    romance: '#FF69B4',
    ocean: '#00FFFF',
    sunset: '#FFA500',
    midnight: '#BA68C8',
    galaxy: '#8360c3',
    aurora: '#a8edea',
    cyberpunk: '#00ffff',
    vintage: '#d4af37',
  };

  const accentColor = accentByTheme[theme] || '#FF69B4';

  const particlesOptions = {
    particles: {
      number: {
        value: particleIntensity === 'none' ? 0 : 
               particleIntensity === 'low' ? 150 :
               particleIntensity === 'medium' ? 300 :
               particleIntensity === 'high' ? 450 : 600,
        density: {
          enable: true,
          value_area: 400,
        },
      },
      color: { value: accentColor },
      shape: {
        type: 'heart',
        stroke: {
          width: 0.5,
          color: accentColor,
        },
      },
      opacity: {
        value: 0.9,
        random: true,
      },
      size: {
        value: 3,
        random: true,
      },
      move: {
        enable: true,
        speed: 3,
        direction: 'top',
        random: true,
        straight: false,
        outMode: 'out',
      },
      lineLinked: {
        enable: false,
      },
    },
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: 'repulse',
        },
        onClick: {
          enable: true,
          mode: 'push',
        },
      },
      modes: {
        repulse: {
          distance: 100,
          duration: 0.4,
        },
        push: {
          particles_nb: 4,
        },
      },
    },
    retinaDetect: true,
  };

  return (
    <div 
      className={`valentine-card theme-${theme} accepted`} 
      onMouseMove={onMouseMove}
      onClick={onMouseClick}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      ref={cardRef}
      role="main"
      aria-label={lang === 'ru' ? 'Валентинка с принятием' : 'Valentine card with acceptance'}
    >
      <div ref={overlayRef} className="trail-layer" />
      
      {/* Controls */}
      <Controls
        lang={lang}
        theme={theme}
        onToggleLang={onToggleLang}
        onCycleTheme={onCycleTheme}
        showSettings={showSettings}
        onToggleSettings={onToggleSettings}
      />

      {/* Settings Panel */}
      {showSettings && (
        <SettingsPanel
          lang={lang}
          particleIntensity={particleIntensity}
          onParticleIntensityChange={onParticleIntensityChange}
          onReset={onReset}
        />
      )}

      {/* Interactive Particles */}
      <InteractiveParticles hearts={hearts} sparkles={sparkles} theme={theme} />

      {/* Background Particles */}
      {particleIntensity !== 'none' && (
        <Particles
          id="tsparticles-accepted"
          options={particlesOptions}
          className="particles-bg"
        />
      )}

      {/* 3D Heart */}
      <div className="three-heart-container">
        <ThreeHeart />
      </div>

      {/* Main Content */}
      <div className="card-content accepted-content">
        <h1 className="accepted-text" role="heading" aria-level={1}>
          {lang === 'ru' ? `Ура! ${name}, теперь мы вместе! 💕` : `Yay! ${name}, now we're together! 💕`}
        </h1>
        
        <div className="celebration-message">
          <p className="love-message">
            {lang === 'ru' 
              ? 'Ты сделала меня самым счастливым! 🌟' 
              : 'You made me the happiest! 🌟'
            }
          </p>
          <div className="heart-animation">
            <span className="beating-heart">💖</span>
          </div>
        </div>

        <div className="romantic-quote">
          <p>
            {lang === 'ru' 
              ? '"Любовь - это когда два сердца бьются в унисон"' 
              : '"Love is when two hearts beat in unison"'
            }
          </p>
        </div>
      </div>
    </div>
  );
};