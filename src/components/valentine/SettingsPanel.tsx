import React from 'react';
import { SettingsPanelProps } from '../../types/valentine';

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  lang,
  particleIntensity,
  onParticleIntensityChange,
  onReset,
}) => {
  const intensityOptions = [
    { value: 'none', label: lang === 'ru' ? 'Выкл' : 'Off' },
    { value: 'low', label: lang === 'ru' ? 'Низкая' : 'Low' },
    { value: 'medium', label: lang === 'ru' ? 'Средняя' : 'Medium' },
    { value: 'high', label: lang === 'ru' ? 'Высокая' : 'High' },
    { value: 'ultra', label: lang === 'ru' ? 'Ультра' : 'Ultra' },
  ];

  return (
    <div className="settings-panel" role="dialog" aria-label={lang === 'ru' ? 'Панель настроек' : 'Settings panel'}>
      <h3>{lang === 'ru' ? 'Настройки' : 'Settings'}</h3>
      
      <div className="setting-group">
        <label htmlFor="particle-intensity">
          {lang === 'ru' ? 'Интенсивность частиц:' : 'Particle Intensity:'}
        </label>
        <select
          id="particle-intensity"
          value={particleIntensity}
          onChange={(e) => onParticleIntensityChange(e.target.value as any)}
          className="setting-select"
          aria-describedby="particle-intensity-desc"
        >
          {intensityOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <small id="particle-intensity-desc" className="setting-description">
          {lang === 'ru' 
            ? 'Управляет количеством анимированных частиц на экране' 
            : 'Controls the number of animated particles on screen'
          }
        </small>
      </div>

      <div className="setting-group">
        <button 
          className="reset-button"
          onClick={onReset}
          aria-label={lang === 'ru' ? 'Сбросить все настройки и начать заново' : 'Reset all settings and start over'}
        >
          {lang === 'ru' ? '🔄 Начать заново' : '🔄 Start Over'}
        </button>
      </div>
    </div>
  );
};