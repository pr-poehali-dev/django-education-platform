import Icon from '@/components/ui/icon';

const team = [
  { name: 'Дмитрий Орлов', role: 'Основатель и CEO', emoji: '👨‍💻' },
  { name: 'Елена Кузнецова', role: 'Методист по информатике', emoji: '👩‍🏫' },
  { name: 'Антон Волков', role: 'Ведущий разработчик', emoji: '🧑‍💻' },
  { name: 'Светлана Ли', role: 'Дизайн и UX', emoji: '👩‍🎨' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm mb-6">
            <Icon name="Info" size={14} /> О платформе
          </div>
          <h1 className="font-montserrat font-black text-5xl text-white mb-6">
            Мы создаём <span className="gradient-text">будущее</span><br />образования
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            КодГрад — это образовательная платформа нового поколения. Мы помогаем школьникам
            эффективно готовиться к ЕГЭ и ОГЭ с помощью интерактивных тестов, подробных разборов
            и персональной аналитики.
          </p>
        </div>

        {/* Mission */}
        <div className="card-glass rounded-3xl p-10 border border-purple-500/20 mb-12 relative overflow-hidden">
          <div className="absolute inset-0 gradient-purple-cyan opacity-5" />
          <div className="relative z-10 text-center">
            <div className="text-4xl mb-4">🚀</div>
            <h2 className="font-montserrat font-bold text-2xl text-white mb-3">Наша миссия</h2>
            <p className="text-gray-300 max-w-xl mx-auto leading-relaxed">
              Сделать качественную подготовку к экзаменам доступной для каждого ученика —
              независимо от города, школы и бюджета семьи.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16">
          {[
            { value: '2021', label: 'Год основания', icon: 'Calendar', color: 'text-purple-400' },
            { value: '12K+', label: 'Учеников', icon: 'Users', color: 'text-cyan-400' },
            { value: '340+', label: 'Тестов', icon: 'ClipboardList', color: 'text-pink-400' },
            { value: '5★', label: 'Рейтинг', icon: 'Star', color: 'text-yellow-400' },
          ].map(s => (
            <div key={s.label} className="card-glass rounded-2xl p-5 border border-white/5 text-center">
              <Icon name={s.icon} size={22} className={`mx-auto mb-2 ${s.color}`} />
              <div className="font-montserrat font-black text-2xl text-white mb-1">{s.value}</div>
              <div className="text-xs text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="font-montserrat font-bold text-2xl text-white text-center mb-8">Наши принципы</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: '⚡', title: 'Эффективность', desc: 'Короткие фокусированные тесты дают лучший результат, чем долгое чтение учебника' },
              { icon: '🎯', title: 'Точность', desc: 'Каждый вопрос соответствует актуальным заданиям ЕГЭ/ОГЭ' },
              { icon: '❤️', title: 'Забота', desc: 'Мы поддерживаем учеников на каждом шаге и отвечаем на вопросы 24/7' },
            ].map(v => (
              <div key={v.title} className="card-glass rounded-2xl p-6 border border-white/5">
                <div className="text-3xl mb-4">{v.icon}</div>
                <h3 className="font-montserrat font-semibold text-white mb-2">{v.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div>
          <h2 className="font-montserrat font-bold text-2xl text-white text-center mb-8">Команда</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {team.map(t => (
              <div key={t.name} className="card-glass rounded-2xl p-6 border border-white/5 text-center hover:border-purple-500/20 transition-all">
                <div className="text-4xl mb-3">{t.emoji}</div>
                <div className="font-medium text-white text-sm mb-1">{t.name}</div>
                <div className="text-xs text-gray-500">{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
