# 📊 LernLix Admin Guide

> Vollständige Dokumentation für Admin-Features und Verwaltungsfunktionen

## 📖 Inhaltsverzeichnis
1. [Admin Dashboard](#admin-dashboard)
2. [Module Manager](#module-manager)
3. [User Management](#user-management)
4. [Analytics & Reports](#analytics--reports)
5. [System Information](#system-information)
6. [API Endpoints](#api-endpoints)

---

## 🏠 Admin Dashboard

### Zugriff
```
URL: https://tellix.de/admin/dashboard
```

### Dashboard-Features

Das Admin Dashboard zeigt Echtzeit-Statistiken:

- **Gesamte Benutzer**: Anzahl aller registrierten Benutzer
- **Module**: Gesamtanzahl der verfügbaren Module
- **Kurse gestartet**: Gesamte UserProgress Einträge
- **Kurse abgeschlossen**: Abgeschlossene Kurse
- **Erfolgsquote**: Prozentsatz der abgeschlossenen Kurse
- **Zertifikate**: Insgesamt ausgegebene Zertifikate
- **Top Benutzer**: Die 5 besten Benutzer nach Punkten

### Beispiel-Response

```json
{
  "stats": {
    "totalUsers": 150,
    "totalModules": 25,
    "totalProgress": 450,
    "completedProgress": 340,
    "completionRate": 75,
    "totalCertificates": 82,
    "topUsers": [
      {
        "id": "uuid-1",
        "name": "Max Mustermann",
        "email": "max@example.com",
        "points": 5200,
        "level": 12
      }
    ]
  }
}
```

---

## 📚 Module Manager

### Zugriff
```
URL: https://tellix.de/admin/modules
```

### Features

#### ✨ Module erstellen

Alle erforderlichen Felder:

| Feld | Typ | Beispiel |
|------|-----|---------|
| **Title** | String | "C# Grundlagen" |
| **Category** | Select | "c#", "networking", "security" |
| **Difficulty** | Select | "beginner", "intermediate", "advanced" |
| **Duration** | Number | 45 (Minuten) |
| **Order** | Number | 1 (Sortierung) |
| **Description** | Text | "Lerne die Basics von C#" |
| **Content** | JSON | Custom Inhalte |

#### 📝 Beispiel Module JSON

```json
{
  "title": "C# Grundlagen",
  "category": "c#",
  "description": "Lerne die Basics von C# Programmierung",
  "difficulty": "beginner",
  "duration": 60,
  "order": 1,
  "content": {
    "text": "Willkommen zu C# Grundlagen...",
    "codeExamples": [
      "var x = 5;",
      "Console.WriteLine(x);"
    ],
    "quiz": [
      {
        "question": "Was ist eine Variable?",
        "options": ["A", "B", "C"],
        "correct": 0
      }
    ]
  }
}
```

#### ✏️ Module bearbeiten

1. Klick auf "✏️ Edit" Button
2. Ändere die gewünschten Felder
3. Klick auf "💾 Update Module"

#### 🗑️ Module löschen

1. Klick auf "🗑️ Delete" Button
2. Bestätige die Löschung

---

## 👥 User Management

### Zugriff
```
Endpoint: GET /api/admin/users
```

### Benutzer-Statistiken

Für jeden Benutzer werden folgende Infos angezeigt:

```json
{
  "id": "uuid",
  "name": "Max Mustermann",
  "email": "max@example.com",
  "role": "user",
  "points": 1250,
  "level": 5,
  "isActive": true,
  "createdAt": "2025-01-15T10:30:00Z",
  "coursesStarted": 8,
  "certificatesEarned": 2
}
```

### Benutzer-Verwaltungs-Endpoints

#### 📊 Benutzer-Report
```
GET /api/admin/users/:userId/report
```

Detaillierte Informationen über einen Benutzer:
- Profil-Informationen
- Kursverlauf (Progress)
- Zertifikate
- Gesamte Zeit verbracht
- Abschlussquote

#### ⏸️ Benutzer deaktivieren
```
POST /api/admin/users/:userId/deactivate
```

Deaktiviert einen Benutzer ohne ihn zu löschen.

#### ✅ Benutzer reaktivieren
```
POST /api/admin/users/:userId/reactivate
```

Reaktiviert einen deaktivierten Benutzer.

#### 🔄 Benutzer-Fortschritt zurücksetzen
```
POST /api/admin/users/:userId/reset-progress
```

Setzt alle Kurse, Punkte und Level zurück:
- Löscht alle UserProgress Einträge
- Setzt Punkte auf 0
- Setzt Level auf 1

---

## 📈 Analytics & Reports

### Zugriff
```
Endpoint: GET /api/admin/analytics/modules
```

### Module-Analytics

Detaillierte Analyse für jedes Modul:

```json
{
  "modules": [
    {
      "id": "uuid",
      "title": "C# Grundlagen",
      "category": "c#",
      "difficulty": "beginner",
      "duration": 60,
      "startedBy": 45,
      "completedBy": 32,
      "averageScore": 82,
      "completionRate": 71
    }
  ]
}
```

### Metriken

- **startedBy**: Anzahl Benutzer, die das Modul gestartet haben
- **completedBy**: Anzahl Benutzer, die es abgeschlossen haben
- **averageScore**: Durchschnittliche Bewertung
- **completionRate**: Prozentsatz Abschlussquote

---

## ⚙️ System Information

### Zugriff
```
Endpoint: GET /api/admin/system/info
```

### System-Status

```json
{
  "systemInfo": {
    "environment": "production",
    "uptime": 345600,
    "timestamp": "2025-01-20T15:30:00Z",
    "database": {
      "totalUsers": 150,
      "activeUsers": 140,
      "totalModules": 25,
      "totalProgress": 450,
      "totalCertificates": 82
    }
  }
}
```

---

## 🔌 API Endpoints

### Admin-Authentifizierung

**Alle Admin-Endpoints erfordern:**
- Gültigen JWT Token im `Authorization` Header
- Admin-Rolle (`role: 'admin'`)

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  https://tellix.de/api/admin/dashboard/stats
```

### Endpoint-Übersicht

| Methode | Endpoint | Beschreibung |
|---------|----------|-------------|
| GET | `/api/admin/dashboard/stats` | Dashboard Statistiken |
| GET | `/api/admin/users` | Alle Benutzer mit Stats |
| GET | `/api/admin/users/:userId/report` | Detaillierter Benutzer-Report |
| POST | `/api/admin/users/:userId/deactivate` | Benutzer deaktivieren |
| POST | `/api/admin/users/:userId/reactivate` | Benutzer reaktivieren |
| POST | `/api/admin/users/:userId/reset-progress` | Fortschritt zurücksetzen |
| GET | `/api/admin/analytics/modules` | Module Analytics |
| GET | `/api/admin/system/info` | System Information |

---

## 🔐 Sicherheit

### Best Practices

1. **JWT Token sicher speichern**
   ```javascript
   // ✅ RICHTIG
   localStorage.setItem('token', response.data.token)
   
   // ❌ FALSCH
   window.token = response.data.token // Sichtbar im Code
   ```

2. **Tokens rotieren**
   - Refresh Tokens verwenden
   - Regelmäßig neue Tokens generieren

3. **Admin-Zugang schützen**
   - Nur vertrauenswürdige Benutzer als Admin
   - Zwei-Faktor-Authentifizierung erwägen

4. **Daten validieren**
   - Input-Validierung auf Frontend
   - Backend-Validierung ist PFLICHT

---

## 📱 Frontend Integration

### Module Manager nutzen

```typescript
import AdminModulePage from './pages/AdminModulePage'

// In deinen Routes
<Route path="/admin/modules" element={<AdminModulePage />} />
```

### Beispiel: Module erstellen (API)

```bash
curl -X POST https://tellix.de/api/modules \
  -H "Authorization: Bearer JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "C# Basics",
    "category": "c#",
    "description": "Learn C#",
    "difficulty": "beginner",
    "duration": 45,
    "order": 1,
    "content": {}
  }'
```

---

## 💡 Tipps & Tricks

### ✨ Bulk Module Import

Du kannst Module in Batches importieren:

```javascript
const modules = [
  { title: "Module 1", ... },
  { title: "Module 2", ... },
  // ...
];

for (const module of modules) {
  await axios.post('/api/modules', module, {
    headers: { Authorization: `Bearer ${token}` }
  });
}
```

### 📊 Regelmäßige Reports

```bash
# Täglich um 00:00 einen Report erstellen
0 0 * * * curl -H "Authorization: Bearer TOKEN" \
  https://tellix.de/api/admin/analytics/modules > reports/$(date +\%Y-\%m-\%d).json
```

### 🎯 Performance-Tipps

- Nutze `category` Filter für schnellere Suche
- Begrenzte User pro Seite laden
- Module-Analytics in Batches abrufen

---

## 🐛 Troubleshooting

### Problem: "Unauthorized" Error

**Lösung:**
```javascript
// Überprüfe, ob Token vorhanden ist
const token = localStorage.getItem('token');
console.log('Token:', token); // Sollte nicht null sein

// Token abgelaufen? Refresh!
const refreshed = await axios.post('/api/auth/refresh', {
  refreshToken: localStorage.getItem('refreshToken')
});
```

### Problem: Module wird nicht erstellt

**Überprüfe:**
- Alle erforderlichen Felder sind ausfüllt
- Du bist als Admin angemeldet
- JWT Token ist gültig
- Content ist gültiges JSON

### Problem: Admin-Routes geben 403

**Überprüfe:**
- Benutzer hat `role: 'admin'`
- Token ist aktuell
- Syntax ist korrekt

---

## 📞 Support

Für Fragen oder Probleme:
1. Überprüfe die [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)
2. Schau in die Backend Logs
3. Teste Endpoints mit cURL/Postman

---

**Viel Erfolg beim Admin-Management! 🚀**
