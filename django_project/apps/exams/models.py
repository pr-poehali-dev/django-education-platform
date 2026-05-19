from django.db import models
from django.conf import settings


class Topic(models.Model):
    """Тема/раздел ЕГЭ по информатике"""
    title = models.CharField('Название', max_length=200)
    slug = models.SlugField('Slug', unique=True)
    description = models.TextField('Описание', blank=True)
    order = models.PositiveIntegerField('Порядок', default=0)
    icon = models.CharField('Иконка (эмодзи)', max_length=10, default='📘')
    fipi_number = models.CharField('Номер задания ФИПИ', max_length=10, blank=True,
        help_text='Например: №1, №5, №12')

    class Meta:
        verbose_name = 'Тема'
        verbose_name_plural = 'Темы'
        ordering = ['order']

    def __str__(self):
        return self.title

    @property
    def questions_count(self):
        return self.questions.filter(is_active=True).count()


class Question(models.Model):
    """Задание в формате ФИПИ"""

    class Difficulty(models.TextChoices):
        EASY = 'easy', 'Лёгкий'
        MEDIUM = 'medium', 'Средний'
        HARD = 'hard', 'Сложный'

    class QuestionType(models.TextChoices):
        SINGLE = 'single', 'Один вариант'
        MULTIPLE = 'multiple', 'Несколько вариантов'
        TEXT = 'text', 'Текстовый ответ'
        NUMBER = 'number', 'Числовой ответ'

    topic = models.ForeignKey(Topic, on_delete=models.CASCADE, related_name='questions', verbose_name='Тема')
    text = models.TextField('Текст задания')
    image = models.ImageField('Изображение к заданию', upload_to='questions/', null=True, blank=True)
    code_snippet = models.TextField('Код (если есть)', blank=True,
        help_text='Фрагмент кода для задания')
    question_type = models.CharField('Тип задания', max_length=20,
        choices=QuestionType.choices, default=QuestionType.SINGLE)
    difficulty = models.CharField('Сложность', max_length=10,
        choices=Difficulty.choices, default=Difficulty.MEDIUM)
    explanation = models.TextField('Разбор решения', blank=True)
    fipi_source = models.CharField('Источник ФИПИ', max_length=200, blank=True,
        help_text='Год/вариант из банка ФИПИ')
    points = models.PositiveIntegerField('Баллы за задание', default=1)
    is_active = models.BooleanField('Активно', default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Задание'
        verbose_name_plural = 'Задания'

    def __str__(self):
        return f'{self.topic.fipi_number} — {self.text[:60]}...'


class AnswerChoice(models.Model):
    """Вариант ответа для вопросов с выбором"""
    question = models.ForeignKey(Question, on_delete=models.CASCADE,
        related_name='choices', verbose_name='Задание')
    text = models.CharField('Текст варианта', max_length=500)
    is_correct = models.BooleanField('Правильный', default=False)
    order = models.PositiveIntegerField('Порядок', default=0)

    class Meta:
        verbose_name = 'Вариант ответа'
        verbose_name_plural = 'Варианты ответов'
        ordering = ['order']

    def __str__(self):
        return f'{self.text} {"✓" if self.is_correct else "✗"}'


class Test(models.Model):
    """Тест — набор заданий"""

    class TestType(models.TextChoices):
        TOPIC = 'topic', 'Тематический'
        VARIANT = 'variant', 'Вариант ЕГЭ'
        TRAINING = 'training', 'Тренировочный'
        DIAGNOSTIC = 'diagnostic', 'Диагностический'

    title = models.CharField('Название', max_length=200)
    slug = models.SlugField('Slug', unique=True)
    description = models.TextField('Описание', blank=True)
    test_type = models.CharField('Тип теста', max_length=20,
        choices=TestType.choices, default=TestType.TOPIC)
    topics = models.ManyToManyField(Topic, blank=True, verbose_name='Темы')
    questions = models.ManyToManyField(Question, through='TestQuestion', verbose_name='Задания')
    time_limit = models.PositiveIntegerField('Время (минуты)', default=30, null=True, blank=True)
    is_active = models.BooleanField('Активен', default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Тест'
        verbose_name_plural = 'Тесты'
        ordering = ['-created_at']

    def __str__(self):
        return self.title

    @property
    def questions_count(self):
        return self.questions.count()

    @property
    def attempts_count(self):
        return self.attempts.filter(is_completed=True).count()

    @property
    def avg_percent(self):
        attempts = self.attempts.filter(is_completed=True)
        if not attempts.exists():
            return 0
        return round(sum(a.percent for a in attempts) / attempts.count())


class TestQuestion(models.Model):
    """Задание в тесте с порядковым номером"""
    test = models.ForeignKey(Test, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    order = models.PositiveIntegerField('Порядок', default=0)

    class Meta:
        ordering = ['order']
        unique_together = ('test', 'question')


class Attempt(models.Model):
    """Попытка прохождения теста"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name='attempts', verbose_name='Пользователь')
    test = models.ForeignKey(Test, on_delete=models.CASCADE,
        related_name='attempts', verbose_name='Тест')
    started_at = models.DateTimeField('Начало', auto_now_add=True)
    finished_at = models.DateTimeField('Конец', null=True, blank=True)
    is_completed = models.BooleanField('Завершён', default=False)
    score = models.IntegerField('Баллов набрано', default=0)
    max_score = models.IntegerField('Максимум баллов', default=0)

    class Meta:
        verbose_name = 'Попытка'
        verbose_name_plural = 'Попытки'
        ordering = ['-started_at']

    def __str__(self):
        return f'{self.user} — {self.test} ({self.percent}%)'

    @property
    def percent(self):
        if self.max_score == 0:
            return 0
        return round(self.score / self.max_score * 100)

    @property
    def grade_label(self):
        p = self.percent
        if p >= 85:
            return 'Отлично'
        elif p >= 65:
            return 'Хорошо'
        elif p >= 45:
            return 'Удовлетворительно'
        return 'Нужно повторить'


class UserAnswer(models.Model):
    """Ответ пользователя на конкретное задание"""
    attempt = models.ForeignKey(Attempt, on_delete=models.CASCADE,
        related_name='answers', verbose_name='Попытка')
    question = models.ForeignKey(Question, on_delete=models.CASCADE, verbose_name='Задание')
    selected_choices = models.ManyToManyField(AnswerChoice, blank=True, verbose_name='Выбранные варианты')
    text_answer = models.CharField('Текстовый ответ', max_length=500, blank=True)
    is_correct = models.BooleanField('Правильно', default=False)
    points_earned = models.IntegerField('Баллов получено', default=0)

    class Meta:
        verbose_name = 'Ответ пользователя'
        verbose_name_plural = 'Ответы пользователей'
        unique_together = ('attempt', 'question')
