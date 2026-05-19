import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { getUser, clearAuth } from '@/lib/auth';

interface CabinetPageProps { onNavigate: (page: string) => void; }

type Tab = 'overview' | 'history' | 'settings';

const mockAttempts = [
  { id: 1, title: 'Системы счисления — базовый', fipi: '№1', score: 9, max: 10, date: '18 мая 2024' },
  { id: 2, title: 'Логические выражения', fipi: '№3', score: 7, max: 12, date: '16 мая 2024' },
  { id: 3, title: 'Трассировка алгоритмов', fipi: '№5', score: 6, max: 8, date: '14 мая 2024' },
  { id: 4, title: 'Смешанный вариант ЕГЭ №1', fipi: '№1–9', score: 14, max: 18, date: '12 мая 2024' },
];

export default function CabinetPage({ onNavigate }: CabinetPageProps) {
  const [tab, setTab] = useState<Tab>('overview');
  const user = getUser();

  if (!user) {
    onNavigate('login');
    return null;
  }

  const totalScore = mockAttempts.reduce((s, a) => s + a.score, 0);
  const totalMax = mockAttempts.reduce((s, a) => s + a.max, 0);
  const avgPct = Math.round(totalScore / totalMax * 100);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      {/* Profile header */}
      <div className="flex items-start gap-5 mb-8 pb-8 border-b border-gray-200">
        <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 text-xl font-semibold flex-shrink-0">
          {user.first_name[0]}{user.last_name[0]}
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-gray-900">{user.first_name} {user.last_name}</h1>
          <p className="text-sm text-gray-500">{user.email}</p>
          <div className="flex items-center gap-2 mt-2">
            {user.role === 'teacher' ? (
              <span className="badge-blue">Учитель</span>
            ) : (
              <span className="badge-gray">Ученик</span>
            )}
          </div>
        </div>
        <button onClick={() => { clearAuth(); onNavigate('home'); }}
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1.5 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
          <Icon name="LogOut" size={14} /> Выйти
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-7 border-b border-gray-200">
        {([['overview', 'Обзор'], ['history', 'История'], ['settings', 'Настройки']] as [Tab, string][]).map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === id ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="animate-fade-in">
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Тестов пройдено', value: mockAttempts.length, icon: 'ClipboardList' },
              { label: 'Средний результат', value: `${avgPct}%`, icon: 'TrendingUp' },
              { label: 'Баллов набрано', value: totalScore, icon: 'Star' },
              { label: 'Дней на платформе', value: 12, icon: 'Calendar' },
            ].map(s => (
              <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4">
                <Icon name={s.icon} size={18} className="text-blue-600 mb-2" />
                <div className="text-xl font-semibold text-gray-900">{s.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Progress by topics */}
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Прогресс по темам</h2>
          <div className="space-y-3">
            {[
              { label: 'Системы счисления №1', pct: 78 },
              { label: 'Логические выражения №3', pct: 58 },
              { label: 'Трассировка алгоритмов №5', pct: 75 },
            ].map(t => (
              <div key={t.label} className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-700 font-medium">{t.label}</span>
                  <span className={`font-semibold ${t.pct >= 70 ? 'text-green-600' : t.pct >= 50 ? 'text-amber-600' : 'text-red-500'}`}>{t.pct}%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${t.pct >= 70 ? 'bg-green-500' : t.pct >= 50 ? 'bg-amber-400' : 'bg-red-400'}`}
                    style={{ width: `${t.pct}%` }} />
                </div>
              </div>
            ))}
          </div>

          <button onClick={() => onNavigate('tests')}
            className="mt-6 w-full py-3 border border-blue-200 text-blue-700 text-sm font-medium rounded-xl hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
            <Icon name="Play" size={15} /> Пройти новый тест
          </button>
        </div>
      )}

      {tab === 'history' && (
        <div className="animate-fade-in space-y-3">
          {mockAttempts.map(a => {
            const pct = Math.round(a.score / a.max * 100);
            return (
              <div key={a.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4">
                <div className={`w-2 h-10 rounded-full flex-shrink-0 ${pct >= 70 ? 'bg-green-500' : pct >= 50 ? 'bg-amber-400' : 'bg-red-400'}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">{a.title}</div>
                  <div className="text-xs text-gray-400 mt-0.5">Задание {a.fipi} · {a.date}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className={`text-base font-semibold ${pct >= 70 ? 'text-green-600' : pct >= 50 ? 'text-amber-600' : 'text-red-500'}`}>
                    {a.score}/{a.max}
                  </div>
                  <div className="text-xs text-gray-400">{pct}%</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === 'settings' && (
        <div className="animate-fade-in max-w-lg space-y-5">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Личные данные</h3>
            <div className="space-y-3">
              {[
                { label: 'Имя', val: user.first_name },
                { label: 'Фамилия', val: user.last_name },
                { label: 'Email', val: user.email },
              ].map(f => (
                <div key={f.label} className="flex gap-4 items-center">
                  <span className="text-xs text-gray-500 w-20">{f.label}</span>
                  <input defaultValue={f.val} className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100" />
                </div>
              ))}
            </div>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
              Сохранить
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Персональные данные</h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-3">
              Ваши персональные данные обрабатываются в соответствии с Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных».
            </p>
            <button className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1.5">
              <Icon name="Trash2" size={14} /> Удалить аккаунт и данные
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
