import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import './ValentineCard.css';
import TheLostSong from '../audio/TheLostSong.mp3';
import { loadFull } from 'tsparticles';
import Particles from 'react-tsparticles';
import { sendEmail } from '../api/email';
import { 
  Stage, 
  Language, 
  Theme, 
  ParticleIntensity, 
  Heart, 
  Sparkle, 
  TouchPosition,
  ValentineCardState 
} from '../types/valentine';
import { NameInput } from './valentine/NameInput';
import { QuestionStage } from './valentine/QuestionStage';
import { AcceptedStage } from './valentine/AcceptedStage';
import ThreeHeart from './ThreeHeart';

// Custom hooks for better state management
const useLocalStorage = <T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
};

const useAudio = (src: string, volume: number = 0.5) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const play = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(console.error);
      setIsPlaying(true);
    }
  }, []);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  return { audioRef, isPlaying, isMuted, play, pause, toggleMute };
};

const ValentineCard: React.FC = () => {
  // Core state
  const [stage, setStage] = useState<Stage>('input');
  const [isAccepted, setIsAccepted] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [quoteIndex, setQuoteIndex] = useState<number>(0);
  const [typedMessage, setTypedMessage] = useState<string>('');
  const [hearts, setHearts] = useState<Heart[]>([]);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [touchStart, setTouchStart] = useState<TouchPosition>({ x: 0, y: 0 });
  const [touchEnd, setTouchEnd] = useState<TouchPosition>({ x: 0, y: 0 });
  const [showSwipeHint, setShowSwipeHint] = useState<boolean>(true);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Settings state with localStorage persistence
  const [lang, setLang] = useLocalStorage<Language>('valentine-lang', 'ru');
  const [theme, setTheme] = useLocalStorage<Theme>('valentine-theme', 'romance');
  const [customMessage, setCustomMessage] = useLocalStorage<string>('valentine-custom-message', '');
  const [showCustomMessage, setShowCustomMessage] = useLocalStorage<boolean>('valentine-show-custom', false);
  const [heartCount, setHeartCount] = useLocalStorage<number>('valentine-heart-count', 5);
  const [particleIntensity, setParticleIntensity] = useLocalStorage<ParticleIntensity>('valentine-particle-intensity', 'medium');
  const [volume, setVolume] = useLocalStorage<number>('valentine-volume', 0.6);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  
  // Animation functions
  const createHeart = (x?: number, y?: number): void => {
    const heart: Heart = {
      id: Date.now() + Math.random(),
      x: x || Math.random() * window.innerWidth,
      y: y || window.innerHeight,
      size: Math.random() * 20 + 10,
      color: '#ff69b4',
      opacity: 1,
      rotation: Math.random() * 360,
      life: 1
    };
    setHearts(prev => [...prev, heart]);
    
    setTimeout(() => {
      setHearts(prev => prev.filter(h => h.id !== heart.id));
    }, 3000);
  };

  const createSparkle = (x?: number, y?: number): void => {
    const sparkle: Sparkle = {
      id: Date.now() + Math.random(),
      x: x || Math.random() * window.innerWidth,
      y: y || Math.random() * window.innerHeight,
      size: Math.random() * 8 + 4,
      color: '#ffd700',
      opacity: 1,
      rotation: Math.random() * 360,
      life: 1
    };
    setSparkles(prev => [...prev, sparkle]);
    
    setTimeout(() => {
      setSparkles(prev => prev.filter(s => s.id !== sparkle.id));
    }, 2000);
  };


  
  // Audio management
  const { audioRef, isMuted, play, toggleMute } = useAudio(TheLostSong, volume);
  
  const email = import.meta.env.VITE_EMAIL;
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const analyserDataRef = useRef<Uint8Array | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  // Restore from URL param or localStorage
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlName = params.get('name');
    const savedName = localStorage.getItem('valentine_name');
    const savedAccepted = localStorage.getItem('valentine_accepted') === '1';
    const initialName = urlName || savedName || '';
    if (initialName) {
      setName(initialName);
      if (savedAccepted) {
        setIsAccepted(true);
        setStage('accepted');
      } else {
        setStage('question');
      }
    }
  }, []);

  // Audio handling
  useEffect(() => {
    if (isAccepted && name) {
      if (!audioRef.current) {
        audioRef.current = new Audio(TheLostSong);
        audioRef.current.loop = true;
      }
      audioRef.current.volume = isMuted ? 0 : volume;
      audioRef.current
        .play()
        .catch((error) => console.log('Ошибка воспроизведения:', error));

      // Setup WebAudio analyser once
      if (!audioCtxRef.current) {
        try {
          const ctx = new (window.AudioContext || window.webkitAudioContext)();
          const src = ctx.createMediaElementSource(audioRef.current);
          const analyser = ctx.createAnalyser();
          analyser.fftSize = 512;
          analyser.smoothingTimeConstant = 0.85;
          src.connect(analyser);
          analyser.connect(ctx.destination);
          audioCtxRef.current = ctx;
          analyserRef.current = analyser;
          analyserDataRef.current = new Uint8Array(analyser.frequencyBinCount);
        } catch (e) {
          console.log('AudioContext init failed:', e);
        }
      }

      const interval = setInterval(() => {
        setQuoteIndex((prev) => (prev + 1) % 2);
      }, 5000);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [isAccepted, name, isMuted, volume]);

  // Interactive effects
  useEffect(() => {
    const handleClick = (e) => {
      if (particleIntensity !== 'low') {
        createHeart(e.clientX, e.clientY);
        createSparkle(e.clientX, e.clientY);
      }
    };

    const handleMouseMove = (e) => {
      if (particleIntensity === 'extreme' && Math.random() < 0.1) {
        createSparkle(e.clientX, e.clientY);
      }
    };

    document.addEventListener('click', handleClick);
    if (particleIntensity === 'extreme') {
      document.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [particleIntensity]);

  // Auto-celebration effect
  useEffect(() => {
    if (particleIntensity === 'extreme' && stage === 'accepted') {
      const interval = setInterval(() => {
        if (Math.random() < 0.3) {
          createHeart();
        }
        if (Math.random() < 0.5) {
          createSparkle();
        }
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [particleIntensity, stage]);

  // Typewriter for final message
  useEffect(() => {
    const full = lang === 'ru' ? 'С Днем Святого Валентина!' : "Happy Valentine's Day!";
    if (stage === 'accepted') {
      setTypedMessage('');
      let i = 0;
      const id = setInterval(() => {
        i += 1;
        setTypedMessage(full.slice(0, i));
        if (i >= full.length) clearInterval(id);
      }, 60);
      return () => clearInterval(id);
    }
  }, [stage, lang]);

  const particlesInit = async (engine) => {
    await loadFull(engine);
  };

  // Enhanced theme system with modern color palettes
  const themes = useMemo(() => ({
    romance: {
      name: 'Романтика',
      primary: '#ff6b9d',
      secondary: '#c44569',
      accent: '#f8b500',
      background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
      particles: '#ff6b9d',
      emoji: '💕'
    },
    ocean: {
      name: 'Океан',
      primary: '#4facfe',
      secondary: '#00f2fe',
      accent: '#43e97b',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      particles: '#4facfe',
      emoji: '🌊'
    },
    sunset: {
      name: 'Закат',
      primary: '#fa709a',
      secondary: '#fee140',
      accent: '#fa8072',
      background: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)',
      particles: '#fa709a',
      emoji: '🌅'
    },
    midnight: {
      name: 'Полночь',
      primary: '#667eea',
      secondary: '#764ba2',
      accent: '#9b59b6',
      background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
      particles: '#667eea',
      emoji: '🌙'
    },
    galaxy: {
      name: 'Галактика',
      primary: '#8360c3',
      secondary: '#2ebf91',
      accent: '#ffd89b',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #8360c3 100%)',
      particles: '#8360c3',
      emoji: '🌌'
    },
    aurora: {
      name: 'Аврора',
      primary: '#a8edea',
      secondary: '#fed6e3',
      accent: '#d299c2',
      background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      particles: '#a8edea',
      emoji: '🌈'
    },
    cyberpunk: {
      name: 'Киберпанк',
      primary: '#00ffff',
      secondary: '#ff00ff',
      accent: '#ffff00',
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
      particles: '#00ffff',
      emoji: '🤖'
    },
    vintage: {
      name: 'Винтаж',
      primary: '#d4af37',
      secondary: '#f5deb3',
      accent: '#b8860b',
      background: 'linear-gradient(135deg, #8b4513 0%, #daa520 50%, #f4a460 100%)',
      particles: '#d4af37',
      emoji: '📻'
    }
  }), []);
  
  const accentByTheme = {
    romance: '#FF69B4',
    ocean: '#00FFFF',
    sunset: '#FFA500',
    midnight: '#BA68C8',
    galaxy: '#8360c3',
    aurora: '#a8edea',
  };
  const accentColor = accentByTheme[theme] || '#FF69B4';

  const particlesOptions = {
    particles: {
      number: {
        value: 400,
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      localStorage.setItem('valentine_name', name.trim());
      setStage('question');
    }
  };

  const onAccept = async () => {
    setIsAccepted(true);
    setStage('accepted');
    localStorage.setItem('valentine_accepted', '1');
    launchConfetti();
    if (email) {
      try {
        await sendEmail(name, email);
      } catch (err) {
        console.log('Не удалось отправить email:', err?.message || err);
      }
    }
  };

  const onRejectHover = (e) => {
    // Move the button away playfully
    const btn = e.currentTarget;
    const maxX = Math.max(0, window.innerWidth - btn.offsetWidth - 20);
    const maxY = Math.max(0, window.innerHeight - btn.offsetHeight - 20);
    const x = Math.floor(Math.random() * maxX);
    const y = Math.floor(Math.random() * maxY);
    btn.style.position = 'fixed';
    btn.style.left = `${x}px`;
    btn.style.top = `${y}px`;
  };

  const toggleLang = () => setLang((l) => (l === 'ru' ? 'en' : 'ru'));
  // Enhanced theme management
  const cycleTheme = useCallback(() => {
    const themeKeys = Object.keys(themes);
    const currentIndex = themeKeys.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themeKeys.length;
    setTheme(themeKeys[nextIndex]);
  }, [theme, themes]);

  const setSpecificTheme = useCallback((themeName) => {
    if (themes[themeName]) {
      setTheme(themeName);
    }
  }, [themes, setTheme]);

  // Enhanced interaction handlers
  const handleNameSubmit = useCallback((e) => {
    e.preventDefault();
    if (name.trim()) {
      setStage('question');
      if (!isMuted) {
        play();
      }
    }
  }, [name, isMuted, play]);

  const handleAccept = useCallback(() => {
    setIsAccepted(true);
    setStage('accepted');
    launchConfetti();
    
    // Send email notification
    if (email) {
      fetch(import.meta.env.VITE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: email,
          subject: `💕 ${name} принял(а) твое предложение!`,
          text: `Поздравляем! ${name} сказал(а) "Да!" на твое предложение стать парой. 💕`
        })
      }).catch(console.error);
    }
  }, [name, email]);

  const handleReject = useCallback(() => {
    // Playful rejection - move the button
    const button = document.querySelector('.no-button');
    if (button) {
      const maxX = window.innerWidth - button.offsetWidth;
      const maxY = window.innerHeight - button.offsetHeight;
      const newX = Math.random() * maxX;
      const newY = Math.random() * maxY;
      
      button.style.position = 'fixed';
      button.style.left = `${newX}px`;
      button.style.top = `${newY}px`;
      button.style.zIndex = '9999';
    }
  }, []);

  const resetAll = () => {
    localStorage.removeItem('valentine_name');
    localStorage.removeItem('valentine_accepted');
    setName('');
    setIsAccepted(false);
    setStage('input');
    setTypedMessage('');
  };

  // Enhanced particle creation functions
  const createInteractiveHeart = (x = Math.random() * window.innerWidth, y = Math.random() * window.innerHeight) => {
    const heart = {
      id: Date.now() + Math.random(),
      x,
      y,
      type: 'heart',
      color: ['#ff69b4', '#ff1493', '#dc143c', '#b22222'][Math.floor(Math.random() * 4)],
      size: Math.random() * 20 + 15,
      velocity: {
        x: (Math.random() - 0.5) * 4,
        y: -Math.random() * 3 - 2
      },
      life: 1,
      decay: Math.random() * 0.02 + 0.01
    };
    setHearts(prev => [...prev, heart]);
  };

  const createInteractiveSparkle = (x = Math.random() * window.innerWidth, y = Math.random() * window.innerHeight) => {
    const sparkle = {
      id: Date.now() + Math.random(),
      x,
      y,
      type: 'sparkle',
      color: ['#ffd700', '#ffff00', '#ffa500', '#ff69b4'][Math.floor(Math.random() * 4)],
      size: Math.random() * 8 + 4,
      velocity: {
        x: (Math.random() - 0.5) * 6,
        y: (Math.random() - 0.5) * 6
      },
      life: 1,
      decay: Math.random() * 0.03 + 0.02,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10
    };
    setSparkles(prev => [...prev, sparkle]);
  };

  // Interactive event handlers
  const handleMouseClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Create burst of hearts and sparkles at click position
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        createInteractiveHeart(x + (Math.random() - 0.5) * 50, y + (Math.random() - 0.5) * 50);
        createInteractiveSparkle(x + (Math.random() - 0.5) * 50, y + (Math.random() - 0.5) * 50);
      }, i * 100);
    }
  };

  const handleMouseMove = (e) => {
    if (Math.random() < 0.1) { // 10% chance on mouse move
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      createInteractiveSparkle(x, y);
    }
  };

  // Touch handlers for mobile
  const handleTouchStart = useCallback((e) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (particleIntensity === 'none') return;
    
    const touch = e.touches[0];
    if (Math.random() < 0.2) {
      createInteractiveSparkle(touch.clientX, touch.clientY);
    }
  }, [particleIntensity]);

  const handleTouchEnd = useCallback((e) => {
    const touch = e.changedTouches[0];
    setTouchEnd({ x: touch.clientX, y: touch.clientY });
    
    // Create burst effect on touch
    createInteractiveHeart(touch.clientX, touch.clientY);
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        createInteractiveSparkle(
          touch.clientX + (Math.random() - 0.5) * 50,
          touch.clientY + (Math.random() - 0.5) * 50
        );
      }, i * 100);
    }

    // Check for swipe gestures
    const deltaX = touchEnd.x - touchStart.x;
    const deltaY = touchEnd.y - touchStart.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    if (distance > 50) {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (deltaX > 0) {
          // Swipe right - next theme
          cycleTheme();
        } else {
           // Swipe left - previous theme
           const themeKeys = Object.keys(themes);
           const currentIndex = themeKeys.indexOf(theme);
           const prevIndex = currentIndex === 0 ? themeKeys.length - 1 : currentIndex - 1;
           setTheme(themeKeys[prevIndex]);
         }
       }
       // Hide swipe hint after first swipe
       setShowSwipeHint(false);
     }
   }, [touchStart, touchEnd, theme, themes, cycleTheme, setTheme]);

  // Compute texts unconditionally (no hooks after conditional returns)
  const texts = [
    lang === 'ru' ? `Будешь моей девушкой, ${name}?` : `Will you be my girlfriend, ${name}?`,
    lang === 'ru' ? `Ты мое сердечко, ${name}` : `You are my sweetheart, ${name}`,
  ];

  if (stage === 'input') {
    return (
      <NameInput
        name={name}
        onNameChange={setName}
        onSubmit={handleSubmit}
        lang={lang}
        theme={theme}
        onToggleLang={toggleLang}
        onCycleTheme={cycleTheme}
      />
    );
  }

  if (stage === 'question') {
    return (
      <QuestionStage
        name={name}
        lang={lang}
        theme={theme}
        themes={themes}
        quoteIndex={quoteIndex}
        hearts={hearts}
        sparkles={sparkles}
        showSwipeHint={showSwipeHint}
        showSettings={showSettings}
        customMessage={customMessage}
        showCustomMessage={showCustomMessage}
        heartCount={heartCount}
        particleIntensity={particleIntensity}
        isMuted={isMuted}
        cardRef={cardRef}
        overlayRef={overlayRef}
        onAccept={onAccept}
        onRejectHover={onRejectHover}
        onToggleLang={toggleLang}
        onToggleMute={toggleMute}
        onCycleTheme={cycleTheme}
        onSetTheme={setTheme}
        onToggleSettings={() => setShowSettings(!showSettings)}
        onResetAll={resetAll}
        onCustomMessageChange={setCustomMessage}
        onShowCustomMessageChange={setShowCustomMessage}
        onHeartCountChange={setHeartCount}
        onParticleIntensityChange={setParticleIntensity}
        onMouseMove={(e) => {
          if (!overlayRef.current) return;
          spawnTrailHeart(e.clientX, e.clientY);
          handleMouseMove(e);
        }}
        onMouseClick={handleMouseClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />
    );
  }

  return (
    <AcceptedStage
      name={name}
      lang={lang}
      theme={theme}
      isAccepted={isAccepted}
      hearts={hearts}
      sparkles={sparkles}
      showSwipeHint={showSwipeHint}
      showCustomMessage={showCustomMessage}
      customMessage={customMessage}
      heartCount={heartCount}
      quoteIndex={quoteIndex}
      texts={texts}
      typedMessage={typedMessage}
      volume={volume}
      isMuted={isMuted}
      particleIntensity={particleIntensity}
      cardRef={cardRef}
      overlayRef={overlayRef}
      particlesInit={particlesInit}
      particlesOptions={particlesOptions}
      accentColor={accentColor}
      analyserRef={analyserRef}
      analyserDataRef={analyserDataRef}
      ThreeHeart={ThreeHeart}
      Particles={Particles}
      onToggleLang={toggleLang}
      onToggleMute={toggleMute}
      onCycleTheme={cycleTheme}
      onResetAll={resetAll}
      onVolumeChange={setVolume}
      onMouseMove={(e) => {
        if (!overlayRef.current) return;
        spawnTrailHeart(e.clientX, e.clientY);
      }}
      onMouseClick={handleMouseClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    />
  );
};

// Effects helpers
function spawnTrailHeart(x, y) {
  const layer = document.querySelector('.trail-layer');
  if (!layer) return;
  const el = document.createElement('span');
  el.className = 'trail-heart';
  el.style.left = `${x - 8}px`;
  el.style.top = `${y - 8}px`;
  el.style.setProperty('--rz', `${Math.floor(Math.random() * 360)}deg`);
  layer.appendChild(el);
  setTimeout(() => {
    el.remove();
  }, 900);
}

function launchConfetti() {
  const layer = document.querySelector('.trail-layer');
  if (!layer) return;
  const colors = ['#FF69B4', '#FFD700', '#00FFFF', '#BA68C8', '#FF8A65'];
  const count = 80;
  for (let i = 0; i < count; i += 1) {
    const el = document.createElement('span');
    el.className = 'confetti';
    el.style.left = `${Math.random() * 100}%`;
    el.style.backgroundColor = colors[i % colors.length];
    el.style.setProperty('--tx', `${(Math.random() - 0.5) * 200}px`);
    el.style.setProperty('--rz', `${Math.floor(Math.random() * 360)}deg`);
    el.style.animationDelay = `${Math.random() * 0.3}s`;
    layer.appendChild(el);
    setTimeout(() => el.remove(), 3000);
  }
}

export default ValentineCard;
