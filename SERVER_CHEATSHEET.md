# 🚀 LERNLIX - LINUX SERVER CHEAT SHEET

## 📋 TOP 20 BEFEHLE (Copy & Paste Ready)

### 1️⃣ INITIAL SETUP (Einmalig)

```bash
# SSH verbinden
ssh root@DEINE_SERVER_IP

# System updaten
apt update && apt upgrade -y

# Node.js installieren
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs npm

# PostgreSQL installieren
sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add -
apt update && apt install -y postgresql-14

# Nginx installieren
apt install -y nginx

# PM2 installieren
npm install -g pm2
```

---

### 2️⃣ PROJEKT KLONEN & SETUP

```bash
# Verzeichnis erstellen
mkdir -p /var/www && cd /var/www

# Projekt klonen (DEIN_USERNAME ersetzen!)
git clone https://github.com/DEIN_USERNAME/lernlix.git
cd lernlix

# Backend Setup
cd backend
npm install
npm ci --only=production

# Frontend Setup
cd ../frontend
npm install
npm run build

# Zurück
cd /var/www/lernlix
```

---

### 3️⃣ DATENBANK SETUP

```bash
# PostgreSQL als root
sudo -u postgres psql << SQL
CREATE DATABASE lernlix_prod;
CREATE USER lernlix_user WITH PASSWORD 'PASSWORD_HIER';
GRANT ALL PRIVILEGES ON DATABASE lernlix_prod TO lernlix_user;
\q
SQL

# Tabellen erstellen
psql -U lernlix_user -d lernlix_prod -f backend/setup.sql

# Überprüfen
psql -U lernlix_user -d lernlix_prod -c "SELECT COUNT(*) FROM modules;"
```

---

### 4️⃣ BACKEND STARTEN

```bash
# .env Datei erstellen
cat > /var/www/lernlix/backend/.env << 'EOF'
NODE_ENV=production
PORT=3001
DB_NAME=lernlix_prod
DB_USER=lernlix_user
DB_PASSWORD=PASSWORD_HIER
DB_HOST=localhost
JWT_SECRET=$(openssl rand -base64 32)
REFRESH_SECRET=$(openssl rand -base64 32)
CORS_ORIGIN=https://lernlix.de
EOF

# PM2 starten
cd /var/www/lernlix
pm2 start backend/src/server.js --name "lernlix-backend"
pm2 startup
pm2 save

# Logs prüfen
pm2 logs lernlix-backend
```

---

### 5️⃣ NGINX KONFIGURIEREN

```bash
# Nginx Config
cat > /etc/nginx/sites-available/lernlix << 'EOF'
upstream lernlix_backend { server localhost:3001; }

server {
    listen 80;
    server_name lernlix.de;
    location / { return 301 https://$server_name$request_uri; }
}

server {
    listen 443 ssl http2;
    server_name lernlix.de;
    ssl_certificate /etc/letsencrypt/live/lernlix.de/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/lernlix.de/privkey.pem;
    
    location / {
        root /var/www/lernlix/frontend/dist;
        try_files $uri $uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass http://lernlix_backend;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
EOF

# Aktivieren
ln -s /etc/nginx/sites-available/lernlix /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx
```

---

### 6️⃣ SSL CERTIFICATE

```bash
# Certbot installieren
apt install -y certbot python3-certbot-nginx

# Zertifikat erstellen
certbot certonly --nginx -d lernlix.de -d www.lernlix.de --email admin@lernlix.de --agree-tos

# Auto-Renewal
systemctl enable certbot.timer
```

---

### 7️⃣ MONITORING & LOGS

```bash
# Services Status
systemctl status nginx postgresql
pm2 status

# Logs anschauen
pm2 logs
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log

# System Info
df -h       # Disk Space
free -h     # Memory
top         # Live Monitor
htop        # Better Monitor
```

---

### 8️⃣ BACKUPS

```bash
# Database Backup
pg_dump -U lernlix_user lernlix_prod > /backups/backup.sql

# Komprimiert
pg_dump -U lernlix_user lernlix_prod | gzip > /backups/backup_$(date +%Y%m%d).sql.gz

# Auto-Backup täglich
(crontab -l 2>/dev/null; echo "0 2 * * * pg_dump -U lernlix_user lernlix_prod | gzip > /backups/backup_\$(date +\%Y\%m\%d).sql.gz") | crontab -
```

---

### 9️⃣ UPDATES

```bash
# Projekt updaten
cd /var/www/lernlix
git pull origin main

# Backend updaten
cd backend && npm install
pm2 restart lernlix-backend

# Frontend updaten
cd ../frontend && npm install && npm run build
systemctl reload nginx

# System updaten
apt update && apt upgrade -y
```

---

### 🔟 TROUBLESHOOTING

```bash
# Port prüfen
lsof -i :3001
ss -tlnp | grep 3001

# Process beenden
kill -9 PID

# PM2 Reset
pm2 delete all
pm2 start /var/www/lernlix/backend/src/server.js --name "lernlix-backend"

# PostgreSQL prüfen
sudo -u postgres psql -l
psql -U lernlix_user -d lernlix_prod

# Nginx Test
nginx -t
systemctl reload nginx
```

---

## 🎯 DAILY COMMANDS

```bash
# Morgens: Check Status
pm2 status
systemctl status nginx postgresql
df -h

# Problem? Check Logs
pm2 logs
tail -f /var/log/nginx/error.log

# Restart wenn nötig
pm2 restart all
systemctl restart nginx

# Backup vor Update
pg_dump -U lernlix_user lernlix_prod > backup.sql
```

---

## 🔗 DOMAIN SETUP (STRATO/HOST-UNLIMITED)

1. **Konto öffnen** → Hosting Manager
2. **DNS Records** ändern:
   ```
   A       @       DEINE_SERVER_IP
   A       www     DEINE_SERVER_IP
   ```
3. **Speichern & 24h warten**
4. **Testen:**
   ```bash
   nslookup lernlix.de
   ping lernlix.de
   curl https://lernlix.de
   ```

---

## ✅ DEPLOYMENT CHECKLIST

```
☐ SSH verbunden
☐ Node.js v18 installiert
☐ PostgreSQL läuft
☐ Nginx läuft  
☐ Backend läuft (PM2)
☐ Frontend gebaut
☐ Datenbank initialisiert
☐ SSL Cert erstellt
☐ Domain DNS konfiguriert
☐ https://lernlix.de lädt
☐ /api/health funktioniert
☐ Login funktioniert
```

---

## 🚨 NOTFALL COMMANDS

```bash
# Alles zu stoppen
systemctl stop nginx
pm2 stop all
systemctl stop postgresql

# Alles zu starten
systemctl start postgresql
pm2 start /var/www/lernlix/backend/src/server.js
systemctl start nginx

# Kompletter Reset
pm2 delete all
systemctl restart postgresql
systemctl reload nginx
```

---

## 📞 HILFREICHE LINKS

- **SSH Key Generator**: https://www.ssh-keygen.com/
- **SSL Test**: https://www.ssllabs.com/ssltest/
- **Nginx Configs**: https://www.nginx.com/resources/wiki/
- **PostgreSQL Docs**: https://www.postgresql.org/docs/

---

**💡 PRO-TIPP**: Speichern Sie diesen Cheat-Sheet lokal! Nutzen Sie `nano` zum Bearbeiten (`nano /dateiname`), `vim` für Profis oder den Editor deiner Wahl.

**🎉 FERTIG GELADEN?** Dann: `curl https://lernlix.de` 🚀

