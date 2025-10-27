# 🚀 LernLix Deployment Guide

## Server: 45.133.9.167
## Domain: telliix.de

---

## ✅ PHASE 1: System Setup (Run ONCE)

```bash
# 1. Update system
apt-get update && apt-get upgrade -y

# 2. Install required tools
apt-get install -y curl wget git build-essential nodejs npm postgresql postgresql-contrib nginx

# 3. Enable firewall
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable

# 4. Install PM2 globally
npm install -g pm2
```

---

## ✅ PHASE 2: Database Setup (Run ONCE)

```bash
# Start PostgreSQL
systemctl start postgresql
systemctl enable postgresql

# Create database and user
sudo -u postgres psql << 'EOF'
CREATE DATABASE lernlix;
CREATE USER lernlix_user WITH PASSWORD 'postgres123';
ALTER ROLE lernlix_user SET client_encoding TO 'utf8';
ALTER ROLE lernlix_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE lernlix_user SET default_transaction_deferrable TO on;
GRANT ALL PRIVILEGES ON DATABASE lernlix TO lernlix_user;
\c lernlix
GRANT ALL PRIVILEGES ON SCHEMA public TO lernlix_user;
EOF
```

---

## ✅ PHASE 3: Clone & Setup Project

```bash
# Clone repository
cd /root
git clone https://github.com/iTeLLiiX/LernLix.git
cd /root/LernLix

# Install dependencies
cd backend && npm install
cd ../frontend && npm install
cd ..
```

---

## ✅ PHASE 4: Configure Backend

```bash
# Create .env file
cat > /root/LernLix/backend/.env << 'EOF'
NODE_ENV=production
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=lernlix
DB_USER=lernlix_user
DB_PASSWORD=postgres123
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
JWT_REFRESH_SECRET=your_super_secret_refresh_key_change_this_in_production
JWT_EXPIRY=24h
JWT_REFRESH_EXPIRY=7d
CORS_ORIGIN=http://telliix.de
LOG_LEVEL=info
EOF
```

---

## ✅ PHASE 5: Configure Frontend

```bash
# Build frontend
cd /root/LernLix/frontend
npm run build
```

---

## ✅ PHASE 6: Configure Nginx

```bash
# Create Nginx config
cat > /etc/nginx/sites-available/default << 'EOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name telliix.de www.telliix.de 45.133.9.167;

    # Backend API
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Frontend
    location / {
        root /root/LernLix/frontend/dist;
        try_files $uri $uri/ /index.html;
    }
}
EOF

# Test and restart
nginx -t
systemctl restart nginx
systemctl enable nginx
```

---

## ✅ PHASE 7: Start Backend with PM2

```bash
# Navigate to backend
cd /root/LernLix/backend

# Start with PM2
pm2 start src/server.js --name "lernlix-backend"

# Make PM2 start on reboot
pm2 startup
pm2 save

# Check status
pm2 status
```

---

## 🔍 Monitoring Commands

```bash
# Check PM2 logs
pm2 logs lernlix-backend

# Check Nginx
systemctl status nginx

# Check database connection
psql -U lernlix_user -d lernlix -h localhost

# Check if backend is running
curl http://localhost:3001/api/health

# Check if frontend is serving
curl http://localhost/api/health
```

---

## 🚨 Troubleshooting

### Backend not starting?
```bash
# Kill any existing node processes
pkill -9 node

# Check for errors
npm start
```

### 502 Bad Gateway?
```bash
# Check if backend is running
ps aux | grep node

# Check Nginx config
nginx -t

# Restart Nginx
systemctl restart nginx
```

### Database connection error?
```bash
# Test connection
psql -U lernlix_user -d lernlix -h localhost -c "SELECT 1;"

# Check PostgreSQL status
systemctl status postgresql
```

---

## 📱 Testing

1. **API Health Check:**
   ```
   http://45.133.9.167/api/health
   ```
   Should return: `{"status":"OK"}`

2. **Frontend:**
   ```
   http://telliix.de
   ```
   Should show landing page

3. **Domain:**
   Check DNS records point to 45.133.9.167
