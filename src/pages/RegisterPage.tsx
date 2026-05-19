import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface RegisterPageProps { onNavigate: (page: string) => void; }

export default function RegisterPage({ onNavigate }: RegisterPageProps) {
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', password: '', password2: '' });
  const [pd, setPd] = useState(false);
  const [age, setAge] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pd || !age) { setError('Необходимо дать согласие на обработку персональных данных'); return; }
    if (form.password !== form.password2) { setError('Пароли не совпадают'); return; }
    if (form.password.length < 8) { setError('Пароль должен содержать не менее 8 символов'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    onNavigate(role === 'teacher' ? 'teacher' : 'cabinet');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          <div className="mb-6">
            <button onClick={() => onNavigate('home')} className="flex items-center gap-2 mb-5">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">ЕГЭ</span>
              </div>
              <span className="font-semibold text-sm text-gray-900">ЕГЭ161</span>
            </button>
            <h1 className="text-xl font-semibold text-gray-900 mb-1">Регистрация</h1>
            <p className="text-sm text-gray-500">Создайте аккаунт для подготовки к ЕГЭ</p>
          </div>

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-2 mb-6">
            {(['student', 'teacher'] as const).map(r => (
              <button key={r} onClick={() => setRole(r)}
                className={`py-2.5 rounded-lg text-sm font-medium transition-all border ${
                  role === r
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}>
                {r === 'student' ? '🎓 Ученик' : '📖 Учитель'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Имя *</label>
                <input value={form.first_name} onChange={set('first_name')} required placeholder="Александр"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Фамилия *</label>
                <input value={form.last_name} onChange={set('last_name')} required placeholder="Иванов"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Email *</label>
              <input type="email" value={form.email} onChange={set('email')} required placeholder="example@mail.ru"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200" />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Пароль *</label>
              <input type="password" value={form.password} onChange={set('password')} required placeholder="Минимум 8 символов"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200" />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Подтвердите пароль *</label>
              <input type="password" value={form.password2} onChange={set('password2')} required placeholder="Повторите пароль"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200" />
            </div>

            {/* 152-ФЗ consent */}
            <div className="pt-2 space-y-3 border-t border-gray-100">
              <p className="text-xs text-gray-500 font-medium">Согласие на обработку персональных данных</p>

              <label className="flex items-start gap-3 cursor-pointer group">
                <input type="checkbox" checked={pd} onChange={e => setPd(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-blue-600 cursor-pointer" />
                <span className="text-xs text-gray-600 leading-relaxed">
                  Я даю согласие на обработку моих персональных данных (имя, фамилия, email) в соответствии с{' '}
                  <button type="button" onClick={() => onNavigate('pd-policy')} className="text-blue-600 hover:underline">
                    Политикой обработки персональных данных
                  </button>
                  {' '}согласно Федеральному закону от 27.07.2006 № 152-ФЗ «О персональных данных». Согласие дано в целях предоставления доступа к образовательным материалам платформы ЕГЭ161.
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={age} onChange={e => setAge(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-blue-600 cursor-pointer" />
                <span className="text-xs text-gray-600 leading-relaxed">
                  Я подтверждаю, что мне исполнилось 14 лет, либо настоящее согласие даётся законным представителем
                  несовершеннолетнего субъекта персональных данных.
                </span>
              </label>
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                <Icon name="AlertCircle" size={14} className="flex-shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            <button type="submit" disabled={loading || !pd || !age}
              className="w-full py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2">
              {loading && <Icon name="Loader2" size={15} className="animate-spin" />}
              {loading ? 'Создаём аккаунт...' : 'Зарегистрироваться'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-5">
            Уже есть аккаунт?{' '}
            <button onClick={() => onNavigate('login')} className="text-blue-600 hover:underline font-medium">
              Войти
            </button>
          </p>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4 px-4">
          Оператор персональных данных: ЕГЭ161.ru · Ростов-на-Дону<br />
          Данные хранятся на серверах на территории Российской Федерации
        </p>
      </div>
    </div>
  );
}
