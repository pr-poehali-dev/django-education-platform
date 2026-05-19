import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { saveAuth } from '@/lib/auth';

interface Props { onNavigate: (page: string) => void; }

export default function RegisterPage({ onNavigate }: Props) {
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [form, setForm] = useState({ last_name: '', first_name: '', patronymic: '', email: '', password: '', password2: '' });
  const [pd, setPd] = useState(false);
  const [age, setAge] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pd || !age) { setError('Необходимо дать оба согласия на обработку персональных данных'); return; }
    if (form.password !== form.password2) { setError('Пароли не совпадают'); return; }
    if (form.password.length < 8) { setError('Пароль — не менее 8 символов'); return; }
    setError(''); setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    setLoading(false);
    saveAuth('mock-token', {
      id: 1, email: form.email, first_name: form.first_name, last_name: form.last_name,
      role, created_at: new Date().toISOString()
    });
    onNavigate(role === 'teacher' ? 'teacher' : 'cabinet');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-200 rounded-2xl p-8">
          <button onClick={() => onNavigate('home')} className="flex items-center gap-2 mb-6">
            <img src="https://cdn.poehali.dev/projects/39128eb5-1466-4bc8-bf0d-7bf1ac0aa4a0/bucket/653b0e5d-5840-49cc-9820-ee06662e61d6.png"
              alt="" className="w-7 h-7 object-contain" />
            <span className="font-semibold text-sm text-gray-900">Отличный код</span>
          </button>
          <h1 className="text-xl font-semibold text-gray-900 mb-1">Регистрация</h1>
          <p className="text-sm text-gray-500 mb-5">Создайте аккаунт для подготовки к ЕГЭ</p>

          {/* Role */}
          <div className="grid grid-cols-2 gap-2 mb-5">
            {(['student', 'teacher'] as const).map(r => (
              <button key={r} onClick={() => setRole(r)}
                className={`py-2.5 rounded-lg text-sm font-medium border transition-all ${role === r ? 'border-blue-700 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                {r === 'student' ? '🎓 Ученик' : '📖 Преподаватель'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Фамилия *</label>
                <input value={form.last_name} onChange={set('last_name')} required placeholder="Иванов"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Имя *</label>
                <input value={form.first_name} onChange={set('first_name')} required placeholder="Александр"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Отчество</label>
              <input value={form.patronymic} onChange={set('patronymic')} placeholder="Сергеевич"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Email *</label>
              <input type="email" value={form.email} onChange={set('email')} required placeholder="example@mail.ru"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Пароль *</label>
                <input type="password" value={form.password} onChange={set('password')} required placeholder="Мин. 8 символов"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Повторите *</label>
                <input type="password" value={form.password2} onChange={set('password2')} required placeholder="Ещё раз"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100" />
              </div>
            </div>

            {/* 152-ФЗ consent */}
            <div className="pt-3 space-y-3 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-600">Согласие на обработку персональных данных (152-ФЗ)</p>

              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={pd} onChange={e => setPd(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-blue-700 flex-shrink-0 cursor-pointer" />
                <span className="text-xs text-gray-600 leading-relaxed">
                  Я даю согласие на обработку моих персональных данных (фамилия, имя, отчество, адрес электронной почты)
                  оператором ege161.ru в соответствии с{' '}
                  <button type="button" onClick={() => onNavigate('pd-policy')} className="text-blue-700 hover:underline">
                    Политикой обработки персональных данных
                  </button>
                  {' '}согласно Федеральному закону № 152-ФЗ от 27.07.2006 г. Согласие дано в целях получения доступа к образовательным материалам платформы «Отличный код».
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={age} onChange={e => setAge(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-blue-700 flex-shrink-0 cursor-pointer" />
                <span className="text-xs text-gray-600 leading-relaxed">
                  Подтверждаю, что мне исполнилось 14 лет, либо данное согласие дано законным представителем
                  несовершеннолетнего (ст. 9, ч. 1 Закона № 152-ФЗ).
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
              className="w-full py-2.5 bg-blue-700 text-white text-sm font-medium rounded-lg hover:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 mt-1">
              {loading && <Icon name="Loader2" size={15} className="animate-spin" />}
              {loading ? 'Создаём аккаунт...' : 'Зарегистрироваться'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-4">
            Уже есть аккаунт?{' '}
            <button onClick={() => onNavigate('login')} className="text-blue-700 hover:underline font-medium">Войти</button>
          </p>
        </div>
        <p className="text-center text-xs text-gray-400 mt-4 px-2">
          Оператор ПД: ege161.ru · ege161@yandex.ru · Ростов-на-Дону, РФ<br />
          Данные хранятся на серверах на территории Российской Федерации
        </p>
      </div>
    </div>
  );
}
