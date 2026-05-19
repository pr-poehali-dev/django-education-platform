import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { getUser, clearAuth } from '@/lib/auth';

interface Props { onNavigate: (page: string) => void; }
type Tab = 'variants' | 'create' | 'stats';

const myVariants = [
  { id: 1, title: 'Python: базовый уровень', kim: 'авт-001', questions: 27, attempts: 89, avg: 64, published: true, date: '15.05.2025' },
  { id: 2, title: 'Кодирование и логика', kim: 'авт-002', questions: 27, attempts: 34, avg: 78, published: true, date: '10.05.2025' },
  { id: 3, title: 'Рекурсия (черновик)', kim: 'авт-003', questions: 15, attempts: 0, avg: 0, published: false, date: '18.05.2025' },
];

const Q_TYPES = [
  { val: 'text', label: 'Текстовый ответ' },
  { val: 'number', label: 'Числовой ответ' },
  { val: 'table', label: 'Ответ в таблицу' },
  { val: 'choice', label: 'Выбор из вариантов' },
];

interface DraftQ {
  id: number; number: number; text: string; code: string;
  type: string; answer: string; explanation: string;
  tableRows: number; tableCols: number;
  choices: { text: string; is_correct: boolean }[];
}

function makeQ(n: number): DraftQ {
  return { id: n, number: n, text: '', code: '', type: 'text', answer: '', explanation: '', tableRows: 2, tableCols: 2, choices: [{ text: '', is_correct: true }, { text: '', is_correct: false }, { text: '', is_correct: false }, { text: '', is_correct: false }] };
}

export default function TeacherPage({ onNavigate }: Props) {
  const [tab, setTab] = useState<Tab>('variants');
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState<DraftQ[]>(Array.from({ length: 27 }, (_, i) => makeQ(i + 1)));
  const [activeQ, setActiveQ] = useState(1);
  const [saved, setSaved] = useState(false);
  const user = getUser();

  if (!user || user.role === 'student') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Кабинет учителя доступен только преподавателям</p>
          <button onClick={() => onNavigate('register')}
            className="px-5 py-2.5 bg-blue-700 text-white text-sm font-medium rounded-lg hover:bg-blue-800 transition-colors">
            Зарегистрироваться как учитель
          </button>
        </div>
      </div>
    );
  }

  const q = questions.find(x => x.number === activeQ)!;
  const updateQ = (field: string, val: unknown) =>
    setQuestions(qs => qs.map(x => x.number === activeQ ? { ...x, [field]: val } : x));

  const handlePublish = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    setTab('variants');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Кабинет преподавателя</h1>
          <p className="text-sm text-gray-500">{user.first_name} {user.last_name} · {user.email}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge-blue">Преподаватель</span>
          <button onClick={() => { clearAuth(); onNavigate('home'); }}
            className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg transition-colors">
            <Icon name="LogOut" size={14} /> Выйти
          </button>
        </div>
      </div>

      {saved && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700 mb-5 animate-fade-in">
          <Icon name="CheckCircle" size={16} /> Вариант опубликован и доступен ученикам
        </div>
      )}

      <div className="flex gap-1 border-b border-gray-200 mb-7">
        {([['variants', 'Мои варианты'], ['create', 'Создать вариант'], ['stats', 'Статистика']] as [Tab, string][]).map(([id, lbl]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${tab === id ? 'border-blue-700 text-blue-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            {lbl}
          </button>
        ))}
      </div>

      {/* My variants */}
      {tab === 'variants' && (
        <div className="animate-fade-in space-y-3">
          {myVariants.map(v => (
            <div key={v.id} className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-900 text-sm">{v.title}</span>
                  {v.published ? <span className="badge-green">Опубликован</span> : <span className="badge-gray">Черновик</span>}
                </div>
                <p className="text-xs text-gray-400">КИМ {v.kim} · {v.questions} заданий · {v.attempts} попыток · {v.date}</p>
              </div>
              {v.published && (
                <div className="text-right flex-shrink-0">
                  <div className={`text-base font-semibold ${v.avg >= 70 ? 'text-green-600' : v.avg >= 50 ? 'text-amber-600' : 'text-red-500'}`}>{v.avg}%</div>
                  <div className="text-xs text-gray-400">средний балл</div>
                </div>
              )}
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => setTab('create')} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <Icon name="Edit2" size={14} />
                </button>
              </div>
            </div>
          ))}
          <button onClick={() => setTab('create')}
            className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400 hover:border-blue-300 hover:text-blue-600 transition-colors flex items-center justify-center gap-2">
            <Icon name="Plus" size={15} /> Создать новый вариант (27 заданий)
          </button>
        </div>
      )}

      {/* Create variant */}
      {tab === 'create' && (
        <div className="animate-fade-in">
          {/* Title */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 mb-5">
            <div className="flex gap-5 items-end flex-wrap">
              <div className="flex-1 min-w-48">
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Название варианта *</label>
                <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Например: Авторский вариант #1"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100" />
              </div>
              <div className="text-sm text-gray-500">
                Заполнено: <strong>{questions.filter(x => x.text.trim()).length}</strong> / 27 заданий
              </div>
            </div>
          </div>

          <div className="flex gap-5">
            {/* Question list sidebar */}
            <div className="w-16 flex-shrink-0">
              <div className="flex flex-col gap-1">
                {questions.map(qi => {
                  const filled = qi.text.trim() !== '';
                  const isActive = qi.number === activeQ;
                  return (
                    <button key={qi.number} onClick={() => setActiveQ(qi.number)}
                      className={`q-dot ${isActive ? 'q-dot-active' : filled ? 'q-dot-answered' : 'q-dot-empty'}`}>
                      {qi.number}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Question editor */}
            <div className="flex-1 bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Задание {activeQ}</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Текст задания *</label>
                  <textarea value={q.text} onChange={e => updateQ('text', e.target.value)}
                    rows={4} placeholder="Условие задачи в формате ЕГЭ..."
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-600 resize-none leading-relaxed" />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Код (необязательно)</label>
                  <textarea value={q.code} onChange={e => updateQ('code', e.target.value)}
                    rows={4} placeholder="Фрагмент программы..."
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-600 resize-none font-mono bg-gray-50" />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Тип ответа</label>
                  <div className="flex flex-wrap gap-2">
                    {Q_TYPES.map(t => (
                      <button key={t.val} onClick={() => updateQ('type', t.val)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${q.type === t.val ? 'border-blue-700 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {q.type === 'table' && (
                  <div className="flex gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Строк</label>
                      <input type="number" min={1} max={10} value={q.tableRows} onChange={e => updateQ('tableRows', +e.target.value)}
                        className="w-16 px-2 py-2 border border-gray-300 rounded text-sm text-center focus:outline-none focus:border-blue-600" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Столбцов</label>
                      <input type="number" min={1} max={10} value={q.tableCols} onChange={e => updateQ('tableCols', +e.target.value)}
                        className="w-16 px-2 py-2 border border-gray-300 rounded text-sm text-center focus:outline-none focus:border-blue-600" />
                    </div>
                  </div>
                )}

                {(q.type === 'text' || q.type === 'number') && (
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Правильный ответ *</label>
                    <input value={q.answer} onChange={e => updateQ('answer', e.target.value)}
                      placeholder={q.type === 'number' ? 'Числовой ответ' : 'Текстовый ответ'}
                      className="w-full sm:w-72 px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-600" />
                  </div>
                )}

                {q.type === 'choice' && (
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2">Варианты ответов</label>
                    <div className="space-y-2">
                      {q.choices.map((c, ci) => (
                        <div key={ci} className="flex items-center gap-2">
                          <input type="radio" checked={c.is_correct}
                            onChange={() => updateQ('choices', q.choices.map((x, i) => ({ ...x, is_correct: i === ci })))}
                            className="w-4 h-4 accent-blue-700 flex-shrink-0" />
                          <input value={c.text}
                            onChange={e => updateQ('choices', q.choices.map((x, i) => i === ci ? { ...x, text: e.target.value } : x))}
                            placeholder={`Вариант ${['А','Б','В','Г'][ci]}`}
                            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Разбор решения (необязательно)</label>
                  <textarea value={q.explanation} onChange={e => updateQ('explanation', e.target.value)}
                    rows={2} placeholder="Пояснение для ученика..."
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-600 resize-none" />
                </div>

                <div className="flex gap-2 justify-between items-center pt-2 border-t border-gray-100">
                  <div className="flex gap-2">
                    {activeQ > 1 && (
                      <button onClick={() => setActiveQ(activeQ - 1)}
                        className="flex items-center gap-1 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                        ← Задание {activeQ - 1}
                      </button>
                    )}
                    {activeQ < 27 && (
                      <button onClick={() => setActiveQ(activeQ + 1)}
                        className="flex items-center gap-1 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                        Задание {activeQ + 1} →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end mt-5">
            <button className="px-5 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
              Сохранить черновик
            </button>
            <button onClick={handlePublish}
              disabled={!title.trim() || questions.filter(x => x.text.trim()).length < 10}
              className="px-5 py-2.5 bg-blue-700 text-white text-sm font-medium rounded-lg hover:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-2">
              <Icon name="Send" size={15} /> Опубликовать вариант
            </button>
          </div>
        </div>
      )}

      {tab === 'stats' && (
        <div className="animate-fade-in">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-7">
            {[
              { label: 'Моих вариантов', val: '3', icon: 'FileText' },
              { label: 'Всего попыток', val: '123', icon: 'Users' },
              { label: 'Средний балл', val: '71%', icon: 'TrendingUp' },
            ].map(s => (
              <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4">
                <Icon name={s.icon} size={18} className="text-blue-600 mb-2" />
                <div className="text-xl font-semibold text-gray-900">{s.val}</div>
                <div className="text-xs text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {myVariants.filter(v => v.published).map((v, i, arr) => (
              <div key={v.id} className={`flex items-center gap-4 px-5 py-4 ${i < arr.length - 1 ? 'border-b border-gray-100' : ''}`}>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">{v.title}</div>
                  <div className="text-xs text-gray-400">{v.attempts} попыток · {v.date}</div>
                </div>
                <div className="text-right">
                  <div className={`text-base font-semibold ${v.avg >= 70 ? 'text-green-600' : v.avg >= 50 ? 'text-amber-600' : 'text-red-500'}`}>{v.avg}%</div>
                  <div className="text-xs text-gray-400">средний балл</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
