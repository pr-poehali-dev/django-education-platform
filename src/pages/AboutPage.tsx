import Icon from '@/components/ui/icon';

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-3">О платформе ЕГЭ161</h1>
        <p className="text-gray-500 leading-relaxed">
          ЕГЭ161 — образовательная платформа для подготовки к ЕГЭ по информатике, разработанная для учеников и учителей Ростовской области и всей России.
        </p>
      </div>

      <div className="space-y-6">
        <div className="border border-gray-200 rounded-xl p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Icon name="Target" size={18} className="text-blue-600" /> Наша цель
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Сделать качественную подготовку к ЕГЭ доступной для каждого ученика. Все задания составлены в точном соответствии с кодификатором и форматом ФИПИ 2025 года.
          </p>
        </div>

        <div className="border border-gray-200 rounded-xl p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Icon name="Shield" size={18} className="text-blue-600" /> Защита персональных данных
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-2">
            Платформа работает в соответствии с Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных».
          </p>
          <ul className="text-sm text-gray-600 space-y-1.5 list-disc list-inside">
            <li>Персональные данные хранятся на серверах в России</li>
            <li>Передача данных третьим лицам не производится</li>
            <li>Пользователь вправе отозвать согласие в любое время</li>
            <li>Данные используются исключительно для работы платформы</li>
          </ul>
        </div>

        <div className="border border-gray-200 rounded-xl p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Icon name="Mail" size={18} className="text-blue-600" /> Контакты
          </h2>
          <div className="text-sm text-gray-600 space-y-1.5">
            <div>Сайт: <a href="https://ege161.ru" className="text-blue-600 hover:underline">ege161.ru</a></div>
            <div>Email: <a href="mailto:info@ege161.ru" className="text-blue-600 hover:underline">info@ege161.ru</a></div>
            <div>Ростов-на-Дону, Ростовская область</div>
          </div>
        </div>
      </div>
    </div>
  );
}
