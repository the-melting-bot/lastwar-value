# Last War Value

Account valuation tool for Last War: Survival. Find out what your account is worth, track your value over time, and get recommendations on where to invest next.

## Features

- **13-category valuation algorithm** — scores your account against server-age baselines using decoration power, hero power, weapons, drones, and more
- **Multi-step evaluation wizard** — 5-step form with searchable server dropdown, conditional fields based on server season, and pre-fill from previous evaluations
- **Results dashboard** — dollar value with range, line chart tracking over time, category breakdown with progress bars, change tracking, and investment recommendations
- **2,212+ servers** — comprehensive server database with creation dates, regions, and merge status
- **Mobile-first** — fully responsive dark military theme

## Tech Stack

- **Next.js 14+** with App Router
- **TypeScript** throughout
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **localStorage** for evaluation persistence (abstracted for future Supabase migration)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/
  layout.tsx          — root layout with dark theme, Inter font
  page.tsx            — landing page
  evaluate/page.tsx   — multi-step evaluation form
  results/page.tsx    — results dashboard
  api/update-servers/ — cron endpoint for server data updates
components/
  EvaluationWizard.tsx  — multi-step form wizard
  ResultsDashboard.tsx  — results display with all sections
  ServerSearch.tsx      — searchable/filterable server dropdown
  ValueChart.tsx        — Recharts line chart
  ValueBreakdown.tsx    — category breakdown table
  ProgressBar.tsx       — step progress indicator
  Footer.tsx            — shared footer
lib/
  types.ts            — TypeScript interfaces
  storage.ts          — localStorage abstraction layer
  valuation.ts        — complete valuation algorithm
  servers.ts          — server data loading and helpers
public/data/
  servers.json        — server database
```

## Deployment

Deploy to Vercel for automatic builds. The `vercel.json` configures a daily cron job to check for new server data.

```bash
npm run build
```
