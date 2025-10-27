# ⚡ CodeSnap - Learning RPG Platform

## 🎮 Was ist CodeSnap?

**CodeSnap** ist eine moderne **Learning RPG Platform**, auf der Nutzer programmieren lernen können während sie gleichzeitig:
- 🎯 **Quests** absolvieren und **XP** verdienen
- 🌳 Ein **Skill Tree** freischalten
- 🏆 **Achievements** sammeln
- 📊 Ihre **Statistiken** tracken
- 🔥 Eine tägliche **Streak** aufbauen

**Live Demo**: http://telliix.de
**API**: http://telliix.de/api

---

## 📋 Features

### Authentifizierung
- ✅ User Registration mit Validierung
- ✅ Secure Login mit JWT Tokens
- ✅ Token Refresh System
- ✅ Password Hashing mit bcrypt

### RPG System
- ✅ **Quests**: Daily/Weekly/Challenge Tasks
- ✅ **Skills**: Skill Tree mit 8+ Skills
- ✅ **Achievements**: 6+ Verschiedene Meilensteine
- ✅ **Stats**: Level, XP, Coins, Streak
- ✅ **Leaderboard**: Ranked nach XP

### Learning System (kommend)
- ⏳ Learning Modules
- ⏳ Code Challenges
- ⏳ Progress Tracking
- ⏳ Certificates

---

## 🏗️ Architecture

### Tech Stack

**Backend**:
- Node.js + Express
- PostgreSQL + Sequelize ORM
- JWT Authentication
- Winston Logging

**Frontend**:
- React 18
- Vite
- Tailwind CSS
- React Router
- Zustand State Management

**Deployment**:
- Ubuntu 24.04 VPS
- Nginx (Reverse Proxy)
- PM2 (Process Manager)
- SSL/HTTPS

### Directory Structure

```
LernLix/
├── backend/
│   ├── src/
│   │   ├── config/       (Database, Logger, etc)
│   │   ├── models/       (Sequelize Models)
│   │   ├── controllers/  (Business Logic)
│   │   ├── routes/       (API Routes)
│   │   ├── middleware/   (Auth, Error Handling)
│   │   ├── scripts/      (Database Seeding)
│   │   └── server.js     (Entry Point)
│   ├── .env              (Environment Variables)
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/        (React Pages)
│   │   ├── components/   (React Components)
│   │   └── main.tsx      (Entry Point)
│   ├── index.html
│   └── package.json
│
├── COMPLETE_DEPLOYMENT.sh  (Auto-Deployment Script)
└── README.md
```

---

## 🚀 Deployment

### Automated Deployment

```bash
# 1. SSH zum Server
ssh root@45.133.9.167

# 2. Script ausführen
chmod +x /root/LernLix/COMPLETE_DEPLOYMENT.sh
/root/LernLix/COMPLETE_DEPLOYMENT.sh

# 3. Fertig!
```

Das Script macht automatisch:
- Git pull
- npm install (Backend + Frontend)
- Database Setup
- Database Seeding
- Frontend Build
- PM2 Start

Für detaillierte Anleitung siehe: [DEPLOYMENT_INSTRUCTIONS.md](./DEPLOYMENT_INSTRUCTIONS.md)

---

## 📊 Database Schema

### Users
```sql
CREATE TABLE "Users" (
  id UUID PRIMARY KEY,
  fullName VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  role ENUM('student', 'instructor', 'admin'),
  isActive BOOLEAN,
  lastLogin TIMESTAMP,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

### Quests
```sql
CREATE TABLE "Quests" (
  id UUID PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  category ENUM('daily', 'weekly', 'challenge'),
  difficulty ENUM('easy', 'medium', 'hard'),
  xpReward INTEGER,
  coinReward INTEGER,
  isActive BOOLEAN,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

### Skills
```sql
CREATE TABLE "Skills" (
  id UUID PRIMARY KEY,
  name VARCHAR(255) UNIQUE,
  description TEXT,
  tier INTEGER (1-10),
  category VARCHAR(100),
  requiredXP INTEGER,
  prerequisites JSON,
  isActive BOOLEAN,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

### UserStats
```sql
CREATE TABLE "UserStats" (
  id UUID PRIMARY KEY,
  userId UUID UNIQUE,
  level INTEGER,
  totalXP INTEGER,
  currentXP INTEGER,
  coins INTEGER,
  streak INTEGER,
  maxStreak INTEGER,
  questsCompleted INTEGER,
  modulesCompleted INTEGER,
  skillsUnlocked JSON,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

### UserQuests
```sql
CREATE TABLE "UserQuests" (
  id UUID PRIMARY KEY,
  userId UUID,
  questId UUID,
  status ENUM('pending', 'in_progress', 'completed'),
  progress INTEGER (0-100),
  startedAt TIMESTAMP,
  completedAt TIMESTAMP,
  claimedReward BOOLEAN,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register        - User Registration
POST   /api/auth/login           - User Login
POST   /api/auth/refresh-token   - Refresh Access Token
GET    /api/auth/me              - Get Current User (Protected)
```

### Quests
```
GET    /api/quests               - Get All Active Quests (Protected)
GET    /api/quests/user/progress - Get User's Quests (Protected)
POST   /api/quests/:id/start     - Start Quest (Protected)
POST   /api/quests/:id/complete  - Complete Quest (Protected)
```

### Skills
```
GET    /api/skills/tree          - Get Skill Tree (Protected)
GET    /api/skills/:id           - Get Skill Details (Protected)
POST   /api/skills/:id/unlock    - Unlock Skill (Protected)
```

### Stats
```
GET    /api/stats/me             - Get User Stats (Protected)
GET    /api/stats/me/achievements - Get User Achievements (Protected)
GET    /api/stats/leaderboard    - Get Leaderboard (Protected)
POST   /api/stats/me/streak/update - Update Streak (Protected)
```

---

## 🛠️ Development

### Local Setup

**Backend**:
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run dev
```

**Frontend**:
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables

**Backend (.env)**:
```
NODE_ENV=production
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=lernlix
DB_USER=lernlix_user
DB_PASSWORD=postgres123
JWT_SECRET=your_secret_key
JWT_EXPIRY=24h
CORS_ORIGIN=http://localhost:3000
```

---

## 📈 Roadmap

### Phase 1 ✅ DONE
- Authentication System
- RPG Stats System
- Quests System
- Skills System

### Phase 2 🔄 IN PROGRESS
- Learning Modules
- Code Challenges
- Progress Tracking

### Phase 3 ⏳ UPCOMING
- Premium Features
- Paywall System
- Advanced Dashboard

### Phase 4 ⏳ UPCOMING
- Premium UI/UX Design
- Mobile App
- Community Features

---

## 🔒 Security

- ✅ Password Hashing (bcrypt)
- ✅ JWT Token Authentication
- ✅ CORS Protection
- ✅ Rate Limiting
- ✅ Helmet Security Headers
- ✅ HTTPS/SSL

---

## 📞 Support

Falls Probleme beim Deployment auftreten:

1. **Check Backend Logs**:
   ```bash
   pm2 logs lernlix-backend
   ```

2. **Check Database Connection**:
   ```bash
   psql -U lernlix_user -d lernlix -c "SELECT 1;"
   ```

3. **Check Nginx**:
   ```bash
   systemctl status nginx
   ```

---

## 📄 License

MIT License - Open Source

---

## 👨‍💻 Made with ❤️ for Learning

**CodeSnap** - Die Zukunft des Lernens ist ein Spiel! 🎮⚡

