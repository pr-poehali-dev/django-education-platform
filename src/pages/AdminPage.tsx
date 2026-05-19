import { useState } from 'react';
import Icon from '@/components/ui/icon';

type AdminTab = 'dashboard' | 'users' | 'tests' | 'subjects';

const users = [
  { id: 1, name: 'Александр Козлов', email: 'alex@mail.ru', tests: 38, score: 76, role: 'Ученик', active: true },
  { id: 2, name: 'Мария Смирнова', email: 'maria@mail.ru', tests: 52, score: 89, role: 'Ученик', active: true },
  { id: 3, name: 'Иван Петров', email: 'ivan@mail.ru', tests: 14, score: 61, role: 'Ученик', active: false },
  { id: 4, name: 'Анна Сидорова', email: 'anna@mail.ru', tests: 67, score: 93, role: 'Учитель', active: true },
  { id: 5, name: 'Дмитрий Новиков', email: 'dima@mail.ru', tests: 29, score: 71, role: 'Ученик', active: true },
];

const adminTests = [
  { id: 1, title: 'Системы счисления — базовый', subject: 'Информатика', questions: 10, attempts: 342, avg: 78 },
  { id: 2, title: 'Алгоритмы: трассировка', subject: 'Информатика', questions: 8, attempts: 218, avg: 65 },
  { id: 3, title: 'Логические выражения', subject: 'Информатика', questions: 12, attempts: 189, avg: 72 },
  { id: 4, title: 'Основы программирования', subject: 'Информатика', questions: 15, attempts: 156, avg: 59 },
];

export default function AdminPage() {
  const [tab, setTab] = useState<AdminTab>('dashboard');
  const [isAuth, setIsAuth] = useState(false);
  const [pass, setPass] = useState('');

  if (!isAuth) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center">
        <div className="w-full max-w-sm animate-scale-in">
          <div className="card-glass rounded-3xl p-8 border border-orange-500/20">
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center mx-auto mb-4">
                <Icon name="Shield" size={24} className="text-white" />
              </div>
              <h2 className="font-montserrat font-bold text-xl text-white">Админпанель</h2>
              <p className="text-gray-500 text-sm mt-1">Доступ только для администраторов</p>
            </div>
            <input
              type="password"
              value={pass}
              onChange={e => setPass(e.target.value)}
              placeholder="Пароль администратора"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-orange-500/50 focus:outline-none mb-4"
            />
            <button
              onClick={() => setIsAuth(true)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold font-montserrat text-sm"
              style={{ boxShadow: '0 4px 20px rgba(249,115,22,0.35)' }}
            >
              Войти в панель
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div>
            <h1 className="font-montserrat font-black text-3xl text-white flex items-center gap-3">
              <Icon name="Shield" size={28} className="text-orange-400" />
              Админпанель
            </h1>
            <p className="text-gray-500 text-sm mt-1">Управление платформой КодГрад</p>
          </div>
          <button
            onClick={() => setIsAuth(false)}
            className="text-gray-500 hover:text-white text-sm flex items-center gap-1.5 transition-colors border border-white/10 px-3 py-2 rounded-lg"
          >
            <Icon name="LogOut" size={14} /> Выйти
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 card-glass rounded-xl p-1 border border-white/5 w-fit">
          {([
            { id: 'dashboard', label: '📊 Дашборд' },
            { id: 'users', label: '👥 Пользователи' },
            { id: 'tests', label: '📋 Тесты' },
            { id: 'subjects', label: '📚 Предметы' },
          ] as { id: AdminTab; label: string }[]).map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t.id ? 'bg-orange-500/20 text-orange-300' : 'text-gray-500 hover:text-gray-300'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'dashboard' && (
          <div className="animate-fade-in">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Пользователей', value: '12 481', icon: 'Users', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
                { label: 'Тестов пройдено', value: '98 322', icon: 'ClipboardList', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
                { label: 'Средний балл', value: '71%', icon: 'TrendingUp', color: 'text-green-400 bg-green-500/10 border-green-500/20' },
                { label: 'Новых сегодня', value: '+48', icon: 'UserPlus', color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
              ].map(s => (
                <div key={s.label} className={`card-glass rounded-2xl p-5 border ${s.color} text-center`}>
                  <Icon name={s.icon} size={22} className={`mx-auto mb-2 ${s.color.split(' ')[0]}`} />
                  <div className="font-montserrat font-black text-2xl text-white mb-1">{s.value}</div>
                  <div className="text-xs text-gray-500">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="card-glass rounded-2xl p-6 border border-white/5">
              <h3 className="font-montserrat font-bold text-white mb-4">Топ тестов по популярности</h3>
              <div className="space-y-3">
                {adminTests.map((t, i) => (
                  <div key={t.id} className="flex items-center gap-4 py-2">
                    <span className="w-6 text-center text-gray-600 text-sm font-mono">{i + 1}</span>
                    <div className="flex-1">
                      <div className="text-sm text-white font-medium">{t.title}</div>
                      <div className="text-xs text-gray-600">{t.attempts} прохождений</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-bold ${t.avg >= 80 ? 'text-green-400' : t.avg >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {t.avg}%
                      </div>
                      <div className="text-xs text-gray-600">средний балл</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'users' && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400 text-sm">Всего: {users.length} пользователей</span>
              <button className="px-4 py-2 rounded-lg bg-orange-500/20 text-orange-300 text-sm border border-orange-500/20 hover:bg-orange-500/30 transition-all flex items-center gap-1.5">
                <Icon name="UserPlus" size={14} /> Добавить
              </button>
            </div>
            <div className="card-glass rounded-2xl border border-white/5 overflow-hidden">
              <div className="grid grid-cols-12 gap-4 px-6 py-3 text-xs text-gray-600 border-b border-white/5 uppercase tracking-wider">
                <div className="col-span-4">Пользователь</div>
                <div className="col-span-2">Роль</div>
                <div className="col-span-2">Тестов</div>
                <div className="col-span-2">Успешность</div>
                <div className="col-span-2">Статус</div>
              </div>
              {users.map((u, i) => (
                <div key={u.id} className={`grid grid-cols-12 gap-4 px-6 py-4 items-center text-sm ${i < users.length - 1 ? 'border-b border-white/5' : ''} hover:bg-white/2 transition-colors`}>
                  <div className="col-span-4">
                    <div className="font-medium text-white">{u.name}</div>
                    <div className="text-xs text-gray-600">{u.email}</div>
                  </div>
                  <div className="col-span-2 text-gray-400 text-xs">{u.role}</div>
                  <div className="col-span-2 text-gray-400">{u.tests}</div>
                  <div className={`col-span-2 font-medium ${u.score >= 80 ? 'text-green-400' : u.score >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>{u.score}%</div>
                  <div className="col-span-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${u.active ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-gray-500/10 text-gray-500 border border-gray-500/20'}`}>
                      {u.active ? 'Активен' : 'Неактивен'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'tests' && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400 text-sm">Всего: {adminTests.length} теста</span>
              <button className="px-4 py-2 rounded-lg bg-orange-500/20 text-orange-300 text-sm border border-orange-500/20 hover:bg-orange-500/30 transition-all flex items-center gap-1.5">
                <Icon name="Plus" size={14} /> Создать тест
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {adminTests.map((t) => (
                <div key={t.id} className="card-glass rounded-2xl p-6 border border-white/5 hover:border-orange-500/20 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-medium text-white text-sm flex-1 mr-3">{t.title}</h3>
                    <div className="flex gap-1 flex-shrink-0">
                      <button className="w-7 h-7 rounded-lg border border-white/10 flex items-center justify-center hover:border-white/20 transition-colors">
                        <Icon name="Edit2" size={12} className="text-gray-400" />
                      </button>
                      <button className="w-7 h-7 rounded-lg border border-red-500/20 flex items-center justify-center hover:border-red-500/40 transition-colors">
                        <Icon name="Trash2" size={12} className="text-red-400" />
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-4 text-xs text-gray-500">
                    <span>{t.questions} вопросов</span>
                    <span>{t.attempts} попыток</span>
                    <span className={`font-medium ${t.avg >= 70 ? 'text-green-400' : t.avg >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {t.avg}% средний балл
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'subjects' && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400 text-sm">6 предметов</span>
              <button className="px-4 py-2 rounded-lg bg-orange-500/20 text-orange-300 text-sm border border-orange-500/20 hover:bg-orange-500/30 transition-all flex items-center gap-1.5">
                <Icon name="Plus" size={14} /> Добавить предмет
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon: '💻', name: 'Информатика', tests: 87, color: 'from-violet-600 to-purple-700' },
                { icon: '📐', name: 'Математика', tests: 120, color: 'from-cyan-600 to-teal-700' },
                { icon: '⚛️', name: 'Физика', tests: 64, color: 'from-orange-500 to-red-600' },
                { icon: '🧪', name: 'Химия', tests: 52, color: 'from-green-600 to-emerald-700' },
                { icon: '🧬', name: 'Биология', tests: 58, color: 'from-pink-600 to-rose-700' },
                { icon: '🏛️', name: 'История', tests: 78, color: 'from-amber-600 to-yellow-600' },
              ].map(s => (
                <div key={s.name} className="card-glass rounded-2xl p-5 border border-white/5 flex items-center gap-4 hover:border-orange-500/20 transition-all">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-2xl flex-shrink-0`}>
                    {s.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-white text-sm">{s.name}</div>
                    <div className="text-xs text-gray-500">{s.tests} тестов</div>
                  </div>
                  <button className="w-7 h-7 rounded-lg border border-white/10 flex items-center justify-center hover:border-white/20 transition-colors">
                    <Icon name="Edit2" size={12} className="text-gray-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
