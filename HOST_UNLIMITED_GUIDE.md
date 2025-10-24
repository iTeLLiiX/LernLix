# 🖥️ HOST-UNLIMITED CONTROL PANEL - ANFÄNGER GUIDE

## 🎯 WAS IST DAS?

Das Control Panel ist dein **Verwaltungs-Dashboard** für deinen Server.
Dort kannst du alles kontrollieren ohne Terminal-Befehle!

---

# 🚀 SCHRITT 1: LOGIN INS CONTROL PANEL

## 1.1 - Zur Seite gehen
```
AKTION:
1. Öffne diese URL in deinem Browser:
   https://c-area.host-unlimited.de/my/user/self

2. Du siehst: Ein Login-Fenster

WAS DU BRAUCHST:
- E-Mail (die du bei Registrierung genutzt hast)
- Passwort (das du von Host-Unlimited bekommen hast)
```

## 1.2 - Login durchführen
```
AKTION:
1. Gib deine E-Mail ein (z.B. max@example.com)
2. Gib dein Passwort ein
3. Klick auf "Login" oder drücke ENTER

ERGEBNIS:
- Du siehst das Dashboard
- Oben rechts dein Name
- Links ein Menü
```

---

# 📊 SCHRITT 2: DAS DASHBOARD VERSTEHEN

## 2.1 - Dashboard Layout

```
┌─────────────────────────────────────────────────────────────┐
│ HOST-UNLIMITED         [Suche]     Benutzer ▼  Support      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ LINKES MENÜ:                    HAUPT-BEREICH:            │
│ ├─ Dashboard                    Deine Dienste:            │
│ ├─ Meine Services               - lernlix.de (Domain)     │
│ ├─ Domains                      - Ubuntu VPS              │
│ ├─ Meine VPS/Server             - E-Mail                  │
│ ├─ Rechnungen                                              │
│ ├─ Tickets/Support              Schnelle Links:            │
│ └─ Profil                       - Server Info              │
│                                 - Login Daten              │
│                                 - Support                  │
└─────────────────────────────────────────────────────────────┘
```

---

# 🖱️ SCHRITT 3: WICHTIGE FUNKTIONEN

## 3.1 - Deine Server/VPS finden

```
AKTION:
1. Im linken Menü klick auf: "Meine VPS/Server"
   (oder "Meine Services")

DU SIEHST:
- dein(e) Server aufgelistet
- Meistens nur EINER wenn neu

BEISPIEL:
┌─ Ubuntu-VPS-12345 (Status: Online ✅)
   ├─ IP: 192.168.1.100
   ├─ RAM: 2 GB
   ├─ SSD: 50 GB
   └─ Aktionen: [Verwalten] [Neu starten] [Löschen]
```

## 3.2 - Server verwalten

```
AKTION:
1. Klick auf "Verwalten" oder den Server-Namen

DU SIEHST:
- Server Details
- IP Adresse (WICHTIG!)
- Root Passwort (WICHTIG!)
- Root Benutzer (meistens "root")
- Betriebssystem (Ubuntu 20.04)
- Start/Stop/Reboot Buttons
- Logs/Verwaltung
```

## 3.3 - Deine Domäne finden

```
AKTION:
1. Im linken Menü klick auf: "Domains"

DU SIEHST:
- Deine gekaufte Domain (z.B. lernlix.de)
- Status: Active/Pending
- Ablaufdatum
- [DNS verwalten] Button

WICHTIG:
Du brauchst "DNS verwalten" später!
```

---

# 🔑 SCHRITT 4: SERVER DETAILS RAUSHOLEN

## 4.1 - IP Adresse finden

```
AKTION:
1. Gehe zu "Meine VPS/Server"
2. Klick auf deinen Server
3. Scrolle nach unten bis "Server Details"
4. Suche die Zeile: "IP Adresse" oder "Public IP"

DU SIEHST:
Sowas wie: 192.168.1.100
oder:      123.45.67.89

MERKEN:
Diese Nummer brauchst du SPÄTER!
Speichere sie irgendwo! (Notepad etc)
```

## 4.2 - Root Passwort finden

```
AKTION:
1. Bei deinem Server im Panel
2. Suche: "Root Passwort" oder "SSH Credentials"
3. Du siehst: Ein Passwort (meistens versteckt mit *** )
4. Klick auf das Auge-Icon um zu zeigen

DU SIEHST:
Sowas wie: 7H$kL9mP2@xQ!

MERKEN:
Speichern! Brauchst du für SSH Login!
```

---

# 🌐 SCHRITT 5: DNS RECORDS EINRICHTEN

## 5.1 - Zu DNS gehen

```
AKTION:
1. Im Menü: "Domains"
2. Deine Domain (z.B. lernlix.de) klicken
3. Suche Button: "DNS verwalten" oder "DNS Records"
4. Klick drauf

DU SIEHST:
Eine Tabelle mit Spalten:
- Typ (A, CNAME, MX, etc.)
- Name (@, www, mail, etc.)
- Value (die Nummer/Adresse)
- TTL (einfach ignorieren)
```

## 5.2 - A Record hinzufügen (Für www.lernlix.de)

```
AKTION:
1. Suche Button: "+ Neuer Record" oder "Add Record"
2. Klick drauf
3. Ein Formular öffnet sich

FORMULAR AUSFÜLLEN:
Feld 1 - Typ: A (aus Dropdown wählen)
Feld 2 - Name: www (genau das eingeben)
Feld 3 - Value: DEINE_SERVER_IP (z.B. 192.168.1.100)
Feld 4 - TTL: 3600 (default, nicht ändern)

DANN:
Klick "Speichern" oder "Create"

ERGEBNIS:
Du siehst neuen Record in der Liste:
┌─ www    | A | 192.168.1.100 | 3600
```

## 5.3 - A Record für Hauptdomain hinzufügen

```
AKTION:
1. NOCHMAL "+ Neuer Record"
2. Klick drauf

FORMULAR AUSFÜLLEN:
Feld 1 - Typ: A
Feld 2 - Name: @ (GENAU diese Symbol!)
Feld 3 - Value: DEINE_SERVER_IP (z.B. 192.168.1.100)
Feld 4 - TTL: 3600

DANN:
Klick "Speichern"

ERGEBNIS:
Jetzt hast du TWO A Records:
┌─ @      | A | 192.168.1.100 | 3600
└─ www    | A | 192.168.1.100 | 3600

BEDEUTUNG:
@ = lernlix.de zeigt auf deine IP
www = www.lernlix.de zeigt auch auf deine IP
```

---

# 🔄 SCHRITT 6: SERVER NEU STARTEN

## 6.1 - Wann neu starten?

```
Du brauchst einen REBOOT wenn:
- Nach großen Änderungen
- Bei Problemen mit Services
- Nach Kernel Updates
- Als erste Fehlersuche
```

## 6.2 - Server neustarten

```
AKTION:
1. Gehe zu "Meine VPS/Server"
2. Dein Server anklicken
3. Suche Button: "Reboot" oder "Neu starten"
4. Klick drauf
5. WARNUNG kommt: "Sind Sie sicher?"
6. Klick "Ja" oder "Confirm"

WÄHREND REBOOT:
- Server ist 1-2 Minuten DOWN
- Du kannst nicht drauf zugreifen
- Ist normal!
- Warte bis "Status: Online" wieder grün ist

DANACH:
- Server ist neu gestartet
- Alle Prozesse sind auch neu gestartet
```

---

# 📝 SCHRITT 7: LOGS & MONITORING

## 7.1 - Server Logs anschauen

```
AKTION:
1. Bei deinem Server im Panel
2. Suche: "Logs" oder "Console"
3. Klick drauf

DU SIEHST:
Die letzten Fehler/Events
Nützlich zum Debuggen!
```

## 7.2 - Server Nutzung anschauen

```
AKTION:
1. Bei deinem Server im Panel
2. Suche: "Statistiken" oder "Usage"
3. Klick drauf

DU SIEHST:
- CPU Nutzung (%)
- RAM Nutzung (%)
- Disk Nutzung (%)
- Traffic (Bandbreite)

WICHTIG:
Wenn RAM immer rot = Problem!
Wenn Disk 90%+ = Platz aufräumen nötig!
```

---

# 🎛️ SCHRITT 8: NOTFALL - WENN NICHTS GEHT

## 8.1 - Power Cycle (Notfall)

```
Wenn Server "offline" oder nicht erreichbar:

AKTION:
1. Im Panel bei deinem Server
2. Suche: "Ausschalten" oder "Power Off"
3. Klick drauf & bestätige
4. Warte 30 Sekunden
5. Suche: "Einschalten" oder "Power On"
6. Klick drauf
7. Warte 1-2 Minuten bis "Online"

DANACH:
Server sollte wieder gehen
Wie einen Router neu starten!
```

## 8.2 - Support Ticket öffnen

```
Wenn Server komplett kaputt:

AKTION:
1. Im Menü: "Support" oder "Tickets"
2. Klick: "+ Neues Ticket"
3. Beschreibe Problem:
   "Mein Server antwortet nicht"
   "Meine App läuft nicht mehr"
   etc.
4. Anhänge: Screenshots von Logs (falls möglich)
5. Klick "Senden"

ERGEBNIS:
Support Team antwortet meistens in 1-2 Stunden
```

---

# 📋 CHECKLISTE - WAS DU JETZT WISSEN SOLLTEST

```
Nachdem du diese Anleitung gelesen hast:

☑️ Ich kann mich ins Control Panel einloggen
☑️ Ich kenne meine Server IP Adresse
☑️ Ich kenne mein Root Passwort
☑️ Ich weiß wie ich DNS Records konfiguriere
☑️ Ich weiß wie ich meinen Server neu starte
☑️ Ich weiß wo die Logs sind
☑️ Ich weiß wie ich die Nutzung überwache
☑️ Ich weiß wie ich im Notfall vorgehe

Wenn alle ☑️ = du bist bereit zum nächsten Schritt!
```

---

# 🎯 NÄCHSTER SCHRITT

Jetzt gehe zu: **`COMPLETE_SETUP_STEPS.md`**

Dort kannst du mit SCHRITT 3 weitermachen:
- SSH Verbindung aufbauen
- Befehle auf dem Server ausführen
- Deine App hochfahren

---

**💡 PRO TIPP:** 

Speichere diese Infos:
```
Mein Server Setup:
IP Adresse:     _______________
Root User:      root
Root Passwort:  _______________
Domain:         _______________
```

Dann hast du alles an einem Platz!

---

**Du fragst: "Und wenn ich noch mehr Fragen habe?"**

→ Schau auf YouTube: "Host-Unlimited Control Panel Tutorial"
→ Oder: Im Host-Unlimited Support Center → Wiki
→ Oder: Support Ticket öffnen (ganz unten im Panel)

**Viel Erfolg! 🚀**

