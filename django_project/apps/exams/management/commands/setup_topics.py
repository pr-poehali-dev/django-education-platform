"""
Команда для быстрой загрузки начальных данных:
    python manage.py setup_topics
"""
from django.core.management.base import BaseCommand
from django.core.management import call_command


class Command(BaseCommand):
    help = 'Загружает начальные темы, задания и тесты по информатике'

    def handle(self, *args, **options):
        self.stdout.write('Загрузка начальных данных...')
        call_command('loaddata', 'initial_data', verbosity=0)
        self.stdout.write(self.style.SUCCESS('✓ Данные успешно загружены!'))
        self.stdout.write('  - 6 тем ЕГЭ по информатике')
        self.stdout.write('  - 10 заданий в формате ФИПИ')
        self.stdout.write('  - 3 тематических теста')
