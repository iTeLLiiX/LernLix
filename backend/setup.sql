-- Database Setup für LernLix

CREATE DATABASE IF NOT EXISTS lernlix_dev;

\c lernlix_dev;

-- Users Tabelle
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  role VARCHAR(50) DEFAULT 'student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Modules Tabelle
CREATE TABLE IF NOT EXISTS modules (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  description TEXT,
  content JSONB,
  duration_minutes INTEGER,
  difficulty_level INTEGER CHECK (difficulty_level BETWEEN 1 AND 5),
  order_in_category INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Progress Tabelle
CREATE TABLE IF NOT EXISTS user_progress (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  module_id INTEGER REFERENCES modules(id) ON DELETE CASCADE,
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  score INTEGER,
  time_spent_minutes INTEGER,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, module_id)
);

-- Certificates Tabelle
CREATE TABLE IF NOT EXISTS certificates (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  category VARCHAR(50) NOT NULL,
  issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  certificate_number VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indizes
CREATE INDEX IF NOT EXISTS idx_modules_category ON modules(category);
CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_module ON user_progress(module_id);
CREATE INDEX IF NOT EXISTS idx_certificates_user ON certificates(user_id);

-- Seed Data
INSERT INTO modules (title, category, description, duration_minutes, difficulty_level, order_in_category, content) VALUES
('Das .NET Framework im Überblick', 'csharp', 'Einführung in die Grundlagen des .NET Frameworks', 10, 1, 1, '{"sections": [{"title": "Was ist .NET?", "text": "Das .NET Framework bietet Funktionalität zur Ausführung von Anwendungen."}]}'),
('Hello World unter der Lupe', 'csharp', 'Dein erstes C# Programm', 12, 1, 2, '{"sections": [{"title": "Erste Schritte", "text": "Hier lernst du dein erstes C# Programm zu schreiben", "codeExample": "using System; class Program { static void Main() { Console.WriteLine(\\\"Hello World\\\"); } }"}]}'),
('Variablen, Datentypen und Operatoren', 'csharp', 'Grundlagen der Datenverwaltung', 15, 2, 3, '{"sections": [{"title": "Grundlegende Datentypen", "text": "In C# gibt es verschiedene Datentypen"}]}'),
('Netzwerk-Glossar', 'networking', 'Wichtige Netzwerk-Begriffe und Konzepte', 20, 1, 1, '{"glossary": [{"term": "OSI", "definition": "Open Systems Interconnection"}]}'),
('OSI-Modell', 'networking', 'Verständnis der Netzwerk-Schichten', 25, 2, 2, '{"sections": [{"title": "7 Schichten des OSI-Modells", "text": "Layer 1: Physical, Layer 2: Data Link"}]}');

COMMIT;

