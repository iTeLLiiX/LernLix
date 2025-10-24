# 📖 LERNLIX - KOMPLETTER SETUP GUIDE (SCHRITT FÜR SCHRITT)

## 🎯 OVERVIEW - WAS PASSIERT INSGESAMT

Du wirst deine LernLix Plattform von deinem Computer auf einen Linux-Server hochladen und zum Laufen bringen. Am Ende funktioniert alles unter `https://lernlix.de`.

---

# 🔴 PHASE 1: VORBEREITUNG (Was du JETZT brauchst)

## SCHRITT 1: Git Hub Account & Projekt hochladen

### 1.1 - GitHub Konto erstellen (Falls noch nicht vorhanden)
```
AKTION:
1. Öffne https://github.com/signup
2. Gib deine E-Mail ein
3. Gib Passwort ein (WICHTIG: Merken!)
4. Verifiziere E-Mail
5. GitHub Account ist nun aktiv!

WARUM:
- GitHub speichert deinen Code in der Cloud
- Dein Server kann von dort klonen
- Backup + Version Control
```

### 1.2 - Projekt lokal vorbereiten
```
AKTION (Auf deinem Computer):
1. Öffne PowerShell im LernLix Folder
2. Führe aus:
   git init
   git add .
   git commit -m "Initial commit"

WARUM:
- Macht dein Projekt zu einem Git Repo
- Bereit für GitHub Upload
```

### 1.3 - Repository auf GitHub erstellen
```
AKTION:
1. GitHub.com öffnen
2. "+" Icon → "New repository"
3. Name: "lernlix"
4. Description: "LernLix Learning Platform"
5. Public auswählen
6. "Create repository" klicken

WARUM:
- Gibt dir einen Online Speicherort
- URL wird ungefähr sein: https://github.com/DEIN_USERNAME/lernlix
```

### 1.4 - Projekt auf GitHub pushen
```
AKTION (Auf deinem Computer, PowerShell):
1. cd C:\Users\nicom\Desktop\LernLix
2. Führe aus:
   git branch -M main
   git remote add origin https://github.com/DEIN_USERNAME/lernlix.git
   git push -u origin main

WARUM:
- Lädt deinen Code auf GitHub hoch
- Dein Server wird von dort klonen können
```

---

## SCHRITT 2: Domain kaufen & Server mieten

### 2.1 - Bei STRATO Domain kaufen
```
AKTION:
1. Öffne https://www.strato.de
2. Klicke "Domains"
3. Gib "lernlix.de" ein (oder andere Domain)
4. Gib deine Daten ein
5. Zahle & Domain ist dein!

KOSTEN: ~€10-15/Jahr
DAUER: ~1 Stunde bis aktiv

WAS DU BEKOMMST:
- Deine Domain (z.B. lernlix.de)
- Zugang zum Domain Manager
- DNS Record Bearbeitung
```

### 2.2 - Bei STRATO/Host-Unlimited Server mieten
```
AKTION:
1. Öffne https://www.host-unlimited.de (oder STRATO)
2. Klicke "Hosting" oder "VPS"
3. Wähle Linux Server (Ubuntu 20.04 LTS)
4. Wähle Paket (empfohlen: 2GB RAM, 50GB SSD)
5. Checkout & zahle
6. WICHTIG: Speichere die Login Daten!

KOSTEN: ~€10-30/Monat
DAUER: ~15 Minuten bis aktiv

DU BEKOMMST:
- Server IP Address (z.B. 192.168.1.100)
- Root Passwort
- SSH Zugriff Daten
```

---

# 🟡 PHASE 2: SERVER INITIAL SETUP

## SCHRITT 3: SSH Verbindung aufbauen

### 3.1 - SSH Client installieren (Für Windows)
```
AKTION:
1. Öffne Windows Terminal (Win + R, "wt" eingeben)
2. Folgende Befehle ausführen:

   # SSH ist meist bereits vorhanden, aber prüfen:
   ssh -V

   # Falls nicht vorhanden, installieren:
   choco install openssh
   (Falls choco nicht vorhanden: https://chocolatey.org/install)

WARUM:
- SSH = Secure Shell, deine Verbindung zum Server
- Verschlüselt & sicher
```

### 3.2 - Zum Server verbinden
```
AKTION (Im Terminal):
1. Gib ein:
   ssh root@DEINE_SERVER_IP

   BEISPIEL:
   ssh root@192.168.1.100

2. Bei "Are you sure?" → "yes" eingeben
3. Passwort eingeben (von STRATO erhalten)

ERGEBNIS:
Du siehst: root@server-name:~#
Das bedeutet: Du bist jetzt AUF DEM SERVER!

WARUM:
- Verbindest dich mit deinem Linux Server
- Danach kannst du Befehle ausführen
```

---

## SCHRITT 4: System aktualisieren

### 4.1 - Alle Software updaten
```
AKTION (AUF DEM SERVER, terminal):
1. Kopiere folgenden Befehl:
   apt update && apt upgrade -y

2. Drücke ENTER
3. Warte bis alles durchgelaufen ist (2-5 Minuten)
4. Server aktualisiert sich selbst

WARUM:
- Wichtige Sicherheits-Updates
- Stabilere Version
```

---

# 🟢 PHASE 3: SOFTWARE INSTALLATION

## SCHRITT 5: Node.js installieren

### 5.1 - Node.js hinzufügen
```
AKTION (AUF DEM SERVER):
1. Kopiere:
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

2. Drücke ENTER
3. Warte bis fertig

WARUM:
- Lädt Node.js Repository herunter
- Damit dein Server npm kennt
```

### 5.2 - Node.js und npm installieren
```
AKTION (AUF DEM SERVER):
1. Kopiere:
   apt install -y nodejs

2. Drücke ENTER
3. Installation dauert ~2 Minuten

ÜBERPRÜFUNG (Optional):
node --version    (sollte v18.x.x zeigen)
npm --version     (sollte 9.x.x zeigen)
```

---

## SCHRITT 6: PostgreSQL installieren

### 6.1 - PostgreSQL Repository hinzufügen
```
AKTION (AUF DEM SERVER):
1. Kopiere EXAKT:
   sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'

2. Drücke ENTER

WARUM:
- Sagt Server wo PostgreSQL zu finden ist
```

### 6.2 - PostgreSQL Key hinzufügen
```
AKTION (AUF DEM SERVER):
1. Kopiere:
   wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add -

2. Drücke ENTER

WARUM:
- Validiert dass PostgreSQL echt ist
```

### 6.3 - PostgreSQL installieren
```
AKTION (AUF DEM SERVER):
1. Kopiere:
   apt update && apt install -y postgresql-14

2. Drücke ENTER
3. Installation dauert ~5 Minuten
4. Warte bis fertig

ÜBERPRÜFUNG:
systemctl status postgresql
(Sollte "active (running)" zeigen)
```

---

## SCHRITT 7: Nginx installieren

### 7.1 - Nginx installieren
```
AKTION (AUF DEM SERVER):
1. Kopiere:
   apt install -y nginx

2. Drücke ENTER
3. Installation dauert ~2 Minuten

ÜBERPRÜFUNG:
systemctl status nginx
(Sollte "active (running)" zeigen)
```

---

## SCHRITT 8: PM2 installieren

### 8.1 - PM2 global installieren
```
AKTION (AUF DEM SERVER):
1. Kopiere:
   npm install -g pm2

2. Drücke ENTER
3. Installation dauert ~1 Minute

WARUM:
- PM2 verwaltet deine Node.js App
- Startet automatisch nach Reboot
- Zeigt Logs an
```

---

# 🔵 PHASE 4: PROJEKT SETUP

## SCHRITT 9: Projektordner vorbereiten

### 9.1 - Arbeitsverzeichnis erstellen
```
AKTION (AUF DEM SERVER):
1. Kopiere:
   mkdir -p /var/www

2. Drücke ENTER
3. Wechsle dort hin:
   cd /var/www

WARUM:
- /var/www ist standard Ort für Webserver
- -p erstellt auch übergeordnete Folders
```

---

## SCHRITT 10: Projekt klonen

### 10.1 - Von GitHub klonen
```
AKTION (AUF DEM SERVER, noch im /var/www):
1. Kopiere:
   git clone https://github.com/DEIN_USERNAME/lernlix.git

   BEISPIEL:
   git clone https://github.com/maxmustermann/lernlix.git

2. Drücke ENTER
3. Wartet bis klonen fertig ist (~1 Minute)

WARUM:
- Lädt deinen kompletten Code vom GitHub
- In einen neuen "lernlix" Folder

ÜBERPRÜFUNG:
ls -la
(Sollte "lernlix" Folder zeigen)
```

### 10.2 - In Projektordner gehen
```
AKTION (AUF DEM SERVER):
1. Kopiere:
   cd lernlix

2. Drücke ENTER
3. Du bist jetzt im Projekt

ÜBERPRÜFUNG:
ls -la
(Sollte backend, frontend, etc zeigen)
```

---

## SCHRITT 11: Backend Setup

### 11.1 - In Backend-Ordner gehen
```
AKTION (AUF DEM SERVER):
1. Kopiere:
   cd backend

2. Drücke ENTER
```

### 11.2 - Dependencies installieren
```
AKTION (AUF DEM SERVER, im backend folder):
1. Kopiere:
   npm install

2. Drücke ENTER
3. Installation dauert ~3 Minuten
4. Viele grüne Haken = WICHTIG, kein Error!

WARUM:
- Lädt alle npm Packages herunter
- Notwendig zum Starten
```

### 11.3 - .env Datei erstellen
```
AKTION (AUF DEM SERVER):
1. Kopiere EXAKT (inklusive EOF):
   cat > .env << 'EOF'
   NODE_ENV=production
   PORT=3001
   DB_NAME=lernlix_prod
   DB_USER=lernlix_user
   DB_PASSWORD=sicheres_passwort_2024
   DB_HOST=localhost
   DB_PORT=5432
   JWT_SECRET=$(openssl rand -base64 32)
   REFRESH_SECRET=$(openssl rand -base64 32)
   CORS_ORIGIN=https://lernlix.de
   LOG_LEVEL=info
   EOF

2. Drücke ENTER
3. .env Datei ist erstellt

WICHTIG:
- Ändere "sicheres_passwort_2024" zu DEINEM Passwort
- Merke dir dieses Passwort!
- Wird später für Datenbank genutzt

ÜBERPRÜFUNG:
cat .env
(Sollte deine Einstellungen zeigen)
```

### 11.4 - Production Dependencies
```
AKTION (AUF DEM SERVER):
1. Kopiere:
   npm ci --only=production

2. Drücke ENTER
3. Installation dauert ~2 Minuten

WARUM:
- Production Mode = keine test/dev packages
- Spart Speicher und Speed
```

---

## SCHRITT 12: Frontend Setup

### 12.1 - Zurück ins Projekt
```
AKTION (AUF DEM SERVER):
1. Kopiere:
   cd ..

2. Drücke ENTER
(Du bist jetzt im /var/www/lernlix)
```

### 12.2 - In Frontend-Ordner
```
AKTION (AUF DEM SERVER):
1. Kopiere:
   cd frontend

2. Drücke ENTER
```

### 12.3 - Frontend Dependencies
```
AKTION (AUF DEM SERVER):
1. Kopiere:
   npm install

2. Drücke ENTER
3. Installation dauert ~3 Minuten
```

### 12.4 - Frontend bauen
```
AKTION (AUF DEM SERVER):
1. Kopiere:
   npm run build

2. Drücke ENTER
3. Build dauert ~2 Minuten
4. Warte bis "dist/" Ordner erstellt ist

WARUM:
- Konvertiert React zu optimiertem JavaScript
- Production ready
- Wird später von Nginx served
```

---

# 🟣 PHASE 5: DATENBANK SETUP

## SCHRITT 13: PostgreSQL Datenbank erstellen

### 13.1 - Zurück ins Hauptprojekt
```
AKTION (AUF DEM SERVER):
1. Kopiere:
   cd ..

2. Drücke ENTER
(Du bist jetzt im /var/www/lernlix)
```

### 13.2 - PostgreSQL öffnen
```
AKTION (AUF DEM SERVER):
1. Kopiere:
   sudo -u postgres psql

2. Drücke ENTER
3. Du siehst prompt ändern zu: postgres=#

WICHTIG:
- Du bist jetzt IN der PostgreSQL Datenbank
- Befehle enden mit ;
```

### 13.3 - Datenbank erstellen
```
AKTION (IN PostgreSQL):
1. Kopiere EXAKT (mit Semikolon!):
   CREATE DATABASE lernlix_prod;

2. Drücke ENTER
3. Du siehst: CREATE DATABASE

WARUM:
- Erstellt eine neue leere Datenbank
```

### 13.4 - Nutzer erstellen
```
AKTION (IN PostgreSQL):
1. Kopiere EXAKT:
   CREATE USER lernlix_user WITH PASSWORD 'sicheres_passwort_2024';

   WICHTIG: 'sicheres_passwort_2024' = DEIN Passwort von Schritt 11.3!

2. Drücke ENTER
3. Du siehst: CREATE ROLE

WARUM:
- Erstellt einen Nutzer für die Datenbank
- Mit diesem Passwort authenticiert sich Backend
```

### 13.5 - Permissions geben
```
AKTION (IN PostgreSQL):
1. Kopiere EXAKT:
   GRANT ALL PRIVILEGES ON DATABASE lernlix_prod TO lernlix_user;

2. Drücke ENTER
3. Du siehst: GRANT

WARUM:
- Gibt dem Nutzer volle Rechte auf die Datenbank
```

### 13.6 - PostgreSQL verlassen
```
AKTION (IN PostgreSQL):
1. Kopiere:
   \q

2. Drücke ENTER
3. Du siehst wieder: root@server-name:~#

WICHTIG: Du bist wieder im Terminal, nicht mehr in PostgreSQL!
```

### 13.7 - Tabellen erstellen
```
AKTION (AUF DEM SERVER):
1. Du bist noch im /var/www/lernlix
2. Kopiere:
   psql -U lernlix_user -d lernlix_prod -f backend/setup.sql

3. Drücke ENTER
4. Es wird gefragt: "Password for user lernlix_user:"
5. Gib dein Passwort ein (von Schritt 11.3)
6. Drücke ENTER
7. Warte bis fertig (sollte CREATE TABLE messages zeigen)

WARUM:
- Lädt alle Tabellen Struktur in die Datenbank
- Befüllt mit Beispiel-Modulen
```

---

# 🟠 PHASE 6: BACKEND STARTEN

## SCHRITT 14: Backend mit PM2 starten

### 14.1 - Im Hauptprojekt sein
```
AKTION (AUF DEM SERVER):
WICHTIG: Du musst in /var/www/lernlix sein!

Falls nicht:
cd /var/www/lernlix

Überprüfung:
pwd
(Sollte /var/www/lernlix zeigen)
```

### 14.2 - Backend mit PM2 starten
```
AKTION (AUF DEM SERVER):
1. Kopiere:
   pm2 start backend/src/server.js --name "lernlix-backend"

2. Drücke ENTER
3. Du siehst grünen Status mit PID Nummer

WARUM:
- Startet deinen Backend Node.js Server
- Läuft im Hintergrund
- Auto-restart bei Crash
```

### 14.3 - PM2 persistieren
```
AKTION (AUF DEM SERVER):
1. Kopiere:
   pm2 startup

2. Drücke ENTER
3. Folge den Anweisungen (copy-paste den gezeigten Befehl)

4. Dann:
   pm2 save

5. Drücke ENTER

WARUM:
- Backend startet automatisch nach Server Reboot
- Nicht mehr nötig manuell zu starten
```

### 14.4 - Backend Status prüfen
```
AKTION (AUF DEM SERVER):
1. Kopiere:
   pm2 status

2. Drücke ENTER
3. Du solltest sehen:
   Name                  | Status | PID
   lernlix-backend       | online | XXXX

WICHTIG: "online" = Es läuft! ✅
Falls "errored" = Fehler vorhanden
```

---

# 🟡 PHASE 7: NGINX KONFIGURIEREN

## SCHRITT 15: Nginx Config erstellen

### 15.1 - Nginx Config Datei erstellen
```
AKTION (AUF DEM SERVER):
1. Kopiere EXAKT (inklusive EOF):
   cat > /etc/nginx/sites-available/lernlix << 'EOF'
upstream lernlix_backend {
    server localhost:3001;
}

server {
    listen 80;
    server_name lernlix.de www.lernlix.de;
    location / {
        return 301 https://$server_name$request_uri;
    }
}

server {
    listen 443 ssl http2;
    server_name lernlix.de www.lernlix.de;
    
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

2. Drücke ENTER
3. Config Datei ist erstellt

WARUM:
- Sagt Nginx wo Frontend ist
- Leitet /api/ zum Backend
- HTTP zu HTTPS Redirect
```

### 15.2 - Aktiviere Config
```
AKTION (AUF DEM SERVER):
1. Kopiere:
   ln -s /etc/nginx/sites-available/lernlix /etc/nginx/sites-enabled/

2. Drücke ENTER
3. Default Config entfernen:
   rm -f /etc/nginx/sites-enabled/default

4. Drücke ENTER

WARUM:
- Macht deine Config aktiv
- Entfernt default (würde konfliktieren)
```

### 15.3 - Nginx testen
```
AKTION (AUF DEM SERVER):
1. Kopiere:
   nginx -t

2. Drücke ENTER
3. Du solltest sehen:
   nginx: configuration file test is successful

WICHTIG: "successful" = OK!
Falls Error: Irgendwas in Config ist falsch (copy-paste Problem?)
```

### 15.4 - Nginx reloaden
```
AKTION (AUF DEM SERVER):
1. Kopiere:
   systemctl reload nginx

2. Drücke ENTER
3. Keine Ausgabe = Erfolgreich

WARUM:
- Laden neue Config ohne Downtime
```

---

# 🔐 PHASE 8: SSL CERTIFICATE

## SCHRITT 16: Let's Encrypt Zertifikat erstellen

### 16.1 - Certbot installieren
```
AKTION (AUF DEM SERVER):
1. Kopiere:
   apt install -y certbot python3-certbot-nginx

2. Drücke ENTER
3. Installation dauert ~2 Minuten

WARUM:
- Certbot automatisiert Let's Encrypt
- Kostenlos SSL Zertifikat
```

### 16.2 - Zertifikat generieren
```
AKTION (AUF DEM SERVER):
1. Kopiere (ERSETZE admin@lernlix.de mit DEINER E-Mail!):
   certbot certonly --nginx \
     -d lernlix.de \
     -d www.lernlix.de \
     --email admin@lernlix.de \
     --agree-tos \
     --non-interactive

2. Drücke ENTER
3. Warte bis "Successfully received certificate" erscheint

WICHTIG:
- Zertifikat ist 3 Monate gültig
- Auto-Renewal läuft später
- HTTPS funktioniert jetzt!

WARUM:
- Verschlüsselt all deine Daten
- Seriös & wichtig für Suchmaschinen
```

### 16.3 - Auto-Renewal aktivieren
```
AKTION (AUF DEM SERVER):
1. Kopiere:
   systemctl enable certbot.timer

2. Drücke ENTER
3. Zertifikat wird automatisch verlängert!

WARUM:
- Nicht vergessen = Downtime!
- Jetzt kümmert sich System automatisch
```

---

# 🌍 PHASE 9: DOMAIN POINTING

## SCHRITT 17: DNS Records konfigurieren

### 17.1 - Bei STRATO/Host-Unlimited Domain Manager öffnen
```
AKTION (Am Computer):
1. Öffne https://www.strato.de (oder Host-Unlimited)
2. Login mit deinen Daten
3. Gehe zu "Meine Domains"
4. Wähle "lernlix.de"
5. Klicke "DNS Einstellungen" oder "Nameserver"

DU SUCHST:
- DNS Records
- A Record
- NS Records
```

### 17.2 - A Records konfigurieren
```
AKTION (Im Domain Manager):
1. Neue DNS Records erstellen:

   Record 1:
   - Type: A
   - Name: @ (oder leer lassen)
   - Value: DEINE_SERVER_IP (z.B. 192.168.1.100)

   Record 2:
   - Type: A
   - Name: www
   - Value: DEINE_SERVER_IP

2. Speichern!
3. Warte 5-30 Minuten (DNS Propagation)

WARUM:
- Sagt Internet: "lernlix.de zeigt auf SERVER_IP"
- @ = Hauptdomain
- www = www.lernlix.de
```

### 17.3 - DNS prüfen
```
AKTION (Am Computer Terminal):
1. Öffne Terminal/PowerShell
2. Kopiere:
   nslookup lernlix.de

3. Drücke ENTER
4. Du solltest sehen:
   Address: 192.168.1.100

WICHTIG: Zeigt deine Server IP = ✅ Funktioniert!
```

---

# ✅ PHASE 10: TESTING & VERIFICATION

## SCHRITT 18: Alles testen

### 18.1 - Backend API testen
```
AKTION (Am Computer):
1. Öffne Browser
2. Gehe zu:
   https://lernlix.de/api/health

3. Du solltest sehen:
   {"status":"OK","timestamp":"2024-10-24T..."}

WICHTIG: Grüne Antwort = Backend läuft! ✅
Falls Error: Backend hat Problem (logs prüfen)
```

### 18.2 - Frontend testen
```
AKTION (Am Computer):
1. Öffne Browser
2. Gehe zu:
   https://lernlix.de

3. Du solltest sehen:
   Login Seite!

WICHTIG: Lädt ohne Fehler = Frontend läuft! ✅
Falls blank: Build Problem (logs prüfen)
```

### 18.3 - Login testen
```
AKTION (Am Computer):
1. Auf der Login Seite:
2. Email: test@example.com
3. Passwort: test123
4. Klicke "Login"

WICHTIG: Zeigt Dashboard oder Error?
- Dashboard = Alles funktioniert! ✅
- Error = Datenbank Problem (prüfen)
```

### 18.4 - Module testen
```
AKTION (Am Computer):
1. Auf Dashboard (nach Login):
2. Du solltest sehen:
   - C# Module (blau)
   - Networking Module (lila)
   - "Starten" Button

WICHTIG: Zeigt Module = Datenbank lädt Daten! ✅
Falls leer: Datenbank Problem
```

---

# 💾 PHASE 11: BACKUPS & WARTUNG

## SCHRITT 19: Backups einrichten

### 19.1 - Backup Ordner erstellen
```
AKTION (AUF DEM SERVER):
1. Kopiere:
   mkdir -p /backups/lernlix

2. Drücke ENTER

WARUM:
- Sichert Ordner für Backups
```

### 19.2 - Backup Script erstellen
```
AKTION (AUF DEM SERVER):
1. Kopiere EXAKT (inklusive EOF):
   cat > /backups/lernlix/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/backups/lernlix"
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -U lernlix_user lernlix_prod | gzip > $BACKUP_DIR/db_$DATE.sql.gz
tar -czf $BACKUP_DIR/project_$DATE.tar.gz /var/www/lernlix
find $BACKUP_DIR -mtime +30 -delete
echo "Backup completed: $DATE"
EOF

2. Drücke ENTER
3. Executable machen:
   chmod +x /backups/lernlix/backup.sh

4. Drücke ENTER

WARUM:
- Sichert deine Datenbank DAILY
- Sichert auch deinen Code
- Alte Backups (>30 Tage) werden gelöscht
```

### 19.3 - Auto-Backup einrichten
```
AKTION (AUF DEM SERVER):
1. Kopiere:
   (crontab -l 2>/dev/null; echo "0 2 * * * /backups/lernlix/backup.sh") | crontab -

2. Drücke ENTER

WARUM:
- Läuft JEDEN TAG um 2:00 Uhr nachts
- Automatisch, du musst nichts machen
```

---

## SCHRITT 20: Monitoring einrichten

### 20.1 - PM2 Logs anschauen
```
AKTION (AUF DEM SERVER):
1. Jederzeit kannst du prüfen:
   pm2 logs

2. Drücke ENTER
3. Siehst du alle Backend Logs
4. Mit CTRL+C kannst du beenden

WARUM:
- Sieht Fehler wenn etwas schief geht
- Wichtig zum Debugging
```

### 20.2 - Service Status prüfen
```
AKTION (AUF DEM SERVER):
1. Jederzeit prüfen:
   pm2 status
   systemctl status nginx
   systemctl status postgresql

2. Drücke ENTER
3. Alle sollten "active/online" sein

WARUM:
- Schnelle Übersicht ob alles läuft
- Erste Troubleshooting Schritt
```

---

# 🎉 GLÜCKWUNSCH!

Du hast es geschafft! Deine LernLix Plattform läuft jetzt!

## ✅ WAS LÄUFT JETZT?

```
🌐 https://lernlix.de           → Frontend (React)
📊 https://lernlix.de/api/      → Backend (Node.js)
💾 PostgreSQL Datenbank         → Speichert Daten
🔒 SSL/HTTPS                    → Verschlüsselt
🔄 Backups                      → Täglich automatisch
```

## 📋 HÄUFIG BENÖTIGTE COMMANDS

```bash
# Tägliche Checks
pm2 status
systemctl status nginx postgresql

# Logs anschauen
pm2 logs

# Projekt updaten
cd /var/www/lernlix
git pull origin main
pm2 restart all

# Backup manuell
/backups/lernlix/backup.sh

# Alles neu starten
pm2 restart all
systemctl restart nginx
```

---

**🚀 Du bist jetzt ein Server Admin!**

Viel Erfolg mit LernLix! 🎓✨

