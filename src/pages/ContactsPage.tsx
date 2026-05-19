export default function ContactsPage() {
  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">Контакты</h1>
      <p className="text-gray-500 text-sm mb-8">Есть вопросы? Напишите нам.</p>
      <div className="space-y-3 text-sm text-gray-700">
        <div className="flex gap-3 p-4 border border-gray-200 rounded-xl">
          <span className="text-gray-400 w-16 flex-shrink-0">Email</span>
          <a href="mailto:info@ege161.ru" className="text-blue-600 hover:underline">info@ege161.ru</a>
        </div>
        <div className="flex gap-3 p-4 border border-gray-200 rounded-xl">
          <span className="text-gray-400 w-16 flex-shrink-0">Сайт</span>
          <a href="https://ege161.ru" className="text-blue-600 hover:underline">ege161.ru</a>
        </div>
        <div className="flex gap-3 p-4 border border-gray-200 rounded-xl">
          <span className="text-gray-400 w-16 flex-shrink-0">Регион</span>
          <span>Ростов-на-Дону, Ростовская область</span>
        </div>
      </div>
    </div>
  );
}
