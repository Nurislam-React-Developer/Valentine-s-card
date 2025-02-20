import React, { useState, useEffect } from 'react';
import './ValentineCard.css';
import TheLostSong from '../audio/TheLostSong.mp3'; // Твой путь к файлу
import { Particles } from '@tsparticles/react';
import {loadFull} from 'tsparticles'
const quotes = [
	{
		en: 'Love is not a dish you can order.',
		ru: 'Любовь — это не блюдо, которое можно заказать.',
	},
	{ en: 'You’re my recipe for happiness.', ru: 'Ты — мой рецепт счастья.' },
	{
		en: 'The heart is the main ingredient.',
		ru: 'Сердце — главный ингредиент.',
	},
	{ en: 'Cooking with you is my dream.', ru: 'Готовить с тобой — моя мечта.' },
];

const ValentineCard = () => {
	const [isAccepted, setIsAccepted] = useState(false);
	const [quoteIndex, setQuoteIndex] = useState(0);

	useEffect(() => {
		if (isAccepted) {
			const audio = new Audio(TheLostSong);
			audio.loop = true;
			audio
				.play()
				.catch((error) => console.log('Ошибка воспроизведения:', error));

			const interval = setInterval(() => {
				setQuoteIndex((prev) => (prev + 1) % quotes.length);
			}, 5000);
			return () => clearInterval(interval);
		}
	}, [isAccepted]);

	// Инициализация частиц
	useEffect(() => {
		if (isAccepted) {
			loadFull(Particles).then(() => {
				const particlesOptions = {
					particles: {
						number: {
							value: 300, // Увеличим количество для плотности, как на скриншоте
							density: {
								enable: true,
								value_area: 800,
							},
						},
						color: {
							value: '#00FFFF', // Синий цвет, как на фото
						},
						shape: {
							type: 'line', // Используем линии
							stroke: {
								width: 0.2, // Тоньше, как на скриншоте
								color: '#00FFFF',
							},
						},
						opacity: {
							value: 0.7,
							random: true,
						},
						size: {
							value: 2,
							random: true,
						},
						move: {
							enable: true,
							speed: 2,
							direction: 'none',
							random: true,
							straight: false,
							outMode: 'out',
							attract: {
								enable: true,
								rotateX: 800,
								rotateY: 1500, // Более сильное притяжение для точного сердца
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

				Particles.load('heart-particles', particlesOptions);
			});
		}
	}, [isAccepted]);

	return (
		<div className='valentine-card'>
			{isAccepted ? (
				<div className='heart-container'>
					<div className='top-hearts'>
						<span className='small-heart' style={{ left: '20%' }} />
						<span className='small-heart' style={{ left: '40%' }} />
						<span className='small-heart' style={{ left: '60%' }} />
						<span className='small-heart' style={{ left: '80%' }} />
					</div>
					<div className='quote-left'>
						<p key={quotes[quoteIndex].en} className='quote-text'>
							"{quotes[quoteIndex].en}" <span className='heart-icon' />
						</p>
					</div>
					<div id='heart-particles' className='heart-animation'></div>{' '}
					{/* Контейнер для частиц */}
					<svg
						className='heart-outline'
						viewBox='0 0 24 24'
						width='300'
						height='300'
					>
						<path
							d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'
							fill='none'
							stroke='red'
							strokeWidth='1'
							strokeLinecap='round'
						/>
					</svg>
					<div className='quote-right'>
						<p key={quotes[quoteIndex].ru} className='quote-text'>
							"{quotes[quoteIndex].ru}" <span className='heart-icon' />
						</p>
					</div>
					<p className='message'>С Днем Святого Валентина!</p>
				</div>
			) : (
				<>
					<h1>Будешь моей валентинкой?</h1>
					<button onClick={() => setIsAccepted(true)}>Да</button>
				</>
			)}
		</div>
	);
};

export default ValentineCard;
