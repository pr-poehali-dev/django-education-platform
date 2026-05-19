# КодГрад — ЕГЭ Информатика

Образовательная платформа в стиле Kompege.ru для подготовки к ЕГЭ по информатике.

## Возможности

- 📚 Задания в формате ФИПИ по темам кодификатора
- ✅ Мгновенная автопроверка с подробным разбором
- 👤 Личный кабинет с историей и статистикой
- 🏆 Общий рейтинг учеников
- 🛠 Полноценная Django-админка для управления контентом

## Стек

- Python 3.10+ / Django 4.2
- SQLite (dev) / PostgreSQL (prod)
- Bootstrap 5 + кастомный CSS (тёмная тема)
- WhiteNoise для раздачи статики

---

## Быстрый старт

```bash
# 1. Клонировать и перейти в папку
cd django_project

# 2. Создать виртуальное окружение
python -m venv venv
source venv/bin/activate      # Linux/Mac
venv\Scripts\activate         # Windows

# 3. Установить зависимости
pip install -r requirements.txt

# 4. Скопировать конфиг
cp .env.example .env

# 5. Применить миграции
python manage.py migrate

# 6. Загрузить начальные данные (темы, задания, тесты)
python manage.py setup_topics

# 7. Создать суперпользователя (для админки)
python manage.py createsuperuser

# 8. Запустить сервер
python manage.py runserver
```

Открыть: http://127.0.0.1:8000  
Админка: http://127.0.0.1:8000/admin/

---

## Деплой на сервер (Ubuntu + Nginx)

```bash
# Установить зависимости сервера
sudo apt install python3-pip python3-venv nginx

# Собрать статику
python manage.py collectstatic --no-input

# Настроить .env для production
DEBUG=False
ALLOWED_HOSTS=ваш-домен.ru
SECRET_KEY=сгенерировать-новый-ключ

# Запустить через gunicorn
gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 3
```

Пример конфига Nginx:
```nginx
server {
    listen 80;
    server_name ваш-домен.ru;

    location /static/ {
        alias /путь/к/проекту/staticfiles/;
    }
    location /media/ {
        alias /путь/к/проекту/media/;
    }
    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## Структура проекта

```
django_project/
├── config/              # Настройки Django
│   ├── settings.py
│   └── urls.py
├── apps/
│   ├── core/            # Главная страница
│   ├── accounts/        # Регистрация, личный кабинет
│   └── exams/           # Темы, задания, тесты, результаты
├── templates/           # HTML-шаблоны
├── static/css/          # Стили
└── manage.py
```

## Добавление контента через Admin

1. Зайди на `/admin/`
2. **Exams → Темы** — добавь тему с номером ФИПИ (№1, №2...)
3. **Exams → Задания** — добавь задание, выбери тип и варианты ответов
4. **Exams → Тесты** — создай тест, добавь задания через инлайн

## Типы заданий

| Тип | Описание |
|-----|----------|
| `single` | Один правильный вариант |
| `multiple` | Несколько правильных вариантов |
| `text` | Текстовый ответ (строка) |
| `number` | Числовой ответ |
