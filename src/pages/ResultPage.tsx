import { useMemo } from 'react';
import Icon from '@/components/ui/icon';
import { Variant } from '@/data/variants';

interface Props {
  answers: Record<number, string>;
  variant: Variant;
  onNavigate: (page: string) => void;
  onRetry: () => void;
}

function normalizeAnswer(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, ' ');
}

function checkAnswer(userRaw: string, correctRaw: string | string[]): boolean {
  const user = normalizeAnswer(userRaw);
  if (Array.isArray(correctRaw)) {
    return correctRaw.some(c => normalizeAnswer(c) === user);
  }
  return normalizeAnswer(correctRaw) === user;
}

export default function ResultPage({ answers, variant, onNavigate, onRetry }: Props) {
  const results = useMemo(() => {
    return variant.questions.map(q => {
      const userAnswer = answers[q.number] || '';
      const isCorrect = userAnswer.trim() !== '' && checkAnswer(userAnswer, q.answer);
      const earnedScore = isCorrect ? q.maxScore : 0;
      const correct = Array.isArray(q.answer) ? q.answer.join(' / ') : q.answer;
      return { q, userAnswer, isCorrect, earnedScore, correct };
    });
  }, [answers, variant]);

  const totalScore = results.reduce((s, r) => s + r.earnedScore, 0);
  const maxScore = results.reduce((s, r) => s + r.q.maxScore, 0);
  const answeredCount = results.filter(r => r.userAnswer.trim() !== '').length;

  // Scale to 100 (ЕГЭ scale)
  const egeScore = Math.round(totalScore / maxScore * 100);

  // Split into two columns of 13-14 questions
  const half = Math.ceil(results.length / 2);
  const leftCol = results.slice(0, half);
  const rightCol = results.slice(half);

  const tableRow = (r: typeof results[0]) => {
    const { q, userAnswer, isCorrect, earnedScore, correct } = r;
    const numClass = isCorrect ? 'text-blue-700 font-semibold' : 'text-red-600 font-semibold';
    return (
      <tr key={q.number} className="border-b border-gray-200 hover:bg-gray-50">
        <td className={`py-1.5 px-2 text-center text-sm ${numClass}`}>{q.number}</td>
        <td className="py-1.5 px-2 text-center text-sm text-gray-700">{earnedScore}</td>
        <td className={`py-1.5 px-2 text-center text-sm ${isCorrect ? 'text-gray-800' : 'text-red-600'}`}>
          {userAnswer || <span className="text-gray-300">—</span>}
        </td>
        <td className="py-1.5 px-2 text-center text-sm text-gray-800">{correct}</td>
      </tr>
    );
  };

  const tableHeader = (
    <thead>
      <tr className="border-b-2 border-gray-300 bg-gray-50 text-xs text-gray-600 uppercase tracking-wide">
        <th className="py-2 px-2 text-center font-semibold w-10">№</th>
        <th className="py-2 px-2 text-center font-semibold w-14">Балл</th>
        <th className="py-2 px-2 text-center font-semibold">Ваш ответ</th>
        <th className="py-2 px-2 text-center font-semibold">Правильный ответ</th>
      </tr>
    </thead>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header bar */}
      <div className="bg-[#1e3a5f] text-white text-sm py-2.5 px-5">
        Единый государственный экзамен Информатика и ИКТ (КЕГЭ)
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* KIM/BR */}
        <div className="text-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            КИМ № {variant.kim} &nbsp; БР № {variant.br}
          </h2>
          <p className="text-gray-500 text-sm">Дано ответов {answeredCount}/{variant.questions.length}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Left: Score summary */}
          <div className="flex-shrink-0 lg:w-52">
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center mb-4">
              <p className="text-xs text-gray-500 mb-1">Результаты экзамена</p>
              <div className="text-4xl font-bold text-gray-900 mb-0.5">{egeScore}<span className="text-gray-300">/100</span></div>
              <p className="text-sm text-gray-500">Первичный балл: {totalScore}/{maxScore}</p>
            </div>

            {/* Score breakdown */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Правильных</span>
                <span className="font-medium text-green-600">{results.filter(r => r.isCorrect).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Неверных</span>
                <span className="font-medium text-red-500">{results.filter(r => r.userAnswer && !r.isCorrect).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Без ответа</span>
                <span className="font-medium text-gray-400">{results.filter(r => !r.userAnswer.trim()).length}</span>
              </div>
              <div className="pt-2 border-t border-gray-100 flex justify-between">
                <span className="text-gray-500">Баллов набрано</span>
                <span className="font-semibold">{totalScore}/{maxScore}</span>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <button onClick={onRetry}
                className="w-full py-2.5 bg-blue-700 text-white text-sm font-medium rounded-lg hover:bg-blue-800 transition-colors flex items-center justify-center gap-2">
                <Icon name="RefreshCw" size={15} /> Пройти снова
              </button>
              <button onClick={() => onNavigate('variants')}
                className="w-full py-2.5 border border-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                <Icon name="List" size={15} /> Другой вариант
              </button>
              <button onClick={() => onNavigate('cabinet')}
                className="w-full py-2.5 border border-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                <Icon name="User" size={15} /> Мой кабинет
              </button>
            </div>
          </div>

          {/* Right: Results table — 2 columns */}
          <div className="flex-1 min-w-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left column of table */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full">
                  {tableHeader}
                  <tbody>
                    {leftCol.map(r => tableRow(r))}
                  </tbody>
                </table>
              </div>

              {/* Right column of table */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full">
                  {tableHeader}
                  <tbody>
                    {rightCol.map(r => tableRow(r))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Finish button */}
            <div className="mt-6 text-center">
              <button onClick={() => onNavigate('variants')}
                className="px-8 py-3 bg-[#1e3a5f] text-white text-sm font-medium rounded-lg hover:bg-[#162d4a] transition-colors">
                Завершить экзамен
              </button>
            </div>
          </div>
        </div>

        {/* Detailed breakdown */}
        <div className="mt-10">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Разбор заданий</h3>
          <div className="space-y-3">
            {results.map(r => (
              <div key={r.q.number}
                className={`bg-white border rounded-xl p-4 ${r.isCorrect ? 'border-green-200' : r.userAnswer ? 'border-red-200' : 'border-gray-200'}`}>
                <div className="flex items-start gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${r.isCorrect ? 'bg-green-100 text-green-700' : r.userAnswer ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'}`}>
                    {r.q.number}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded ${r.isCorrect ? 'bg-green-50 text-green-700' : r.userAnswer ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-500'}`}>
                        {r.earnedScore} / {r.q.maxScore} балл{r.q.maxScore > 1 ? 'а' : ''}
                      </span>
                      {r.userAnswer && !r.isCorrect && (
                        <span className="text-xs text-gray-500">Ваш: <strong className="text-red-600">{r.userAnswer}</strong></span>
                      )}
                      <span className="text-xs text-gray-500">Правильно: <strong className="text-green-700">{r.correct}</strong></span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">{r.q.explanation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
