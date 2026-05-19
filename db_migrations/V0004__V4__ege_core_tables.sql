CREATE TABLE ege_sessions (id SERIAL PRIMARY KEY, user_id INT NOT NULL REFERENCES ege_users(id), token VARCHAR(255) UNIQUE NOT NULL, expires_at TIMESTAMPTZ NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());

CREATE TABLE ege_tests (id SERIAL PRIMARY KEY, title VARCHAR(300) NOT NULL, topic_id INT REFERENCES ege_topics(id), author_id INT REFERENCES ege_users(id), difficulty VARCHAR(10) DEFAULT 'medium', is_published BOOLEAN DEFAULT false, is_official BOOLEAN DEFAULT false, time_limit_min INT, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());

CREATE TABLE ege_questions (id SERIAL PRIMARY KEY, test_id INT NOT NULL REFERENCES ege_tests(id), sort_order INT DEFAULT 0, text TEXT NOT NULL, code TEXT DEFAULT '', type VARCHAR(20) DEFAULT 'single', explanation TEXT DEFAULT '', points INT DEFAULT 1);

CREATE TABLE ege_choices (id SERIAL PRIMARY KEY, question_id INT NOT NULL REFERENCES ege_questions(id), text TEXT NOT NULL, is_correct BOOLEAN DEFAULT false, sort_order INT DEFAULT 0);

CREATE TABLE ege_attempts (id SERIAL PRIMARY KEY, user_id INT NOT NULL REFERENCES ege_users(id), test_id INT NOT NULL REFERENCES ege_tests(id), score INT DEFAULT 0, max_score INT DEFAULT 0, percent INT DEFAULT 0, answers JSONB DEFAULT '{}', started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), finished_at TIMESTAMPTZ);

CREATE INDEX idx_ege_attempts_user ON ege_attempts(user_id);
CREATE INDEX idx_ege_questions_test ON ege_questions(test_id);
CREATE UNIQUE INDEX idx_ege_sessions_token ON ege_sessions(token);