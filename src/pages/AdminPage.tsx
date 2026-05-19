import { useState } from 'react';
import Icon from '@/components/ui/icon';

type Tab = 'overview' | 'users' | 'tests' | 'topics';

const mockUsers = [
  { id: 1, name: 'Александр Иванов', email: 'ivanov@mail.ru', role: 'student', tests: 14, avg: 76, date: '12.05.2024' },
  { id: 2, name: 'Мария Петрова', email: 'petrova@mail.ru', role: 'teacher', tests: 3, avg: 91, date: '10.05.2024' },
  { id: 3, name: 'Дмитрий Сидоров', email: 'sidorov@mail.ru', role: 'student', tests: 7, avg: 58, date: '09.05.2024' },
  { id: 4, name: 'Анна Козлова', email: 'kozlova@mail.ru', role: 'student', tests: 21, avg: 88, date: '08.05.2024' },
];

const mockTests = [
  { id: 1, title: 'Системы счисления — базовый', fipi: '№1', questions: 10, attempts: 342, avg: 78, author: 'Команда ЕГЭ161' },
  { id: 2, title: 'Логические выражения', fipi: '№3', questions: 12, attempts: 218, avg: 65, author: 'Команда ЕГЭ161' },
  { id: 3, title: 'Авторский: Python основы', fipi: '№6', questions: 15, attempts: 89, avg: 61, author: 'Петрова М.А.' },
];

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('overview');
  const [authed, setAuthed] = useState(false);
  const [pass, setPass] = useState('');

  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 w-full max-w-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 bg-gray-900 rounded-lg flex items-center justify-center">
              <Icon name="Shield" size={16} className="text-white" />
            </div>
            <div>
              <h1 className="text-base font-semibold text-gray-900">Администрирование</h1>
              <p className="text-xs text-gray-400">ЕГЭ161</p>
            </div>
          </div>
          <input type="password" value={pass} onChange={e => setPass(e.target.value)}
            placeholder="Пароль администратора"
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm mb-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200" />
          <button onClick={() => setAuthed(true)}
            className="w-full py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
            Войти
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Панель управления</h1>
          <p className="text-sm text-gray-500">ЕГЭ161 · Администратор</p>
        </div>
        <button onClick={() => setAuthed(false)} className="text-sm text-gray-500 flex items-center gap-1.5 hover:text-gray-700 border border-gray-200 px-3 py-1.5 rounded-lg">
          <Icon name="LogOut" size={14} /> Выйти
        </button>
      </div>

      <div className="flex gap-1 mb-7 border-b border-gray-200">
        {([['overview', 'Обзор'], ['users', 'Пользователи'], ['tests', 'Тесты'], ['topics', 'Темы']] as [Tab, string][]).map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === id ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="animate-fade-in">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Пользователей', val: '1 248', icon: 'Users', trend: '+12 сегодня' },
              { label: 'Тестов пройдено', val: '9 832', icon: 'ClipboardList', trend: '+48 сегодня' },
              { label: 'Учителей', val: '34', icon: 'GraduationCap', trend: '+2 на модерации' },
              { label: 'Средний балл', val: '71%', icon: 'TrendingUp', trend: '↑ 3% за неделю' },
            ].map(s => (
              <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4">
                <Icon name={s.icon} size={18} className="text-blue-600 mb-2" />
                <div className="text-xl font-semibold text-gray-900">{s.val}</div>
                <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
                <div className="text-xs text-gray-400 mt-1">{s.trend}</div>
              </div>
            ))}
          </div>

          <h2 className="text-sm font-semibold text-gray-900 mb-3">Популярные тесты</h2>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {mockTests.map((t, i) => (
              <div key={t.id} className={`flex items-center gap-4 px-5 py-3.5 ${i < mockTests.length - 1 ? 'border-b border-gray-100' : ''}`}>
                <span className="text-xs text-gray-400 w-5">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">{t.title}</div>
                  <div className="text-xs text-gray-400">{t.attempts} попыток · {t.author}</div>
                </div>
                <div className={`text-sm font-semibold ${t.avg >= 70 ? 'text-green-600' : t.avg >= 50 ? 'text-amber-600' : 'text-red-500'}`}>
                  {t.avg}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'users' && (
        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500">{mockUsers.length} пользователей</span>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="grid grid-cols-12 gap-2 px-5 py-2.5 border-b border-gray-100 text-xs text-gray-400 font-medium uppercase tracking-wider">
              <div className="col-span-4">Пользователь</div>
              <div className="col-span-2">Роль</div>
              <div className="col-span-2 text-center">Тестов</div>
              <div className="col-span-2 text-center">Средний</div>
              <div className="col-span-2 text-right">Дата</div>
            </div>
            {mockUsers.map((u, i) => (
              <div key={u.id} className={`grid grid-cols-12 gap-2 items-center px-5 py-3 text-sm ${i < mockUsers.length - 1 ? 'border-b border-gray-50' : ''} hover:bg-gray-50 transition-colors`}>
                <div className="col-span-4">
                  <div className="font-medium text-gray-900">{u.name}</div>
                  <div className="text-xs text-gray-400">{u.email}</div>
                </div>
                <div className="col-span-2">
                  <span className={u.role === 'teacher' ? 'badge-blue' : 'badge-gray'}>
                    {u.role === 'teacher' ? 'Учитель' : 'Ученик'}
                  </span>
                </div>
                <div className="col-span-2 text-center text-gray-700">{u.tests}</div>
                <div className={`col-span-2 text-center font-medium ${u.avg >= 70 ? 'text-green-600' : u.avg >= 50 ? 'text-amber-600' : 'text-red-500'}`}>
                  {u.avg}%
                </div>
                <div className="col-span-2 text-right text-xs text-gray-400">{u.date}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'tests' && (
        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500">{mockTests.length} тестов</span>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
              <Icon name="Plus" size={14} /> Добавить
            </button>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {mockTests.map((t, i) => (
              <div key={t.id} className={`flex items-center gap-4 px-5 py-4 ${i < mockTests.length - 1 ? 'border-b border-gray-100' : ''}`}>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">{t.title}</div>
                  <div className="text-xs text-gray-400 mt-0.5">Задание {t.fipi} · {t.questions} вопросов · {t.attempts} попыток · {t.author}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <Icon name="Edit2" size={14} />
                  </button>
                  <button className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <Icon name="Trash2" size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'topics' && (
        <div className="animate-fade-in">
          <p className="text-sm text-gray-500 mb-4">Управление темами кодификатора</p>
          <div className="bg-white border border-gray-200 rounded-xl p-5 text-center text-sm text-gray-400">
            Редактирование тем доступно через API
          </div>
        </div>
      )}
    </div>
  );
}
