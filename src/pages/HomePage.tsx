import Icon from '@/components/ui/icon';
import { VARIANTS_CATALOG } from '@/data/variants';

interface Props { onNavigate: (page: string) => void; }

export default function HomePage({ onNavigate }: Props) {
  const featured = VARIANTS_CATALOG[0].items.slice(0, 6);

  return (
    <div>
      {/* Hero */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 flex flex-col sm:flex-row items-center gap-10">
          <div className="flex-1 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-blue-700 text-xs font-medium mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block" />
              ЕГЭ 2025 · Информатика · Формат ФИПИ
            </div>
            <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900 leading-tight mb-4 tracking-tight">
              Тренажёр ЕГЭ<br />
              <span className="text-blue-700">«Отличный код»</span>
            </h1>
            <p className="text-base text-gray-500 mb-6 leading-relaxed">
              27 заданий, <strong className="text-gray-700">3 часа 55 минут</strong>, точный формат ФИПИ.
              Результат — таблица с правильными ответами, как на реальном ЕГЭ.
            </p>
            <div className="flex gap-3 flex-wrap">
              <button onClick={() => onNavigate('variants')}
                className="px-5 py-2.5 bg-blue-700 text-white text-sm font-medium rounded-lg hover:bg-blue-800 transition-colors flex items-center gap-2">
                <Icon name="Play" size={16} /> Начать экзамен
              </button>
              <button onClick={() => onNavigate('about')}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors">
                О проекте
              </button>
            </div>
          </div>
          <div className="flex-shrink-0">
            <img src="https://cdn.poehali.dev/projects/39128eb5-1466-4bc8-bf0d-7bf1ac0aa4a0/bucket/653b0e5d-5840-49cc-9820-ee06662e61d6.png"
              alt="Отличный код" className="w-48 sm:w-64 opacity-90" />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-gray-100 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { val: '27', label: 'заданий в варианте' },
              { val: '3:55', label: 'продолжительность теста' },
              { val: '100', label: 'максимальный балл ЕГЭ' },
              { val: '2025', label: 'актуальный кодификатор' },
            ].map(s => (
              <div key={s.label}>
                <div className="text-2xl font-semibold text-blue-700 mb-0.5">{s.val}</div>
                <div className="text-xs text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured variants */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Актуальные варианты</h2>
          <button onClick={() => onNavigate('variants')} className="text-sm text-blue-700 hover:text-blue-800 font-medium">
            Все варианты →
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {featured.map(v => (
            <button key={v.id} onClick={() => onNavigate('variants')}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full text-sm text-gray-700 hover:border-blue-400 hover:text-blue-700 transition-all bg-white">
              {v.title}
              <Icon name="ExternalLink" size={13} className="text-gray-400" />
            </button>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Как это работает</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
            {[
              { step: '1', icon: 'MousePointerClick', title: 'Выберите вариант', desc: 'Из каталога ФИПИ или авторских вариантов учителей' },
              { step: '2', icon: 'Timer', title: 'Решайте 3:55', desc: 'Таймер отсчитывает время, навигация по заданиям как в КЕГЭ' },
              { step: '3', icon: 'Send', title: 'Сдайте работу', desc: 'Нажмите «Завершить экзамен» в любое время или дождитесь конца' },
              { step: '4', icon: 'Table2', title: 'Получите таблицу', desc: 'Результат — таблица с баллами, вашим и правильным ответом' },
            ].map(s => (
              <div key={s.step} className="bg-white p-5 rounded-xl border border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-7 h-7 rounded-full bg-blue-700 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {s.step}
                  </div>
                  <Icon name={s.icon} size={16} className="text-blue-600" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">{s.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Teacher CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="bg-blue-700 rounded-2xl p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div>
            <p className="text-blue-200 text-xs mb-1">Для преподавателей</p>
            <h2 className="text-white text-lg font-semibold mb-1.5">Публикуйте авторские варианты</h2>
            <p className="text-blue-100 text-sm leading-relaxed max-w-md">
              Создайте кабинет учителя и добавляйте свои варианты в формате ФИПИ. Ученики смогут проходить их с таймером и автопроверкой.
            </p>
          </div>
          <button onClick={() => onNavigate('register')}
            className="flex-shrink-0 px-5 py-2.5 bg-white text-blue-700 text-sm font-semibold rounded-lg hover:bg-blue-50 transition-colors whitespace-nowrap">
            Кабинет учителя →
          </button>
        </div>
      </section>
    </div>
  );
}
