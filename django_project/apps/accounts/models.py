from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class Grade(models.IntegerChoices):
        GRADE_9 = 9, '9 класс'
        GRADE_10 = 10, '10 класс'
        GRADE_11 = 11, '11 класс'
        GRADUATE = 0, 'Выпускник'

    patronymic = models.CharField('Отчество', max_length=100, blank=True)
    grade = models.IntegerField('Класс', choices=Grade.choices, null=True, blank=True)
    city = models.CharField('Город', max_length=100, blank=True)
    avatar = models.ImageField('Аватар', upload_to='avatars/', null=True, blank=True)
    bio = models.TextField('О себе', blank=True)
    total_score = models.IntegerField('Общий балл', default=0)
    streak_days = models.IntegerField('Серия дней', default=0)
    last_activity = models.DateField('Последняя активность', null=True, blank=True)

    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'

    def __str__(self):
        return f'{self.get_full_name() or self.username}'

    def get_full_name(self):
        parts = [self.last_name, self.first_name, self.patronymic]
        return ' '.join(p for p in parts if p).strip()

    @property
    def tests_count(self):
        return self.attempts.count()

    @property
    def avg_score(self):
        attempts = self.attempts.filter(is_completed=True)
        if not attempts.exists():
            return 0
        return round(sum(a.percent for a in attempts) / attempts.count())
