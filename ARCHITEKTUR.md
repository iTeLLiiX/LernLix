# 🏗️ LernLix Technische Architektur

## System-Übersicht

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Dashboard | Module View | Challenge Arena | Coach    │ │
│  └────────────────────────────────────────────────────────┘ │
│                            ↓                                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │           State Management (Zustand Store)             │ │
│  │  - Gamification Store (Punkte, Badges, Streaks)       │ │
│  │  - Module Store (Fortschritt, Completion)             │ │
│  │  - User Store (Profile, Preferences)                  │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   Backend APIs (REST)                        │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  /api/modules      /api/challenges    /api/gamification │ │
│  │  /api/user         /api/leaderboard   /api/coach       │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Microservices                             │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │ Code Execution   │  │ Gamification     │                │
│  │ Service (Docker) │  │ Engine           │                │
│  └──────────────────┘  └──────────────────┘                │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │ Module Delivery  │  │ Analytics        │                │
│  │ Service          │  │ Service          │                │
│  └──────────────────┘  └──────────────────┘                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Data Layer                                │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │ PostgreSQL       │  │ MongoDB          │                │
│  │ (Structured)     │  │ (User Sessions)  │                │
│  └──────────────────┘  └──────────────────┘                │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │ Redis Cache      │  │ S3 Storage       │                │
│  │ (Sessions)       │  │ (Videos/Assets)  │                │
│  └──────────────────┘  └──────────────────┘                │
└─────────────────────────────────────────────────────────────┘
```

## Frontend-Architektur

### Component Hierarchie

```
<App>
  ├── <Header>
  │   ├── Stats Display
  │   └── Navigation
  ├── <MainContent>
  │   ├── <Dashboard>
  │   │   ├── <WelcomeSection>
  │   │   ├── <StatsGrid>
  │   │   │   ├── <ProgressBar>
  │   │   │   ├── <WeeklyGoalCard>
  │   │   │   └── <StreakCard>
  │   │   ├── <BadgesSection>
  │   │   │   └── <BadgeCard> (×5)
  │   │   ├── <LeaderboardToggle>
  │   │   │   └── <LeaderboardCard>
  │   │   └── <CTAButtons>
  │   │
  │   ├── <ModuleView>
  │   │   ├── <ModuleHeader>
  │   │   ├── <ProgressTracker>
  │   │   ├── <CodeEditor>
  │   │   ├── <OutputPanel>
  │   │   └── <InstructionsPanel>
  │   │
  │   └── <ChallengeArena>
  │       ├── <ChallengeList>
  │       ├── <ChallengePanel>
  │       ├── <Timer>
  │       ├── <CodeEditor>
  │       ├── <TestResults>
  │       └── <LiveLeaderboard>
```

### State Management Flows

#### Gamification Store
```typescript
useGamificationStore() → {
  userStats: {
    totalPoints,
    currentLevel,
    badges: Badge[],
    completedModules: string[],
    learningStreak,
    weeklyProgress
  },
  actions: {
    addPoints(points, reason),
    unlockBadge(badge),
    completeModule(moduleId),
    incrementStreak(),
    resetStreak()
  }
}
```

#### Data Flow beim Module Completion
```
User klickt "Abschließen"
    ↓
completeModule() Action
    ↓
State Updated (Zustand)
    ↓
useGamificationStore Hook notified
    ↓
Components re-render
    ↓
POST /api/modules/complete (Async)
    ↓
Backend speichert Fortschritt
    ↓
Reward-Animation spielen
```

## Backend-Architektur

### Datenbank-Schema (PostgreSQL)

```sql
-- Nutzer
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE,
  username VARCHAR UNIQUE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Lernmodule
CREATE TABLE modules (
  id VARCHAR PRIMARY KEY,
  title VARCHAR,
  type VARCHAR (quick_start, deep_dive, challenge, project),
  duration_minutes INT,
  points INT,
  prerequisites JSON,
  created_at TIMESTAMP
);

-- Nutzer-Fortschritt
CREATE TABLE user_progress (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users,
  module_id VARCHAR REFERENCES modules,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  time_spent_seconds INT,
  score INT,
  UNIQUE(user_id, module_id)
);

-- Badges
CREATE TABLE badges (
  id VARCHAR PRIMARY KEY,
  name VARCHAR,
  description TEXT,
  icon VARCHAR,
  unlock_condition JSON
);

-- Nutzer-Badges
CREATE TABLE user_badges (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users,
  badge_id VARCHAR REFERENCES badges,
  unlocked_at TIMESTAMP,
  UNIQUE(user_id, badge_id)
);

-- Gamification Stats
CREATE TABLE gamification_stats (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users,
  total_points INT DEFAULT 0,
  current_level INT DEFAULT 1,
  weekly_points INT DEFAULT 0,
  learning_streak INT DEFAULT 0,
  last_activity_date DATE,
  week_start DATE,
  updated_at TIMESTAMP
);

-- Challenges
CREATE TABLE challenges (
  id VARCHAR PRIMARY KEY,
  title VARCHAR,
  difficulty INT (1-5),
  time_limit_minutes INT,
  description TEXT,
  test_cases JSON,
  created_at TIMESTAMP
);

-- Challenge Submissions
CREATE TABLE challenge_submissions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users,
  challenge_id VARCHAR REFERENCES challenges,
  code TEXT,
  time_spent_seconds INT,
  passed_tests INT,
  total_tests INT,
  score INT,
  submitted_at TIMESTAMP
);
```

### API Endpoints

#### Module Endpoints
```
GET    /api/modules              # Alle Module abrufen
GET    /api/modules/{id}         # Modul-Details
POST   /api/modules/{id}/start   # Modul starten
POST   /api/modules/{id}/complete # Modul abschließen
```

#### Challenge Endpoints
```
GET    /api/challenges                    # Challenge-Liste
GET    /api/challenges/{id}               # Details
POST   /api/challenges/{id}/start         # Challenge starten
POST   /api/challenges/{id}/test          # Code testen
POST   /api/challenges/{id}/submit        # Einreichen
GET    /api/challenges/{id}/leaderboard   # Leaderboard
```

#### Gamification Endpoints
```
GET    /api/user/stats           # Aktuelle Statistiken
GET    /api/user/badges          # Meine Badges
GET    /api/user/streak          # Streak-Info
POST   /api/gamification/event   # Event aufzeichnen
```

#### Leaderboard Endpoints
```
GET    /api/leaderboard/global?limit=50    # Global Top 50
GET    /api/leaderboard/weekly?limit=50    # Diese Woche
GET    /api/leaderboard/friends?limit=50   # Freunde
```

## Code Execution Service

### Architektur
```
Frontend Request
    ↓
API Gateway
    ↓
Code Execution Service
    ├─ Sandboxing (Docker/VM)
    ├─ Timeout Management (max 5s)
    ├─ Memory Limits (256MB)
    └─ Resource Cleanup
    ↓
Response mit Output/Errors
```

### Unterstützte Sprachen
- C# (.NET 7)
- Optional: Python, JavaScript

### Sicherheits-Features
- **Isolation**: Jede Execution in isoliertem Container
- **Timeouts**: Max 5 Sekunden Ausführungszeit
- **Memory Limits**: Max 256MB RAM
- **Restricted Syscalls**: Nur sichere System-Calls erlaubt
- **No Network**: Keine Netzwerk-Zugriffe

## Deployment-Architektur

### Environments
```
Development
  ├── Local React Dev Server (Vite)
  ├── Local Backend (Node.js/Express)
  └── Docker Compose für Services

Staging
  ├── Vercel (Frontend)
  ├── Railway/Heroku (Backend)
  └── Staging Database

Production
  ├── Vercel (Frontend)
  ├── AWS ECS (Backend)
  └── RDS PostgreSQL (Database)
  └── ElastiCache Redis (Cache)
  └── S3 (Static Assets)
```

### CI/CD Pipeline

```yaml
Git Push
  ↓
GitHub Actions
  ├─ Lint & Format Check
  ├─ TypeScript Compilation
  ├─ Unit Tests
  ├─ Integration Tests
  └─ Build Docker Image
    ↓
  ├─ Staging Deployment
  ├─ E2E Tests
  └─ Manual Approval
    ↓
  Production Deployment
    ↓
  Smoke Tests
    ↓
  Alert Setup
```

## Performance Optimierungen

### Frontend
- **Code Splitting**: Module lazy-loaded mit React.lazy
- **Memoization**: useMemo/useCallback für teure Operationen
- **Image Optimization**: Responsive Images mit WEBP
- **Caching**: Service Worker für offline-Support

### Backend
- **Query Optimization**: Indexed Queries auf user_progress
- **Caching**: Redis für häufig abgerufene Daten
- **Rate Limiting**: 100 Req/Minute pro User
- **Database Connection Pooling**: Max 20 Connections

## Monitoring & Logging

### Frontend Metrics
```
- Page Load Time
- Time to Interactive
- Core Web Vitals
- Error Tracking (Sentry)
```

### Backend Metrics
```
- API Response Times
- Database Query Performance
- Error Rates
- Active Sessions
- Gamification Events
```

### Logging
```
Frontend: Browser Console Logs → Sentry
Backend: Structured Logs → CloudWatch/ELK Stack
Database: Query Logs → CloudWatch
```

## Skalierungsstrategie

### Phase 1: MVP (100-1k Nutzer)
- Single-server Backend
- PostgreSQL + Redis
- CDN für Static Files

### Phase 2: Growth (1k-10k Nutzer)
- Load Balancer
- Database Replication
- Separate Code Execution Service

### Phase 3: Scale (10k+ Nutzer)
- Microservices Architecture
- Database Sharding
- Multiple Code Execution Instances
- Kubernetes Orchestration

## Sicherheit

### Authentication
- JWT Tokens (HttpOnly Cookies)
- Refresh Token Rotation
- CSRF Protection

### Authorization
- Role-Based Access Control (RBAC)
- Module Lock System
- Challenge Access Control

### Data Protection
- TLS 1.3 für Transit
- AES-256 für sensitive Daten
- Regular Security Audits
- GDPR Compliance

---

**Letzte Aktualisierung**: Oktober 2025
**Architekt**: Senior Lernplattform-Architekt

