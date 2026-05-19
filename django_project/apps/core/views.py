from django.shortcuts import render
from apps.exams.models import Test, Topic, Attempt


def home_view(request):
    topics = Topic.objects.all()[:6]
    recent_tests = Test.objects.filter(is_active=True, test_type='variant')[:3]
    training_tests = Test.objects.filter(is_active=True, test_type='training')[:6]
    stats = {
        'topics': Topic.objects.count(),
        'tests': Test.objects.filter(is_active=True).count(),
        'attempts': Attempt.objects.filter(is_completed=True).count(),
    }
    return render(request, 'core/home.html', {
        'topics': topics,
        'recent_tests': recent_tests,
        'training_tests': training_tests,
        'stats': stats,
    })


def about_view(request):
    return render(request, 'core/about.html')
