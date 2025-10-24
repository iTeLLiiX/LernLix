# 🎯 Installation & Setup Guide

## 🚀 Schnell-Installation (2 Minuten)

### Schritt 1: Dependencies installieren
```bash
cd C:\Users\nicom\Desktop\LernLix
npm install
```

### Schritt 2: Dev-Server starten
```bash
npm run dev
```

### Schritt 3: Browser öffnen
```
http://localhost:5173
```

✅ **Fertig! Das Dashboard sollte jetzt sichtbar sein.**

---

## 📋 Detaillierte Installation

### Voraussetzungen
- ✅ Node.js 16+ installiert
- ✅ npm oder yarn verfügbar
- ✅ Git installiert (optional)

### Installation Schritt für Schritt

#### 1. Projekt klonen oder öffnen
```bash
cd C:\Users\nicom\Desktop\LernLix
```

#### 2. Dependencies installieren
```bash
npm install
```

Dies installiert alle Abhängigkeiten aus `package.json`:
- React 18.2.0
- TypeScript 5.2.0
- Tailwind CSS 3.3.0
- Framer Motion 10.16.0
- Zustand 4.4.0
- Vite 5.0.0
- und weitere...

#### 3. Entwicklungsserver starten
```bash
npm run dev
```

Output:
```
VITE v5.0.0  ready in 234 ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

#### 4. Browser öffnen
Öffne [http://localhost:5173](http://localhost:5173) in deinem Browser.

---

## 🎨 Verfügbare npm Scripts

```bash
# Entwicklungsserver starten
npm run dev

# Production Build erstellen
npm run build

# Build Vorschau
npm run preview

# Linting
npm run lint
```

---

## 📂 Nach Installation: Was du tun kannst

### 1. Dashboard erkunden
- Sieh dir die Gamification-Statistiken an
- Klicke auf "Test: +100 Punkte" um das System zu testen
- Beobachte Animationen und Badge-Freischaltungen

### 2. Module durchspielen
- Navigiere zu "📚 Module"
- Klicke auf ein Modul (z.B. "Chatbot erstellen")
- Schreibe oder ändere Code im Editor
- Klicke "Code ausführen" zum Testen

### 3. Code-Editor testen
```csharp
// Beispiel zum Testen:
public class HelloWorld {
    static void Main() {
        Console.WriteLine("Hello, LernLix!");
        Console.WriteLine("🎉 Gamification funktioniert!");
    }
}
```

### 4. Leaderboard ansehen
- Im Dashboard: Button "🏆 Leaderboard anzeigen" klicken
- Sieh dir die Live-Rankings an
- Deine Position wird hervorgehoben

---

## 🔧 Konfiguration

### Environment Variablen
Erstelle eine `.env.local` Datei im Root-Verzeichnis:

```env
VITE_API_URL=http://localhost:3000/api
VITE_ANALYTICS_ENABLED=true
NODE_ENV=development
```

### Tailwind CSS anpassen
Bearbeite `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: '#8b5cf6',  // Lila
      secondary: '#3b82f6' // Blau
    }
  }
}
```

---

## 🎯 Folder-Struktur nach Installation

```
src/
├── components/              # React Komponenten
│   ├── ProgressBar.tsx
│   ├── BadgeCard.tsx
│   ├── LeaderboardCard.tsx
│   ├── CodeEditor.tsx
│   ├── StatCard.tsx
│   └── ModuleCard.tsx
│
├── pages/                   # Seiten-Komponenten
│   ├── Dashboard.tsx
│   ├── ModuleView.tsx
│   └── ModulesPage.tsx
│
├── store/                   # State Management
│   └── gamificationStore.ts
│
├── utils/                   # Utility-Funktionen
│   ├── api.ts              # API-Calls
│   └── constants.ts        # Konstanten
│
├── App.tsx                 # Haupt-App
├── main.tsx               # Entry Point
└── index.css              # Globale Styles
```

---

## 🧪 Testen

### Code-Editor Test
1. Öffne Dashboard → Module
2. Klicke auf "Chatbot erstellen"
3. Schreibe Code:
```csharp
Console.WriteLine("Test!");
```
4. Klicke "Code ausführen"
5. Sieh die Ausgabe in Output-Panel

### Gamification Test
1. Im Dashboard "Test: +100 Punkte" klicken
2. Beobachte:
   - ⚡ Punkte erhöhen sich
   - 📊 Level-Fortschritt aktualisiert
   - 🔥 Streak erhöht sich
   - ✨ Animationen spielen ab

### Responsive Design Test
1. Öffne DevTools (F12)
2. Klicke auf Device Toggle (Ctrl+Shift+M)
3. Teste auf verschiedenen Viewport-Größen

---

## ❌ Häufige Probleme & Lösungen

### Problem: "npm: not found"
**Lösung**: Node.js neu installieren
```bash
# Node.js von https://nodejs.org herunterladen
# Installieren und Terminal neu starten
node --version
npm --version
```

### Problem: "Port 5173 is already in use"
**Lösung**: Anderen Port verwenden
```bash
npm run dev -- --port 3000
```

### Problem: "Cannot find module 'react'"
**Lösung**: Dependencies neu installieren
```bash
rm -r node_modules package-lock.json
npm install
npm run dev
```

### Problem: Tailwind CSS Styles fehlen
**Lösung**: Cache löschen und neu bauen
```bash
npm run build -- --reset
npm run dev
```

### Problem: "TypeScript errors"
**Lösung**: TypeScript neu kompilieren
```bash
npx tsc --noEmit
npm run dev
```

---

## 📚 Zusätzliche Ressourcen

### Offizielle Dokumentation
- [React Dokumentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vite Dokumentation](https://vitejs.dev)
- [Zustand Repository](https://github.com/pmndrs/zustand)
- [Framer Motion Docs](https://www.framer.com/motion/)

### Projekt-Dokumentation
- 📘 [README.md](README.md) - Übersicht
- 📗 [GETTING_STARTED.md](GETTING_STARTED.md) - Für Entwickler
- 📙 [ARCHITEKTUR.md](ARCHITEKTUR.md) - Technisches Design
- 📋 [MODUL_BLUEPRINT_QuickStart.md](MODUL_BLUEPRINT_QuickStart.md)

---

## ✅ Checkliste nach Installation

- [ ] Dependencies installiert (`npm install` erfolgreich)
- [ ] Dev-Server läuft (`npm run dev`)
- [ ] Browser zeigt Dashboard
- [ ] Test-Button "✅ +100 Punkte" funktioniert
- [ ] Punkte und Level aktualisieren sich
- [ ] Module-Tab zeigt 10 Module
- [ ] Leaderboard kann angezeigt/versteckt werden
- [ ] Code-Editor funktioniert
- [ ] Responsive Design auf Mobile getestet

---

## 🚀 Nächste Schritte

Nach erfolgreicher Installation:

1. **Backend starten** (Optional)
   ```bash
   # Später: Backend API aufsetzen
   # Siehe ARCHITEKTUR.md für Details
   ```

2. **Code erforschen**
   - Lese App.tsx
   - Verstehe Gamification Store
   - Erkunde Komponenten

3. **Features hinzufügen**
   - Neue Module erstellen
   - Zusätzliche Badges definieren
   - API-Integration bauen

4. **Deployment vorbereiten**
   - Build testen: `npm run build`
   - Auf Vercel deployen (Optional)

---

## 📞 Support

Bei Problemen:
1. Lese [GETTING_STARTED.md](GETTING_STARTED.md)
2. Check [Häufige Probleme](#❌-häufige-probleme--lösungen)
3. Öffne ein GitHub Issue
4. Frag in der Community

---

**Glückwunsch! 🎉 Du hast LernLix erfolgreich installiert!**

Happy Coding! ✨

*Zuletzt aktualisiert: Oktober 2025*

