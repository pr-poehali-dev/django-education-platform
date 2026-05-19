import { useState } from 'react';
import Icon from '@/components/ui/icon';

type Screen = 'list' | 'quiz' | 'result';

const tests = [
  { id: 1, title: 'Системы счисления — базовый', subject: 'Информатика', questions: 10, time: 15, difficulty: 'Лёгкий', icon: '🔢' },
  { id: 2, title: 'Алгоритмы: трассировка', subject: 'Информатика', questions: 8, time: 20, difficulty: 'Средний', icon: '📊' },
  { id: 3, title: 'Логические выражения', subject: 'Информатика', questions: 12, time: 25, difficulty: 'Средний', icon: '⚡' },
  { id: 4, title: 'Основы программирования', subject: 'Информатика', questions: 15, time: 30, difficulty: 'Сложный', icon: '💻' },
  { id: 5, title: 'Сети и протоколы', subject: 'Информатика', questions: 10, time: 15, difficulty: 'Лёгкий', icon: '🌐' },
  { id: 6, title: 'Базы данных — SQL', subject: 'Информатика', questions: 10, time: 20, difficulty: 'Сложный', icon: '🗄️' },
];

const quizQuestions = [
  {
    question: 'Переведи число 42 в двоичную систему счисления:',
    options: ['101010₂', '100101₂', '110100₂', '101000₂'],
    correct: 0,
    explanation: '42 = 32+8+2 = 2⁵+2³+2¹ = 101010 в двоичной системе'
  },
  {
    question: 'Сколько бит в одном байте?',
    options: ['4', '8', '16', '32'],
    correct: 1,
    explanation: 'Один байт = 8 бит. Это стандарт адресации памяти.'
  },
  {
    question: 'Какое число в десятичной системе равно 1101₂?',
    options: ['11', '12', '13', '14'],
    correct: 2,
    explanation: '1101₂ = 1·8 + 1·4 + 0·2 + 1·1 = 8+4+1 = 13'
  },
  {
    question: 'Переведи шестнадцатеричное число FF в десятичное:',
    options: ['240', '255', '256', '248'],
    correct: 1,
    explanation: 'FF₁₆ = 15·16 + 15 = 240 + 15 = 255'
  },
  {
    question: 'Чему равно 1010₂ + 0101₂?',
    options: ['1111₂', '10000₂', '1001₂', '1100₂'],
    correct: 0,
    explanation: '1010 + 0101 = 1111 (10+5=15=1111₂)'
  },
];

const diffColors: Record<string, string> = {
  'Лёгкий': 'text-green-400 bg-green-500/10 border-green-500/20',
  'Средний': 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  'Сложный': 'text-red-400 bg-red-500/10 border-red-500/20',
};

export default function TestsPage() {
  const [screen, setScreen] = useState<Screen>('list');
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [activeTest, setActiveTest] = useState(tests[0]);

  const startTest = (test: typeof tests[0]) => {
    setActiveTest(test);
    setCurrent(0);
    setSelected(null);
    setAnswered(false);
    setAnswers([]);
    setScreen('quiz');
  };

  const handleAnswer = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    setAnswers([...answers, idx === quizQuestions[current].correct]);
  };

  const handleNext = () => {
    if (current + 1 < quizQuestions.length) {
      setCurrent(current + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      setScreen('result');
    }
  };

  const score = answers.filter(Boolean).length;

  if (screen === 'quiz') {
    const q = quizQuestions[current];
    const progress = ((current) / quizQuestions.length) * 100;

    return (
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => setScreen('list')} className="text-gray-400 hover:text-white flex items-center gap-1.5 text-sm transition-colors">
              <Icon name="ArrowLeft" size={16} /> Выйти из теста
            </button>
            <span className="text-sm text-gray-400">{current + 1} / {quizQuestions.length}</span>
          </div>

          <div className="h-1.5 bg-white/5 rounded-full mb-8 overflow-hidden">
            <div className="h-full gradient-purple-cyan rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>

          <div className="card-glass rounded-2xl p-8 border border-white/5 mb-6">
            <div className="text-xs text-gray-500 mb-4 font-medium uppercase tracking-wider">Вопрос {current + 1}</div>
            <h2 className="font-montserrat font-bold text-xl text-white mb-8 leading-relaxed">{q.question}</h2>

            <div className="space-y-3">
              {q.options.map((opt, idx) => {
                let cls = 'w-full p-4 rounded-xl border text-left text-sm font-medium transition-all duration-200 ';
                if (!answered) {
                  cls += 'border-white/10 text-gray-300 hover:border-purple-500/40 hover:bg-purple-500/5 hover:text-white cursor-pointer';
                } else if (idx === q.correct) {
                  cls += 'border-green-500/50 bg-green-500/10 text-green-300';
                } else if (idx === selected && idx !== q.correct) {
                  cls += 'border-red-500/50 bg-red-500/10 text-red-300';
                } else {
                  cls += 'border-white/5 text-gray-500 cursor-default';
                }

                return (
                  <button key={idx} className={cls} onClick={() => handleAnswer(idx)}>
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg border border-current/30 flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      {opt}
                      {answered && idx === q.correct && (
                        <Icon name="CheckCircle" size={16} className="ml-auto text-green-400" />
                      )}
                      {answered && idx === selected && idx !== q.correct && (
                        <Icon name="XCircle" size={16} className="ml-auto text-red-400" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {answered && (
              <div className="mt-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 animate-fade-in">
                <div className="flex gap-2 text-sm text-blue-300">
                  <Icon name="Lightbulb" size={16} className="flex-shrink-0 mt-0.5" />
                  <span><strong>Пояснение:</strong> {q.explanation}</span>
                </div>
              </div>
            )}
          </div>

          {answered && (
            <button onClick={handleNext} className="w-full py-4 rounded-xl btn-neon-purple font-semibold font-montserrat animate-fade-in">
              {current + 1 < quizQuestions.length ? 'Следующий вопрос →' : 'Завершить тест'}
            </button>
          )}
        </div>
      </div>
    );
  }

  if (screen === 'result') {
    const pct = Math.round((score / quizQuestions.length) * 100);
    const grade = pct >= 80 ? { label: 'Отлично!', color: 'text-green-400', icon: 'Trophy' } :
                  pct >= 60 ? { label: 'Хорошо', color: 'text-yellow-400', icon: 'ThumbsUp' } :
                               { label: 'Нужно повторить', color: 'text-red-400', icon: 'RefreshCw' };

    return (
      <div className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center">
        <div className="max-w-lg w-full animate-scale-in">
          <div className="card-glass rounded-3xl p-10 border border-white/10 text-center">
            <div className={`text-6xl mb-4 ${grade.color}`}>
              <Icon name={grade.icon} size={60} className="mx-auto" />
            </div>
            <h2 className="font-montserrat font-black text-3xl text-white mb-2">{grade.label}</h2>
            <div className={`text-6xl font-montserrat font-black my-6 ${grade.color}`}>
              {score}/{quizQuestions.length}
            </div>
            <div className="w-full h-3 bg-white/5 rounded-full mb-6 overflow-hidden">
              <div
                className={`h-full rounded-full ${pct >= 80 ? 'bg-green-500' : pct >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="text-gray-400 mb-8 text-sm">
              Правильных ответов: <strong className="text-white">{score}</strong> из {quizQuestions.length} ({pct}%)
            </p>

            <div className="flex gap-3">
              <button onClick={() => startTest(activeTest)} className="flex-1 py-3 rounded-xl border border-white/10 text-sm text-gray-300 hover:text-white hover:border-white/20 transition-all flex items-center justify-center gap-2">
                <Icon name="RefreshCw" size={15} /> Повторить
              </button>
              <button onClick={() => setScreen('list')} className="flex-1 py-3 rounded-xl btn-neon-purple text-sm font-semibold flex items-center justify-center gap-2">
                <Icon name="List" size={15} /> К тестам
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
        <div className="mb-10 animate-fade-in">
          <h1 className="font-montserrat font-black text-4xl text-white mb-2">
            Тесты <span className="gradient-text">с автопроверкой</span>
          </h1>
          <p className="text-gray-400">Выбери тест и проверь знания прямо сейчас</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tests.map((test) => (
            <div key={test.id} className="card-glass rounded-2xl p-6 border border-white/5 card-glow-purple transition-all duration-300 group">
              <div className="text-3xl mb-4">{test.icon}</div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs px-2 py-0.5 rounded-full border ${diffColors[test.difficulty]}`}>
                  {test.difficulty}
                </span>
                <span className="text-xs text-gray-600">{test.subject}</span>
              </div>
              <h3 className="font-montserrat font-bold text-white mb-4 group-hover:gradient-text transition-all">
                {test.title}
              </h3>
              <div className="flex gap-4 text-xs text-gray-500 mb-5">
                <span className="flex items-center gap-1"><Icon name="HelpCircle" size={12} />{test.questions} вопросов</span>
                <span className="flex items-center gap-1"><Icon name="Clock" size={12} />{test.time} мин</span>
              </div>
              <button
                onClick={() => startTest(test)}
                className="w-full py-2.5 rounded-xl btn-neon-purple text-sm font-semibold font-montserrat"
              >
                Начать тест
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
