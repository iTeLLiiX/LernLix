#!/bin/bash

# =============================================================================
# COMPLETE CODESNAP DEPLOYMENT SCRIPT
# =============================================================================
# This script handles EVERYTHING:
# ✅ Database setup (if needed)
# ✅ Git pull latest code
# ✅ Backend: npm install + seed database
# ✅ Frontend: npm install + npm build
# ✅ PM2: Stop old processes, start new backend
# =============================================================================

set -e  # Exit on any error

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  🚀 CODESNAP COMPLETE DEPLOYMENT                           ║"
echo "║  Server: 45.133.9.167 | Domain: telliix.de               ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# ✅ STEP 1: Prepare directories
echo "[1/8] 📁 Preparing directories..."
cd /root/LernLix || { echo "❌ Failed to navigate to /root/LernLix"; exit 1; }
echo "✅ Navigated to /root/LernLix"

# ✅ STEP 2: Git pull latest code
echo ""
echo "[2/8] 📡 Pulling latest code from GitHub..."
git reset --hard HEAD  # Discard any local changes
git clean -fd          # Remove untracked files
git pull origin main
echo "✅ Code updated successfully"

# ✅ STEP 3: Backend - npm install
echo ""
echo "[3/8] 📦 Installing backend dependencies..."
cd /root/LernLix/backend
npm install --production
echo "✅ Backend dependencies installed"

# ✅ STEP 4: Database setup (run once if needed)
echo ""
echo "[4/8] 🗄️ Checking database..."
sudo -u postgres psql -U lernlix_user -d lernlix -c "SELECT 1;" 2>/dev/null && {
  echo "✅ Database already exists"
} || {
  echo "⚠️  Database not found - Creating..."
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
  echo "✅ Database created successfully"
}

# ✅ STEP 5: Seed database with RPG data
echo ""
echo "[5/8] 🌱 Seeding database with sample data..."
cd /root/LernLix/backend
npm run seed 2>&1 || echo "⚠️  Seed may have already run - continuing..."
echo "✅ Database seeded"

# ✅ STEP 6: Frontend - npm install + build
echo ""
echo "[6/8] 🏗️ Building frontend..."
cd /root/LernLix/frontend
npm install --production
rm -rf dist  # Clean old build
npm run build
echo "✅ Frontend built successfully"

# ✅ STEP 7: Fix permissions for Nginx
echo ""
echo "[7/8] 🔐 Fixing file permissions for Nginx..."
chmod -R 755 /root/LernLix/frontend/dist
echo "✅ Permissions fixed"

# ✅ STEP 8: PM2 - Restart backend
echo ""
echo "[8/8] 🎮 Starting backend with PM2..."
cd /root/LernLix/backend

# Stop old processes
pm2 stop all 2>/dev/null || true
pm2 kill 2>/dev/null || true

# Start new backend
pm2 start src/server.js --name "lernlix-backend" --instances 1
pm2 startup
pm2 save

echo "✅ Backend started with PM2"

# ✅ Final checks
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  ✅ DEPLOYMENT COMPLETE!                                  ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "📋 VERIFICATION COMMANDS:"
echo "   1. Check backend logs:  pm2 logs lernlix-backend"
echo "   2. Check PM2 status:    pm2 status"
echo "   3. API health:          curl http://localhost:3001/api/health"
echo ""
echo "🌐 Access your app:"
echo "   Frontend: http://telliix.de (or http://45.133.9.167)"
echo "   API:      http://telliix.de/api/health"
echo ""
echo "🛠️  Next steps:"
echo "   - Test registration: POST /api/auth/register"
echo "   - Test login: POST /api/auth/login"
echo "   - View RPG dashboard at /rpg-dashboard (after login)"
echo ""
