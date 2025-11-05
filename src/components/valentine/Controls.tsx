import React from 'react';
import { ControlsProps } from '../../types/valentine';

export const Controls: React.FC<ControlsProps> = ({
  lang,
  theme,
  onToggleLang,
  onCycleTheme,
  showSettings,
  onToggleSettings,
}) => {
  return (
    <div className="controls">
      <button 
        className="control-btn" 
        onClick={onToggleLang}
        aria-label={lang === 'ru' ? 'Переключить на английский' : 'Switch to Russian'}
        title={lang === 'ru' ? 'Переключить язык' : 'Switch language'}
      >
        {lang === 'ru' ? 'EN' : 'RU'}
      </button>
      <button 
        className="control-btn" 
        onClick={onCycleTheme} 
        title={lang === 'ru' ? 'Сменить тему' : 'Change theme'}
        aria-label={lang === 'ru' ? 'Сменить тему оформления' : 'Change theme'}
      >
        🎨
      </button>
      {onToggleSettings && (
        <button 
          className="control-btn" 
          onClick={onToggleSettings}
          title={lang === 'ru' ? 'Настройки' : 'Settings'}
          aria-label={lang === 'ru' ? 'Открыть настройки' : 'Open settings'}
        >
          ⚙️
        </button>
      )}
    </div>
  );
};