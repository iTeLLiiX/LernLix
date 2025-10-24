# LernLix - Deployment Guide für Self-Hosting

## 📋 Voraussetzungen

- HostUnlimited Account (oder vergleichbare VPS)
- SSH Zugriff
- Domain (optional aber empfohlen)
- Node.js 18+ auf dem Server

---

## SCHRITT 1: Server-Setup

```bash
# SSH in den Server
ssh root@your_vps_ip

# System aktualisieren
apt update && apt upgrade -y

# Node.js installieren
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# PostgreSQL installieren
apt install -y postgresql postgresql-contrib

# PM2 installieren (Process Manager)
npm install -g pm2

# Nginx installieren (Reverse Proxy)
apt install -y nginx

# Git installieren
apt install -y git
```

---

## SCHRITT 2: Datenbank Setup

```bash
# PostgreSQL starten
systemctl start postgresql
systemctl enable postgresql

# Als postgres User verbinden
sudo -u postgres psql

# In PostgreSQL Shell:
CREATE DATABASE lernlix_prod;
CREATE USER lernlix_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE lernlix_prod TO lernlix_user;
\q
```

---

## SCHRITT 3: Projekt klonen und installieren

```bash
# In /var/www Verzeichnis gehen
cd /var/www

# Projekt klonen (oder hochladen)
git clone https://github.com/your-repo/lernlix.git
cd lernlix

# Backend Setup
cd backend
npm install

# .env für Production erstellen
cat > .env << EOF
NODE_ENV=production
PORT=3001
DB_NAME=lernlix_prod
DB_USER=lernlix_user
DB_PASSWORD=your_secure_password
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=$(openssl rand -base64 32)
JWT_EXPIRE=24h
REFRESH_SECRET=$(openssl rand -base64 32)
REFRESH_EXPIRE=7d
CORS_ORIGIN=https://your-domain.com
LOG_LEVEL=warn
EOF

# DB Setup durchführen
psql -U lernlix_user -d lernlix_prod -f setup.sql

# Backend mit PM2 starten
pm2 start npm --name "lernlix-backend" -- run dev
pm2 save
pm2 startup

# Frontend Build
cd ../frontend
npm install
npm run build

# Build verifi zieren
ls -la dist/
```

---

## SCHRITT 4: Nginx als Reverse Proxy konfigurieren

```bash
# Neue Nginx Config erstellen
cat > /etc/nginx/sites-available/lernlix << 'EOF'
server {
    listen 80;
    server_name your-domain.com;

    # Frontend (React)
    location / {
        root /var/www/lernlix/frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;

        add_header Cache-Control "public, max-age=3600";
        add_header X-Content-Type-Options "nosniff";
    }

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

    # Sicherheits-Header
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
}

EOF

# Config aktivieren
ln -s /etc/nginx/sites-available/lernlix /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default

# Nginx testen und neu starten
nginx -t
systemctl restart nginx
systemctl enable nginx
```

---

## SCHRITT 5: SSL/TLS mit Let's Encrypt

```bash
# Certbot installieren
apt install -y certbot python3-certbot-nginx

# Zertifikat generieren
certbot certonly --nginx -d your-domain.com

# Auto-Renewal prüfen
systemctl enable certbot.timer

# Nginx Config aktualisieren (manuell oder mit certbot)
certbot --nginx -d your-domain.com
```

---

## SCHRITT 6: Monitoring & Health Check

```bash
# PM2 Monitoring installieren
pm2 install pm2-logrotate
pm2 install pm2-auto-pull

# Status prüfen
pm2 status
pm2 logs lernlix-backend

# Health Check
curl https://your-domain.com/api/health
```

---

## SCHRITT 7: Regelmäßige Backups

```bash
# Backup-Script erstellen
cat > /usr/local/bin/backup-lernlix.sh << 'EOF'
#!/bin/bash

BACKUP_DIR="/backups/lernlix"
mkdir -p $BACKUP_DIR

# PostgreSQL Backup
pg_dump -U lernlix_user lernlix_prod | gzip > $BACKUP_DIR/db_$(date +%Y%m%d_%H%M%S).sql.gz

# Projekt-Dateien Backup
tar -czf $BACKUP_DIR/project_$(date +%Y%m%d_%H%M%S).tar.gz /var/www/lernlix

# Alte Backups löschen (älter als 30 Tage)
find $BACKUP_DIR -mtime +30 -delete

EOF

chmod +x /usr/local/bin/backup-lernlix.sh

# Cron Job für täglich 02:00 Uhr
echo "0 2 * * * /usr/local/bin/backup-lernlix.sh" | crontab -
```

---

## SCHRITT 8: Sicherheit

```bash
# Firewall konfigurieren
apt install -y ufw

ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw enable

# Fail2ban installieren (DDoS-Schutz)
apt install -y fail2ban
systemctl enable fail2ban
systemctl start fail2ban
```

---

## SCHRITT 9: Performance Tuning

```bash
# Nginx Worker Prozesse optimieren
# /etc/nginx/nginx.conf:
# worker_processes auto;
# worker_connections 4096;

# PostgreSQL Connection Pool
# backend/.env:
# DB_POOL_MAX=20

# Logging deaktivieren in Production
# backend/.env:
# LOG_LEVEL=error
```

---

## ⚠️ Troubleshooting

### Error: `Cannot find module`
```bash
cd /var/www/lernlix/backend
npm install --production
```

### Error: `Database connection refused`
```bash
systemctl status postgresql
systemctl restart postgresql
```

### Error: `502 Bad Gateway`
```bash
pm2 logs lernlix-backend
pm2 restart lernlix-backend
```

### Nginx zeigt alte Dateien
```bash
# Cache leeren
systemctl restart nginx
# Client-Cache leeren: Ctrl+Shift+Delete im Browser
```

---

## Performance-Metriken

Nach dem Setup überprüfen:

```bash
# CPU/Memory
top

# Festplatte
df -h

# Nginx Status
curl http://localhost/stats

# PM2 Status
pm2 status
```

---

## Aktualisierungen durchführen

```bash
# Code Update
cd /var/www/lernlix
git pull

# Backend updaten
cd backend
npm install
pm2 restart lernlix-backend

# Frontend neu bauen
cd ../frontend
npm install
npm run build

# Nginx neu laden
systemctl reload nginx
```

---

## Monitoring im Production

```bash
# Logs anschauen
pm2 logs lernlix-backend
tail -f /var/log/nginx/access.log

# Health Check API
curl https://your-domain.com/api/health

# DB Backups prüfen
ls -lah /backups/lernlix/
```

---

## Kosten-Übersicht (Beispiel)

| Service | Kosten | Notizen |
|---------|--------|---------|
| VPS (HostUnlimited) | $3-10/Mo | 2-4 GB RAM |
| Domain | $10-15/Jahr | Optional |
| SSL (Let's Encrypt) | Kostenlos | Auto-Renewal |
| **GESAMT** | **$3-10/Mo** | Sehr günstig! |

---

## ✅ Deployment Checklist

- [ ] Server Setup abgeschlossen
- [ ] PostgreSQL läuft
- [ ] Node.js Installation geprüft
- [ ] Projekt geklont & gebaut
- [ ] .env konfiguriert
- [ ] PM2 startet Backend automatisch
- [ ] Nginx lädt Frontend
- [ ] SSL/TLS funktioniert
- [ ] Backup-Script läuft
- [ ] Firewall konfiguriert
- [ ] Health Check erfolgreich
- [ ] Domain zeigt auf VPS

---

## 🎉 Produktionsserver ist bereit!

Ihre LernLix-Plattform läuft jetzt professionell auf Ihrem eigenen Server!

