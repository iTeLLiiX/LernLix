# LernLix - Enterprise Learning Platform Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                                 │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  React Frontend (TypeScript)                                    │ │
│  │  - Authentication UI (Register/Login)                           │ │
│  │  - Learning Dashboard                                           │ │
│  │  - Module Player (C#, Netzwerk-Technik)                         │ │
│  │  - Progress Tracking                                            │ │
│  │  - Certificate Generation                                       │ │
│  └────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                       HTTPS REST API
                                  │
┌─────────────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                                 │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  Express.js Backend (Node.js)                                   │ │
│  │  ┌──────────────┬──────────────┬──────────────┬────────────┐  │ │
│  │  │ Auth Routes  │Module Routes │ User Routes  │ Tracking   │  │ │
│  │  │ (JWT)        │(CRUD)        │ (Progress)   │ API        │  │ │
│  │  └──────────────┴──────────────┴──────────────┴────────────┘  │ │
│  └────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  │
┌─────────────────────────────────────────────────────────────────────┐
│                      DATA LAYER                                      │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  PostgreSQL Database                                        │  │
│  │  ┌──────────────┬──────────────┬──────────────┐             │  │
│  │  │ Users        │ Modules      │ Progress     │             │  │
│  │  │ - id         │ - id         │ - id         │             │  │
│  │  │ - email      │ - title      │ - user_id    │             │  │
│  │  │ - password   │ - category   │ - module_id  │             │  │
│  │  │ - name       │ - content    │ - completed  │             │  │
│  │  │ - created_at │ - duration   │ - score      │             │  │
│  │  └──────────────┴──────────────┴──────────────┘             │  │
│  └─────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS (Professional design, no emojis)
- **HTTP Client**: Axios
- **State Management**: React Context + Hooks
- **Routing**: React Router v6
- **Build Tool**: Vite

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Database ORM**: Sequelize
- **Validation**: joi
- **Logging**: Winston
- **Error Handling**: Custom middleware

### Database
- **System**: PostgreSQL 14+
- **Connection Pool**: pg (node-postgres)
- **Migrations**: Sequelize CLI

### DevOps
- **Development**: Docker Compose (optional)
- **Deployment**: Self-hosted (VPS/HostUnlimited)
- **Process Manager**: PM2
- **Reverse Proxy**: Nginx
- **SSL**: Let's Encrypt (certbot)

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,  -- bcrypt hashed
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  role VARCHAR(50) DEFAULT 'student'  -- student, instructor, admin
);
```

### Modules Table
```sql
CREATE TABLE modules (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100),  -- 'csharp' or 'networking'
  description TEXT,
  content JSONB,  -- Module content structure
  duration_minutes INT,
  difficulty_level INT,  -- 1-5
  order_in_category INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### User Progress Table
```sql
CREATE TABLE user_progress (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  module_id INT REFERENCES modules(id) ON DELETE CASCADE,
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  score INT,  -- 0-100
  time_spent_minutes INT,
  is_completed BOOLEAN DEFAULT false,
  UNIQUE(user_id, module_id)
);
```

### Certificates Table
```sql
CREATE TABLE certificates (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  category VARCHAR(100),  -- 'csharp' or 'networking'
  issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  certificate_number VARCHAR(255) UNIQUE
);
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login (returns JWT)
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - User logout

### User Management
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/:id/progress` - Get user's learning progress
- `GET /api/users/:id/certificates` - Get user certificates

### Modules
- `GET /api/modules` - List all modules (with filters)
- `GET /api/modules/:id` - Get module details
- `GET /api/modules/:category` - Get modules by category
- `POST /api/modules/:id/start` - Start learning module
- `POST /api/modules/:id/complete` - Mark module as completed

### Progress Tracking
- `POST /api/progress` - Submit progress update
- `GET /api/progress/:userId` - Get user progress
- `GET /api/progress/stats` - Get learning statistics

### Reports (Admin)
- `GET /api/admin/reports/users` - User statistics
- `GET /api/admin/reports/modules` - Module engagement
- `GET /api/admin/reports/certificates` - Certificates issued

## Security Architecture

### Authentication Flow
```
1. User Registers
   ↓
2. Password hashed with bcrypt (10 rounds)
3. User data stored in database
4. JWT token generated
   ↓
5. User logs in with email/password
6. Password verified against hash
7. JWT token generated (expires in 24h)
8. Refresh token stored (expires in 7 days)
   ↓
9. Client sends JWT in Authorization header
10. Backend verifies JWT signature
11. Extract user ID from token
12. Serve protected resources
```

### Security Features
- Password hashing: bcryptjs (10 rounds)
- JWT Tokens with expiration
- Refresh tokens for session management
- HTTPS/TLS for all communications
- CORS middleware (configured for self-hosted domain)
- Rate limiting on auth endpoints
- SQL injection prevention (Sequelize parameterized queries)
- XSS protection (React auto-escaping)
- CSRF tokens for state-changing operations

## Deployment Architecture

### Self-Hosted Setup (HostUnlimited or similar VPS)

```
Internet
    │
    ↓
┌─────────────────┐
│  Nginx (Proxy)  │  ← Reverse proxy, SSL termination
└─────────────────┘
    │
    ├─→ Port 3000: React Frontend (production build)
    │
    └─→ Port 3001: Express API Server
        │
        ├─→ PostgreSQL (Port 5432)
        │
        └─→ File Storage (/var/data/lernlix/)
```

### Folder Structure on Server
```
/var/www/lernlix/
├── frontend/       # React build output
├── backend/        # Express app
├── database/       # PostgreSQL data
├── config/         # Nginx, SSL, env files
└── logs/          # Application logs
```

## Scaling Strategy

### Phase 1: MVP (Single Server)
- Frontend & Backend on same VPS
- PostgreSQL on same VPS
- Nginx for static file serving
- PM2 for process management

### Phase 2: Growth (Separate Services)
- Frontend: CDN + Separate nginx server
- Backend: Separate API server(s)
- Database: Managed PostgreSQL (separate)
- Redis for session management

### Phase 3: Enterprise (Microservices)
- Frontend: Multiple regions
- API Gateway + Load Balancer
- Microservices: Auth, Modules, Progress, Reporting
- Database: Master-slave replication
- Message Queue: RabbitMQ/Redis Pub/Sub

## Development Workflow

1. **Local Development**
   ```bash
   npm install
   npm run dev:backend  # Starts on port 3001
   npm run dev:frontend # Starts on port 3000
   ```

2. **Testing**
   ```bash
   npm run test
   npm run test:e2e
   ```

3. **Build**
   ```bash
   npm run build:backend
   npm run build:frontend
   ```

4. **Deployment**
   ```bash
   npm run deploy:staging
   npm run deploy:production
   ```

## Error Handling

### Client-Side
- Try-catch blocks for async operations
- Loading states during API calls
- Error messages displayed to users
- Automatic retry on network errors

### Server-Side
- Express middleware for error handling
- Validation errors (joi)
- Database errors logged
- 500 errors never expose internal details
- Structured error responses

## Monitoring & Logging

### Backend Logging
- Winston logger with file rotation
- Different log levels (error, warn, info, debug)
- Correlation IDs for request tracking
- Performance metrics logged

### Frontend Error Tracking
- Sentry integration (optional)
- Console error capture
- User session tracking

---

**This architecture ensures:**
- Scalability for 10,000+ concurrent users
- Professional, secure platform
- Self-hosted deployment capability
- Easy maintenance and updates
- Future extensibility

