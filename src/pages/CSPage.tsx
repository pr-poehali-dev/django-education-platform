import Icon from '@/components/ui/icon';

interface TopicsPageProps { onNavigate: (page: string) => void; }

const topics = [
  { id: 1, icon: '🔢', fipi: '№1', title: 'Системы счисления', desc: 'Перевод чисел, двоичная арифметика, шестнадцатеричная система', count: 87, level: 'Базовый' },
  { id: 2, icon: '💾', fipi: '№2', title: 'Кодирование информации', desc: 'Единицы измерения, кодирование текста, изображений и звука', count: 64, level: 'Базовый' },
  { id: 3, icon: '⚡', fipi: '№3', title: 'Логика и логические выражения', desc: 'Логические операции, таблицы истинности, упрощение формул', count: 92, level: 'Средний' },
  { id: 4, icon: '🌲', fipi: '№4', title: 'Файловая система и граф', desc: 'Дерево папок, пути к файлам, задачи на графы', count: 45, level: 'Базовый' },
  { id: 5, icon: '📊', fipi: '№5', title: 'Трассировка алгоритмов', desc: 'Отслеживание выполнения программы, подсчёт значений', count: 78, level: 'Средний' },
  { id: 6, icon: '💻', fipi: '№6', title: 'Программирование', desc: 'Переменные, условия, циклы, функции, массивы', count: 120, level: 'Средний' },
  { id: 7, icon: '🔍', fipi: '№7', title: 'Рекурсия', desc: 'Рекурсивные алгоритмы, вычисление значений', count: 56, level: 'Сложный' },
  { id: 8, icon: '📋', fipi: '№8', title: 'Таблицы и базы данных', desc: 'SQL-запросы, реляционные базы данных, выборки', count: 67, level: 'Средний' },
  { id: 9, icon: '🌐', fipi: '№9', title: 'Сети и протоколы', desc: 'IP-адресация, маски подсети, DNS, пропускная способность', count: 55, level: 'Средний' },
  { id: 10, icon: '🔐', fipi: '№10', title: 'Шифрование и коды', desc: 'Коды Хаффмана, криптография, кодирование', count: 42, level: 'Сложный' },
  { id: 11, icon: '📈', fipi: '№11', title: 'Сортировка и поиск', desc: 'Алгоритмы сортировки, бинарный поиск, сложность', count: 38, level: 'Сложный' },
  { id: 12, icon: '🧮', fipi: '№12', title: 'Динамическое программирование', desc: 'Задачи оптимизации, задача о рюкзаке, НОД алгоритмы', count: 29, level: 'Сложный' },
];

const levelColor: Record<string, string> = {
  'Базовый': 'badge-green',
  'Средний': 'badge-yellow',
  'Сложный': 'badge-red',
};

export default function TopicsPage({ onNavigate }: TopicsPageProps) {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1.5">Темы ЕГЭ по информатике</h1>
        <p className="text-gray-500 text-sm">27 тем кодификатора ФИПИ 2025 · задания с автопроверкой и разбором</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {topics.map(t => (
          <button key={t.id} onClick={() => onNavigate('tests')}
            className="flex gap-4 p-5 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all duration-150 text-left group">
            <div className="text-xl w-10 h-10 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              {t.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-blue-600">Задание {t.fipi}</span>
                <span className={levelColor[t.level]}>{t.level}</span>
              </div>
              <div className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors">{t.title}</div>
              <p className="text-xs text-gray-500 leading-relaxed mb-2">{t.desc}</p>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Icon name="FileText" size={12} />
                {t.count} заданий
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
