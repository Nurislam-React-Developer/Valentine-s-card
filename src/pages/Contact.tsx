import React, { useState } from 'react';
import { Mail, MessageCircle, Send, Heart, Github, Twitter } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Имитация отправки формы
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
    
    // Сброс состояния через 3 секунды
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <MessageCircle className="w-16 h-16 text-blue-500 animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
            Свяжитесь с нами
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Есть вопросы, предложения или просто хотите поделиться впечатлениями? Мы будем рады услышать от вас!
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Mail className="w-6 h-6 mr-2 text-blue-500" />
              Отправить сообщение
            </h2>
            
            {isSubmitted ? (
              <div className="text-center py-8">
                <Heart className="w-16 h-16 text-green-500 mx-auto mb-4 animate-bounce" />
                <h3 className="text-xl font-semibold text-green-600 mb-2">Спасибо!</h3>
                <p className="text-gray-600">Ваше сообщение успешно отправлено. Мы свяжемся с вами в ближайшее время.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Имя
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                    placeholder="Ваше имя"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Сообщение
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 resize-none"
                    placeholder="Расскажите нам, что у вас на уме..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Отправляем...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Отправить сообщение
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            {/* Info Cards */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Другие способы связи</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-blue-500 mr-3" />
                  <span className="text-gray-700">hello@valentine-card.com</span>
                </div>
                <div className="flex items-center">
                  <MessageCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Telegram: @valentine_support</span>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Следите за нами</h3>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="flex items-center justify-center w-12 h-12 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors duration-300"
                  aria-label="GitHub"
                >
                  <Github className="w-6 h-6" />
                </a>
                <a
                  href="#"
                  className="flex items-center justify-center w-12 h-12 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
                  aria-label="Twitter"
                >
                  <Twitter className="w-6 h-6" />
                </a>
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Часто задаваемые вопросы</h3>
              <div className="space-y-3">
                <details className="group">
                  <summary className="cursor-pointer text-gray-700 hover:text-gray-900 font-medium">
                    Можно ли сохранить валентинку?
                  </summary>
                  <p className="mt-2 text-gray-600 text-sm">
                    Да, вы можете сохранить валентинку как изображение или поделиться ссылкой.
                  </p>
                </details>
                <details className="group">
                  <summary className="cursor-pointer text-gray-700 hover:text-gray-900 font-medium">
                    Работает ли на мобильных устройствах?
                  </summary>
                  <p className="mt-2 text-gray-600 text-sm">
                    Конечно! Приложение полностью адаптировано для всех устройств.
                  </p>
                </details>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;