import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { getUser, clearAuth } from '@/lib/auth';

interface Props { onNavigate: (page: string) => void; }
type Tab = 'results' | 'settings';

const mockResults = [
  { id: 1, variant: 'Демоверсия 2025', date: '18.05.2025 21:44', answered: 23, total: 27, score: 20, maxScore: 29, egeScore: 78 },
  { id: 2, variant: 'ЕГКР 13.12.25', date: '15.05.2025 18:30', answered: 25, total: 27, score: 22, maxScore: 29, egeScore: 84 },
  { id: 3, variant: 'Апробация 04.03.26', date: '10.05.2025 14:10', answered: 20, total: 27, score: 17, maxScore: 29, egeScore: 68 },
];

export default function CabinetPage({ onNavigate }: Props) {
  const [tab, setTab] = useState<Tab>('results');
  const user = getUser();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Войдите, чтобы открыть кабинет</p>
          <button onClick={() => onNavigate('login')}
            className="px-5 py-2.5 bg-blue-700 text-white text-sm font-medium rounded-lg hover:bg-blue-800 transition-colors">
            Войти
          </button>
        </div>
      </div>
    );
  }

  const avgScore = Math.round(mockResults.reduce((s, r) => s + r.egeScore, 0) / mockResults.length);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-start gap-4 mb-7 pb-7 border-b border-gray-200">
        <div className="w-14 h-14 rounded-xl bg-blue-700 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
          {user.first_name[0]}{user.last_name?.[0] || ''}
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-gray-900">{user.last_name} {user.first_name}</h1>
          <p className="text-sm text-gray-500">{user.email}</p>
          <span className="badge-blue mt-1">Ученик</span>
        </div>
        <button onClick={() => { clearAuth(); onNavigate('home'); }}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg transition-colors">
          <Icon name="LogOut" size={14} /> Выйти
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-7">
        {[
          { label: 'Экзаменов сдано', val: mockResults.length, icon: 'ClipboardList' },
          { label: 'Средний балл ЕГЭ', val: avgScore, icon: 'TrendingUp' },
          { label: 'Лучший результат', val: Math.max(...mockResults.map(r => r.egeScore)), icon: 'Award' },
          { label: 'Заданий решено', val: mockResults.reduce((s, r) => s + r.answered, 0), icon: 'CheckSquare' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4">
            <Icon name={s.icon} size={18} className="text-blue-600 mb-2" />
            <div className="text-2xl font-semibold text-gray-900">{s.val}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 mb-6">
        {([['results', 'Результаты'], ['settings', 'Настройки']] as [Tab, string][]).map(([id, lbl]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${tab === id ? 'border-blue-700 text-blue-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            {lbl}
          </button>
        ))}
      </div>

      {tab === 'results' && (
        <div className="animate-fade-in">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-5">
            <div className="grid grid-cols-12 gap-2 px-5 py-2.5 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <div className="col-span-4">Вариант</div>
              <div className="col-span-2 text-center">Дата</div>
              <div className="col-span-2 text-center">Ответов</div>
              <div className="col-span-2 text-center">Первичный</div>
              <div className="col-span-2 text-center">Балл ЕГЭ</div>
            </div>
            {mockResults.map((r, i) => (
              <div key={r.id} className={`grid grid-cols-12 gap-2 items-center px-5 py-3.5 text-sm ${i < mockResults.length - 1 ? 'border-b border-gray-100' : ''} hover:bg-gray-50 transition-colors`}>
                <div className="col-span-4 font-medium text-gray-900">{r.variant}</div>
                <div className="col-span-2 text-center text-xs text-gray-500">{r.date.split(' ')[0]}</div>
                <div className="col-span-2 text-center text-gray-700">{r.answered}/{r.total}</div>
                <div className="col-span-2 text-center text-gray-700">{r.score}/{r.maxScore}</div>
                <div className={`col-span-2 text-center font-semibold ${r.egeScore >= 80 ? 'text-green-600' : r.egeScore >= 60 ? 'text-amber-600' : 'text-red-500'}`}>
                  {r.egeScore}
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => onNavigate('variants')}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-700 text-white text-sm font-medium rounded-lg hover:bg-blue-800 transition-colors">
            <Icon name="Play" size={15} /> Пройти новый вариант
          </button>
        </div>
      )}

      {tab === 'settings' && (
        <div className="animate-fade-in max-w-lg space-y-5">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Личные данные</h3>
            <div className="space-y-3">
              {[['Фамилия', user.last_name || ''], ['Имя', user.first_name], ['Email', user.email]].map(([lbl, val]) => (
                <div key={lbl} className="flex items-center gap-4">
                  <span className="text-xs text-gray-500 w-16 flex-shrink-0">{lbl}</span>
                  <input defaultValue={val} className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-600" />
                </div>
              ))}
            </div>
            <button className="mt-4 px-4 py-2 bg-blue-700 text-white text-sm font-medium rounded-lg hover:bg-blue-800 transition-colors">
              Сохранить
            </button>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Персональные данные</h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-3">
              Ваши данные обрабатываются в соответствии с ФЗ № 152-ФЗ от 27.07.2006 г. «О персональных данных».
              Оператор: ege161.ru. Email: ege161@yandex.ru.
            </p>
            <button className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1.5 transition-colors">
              <Icon name="Trash2" size={13} /> Удалить аккаунт и все данные
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
