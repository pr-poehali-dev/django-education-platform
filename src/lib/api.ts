import func2url from '../../func2url.json';

const BASE = (func2url as Record<string, string>)['ege-api'] || '';

async function req<T>(method: string, path: string, body?: unknown, token?: string): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(BASE + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Ошибка сервера');
  return data;
}

export const api = {
  register: (d: { email: string; password: string; first_name: string; last_name: string; role: string; pd_consent: boolean }) =>
    req('POST', '/auth/register', d),
  login: (email: string, password: string) =>
    req<{ token: string; user: User }>('POST', '/auth/login', { email, password }),
  me: (token: string) => req<User>('GET', '/auth/me', undefined, token),

  getTopics: () => req<Topic[]>('GET', '/topics'),
  getTests: (topicId?: number) => req<Test[]>('GET', `/tests${topicId ? `?topic_id=${topicId}` : ''}`),
  getTest: (id: number, token?: string) => req<TestDetail>('GET', `/tests/${id}`, undefined, token),
  submitAttempt: (testId: number, answers: Record<number, string | string[]>, token: string) =>
    req<AttemptResult>('POST', `/tests/${testId}/attempt`, { answers }, token),
  getMyAttempts: (token: string) => req<Attempt[]>('GET', '/cabinet/attempts', undefined, token),
  getLeaderboard: () => req<LeaderUser[]>('GET', '/leaderboard'),

  createTest: (data: CreateTestPayload, token: string) => req<Test>('POST', '/teacher/tests', data, token),
  getMyTests: (token: string) => req<Test[]>('GET', '/teacher/tests', undefined, token),
  updateTest: (id: number, data: Partial<CreateTestPayload>, token: string) =>
    req<Test>('PUT', `/teacher/tests/${id}`, data, token),
  deleteTest: (id: number, token: string) => req('DELETE', `/teacher/tests/${id}`, undefined, token),
};

export interface User {
  id: number; email: string; first_name: string; last_name: string;
  role: 'student' | 'teacher' | 'admin'; created_at: string;
}
export interface Topic {
  id: number; title: string; fipi_number: string; description: string;
  icon: string; tests_count: number;
}
export interface Test {
  id: number; title: string; topic_id: number; topic_title: string;
  fipi_number: string; difficulty: 'easy' | 'medium' | 'hard';
  questions_count: number; attempts_count: number; avg_score: number;
  author_name: string; is_author_test: boolean; created_at: string;
}
export interface Question {
  id: number; text: string; code?: string; image_url?: string;
  type: 'single' | 'multiple' | 'text' | 'number';
  choices?: { id: string; text: string }[];
}
export interface TestDetail extends Test { questions: Question[]; }
export interface AttemptResult {
  score: number; max_score: number; percent: number;
  results: { question_id: number; is_correct: boolean; correct_answer: string | string[]; explanation?: string }[];
}
export interface Attempt {
  id: number; test_id: number; test_title: string; topic_title: string;
  score: number; max_score: number; percent: number; created_at: string;
}
export interface LeaderUser {
  rank: number; first_name: string; last_name: string;
  total_score: number; tests_count: number; avg_score: number;
}
export interface CreateTestPayload {
  title: string; topic_id: number; difficulty: string;
  questions: { text: string; code?: string; type: string; choices: { text: string; is_correct: boolean }[]; explanation?: string }[];
}
