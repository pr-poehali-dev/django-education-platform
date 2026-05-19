interface FooterProps {
  onNavigate: (page: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="border-t border-white/5 mt-12 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 mb-10">
          <div className="sm:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg gradient-purple-cyan flex items-center justify-center">
                <span className="text-white font-montserrat font-bold text-sm">КГ</span>
              </div>
              <span className="font-montserrat font-bold text-lg gradient-text">КодГрад</span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed max-w-xs">
              Образовательная платформа для подготовки к ЕГЭ и ОГЭ с тестами и автопроверкой
            </p>
          </div>
          <div>
            <div className="text-xs text-gray-600 uppercase tracking-wider mb-3">Платформа</div>
            <div className="space-y-2">
              {[['home', 'Главная'], ['cs', 'Информатика'], ['tests', 'Тесты']].map(([id, label]) => (
                <button key={id} onClick={() => onNavigate(id)} className="block text-sm text-gray-500 hover:text-white transition-colors">
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-600 uppercase tracking-wider mb-3">Компания</div>
            <div className="space-y-2">
              {[['about', 'О платформе'], ['contacts', 'Контакты'], ['cabinet', 'Личный кабинет']].map(([id, label]) => (
                <button key={id} onClick={() => onNavigate(id)} className="block text-sm text-gray-500 hover:text-white transition-colors">
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="pt-6 border-t border-white/5 flex items-center justify-between text-xs text-gray-700">
          <span>© 2024 КодГрад. Все права защищены.</span>
          <span>Сделано с ❤️ для учеников России</span>
        </div>
      </div>
    </footer>
  );
}
