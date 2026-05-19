import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface TeacherPageProps { onNavigate: (page: string) => void; }

type Tab = 'tests' | 'create' | 'stats';
type QType = 'single' | 'multiple' | 'text' | 'number';

interface DraftQuestion {
  id: number; text: string; code: string; type: QType;
  choices: { text: string; is_correct: boolean }[];
  explanation: string;
}

const myTests = [
  { id: 1, title: 'Python: базовые конструкции', fipi: '№6', questions: 12, attempts: 89, avg: 64, published: true, date: '15.05.2024' },
  { id: 2, title: 'Кодирование — авторский', fipi: '№2', questions: 8, attempts: 34, avg: 78, published: true, date: '10.05.2024' },
  { id: 3, title: 'Рекурсия и стек (черновик)', fipi: '№7', questions: 5, attempts: 0, avg: 0, published: false, date: '18.05.2024' },
];

const FIPI_NUMS = ['№1', '№2', '№3', '№4', '№5', '№6', '№7', '№8', '№9', '№10', '№11', '№12'];

export default function TeacherPage({ onNavigate }: TeacherPageProps) {
  const [tab, setTab] = useState<Tab>('tests');

  const [testTitle, setTestTitle] = useState('');
  const [testFipi, setTestFipi] = useState('№6');
  const [testDifficulty, setTestDifficulty] = useState('medium');
  const [questions, setQuestions] = useState<DraftQuestion[]>([
    { id: 1, text: '', code: '', type: 'single', choices: [{ text: '', is_correct: true }, { text: '', is_correct: false }, { text: '', is_correct: false }, { text: '', is_correct: false }], explanation: '' },
  ]);
  const [saved, setSaved] = useState(false);

  const addQuestion = () => {
    setQuestions(qs => [...qs, {
      id: qs.length + 1, text: '', code: '', type: 'single',
      choices: [{ text: '', is_correct: true }, { text: '', is_correct: false }, { text: '', is_correct: false }, { text: '', is_correct: false }],
      explanation: '',
    }]);
  };

  const removeQuestion = (id: number) => setQuestions(qs => qs.filter(q => q.id !== id));

  const updateQ = (id: number, field: string, val: unknown) =>
    setQuestions(qs => qs.map(q => q.id === id ? { ...q, [field]: val } : q));

  const updateChoice = (qId: number, ci: number, field: string, val: unknown) =>
    setQuestions(qs => qs.map(q => {
      if (q.id !== qId) return q;
      const choices = q.choices.map((c, i) => {
        if (i !== ci) return field === 'is_correct' && q.type === 'single' ? { ...c, is_correct: false } : c;
        return { ...c, [field]: val };
      });
      return { ...q, choices };
    }));

  const handlePublish = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const LETTERS = ['А', 'Б', 'В', 'Г'];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Кабинет учителя</h1>
          <p className="text-sm text-gray-500">Создавайте и публикуйте авторские тесты в формате ФИПИ</p>
        </div>
        <span className="badge-blue">Учитель</span>
      </div>

      <div className="flex gap-1 mb-7 border-b border-gray-200">
        {([['tests', 'Мои тесты'], ['create', 'Создать тест'], ['stats', 'Статистика']] as [Tab, string][]).map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === id ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'tests' && (
        <div className="animate-fade-in space-y-3">
          {myTests.map(t => (
            <div key={t.id} className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="badge-blue">Задание {t.fipi}</span>
                  {t.published ? <span className="badge-green">Опубликован</span> : <span className="badge-gray">Черновик</span>}
                </div>
                <h3 className="text-sm font-semibold text-gray-900">{t.title}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{t.questions} вопросов · {t.attempts} попыток · {t.date}</p>
              </div>
              {t.published && (
                <div className="text-right flex-shrink-0">
                  <div className={`text-base font-semibold ${t.avg >= 70 ? 'text-green-600' : t.avg >= 50 ? 'text-amber-600' : 'text-red-500'}`}>
                    {t.avg}%
                  </div>
                  <div className="text-xs text-gray-400">средний балл</div>
                </div>
              )}
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => setTab('create')} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <Icon name="Edit2" size={14} />
                </button>
                <button className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <Icon name="Trash2" size={14} />
                </button>
              </div>
            </div>
          ))}
          <button onClick={() => setTab('create')}
            className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-500 hover:border-blue-300 hover:text-blue-600 transition-colors flex items-center justify-center gap-2">
            <Icon name="Plus" size={15} /> Создать новый тест
          </button>
        </div>
      )}

      {tab === 'create' && (
        <div className="animate-fade-in">
          {saved && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700 mb-5">
              <Icon name="CheckCircle" size={16} /> Тест опубликован и доступен ученикам
            </div>
          )}

          {/* Test meta */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 mb-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Настройки теста</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Название теста *</label>
                <input value={testTitle} onChange={e => setTestTitle(e.target.value)}
                  placeholder="Например: Python — базовые конструкции"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Задание по ФИПИ</label>
                <select value={testFipi} onChange={e => setTestFipi(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 bg-white">
                  {FIPI_NUMS.map(n => <option key={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Уровень сложности</label>
                <select value={testDifficulty} onChange={e => setTestDifficulty(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 bg-white">
                  <option value="easy">Лёгкий</option>
                  <option value="medium">Средний</option>
                  <option value="hard">Сложный</option>
                </select>
              </div>
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-4 mb-5">
            {questions.map((q, qi) => (
              <div key={q.id} className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-900">Вопрос {qi + 1}</h3>
                  {questions.length > 1 && (
                    <button onClick={() => removeQuestion(q.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                      <Icon name="X" size={16} />
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">Текст задания *</label>
                    <textarea value={q.text} onChange={e => updateQ(q.id, 'text', e.target.value)}
                      rows={3} placeholder="Условие задачи в формате ЕГЭ..."
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 resize-none leading-relaxed" />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">Код (необязательно)</label>
                    <textarea value={q.code} onChange={e => updateQ(q.id, 'code', e.target.value)}
                      rows={4} placeholder="x = 5&#10;for i in range(x):&#10;    print(i)"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 resize-none font-mono leading-relaxed bg-gray-50" />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(['single', 'multiple', 'text', 'number'] as QType[]).map(t => (
                      <button key={t} onClick={() => updateQ(q.id, 'type', t)}
                        className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition-all ${
                          q.type === t ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}>
                        {t === 'single' ? 'Один ответ' : t === 'multiple' ? 'Несколько' : t === 'text' ? 'Текст' : 'Число'}
                      </button>
                    ))}
                  </div>

                  {(q.type === 'single' || q.type === 'multiple') && (
                    <div className="space-y-2">
                      <label className="block text-xs font-medium text-gray-700">Варианты ответов</label>
                      {q.choices.map((c, ci) => (
                        <div key={ci} className="flex items-center gap-2">
                          <input type={q.type === 'single' ? 'radio' : 'checkbox'}
                            checked={c.is_correct}
                            onChange={e => updateChoice(q.id, ci, 'is_correct', e.target.checked)}
                            className="w-4 h-4 accent-blue-600 flex-shrink-0" />
                          <span className="text-xs text-gray-500 w-5 flex-shrink-0">{LETTERS[ci]}</span>
                          <input value={c.text} onChange={e => updateChoice(q.id, ci, 'text', e.target.value)}
                            placeholder={`Вариант ${LETTERS[ci]}`}
                            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100" />
                        </div>
                      ))}
                      <p className="text-xs text-gray-400">Отметьте правильный вариант(ы)</p>
                    </div>
                  )}

                  {(q.type === 'text' || q.type === 'number') && (
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">Правильный ответ *</label>
                      <input type={q.type === 'number' ? 'number' : 'text'}
                        value={q.choices[0]?.text || ''}
                        onChange={e => updateChoice(q.id, 0, 'text', e.target.value)}
                        placeholder={q.type === 'number' ? 'Введите число' : 'Введите ответ'}
                        className="w-full sm:w-64 px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">Разбор решения (необязательно)</label>
                    <textarea value={q.explanation} onChange={e => updateQ(q.id, 'explanation', e.target.value)}
                      rows={2} placeholder="Объяснение правильного ответа для ученика..."
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 resize-none" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button onClick={addQuestion}
            className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-500 hover:border-blue-300 hover:text-blue-600 transition-colors flex items-center justify-center gap-2 mb-5">
            <Icon name="Plus" size={15} /> Добавить вопрос
          </button>

          <div className="flex gap-3 justify-end">
            <button className="px-5 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
              Сохранить черновик
            </button>
            <button onClick={handlePublish}
              disabled={!testTitle.trim() || questions.some(q => !q.text.trim())}
              className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-2">
              <Icon name="Send" size={15} />
              Опубликовать тест
            </button>
          </div>
        </div>
      )}

      {tab === 'stats' && (
        <div className="animate-fade-in">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-7">
            {[
              { label: 'Моих тестов', val: '3', icon: 'FileText' },
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

          <h2 className="text-sm font-semibold text-gray-900 mb-3">Результаты по тестам</h2>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {myTests.filter(t => t.published).map((t, i) => (
              <div key={t.id} className={`flex items-center gap-4 px-5 py-4 ${i < myTests.filter(x => x.published).length - 1 ? 'border-b border-gray-100' : ''}`}>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">{t.title}</div>
                  <div className="text-xs text-gray-400 mt-0.5">Задание {t.fipi} · {t.attempts} попыток</div>
                </div>
                <div className="text-right">
                  <div className={`text-base font-semibold ${t.avg >= 70 ? 'text-green-600' : t.avg >= 50 ? 'text-amber-600' : 'text-red-500'}`}>{t.avg}%</div>
                  <div className="text-xs text-gray-400">средний</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
