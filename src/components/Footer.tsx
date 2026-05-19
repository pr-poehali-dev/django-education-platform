interface FooterProps {
  onNavigate: (page: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 mb-8">
          <div className="sm:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">ЕГЭ</span>
              </div>
              <span className="font-semibold text-gray-900 text-sm">ЕГЭ161.ru</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              Онлайн-тренажёр для подготовки к ЕГЭ по информатике. Задания в формате ФИПИ с мгновенной автопроверкой.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Платформа</p>
            <div className="space-y-2">
              {[['topics', 'Темы ЕГЭ'], ['tests', 'Тесты'], ['leaderboard', 'Рейтинг']].map(([id, label]) => (
                <button key={id} onClick={() => onNavigate(id)}
                  className="block text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Информация</p>
            <div className="space-y-2">
              {[['about', 'О платформе'], ['pd-policy', 'Политика ПД'], ['contacts', 'Контакты']].map(([id, label]) => (
                <button key={id} onClick={() => onNavigate(id)}
                  className="block text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs text-gray-400">
          <span>© 2024 ЕГЭ161.ru. Все права защищены.</span>
          <span>Платформа соответствует требованиям 152-ФЗ «О персональных данных»</span>
        </div>
      </div>
    </footer>
  );
}
