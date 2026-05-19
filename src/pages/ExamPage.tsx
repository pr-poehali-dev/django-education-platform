import { useState, useEffect, useCallback, useRef } from 'react';
import Icon from '@/components/ui/icon';
import { DEMO_VARIANT, Question, Variant } from '@/data/variants';

interface Props {
  variantId?: string;
  onFinish: (answers: Record<number, string>, variant: Variant) => void;
  onExit: () => void;
}

const TOTAL_SECONDS = 225 * 60; // 3:55:00

function formatTime(secs: number): string {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function AnswerInput({ q, value, onChange }: { q: Question; value: string; onChange: (v: string) => void }) {
  if (q.type === 'table' && q.tableRows && q.tableCols) {
    const rows = q.tableRows;
    const cols = q.tableCols;
    // Parse existing value into grid
    const lines = value ? value.split('\n') : [];
    const grid: string[][] = Array.from({ length: rows }, (_, r) =>
      Array.from({ length: cols }, (_, c) => {
        const parts = (lines[r] || '').split(' ');
        return parts[c] || '';
      })
    );

    const setCell = (r: number, c: number, v: string) => {
      const newGrid = grid.map(row => [...row]);
      newGrid[r][c] = v;
      onChange(newGrid.map(row => row.join(' ')).join('\n'));
    };

    return (
      <div>
        <p className="text-sm text-gray-600 mb-3 font-medium">Введите или скопируйте свой ответ в поля таблицы</p>
        <div className="border border-gray-400 inline-block">
          {/* Header row */}
          <div className="flex border-b border-gray-400">
            <div className="w-12 border-r border-gray-400 bg-gray-50" />
            {Array.from({ length: cols }, (_, c) => (
              <div key={c} className="w-20 border-r border-gray-400 last:border-r-0 text-center text-sm font-medium py-1.5 bg-gray-50">
                {q.tableHeaders?.cols?.[c] ?? c + 1}
              </div>
            ))}
          </div>
          {/* Data rows */}
          {Array.from({ length: rows }, (_, r) => (
            <div key={r} className="flex border-b border-gray-400 last:border-b-0">
              <div className="w-12 border-r border-gray-400 text-center text-sm font-medium flex items-center justify-center bg-gray-50">
                {q.tableHeaders?.rows?.[r] ?? r + 1}
              </div>
              {Array.from({ length: cols }, (_, c) => (
                <input key={c}
                  value={grid[r][c]}
                  onChange={e => setCell(r, c, e.target.value)}
                  className="answer-cell w-20 border-r border-gray-300 last:border-r-0"
                />
              ))}
            </div>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <button onClick={() => onChange('')}
            className="px-3 py-1.5 text-sm border border-red-200 text-red-600 rounded hover:bg-red-50 transition-colors">
            Очистить
          </button>
          <button className="px-3 py-1.5 text-sm bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors">
            Сохранить ответ
          </button>
        </div>
      </div>
    );
  }

  if (q.type === 'choice' && q.choices) {
    return (
      <div className="space-y-2">
        {q.choices.map(ch => (
          <label key={ch.id} className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all
            ${value === ch.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
            <input type="radio" name={`q${q.number}`} value={ch.id}
              checked={value === ch.id} onChange={() => onChange(ch.id)}
              className="accent-blue-700" />
            <span className="text-sm">{ch.text}</span>
          </label>
        ))}
      </div>
    );
  }

  // text / number
  return (
    <div>
      <p className="text-sm text-gray-600 mb-2">Введите ответ:</p>
      <input
        type={q.type === 'number' ? 'text' : 'text'}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={q.type === 'number' ? 'Числовой ответ' : 'Текстовый ответ'}
        className="w-full sm:w-80 px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-200"
      />
      <div className="mt-3 flex gap-2">
        <button onClick={() => onChange('')}
          className="px-3 py-1.5 text-sm border border-red-200 text-red-600 rounded hover:bg-red-50 transition-colors">
          Очистить
        </button>
        <button className="px-3 py-1.5 text-sm bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors">
          Сохранить ответ
        </button>
      </div>
    </div>
  );
}

export default function ExamPage({ onFinish, onExit }: Props) {
  const variant = DEMO_VARIANT;
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS);
  const [confirmFinish, setConfirmFinish] = useState(false);
  const [confirmExit, setConfirmExit] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(intervalRef.current!);
          onFinish(answers, variant);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current!);
  }, []);

  const q = variant.questions[currentQ];
  const answeredCount = Object.values(answers).filter(v => v.trim() !== '').length;

  const handleFinish = useCallback(() => {
    clearInterval(intervalRef.current!);
    onFinish(answers, variant);
  }, [answers, variant, onFinish]);

  const setAnswer = (val: string) => {
    setAnswers(prev => ({ ...prev, [q.number]: val }));
  };

  const isWarning = timeLeft < 30 * 60; // < 30 min
  const isCritical = timeLeft < 5 * 60; // < 5 min

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white">
      {/* Top bar — like КЕГЭ */}
      <div className="flex-shrink-0 bg-[#1e3a5f] text-white px-5 py-2.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6 text-sm">
          <span className="font-medium opacity-80">КИМ № {variant.kim}</span>
          <span className="opacity-60">БР № {variant.br}</span>
        </div>
        <div className="flex items-center gap-4">
          <div className={`font-mono text-base font-bold tabular-nums ${isCritical ? 'text-red-400' : isWarning ? 'text-yellow-300' : 'text-white'}`}>
            {formatTime(timeLeft)}
          </div>
          <button onClick={() => setConfirmFinish(true)}
            className="text-sm px-3 py-1.5 border border-white/30 rounded hover:bg-white/10 transition-colors">
            Завершить экзамен досрочно
          </button>
          <button className="text-white/60 hover:text-white transition-colors">?</button>
          <button className="text-white/60 hover:text-white transition-colors text-lg">—</button>
          <button onClick={() => setConfirmExit(true)} className="text-white/60 hover:text-white transition-colors text-lg">✕</button>
        </div>
      </div>

      {/* Main area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-16 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col items-center pt-3 pb-3 gap-1 overflow-y-auto">
          {/* Answered count */}
          <div className="text-center mb-2">
            <div className="text-xs text-gray-400">Дано</div>
            <div className="text-sm font-bold text-gray-800">{answeredCount}/{variant.questions.length}</div>
          </div>
          {/* Up arrow */}
          <button onClick={() => setCurrentQ(0)} className="w-9 h-9 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-50 text-xs">↑</button>

          {variant.questions.map((qItem, idx) => {
            const hasAnswer = (answers[qItem.number] || '').trim() !== '';
            const isActive = idx === currentQ;
            return (
              <button key={qItem.number}
                onClick={() => setCurrentQ(idx)}
                className={`q-dot ${isActive ? 'q-dot-active' : hasAnswer ? 'q-dot-answered' : 'q-dot-empty'}`}>
                {qItem.number}
              </button>
            );
          })}

          {/* Down arrow */}
          <button onClick={() => setCurrentQ(variant.questions.length - 1)}
            className="w-9 h-9 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-50 text-xs">↓</button>
        </div>

        {/* Question area */}
        <div className="flex-1 overflow-y-auto bg-white">
          <div className="max-w-3xl mx-auto px-6 py-5">
            {/* Nav buttons */}
            <div className="flex items-center gap-3 mb-5">
              <button onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
                disabled={currentQ === 0}
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                ←
              </button>
              <span className="text-sm text-gray-500">Задание {q.number} из {variant.questions.length}</span>
              <button onClick={() => setCurrentQ(Math.min(variant.questions.length - 1, currentQ + 1))}
                disabled={currentQ === variant.questions.length - 1}
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                →
              </button>
            </div>

            {/* Question */}
            <div className="mb-5">
              <h2 className="text-base font-semibold text-gray-900 mb-3">
                Задание {q.number} (№{q.fipi_id}).
              </h2>
              <div className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap mb-4">{q.text}</div>
              {q.code && (
                <pre className="code-block text-xs sm:text-sm mb-4">{q.code}</pre>
              )}
            </div>

            {/* Answer input */}
            <div className="border border-gray-200 rounded-xl p-5 bg-gray-50">
              <AnswerInput q={q} value={answers[q.number] || ''} onChange={setAnswer} />
            </div>

            {/* Bottom nav */}
            <div className="flex justify-between mt-5">
              <button onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
                disabled={currentQ === 0}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-30 transition-colors">
                <Icon name="ArrowLeft" size={14} /> Предыдущее
              </button>
              {currentQ < variant.questions.length - 1 ? (
                <button onClick={() => setCurrentQ(currentQ + 1)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg text-sm hover:bg-blue-800 transition-colors">
                  Следующее <Icon name="ArrowRight" size={14} />
                </button>
              ) : (
                <button onClick={() => setConfirmFinish(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors">
                  <Icon name="LogOut" size={14} /> Завершить экзамен
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirm finish dialog */}
      {confirmFinish && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-7 max-w-sm w-full shadow-2xl">
            <h3 className="text-base font-semibold text-gray-900 mb-2">Завершить экзамен?</h3>
            <p className="text-sm text-gray-500 mb-1">
              Дано ответов: <strong>{answeredCount} из {variant.questions.length}</strong>
            </p>
            <p className="text-sm text-gray-500 mb-5">Оставшееся время: <strong>{formatTime(timeLeft)}</strong></p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmFinish(false)}
                className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                Отмена
              </button>
              <button onClick={handleFinish}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                Завершить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm exit dialog */}
      {confirmExit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-7 max-w-sm w-full shadow-2xl">
            <h3 className="text-base font-semibold text-gray-900 mb-2">Выйти из экзамена?</h3>
            <p className="text-sm text-gray-500 mb-5">Ответы не будут сохранены и результат не будет подсчитан.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmExit(false)}
                className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                Отмена
              </button>
              <button onClick={onExit}
                className="flex-1 py-2.5 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors">
                Выйти
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
