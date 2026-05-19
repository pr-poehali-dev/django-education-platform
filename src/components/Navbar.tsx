import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { getUser, clearAuth } from '@/lib/auth';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const user = getUser();

  const links = [
    { id: 'home', label: 'Главная' },
    { id: 'variants', label: 'Варианты' },
    { id: 'about', label: 'О проекте' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center h-13 gap-6" style={{ height: 52 }}>
        {/* Logo */}
        <button onClick={() => onNavigate('home')} className="flex items-center gap-2 flex-shrink-0 group">
          <img
            src="https://cdn.poehali.dev/projects/39128eb5-1466-4bc8-bf0d-7bf1ac0aa4a0/bucket/653b0e5d-5840-49cc-9820-ee06662e61d6.png"
            alt="Отличный код"
            className="w-8 h-8 object-contain"
          />
          <span className="font-semibold text-gray-900 text-sm leading-tight hidden sm:block">
            Отличный<br /><span className="text-blue-700">код</span>
          </span>
        </button>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-0.5 flex-1">
          {links.map(l => (
            <button key={l.id} onClick={() => onNavigate(l.id)}
              className={`px-3 py-1.5 rounded text-sm transition-colors ${
                currentPage === l.id
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}>
              {l.label}
            </button>
          ))}
        </nav>

        {/* Auth */}
        <div className="hidden md:flex items-center gap-2 ml-auto">
          {user ? (
            <>
              <button onClick={() => onNavigate(user.role === 'teacher' ? 'teacher' : user.role === 'admin' ? 'admin' : 'cabinet')}
                className="flex items-center gap-2 px-3 py-1.5 rounded text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <div className="w-7 h-7 rounded-full bg-blue-700 flex items-center justify-center text-white text-xs font-bold">
                  {user.first_name[0]}{user.last_name[0]}
                </div>
                <span>{user.first_name}</span>
                {user.role === 'teacher' && <span className="badge-blue">Учитель</span>}
                {user.role === 'admin' && <span className="badge-red">Админ</span>}
              </button>
              <button onClick={() => { clearAuth(); onNavigate('home'); }}
                className="text-sm text-gray-400 hover:text-gray-600 px-2 transition-colors">
                Выйти
              </button>
            </>
          ) : (
            <>
              <button onClick={() => onNavigate('login')}
                className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded hover:bg-gray-50 transition-colors">
                Войти
              </button>
              <button onClick={() => onNavigate('register')}
                className="text-sm bg-blue-700 text-white px-3 py-1.5 rounded hover:bg-blue-800 transition-colors font-medium">
                Регистрация
              </button>
            </>
          )}
        </div>

        <button className="md:hidden ml-auto p-1.5 text-gray-500" onClick={() => setMenuOpen(!menuOpen)}>
          <Icon name={menuOpen ? 'X' : 'Menu'} size={20} />
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1 animate-fade-in">
          {links.map(l => (
            <button key={l.id} onClick={() => { onNavigate(l.id); setMenuOpen(false); }}
              className="block w-full text-left px-3 py-2 rounded text-sm text-gray-700 hover:bg-gray-50">
              {l.label}
            </button>
          ))}
          <div className="pt-2 border-t border-gray-100 flex gap-2 mt-2">
            {user ? (
              <>
                <button onClick={() => { onNavigate('cabinet'); setMenuOpen(false); }}
                  className="flex-1 py-2 text-sm bg-blue-50 text-blue-700 rounded font-medium">Кабинет</button>
                <button onClick={() => { clearAuth(); onNavigate('home'); setMenuOpen(false); }}
                  className="px-3 py-2 text-sm border border-gray-200 rounded text-gray-500">Выйти</button>
              </>
            ) : (
              <>
                <button onClick={() => { onNavigate('login'); setMenuOpen(false); }}
                  className="flex-1 py-2 text-sm border border-gray-200 rounded text-gray-700">Войти</button>
                <button onClick={() => { onNavigate('register'); setMenuOpen(false); }}
                  className="flex-1 py-2 text-sm bg-blue-700 text-white rounded font-medium">Регистрация</button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
