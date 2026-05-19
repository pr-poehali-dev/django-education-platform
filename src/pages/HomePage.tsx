import Icon from '@/components/ui/icon';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

const stats = [
  { value: '12 000+', label: 'Учеников', icon: 'Users', color: 'purple' },
  { value: '340+', label: 'Тестов', icon: 'ClipboardList', color: 'cyan' },
  { value: '98%', label: 'Успешных сдач', icon: 'TrendingUp', color: 'pink' },
  { value: '8', label: 'Предметов', icon: 'BookOpen', color: 'green' },
];

const subjects = [
  { id: 'cs', name: 'Информатика', icon: '💻', topics: 24, tests: 87, color: 'from-violet-600 to-purple-700', badge: 'Популярный' },
  { id: 'math', name: 'Математика', icon: '📐', topics: 32, tests: 120, color: 'from-cyan-600 to-teal-700', badge: 'Новые темы' },
  { id: 'physics', name: 'Физика', icon: '⚛️', topics: 18, tests: 64, color: 'from-orange-500 to-red-600', badge: '' },
  { id: 'chemistry', name: 'Химия', icon: '🧪', topics: 14, tests: 52, color: 'from-green-600 to-emerald-700', badge: '' },
  { id: 'biology', name: 'Биология', icon: '🧬', topics: 16, tests: 58, color: 'from-pink-600 to-rose-700', badge: '' },
  { id: 'history', name: 'История', icon: '🏛️', topics: 22, tests: 78, color: 'from-amber-600 to-yellow-600', badge: '' },
];

const features = [
  { icon: 'Zap', title: 'Мгновенная проверка', desc: 'Результат сразу после теста с детальным разбором ошибок', color: 'text-yellow-400' },
  { icon: 'Trophy', title: 'Рейтинг и достижения', desc: 'Соревнуйся с другими учениками и собирай награды', color: 'text-orange-400' },
  { icon: 'BarChart2', title: 'Аналитика прогресса', desc: 'Подробная статистика успеваемости по каждой теме', color: 'text-cyan-400' },
  { icon: 'BookMarked', title: 'Разборы и теория', desc: 'К каждому тесту прилагаются учебные материалы', color: 'text-purple-400' },
];

export default function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden grid-bg">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-10 right-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" style={{ animationDelay: '1.5s' }} />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-medium mb-6">
            <Icon name="Sparkles" size={14} />
            Подготовка к ЕГЭ и ОГЭ
          </div>

          <h1 className="font-montserrat font-black text-5xl sm:text-6xl lg:text-7xl leading-none mb-6">
            <span className="text-white">Учись.</span>{' '}
            <span className="gradient-text">Тестируйся.</span>
            <br />
            <span className="text-white">Побеждай.</span>
          </h1>

          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Интерактивная платформа для подготовки к экзаменам. Тысячи тестов с мгновенной автопроверкой,
            разборами ошибок и личной статистикой.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate('tests')}
              className="px-8 py-4 rounded-xl btn-neon-purple font-semibold text-base font-montserrat flex items-center justify-center gap-2"
            >
              <Icon name="Play" size={18} />
              Начать тренировку
            </button>
            <button
              onClick={() => onNavigate('cabinet')}
              className="px-8 py-4 rounded-xl border border-white/10 text-white font-semibold text-base hover:bg-white/5 transition-all flex items-center justify-center gap-2"
            >
              <Icon name="UserPlus" size={18} />
              Зарегистрироваться
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4 border-y border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className={`text-3xl font-montserrat font-black mb-1 ${
                  s.color === 'purple' ? 'gradient-text' :
                  s.color === 'cyan' ? 'neon-text-cyan' :
                  s.color === 'pink' ? 'gradient-text-pink' :
                  'text-green-400'
                }`}>
                  {s.value}
                </div>
                <div className="text-sm text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subjects */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-montserrat font-bold text-3xl text-white mb-3">
              Выбери <span className="gradient-text">предмет</span>
            </h2>
            <p className="text-gray-500">8 предметов, сотни тестов для любого уровня</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((subj) => (
              <button
                key={subj.id}
                onClick={() => onNavigate(subj.id === 'cs' ? 'cs' : 'tests')}
                className="card-glass rounded-2xl p-6 text-left transition-all duration-300 card-glow-purple group border border-white/5"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${subj.color} flex items-center justify-center text-2xl`}>
                    {subj.icon}
                  </div>
                  {subj.badge && (
                    <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/20">
                      {subj.badge}
                    </span>
                  )}
                </div>
                <h3 className="font-montserrat font-bold text-white text-lg mb-2 group-hover:gradient-text transition-all">
                  {subj.name}
                </h3>
                <div className="flex gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Icon name="BookOpen" size={13} />
                    {subj.topics} тем
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon name="ClipboardList" size={13} />
                    {subj.tests} тестов
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-montserrat font-bold text-3xl text-white mb-3">
              Почему выбирают <span className="gradient-text">КодГрад</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title} className="card-glass rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-all">
                <div className={`${f.color} mb-4`}>
                  <Icon name={f.icon} size={28} />
                </div>
                <h3 className="font-montserrat font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="card-glass rounded-3xl p-12 border border-purple-500/20 relative overflow-hidden animate-pulse-glow">
            <div className="absolute inset-0 gradient-purple-cyan opacity-5 rounded-3xl" />
            <h2 className="font-montserrat font-black text-3xl text-white mb-4 relative z-10">
              Готов к экзамену?
            </h2>
            <p className="text-gray-400 mb-8 relative z-10">Зарегистрируйся и начни подготовку прямо сейчас</p>
            <button
              onClick={() => onNavigate('cabinet')}
              className="px-10 py-4 rounded-xl btn-neon-purple font-semibold font-montserrat relative z-10"
            >
              Начать бесплатно
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
