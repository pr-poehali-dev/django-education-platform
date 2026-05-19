from django.contrib import admin
from django.utils.html import format_html
from .models import Topic, Question, AnswerChoice, Test, TestQuestion, Attempt, UserAnswer


class AnswerChoiceInline(admin.TabularInline):
    model = AnswerChoice
    extra = 4
    fields = ('text', 'is_correct', 'order')


@admin.register(Topic)
class TopicAdmin(admin.ModelAdmin):
    list_display = ('icon', 'title', 'fipi_number', 'order', 'questions_count')
    list_editable = ('order',)
    prepopulated_fields = {'slug': ('title',)}
    search_fields = ('title', 'fipi_number')
    ordering = ('order',)

    def questions_count(self, obj):
        return obj.questions_count
    questions_count.short_description = 'Заданий'


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('short_text', 'topic', 'question_type', 'difficulty', 'points', 'is_active')
    list_filter = ('topic', 'difficulty', 'question_type', 'is_active')
    search_fields = ('text', 'fipi_source')
    list_editable = ('is_active', 'difficulty', 'points')
    inlines = [AnswerChoiceInline]
    fieldsets = (
        ('Задание', {'fields': ('topic', 'text', 'image', 'code_snippet')}),
        ('Настройки', {'fields': ('question_type', 'difficulty', 'points', 'fipi_source', 'is_active')}),
        ('Разбор', {'fields': ('explanation',)}),
    )

    def short_text(self, obj):
        return obj.text[:80] + '...' if len(obj.text) > 80 else obj.text
    short_text.short_description = 'Задание'


class TestQuestionInline(admin.TabularInline):
    model = TestQuestion
    extra = 0
    autocomplete_fields = ['question']
    fields = ('question', 'order')


@admin.register(Test)
class TestAdmin(admin.ModelAdmin):
    list_display = ('title', 'test_type', 'questions_count', 'attempts_count', 'avg_percent', 'is_active')
    list_filter = ('test_type', 'is_active')
    search_fields = ('title',)
    prepopulated_fields = {'slug': ('title',)}
    filter_horizontal = ('topics',)
    inlines = [TestQuestionInline]

    def questions_count(self, obj):
        return obj.questions_count
    questions_count.short_description = 'Заданий'

    def attempts_count(self, obj):
        return obj.attempts_count
    attempts_count.short_description = 'Попыток'

    def avg_percent(self, obj):
        p = obj.avg_percent
        color = '#22c55e' if p >= 70 else '#eab308' if p >= 50 else '#ef4444'
        return format_html('<span style="color:{}">{} %</span>', color, p)
    avg_percent.short_description = 'Средний балл'


@admin.register(Attempt)
class AttemptAdmin(admin.ModelAdmin):
    list_display = ('user', 'test', 'score', 'max_score', 'percent_display', 'is_completed', 'started_at')
    list_filter = ('is_completed', 'test')
    search_fields = ('user__username', 'test__title')
    readonly_fields = ('started_at', 'finished_at')

    def percent_display(self, obj):
        p = obj.percent
        color = '#22c55e' if p >= 70 else '#eab308' if p >= 50 else '#ef4444'
        return format_html('<b style="color:{}">{} %</b>', color, p)
    percent_display.short_description = '%'
