import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { clearAuth } from '@/lib/auth';

interface Props { onNavigate?: (page: string) => void; }
type Tab = 'dashboard' | 'users' | 'variants' | 'moderation';

const users = [
  { id: 1, name: 'Александр Петров', email: 'alex@mail.ru', role: 'student', exams: 14, avg: 76, date: '12.05.25', active: true },
  { id: 2, name: 'Мария Иванова', email: 'teacher@ege161.ru', role: 'teacher', exams: 3, avg: 91, date: '10.05.25', active: true },
  { id: 3, name: 'Дмитрий Сидоров', email: 'dima@mail.ru', role: 'student', exams: 7, avg: 58, date: '09.05.25', active: true },
  { id: 4, name: 'Анна Козлова', email: 'anna@mail.ru', role: 'student', exams: 21, avg: 88, date: '08.05.25', active: false },
];

const variants = [
  { id: 1, title: 'Демоверсия 2025', author: 'ФИПИ', attempts: 1234, avg: 72, published: true },
  { id: 2, title: 'Python: базовый', author: 'Иванова М.А.', attempts: 89, avg: 64, published: true },
  { id: 3, title: 'Рекурсия (черновик)', author: 'Иванова М.А.', attempts: 0, avg: 0, published: false },
];

const pending = [
  { id: 1, title: 'Авторский вариант #3', author: 'Петров А.С.', questions: 27, date: '19.05.25' },
  { id: 2, title: 'Дополнительный вариант', author: 'Сидорова Н.П.', questions: 27, date: '18.05.25' },
];

export default function AdminPage({ onNavigate }: Props) {
  const [tab, setTab] = useState<Tab>('dashboard');
  const [authed, setAuthed] = useState(false);
  const [pass, setPass] = useState('');

  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 w-full max-w-sm shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 bg-[#1e3a5f] rounded-lg flex items-center justify-center">
              <Icon name="Shield" size={16} className="text-white" />
            </div>
            <div>
              <h1 className="text-base font-semibold text-gray-900">Администрирование</h1>
              <p className="text-xs text-gray-400">Отличный код · ege161.ru</p>
            </div>
          </div>
          <input type="password" value={pass} onChange={e => setPass(e.target.value)}
            placeholder="Пароль администратора"
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm mb-3 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100" />
          <button onClick={() => setAuthed(true)}
            className="w-full py-2.5 bg-[#1e3a5f] text-white text-sm font-medium rounded-lg hover:bg-[#162d4a] transition-colors">
            Войти
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Панель управления</h1>
          <p className="text-sm text-gray-500">Отличный код · ege161.ru</p>
        </div>
        <div className="flex gap-2">
          {onNavigate && (
            <button onClick={() => onNavigate('home')}
              className="flex items-center gap-1.5 text-sm text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
              <Icon name="ArrowLeft" size={14} /> На сайт
            </button>
          )}
          <button onClick={() => { clearAuth(); setAuthed(false); }}
            className="flex items-center gap-1.5 text-sm text-gray-400 border border-gray-200 px-3 py-1.5 rounded-lg hover:text-gray-600 transition-colors">
            <Icon name="LogOut" size={14} /> Выйти
          </button>
        </div>
      </div>

      <div className="flex gap-1 border-b border-gray-200 mb-7">
        {([['dashboard', 'Обзор'], ['users', 'Пользователи'], ['variants', 'Варианты'], ['moderation', 'Модерация']] as [Tab, string][]).map(([id, lbl]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${tab === id ? 'border-blue-700 text-blue-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            {lbl}
            {id === 'moderation' && pending.length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full font-bold">{pending.length}</span>
            )}
          </button>
        ))}
      </div>

      {tab === 'dashboard' && (
        <div className="animate-fade-in">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Пользователей', val: '1 248', icon: 'Users', trend: '+12 сег.' },
              { label: 'Экзаменов сдано', val: '9 832', icon: 'ClipboardList', trend: '+48 сег.' },
              { label: 'Учителей', val: '34', icon: 'GraduationCap', trend: '2 на модерации' },
              { label: 'Средний балл', val: '72', icon: 'TrendingUp', trend: '↑ 2 за нед.' },
            ].map(s => (
              <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4">
                <Icon name={s.icon} size={18} className="text-blue-600 mb-2" />
                <div className="text-xl font-semibold text-gray-900">{s.val}</div>
                <div className="text-xs text-gray-500">{s.label}</div>
                <div className="text-xs text-gray-400 mt-0.5">{s.trend}</div>
              </div>
            ))}
          </div>
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Популярные варианты</h2>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {variants.filter(v => v.published).map((v, i, arr) => (
              <div key={v.id} className={`flex items-center gap-4 px-5 py-3.5 ${i < arr.length - 1 ? 'border-b border-gray-50' : ''}`}>
                <span className="text-xs text-gray-400 w-5">{i + 1}</span>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">{v.title}</div>
                  <div className="text-xs text-gray-400">{v.attempts} попыток · {v.author}</div>
                </div>
                <div className={`text-sm font-semibold ${v.avg >= 70 ? 'text-green-600' : v.avg >= 50 ? 'text-amber-600' : 'text-red-500'}`}>{v.avg}%</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'users' && (
        <div className="animate-fade-in bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="grid grid-cols-12 gap-2 px-5 py-2.5 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wide">
            <div className="col-span-4">Пользователь</div>
            <div className="col-span-2">Роль</div>
            <div className="col-span-2 text-center">Экзаменов</div>
            <div className="col-span-2 text-center">Средний</div>
            <div className="col-span-2 text-right">Статус</div>
          </div>
          {users.map((u, i) => (
            <div key={u.id} className={`grid grid-cols-12 gap-2 items-center px-5 py-3.5 text-sm ${i < users.length - 1 ? 'border-b border-gray-50' : ''} hover:bg-gray-50 transition-colors`}>
              <div className="col-span-4">
                <div className="font-medium text-gray-900">{u.name}</div>
                <div className="text-xs text-gray-400">{u.email}</div>
              </div>
              <div className="col-span-2">
                <span className={u.role === 'teacher' ? 'badge-blue' : 'badge-gray'}>
                  {u.role === 'teacher' ? 'Учитель' : 'Ученик'}
                </span>
              </div>
              <div className="col-span-2 text-center text-gray-700">{u.exams}</div>
              <div className={`col-span-2 text-center font-medium ${u.avg >= 75 ? 'text-green-600' : u.avg >= 55 ? 'text-amber-600' : 'text-red-500'}`}>{u.avg}</div>
              <div className="col-span-2 text-right">
                <span className={u.active ? 'badge-green' : 'badge-red'}>{u.active ? 'Активен' : 'Заблокирован'}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'variants' && (
        <div className="animate-fade-in bg-white border border-gray-200 rounded-xl overflow-hidden">
          {variants.map((v, i) => (
            <div key={v.id} className={`flex items-center gap-4 px-5 py-4 ${i < variants.length - 1 ? 'border-b border-gray-100' : ''}`}>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">{v.title}</span>
                  {v.published ? <span className="badge-green">Опубликован</span> : <span className="badge-gray">Черновик</span>}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">{v.author} · {v.attempts} попыток</div>
              </div>
              <div className="flex gap-1">
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
      )}

      {tab === 'moderation' && (
        <div className="animate-fade-in space-y-3">
          <p className="text-sm text-gray-500 mb-4">Авторские варианты учителей, ожидающие проверки</p>
          {pending.map(v => (
            <div key={v.id} className="bg-white border border-amber-200 rounded-xl p-5 flex items-center gap-4">
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900 mb-0.5">{v.title}</div>
                <div className="text-xs text-gray-400">{v.author} · {v.questions} заданий · {v.date}</div>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 text-sm border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                  Отклонить
                </button>
                <button className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                  Опубликовать
                </button>
              </div>
            </div>
          ))}
          {pending.length === 0 && (
            <div className="text-center py-12 text-gray-400 text-sm">Нет вариантов на модерации</div>
          )}
        </div>
      )}
    </div>
  );
}
