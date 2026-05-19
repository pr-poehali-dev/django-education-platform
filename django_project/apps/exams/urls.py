from django.urls import path
from . import views

urlpatterns = [
    path('', views.test_list_view, name='test_list'),
    path('topics/', views.topic_list_view, name='topic_list'),
    path('topics/<slug:slug>/', views.topic_detail_view, name='topic_detail'),
    path('tests/<slug:slug>/', views.test_detail_view, name='test_detail'),
    path('tests/<slug:slug>/start/', views.test_start_view, name='test_start'),
    path('attempt/<int:attempt_id>/', views.test_run_view, name='test_run'),
    path('attempt/<int:attempt_id>/answer/', views.submit_answer_view, name='submit_answer'),
    path('attempt/<int:attempt_id>/finish/', views.finish_attempt_view, name='finish_attempt'),
    path('result/<int:attempt_id>/', views.result_view, name='result'),
    path('leaderboard/', views.leaderboard_view, name='leaderboard'),
]
