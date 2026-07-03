# Gästekarte Demo-App

Next.js-Web-App zur Visualisierung und Demonstration des digitalen Gästekarte-Antragsprozesses an der MLU Halle-Wittenberg.

**Projektseminar Informationsmanagement | SS-26**

**Team:** Doaa Nawaf Abdo Al-Shoumi, Amy Marie Müller, Jenna Maria Lara Peters, Sameer Rana, Jacy Nicole Richter
**Betreuer:** Sebastian Hirsekorn, Leonard Nake

---

## Überblick

Die App bildet den gesamten digitalen Gästekarte-Lebenszyklus ab:
1. Gast-Einladung durch den Host
2. Digitales Antragsformular mit Validierung und Foto-Upload
3. Host-Freigabe und Haftungsbestätigung
4. Parallele Service-Provisionierung (ITZ, ULB, IO)
5. Status-Tracking & Verlaufsansicht
6. PDF-Export des Antrags
7. Statistiken und Dashboards

## Live-Demo

https://demo-app-sigma-jet.vercel.app/

## Technologie

- **Framework:** Next.js 16 (App Router)
- **Sprache:** TypeScript
- **Datenbank:** Prisma / SQLite
- **UI:** Tailwind CSS, shadcn/ui
- **Deployment:** Vercel

## Lokale Entwicklung

```bash
npm install
cp .env.example .env   # falls vorhanden, sonst prisma/dev.db wird genutzt
npx prisma generate
npm run dev
```

Dann http://localhost:3000 öffnen.

## Projekt-Kontext

Diese Demo-App ist eine **alternative, ergänzende Umsetzung** zum offiziellen JobRouter-Prototypen und war kein Bestandteil der Projektanforderungen. Sie diente als Machbarkeitsnachweis und zur Visualisierung des Soll-Prozesses während der Entwicklungsphase.
