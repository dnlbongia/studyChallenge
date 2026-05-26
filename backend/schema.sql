CREATE DATABASE IF NOT EXISTS study_challenge
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE study_challenge;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('student', 'admin') NOT NULL DEFAULT 'student',
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS subjects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  image_url VARCHAR(255),
  year VARCHAR(50) NOT NULL,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS topics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content_url VARCHAR(255) NOT NULL,
  `order` INT NOT NULL DEFAULT 0,
  subject_id INT NOT NULL,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  CONSTRAINT fk_topic_subject FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS challenges (
  id INT AUTO_INCREMENT PRIMARY KEY,
  content_url VARCHAR(255) NOT NULL,
  options JSON NOT NULL,
  correct_answer VARCHAR(255) NOT NULL,
  points INT NOT NULL DEFAULT 10,
  type ENUM('multiple_choice', 'true_false') NOT NULL DEFAULT 'multiple_choice',
  topic_id INT NOT NULL,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  CONSTRAINT fk_challenge_topic FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS progress (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  challenge_id INT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  score INT NOT NULL DEFAULT 0,
  completed_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  UNIQUE KEY uq_user_challenge (user_id, challenge_id),
  CONSTRAINT fk_progress_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_progress_challenge FOREIGN KEY (challenge_id) REFERENCES challenges(id) ON DELETE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ============================================================
-- SEED DATA: Matemáticas - 3er Año
-- ============================================================

INSERT INTO subjects (name, description, image_url, year) VALUES
(
  'Matemáticas',
  'Contenido completo de Matemáticas para 3er año de bachillerato. Incluye álgebra, funciones, geometría y estadística.',
  '/images/math.svg',
  '3er Año'
);

SET @math_id = LAST_INSERT_ID();

INSERT INTO topics (title, content_url, `order`, subject_id) VALUES
('Ecuaciones de Primer Grado', '/content/ecuaciones-primer-grado.md', 1, @math_id),
('Sistemas de Ecuaciones Lineales', '/content/sistemas-ecuaciones.md', 2, @math_id),
('Funciones Lineales y Cuadráticas', '/content/funciones-lineales-cuadraticas.md', 3, @math_id),
('Geometría del Plano', '/content/geometria-plano.md', 4, @math_id),
('Estadística Descriptiva', '/content/estadistica-descriptiva.md', 5, @math_id);

-- Challenges para "Ecuaciones de Primer Grado"
SET @topic1 = (SELECT id FROM topics WHERE title = 'Ecuaciones de Primer Grado' LIMIT 1);
INSERT INTO challenges (content_url, options, correct_answer, points, type, topic_id) VALUES
('/content/challenges/challenge-1.md', '["3", "5", "7", "15"]', '5', 10, 'multiple_choice', @topic1),
('/content/challenges/challenge-2.md', '["7", "8", "10", "14"]', '10', 10, 'multiple_choice', @topic1),
('/content/challenges/challenge-3.md', '["Verdadero", "Falso"]', 'Falso', 5, 'true_false', @topic1);

SET @topic2 = (SELECT id FROM topics WHERE title = 'Sistemas de Ecuaciones Lineales' LIMIT 1);
INSERT INTO challenges (content_url, options, correct_answer, points, type, topic_id) VALUES
('/content/challenges/challenge-4.md', '["(3, 4)", "(4, 3)", "(5, 2)", "(2, 5)"]', '(4, 3)', 15, 'multiple_choice', @topic2),
('/content/challenges/challenge-5.md', '["(3, 2)", "(2, 1)", "(4, 3)", "(1, 0)"]', '(3, 2)', 15, 'multiple_choice', @topic2);

SET @topic3 = (SELECT id FROM topics WHERE title = 'Funciones Lineales y Cuadráticas' LIMIT 1);
INSERT INTO challenges (content_url, options, correct_answer, points, type, topic_id) VALUES
('/content/challenges/challenge-6.md', '["5", "-3", "3", "-5"]', '-3', 10, 'multiple_choice', @topic3),
('/content/challenges/challenge-7.md', '["Verdadero", "Falso"]', 'Verdadero', 10, 'true_false', @topic3),
('/content/challenges/challenge-8.md', '["(2, -1)", "(-2, 15)", "(2, 3)", "(-2, -1)"]', '(2, -1)', 15, 'multiple_choice', @topic3);

SET @topic4 = (SELECT id FROM topics WHERE title = 'Geometría del Plano' LIMIT 1);
INSERT INTO challenges (content_url, options, correct_answer, points, type, topic_id) VALUES
('/content/challenges/challenge-9.md', '["5 cm", "6 cm", "7 cm", "12 cm"]', '5 cm', 10, 'multiple_choice', @topic4),
('/content/challenges/challenge-10.md', '["Verdadero", "Falso"]', 'Verdadero', 5, 'true_false', @topic4);

SET @topic5 = (SELECT id FROM topics WHERE title = 'Estadística Descriptiva' LIMIT 1);
INSERT INTO challenges (content_url, options, correct_answer, points, type, topic_id) VALUES
('/content/challenges/challenge-11.md', '["5", "6", "7", "8"]', '6', 10, 'multiple_choice', @topic5),
('/content/challenges/challenge-12.md', '["3", "5", "7", "9"]', '5', 10, 'multiple_choice', @topic5);
