# 🚀 Getting Started - LernLix Entwicklungs-Anleitung

Willkommen bei **LernLix**! 🎉 Diese Anleitung hilft dir, schnell mit der Entwicklung zu starten.

## 📋 Voraussetzungen

- **Node.js** 16+ (Download: https://nodejs.org)
- **npm** oder **yarn**
- **Git**
- Optional: Docker für Backend-Entwicklung

## 🎯 Schnelleinstieg (5 Minuten)

### 1. Projekt klonen & Setup

```bash
cd C:\Users\nicom\Desktop\LernLix

# Abhängigkeiten installieren
npm install

# oder mit yarn
yarn install
```

### 2. Entwicklungsserver starten

```bash
npm run dev

# Der Server startet unter http://localhost:5173
```

### 3. Öffne `http://localhost:5173` in deinem Browser

🎉 **Fertig!** Du siehst jetzt das LernLix Dashboard!

---

## 📁 Projektstruktur erklärt

```
LernLix/
├── 📄 README.md                          # Projekt-Übersicht
├── 📄 ARCHITEKTUR.md                     # Technische Architektur
├── 📄 GETTING_STARTED.md                 # Diese Datei
├── 📄 MODUL_BLUEPRINT_*.md               # Modul-Spezifikationen
│
├── 📦 src/                               # Source Code
│   ├── 🎨 App.tsx                        # Haupt-App Component
│   ├── 🎨 App.css                        # App-Styles
│   ├── 📄 main.tsx                       # React Entry Point
│   ├── 🎨 index.css                      # Global Styles
│   │
│   ├── 🗂️ components/                    # Wiederverwendbare Komponenten
│   │   ├── ProgressBar.tsx               # Fortschrittsanzeige
│   │   ├── BadgeCard.tsx                 # Badge-Anzeige
│   │   └── LeaderboardCard.tsx           # Leaderboard-Komponente
│   │
│   ├── 🗂️ pages/                         # Seiten-Komponenten
│   │   ├── Dashboard.tsx                 # Hauptdashboard
│   │   └── ModuleView.tsx                # Modul-Ansicht
│   │
│   └── 🗂️ store/                         # State Management
│       └── gamificationStore.ts          # Zustand Store für Gamification
│
├── 📄 package.json                       # Dependencies & Scripts
├── 📄 tsconfig.json                      # TypeScript Konfiguration
├── 📄 vite.config.ts                     # Vite Build Konfiguration
├── 📄 tailwind.config.js                 # Tailwind CSS Konfiguration
├── 📄 postcss.config.js                  # PostCSS Konfiguration
├── 📄 index.html                         # HTML Entry Point
└── 📄 .gitignore                         # Git Ignore Rules
```

---

## 🎓 Erste Schritte: Komponenten verstehen

### 1. ProgressBar.tsx erkunden

```typescript
// src/components/ProgressBar.tsx
import { ProgressBar } from '../components/ProgressBar'

// Verwendung:
<ProgressBar 
  current={250}           // Aktuelle Punkte
  total={500}             // Ziel-Punkte
  milestone="50% Weg!"    // Optional: Meilenstein-Text
  color="from-blue-500"   // Optional: Gradient-Farbe
/>
```

### 2. Badge-System testen

```typescript
// src/components/BadgeCard.tsx
<BadgeCard
  name="First Coder"
  description="Erstes Modul abgeschlossen"
  icon="💻"
  unlocked={true}
  unlockedAt={new Date()}
/>
```

### 3. Leaderboard anzeigen

```typescript
// src/components/LeaderboardCard.tsx
const entries = [
  { rank: 1, name: "Code Master", points: 2500, level: 5, avatar: "👨‍💻", trend: "up" }
]
<LeaderboardCard entries={entries} currentUserRank={1} />
```

---

## 💾 State Management mit Zustand

### Gamification Store verwenden

```typescript
import { useGamificationStore } from '../store/gamificationStore'

export function MyComponent() {
  const { userStats, addPoints, unlockBadge } = useGamificationStore()

  // Punkte hinzufügen
  const handleEarnPoints = () => {
    addPoints(100, "Modul abgeschlossen")
  }

  // Badge freischalten
  const handleUnlockBadge = () => {
    unlockBadge({
      id: 'first-coder',
      name: 'First Coder',
      description: 'Erstes Modul abgeschlossen',
      icon: '💻'
    })
  }

  return (
    <div>
      <p>Punkte: {userStats.totalPoints}</p>
      <p>Level: {userStats.currentLevel}</p>
      <button onClick={handleEarnPoints}>+100 Punkte</button>
    </div>
  )
}
```

---

## 🎨 Styling mit Tailwind CSS

Alle Komponenten nutzen **Tailwind CSS** für Styling:

```tsx
// Beispiel: Button mit Tailwind
<button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition">
  Klick mich!
</button>

// Farben aus der Konfiguration
// Primary: #8b5cf6
// Secondary: #3b82f6
// Success: #10b981
// Dark BG: #0f172a
```

---

## 🔄 Workflow für neue Features

### Feature 1: Neuen Badge-Typ hinzufügen

1. **Badge in Datenbank definieren** (Backend später)
2. **Type in gamificationStore updaten**
   ```typescript
   // src/store/gamificationStore.ts
   export interface Badge {
     id: string
     name: string
     description: string
     icon: string
     category?: 'speedrun' | 'challenge' | 'streak'
   }
   ```

3. **Komponente in Dashboard verwenden**
   ```typescript
   // src/pages/Dashboard.tsx
   const newBadge = {
     id: 'speed-demon',
     name: 'Speed Demon',
     description: '5x unter 5 Min abgeschlossen',
     icon: '⚡'
   }
   ```

### Feature 2: Neue Modul-Seite erstellen

1. **Neue Komponente erstellen**
   ```typescript
   // src/pages/ProjectLabView.tsx
   export const ProjectLabView = () => {
     return <div>Projekt-Lab Inhalte</div>
   }
   ```

2. **In App.tsx einbinden**
   ```typescript
   // src/App.tsx
   import { ProjectLabView } from './pages/ProjectLabView'
   
   // In JSX:
   {currentPage === 'project-lab' && <ProjectLabView />}
   ```

3. **Navigation updaten**
   ```tsx
   <button onClick={() => setCurrentPage('project-lab')}>
     🏗️ Projekt-Lab
   </button>
   ```

---

## 🧪 Testing & Debugging

### Console-Debugging aktivieren

```typescript
// In einer Komponente:
import { useGamificationStore } from '../store/gamificationStore'

function DebugPanel() {
  const store = useGamificationStore()
  
  useEffect(() => {
    console.log('Gamification State:', store.userStats)
  }, [store.userStats])
  
  return <div>Check Console für Debug-Info</div>
}
```

### Test-Button im Dashboard

Das Dashboard hat einen Button "Test: +100 Punkte" zum schnellen Testing:

```typescript
// src/pages/Dashboard.tsx
const handleAddPoints = () => {
  addPoints(100, 'Test Bonus')
  incrementStreak()
}
```

---

## 🚀 Production Build

```bash
# TypeScript kompilieren + Vite Build
npm run build

# Vorschau des Production Builds
npm run preview
```

Der Build wird in `dist/` erstellt und ist bereit für Deployment.

---

## 📚 Nächste Schritte

### Kurzfristig (Diese Woche):
- [ ] Dashboard-Layout refinieren
- [ ] Code-Editor Komponente verbessern
- [ ] Mobile Responsiveness testen

### Mittelfristig (Diese Month):
- [ ] Backend-API Integration
- [ ] Module Datenbank-Schema
- [ ] User Authentication

### Langfristig:
- [ ] Video-Player Integration
- [ ] Code-Execution Service
- [ ] AI Learning Coach
- [ ] Social Features (Friends, Groups)

---

## 🆘 Häufige Probleme

### Problem: "Cannot find module 'react'"

**Lösung**: 
```bash
npm install
npm run dev
```

### Problem: Tailwind Styles funktionieren nicht

**Lösung**: 
- Stelle sicher, dass `index.css` in `main.tsx` importiert ist
- Cache clearen: `npm run build --clean-cache`

### Problem: Port 5173 wird bereits verwendet

**Lösung**: 
```bash
# Anderen Port nutzen:
npm run dev -- --port 3000
```

### Problem: TypeScript Fehler

**Lösung**: 
```bash
# TypeScript Typen neu installieren
npm install --save-dev @types/node

# Projekt neustarten
npm run dev
```

---

## 📖 Dokumentation & Ressourcen

- **React Docs**: https://react.dev
- **TypeScript Docs**: https://www.typescriptlang.org/docs/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Framer Motion**: https://www.framer.com/motion/
- **Zustand**: https://github.com/pmndrs/zustand
- **Vite Docs**: https://vitejs.dev/guide/

---

## 💬 Kontakt & Support

Bei Fragen oder Problemen:
1. GitHub Issues öffnen
2. Discord Community beitreten
3. Dokumentation lesen

---

## 📄 Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert.

---

**Happy Coding! 🎓✨**

*Zuletzt aktualisiert: Oktober 2025*

