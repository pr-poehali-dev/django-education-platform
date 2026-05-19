from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('username', 'get_full_name', 'email', 'grade', 'total_score', 'tests_count', 'is_active')
    list_filter = ('grade', 'is_active', 'is_staff')
    search_fields = ('username', 'first_name', 'last_name', 'email')
    ordering = ('-total_score',)

    fieldsets = BaseUserAdmin.fieldsets + (
        ('Дополнительно', {'fields': ('patronymic', 'grade', 'city', 'avatar', 'bio', 'total_score', 'streak_days')}),
    )
