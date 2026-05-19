from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('apps.core.urls')),
    path('accounts/', include('apps.accounts.urls')),
    path('exams/', include('apps.exams.urls')),
    path('cabinet/', include('apps.accounts.cabinet_urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

admin.site.site_header = 'КодГрад — Администрирование'
admin.site.site_title = 'КодГрад'
admin.site.index_title = 'Управление платформой'
