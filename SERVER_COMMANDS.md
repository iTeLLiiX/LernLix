# 🎯 SERVER DEPLOYMENT - COPY & PASTE BEFEHLE

## SCHRITT 1: SSH Verbindung
```bash
ssh root@45.133.9.167
```
(Passwort eingeben wenn gefragt)

---

## SCHRITT 2: Deployment Script machen
```bash
chmod +x /root/LernLix/COMPLETE_DEPLOYMENT.sh
```

---

## SCHRITT 3: DEPLOYMENT STARTEN ⭐
```bash
/root/LernLix/COMPLETE_DEPLOYMENT.sh
```

**Warte bis du diese Nachricht siehst:**
```
╔════════════════════════════════════════════════════════════╗
║  ✅ DEPLOYMENT COMPLETE!                                  ║
╚════════════════════════════════════════════════════════════╝
```

Das dauert ca. **5-10 Minuten**. Lass es laufen!

---

## SCHRITT 4: Nach Deployment - ÜBERPRÜFUNGEN

### Check 1: Backend Status
```bash
pm2 status
```

**Sollte zeigen:**
```
id │ name            │ namespace   │ version │ mode    │ ↺ │ status    │ cpu │ mem │
──┼─────────────────┼─────────────┼─────────┼─────────┼──┼───────────┼─────┼─────┤
0  │ lernlix-backend │ default     │ 1.0.0   │ fork    │ 0 │ online    │ 0%  │ 0%
```

### Check 2: Backend Logs (nur wenn probleme)
```bash
pm2 logs lernlix-backend
```

### Check 3: API Health
```bash
curl http://localhost:3001/api/health
```

**Sollte antworten:**
```json
{"status":"OK","timestamp":"2025-10-28T..."}
```

---

## SCHRITT 5: Im Browser testen

Gehe zu: **http://telliix.de** oder **http://45.133.9.167**

Du solltest sehen:
- ⚡ CodeSnap Logo
- "Learn Code Smarter with CodeSnap"
- "Start Learning Free" Button
- Feature Cards
- Stats (50K+ Active Learners, etc)

---

## SCHRITT 6: Registration testen

1. Klick **"Sign Up"**
2. Füll aus:
   - Full Name: `Test User`
   - Email: `test@example.com`
   - Password: `Password123`
   - Confirm: `Password123`
3. Klick **"Sign Up Free"**

**Sollte zu Dashboard gehen!**

---

## SCHRITT 7: RPG Dashboard anschauen

1. Nach erfolgreichem Login
2. Klick auf **"🎮 Enter RPG Dashboard →"**

Du solltest sehen:
- ⭐ Total XP: 0
- 🪙 Coins: 0
- 🔥 Streak: 0 days
- 🏆 Quests Done: 0
- **🎯 Daily Quests** (mit 6 Quests)
- **🌳 Skill Tree** (mit 8 Skills)
- **🏆 Achievements** (mit verschiedenen Badges)

---

## ✅ Wenn alles grün ist - FERTIG! 🎉

Gratuliere! 🚀 Dein CodeSnap Platform läuft live!

---

## ❌ Falls Fehler auftreten:

### Fehler 1: "Connection refused"
```bash
# Backend wirklich nicht laufen?
pm2 restart lernlix-backend

# Dann warten 5 Sekunden
sleep 5

# Nochmal testen
curl http://localhost:3001/api/health
```

### Fehler 2: "502 Bad Gateway" im Browser
```bash
# Nginx Neustarten
systemctl restart nginx

# Status checken
systemctl status nginx
```

### Fehler 3: "Database connection error"
```bash
# PostgreSQL Status
systemctl status postgresql

# Falls nicht laufen:
systemctl start postgresql

# Dann backend neustarten
pm2 restart lernlix-backend
```

### Fehler 4: "npm: command not found"
```bash
# Node.js installieren
apt-get update
apt-get install -y nodejs npm

# Dann deployment nochmal starten
/root/LernLix/COMPLETE_DEPLOYMENT.sh
```

---

## 🆘 NOTFALL - Script kaputt?

```bash
# Alles killen
pm2 kill
pkill -9 node

# Warten
sleep 2

# Nochmal starten
pm2 start /root/LernLix/backend/src/server.js --name lernlix-backend
pm2 save
```

---

## 📊 Monitoring Commands (optional)

```bash
# Live logs
pm2 logs lernlix-backend --lines 50 --follow

# PM2 info
pm2 info lernlix-backend

# CPU/Memory
pm2 monit
```

---

**VIEL ERFOLG! 🚀⚡**
