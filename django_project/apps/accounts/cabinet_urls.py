from django.urls import path
from . import views

urlpatterns = [
    path('', views.cabinet_view, name='cabinet'),
    path('edit/', views.profile_edit_view, name='profile_edit'),
]
