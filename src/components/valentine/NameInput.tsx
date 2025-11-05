import React from 'react';
import { NameInputProps } from '../../types/valentine';
import { Controls } from './Controls';

export const NameInput: React.FC<NameInputProps> = ({
  name,
  onNameChange,
  onSubmit,
  lang,
  theme,
  onToggleLang,
  onCycleTheme,
}) => {
  return (
    <div className={`input-container theme-${theme}`}>
      <Controls
        lang={lang}
        theme={theme}
        onToggleLang={onToggleLang}
        onCycleTheme={onCycleTheme}
      />
      <h1>{lang === 'ru' ? 'Напиши своё имя' : 'Write your name'}</h1>
      <form onSubmit={onSubmit} className="name-form">
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder={lang === 'ru' ? 'Введи имя...' : 'Enter name...'}
          className="name-input"
          autoFocus
          aria-label={lang === 'ru' ? 'Введите ваше имя' : 'Enter your name'}
        />
        <button type="submit" className="submit-button" disabled={!name.trim()}>
          {lang === 'ru' ? 'Войти' : 'Enter'}
        </button>
      </form>
    </div>
  );
};