import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { saveAuth } from '@/lib/auth';

interface Props { onNavigate: (page: string) => void; }

export default function LoginPage({ onNavigate }: Props) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    setLoading(false);
    if (form.email === 'admin@ege161.ru') {
      saveAuth('admin-token', { id: 0, email: form.email, first_name: 'Администратор', last_name: '', role: 'admin', created_at: '' });
      onNavigate('admin');
      return;
    }
    if (form.email === 'teacher@ege161.ru') {
      saveAuth('teacher-token', { id: 2, email: form.email, first_name: 'Мария', last_name: 'Иванова', role: 'teacher', created_at: '' });
      onNavigate('teacher');
      return;
    }
    saveAuth('student-token', { id: 3, email: form.email, first_name: 'Александр', last_name: 'Петров', role: 'student', created_at: '' });
    onNavigate('cabinet');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white border border-gray-200 rounded-2xl p-8">
          <button onClick={() => onNavigate('home')} className="flex items-center gap-2 mb-6">
            <img src="https://cdn.poehali.dev/projects/39128eb5-1466-4bc8-bf0d-7bf1ac0aa4a0/bucket/653b0e5d-5840-49cc-9820-ee06662e61d6.png"
              alt="" className="w-7 h-7 object-contain" />
            <span className="font-semibold text-sm text-gray-900">Отличный код</span>
          </button>
          <h1 className="text-xl font-semibold text-gray-900 mb-1">Вход</h1>
          <p className="text-sm text-gray-500 mb-5">Войдите в свой аккаунт</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
              <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                required placeholder="example@mail.ru"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Пароль</label>
              <input type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                required placeholder="Ваш пароль"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100" />
            </div>
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                <Icon name="AlertCircle" size={13} className="flex-shrink-0" /> {error}
              </div>
            )}
            <button type="submit" disabled={loading}
              className="w-full py-2.5 bg-blue-700 text-white text-sm font-medium rounded-lg hover:bg-blue-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
              {loading && <Icon name="Loader2" size={15} className="animate-spin" />}
              {loading ? 'Входим...' : 'Войти'}
            </button>
          </form>

          <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-500">
            <p className="font-medium text-gray-600 mb-1">Тестовые аккаунты:</p>
            <p>любой email → ученик</p>
            <p>teacher@ege161.ru → учитель</p>
            <p>admin@ege161.ru → администратор</p>
          </div>

          <p className="text-center text-xs text-gray-500 mt-4">
            Нет аккаунта?{' '}
            <button onClick={() => onNavigate('register')} className="text-blue-700 hover:underline font-medium">Зарегистрироваться</button>
          </p>
        </div>
      </div>
    </div>
  );
}
