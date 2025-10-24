# 🚀 LernLix - Deployment Guide

## 🎯 Deployment-Optionen

| Plattform | Kosten | Für | Zeit |
|-----------|--------|-----|------|
| **Vercel** | $0-20/mo | Frontend | 5 min |
| **Netlify** | $0-19/mo | Frontend | 5 min |
| **AWS** | $20-100+/mo | Full-Stack | 30 min |
| **Heroku** | $0-50/mo | Backend | 10 min |
| **Railway** | $5+/mo | Backend | 10 min |

---

## ✨ Empfohlen: Vercel (Frontend)

### Schnell-Deployment

#### 1. Auf GitHub pushen
```bash
git init
git add .
git commit -m "Initial commit: LernLix"
git remote add origin https://github.com/USERNAME/lernlix.git
git push -u origin main
```

#### 2. Auf Vercel connecten
- Gehe zu [vercel.com](https://vercel.com)
- Klicke "New Project"
- Importiere dein GitHub Repository
- Klicke "Deploy"

**Done! ✅** Deine App läuft unter: `https://lernlix.vercel.app`

---

## 📦 Build für Production

### 1. Code testen
```bash
npm run build
npm run preview
```

### 2. Build-Artefakte prüfen
```bash
ls -la dist/
```

Output sollte sein:
```
index.html       (13 KB)
assets/index-*.js  (500 KB)
assets/index-*.css (50 KB)
```

### 3. Performance überprüfen
```bash
# Build-Größe
du -sh dist/

# Lighthouse Audit
npm run preview  # Dann DevTools → Lighthouse
```

---

## 🔐 Environment-Variablen (Production)

Erstelle `.env.production`:

```env
# API
VITE_API_URL=https://api.lernlix.dev
VITE_API_TIMEOUT=10000

# Analytics
VITE_ANALYTICS_ENABLED=true
VITE_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project

# Features
VITE_ENABLE_LEADERBOARD=true
VITE_ENABLE_CHALLENGES=true
VITE_ENABLE_SOCIAL=true
VITE_ENABLE_AI_COACH=false

# Performance
VITE_CACHE_ENABLED=true
```

---

## 📋 Deployment Checkliste

### Vor dem Deployment
- [ ] Alle Tests erfolgreich
- [ ] Build fehlerfrei (`npm run build`)
- [ ] Build-Größe akzeptabel (<1 MB)
- [ ] Keine Console-Fehler
- [ ] Responsive Design getestet
- [ ] Alle Links funktionieren
- [ ] Images optimiert
- [ ] Analytics konfiguriert

### Nach dem Deployment
- [ ] Website lädt schnell (<2s)
- [ ] Alle Funktionen arbeiten
- [ ] Mobile responsive
- [ ] SSL Certificate aktiv
- [ ] Error Tracking läuft
- [ ] Monitoring aktiv

---

## 🌐 Domain konfigurieren

### Mit eigenem Domain

#### 1. Domain registrieren
- [namecheap.com](https://namecheap.com)
- [google.com/domains](https://google.com/domains)
- [vercel.com/domains](https://vercel.com/domains)

#### 2. DNS-Einträge konfigurieren
```
A Record:    76.76.19.79 (Vercel IP)
CNAME:       cname.vercel.com
```

#### 3. Vercel konfigurieren
- Dashboard → Project Settings → Domains
- Domain eingeben
- Auf "Add Domain" klicken
- DNS folgen

---

## 🔄 CI/CD Pipeline mit GitHub Actions

Erstelle `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install dependencies
        run: npm install
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Vercel
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
        run: npx vercel --prod --token $VERCEL_TOKEN
```

---

## 📊 Monitoring & Logging

### Fehler-Tracking mit Sentry

```typescript
// src/main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  tracesSampleRate: 1.0,
});
```

### Performance Monitoring

```typescript
// Measure page load
window.addEventListener('load', () => {
  const perfData = window.performance.timing;
  const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
  console.log('Page load time: ' + pageLoadTime + 'ms');
  
  // Send to analytics
  recordMetric('page_load_time', pageLoadTime);
});
```

---

## 🔒 Security Checklist

- [ ] HTTPS aktiviert
- [ ] Headers konfiguriert (CSP, X-Frame-Options)
- [ ] API Rate Limiting aktiv
- [ ] Input Validation aktiv
- [ ] XSS Protection aktiv
- [ ] CORS richtig konfiguriert
- [ ] Secrets nicht in Code
- [ ] Dependencies aktuell

---

## 📈 Skalierung

### Phase 1: MVP (bis 1,000 Nutzer)
```
Frontend: Vercel
Backend: Heroku/Railway  
Database: PostgreSQL (free tier)
Cache: Redis (free tier)
```

### Phase 2: Growth (bis 10,000 Nutzer)
```
Frontend: Vercel (Pro)
Backend: AWS ECS + ALB
Database: RDS (db.t3.small)
Cache: ElastiCache
CDN: CloudFront
```

### Phase 3: Scale (10,000+ Nutzer)
```
Frontend: Vercel + Cloudflare
Backend: K8s Cluster
Database: Aurora PostgreSQL
Cache: Redis Cluster
CDN: Multi-region
```

---

## 💰 Kosten-Übersicht (monatlich)

### MVP Setup
- Vercel: $0-20 (free tier + optional Pro)
- Railway Backend: $5-20
- Database: $15-30
- **Total: $20-70**

### Growth Setup
- Vercel Pro: $20
- AWS ECS: $50-100
- RDS: $50-100
- CloudFront: $5-20
- **Total: $125-240**

### Scale Setup
- Vercel Enterprise: $100+
- AWS: $500-1000
- Monitoring/Logging: $50-100
- **Total: $650-1,100+**

---

## 🚨 Notfall-Playbook

### Website down
1. Überprüfe Status-Seite: [status.vercel.com](https://status.vercel.com)
2. Check Error Logs: Sentry Dashboard
3. Rollback: `git revert` + Push
4. Notify Users: Status Page Update

### Performance Problem
1. Check Vercel Analytics
2. Überprüfe Bundle-Größe
3. Cache löschen: `npm run build --clean-cache`
4. Re-deploy: `git push`

### Data Issue
1. Check Backups
2. Notify Support Team
3. Assess Impact
4. Execute Recovery Plan

---

## 📞 Support & Ressourcen

- **Vercel Docs**: https://vercel.com/docs
- **React Docs**: https://react.dev
- **Sentry Docs**: https://docs.sentry.io
- **Monitoring**: https://www.datadoghq.com

---

## ✅ Erfolgs-Kriterien

- ✅ Deploy-Zeit: < 2 min
- ✅ Time to First Paint: < 1s
- ✅ Uptime: > 99%
- ✅ Error Rate: < 0.1%
- ✅ Load Time: < 2s
- ✅ Lighthouse Score: > 90

---

**Happy Deployment! 🚀**

*Zuletzt aktualisiert: Oktober 2025*

