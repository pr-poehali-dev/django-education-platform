import json
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.utils import timezone
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from .models import Topic, Test, Attempt, UserAnswer, AnswerChoice, Question


def topic_list_view(request):
    topics = Topic.objects.all()
    return render(request, 'exams/topic_list.html', {'topics': topics})


def topic_detail_view(request, slug):
    topic = get_object_or_404(Topic, slug=slug)
    tests = Test.objects.filter(topics=topic, is_active=True)
    questions = topic.questions.filter(is_active=True)
    return render(request, 'exams/topic_detail.html', {
        'topic': topic,
        'tests': tests,
        'questions': questions,
    })


def test_list_view(request):
    test_type = request.GET.get('type', '')
    tests = Test.objects.filter(is_active=True)
    if test_type:
        tests = tests.filter(test_type=test_type)
    return render(request, 'exams/test_list.html', {
        'tests': tests,
        'test_type': test_type,
        'test_types': Test.TestType.choices,
    })


def test_detail_view(request, slug):
    test = get_object_or_404(Test, slug=slug, is_active=True)
    user_attempts = []
    if request.user.is_authenticated:
        user_attempts = Attempt.objects.filter(
            user=request.user, test=test, is_completed=True
        ).order_by('-finished_at')[:5]
    return render(request, 'exams/test_detail.html', {
        'test': test,
        'user_attempts': user_attempts,
    })


@login_required
def test_start_view(request, slug):
    test = get_object_or_404(Test, slug=slug, is_active=True)
    attempt = Attempt.objects.create(
        user=request.user,
        test=test,
        max_score=sum(q.points for q in test.questions.all()),
    )
    return redirect('test_run', attempt_id=attempt.id)


@login_required
def test_run_view(request, attempt_id):
    attempt = get_object_or_404(Attempt, id=attempt_id, user=request.user, is_completed=False)
    questions = list(attempt.test.questions.filter(is_active=True).prefetch_related('choices'))
    answered_ids = attempt.answers.values_list('question_id', flat=True)

    current_index = 0
    for i, q in enumerate(questions):
        if q.id not in answered_ids:
            current_index = i
            break

    current_q = questions[current_index] if questions else None

    return render(request, 'exams/test_run.html', {
        'attempt': attempt,
        'question': current_q,
        'question_number': current_index + 1,
        'total_questions': len(questions),
        'answered_count': len(answered_ids),
        'questions': questions,
        'answered_ids': list(answered_ids),
        'progress_percent': round(len(answered_ids) / len(questions) * 100) if questions else 0,
    })


@login_required
@require_POST
def submit_answer_view(request, attempt_id):
    attempt = get_object_or_404(Attempt, id=attempt_id, user=request.user, is_completed=False)
    data = json.loads(request.body)
    question_id = data.get('question_id')
    question = get_object_or_404(Question, id=question_id)

    user_answer, _ = UserAnswer.objects.get_or_create(attempt=attempt, question=question)

    is_correct = False
    points_earned = 0

    if question.question_type in ('single', 'multiple'):
        choice_ids = data.get('choice_ids', [])
        choices = AnswerChoice.objects.filter(id__in=choice_ids, question=question)
        user_answer.selected_choices.set(choices)

        correct_ids = set(question.choices.filter(is_correct=True).values_list('id', flat=True))
        selected_ids = set(choice_ids)
        is_correct = correct_ids == selected_ids
        if is_correct:
            points_earned = question.points

    elif question.question_type in ('text', 'number'):
        text_answer = data.get('text_answer', '').strip()
        user_answer.text_answer = text_answer
        correct = question.choices.filter(is_correct=True).first()
        if correct:
            is_correct = text_answer.lower() == correct.text.lower()
        if is_correct:
            points_earned = question.points

    user_answer.is_correct = is_correct
    user_answer.points_earned = points_earned
    user_answer.save()

    correct_choices = list(question.choices.filter(is_correct=True).values_list('id', flat=True))

    return JsonResponse({
        'is_correct': is_correct,
        'points_earned': points_earned,
        'correct_choices': correct_choices,
        'explanation': question.explanation,
    })


@login_required
@require_POST
def finish_attempt_view(request, attempt_id):
    attempt = get_object_or_404(Attempt, id=attempt_id, user=request.user, is_completed=False)
    attempt.score = sum(a.points_earned for a in attempt.answers.all())
    attempt.finished_at = timezone.now()
    attempt.is_completed = True
    attempt.save()

    user = request.user
    user.total_score += attempt.score
    user.last_activity = timezone.now().date()
    user.save(update_fields=['total_score', 'last_activity'])

    return JsonResponse({'redirect': f'/exams/result/{attempt.id}/'})


@login_required
def result_view(request, attempt_id):
    attempt = get_object_or_404(Attempt, id=attempt_id, user=request.user, is_completed=True)
    answers = attempt.answers.select_related('question').prefetch_related(
        'selected_choices', 'question__choices'
    ).order_by('question__topic__order')

    return render(request, 'exams/result.html', {
        'attempt': attempt,
        'answers': answers,
    })


def leaderboard_view(request):
    from django.contrib.auth import get_user_model
    User = get_user_model()
    top_users = User.objects.filter(is_active=True, total_score__gt=0).order_by('-total_score')[:20]
    return render(request, 'exams/leaderboard.html', {'top_users': top_users})
