import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const navItems = [
  { id: 'home', label: 'Главная', icon: 'Home' },
  { id: 'cs', label: 'Информатика', icon: 'Monitor' },
  { id: 'tests', label: 'Тесты', icon: 'ClipboardList' },
  { id: 'cabinet', label: 'Кабинет', icon: 'User' },
  { id: 'about', label: 'О платформе', icon: 'Info' },
  { id: 'contacts', label: 'Контакты', icon: 'Mail' },
];

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 card-glass border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 group"
          >
            <div className="w-8 h-8 rounded-lg gradient-purple-cyan flex items-center justify-center">
              <span className="text-white font-montserrat font-bold text-sm">КГ</span>
            </div>
            <span className="font-montserrat font-bold text-lg gradient-text">КодГрад</span>
          </button>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                  currentPage === item.id
                    ? 'bg-purple-500/20 text-purple-300 neon-text-purple'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon name={item.icon} size={15} />
                {item.label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => onNavigate('cabinet')}
              className="px-4 py-2 rounded-lg btn-neon-purple text-sm font-semibold"
            >
              Войти
            </button>
            <button
              onClick={() => onNavigate('admin')}
              className="px-3 py-2 rounded-lg border border-white/10 text-sm text-gray-400 hover:text-white hover:border-white/20 transition-all"
            >
              <Icon name="Settings" size={16} />
            </button>
          </div>

          <button
            className="md:hidden text-gray-400 hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <Icon name={mobileOpen ? 'X' : 'Menu'} size={24} />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-white/5 bg-black/90 backdrop-blur-xl animate-fade-in">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id); setMobileOpen(false); }}
                className={`w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  currentPage === item.id
                    ? 'bg-purple-500/20 text-purple-300'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon name={item.icon} size={16} />
                {item.label}
              </button>
            ))}
            <button
              onClick={() => { onNavigate('admin'); setMobileOpen(false); }}
              className="w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all flex items-center gap-2"
            >
              <Icon name="Settings" size={16} />
              Админпанель
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
