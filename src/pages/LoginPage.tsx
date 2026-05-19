import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface LoginPageProps { onNavigate: (page: string) => void; }

export default function LoginPage({ onNavigate }: LoginPageProps) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    await new Promise(r => setTimeout(r, 600));
    setLoading(false);
    if (!form.email || !form.password) { setError('Введите email и пароль'); return; }
    onNavigate('cabinet');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          <div className="mb-6">
            <button onClick={() => onNavigate('home')} className="flex items-center gap-2 mb-5">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">ЕГЭ</span>
              </div>
              <span className="font-semibold text-sm text-gray-900">ЕГЭ161</span>
            </button>
            <h1 className="text-xl font-semibold text-gray-900 mb-1">Вход</h1>
            <p className="text-sm text-gray-500">Войдите в свой аккаунт</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Email</label>
              <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                required placeholder="example@mail.ru"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Пароль</label>
              <input type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                required placeholder="Ваш пароль"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200" />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                <Icon name="AlertCircle" size={13} className="flex-shrink-0" />
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
              {loading && <Icon name="Loader2" size={15} className="animate-spin" />}
              {loading ? 'Входим...' : 'Войти'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-5">
            Нет аккаунта?{' '}
            <button onClick={() => onNavigate('register')} className="text-blue-600 hover:underline font-medium">
              Зарегистрироваться
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
