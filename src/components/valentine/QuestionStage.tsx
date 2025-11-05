import React, { useRef } from 'react';
import { Particles } from '@tsparticles/react';
import { QuestionStageProps } from '../../types/valentine';
import { InteractiveParticles } from './InteractiveParticles';
import ThreeHeart from '../ThreeHeart';

export const QuestionStage: React.FC<QuestionStageProps> = ({
  name,
  lang,
  theme,
  quoteIndex,
  onAccept,
  onReject,
  hearts,
  sparkles,
  onMouseClick,
  onMouseMove,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  showSwipeHint,
  particleIntensity,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const texts = [
    lang === 'ru' ? `Будешь моей девушкой, ${name}?` : `Will you be my girlfriend, ${name}?`,
    lang === 'ru' ? `Ты мое сердечко, ${name}` : `You are my sweetheart, ${name}`,
  ];

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
               particleIntensity === 'low' ? 100 :
               particleIntensity === 'medium' ? 200 :
               particleIntensity === 'high' ? 300 : 400,
        density: {
          enable: true,
          value_area: 600,
        },
      },
      color: { value: accentColor },
      shape: {
        type: 'line',
        stroke: {
          width: 0.2,
          color: accentColor,
        },
      },
      opacity: {
        value: 0.8,
        random: true,
      },
      size: {
        value: 1.5,
        random: true,
      },
      move: {
        enable: true,
        speed: 2.5,
        direction: 'none',
        random: true,
        straight: false,
        outMode: 'out',
        attract: {
          enable: true,
          rotateX: 1000,
          rotateY: 2000,
        },
      },
      lineLinked: {
        enable: false,
      },
    },
    interactivity: {
      events: {
        onHover: {
          enable: false,
        },
        onClick: {
          enable: false,
        },
      },
    },
    retinaDetect: true,
  };

  const handleRejectHover = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget;
    const maxX = Math.max(0, window.innerWidth - btn.offsetWidth - 20);
    const maxY = Math.max(0, window.innerHeight - btn.offsetHeight - 20);
    const x = Math.floor(Math.random() * maxX);
    const y = Math.floor(Math.random() * maxY);
    btn.style.position = 'fixed';
    btn.style.left = `${x}px`;
    btn.style.top = `${y}px`;
    btn.style.zIndex = '9999';
  };

  return (
    <div 
      className={`valentine-card theme-${theme}`} 
      onMouseMove={onMouseMove}
      onClick={onMouseClick}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      ref={cardRef}
      role="main"
      aria-label={lang === 'ru' ? 'Валентинка с вопросом' : 'Valentine card with question'}
    >
      <div ref={overlayRef} className="trail-layer" />
      
      {/* Interactive Particles */}
      <InteractiveParticles hearts={hearts} sparkles={sparkles} theme={theme} />

      {/* Background Particles */}
      {particleIntensity !== 'none' && (
        <Particles
          id="tsparticles"
          options={particlesOptions}
          className="particles-bg"
        />
      )}

      {/* 3D Heart */}
      <div className="three-heart-container">
        <ThreeHeart />
      </div>

      {/* Main Content */}
      <div className="card-content">
        <h1 className="question-text" role="heading" aria-level={1}>
          {texts[quoteIndex]}
        </h1>
        
        <div className="buttons-container" role="group" aria-label={lang === 'ru' ? 'Варианты ответа' : 'Answer options'}>
          <button 
            className="yes-button"
            onClick={onAccept}
            aria-label={lang === 'ru' ? 'Согласиться стать парой' : 'Agree to be together'}
          >
            {lang === 'ru' ? 'Да! 💕' : 'Yes! 💕'}
          </button>
          <button 
            className="no-button"
            onMouseEnter={handleRejectHover}
            onClick={onReject}
            aria-label={lang === 'ru' ? 'Отказаться' : 'Decline'}
          >
            {lang === 'ru' ? 'Нет' : 'No'}
          </button>
        </div>

        {/* Swipe Hint */}
        {showSwipeHint && (
          <div className="swipe-hint" aria-live="polite">
            <p>{lang === 'ru' ? '👆 Свайпни для смены темы' : '👆 Swipe to change theme'}</p>
          </div>
        )}
      </div>
    </div>
  );
};