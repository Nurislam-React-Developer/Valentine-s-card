import React from 'react';
import { Link } from '@tanstack/react-router';
import { Heart, Sparkles, Music, Gift } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-red-100">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Heart className="w-16 h-16 text-red-500 animate-pulse" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-6">
            Valentine's Card
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Создайте незабываемую валентинку для своей второй половинки
          </p>
          <Link
            to="/valentine"
            className="inline-flex items-center px-8 py-4 bg-red-500 text-white text-lg font-semibold rounded-full hover:bg-red-600 transition-colors duration-300 shadow-lg hover:shadow-xl"
          >
            <Heart className="w-5 h-5 mr-2" />
            Создать валентинку
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex justify-center mb-4">
              <Sparkles className="w-12 h-12 text-purple-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Анимированные эффекты
            </h3>
            <p className="text-gray-600">
              Красивые анимации сердечек и частиц для создания романтической атмосферы
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex justify-center mb-4">
              <Music className="w-12 h-12 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Музыкальное сопровождение
            </h3>
            <p className="text-gray-600">
              Романтическая музыка для создания особого настроения
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex justify-center mb-4">
              <Gift className="w-12 h-12 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Персонализация
            </h3>
            <p className="text-gray-600">
              Настройте сообщение и тему под ваши предпочтения
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Готовы удивить свою любовь?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Создайте уникальную валентинку прямо сейчас
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/valentine"
              className="inline-flex items-center px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors duration-300"
            >
              Начать создание
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center px-6 py-3 bg-white text-gray-700 font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-300"
            >
              Узнать больше
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;