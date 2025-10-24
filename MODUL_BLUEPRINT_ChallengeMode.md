# ⚔️ Challenge-Mode Modul Blaupause

## Modultyp: Zeitbasierte Coding-Aufgaben mit Live-Feedback

### 🎯 Lernziele
- Praktische Programmierfertigkeiten unter Druck üben
- Schnelle Problemlösungsfähigkeiten entwickeln
- Wettbewerbsgeist fördern
- Real-World Szenarien simulieren

### 📋 Beispiel-Challenges

#### 1. "Debug Hunt" (10 Minuten)
**Schwierigkeit**: Anfänger
**Beschreibung**: Finde und behebe alle Bugs im vorgegebenen Code

**Challenge-Szenario**:
```csharp
public class DebugHunt {
    public int CalculateSum(int[] numbers) {
        int sum = 0;
        for (int i = 0; i <= numbers.Length; i++) { // Bug 1: <= statt <
            sum = sum * numbers[i]; // Bug 2: * statt +
        }
        return sum; // Bug 3: sollte sum/numbers.Length sein (average)
    }
}
```

**Fehler pro Level**:
- Level 1: 1 Fehler
- Level 2: 3 Fehler (wie oben)
- Level 3: 5+ versteckte Fehler

**Gamification**:
- 🏆 100 Punkte für Abschluss
- ⏱️ Bonus: +50 Punkte wenn <7 Min
- ⚡ Bonus: +25 Punkte pro Fehler schneller gefunden
- 🥇 Leaderboard-Integration

---

#### 2. "Algorithm Speedrun" (15 Minuten)
**Schwierigkeit**: Mittelstufe
**Beschreibung**: Implementiere einen Algorithmus unter Zeitdruck

**Aufgaben**:
1. **Binary Search implementieren** (4 Min)
   - Gegeben: Sortiertes Array
   - Aufgabe: Schnelle Suche implementieren
   - Testfälle: 5 automatisierte Tests

2. **Bubblesort optimieren** (5 Min)
   - Code ist korrekt, aber ineffizient
   - Aufgabe: Optimiere auf O(n) im besten Fall
   - Feedback: Performance-Vergleich

3. **Hashtable Collision handhaben** (6 Min)
   - Implementiere Collision-Handling
   - Testfälle mit Edge-Cases

**Gamification**:
- 🏆 250 Punkte für Abschluss
- ⚡ Speed Bonus: bis zu +100 Punkte
- 🎯 Accuracy Bonus: +50 Punkte bei 100% Tests bestanden
- 🏅 Badge: "Algorithm Master" nach 3 Abschlüssen

---

#### 3. "Netzwerk-Puzzle" (20 Minuten)
**Schwierigkeit**: Fortgeschrittener
**Beschreibung**: Konfiguriere und debugge ein Netzwerk-Szenario

**Szenario**: 
"Deine API wird von zu vielen Requests bombardiert. Implementiere ein Rate-Limiting System!"

**Tasks**:
1. Schreibe eine Rate-Limiting Klasse
2. Implementiere verschiedene Strategien (Token Bucket, Sliding Window)
3. Teste mit simulierten Requests
4. Optimiere unter Zeitdruck

**Live-Feedback**:
- Request-Diagramm in Echtzeit
- Durchsatzanzeige
- Performance-Metriken

---

## 💻 UI-Komponenten-Skizzen

### Challenge Header

```
┌────────────────────────────────────────┐
│  ⚔️ Challenge: Debug Hunt              │
├────────────────────────────────────────┤
│  Schwierigkeit: ⭐⭐⭐                 │
│  Zeitlimit: ⏱️  10:00                  │
│  Punkte auf dem Spiel: 🏆 150          │
│                                         │
│  Leaderboard Position: 🥈 #2           │
└────────────────────────────────────────┘
```

### Timer & Leaderboard in Echtzeit

```
┌─ Live Dashboard ──────────────────┐
│  Deine Zeit: 04:23                │
│  Aktuelle Punkte: 87              │
│  Rang: 3 / 42                     │
│  Beste Zeit dieses Level: 02:15   │
│                                    │
│  Echtzeit-Leaderboard:            │
│  🥇 Code Master      06:15 | 150p │
│  🥈 Du               04:23 | 87p  │
│  🥉 Swift Coder      04:58 | 84p  │
└────────────────────────────────────┘
```

### Code-Feedback Panel

```
┌─ Test Results ────────────────────┐
│  Tests: 4/5 bestanden ✅           │
│                                    │
│  ✅ Test 1: Grundfall              │
│  ✅ Test 2: Edge Case              │
│  ❌ Test 3: Performance            │
│     Expected: < 100ms             │
│     Got: 145ms ⚠️                 │
│  ✅ Test 4: Memory                │
│  ⏳ Test 5: Running...             │
│                                    │
│  Code Quality: 78% 📊              │
│  Performance: 65% 📉              │
│  Readability: 92% ✨              │
└────────────────────────────────────┘
```

---

## 🔄 Interaktionskonzept

1. **Challenge Auswählen** → Beschreibung & Requirements anzeigen
2. **Timer starten** → Code-Editor öffnen
3. **Live-Tests** → Automatische Validierung beim Speichern
4. **Performance-Feedback** → Echtzeit Metriken anzeigen
5. **Echtzeit-Leaderboard** → Aktuelle Positionen zeigen
6. **Abschluss** → Score + Punkte + Badge Animationen

---

## 📡 API-Integration

```typescript
// Challenge starten
POST /api/challenges/start
{
  "challengeId": "string",
  "userId": "string"
}
Response: { sessionId, timeLimit, initialCode }

// Code testen (beim Speichern)
POST /api/challenges/test
{
  "sessionId": "string",
  "code": "string",
  "testCases": ["input1", "input2"]
}
Response: {
  "passed": number,
  "failed": number,
  "tests": [{ name, passed, message, executionTime }],
  "performance": { cpuTime, memoryUsed },
  "feedback": "string"
}

// Challenge abschließen
POST /api/challenges/submit
{
  "sessionId": "string",
  "finalCode": "string",
  "timeSpent": "number seconds"
}
Response: {
  "score": number,
  "pointsEarned": number,
  "badge": badge | null,
  "leaderboardRank": number,
  "feedback": "string"
}

// Leaderboard abfragen
GET /api/challenges/{challengeId}/leaderboard?limit=50
Response: [
  { rank, userId, username, avatar, score, timeSpent },
  ...
]
```

---

## 🎮 Schwierigkeitsgrad-System

### Anfänger (1-2 ⭐)
- Einfache Bugs
- Viel Kontext
- Lange Zeitlimits (8-10 Min)
- 100-150 Punkte
- Leichte Bonusbedingungen

### Mittelstufe (2-3 ⭐)
- Mehrere zusammenhängende Fehler
- Moderater Kontext
- Normale Zeitlimits (12-20 Min)
- 200-300 Punkte
- Normale Bonusbedingungen

### Fortgeschrittener (3-4 ⭐)
- Komplexe, versteckte Fehler
- Minimaler Kontext
- Kurze Zeitlimits (15-30 Min)
- 300-500 Punkte
- Hohe Bonusbedingungen

### Expert (4-5 ⭐)
- Multischichtige Probleme
- Fast kein Kontext
- Sehr kurze Limits (10-20 Min)
- 500-1000 Punkte
- Extreme Bonusbedingungen

---

## 🏅 Badges & Achievements

### Challenge-Spezifisch
- 🎯 "First Challenge" - 1. Challenge abgeschlossen
- ⚡ "Speed Demon" - Challenge in <50% der Zeit
- 🎖️ "Perfect Score" - 100% Testabdeckung
- 🏆 "Leaderboard König" - #1 in Weekly Rankings

### Streaks & Konsistenz
- 🔥 "3-Day Streak" - 3 Tage in Folge Challenges
- 🚀 "Week Warrior" - 10+ Challenges in 1 Woche
- ⭐ "Consistency Expert" - 30 Tage ohne Ausfälle

---

## 📊 Success Metrics

- **Completion Rate**: >40% der gestarteten Challenges
- **Avg Time**: Sollte nahe am Difficulty-Target liegen
- **Test Pass Rate**: >70% sollte erreichbar sein
- **Leaderboard Engagement**: >30% der Nutzer im Leaderboard
- **Repeat Rate**: 50%+ starten eine 2. Challenge

---

## 🔔 Notifications & Social

- **During**: Live Leaderboard Updates
- **After**: Achievement Notifications
- **Social**: Direkt Challenge-Freunden herausfordern
- **Weekly**: Beste Performer Features

