import { useState } from 'react';
import Icon from '@/components/ui/icon';

type Screen = 'list' | 'quiz' | 'result';

interface Choice { id: string; text: string; }
interface Q {
  id: number; fipi: string; text: string; code?: string;
  type: 'single' | 'text' | 'number';
  choices?: Choice[]; correct: string | string[]; explanation: string;
}

const QUESTIONS: Q[] = [
  {
    id: 1, fipi: '№1', type: 'single',
    text: 'Переведите число 42₁₀ в двоичную систему счисления.',
    choices: [
      { id: 'a', text: '101010₂' },
      { id: 'b', text: '100101₂' },
      { id: 'c', text: '110100₂' },
      { id: 'd', text: '101000₂' },
    ],
    correct: 'a',
    explanation: '42 = 32+8+2 = 2⁵+2³+2¹ = 101010₂. Делим на 2 и записываем остатки снизу вверх.',
  },
  {
    id: 2, fipi: '№1', type: 'single',
    text: 'Чему равно число FF₁₆ в десятичной системе?',
    choices: [
      { id: 'a', text: '240' },
      { id: 'b', text: '255' },
      { id: 'c', text: '256' },
      { id: 'd', text: '248' },
    ],
    correct: 'b',
    explanation: 'FF₁₆ = 15·16 + 15·1 = 240 + 15 = 255.',
  },
  {
    id: 3, fipi: '№3', type: 'single',
    text: 'Чему равно значение логического выражения: (1 AND 0) OR (NOT 1)?',
    choices: [
      { id: 'a', text: '0' },
      { id: 'b', text: '1' },
      { id: 'c', text: 'Неопределено' },
    ],
    correct: 'a',
    explanation: '(1 AND 0) = 0; NOT 1 = 0; 0 OR 0 = 0.',
  },
  {
    id: 4, fipi: '№5', type: 'single',
    text: 'Что выведет программа?',
    code: 'x = 5\nif x > 3:\n    x = x * 2\nelse:\n    x = x + 1\nprint(x)',
    choices: [
      { id: 'a', text: '6' },
      { id: 'b', text: '10' },
      { id: 'c', text: '5' },
      { id: 'd', text: '11' },
    ],
    correct: 'b',
    explanation: 'x = 5, условие 5 > 3 истинно → x = 5 * 2 = 10.',
  },
  {
    id: 5, fipi: '№5', type: 'single',
    text: 'Определите значение переменной s после выполнения фрагмента:',
    code: 's = 0\nfor i in range(1, 6):\n    s = s + i\nprint(s)',
    choices: [
      { id: 'a', text: '10' },
      { id: 'b', text: '15' },
      { id: 'c', text: '14' },
      { id: 'd', text: '21' },
    ],
    correct: 'b',
    explanation: 'range(1,6) = [1,2,3,4,5]; сумма = 1+2+3+4+5 = 15.',
  },
  {
    id: 6, fipi: '№2', type: 'number',
    text: 'Файл содержит 4096 байт. Сколько это килобайт? (1 КБ = 1024 Б)',
    correct: '4',
    explanation: '4096 / 1024 = 4 КБ.',
  },
];

const LETTERS = ['А', 'Б', 'В', 'Г', 'Д'];

export default function TestsPage() {
  const [screen, setScreen] = useState<Screen>('list');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [textInput, setTextInput] = useState('');

  const tests = [
    { id: 1, title: 'Тематический: Системы счисления', fipi: '№1', count: 10, time: 20, level: 'Лёгкий', author: 'Команда ЕГЭ161' },
    { id: 2, title: 'Тематический: Логические выражения', fipi: '№3', count: 12, time: 25, level: 'Средний', author: 'Команда ЕГЭ161' },
    { id: 3, title: 'Тематический: Трассировка программ', fipi: '№5', count: 8, time: 20, level: 'Средний', author: 'Команда ЕГЭ161' },
    { id: 4, title: 'Смешанный вариант ЕГЭ · Часть 1', fipi: '№1–9', count: 18, time: 45, level: 'Сложный', author: 'Команда ЕГЭ161' },
    { id: 5, title: 'Авторский: Программирование на Python', fipi: '№6', count: 15, time: 30, level: 'Средний', author: 'Иванова М.А.' },
    { id: 6, title: 'Авторский: Кодирование информации', fipi: '№2', count: 10, time: 20, level: 'Лёгкий', author: 'Петров А.С.' },
  ];

  const q = QUESTIONS[currentIdx];
  const score = QUESTIONS.filter(q => answers[q.id] === (Array.isArray(q.correct) ? q.correct[0] : q.correct)).length;

  const startTest = () => {
    setCurrentIdx(0); setAnswers({}); setSelectedId(null); setSubmitted(false); setTextInput('');
    setScreen('quiz');
  };

  const handleSubmit = () => {
    const ans = q.type === 'single' ? selectedId || '' : textInput;
    setAnswers(prev => ({ ...prev, [q.id]: ans }));
    setSubmitted(true);
  };

  const handleNext = () => {
    if (currentIdx + 1 < QUESTIONS.length) {
      setCurrentIdx(c => c + 1);
      setSelectedId(null); setSubmitted(false); setTextInput('');
    } else {
      setScreen('result');
    }
  };

  const levelColor: Record<string, string> = {
    'Лёгкий': 'badge-green',
    'Средний': 'badge-yellow',
    'Сложный': 'badge-red',
  };

  if (screen === 'quiz') {
    const isCorrect = submitted && (q.type === 'single' ? selectedId === q.correct : textInput.trim() === q.correct);
    const progress = Math.round((currentIdx / QUESTIONS.length) * 100);

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Progress */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4">
            <button onClick={() => setScreen('list')} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
              <Icon name="ArrowLeft" size={15} /> Выйти
            </button>
            <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
            <span className="text-sm text-gray-500 flex-shrink-0">{currentIdx + 1} / {QUESTIONS.length}</span>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 animate-slide-up">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="badge-blue">Задание {q.fipi}</span>
              <span className="text-xs text-gray-400">Вопрос {currentIdx + 1}</span>
            </div>

            <p className="text-base font-medium text-gray-900 mb-4 leading-relaxed">{q.text}</p>

            {q.code && (
              <pre className="code-block mb-5 text-xs sm:text-sm">{q.code}</pre>
            )}

            {q.type === 'single' && q.choices && (
              <div className="space-y-2 mb-6">
                {q.choices.map((c, i) => {
                  let cls = 'w-full flex items-center gap-3 p-3.5 rounded-lg border text-sm text-left transition-all ';
                  if (!submitted) {
                    cls += selectedId === c.id
                      ? 'border-blue-500 bg-blue-50 text-blue-900'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-800 cursor-pointer';
                  } else if (c.id === q.correct) {
                    cls += 'border-green-500 bg-green-50 text-green-800';
                  } else if (c.id === selectedId) {
                    cls += 'border-red-400 bg-red-50 text-red-800';
                  } else {
                    cls += 'border-gray-100 bg-gray-50 text-gray-400';
                  }
                  return (
                    <button key={c.id} onClick={() => !submitted && setSelectedId(c.id)} className={cls} disabled={submitted}>
                      <span className={`w-6 h-6 rounded border flex-shrink-0 flex items-center justify-center text-xs font-bold
                        ${submitted && c.id === q.correct ? 'border-green-500 bg-green-100 text-green-700' :
                          submitted && c.id === selectedId ? 'border-red-400 bg-red-100 text-red-600' :
                          selectedId === c.id ? 'border-blue-500 bg-blue-100 text-blue-700' : 'border-gray-300 text-gray-500'}`}>
                        {LETTERS[i]}
                      </span>
                      <span className="flex-1">{c.text}</span>
                      {submitted && c.id === q.correct && <Icon name="Check" size={16} className="text-green-600 flex-shrink-0" />}
                      {submitted && c.id === selectedId && c.id !== q.correct && <Icon name="X" size={16} className="text-red-500 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}

            {(q.type === 'text' || q.type === 'number') && (
              <div className="mb-6">
                <input
                  type={q.type === 'number' ? 'number' : 'text'}
                  value={textInput}
                  onChange={e => setTextInput(e.target.value)}
                  disabled={submitted}
                  placeholder="Введите ответ..."
                  className="w-full sm:w-64 px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 disabled:bg-gray-50"
                />
                {submitted && (
                  <div className={`mt-2 text-sm flex items-center gap-1.5 ${isCorrect ? 'text-green-700' : 'text-red-600'}`}>
                    <Icon name={isCorrect ? 'CheckCircle' : 'XCircle'} size={15} />
                    {isCorrect ? 'Верно!' : `Правильный ответ: ${q.correct}`}
                  </div>
                )}
              </div>
            )}

            {submitted && (
              <div className={`p-4 rounded-xl mb-5 text-sm leading-relaxed ${isCorrect ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-amber-50 border border-amber-200 text-amber-800'}`}>
                <div className="flex items-start gap-2">
                  <Icon name="Lightbulb" size={16} className="flex-shrink-0 mt-0.5" />
                  <span><strong>Разбор:</strong> {q.explanation}</span>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              {!submitted ? (
                <button onClick={handleSubmit}
                  disabled={q.type === 'single' ? !selectedId : !textInput.trim()}
                  className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                  Проверить
                </button>
              ) : (
                <button onClick={handleNext}
                  className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                  {currentIdx + 1 < QUESTIONS.length ? 'Следующий вопрос' : 'Завершить тест'}
                  <Icon name="ArrowRight" size={15} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'result') {
    const pct = Math.round(score / QUESTIONS.length * 100);
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 animate-slide-up">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center mb-6">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${pct >= 70 ? 'bg-green-100' : pct >= 50 ? 'bg-amber-100' : 'bg-red-100'}`}>
            <Icon name={pct >= 70 ? 'Trophy' : pct >= 50 ? 'ThumbsUp' : 'RefreshCw'} size={28}
              className={pct >= 70 ? 'text-green-600' : pct >= 50 ? 'text-amber-600' : 'text-red-500'} />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-1">
            {pct >= 70 ? 'Отлично!' : pct >= 50 ? 'Хороший результат' : 'Нужно повторить'}
          </h2>
          <div className="text-4xl font-bold text-gray-900 my-4">{score}<span className="text-gray-300">/{QUESTIONS.length}</span></div>
          <div className="text-sm text-gray-500 mb-6">{pct}% правильных ответов</div>
          <div className="w-full bg-gray-100 rounded-full h-2 mb-6">
            <div className={`h-2 rounded-full ${pct >= 70 ? 'bg-green-500' : pct >= 50 ? 'bg-amber-400' : 'bg-red-400'}`}
              style={{ width: `${pct}%` }} />
          </div>
          <div className="flex gap-3 justify-center">
            <button onClick={startTest} className="px-5 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5">
              <Icon name="RefreshCw" size={15} /> Пройти снова
            </button>
            <button onClick={() => setScreen('list')} className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
              К списку тестов
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {QUESTIONS.map((q, i) => {
            const userAns = answers[q.id];
            const ok = userAns === q.correct;
            return (
              <div key={q.id} className={`p-4 border rounded-xl text-sm ${ok ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                <div className="flex items-start gap-3">
                  <Icon name={ok ? 'CheckCircle' : 'XCircle'} size={16}
                    className={`flex-shrink-0 mt-0.5 ${ok ? 'text-green-600' : 'text-red-500'}`} />
                  <div>
                    <span className="font-medium text-gray-900">Задание {i + 1} ({q.fipi})</span>
                    <p className="text-gray-600 mt-0.5 text-xs leading-relaxed">{q.explanation}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-7">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1.5">Тесты по информатике</h1>
        <p className="text-gray-500 text-sm">Тематические задания и варианты ЕГЭ с автопроверкой · Авторские тесты учителей</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tests.map(t => (
          <div key={t.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-sm transition-all">
            <div className="flex items-center gap-2 mb-3">
              <span className="badge-blue">Задание {t.fipi}</span>
              <span className={levelColor[t.level]}>{t.level}</span>
              {t.author !== 'Команда ЕГЭ161' && <span className="badge-gray">Авторский</span>}
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1.5 leading-snug">{t.title}</h3>
            <p className="text-xs text-gray-400 mb-4">
              {t.author} · {t.count} заданий · {t.time} мин
            </p>
            <button onClick={startTest}
              className="w-full py-2 text-sm font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-1.5">
              <Icon name="Play" size={14} />
              Начать тест
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
