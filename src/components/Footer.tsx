interface FooterProps { onNavigate: (page: string) => void; }

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <img src="https://cdn.poehali.dev/projects/39128eb5-1466-4bc8-bf0d-7bf1ac0aa4a0/bucket/653b0e5d-5840-49cc-9820-ee06662e61d6.png"
                alt="" className="w-7 h-7 object-contain" />
              <span className="font-semibold text-sm text-gray-900">Отличный код</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Тренажёр ЕГЭ по информатике. 27 заданий ФИПИ, 3 часа 55 минут, автопроверка.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              <a href="mailto:ege161@yandex.ru" className="hover:text-blue-700">ege161@yandex.ru</a>
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Платформа</p>
            <div className="space-y-1.5">
              {[['home', 'Главная'], ['variants', 'Варианты'], ['about', 'О проекте']].map(([id, lbl]) => (
                <button key={id} onClick={() => onNavigate(id)}
                  className="block text-xs text-gray-500 hover:text-gray-800 transition-colors">{lbl}</button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Аккаунт</p>
            <div className="space-y-1.5">
              {[['login', 'Войти'], ['register', 'Регистрация'], ['pd-policy', 'Политика ПД']].map(([id, lbl]) => (
                <button key={id} onClick={() => onNavigate(id)}
                  className="block text-xs text-gray-500 hover:text-gray-800 transition-colors">{lbl}</button>
              ))}
            </div>
          </div>
        </div>
        <div className="pt-5 border-t border-gray-200 flex flex-col sm:flex-row justify-between gap-1 text-xs text-gray-400">
          <span>© 2025 Отличный код · ege161.ru · Ростов-на-Дону</span>
          <span>Обработка ПД в соответствии с 152-ФЗ</span>
        </div>
      </div>
    </footer>
  );
}
