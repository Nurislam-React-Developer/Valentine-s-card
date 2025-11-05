export type Stage = 'input' | 'question' | 'accepted';

export type Language = 'ru' | 'en';

export type Theme = 'romance' | 'ocean' | 'sunset' | 'midnight' | 'galaxy' | 'aurora' | 'cyberpunk' | 'vintage';

export type ParticleIntensity = 'none' | 'low' | 'medium' | 'high' | 'extreme';

export interface Heart {
  id: string | number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  rotation: number;
  type?: 'heart';
  color?: string;
  velocity?: {
    x: number;
    y: number;
  };
  life?: number;
  decay?: number;
}

export interface Sparkle {
  id: string | number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  type?: 'sparkle';
  color?: string;
  velocity?: {
    x: number;
    y: number;
  };
  life?: number;
  decay?: number;
  rotation?: number;
  rotationSpeed?: number;
}

export interface TouchPosition {
  x: number;
  y: number;
}

export interface ThemeConfig {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  particles: string;
  emoji: string;
}

export interface ValentineCardState {
  stage: Stage;
  isAccepted: boolean;
  name: string;
  quoteIndex: number;
  typedMessage: string;
  hearts: Heart[];
  sparkles: Sparkle[];
  touchStart: TouchPosition;
  touchEnd: TouchPosition;
  showSwipeHint: boolean;
  lang: Language;
  theme: Theme;
  customMessage: string;
  showCustomMessage: boolean;
  heartCount: number;
  particleIntensity: ParticleIntensity;
  volume: number;
  showSettings: boolean;
}

export interface NameInputProps {
  name: string;
  onNameChange: (name: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  lang: Language;
  theme: Theme;
  onToggleLang: () => void;
  onCycleTheme: () => void;
}

export interface QuestionStageProps {
  name: string;
  lang: Language;
  theme: Theme;
  quoteIndex: number;
  onAccept: () => void;
  onReject: () => void;
  hearts: Heart[];
  sparkles: Sparkle[];
  onMouseClick: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
  showSwipeHint: boolean;
  particleIntensity: ParticleIntensity;
}

export interface AcceptedStageProps {
  name: string;
  lang: Language;
  theme: Theme;
  typedMessage: string;
  hearts: Heart[];
  sparkles: Sparkle[];
  onMouseClick: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onReset: () => void;
  showSettings: boolean;
  onToggleSettings: () => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
  particleIntensity: ParticleIntensity;
  onParticleIntensityChange: (intensity: ParticleIntensity) => void;
  customMessage: string;
  onCustomMessageChange: (message: string) => void;
  showCustomMessage: boolean;
  onToggleCustomMessage: () => void;
}

export interface InteractiveParticlesProps {
  hearts: Heart[];
  sparkles: Sparkle[];
  theme: Theme;
}

export interface ControlsProps {
  lang: Language;
  theme: Theme;
  onToggleLang: () => void;
  onCycleTheme: () => void;
  showSettings?: boolean;
  onToggleSettings?: () => void;
}

export interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
  particleIntensity: ParticleIntensity;
  onParticleIntensityChange: (intensity: ParticleIntensity) => void;
  customMessage: string;
  onCustomMessageChange: (message: string) => void;
  showCustomMessage: boolean;
  onToggleCustomMessage: () => void;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  lang: Language;
}