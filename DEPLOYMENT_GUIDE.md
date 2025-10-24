# 🚀 LernLix Deployment Guide

## 📋 Vollständiger Leitfaden für Production-Deployment

**Ziel:** LernLix vollständig auf einem Ubuntu-VPS zu deployen mit:
- Node.js Backend
- React Frontend
- PostgreSQL Datenbank
- Nginx Reverse Proxy
- SSL/HTTPS mit Let's Encrypt
- PM2 für Process Management
- Automatische Backups

---

## 🌍 Voraussetzungen

### Server-Anforderungen:
- Ubuntu 20.04+ oder 22.04
- Mindestens 2GB RAM
- 20GB Storage
- Root oder sudo Zugriff

### Domain:
- Domain registriert (z.B. tellix.de)
- DNS records korrekt konfiguriert

---

## ⚙️ SCHRITT 1: Server-Vorbereitung

### 1.1 SSH Verbindung
```bash
ssh root@45.133.9.167
```

### 1.2 System Update
```bash
apt-get update && apt-get upgrade -y
```

### 1.3 Notwendige Tools installieren
```bash
apt-get install -y curl wget git build-essential
```

---

## 📦 SCHRITT 2: Node.js Installation

### 2.1 Node.js 18 installieren
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs npm
```

### 2.2 Versionen prüfen
```bash
node --version  # sollte v18+ sein
npm --version   # sollte 8+ sein
```

### 2.3 PM2 installieren (Process Manager)
```bash
npm install -g pm2
pm2 startup
```

---

## 🐘 SCHRITT 3: PostgreSQL Datenbank

### 3.1 PostgreSQL installieren
```bash
apt-get install -y postgresql postgresql-contrib
```

### 3.2 PostgreSQL starten
```bash
systemctl start postgresql
systemctl enable postgresql
```

### 3.3 Datenbank & User erstellen
```bash
sudo -u postgres psql << EOF
CREATE DATABASE lernlix;
CREATE USER lernlix_user WITH PASSWORD 'secure_password_123';
ALTER ROLE lernlix_user SET client_encoding TO 'utf8';
ALTER ROLE lernlix_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE lernlix_user SET default_transaction_deferrable TO on;
ALTER ROLE lernlix_user SET default_time_zone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE lernlix TO lernlix_user;
\c lernlix
GRANT ALL PRIVILEGES ON SCHEMA public TO lernlix_user;
EOF
```

---

## 🔄 SCHRITT 4: Application Deployment

### 4.1 Git Repository klonen
```bash
cd /root
git clone https://github.com/iTeLLiiX/LernLix.git
cd LernLix
```

### 4.2 Backend Setup
```bash
cd backend
npm install
```

### 4.3 Backend .env erstellen
```bash
cat > .env << 'EOF'
NODE_ENV=production
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=lernlix
DB_USER=lernlix_user
DB_PASSWORD=secure_password_123
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_REFRESH_SECRET=your_super_secret_refresh_key_change_this
JWT_EXPIRY=24h
JWT_REFRESH_EXPIRY=7d
CORS_ORIGIN=https://tellix.de
EOF
```

### 4.4 Backend mit PM2 starten
```bash
pm2 start npm --name "lernlix-backend" -- start
pm2 save
```

### 4.5 Frontend Build
```bash
cd ../frontend
npm install
npm run build
```

---

## 🌐 SCHRITT 5: Nginx Installation & Konfiguration

### 5.1 Nginx installieren
```bash
apt-get install -y nginx
systemctl start nginx
systemctl enable nginx
```

### 5.2 Nginx Config erstellen
```bash
cat > /etc/nginx/sites-available/default << 'EOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name tellix.de www.tellix.de 45.133.9.167;

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
```

### 5.3 Nginx testen & starten
```bash
nginx -t
systemctl restart nginx
```

---

## 🔒 SCHRITT 6: SSL/HTTPS mit Let's Encrypt

### 6.1 Certbot installieren
```bash
apt-get install -y certbot python3-certbot-nginx
```

### 6.2 SSL Zertifikat generieren
```bash
certbot certonly --nginx -d tellix.de -d www.tellix.de
```

### 6.3 Nginx für HTTPS konfigurieren
```bash
cat > /etc/nginx/sites-available/default << 'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name tellix.de www.tellix.de 45.133.9.167;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name tellix.de www.tellix.de 45.133.9.167;

    ssl_certificate /etc/letsencrypt/live/tellix.de/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tellix.de/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

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
```

### 6.4 Nginx neustarten
```bash
nginx -t
systemctl restart nginx
```

### 6.5 Automatische SSL-Erneuerung
```bash
certbot renew --dry-run
systemctl enable certbot.timer
```

---

## 🔥 SCHRITT 7: Firewall (UFW)

### 7.1 UFW aktivieren
```bash
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

### 7.2 Status prüfen
```bash
ufw status
```

---

## 💾 SCHRITT 8: Backups

### 8.1 Backup-Skript erstellen
```bash
mkdir -p /root/backups

cat > /root/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/root/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Database Backup
pg_dump -U lernlix_user lernlix > $BACKUP_DIR/lernlix_db_$DATE.sql
gzip $BACKUP_DIR/lernlix_db_$DATE.sql

# Alte Backups löschen (älter als 7 Tage)
find $BACKUP_DIR -type f -name "*.gz" -mtime +7 -delete

echo "Backup erstellt: $DATE"
EOF

chmod +x /root/backup.sh
```

### 8.2 Cron Job für automatische Backups
```bash
crontab -e
```

Hinzufügen:
```
0 2 * * * /root/backup.sh >> /root/backups/backup.log 2>&1
```

---

## ✅ SCHRITT 9: Testing & Monitoring

### 9.1 Gesundheitsstatus prüfen
```bash
# Backend Health
curl https://tellix.de/api/health

# Process Status
pm2 status
pm2 logs lernlix-backend
```

### 9.2 Logs überwachen
```bash
pm2 logs lernlix-backend
tail -f /var/log/nginx/error.log
```

---

## 🔧 Häufige Befehle

### PM2 Management
```bash
pm2 start npm --name "lernlix-backend" -- start  # Starten
pm2 stop lernlix-backend                          # Stoppen
pm2 restart lernlix-backend                       # Neustarten
pm2 delete lernlix-backend                        # Löschen
pm2 logs lernlix-backend                          # Logs anzeigen
```

### Nginx
```bash
systemctl start nginx
systemctl stop nginx
systemctl restart nginx
systemctl reload nginx
nginx -t  # Config testen
```

### PostgreSQL
```bash
sudo -u postgres psql lernlix  # In DB verbinden
\dt                             # Tabellen anzeigen
\q                              # Beenden
```

---

## 🆘 Troubleshooting

### Backend startet nicht
```bash
pm2 logs lernlix-backend
# Prüfe:
# 1. .env Datei vorhanden?
# 2. Node.js Versio >= 18?
# 3. PostgreSQL läuft?
```

### Website nicht erreichbar
```bash
# Firewall prüfen
ufw status
# Nginx Status
systemctl status nginx
# Ports prüfen
netstat -tlnp
```

### SSL Zertifikat Problem
```bash
certbot renew --force-renewal
systemctl restart nginx
```

### Datenbank-Fehler
```bash
sudo -u postgres psql
\c lernlix
\dt  # Tabellen prüfen
```

---

## 📊 Monitoring & Maintenance

### Disk Space prüfen
```bash
df -h
```

### CPU & RAM
```bash
free -h
top
```

### Logs rotieren
```bash
logrotate -f /etc/logrotate.conf
```

---

## 🎉 Fertig!

Die Anwendung sollte jetzt unter **https://tellix.de** erreichbar sein!

### Nächste Schritte:
1. ✅ Datenbank mit Modulen füllen
2. ✅ Admin-Account erstellen
3. ✅ Monitoring einrichten
4. ✅ Regelmäßige Backups sicherstellen
5. ✅ Performance-Optimierung

**Support:** Bei Fragen, Slack/Discord/@iTeLLiiX

