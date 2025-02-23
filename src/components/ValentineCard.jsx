import React, { useState, useEffect } from 'react';
import './ValentineCard.css';
import TheLostSong from '../audio/TheLostSong.mp3';
import { Particles } from '@tsparticles/react';
import { loadFull } from 'tsparticles';
import { useDispatch, useSelector } from 'react-redux';
import { getPost } from '../store/request';


const ValentineCard = () => {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.date);
  const [isAccepted, setIsAccepted] = useState(false);
  const [name, setName] = useState('');
  const [showInput, setShowInput] = useState(true);
  const [quoteIndex, setQuoteIndex] = useState(0);

  // Получаем email из .env с отладкой
  console.log('Email из .env:', import.meta.env.VITE_EMAIL);
	const email = import.meta.env.VITE_EMAIL;

  useEffect(() => {
    if (isAccepted && name) {
      const audio = new Audio(TheLostSong);
      audio.loop = true;
      audio
        .play()
        .catch((error) => console.log('Ошибка воспроизведения:', error));

      const interval = setInterval(() => {
        setQuoteIndex((prev) => (prev + 1) % 2);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isAccepted, name]);

  const particlesInit = async (engine) => {
    await loadFull(engine);
  };

  const particlesOptions = {
    particles: {
      number: {
        value: 400,
        density: {
          enable: true,
          value_area: 600,
        },
      },
      color: {
        value: '#00FFFF',
      },
      shape: {
        type: 'line',
        stroke: {
          width: 0.2,
          color: '#00FFFF',
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
      setShowInput(false);
      setIsAccepted(true);
      sendNameToEmail(name); // Отправляем имя на email
    }
  };

  // Отправка имени на email через EmailJS с отладкой
 const sendNameToEmail = async (userName) => {
    try {
      await dispatch(getPost({ name: userName })).unwrap();
      console.log('Name sent successfully');
    } catch (error) {
      console.error('Failed to send name:', error);
    }
  }

  if (showInput) {
    return (
      <div className="input-container">
        <h1>Напиши своё имя</h1>
        <form onSubmit={handleSubmit} className="name-form">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Введи имя..."
            className="name-input"
          />
          <button type="submit" className="submit-button">
            Войти
          </button>
        </form>
      </div>
    );
  }

  const texts = [
    `Будешь моей девушкой, ${name}?`,
    `Will you be my girlfriend, ${name}?`,
  ];

  return (
    <div className="valentine-card">
      {isAccepted && name ? (
        <div className="heart-container">
          <div className="top-hearts">
            <span className="small-heart" style={{ left: '20%' }} />
            <span className="small-heart" style={{ left: '40%' }} />
            <span className="small-heart" style={{ left: '60%' }} />
            <span className="small-heart" style={{ left: '80%' }} />
          </div>
          <div className="quote-left">
            <p key={quoteIndex} className="quote-text">
              "{texts[quoteIndex]}" <span className="heart-icon" />
            </p>
          </div>
          <Particles
            id="heart-particles"
            init={particlesInit}
            options={particlesOptions}
            className="heart-animation"
          />
          <svg
            className="heart-outline"
            viewBox="0 0 24 24"
            width="300"
            height="300"
          >
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              fill="none"
              stroke="red"
              strokeWidth="1"
              strokeLinecap="round"
            />
          </svg>
          <div className="quote-right">
            <p key={quoteIndex} className="quote-text">
              "{texts[quoteIndex === 0 ? 1 : 0]}" <span className="heart-icon" />
            </p>
          </div>
          <p className="message">С Днем Святого Валентина!</p>
        </div>
      ) : null}
    </div>
  );
};

export default ValentineCard;