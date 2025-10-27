# 🚀 CODESNAP DEPLOYMENT - SCHRITT FÜR SCHRITT

## 📋 Was kommt jetzt?

Ich habe ALLES für dich vorbereitet:
- ✅ Backend mit Quests, Skills, Achievements
- ✅ Datenbank Models und Controller  
- ✅ Ein automatisches Deployment-Script
- ✅ Alles ist bereits zu GitHub gepusht

## 🎯 DU MUSST NUR NOCH:

### Schritt 1: SSH zum Server verbinden
```bash
ssh root@45.133.9.167
```
**Passwort:** (dein root Passwort)

### Schritt 2: Deployment Script ausführen
```bash
chmod +x /root/LernLix/COMPLETE_DEPLOYMENT.sh
/root/LernLix/COMPLETE_DEPLOYMENT.sh
```

Das ist alles! Das Script macht AUTOMATISCH:
1. Git pull (neuester Code)
2. npm install Backend
3. npm install Frontend
4. Frontend build
5. Datenbank seeding (Quests, Skills, Achievements)
6. PM2 Backend Start
7. Permissions setzen

### Schritt 3: Überprüfen ob alles funktioniert

```bash
# Logs anschauen
pm2 logs lernlix-backend

# Status checken
pm2 status

# API testen
curl http://localhost:3001/api/health
```

Sollte antworten:
```json
{"status":"OK","timestamp":"2025-10-28T..."}
```

### Schritt 4: In deinem Browser testen

Gehe zu: **http://telliix.de**

Du solltest die Landing Page sehen mit:
- ⚡ CodeSnap Logo
- Anmeldung / Registration Buttons
- Features
- Dashboard (nach Login)

## ✅ Was wurde gemacht?

### Backend wurde erweitert um:
- **Quests**: Daily/Weekly Aufgaben mit XP und Coin Rewards
- **Skills**: Skill Tree zum Freischalten mit XP
- **Achievements**: Abzeichen und Meilensteine
- **Stats**: User Statistiken, Level, XP, Coins, Streak
- **All Controllers**: Quest, Skill, Stats Controller
- **Seed Script**: Automatisches Seeding mit Sample Daten

### RPG System Features:
- Daily Quests (100 XP, 50 Coins pro Quest)
- Weekly Challenges (bis 1000 XP)
- Skill Tree mit 8 verschiedenen Skills
- Achievements System (6 verschiedene)
- Leaderboard nach XP
- Streak Tracking
- User Stats Dashboard

## 🛠️ Nächste Schritte nach Deployment

1. **Test Registration**: 
   - Go to http://telliix.de/register
   - Create account

2. **Test Login**:
   - Go to http://telliix.de/login
   - Login mit deinem Account

3. **Sieh dein RPG Dashboard**:
   - Nach Login: Klick auf "Enter RPG Dashboard"
   - Siehe deine Stats, Quests, Skills

## ❌ Falls etwas nicht funktioniert

**Fehler: "Connection refused"**
```bash
# Backend Status anschauen
pm2 status

# Wenn nicht running:
pm2 start /root/LernLix/backend/src/server.js --name lernlix-backend
```

**Fehler: "502 Bad Gateway"**
```bash
# Nginx Status
systemctl status nginx

# Restart Nginx
systemctl restart nginx
```

**Fehler: "Database connection error"**
```bash
# PostgreSQL starten
systemctl start postgresql

# Database testen
psql -U lernlix_user -d lernlix -c "SELECT 1;"
```

## 📞 Support

Falls Probleme: Zeig mir die PM2 Logs

```bash
pm2 logs lernlix-backend
```

---

**REMEMBER**: Das Script macht ALLES automatisch - du musst nur:
1. SSH verbinden
2. Script ausführen
3. Warten (ca. 5-10 Minuten)
4. Fertig! 🎉
