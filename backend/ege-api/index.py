"""
ЕГЭ161 — основной API
Авторизация, темы, тесты, попытки, кабинет, рейтинг, кабинет учителя
"""
import json
import os
import hashlib
import secrets
from datetime import datetime, timedelta, timezone
import psycopg2

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Authorization',
}

SCHEMA = 't_p57517493_django_education_pla'


def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def resp(status: int, data, extra_headers: dict = None):
    headers = {**CORS, 'Content-Type': 'application/json'}
    if extra_headers:
        headers.update(extra_headers)
    return {'statusCode': status, 'headers': headers, 'body': json.dumps(data, ensure_ascii=False, default=str)}


def err(status: int, msg: str):
    return resp(status, {'error': msg})


def hash_pw(pw: str) -> str:
    return hashlib.sha256(pw.encode()).hexdigest()


def get_user_from_token(conn, token: str):
    if not token:
        return None
    token = token.replace('Bearer ', '').strip()
    cur = conn.cursor()
    cur.execute(
        f"SELECT u.id, u.email, u.first_name, u.last_name, u.role, u.total_score "
        f"FROM {SCHEMA}.ege_sessions s "
        f"JOIN {SCHEMA}.ege_users u ON u.id = s.user_id "
        f"WHERE s.token = %s AND s.expires_at > NOW() AND u.is_active = true",
        (token,)
    )
    row = cur.fetchone()
    cur.close()
    if not row:
        return None
    return {'id': row[0], 'email': row[1], 'first_name': row[2], 'last_name': row[3], 'role': row[4], 'total_score': row[5]}


def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return resp(200, '')

    method = event.get('httpMethod', 'GET')
    path = event.get('path', '/')
    qs = event.get('queryStringParameters') or {}
    token = (event.get('headers') or {}).get('X-Authorization', '') or (event.get('headers') or {}).get('Authorization', '')
    body = {}
    if event.get('body'):
        try:
            body = json.loads(event['body'])
        except Exception:
            pass

    conn = get_conn()
    try:
        result = route(conn, method, path, qs, body, token)
    finally:
        conn.close()
    return result


def route(conn, method, path, qs, body, token):
    # ── AUTH ─────────────────────────────────────────────────────────────────
    if path == '/auth/register' and method == 'POST':
        return auth_register(conn, body)

    if path == '/auth/login' and method == 'POST':
        return auth_login(conn, body)

    if path == '/auth/me' and method == 'GET':
        return auth_me(conn, token)

    # ── TOPICS ────────────────────────────────────────────────────────────────
    if path == '/topics' and method == 'GET':
        return get_topics(conn)

    # ── TESTS ─────────────────────────────────────────────────────────────────
    if path == '/tests' and method == 'GET':
        return get_tests(conn, qs)

    if path.startswith('/tests/') and path.endswith('/attempt') and method == 'POST':
        test_id = int(path.split('/')[2])
        return submit_attempt(conn, token, test_id, body)

    if path.startswith('/tests/') and method == 'GET':
        test_id = int(path.split('/')[2])
        return get_test(conn, token, test_id)

    # ── CABINET ───────────────────────────────────────────────────────────────
    if path == '/cabinet/attempts' and method == 'GET':
        return get_my_attempts(conn, token)

    # ── LEADERBOARD ───────────────────────────────────────────────────────────
    if path == '/leaderboard' and method == 'GET':
        return get_leaderboard(conn)

    # ── TEACHER ───────────────────────────────────────────────────────────────
    if path == '/teacher/tests' and method == 'GET':
        return teacher_get_tests(conn, token)

    if path == '/teacher/tests' and method == 'POST':
        return teacher_create_test(conn, token, body)

    if path.startswith('/teacher/tests/') and method == 'PUT':
        test_id = int(path.split('/')[3])
        return teacher_update_test(conn, token, test_id, body)

    return err(404, 'Not found')


# ── AUTH ──────────────────────────────────────────────────────────────────────

def auth_register(conn, body):
    email = (body.get('email') or '').strip().lower()
    password = body.get('password', '')
    first_name = (body.get('first_name') or '').strip()
    last_name = (body.get('last_name') or '').strip()
    role = body.get('role', 'student')
    pd_consent = body.get('pd_consent', False)

    if not email or not password or not first_name or not last_name:
        return err(400, 'Заполните все обязательные поля')
    if not pd_consent:
        return err(400, 'Необходимо дать согласие на обработку персональных данных')
    if len(password) < 8:
        return err(400, 'Пароль должен содержать не менее 8 символов')
    if role not in ('student', 'teacher'):
        role = 'student'

    cur = conn.cursor()
    cur.execute(f"SELECT id FROM {SCHEMA}.ege_users WHERE email = %s", (email,))
    if cur.fetchone():
        cur.close()
        return err(409, 'Пользователь с таким email уже существует')

    cur.execute(
        f"INSERT INTO {SCHEMA}.ege_users (email, password_hash, first_name, last_name, role, pd_consent, pd_consent_at) "
        f"VALUES (%s, %s, %s, %s, %s, %s, NOW()) RETURNING id",
        (email, hash_pw(password), first_name, last_name, role, True)
    )
    user_id = cur.fetchone()[0]

    token = secrets.token_hex(32)
    expires = datetime.now(timezone.utc) + timedelta(days=30)
    cur.execute(
        f"INSERT INTO {SCHEMA}.ege_sessions (user_id, token, expires_at) VALUES (%s, %s, %s)",
        (user_id, token, expires)
    )
    conn.commit()
    cur.close()

    return resp(201, {
        'token': token,
        'user': {'id': user_id, 'email': email, 'first_name': first_name, 'last_name': last_name, 'role': role}
    })


def auth_login(conn, body):
    email = (body.get('email') or '').strip().lower()
    password = body.get('password', '')

    cur = conn.cursor()
    cur.execute(
        f"SELECT id, first_name, last_name, role, is_active FROM {SCHEMA}.ege_users WHERE email = %s AND password_hash = %s",
        (email, hash_pw(password))
    )
    row = cur.fetchone()
    if not row:
        cur.close()
        return err(401, 'Неверный email или пароль')
    user_id, first_name, last_name, role, is_active = row
    if not is_active:
        cur.close()
        return err(403, 'Аккаунт заблокирован')

    token = secrets.token_hex(32)
    expires = datetime.now(timezone.utc) + timedelta(days=30)
    cur.execute(
        f"INSERT INTO {SCHEMA}.ege_sessions (user_id, token, expires_at) VALUES (%s, %s, %s)",
        (user_id, token, expires)
    )
    conn.commit()
    cur.close()

    return resp(200, {
        'token': token,
        'user': {'id': user_id, 'email': email, 'first_name': first_name, 'last_name': last_name, 'role': role}
    })


def auth_me(conn, token):
    user = get_user_from_token(conn, token)
    if not user:
        return err(401, 'Не авторизован')
    return resp(200, user)


# ── TOPICS ────────────────────────────────────────────────────────────────────

def get_topics(conn):
    cur = conn.cursor()
    cur.execute(
        f"SELECT t.id, t.title, t.fipi_number, t.description, t.icon, "
        f"COUNT(te.id) AS tests_count "
        f"FROM {SCHEMA}.ege_topics t "
        f"LEFT JOIN {SCHEMA}.ege_tests te ON te.topic_id = t.id AND te.is_published = true "
        f"WHERE t.is_active = true "
        f"GROUP BY t.id ORDER BY t.sort_order"
    )
    rows = cur.fetchall()
    cur.close()
    return resp(200, [
        {'id': r[0], 'title': r[1], 'fipi_number': r[2], 'description': r[3], 'icon': r[4], 'tests_count': r[5]}
        for r in rows
    ])


# ── TESTS ─────────────────────────────────────────────────────────────────────

def get_tests(conn, qs):
    topic_id = qs.get('topic_id')
    cur = conn.cursor()
    base = (
        f"SELECT t.id, t.title, t.topic_id, tp.title, tp.fipi_number, t.difficulty, "
        f"t.time_limit_min, t.is_official, u.first_name || ' ' || u.last_name, "
        f"COUNT(DISTINCT a.id), t.created_at "
        f"FROM {SCHEMA}.ege_tests t "
        f"LEFT JOIN {SCHEMA}.ege_topics tp ON tp.id = t.topic_id "
        f"LEFT JOIN {SCHEMA}.ege_users u ON u.id = t.author_id "
        f"LEFT JOIN {SCHEMA}.ege_attempts a ON a.test_id = t.id "
        f"WHERE t.is_published = true"
    )
    if topic_id:
        cur.execute(base + " AND t.topic_id = %s GROUP BY t.id, tp.title, tp.fipi_number, u.first_name, u.last_name ORDER BY t.created_at DESC", (topic_id,))
    else:
        cur.execute(base + " GROUP BY t.id, tp.title, tp.fipi_number, u.first_name, u.last_name ORDER BY t.created_at DESC")

    rows = cur.fetchall()
    cur.close()
    tests = []
    for r in rows:
        tests.append({
            'id': r[0], 'title': r[1], 'topic_id': r[2], 'topic_title': r[3] or '',
            'fipi_number': r[4] or '', 'difficulty': r[5], 'time_limit_min': r[6],
            'is_official': r[7], 'author_name': r[8] or 'Команда ЕГЭ161',
            'attempts_count': r[9], 'created_at': str(r[10])
        })
    return resp(200, tests)


def get_test(conn, token, test_id):
    cur = conn.cursor()
    cur.execute(
        f"SELECT id, title, topic_id, difficulty, time_limit_min FROM {SCHEMA}.ege_tests WHERE id = %s AND is_published = true",
        (test_id,)
    )
    test = cur.fetchone()
    if not test:
        cur.close()
        return err(404, 'Тест не найден')

    cur.execute(
        f"SELECT q.id, q.text, q.code, q.type, q.explanation, q.points "
        f"FROM {SCHEMA}.ege_questions q WHERE q.test_id = %s ORDER BY q.sort_order",
        (test_id,)
    )
    qs = cur.fetchall()

    questions = []
    for q in qs:
        cur.execute(
            f"SELECT id, text, sort_order FROM {SCHEMA}.ege_choices WHERE question_id = %s ORDER BY sort_order",
            (q[0],)
        )
        choices = [{'id': str(c[0]), 'text': c[1]} for c in cur.fetchall()]
        questions.append({
            'id': q[0], 'text': q[1], 'code': q[2], 'type': q[3],
            'explanation': q[4], 'points': q[5], 'choices': choices
        })

    cur.close()
    return resp(200, {
        'id': test[0], 'title': test[1], 'topic_id': test[2],
        'difficulty': test[3], 'time_limit_min': test[4],
        'questions': questions
    })


def submit_attempt(conn, token, test_id, body):
    user = get_user_from_token(conn, token)
    if not user:
        return err(401, 'Не авторизован')

    answers: dict = body.get('answers', {})
    cur = conn.cursor()

    cur.execute(
        f"SELECT q.id, q.type, q.points FROM {SCHEMA}.ege_questions q WHERE q.test_id = %s",
        (test_id,)
    )
    questions = cur.fetchall()

    score = 0
    max_score = 0
    results = []

    for q_id, q_type, points in questions:
        max_score += points
        user_ans = answers.get(str(q_id), '')

        cur.execute(
            f"SELECT text, is_correct FROM {SCHEMA}.ege_choices WHERE question_id = %s",
            (q_id,)
        )
        choices = cur.fetchall()
        correct = [c[0] for c in choices if c[1]]

        is_correct = False
        if q_type in ('single', 'text', 'number'):
            correct_val = correct[0] if correct else ''
            is_correct = str(user_ans).strip().lower() == str(correct_val).strip().lower()
        elif q_type == 'multiple':
            user_set = set(user_ans) if isinstance(user_ans, list) else set()
            correct_ids = set(str(c[0]) for c in choices if c[1])
            is_correct = user_set == correct_ids

        if is_correct:
            score += points

        cur.execute(
            f"SELECT explanation FROM {SCHEMA}.ege_questions WHERE id = %s",
            (q_id,)
        )
        expl_row = cur.fetchone()

        results.append({
            'question_id': q_id,
            'is_correct': is_correct,
            'correct_answer': correct[0] if len(correct) == 1 else correct,
            'explanation': expl_row[0] if expl_row else ''
        })

    percent = round(score / max_score * 100) if max_score > 0 else 0

    cur.execute(
        f"INSERT INTO {SCHEMA}.ege_attempts (user_id, test_id, score, max_score, percent, answers, finished_at) "
        f"VALUES (%s, %s, %s, %s, %s, %s, NOW()) RETURNING id",
        (user['id'], test_id, score, max_score, percent, json.dumps(answers))
    )

    cur.execute(
        f"UPDATE {SCHEMA}.ege_users SET total_score = total_score + %s WHERE id = %s",
        (score, user['id'])
    )
    conn.commit()
    cur.close()

    return resp(200, {'score': score, 'max_score': max_score, 'percent': percent, 'results': results})


# ── CABINET ───────────────────────────────────────────────────────────────────

def get_my_attempts(conn, token):
    user = get_user_from_token(conn, token)
    if not user:
        return err(401, 'Не авторизован')

    cur = conn.cursor()
    cur.execute(
        f"SELECT a.id, a.test_id, t.title, tp.title, a.score, a.max_score, a.percent, a.started_at "
        f"FROM {SCHEMA}.ege_attempts a "
        f"JOIN {SCHEMA}.ege_tests t ON t.id = a.test_id "
        f"LEFT JOIN {SCHEMA}.ege_topics tp ON tp.id = t.topic_id "
        f"WHERE a.user_id = %s ORDER BY a.started_at DESC LIMIT 50",
        (user['id'],)
    )
    rows = cur.fetchall()
    cur.close()
    return resp(200, [
        {'id': r[0], 'test_id': r[1], 'test_title': r[2], 'topic_title': r[3] or '', 'score': r[4], 'max_score': r[5], 'percent': r[6], 'created_at': str(r[7])}
        for r in rows
    ])


# ── LEADERBOARD ───────────────────────────────────────────────────────────────

def get_leaderboard(conn):
    cur = conn.cursor()
    cur.execute(
        f"SELECT u.id, u.first_name, u.last_name, u.total_score, "
        f"COUNT(DISTINCT a.id) AS tests_count, "
        f"COALESCE(AVG(a.percent), 0)::int AS avg_score "
        f"FROM {SCHEMA}.ege_users u "
        f"LEFT JOIN {SCHEMA}.ege_attempts a ON a.user_id = u.id "
        f"WHERE u.is_active = true AND u.role = 'student' "
        f"GROUP BY u.id ORDER BY u.total_score DESC LIMIT 20"
    )
    rows = cur.fetchall()
    cur.close()
    return resp(200, [
        {'rank': i+1, 'first_name': r[1], 'last_name': r[2], 'total_score': r[3], 'tests_count': r[4], 'avg_score': r[5]}
        for i, r in enumerate(rows)
    ])


# ── TEACHER ───────────────────────────────────────────────────────────────────

def teacher_get_tests(conn, token):
    user = get_user_from_token(conn, token)
    if not user or user['role'] not in ('teacher', 'admin'):
        return err(403, 'Доступ запрещён')

    cur = conn.cursor()
    cur.execute(
        f"SELECT t.id, t.title, t.topic_id, tp.fipi_number, t.difficulty, t.is_published, "
        f"COUNT(DISTINCT q.id), COUNT(DISTINCT a.id), t.created_at "
        f"FROM {SCHEMA}.ege_tests t "
        f"LEFT JOIN {SCHEMA}.ege_topics tp ON tp.id = t.topic_id "
        f"LEFT JOIN {SCHEMA}.ege_questions q ON q.test_id = t.id "
        f"LEFT JOIN {SCHEMA}.ege_attempts a ON a.test_id = t.id "
        f"WHERE t.author_id = %s "
        f"GROUP BY t.id, tp.fipi_number ORDER BY t.created_at DESC",
        (user['id'],)
    )
    rows = cur.fetchall()
    cur.close()
    return resp(200, [
        {'id': r[0], 'title': r[1], 'topic_id': r[2], 'fipi_number': r[3] or '', 'difficulty': r[4],
         'is_published': r[5], 'questions_count': r[6], 'attempts_count': r[7], 'created_at': str(r[8])}
        for r in rows
    ])


def teacher_create_test(conn, token, body):
    user = get_user_from_token(conn, token)
    if not user or user['role'] not in ('teacher', 'admin'):
        return err(403, 'Доступ запрещён')

    title = (body.get('title') or '').strip()
    topic_id = body.get('topic_id')
    difficulty = body.get('difficulty', 'medium')
    questions = body.get('questions', [])
    is_published = body.get('is_published', False)

    if not title:
        return err(400, 'Укажите название теста')
    if not questions:
        return err(400, 'Добавьте хотя бы один вопрос')

    cur = conn.cursor()
    cur.execute(
        f"INSERT INTO {SCHEMA}.ege_tests (title, topic_id, author_id, difficulty, is_published) "
        f"VALUES (%s, %s, %s, %s, %s) RETURNING id",
        (title, topic_id, user['id'], difficulty, is_published)
    )
    test_id = cur.fetchone()[0]

    for i, q in enumerate(questions):
        cur.execute(
            f"INSERT INTO {SCHEMA}.ege_questions (test_id, sort_order, text, code, type, explanation) "
            f"VALUES (%s, %s, %s, %s, %s, %s) RETURNING id",
            (test_id, i, q.get('text', ''), q.get('code', ''), q.get('type', 'single'), q.get('explanation', ''))
        )
        q_id = cur.fetchone()[0]
        for j, ch in enumerate(q.get('choices', [])):
            cur.execute(
                f"INSERT INTO {SCHEMA}.ege_choices (question_id, text, is_correct, sort_order) VALUES (%s, %s, %s, %s)",
                (q_id, ch.get('text', ''), bool(ch.get('is_correct', False)), j)
            )

    conn.commit()
    cur.close()
    return resp(201, {'id': test_id, 'title': title})


def teacher_update_test(conn, token, test_id, body):
    user = get_user_from_token(conn, token)
    if not user or user['role'] not in ('teacher', 'admin'):
        return err(403, 'Доступ запрещён')

    cur = conn.cursor()
    cur.execute(f"SELECT id FROM {SCHEMA}.ege_tests WHERE id = %s AND author_id = %s", (test_id, user['id']))
    if not cur.fetchone() and user['role'] != 'admin':
        cur.close()
        return err(403, 'Нет доступа к этому тесту')

    updates = []
    params = []
    if 'title' in body:
        updates.append("title = %s"); params.append(body['title'])
    if 'is_published' in body:
        updates.append("is_published = %s"); params.append(body['is_published'])
    if 'difficulty' in body:
        updates.append("difficulty = %s"); params.append(body['difficulty'])

    if updates:
        params.append(test_id)
        cur.execute(f"UPDATE {SCHEMA}.ege_tests SET {', '.join(updates)} WHERE id = %s", params)
        conn.commit()

    cur.close()
    return resp(200, {'id': test_id, 'updated': True})
