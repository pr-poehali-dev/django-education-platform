import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface CSPageProps {
  onNavigate: (page: string) => void;
}

const topics = [
  {
    id: 1, title: 'Системы счисления', icon: '🔢', level: 'Базовый',
    desc: 'Перевод чисел между системами счисления, двоичная арифметика',
    tests: 12, done: true, color: 'from-blue-600 to-indigo-700'
  },
  {
    id: 2, title: 'Алгоритмы и блок-схемы', icon: '📊', level: 'Базовый',
    desc: 'Линейные, ветвящиеся и циклические алгоритмы',
    tests: 15, done: true, color: 'from-violet-600 to-purple-700'
  },
  {
    id: 3, title: 'Основы программирования', icon: '💻', level: 'Средний',
    desc: 'Переменные, типы данных, операторы, условия, циклы',
    tests: 20, done: false, color: 'from-cyan-600 to-teal-700'
  },
  {
    id: 4, title: 'Массивы и строки', icon: '📋', level: 'Средний',
    desc: 'Работа с массивами, строковые операции, поиск и сортировка',
    tests: 18, done: false, color: 'from-green-600 to-emerald-700'
  },
  {
    id: 5, title: 'Логика и булева алгебра', icon: '⚡', level: 'Средний',
    desc: 'Логические операции, таблицы истинности, логические схемы',
    tests: 14, done: false, color: 'from-yellow-600 to-orange-600'
  },
  {
    id: 6, title: 'Сети и интернет', icon: '🌐', level: 'Базовый',
    desc: 'Протоколы, IP-адреса, DNS, архитектура интернета',
    tests: 10, done: false, color: 'from-orange-500 to-red-600'
  },
  {
    id: 7, title: 'Базы данных', icon: '🗄️', level: 'Продвинутый',
    desc: 'Реляционные БД, SQL-запросы, нормализация',
    tests: 16, done: false, color: 'from-pink-600 to-rose-700'
  },
  {
    id: 8, title: 'Рекурсия и сложность', icon: '🔄', level: 'Продвинутый',
    desc: 'Рекурсивные алгоритмы, оценка сложности, Big O',
    tests: 11, done: false, color: 'from-indigo-600 to-blue-700'
  },
];

const levelColors: Record<string, string> = {
  'Базовый': 'bg-green-500/15 text-green-400 border-green-500/20',
  'Средний': 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
  'Продвинутый': 'bg-red-500/15 text-red-400 border-red-500/20',
};

export default function CSPage({ onNavigate }: CSPageProps) {
  const [filter, setFilter] = useState('Все');
  const filters = ['Все', 'Базовый', 'Средний', 'Продвинутый'];
  const filtered = filter === 'Все' ? topics : topics.filter(t => t.level === filter);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-start gap-4 mb-10 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center text-3xl flex-shrink-0">
            💻
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="font-montserrat font-black text-4xl text-white">Информатика</h1>
              <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm border border-purple-500/20">ЕГЭ / ОГЭ</span>
            </div>
            <p className="text-gray-400 text-lg">8 тем · 116 тестов · от базового до продвинутого уровня</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="card-glass rounded-2xl p-6 mb-8 border border-white/5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-300">Общий прогресс</span>
            <span className="text-sm font-bold gradient-text">2 / 8 тем</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full gradient-purple-cyan rounded-full" style={{ width: '25%' }} />
          </div>
          <div className="flex gap-6 mt-4 text-sm text-gray-500">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" />2 пройдено</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-gray-600 inline-block" />6 осталось</span>
            <span className="flex items-center gap-1.5"><Icon name="Star" size={13} className="text-yellow-400" />Баллов: 184</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === f
                  ? 'btn-neon-purple'
                  : 'border border-white/10 text-gray-400 hover:text-white hover:border-white/20'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((topic) => (
            <div
              key={topic.id}
              className={`card-glass rounded-2xl p-5 border transition-all duration-300 group cursor-pointer ${
                topic.done
                  ? 'border-green-500/20 hover:border-green-500/40'
                  : 'border-white/5 card-glow-purple'
              }`}
              onClick={() => onNavigate('tests')}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${topic.color} flex items-center justify-center text-xl`}>
                  {topic.icon}
                </div>
                {topic.done && (
                  <div className="w-6 h-6 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center">
                    <Icon name="Check" size={12} className="text-green-400" />
                  </div>
                )}
              </div>

              <h3 className="font-montserrat font-bold text-white text-sm mb-1.5 group-hover:gradient-text transition-all">
                {topic.title}
              </h3>
              <p className="text-xs text-gray-500 mb-3 leading-relaxed line-clamp-2">{topic.desc}</p>

              <div className="flex items-center justify-between">
                <span className={`text-xs px-2 py-0.5 rounded-full border ${levelColors[topic.level]}`}>
                  {topic.level}
                </span>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Icon name="ClipboardList" size={11} />
                  {topic.tests} тестов
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Start Test CTA */}
        <div className="mt-10 text-center">
          <button
            onClick={() => onNavigate('tests')}
            className="px-8 py-4 rounded-xl btn-neon-purple font-semibold font-montserrat flex items-center gap-2 mx-auto"
          >
            <Icon name="Play" size={18} />
            Пройти тест по информатике
          </button>
        </div>
      </div>
    </div>
  );
}
