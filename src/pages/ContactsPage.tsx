import { useState } from 'react';
import Icon from '@/components/ui/icon';

export default function ContactsPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-sm mb-6">
            <Icon name="Mail" size={14} /> Обратная связь
          </div>
          <h1 className="font-montserrat font-black text-5xl text-white mb-4">
            Свяжись <span className="gradient-text-pink">с нами</span>
          </h1>
          <p className="text-gray-400 text-lg">Есть вопрос или предложение? Мы всегда рады помочь</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Contacts */}
          <div className="lg:col-span-2 space-y-4">
            {[
              { icon: 'Mail', label: 'Email', value: 'hello@kodgrad.ru', color: 'text-purple-400' },
              { icon: 'MessageCircle', label: 'Telegram', value: '@kodgrad_support', color: 'text-cyan-400' },
              { icon: 'Phone', label: 'Телефон', value: '+7 (800) 123-45-67', color: 'text-green-400' },
              { icon: 'MapPin', label: 'Адрес', value: 'Москва, ул. Пушкина, 10', color: 'text-pink-400' },
            ].map(c => (
              <div key={c.label} className="card-glass rounded-2xl p-5 border border-white/5 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl bg-current/5 flex items-center justify-center ${c.color} flex-shrink-0`}
                  style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <Icon name={c.icon} size={18} className={c.color} />
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-0.5">{c.label}</div>
                  <div className="text-sm font-medium text-white">{c.value}</div>
                </div>
              </div>
            ))}

            <div className="card-glass rounded-2xl p-5 border border-white/5">
              <div className="text-xs text-gray-600 mb-2">Время ответа</div>
              <div className="text-sm text-gray-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block" />
                Обычно отвечаем за 2–4 часа
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            {sent ? (
              <div className="card-glass rounded-3xl p-12 border border-green-500/20 text-center animate-scale-in h-full flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
                  <Icon name="CheckCircle" size={28} className="text-green-400" />
                </div>
                <h3 className="font-montserrat font-bold text-xl text-white mb-2">Сообщение отправлено!</h3>
                <p className="text-gray-500 text-sm mb-6">Мы свяжемся с тобой в ближайшее время</p>
                <button
                  onClick={() => setSent(false)}
                  className="px-6 py-2.5 rounded-xl btn-neon-purple text-sm font-semibold"
                >
                  Написать ещё
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="card-glass rounded-3xl p-8 border border-white/5 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500 mb-1.5 block">Имя</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      placeholder="Александр"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-purple-500/50 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1.5 block">Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      placeholder="email@mail.ru"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-purple-500/50 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block">Тема</label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={e => setForm({ ...form, subject: e.target.value })}
                    placeholder="Вопрос о тестах"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-purple-500/50 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block">Сообщение</label>
                  <textarea
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    rows={5}
                    placeholder="Ваш вопрос или предложение..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-purple-500/50 focus:outline-none transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 rounded-xl btn-neon-purple font-semibold font-montserrat flex items-center justify-center gap-2"
                >
                  <Icon name="Send" size={16} /> Отправить сообщение
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
