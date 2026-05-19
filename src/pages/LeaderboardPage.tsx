import Icon from '@/components/ui/icon';

const leaders = [
  { rank: 1, name: 'Анна Козлова', grade: '11 класс', tests: 47, avg: 91, score: 4280 },
  { rank: 2, name: 'Максим Воронов', grade: '11 класс', tests: 38, avg: 88, score: 3740 },
  { rank: 3, name: 'Полина Орлова', grade: '10 класс', tests: 52, avg: 82, score: 3510 },
  { rank: 4, name: 'Иван Соколов', grade: '11 класс', tests: 29, avg: 79, score: 2890 },
  { rank: 5, name: 'Екатерина Смирнова', grade: '10 класс', tests: 34, avg: 76, score: 2640 },
  { rank: 6, name: 'Дмитрий Новиков', grade: '11 класс', tests: 21, avg: 74, score: 2150 },
  { rank: 7, name: 'Алина Кузнецова', grade: '9 класс', tests: 18, avg: 72, score: 1890 },
  { rank: 8, name: 'Артём Петров', grade: '11 класс', tests: 15, avg: 69, score: 1560 },
];

export default function LeaderboardPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-7">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1.5">Рейтинг</h1>
        <p className="text-gray-500 text-sm">Топ учеников по итогам тренировок на платформе</p>
      </div>

      {/* Top 3 */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[leaders[1], leaders[0], leaders[2]].map((u, i) => (
          <div key={u.rank} className={`bg-white border rounded-xl p-4 text-center ${u.rank === 1 ? 'border-amber-300 shadow-sm' : 'border-gray-200'}`}>
            <div className="text-2xl mb-1">{u.rank === 1 ? '🥇' : u.rank === 2 ? '🥈' : '🥉'}</div>
            <div className="text-sm font-semibold text-gray-900 leading-tight">{u.name.split(' ')[0]}</div>
            <div className="text-xs text-gray-400 mt-0.5">{u.grade}</div>
            <div className="text-lg font-bold text-blue-600 mt-2">{u.score}</div>
            <div className="text-xs text-gray-400">баллов</div>
          </div>
        ))}
      </div>

      {/* Full list */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="grid grid-cols-12 gap-2 px-5 py-2.5 border-b border-gray-100 text-xs text-gray-400 font-medium uppercase tracking-wider">
          <div className="col-span-1">#</div>
          <div className="col-span-5">Ученик</div>
          <div className="col-span-2 text-center">Тестов</div>
          <div className="col-span-2 text-center">Средний</div>
          <div className="col-span-2 text-right">Баллы</div>
        </div>
        {leaders.map((u, i) => (
          <div key={u.rank} className={`grid grid-cols-12 gap-2 items-center px-5 py-3.5 text-sm ${i < leaders.length - 1 ? 'border-b border-gray-50' : ''} hover:bg-gray-50 transition-colors`}>
            <div className="col-span-1 text-gray-400 font-medium">
              {u.rank <= 3
                ? <span>{u.rank === 1 ? '🥇' : u.rank === 2 ? '🥈' : '🥉'}</span>
                : <span className="text-gray-400">{u.rank}</span>}
            </div>
            <div className="col-span-5">
              <div className="font-medium text-gray-900">{u.name}</div>
              <div className="text-xs text-gray-400">{u.grade}</div>
            </div>
            <div className="col-span-2 text-center text-gray-600">{u.tests}</div>
            <div className={`col-span-2 text-center font-medium ${u.avg >= 80 ? 'text-green-600' : u.avg >= 65 ? 'text-amber-600' : 'text-red-500'}`}>
              {u.avg}%
            </div>
            <div className="col-span-2 text-right font-semibold text-blue-600">{u.score}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
        <Icon name="Info" size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-blue-700 leading-relaxed">
          Рейтинг обновляется ежедневно. Баллы начисляются за каждый пройденный тест с учётом сложности заданий и процента правильных ответов.
        </p>
      </div>
    </div>
  );
}
