import { useState } from 'react';
import Icon from '@/components/ui/icon';

type Tab = 'profile' | 'stats' | 'history';

const recentTests = [
  { name: 'Системы счисления', score: 9, total: 10, date: '18 мая', status: 'excellent' },
  { name: 'Алгоритмы: трассировка', score: 6, total: 8, date: '16 мая', status: 'good' },
  { name: 'Логические выражения', score: 7, total: 12, date: '14 мая', status: 'fail' },
  { name: 'Сети и протоколы', score: 9, total: 10, date: '12 мая', status: 'excellent' },
  { name: 'Основы программирования', score: 11, total: 15, date: '10 мая', status: 'good' },
];

const achievements = [
  { icon: '🏆', title: 'Первые 100 баллов', earned: true },
  { icon: '🔥', title: 'Серия 5 дней', earned: true },
  { icon: '⚡', title: '10 тестов подряд', earned: true },
  { icon: '🎯', title: 'Без ошибок', earned: false },
  { icon: '💎', title: 'Мастер информатики', earned: false },
  { icon: '🚀', title: 'Первое место в рейтинге', earned: false },
];

const statusStyles: Record<string, string> = {
  excellent: 'text-green-400',
  good: 'text-yellow-400',
  fail: 'text-red-400',
};

export default function CabinetPage() {
  const [tab, setTab] = useState<Tab>('profile');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginMode, setLoginMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [name, setName] = useState('');

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center">
        <div className="w-full max-w-md animate-scale-in">
          <div className="card-glass rounded-3xl p-8 border border-white/10">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl gradient-purple-cyan flex items-center justify-center mx-auto mb-4">
                <Icon name="User" size={28} className="text-white" />
              </div>
              <h1 className="font-montserrat font-black text-2xl text-white mb-1">
                {loginMode === 'login' ? 'Добро пожаловать' : 'Создать аккаунт'}
              </h1>
              <p className="text-gray-500 text-sm">
                {loginMode === 'login' ? 'Войди в личный кабинет' : 'Начни учиться сегодня'}
              </p>
            </div>

            <div className="flex rounded-xl overflow-hidden border border-white/10 mb-6">
              <button
                onClick={() => setLoginMode('login')}
                className={`flex-1 py-2.5 text-sm font-medium transition-all ${loginMode === 'login' ? 'bg-purple-600/30 text-purple-300' : 'text-gray-500 hover:text-gray-300'}`}
              >
                Войти
              </button>
              <button
                onClick={() => setLoginMode('register')}
                className={`flex-1 py-2.5 text-sm font-medium transition-all ${loginMode === 'register' ? 'bg-purple-600/30 text-purple-300' : 'text-gray-500 hover:text-gray-300'}`}
              >
                Регистрация
              </button>
            </div>

            <div className="space-y-4">
              {loginMode === 'register' && (
                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block">Имя</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Александр"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-purple-500/50 focus:outline-none transition-colors"
                  />
                </div>
              )}
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="example@mail.ru"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-purple-500/50 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">Пароль</label>
                <input
                  type="password"
                  value={pass}
                  onChange={e => setPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-purple-500/50 focus:outline-none transition-colors"
                />
              </div>
              <button
                onClick={() => setIsLoggedIn(true)}
                className="w-full py-3.5 rounded-xl btn-neon-purple font-semibold font-montserrat text-sm"
              >
                {loginMode === 'login' ? 'Войти' : 'Зарегистрироваться'}
              </button>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5" /></div>
              <div className="relative text-center"><span className="bg-card px-3 text-xs text-gray-600">или войди через</span></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="py-2.5 rounded-xl border border-white/10 text-sm text-gray-400 hover:border-white/20 hover:text-white transition-all flex items-center justify-center gap-2">
                <span>🌐</span> Google
              </button>
              <button className="py-2.5 rounded-xl border border-white/10 text-sm text-gray-400 hover:border-white/20 hover:text-white transition-all flex items-center justify-center gap-2">
                <span>📱</span> ВКонтакте
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Profile header */}
        <div className="card-glass rounded-2xl p-6 border border-white/5 mb-6 animate-fade-in">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl gradient-purple-cyan flex items-center justify-center text-2xl font-bold text-white font-montserrat flex-shrink-0">
              АК
            </div>
            <div className="flex-1">
              <h2 className="font-montserrat font-bold text-xl text-white">Александр Козлов</h2>
              <p className="text-gray-500 text-sm">alex@example.ru · Ученик · 11 класс</p>
              <div className="flex gap-4 mt-2 text-xs">
                <span className="text-purple-400 font-medium">🔥 5 дней подряд</span>
                <span className="text-gray-500">Рейтинг: <span className="text-white">#48</span></span>
                <span className="text-gray-500">Баллы: <span className="text-yellow-400">1 284</span></span>
              </div>
            </div>
            <button
              onClick={() => setIsLoggedIn(false)}
              className="text-gray-500 hover:text-white text-xs flex items-center gap-1.5 transition-colors"
            >
              <Icon name="LogOut" size={14} /> Выйти
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 card-glass rounded-xl p-1 border border-white/5 w-fit">
          {(['profile', 'stats', 'history'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${tab === t ? 'bg-purple-600/30 text-purple-300' : 'text-gray-500 hover:text-gray-300'}`}
            >
              {t === 'profile' ? '👤 Профиль' : t === 'stats' ? '📊 Статистика' : '📋 История'}
            </button>
          ))}
        </div>

        {tab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
            <div className="card-glass rounded-2xl p-6 border border-white/5">
              <h3 className="font-montserrat font-bold text-white mb-4 flex items-center gap-2">
                <Icon name="Target" size={18} className="text-purple-400" /> Прогресс по предметам
              </h3>
              {[
                { name: 'Информатика', pct: 45, color: 'from-violet-500 to-purple-600' },
                { name: 'Математика', pct: 30, color: 'from-cyan-500 to-teal-600' },
                { name: 'Физика', pct: 15, color: 'from-orange-500 to-red-600' },
              ].map(s => (
                <div key={s.name} className="mb-4">
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-300">{s.name}</span>
                    <span className="text-gray-500">{s.pct}%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${s.color} rounded-full transition-all`} style={{ width: `${s.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="card-glass rounded-2xl p-6 border border-white/5">
              <h3 className="font-montserrat font-bold text-white mb-4 flex items-center gap-2">
                <Icon name="Award" size={18} className="text-yellow-400" /> Достижения
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {achievements.map((a) => (
                  <div key={a.title} className={`p-3 rounded-xl border text-center transition-all ${a.earned ? 'border-yellow-500/20 bg-yellow-500/5' : 'border-white/5 opacity-40'}`}>
                    <div className="text-2xl mb-1">{a.icon}</div>
                    <div className="text-xs text-gray-400 leading-tight">{a.title}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'stats' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-fade-in">
            {[
              { label: 'Тестов пройдено', value: '38', icon: 'ClipboardList', color: 'text-purple-400' },
              { label: 'Правильных ответов', value: '76%', icon: 'CheckCircle', color: 'text-green-400' },
              { label: 'Часов занятий', value: '14', icon: 'Clock', color: 'text-cyan-400' },
              { label: 'Лучший результат', value: '100%', icon: 'Trophy', color: 'text-yellow-400' },
            ].map(s => (
              <div key={s.label} className="card-glass rounded-2xl p-5 border border-white/5 text-center">
                <Icon name={s.icon} size={24} className={`${s.color} mx-auto mb-2`} />
                <div className="font-montserrat font-black text-2xl text-white mb-1">{s.value}</div>
                <div className="text-xs text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {tab === 'history' && (
          <div className="card-glass rounded-2xl border border-white/5 overflow-hidden animate-fade-in">
            {recentTests.map((t, i) => {
              const pct = Math.round((t.score / t.total) * 100);
              return (
                <div key={i} className={`px-6 py-4 flex items-center justify-between ${i < recentTests.length - 1 ? 'border-b border-white/5' : ''} hover:bg-white/2 transition-colors`}>
                  <div>
                    <div className="font-medium text-white text-sm">{t.name}</div>
                    <div className="text-xs text-gray-600 mt-0.5">{t.date}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className={`font-montserrat font-bold ${statusStyles[t.status]}`}>{t.score}/{t.total}</div>
                      <div className="text-xs text-gray-600">{pct}%</div>
                    </div>
                    <Icon
                      name={t.status === 'excellent' ? 'CheckCircle2' : t.status === 'good' ? 'Circle' : 'XCircle'}
                      size={18}
                      className={statusStyles[t.status]}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
