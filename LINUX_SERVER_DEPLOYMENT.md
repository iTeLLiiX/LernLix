# 🖥️ LERNLIX - LINUX SERVER DEPLOYMENT (STRATO & HOST-UNLIMITED)

## 📋 VORAUSSETZUNGEN

Du hast:
- ✅ STRATO oder Host-Unlimited Account
- ✅ Linux Server (Ubuntu 20.04 LTS empfohlen)
- ✅ SSH Zugriff
- ✅ Root oder Sudo Zugriff
- ✅ Domain Name (z.B. lernlix.de)
- ✅ Projekt auf GitHub

---

## 🔧 SCHRITT 1: SERVER GRUNDSETUP

### 1.1 SSH Verbindung aufbauen

```bash
# Von deinem Computer aus:
ssh root@DEINE_SERVER_IP

# Beispiel:
ssh root@192.168.1.100

# Alternative mit Private Key:
ssh -i /pfad/zum/key.pem root@192.168.1.100
```

### 1.2 System aktualisieren

```bash
# Als root oder mit sudo

# Update Package Lists
apt update

# Upgrade System
apt upgrade -y

# Wichtige Tools installieren
apt install -y \
  curl \
  wget \
  git \
  build-essential \
  vim \
  nano \
  unzip \
  htop \
  net-tools \
  ntp
```

### 1.3 Firewall konfigurieren (UFW)

```bash
# UFW installieren
apt install -y ufw

# Firewall aktivieren
ufw --force enable

# Regeln hinzufügen
ufw allow 22/tcp      # SSH
ufw allow 80/tcp      # HTTP
ufw allow 443/tcp     # HTTPS
ufw allow 3000/tcp    # Frontend Dev
ufw allow 3001/tcp    # Backend Dev
ufw allow 5432/tcp    # PostgreSQL (nur lokal!)
ufw default deny incoming
ufw default allow outgoing

# Status prüfen
ufw status
```

---

## 📦 SCHRITT 2: DEPENDENCIES INSTALLIEREN

### 2.1 Node.js 18+ installieren

```bash
# Node.js Repository hinzufügen
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# Node.js installieren
apt install -y nodejs

# Version prüfen
node --version    # sollte v18.x.x sein
npm --version     # sollte 9.x.x sein
```

### 2.2 PostgreSQL 14+ installieren

```bash
# PostgreSQL Repository hinzufügen
sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'

# PostgreSQL Signing Key
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add -

# Update und Installation
apt update
apt install -y postgresql-14 postgresql-contrib-14

# PostgreSQL starten
systemctl start postgresql
systemctl enable postgresql

# PostgreSQL Status prüfen
systemctl status postgresql
```

### 2.3 Nginx installieren

```bash
# Nginx installieren
apt install -y nginx

# Nginx starten
systemctl start nginx
systemctl enable nginx

# Status prüfen
systemctl status nginx
```

### 2.4 PM2 installieren (Process Manager)

```bash
# PM2 global installieren
npm install -g pm2

# PM2 initialisieren
pm2 startup
pm2 save

# Version prüfen
pm2 --version
```

### 2.5 Git konfigurieren

```bash
# Git konfigurieren
git config --global user.email "admin@lernlix.de"
git config --global user.name "LernLix Admin"
git config --global init.defaultBranch main
```

---

## 📂 SCHRITT 3: PROJEKT SETUP

### 3.1 Projektordner erstellen

```bash
# Arbeitsverzeichnis erstellen
mkdir -p /var/www
cd /var/www

# Git Projekt klonen
git clone https://github.com/DEIN_USERNAME/lernlix.git
cd lernlix

# Verzeichnisstruktur anschauen
ls -la
```

### 3.2 Backend Setup

```bash
# In Backend-Verzeichnis
cd backend

# Dependencies installieren
npm install

# .env Datei erstellen
cat > .env << 'EOF'
NODE_ENV=production
PORT=3001
DB_NAME=lernlix_prod
DB_USER=lernlix_user
DB_PASSWORD=sicheres_passwort_hier
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=$(openssl rand -base64 32)
REFRESH_SECRET=$(openssl rand -base64 32)
CORS_ORIGIN=https://lernlix.de
LOG_LEVEL=info
EOF

# .env prüfen und Secrets einfügen
nano .env

# Dependencies installieren (production)
npm ci --only=production

# Wenn npm start funktioniert:
npm start
```

### 3.3 Frontend Setup & Build

```bash
# Aus Hauptverzeichnis
cd frontend

# Dependencies installieren
npm install

# Production Build erstellen
npm run build

# Build-Verzeichnis prüfen
ls -la dist/

# Zurück zu /var/www/lernlix
cd ..
```

### 3.4 Datenbank initialisieren

```bash
# PostgreSQL als postgres user
sudo -u postgres psql

# In der PostgreSQL Shell:

-- Datenbank erstellen
CREATE DATABASE lernlix_prod;

-- User erstellen
CREATE USER lernlix_user WITH PASSWORD 'sicheres_passwort_hier';

-- Permissions geben
GRANT ALL PRIVILEGES ON DATABASE lernlix_prod TO lernlix_user;
ALTER ROLE lernlix_user CREATEDB;

-- Exit
\q

# Zurück im Terminal - Schema importieren
psql -U lernlix_user -d lernlix_prod -f backend/setup.sql

# Seed Data überprüfen
psql -U lernlix_user -d lernlix_prod -c "SELECT COUNT(*) FROM modules;"
```

---

## 🚀 SCHRITT 4: PROZESSE STARTEN (PM2)

### 4.1 Backend mit PM2 starten

```bash
# Backend starten
pm2 start backend/src/server.js --name "lernlix-backend" --env production

# Status anschauen
pm2 status

# Logs anschauen
pm2 logs lernlix-backend

# Auto-Restart bei Reboot
pm2 startup
pm2 save
```

### 4.2 PM2 Monitoring aktivieren

```bash
# PM2 Monitoring installieren
pm2 install pm2-logrotate

# Optional: PM2 Web Dashboard
pm2 web

# Dashboard unter http://SERVER_IP:9615 erreichbar
```

---

## 🌐 SCHRITT 5: NGINX KONFIGURIEREN

### 5.1 Nginx Config erstellen

```bash
# Neue Nginx Config
cat > /etc/nginx/sites-available/lernlix << 'EOF'
# Backend API Server
upstream lernlix_backend {
    server localhost:3001;
    keepalive 64;
}

# HTTP zu HTTPS Redirect
server {
    listen 80;
    listen [::]:80;
    server_name lernlix.de www.lernlix.de;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS Server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name lernlix.de www.lernlix.de;

    # SSL Certificates (werden später mit Certbot erstellt)
    ssl_certificate /etc/letsencrypt/live/lernlix.de/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/lernlix.de/privkey.pem;

    # SSL Security
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1000;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss;

    # Frontend (React)
    location / {
        root /var/www/lernlix/frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;

        # Caching für Static Files
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # HTML nicht cachen
        location ~ \.html$ {
            expires -1;
            add_header Cache-Control "public, must-revalidate, proxy-revalidate";
        }
    }

    # Backend API
    location /api/ {
        proxy_pass http://lernlix_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Health Check
    location /health {
        proxy_pass http://lernlix_backend/api/health;
        access_log off;
    }

    client_max_body_size 100M;
}
EOF

# Config testen
nginx -t

# Aktivieren
ln -s /etc/nginx/sites-available/lernlix /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Nginx neuladen
systemctl reload nginx
```

### 5.2 SSL mit Let's Encrypt

```bash
# Certbot installieren
apt install -y certbot python3-certbot-nginx

# Zertifikat generieren (email@example.com ersetzen!)
certbot certonly --nginx \
  -d lernlix.de \
  -d www.lernlix.de \
  --email admin@lernlix.de \
  --agree-tos \
  --non-interactive

# Auto-Renewal aktivieren
systemctl enable certbot.timer
systemctl start certbot.timer

# Zertifikat Status prüfen
certbot certificates

# Nginx neuladen
systemctl reload nginx
```

---

## ✅ SCHRITT 6: TESTING & VERIFIKATION

### 6.1 Services testen

```bash
# 1. PostgreSQL testen
psql -U lernlix_user -d lernlix_prod -c "SELECT COUNT(*) FROM users;"

# 2. Backend testen
curl http://localhost:3001/api/health

# 3. Nginx testen
curl http://lernlix.de

# 4. HTTPS testen
curl https://lernlix.de

# 5. API durch Nginx testen
curl https://lernlix.de/api/health

# 6. PM2 Status
pm2 status

# 7. Nginx Status
systemctl status nginx

# 8. PostgreSQL Status
systemctl status postgresql
```

### 6.2 Logs prüfen

```bash
# Backend Logs
pm2 logs lernlix-backend

# Nginx Access Log
tail -f /var/log/nginx/access.log

# Nginx Error Log
tail -f /var/log/nginx/error.log

# PostgreSQL Logs
journalctl -u postgresql -n 50
```

---

## 📊 SCHRITT 7: MONITORING & BACKUPS

### 7.1 Monitoring Setup

```bash
# Disk Space prüfen
df -h

# Memory Usage
free -h

# CPU Info
nproc
top -b -n 1 | head -20

# Network Ports prüfen
ss -tlnp | grep LISTEN

# Services Status
systemctl status nginx postgresql

# PM2 Monitoring
pm2 monit
```

### 7.2 Backup Script erstellen

```bash
# Backup-Verzeichnis
mkdir -p /backups/lernlix
cd /backups/lernlix

# Backup Script
cat > backup.sh << 'EOF'
#!/bin/bash

BACKUP_DIR="/backups/lernlix"
DATE=$(date +%Y%m%d_%H%M%S)

# PostgreSQL Backup
pg_dump -U lernlix_user lernlix_prod | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# Projekt Files Backup
tar -czf $BACKUP_DIR/project_$DATE.tar.gz /var/www/lernlix

# Alte Backups löschen (älter als 30 Tage)
find $BACKUP_DIR -mtime +30 -delete

echo "Backup completed: $DATE"
EOF

# Executable machen
chmod +x backup.sh

# Cron Job - täglich 2:00 Uhr
crontab -e

# Folgende Zeile hinzufügen:
# 0 2 * * * /backups/lernlix/backup.sh >> /backups/lernlix/backup.log 2>&1
```

---

## 🔄 SCHRITT 8: UPDATES & WARTUNG

### 8.1 Projekt Updates

```bash
# Neue Version pullen
cd /var/www/lernlix
git pull origin main

# Backend Update
cd backend
npm install
pm2 restart lernlix-backend

# Frontend Update
cd ../frontend
npm install
npm run build

# Nginx reload
systemctl reload nginx
```

### 8.2 System Updates

```bash
# Security Updates installieren
apt update && apt upgrade -y

# Reboot wenn nötig
# reboot
```

---

## 🆘 TROUBLESHOOTING

### Problem 1: "Port 3001 already in use"

```bash
# Port prüfen
lsof -i :3001

# Process beenden
kill -9 PID

# Oder mit PM2
pm2 delete all
pm2 start backend/src/server.js
```

### Problem 2: "Database connection refused"

```bash
# PostgreSQL Status
systemctl status postgresql

# PostgreSQL starten
systemctl start postgresql

# User überprüfen
sudo -u postgres psql -l
```

### Problem 3: "Frontend shows blank page"

```bash
# Build prüfen
ls -la frontend/dist/

# Rebuild
cd frontend
npm run build

# Nginx neuladen
systemctl reload nginx
```

### Problem 4: "HTTPS nicht funktioniert"

```bash
# Zertifikat Status
certbot certificates

# Renewal testen
certbot renew --dry-run

# Nginx testen
nginx -t

# Nginx neuladen
systemctl reload nginx
```

---

## 📱 DOMAIN KONFIGURIEREN

### Bei STRATO oder Host-Unlimited:

1. **Zu Hosting-Konto gehen**
2. **Domain Management öffnen**
3. **DNS Records bearbeiten:**

```
Type    | Name | Value
--------|------|------------------
A       | @    | DEINE_SERVER_IP
A       | www  | DEINE_SERVER_IP
CNAME   | mail | MAIL_SERVER
MX      | @    | DEIN_MAIL_SERVER
```

4. **Speichern & propagieren lassen (bis 24h)**

5. **Testen:**
```bash
nslookup lernlix.de
dig lernlix.de
ping lernlix.de
```

---

## 📊 FINAL CHECKLIST

```bash
# Alles funktioniert? Abhaken:

☐ SSH Zugriff funktioniert
☐ Node.js installiert (v18+)
☐ PostgreSQL läuft
☐ Nginx läuft
☐ PM2 Backend läuft
☐ Frontend Build existiert
☐ Datenbank initialisiert
☐ SSL Zertifikat aktiv
☐ Domain zeigt auf Server
☐ HTTP → HTTPS Redirect funktioniert
☐ API erreichbar unter /api/
☐ Frontend lädt unter https://lernlix.de
☐ Login funktioniert
☐ Module sichtbar
☐ Backups laufen
☐ Monitoring aktiv
```

---

## 📈 PERFORMANCE TUNING

### PostgreSQL Optimierung

```bash
# PostgreSQL Config bearbeiten
nano /etc/postgresql/14/main/postgresql.conf

# Wichtige Settings:
# shared_buffers = 256MB (25% RAM)
# effective_cache_size = 1GB
# maintenance_work_mem = 64MB
# checkpoint_completion_target = 0.9

# Neustarten
systemctl restart postgresql
```

### Nginx Optimization

```bash
# worker_processes anpassen (4 CPUs = 4)
# worker_connections erhöhen (default 768 → 2048)

nano /etc/nginx/nginx.conf

# Dann:
systemctl reload nginx
```

---

## 🎯 QUICK COMMANDS

```bash
# Schnell-Commands merken:

# Status aller Services
systemctl status nginx postgresql
pm2 status

# Logs anschauen
pm2 logs lernlix-backend
tail -f /var/log/nginx/error.log

# Restart Services
pm2 restart all
systemctl restart nginx

# Database backup
pg_dump -U lernlix_user lernlix_prod > backup.sql

# Projekt updaten
cd /var/www/lernlix && git pull

# Monitor
htop
```

---

## 🎉 DU BIST FERTIG!

Deine LernLix Plattform läuft jetzt unter:

```
🌐 https://lernlix.de
📊 Backend:  https://lernlix.de/api/
📱 Frontend: https://lernlix.de
```

**Viel Erfolg mit deiner Plattform! 🚀**

