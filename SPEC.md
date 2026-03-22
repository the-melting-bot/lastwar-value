# Last War Value — Complete Build Specification

Build a Next.js App Router project in this directory (/home/user/workspace/lastwar-value). The server data is already at `public/data/servers.json`.

## TECH STACK
- Next.js 14+ (App Router)
- Tailwind CSS for styling
- localStorage for saving user evaluations (abstracted behind lib/storage.ts)
- Recharts for the value-over-time chart
- TypeScript throughout

## IMPORTANT ARCHITECTURE NOTE
Structure so localStorage can be swapped for Supabase later. Keep ALL data read/write in `lib/storage.ts` with functions:
- `saveEvaluation(evaluation)` — saves to localStorage
- `getEvaluations()` — returns all evaluations from localStorage
- `getLatestEvaluation()` — returns the most recent evaluation
- `deleteEvaluation(id)` — deletes by id

Components ONLY call these functions, never touch localStorage directly.

## DESIGN THEME
- Dark military/tactical theme
- Background: dark charcoal (#111827)
- Primary accent: orange (#F97316)
- Secondary: white text on dark backgrounds
- Cards: subtle borders (#1F2937 border), slight glass-morphism (backdrop-blur, bg-opacity)
- Mobile-first responsive
- Clean, modern, bold typography (use Inter from Google Fonts)

## PAGE 1: LANDING PAGE (route: /)

### Hero Section
- Big bold headline: "What's Your Account Worth?"
- Subtitle: "Find out in 60 seconds. Track your value. Invest smarter."
- One large orange CTA button: "Value My Account →" (links to /evaluate)
- Subtle animated CSS background effect (animated grid lines or radar sweep — CSS only, lightweight)

### How It Works (3 columns desktop, stacked mobile)
1. "Enter Your Details" — clipboard icon (use emoji or inline SVG)
2. "Get Your Valuation" — chart/dollar icon
3. "Track Your Growth" — trending up arrow icon

### Stats Bar
- "2,212+ Servers Covered"
- "13 Value Categories"
- "Updated Daily"

### Footer
- "Built by a Last War player, for Last War players"
- "Not affiliated with Last War: Survival or FunFly Inc."
- Contact placeholder link
- "Created with Perplexity Computer" link to https://www.perplexity.ai/computer

## PAGE 2: MULTI-STEP EVALUATION FORM (route: /evaluate)

A multi-step wizard with progress bar showing current step. If user has a previous evaluation in localStorage, pre-fill ALL fields.

### STEP 1 OF 5: "Server Info"
- Server Number: searchable dropdown filtering from servers.json. When selected, show below:
  "✓ Server #487 — Created Nov 3, 2024 — Day 139 — Season 1 — 🇺🇸 🇪🇺"
  Calculate server day = today minus createdAt.
  Calculate season:
    - Day 1-120: Season 1
    - Day 121-270: Season 2
    - Day 271-450: Season 3
    - Day 451-650: Season 4
    - Day 651+: Season 5
  Display region flags. Store the season for conditional fields later.

### STEP 2 OF 5: "The Big Three"
- Decoration Power: numeric with comma formatting (650,000)
- Total Hero Power: numeric with comma formatting (12,000,000)
- Hero Power Server Rank: numeric (15)

### STEP 3 OF 5: "Combat & Weapons"
- Main Squad Power: numeric with comma formatting
- Exclusive Weapons: checklist of 5 weapons. Each has checkbox "Unlocked?" and if checked, level dropdown 1-10. Label "Weapon 1" through "Weapon 5".
- Drone Level: numeric (1-50)
- Drone Components: dropdown: "Mostly Rare" / "Mostly Epic" / "Mix of Legendary & Epic" / "Max Legendary"

### STEP 4 OF 5: "Collection & Progression"
- Base/Drone Skins Count: numeric
- Overlord Level: numeric (ONLY show if Season 2+)
- HQ Level: dropdown 1-30 (ONLY show if Season 2+)
- Oil Tech Tree: dropdown "Not Unlocked" / "Early" / "Mid" / "Advanced" / "Maxed" (ONLY show if Season 2+)

### STEP 5 OF 5: "Resources"
- VIP Level: dropdown 1-18
- RSS Reserves: dropdown "Under 100M" / "100M-500M" / "500M-1B" / "1B-5B" / "5B+"
- Diamonds: numeric with comma formatting (85,000)
- Total Money Spent (OPTIONAL — clearly labeled, "This helps calibrate your valuation but is never shared"):
  dropdown "F2P ($0)" / "Under $50" / "$50-$200" / "$200-$500" / "$500-$1,000" / "$1,000-$5,000" / "$5,000+"

Each step: "Next →" / "← Back". Final step: large orange "Get My Value →" button.

## PAGE 3: RESULTS DASHBOARD (route: /results)

### SECTION 1: Value Header
- Big number: "Your Base Value: $385"
- Range: "$339 - $431" (value ± 12%)
- Change indicator if previous eval exists: "+$42.00 (12.2%) ↑" green, or red if decreased
- Server info: "Server #487 — Day 642 — Season 4"

### SECTION 2: Value Over Time Chart
- Line chart (Recharts)
- X-axis: eval dates, Y-axis: dollar value
- Green when up, red when down
- Filter buttons: [1M] [3M] [6M] [All Time]
- First eval: single dot + "Re-evaluate in 2 weeks to start tracking your growth!"

### SECTION 3: Value Breakdown Table
For each category, show:
- Category name with emoji
- Player's value
- Expected baseline for server age ("Avg: 400,000")
- Horizontal progress bar (1.0 = middle)
- Dollar contribution
- Label: "LOW" / "AVERAGE" / "ABOVE AVG" / "HIGH" / "EXCEPTIONAL"
Sort by highest dollar contribution.

### SECTION 4: What Changed (only if 2+ evals)
- List increases (green ✅ + amount) and decreases (red 🔻 + amount)
- Net change total

### SECTION 5: "Invest Next" Recommendations
- Find 3 categories with lowest scores relative to user's average
- Show category, suggested action, estimated value boost

### SECTION 6: Action Buttons
- "🔄 Re-Evaluate Now" → /evaluate pre-filled
- "📤 Share Results" → copy text summary to clipboard
- "Next suggested eval: [date 14 days from now]"

## VALUATION ALGORITHM (lib/valuation.ts)

Relative scoring system. For each category:
  categoryScore = playerValue / expectedBaseline

### BASELINE CURVES (interpolate linearly between anchors based on server day):

Decoration Power:
  Day 100: 20,000 | Day 300: 100,000 | Day 500: 300,000 | Day 700: 600,000 | Day 900+: 1,000,000

Total Hero Power:
  Day 100: 1,000,000 | Day 300: 4,000,000 | Day 500: 8,000,000 | Day 700: 15,000,000 | Day 900+: 25,000,000

Main Squad Power:
  Day 100: 2,000,000 | Day 300: 15,000,000 | Day 500: 35,000,000 | Day 700: 55,000,000 | Day 900+: 80,000,000

Drone Level:
  Day 100: 5 | Day 300: 15 | Day 500: 25 | Day 700: 35 | Day 900+: 40

Skins Count:
  Day 100: 1 | Day 300: 4 | Day 500: 8 | Day 700: 12 | Day 900+: 18

Below Day 100 → use Day 100. Above Day 900 → use Day 900.

### DIRECT SCORING (no interpolation):

Hero Power Server Rank:
  Top 5: 2.5 | Top 10: 2.0 | Top 25: 1.6 | Top 50: 1.3 | Top 100: 1.0 | 100-500: 0.7 | 500+: 0.4

Drone Components:
  "Max Legendary": 2.0 | "Mix of Legendary & Epic": 1.4 | "Mostly Epic": 1.0 | "Mostly Rare": 0.5

Exclusive Weapons:
  weaponScore = (numUnlocked / 5) * (avgLevelOfUnlocked / 10) * 2.5
  No weapons: score = 0.1

Overlord Level (Season 2+ only, else 0):
  40+: 2.0 | 30-39: 1.5 | 20-29: 1.1 | 10-19: 0.8 | 1-9: 0.5

HQ Level (Season 2+ only, else 0):
  30: 1.5 | 25-29: 1.2 | 20-24: 1.0 | 15-19: 0.7 | Below 15: 0.4

Oil Tech Tree (Season 2+ only, else 0):
  "Maxed": 2.0 | "Advanced": 1.5 | "Mid": 1.0 | "Early": 0.6 | "Not Unlocked": 0.2

VIP Level:
  15+: 2.0 | 12-14: 1.5 | 10-11: 1.1 | 7-9: 0.7 | Below 7: 0.4

RSS Reserves:
  "5B+": 2.0 | "1B-5B": 1.5 | "500M-1B": 1.1 | "100M-500M": 0.8 | "Under 100M": 0.4

Diamonds:
  500,000+: 2.5 | 200,000-500,000: 1.8 | 50,000-200,000: 1.2 | 10,000-50,000: 0.7 | Under 10,000: 0.3

### CATEGORY WEIGHTS:

Post-Season 2 (Season 2+):
  decorationPower: 0.23, totalHeroPower: 0.16, heroPowerRank: 0.09, mainSquadPower: 0.10,
  exclusiveWeapons: 0.08, droneLevel: 0.06, droneComponents: 0.05, skinsCount: 0.04,
  overlordLevel: 0.05, hqLevel: 0.04, oilTechTree: 0.04, vipLevel: 0.03,
  rssReserves: 0.015, diamonds: 0.015

Pre-Season 2:
  decorationPower: 0.28, totalHeroPower: 0.20, heroPowerRank: 0.09, mainSquadPower: 0.13,
  exclusiveWeapons: 0.10, droneLevel: 0.07, droneComponents: 0.06, skinsCount: 0.04,
  vipLevel: 0.03, overlordLevel: 0, hqLevel: 0, oilTechTree: 0, rssReserves: 0, diamonds: 0

### DOLLAR CONVERSION:
  Score 0.0-0.4: $5 + (score / 0.4) * $20
  Score 0.4-0.7: $25 + ((score - 0.4) / 0.3) * $50
  Score 0.7-1.0: $75 + ((score - 0.7) / 0.3) * $100
  Score 1.0-1.4: $175 + ((score - 1.0) / 0.4) * $175
  Score 1.4-1.8: $350 + ((score - 1.4) / 0.4) * $250
  Score 1.8-2.5: $600 + ((score - 1.8) / 0.7) * $600
  Score 2.5+: $1200 + ((score - 2.5) * $400)

Display as range: value ± 12%.

## AUTO-UPDATE SERVER DATA

Create `app/api/update-servers/route.ts`:
1. Fetches https://cpt-hedge.com/servers
2. Parses the HTML — the server data is embedded in Next.js JS bundle as JSON. Extract it.
3. Compares against existing data
4. Returns JSON response with count of new servers

Create `vercel.json` in project root:
```json
{
  "crons": [
    {
      "path": "/api/update-servers",
      "schedule": "0 6 * * *"
    }
  ]
}
```

NOTE: Since this deploys on Vercel (serverless), the API route can't write to the filesystem directly. Instead, make the route:
- Fetch the latest server data from cpt-hedge.com
- Compare with the bundled servers.json (read from public/data/servers.json via fetch)
- Return a JSON diff/summary of what changed
- For now, the actual file update will need manual redeployment or a future GitHub Actions integration

Actually, for the cron route, just have it fetch the data and log what it finds. The static servers.json is the primary data source.

## SERVER DATA FORMAT (already at public/data/servers.json):
```json
[
  { "id": 3, "createdAt": "2023-06-21", "merged": false, "regions": ["AF","EU","JP","KR","ME","NA","OC","SA","TR"] },
  { "id": 4, "merged": true },
  ...
]
```

## REGION FLAG MAPPING for display:
AF → 🌍, EU → 🇪🇺, JP → 🇯🇵, KR → 🇰🇷, ME → 🌍, NA → 🇺🇸, OC → 🇦🇺, SA → 🌎, TR → 🇹🇷

## FILE STRUCTURE:
```
app/
  layout.tsx          — root layout with dark theme, Inter font
  page.tsx            — landing page
  evaluate/
    page.tsx          — multi-step form (client component)
  results/
    page.tsx          — results dashboard (client component)
  api/
    update-servers/
      route.ts        — cron endpoint
components/
  EvaluationWizard.tsx    — the multi-step form
  ResultsDashboard.tsx    — results display
  ServerSearch.tsx        — searchable server dropdown
  ValueChart.tsx          — Recharts line chart
  ValueBreakdown.tsx      — breakdown table
  ProgressBar.tsx         — step progress indicator
lib/
  storage.ts          — ALL localStorage operations (abstraction layer)
  valuation.ts         — valuation algorithm
  servers.ts           — server data loading and helpers
  types.ts             — TypeScript types
public/
  data/
    servers.json       — server data (already exists)
vercel.json            — cron config
tailwind.config.ts
```
