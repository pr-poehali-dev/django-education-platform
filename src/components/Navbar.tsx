import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { getUser, clearAuth } from '@/lib/auth';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = getUser();

  const handleLogout = () => {
    clearAuth();
    onNavigate('home');
  };

  const navLinks = [
    { id: 'topics', label: 'Темы ЕГЭ' },
    { id: 'tests', label: 'Тесты' },
    { id: 'leaderboard', label: 'Рейтинг' },
    { id: 'about', label: 'О платформе' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center h-14 gap-6">
          <button onClick={() => onNavigate('home')} className="flex items-center gap-2 flex-shrink-0">
            <div className="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center">
              <span className="text-white text-xs font-bold">ЕГЭ</span>
            </div>
            <span className="font-semibold text-gray-900 text-sm tracking-tight">ЕГЭ161</span>
          </button>

          <nav className="hidden md:flex items-center gap-0.5 flex-1">
            {navLinks.map(l => (
              <button
                key={l.id}
                onClick={() => onNavigate(l.id)}
                className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                  currentPage === l.id
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {l.label}
              </button>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2 ml-auto">
            {user ? (
              <>
                <button
                  onClick={() => onNavigate(user.role === 'teacher' ? 'teacher' : 'cabinet')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-semibold">
                    {user.first_name[0]}{user.last_name[0]}
                  </div>
                  {user.first_name}
                  {user.role === 'teacher' && <span className="badge-blue text-xs">Учитель</span>}
                </button>
                <button onClick={handleLogout} className="text-sm text-gray-400 hover:text-gray-600 px-2 py-1 transition-colors">
                  Выйти
                </button>
              </>
            ) : (
              <>
                <button onClick={() => onNavigate('login')} className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-md hover:bg-gray-50 transition-colors">
                  Войти
                </button>
                <button onClick={() => onNavigate('register')} className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors font-medium">
                  Регистрация
                </button>
              </>
            )}
          </div>

          <button className="md:hidden ml-auto p-1.5 text-gray-500" onClick={() => setMobileOpen(!mobileOpen)}>
            <Icon name={mobileOpen ? 'X' : 'Menu'} size={20} />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1 animate-fade-in">
          {navLinks.map(l => (
            <button key={l.id} onClick={() => { onNavigate(l.id); setMobileOpen(false); }}
              className="block w-full text-left px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50">
              {l.label}
            </button>
          ))}
          <div className="pt-2 border-t border-gray-100 mt-2 flex gap-2">
            {user ? (
              <>
                <button onClick={() => { onNavigate(user.role === 'teacher' ? 'teacher' : 'cabinet'); setMobileOpen(false); }}
                  className="flex-1 py-2 text-sm bg-blue-50 text-blue-700 rounded-md font-medium">
                  Кабинет
                </button>
                <button onClick={() => { handleLogout(); setMobileOpen(false); }}
                  className="px-3 py-2 text-sm text-gray-500 border border-gray-200 rounded-md">
                  Выйти
                </button>
              </>
            ) : (
              <>
                <button onClick={() => { onNavigate('login'); setMobileOpen(false); }}
                  className="flex-1 py-2 text-sm border border-gray-200 rounded-md text-gray-700">
                  Войти
                </button>
                <button onClick={() => { onNavigate('register'); setMobileOpen(false); }}
                  className="flex-1 py-2 text-sm bg-blue-600 text-white rounded-md font-medium">
                  Регистрация
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
