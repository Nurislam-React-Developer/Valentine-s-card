import React from 'react';
import { Heart, Code, Palette, Music } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Heart className="w-16 h-16 text-purple-500 animate-bounce" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
            О проекте
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Valentine's Card - это интерактивное веб-приложение для создания романтических валентинок
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {/* Description */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 mb-12 shadow-lg">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Что это такое?</h2>
            <p className="text-lg text-gray-700 mb-4">
              Наше приложение позволяет создавать красивые, интерактивные валентинки с анимированными эффектами, 
              музыкальным сопровождением и персонализированными сообщениями.
            </p>
            <p className="text-lg text-gray-700">
              Каждая валентинка уникальна и создана с любовью к деталям, чтобы помочь вам выразить свои чувства 
              самым особенным образом.
            </p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <Code className="w-8 h-8 text-blue-500 mr-3" />
                <h3 className="text-xl font-semibold text-gray-800">Технологии</h3>
              </div>
              <ul className="text-gray-700 space-y-2">
                <li>• React 19 с TypeScript</li>
                <li>• Bun runtime для максимальной производительности</li>
                <li>• Framer Motion для плавных анимаций</li>
                <li>• Tailwind CSS для стилизации</li>
                <li>• Howler.js для аудио</li>
              </ul>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <Palette className="w-8 h-8 text-pink-500 mr-3" />
                <h3 className="text-xl font-semibold text-gray-800">Дизайн</h3>
              </div>
              <ul className="text-gray-700 space-y-2">
                <li>• Современный и отзывчивый интерфейс</li>
                <li>• Красивые градиенты и анимации</li>
                <li>• Темная и светлая темы</li>
                <li>• Адаптивность для всех устройств</li>
                <li>• Доступность (a11y)</li>
              </ul>
            </div>
          </div>

          {/* Mission */}
          <div className="bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-2xl p-8 text-center">
            <div className="flex justify-center mb-4">
              <Music className="w-12 h-12 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Наша миссия</h2>
            <p className="text-lg text-gray-700">
              Мы верим, что любовь должна выражаться красиво и креативно. 
              Наша цель - предоставить инструменты для создания незабываемых моментов 
              и помочь людям делиться своими чувствами через технологии.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;