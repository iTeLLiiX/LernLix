# ⚡ Admin Quick Start Guide

## 🚀 5 Min Setup

### 1️⃣ Admin-Account erstellen

```bash
# Lokal - Direkten DB Zugang nutzen
psql -U postgres -d lernlix -c "
UPDATE users 
SET role = 'admin' 
WHERE email = 'deine@email.com'
LIMIT 1;
"
```

**Oder mit API (wenn schon Admin vorhanden):**
```bash
curl -X POST http://localhost:3001/api/admin/create-admin \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newadmin@tellix.de",
    "password": "secure-password"
  }'
```

### 2️⃣ Admin-Dashboard öffnen

```
https://tellix.de/admin/modules
```

### 3️⃣ Erstes Modul erstellen

Klick auf **"➕ Create New Module"** und fülle aus:

```json
{
  "title": "C# Hello World",
  "category": "c#",
  "description": "Dein erstes C# Programm",
  "difficulty": "beginner",
  "duration": 15,
  "order": 1,
  "content": {
    "text": "Willkommen zu C#!",
    "codeExamples": ["Console.WriteLine(\"Hallo\");"]
  }
}
```

Klick **"✨ Create Module"** → FERTIG! 🎉

---

## 📊 Admin Features nutzen

### 🏠 Dashboard
```
GET /api/admin/dashboard/stats
```
→ Alle Statistiken in Echtzeit

### 📚 Module Manager
```
https://tellix.de/admin/modules
```
→ Module erstellen, bearbeiten, löschen

### 👥 Benutzer-Verwaltung
```
GET /api/admin/users
```
→ Alle Benutzer mit Stats

### 📈 Analytics
```
GET /api/admin/analytics/modules
```
→ Module Performance & Statistiken

---

## 🎯 Häufige Tasks

### ✅ Neues Modul hinzufügen

```bash
curl -X POST http://localhost:3001/api/modules \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Networking 101",
    "category": "networking",
    "description": "Netzwerk-Grundlagen",
    "difficulty": "beginner",
    "duration": 120,
    "order": 2
  }'
```

### 🔄 Benutzer-Fortschritt zurücksetzen

```bash
curl -X POST http://localhost:3001/api/admin/users/{USER_ID}/reset-progress \
  -H "Authorization: Bearer $TOKEN"
```

### 🔍 User-Report

```bash
curl http://localhost:3001/api/admin/users/{USER_ID}/report \
  -H "Authorization: Bearer $TOKEN" | jq
```

### 📊 Module-Analytics

```bash
curl http://localhost:3001/api/admin/analytics/modules \
  -H "Authorization: Bearer $TOKEN" | jq '.modules[] | {title, startedBy, completedBy, completionRate}'
```

---

## 🔐 JWT Token bekommen

```bash
# 1. Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@tellix.de",
    "password": "password"
  }' | jq .token

# 2. Token in Variable speichern
TOKEN=$(curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@tellix.de","password":"password"}' \
  | jq -r .token)

# 3. Mit Token arbeiten
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3001/api/admin/dashboard/stats | jq
```

---

## 📱 Frontend Admin Panel

### Komponenten

```tsx
// Module Manager
import AdminModulePage from './pages/AdminModulePage'

// In Routes:
<Route path="/admin/modules" element={<AdminModulePage />} />
```

### Styling
```css
@import './admin.css'
```

---

## 🎓 Beispiel-Daten

### Module erstellen (cURL Script)

```bash
#!/bin/bash

TOKEN="your_jwt_token"
BASE_URL="http://localhost:3001"

# Module Array
modules=(
  '{"title":"C# Basics","category":"c#","difficulty":"beginner","duration":45,"order":1}'
  '{"title":"Variables & Types","category":"c#","difficulty":"beginner","duration":60,"order":2}'
  '{"title":"Functions","category":"c#","difficulty":"intermediate","duration":90,"order":3}'
)

for module in "${modules[@]}"
do
  curl -X POST $BASE_URL/api/modules \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "$module"
  echo "✅ Module created"
  sleep 1
done
```

---

## ✨ Styling & UI

### Admin Color Palette

```css
/* Primary */
--cyan: #00d4ff
--purple: #7c3aed

/* Status */
--success: #00d464 (Grün)
--warning: #ff9600 (Orange)
--danger: #ff006e (Rot)

/* Backgrounds */
--bg-dark: #0f0f1e
--bg-dark-2: #1a1a2e
--bg-dark-3: #16213e
```

### Admin Panel Komponenten

- 📋 Form-Gruppe
- 📊 Statistik-Card
- 📝 Text-Area (Code Editor)
- 🎯 Filter-Button
- 🗂️ Tab-Navigation
- ⚠️ Alert-Box

---

## 🚨 Fehler beheben

### "Unauthorized" beim Admin API

```bash
# 1. Token überprüfen
echo $TOKEN

# 2. User ist Admin?
psql -U postgres -d lernlix -c "SELECT email, role FROM users WHERE email = 'deine@email.com';"

# 3. Neuer Token
TOKEN=$(curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@tellix.de","password":"password"}' \
  | jq -r .token)
```

### Modul wird nicht erstellt

```bash
# JSON validieren
echo '{"title":"Test"}' | jq

# Erforderliche Felder prüfen
# - title ✓
# - category ✓
# - difficulty ✓
# - duration ✓
# - order ✓
```

---

## 📈 Nächste Schritte

1. ✅ Admin-Account erstellen
2. ✅ Login testen
3. ✅ Erstes Modul hinzufügen
4. ✅ Dashboard checken
5. ✅ Module bearbeiten
6. ✅ User-Analytics ansehen

---

## 📚 Weitere Ressourcen

- [ADMIN_GUIDE.md](./ADMIN_GUIDE.md) - Detaillierte Dokumentation
- [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) - Projekt-Übersicht
- [GETTING_STARTED.md](./GETTING_STARTED.md) - Installation & Setup

---

**Ready to manage LernLix? Let's go! 🚀**
