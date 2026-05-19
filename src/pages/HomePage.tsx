import Icon from '@/components/ui/icon';

interface HomePageProps { onNavigate: (page: string) => void; }

const topics = [
  { icon: '🔢', label: '№1', title: 'Системы счисления', count: 87 },
  { icon: '💾', label: '№2', title: 'Кодирование информации', count: 64 },
  { icon: '⚡', label: '№3', title: 'Логика и логические выражения', count: 92 },
  { icon: '📊', label: '№5', title: 'Трассировка алгоритмов', count: 78 },
  { icon: '💻', label: '№6', title: 'Программирование', count: 120 },
  { icon: '🌐', label: '№9', title: 'Сети и протоколы', count: 55 },
];

const features = [
  { icon: 'CheckCircle', title: 'Формат ФИПИ', desc: 'Все задания соответствуют актуальному кодификатору ЕГЭ по информатике' },
  { icon: 'Zap', title: 'Мгновенная проверка', desc: 'Результат и подробный разбор ошибок сразу после ответа' },
  { icon: 'BarChart2', title: 'Статистика прогресса', desc: 'Личный кабинет с историей попыток и аналитикой по темам' },
  { icon: 'BookOpen', title: 'Авторские тесты', desc: 'Учителя публикуют собственные варианты заданий для учеников' },
];

export default function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-14">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-blue-700 text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full inline-block"></span>
            Подготовка к ЕГЭ 2025 · Информатика · Формат ФИПИ
          </div>
          <h1 className="text-4xl sm:text-5xl font-semibold text-gray-900 leading-tight mb-5 tracking-tight">
            Тренажёр ЕГЭ<br />
            <span className="text-blue-600">по информатике</span>
          </h1>
          <p className="text-lg text-gray-500 mb-8 leading-relaxed max-w-lg">
            Задания в точном формате ФИПИ, автопроверка с разбором решений, личная статистика и авторские тесты от учителей.
          </p>
          <div className="flex gap-3 flex-wrap">
            <button onClick={() => onNavigate('tests')}
              className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Icon name="Play" size={15} />
              Начать тренировку
            </button>
            <button onClick={() => onNavigate('topics')}
              className="px-5 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors">
              Все темы ЕГЭ
            </button>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-y border-gray-100 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-7">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { val: '27', label: 'Тем кодификатора' },
              { val: '1 200+', label: 'Заданий ФИПИ' },
              { val: '2025', label: 'Актуальный год' },
              { val: '24/7', label: 'Доступность' },
            ].map(s => (
              <div key={s.label}>
                <div className="text-2xl font-semibold text-gray-900 mb-0.5">{s.val}</div>
                <div className="text-sm text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Topics */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-900">Популярные темы</h2>
          <button onClick={() => onNavigate('topics')} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Все темы →
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {topics.map(t => (
            <button key={t.label} onClick={() => onNavigate('tests')}
              className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all duration-150 text-left group">
              <div className="text-xl w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-100">
                {t.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-blue-600 font-medium mb-0.5">Задание {t.label}</div>
                <div className="text-sm font-medium text-gray-900 truncate">{t.title}</div>
                <div className="text-xs text-gray-400 mt-0.5">{t.count} заданий</div>
              </div>
              <Icon name="ChevronRight" size={15} className="text-gray-300 group-hover:text-blue-400 transition-colors flex-shrink-0" />
            </button>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Возможности платформы</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map(f => (
              <div key={f.title} className="bg-white p-5 rounded-xl border border-gray-200">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center mb-3">
                  <Icon name={f.icon} size={16} className="text-blue-600" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Teacher CTA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-blue-600 rounded-2xl p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div>
            <div className="badge-blue mb-3" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}>
              Для учителей
            </div>
            <h2 className="text-white text-lg font-semibold mb-1.5">Публикуйте авторские тесты</h2>
            <p className="text-blue-100 text-sm leading-relaxed max-w-md">
              Создайте кабинет учителя и добавляйте собственные задания в формате ФИПИ. Ваши ученики смогут тренироваться по вашим вариантам.
            </p>
          </div>
          <button onClick={() => onNavigate('register')}
            className="flex-shrink-0 px-5 py-2.5 bg-white text-blue-700 text-sm font-semibold rounded-lg hover:bg-blue-50 transition-colors whitespace-nowrap">
            Зарегистрироваться как учитель →
          </button>
        </div>
      </section>
    </div>
  );
}
