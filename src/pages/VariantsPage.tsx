import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { VARIANTS_CATALOG } from '@/data/variants';

interface Props { onNavigate: (page: string, data?: unknown) => void; }

export default function VariantsPage({ onNavigate }: Props) {
  const [search, setSearch] = useState('');

  const filtered = VARIANTS_CATALOG.map(g => ({
    ...g,
    items: g.items.filter(v =>
      !search || v.title.toLowerCase().includes(search.toLowerCase()) || v.author.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(g => g.items.length > 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1.5">Варианты ЕГЭ по информатике</h1>
        <p className="text-gray-500 text-sm">27 заданий · 3 часа 55 минут · Формат ФИПИ 2025</p>
      </div>

      <div className="mb-6 flex gap-3 items-center">
        <div className="relative flex-1 max-w-sm">
          <Icon name="Search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Поиск вариантов..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100" />
        </div>
        <button onClick={() => onNavigate('exam', { variantId: 'demo-2025' })}
          className="px-4 py-2 bg-blue-700 text-white text-sm font-medium rounded-lg hover:bg-blue-800 transition-colors flex items-center gap-2">
          <Icon name="Play" size={15} /> Демоверсия
        </button>
      </div>

      <div className="space-y-8">
        {filtered.map(group => (
          <div key={group.group}>
            <h2 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-100">{group.group}</h2>
            <div className="flex flex-wrap gap-2">
              {group.items.map(v => (
                <button key={v.id}
                  onClick={() => onNavigate('exam', { variantId: v.id })}
                  className="group flex items-center gap-1.5 px-3.5 py-1.5 border border-gray-200 rounded-full text-sm text-gray-700 hover:border-blue-400 hover:text-blue-700 hover:bg-blue-50 transition-all bg-white">
                  {v.title}
                  <Icon name="Play" size={12} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Author tests placeholder */}
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-100">Авторские варианты учителей</h2>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'author-1', title: 'Python: базовый уровень', author: 'Иванова М.А.' },
              { id: 'author-2', title: 'Кодирование и алгоритмы', author: 'Петров А.С.' },
            ].map(v => (
              <button key={v.id}
                onClick={() => onNavigate('exam', { variantId: 'demo-2025' })}
                className="group flex items-center gap-1.5 px-3.5 py-1.5 border border-blue-200 rounded-full text-sm text-blue-700 hover:border-blue-500 hover:bg-blue-50 transition-all bg-white">
                {v.title}
                <span className="text-xs text-gray-400">· {v.author}</span>
                <Icon name="Play" size={12} className="text-blue-300 group-hover:text-blue-600 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
