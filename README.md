# Finboard — Real-Time Finance Dashboard

Finboard is a modular, real-time finance dashboard built using Next.js (App Router).
It allows users to dynamically create, configure, persist, and visualize financial
data widgets powered by live external APIs.

This project demonstrates modern frontend + full-stack engineering practices,
including API abstraction, dynamic UI rendering, state persistence, and
production-ready deployment on Vercel.

---

## FEATURES

1. Dynamic Widget System

---

- Users can add widgets at runtime
- Each widget represents a live financial data source
- Widgets are fully configurable:
  - API provider (Finnhub / Alpha Vantage)
  - Stock symbol
  - Refresh interval
  - Display mode (Card / Table / Chart)
  - Selected data fields from API response

2. Multi-API Integration

---

Finboard integrates multiple finance APIs through secure server-side routes.

- Finnhub API

  - Real-time stock quotes
  - Market prices

- Alpha Vantage API
  - Global stock quotes
  - Fundamental metrics

API keys are never exposed to the client.
All requests are routed through Next.js API routes.

3. JSON Field Explorer (Dynamic Mapping)

---

- Raw API response is shown when testing a symbol
- User can visually explore the JSON structure
- Any field can be selected and mapped to a widget
- No hardcoded API schema required
- Makes the dashboard API-agnostic and extensible

4. Multiple Display Modes

---

Each widget supports three modes:

- Card View
  Compact summary of key metrics

- Table View
  Full data table with:

  - Search
  - Pagination
  - Label formatting

- Chart View
  Designed for historical or time-series data

5. Drag and Drop Dashboard

---

- Widgets can be reordered using drag-and-drop
- Powered by @dnd-kit
- Order is persisted automatically

6. Persistent State

---

- Widget configuration is stored using Zustand
- LocalStorage persistence enabled
- Dashboard state survives page reloads

7. Import / Export Dashboard

---

- Export entire dashboard configuration as JSON
- Import configuration on another device
- Enables easy sharing and portability

8. Production Deployment

---

- Deployed on Vercel
- Static UI + Serverless API routes
- Environment variables securely managed

---

## TECH STACK

Frontend:

- Next.js 16 (App Router)
- React 18
- TypeScript
- Tailwind CSS

State Management:

- Zustand
- Zustand persist middleware

APIs:

- Finnhub
- Alpha Vantage

Drag & Drop:

- @dnd-kit/core
- @dnd-kit/sortable

Deployment:

- Vercel
- Serverless Functions
- GitHub CI/CD

---

## ARCHITECTURE OVERVIEW

Client Side:

- Widgets rendered dynamically
- Data fetched through internal API routes
- UI adapts based on selected fields

Server Side:

- /api/finnhub
- /api/alphavantage
- Acts as secure proxy for external APIs

Data Flow:
User Input
→ Widget Configuration
→ Next.js API Route
→ External Finance API
→ JSON Response
→ Widget Renderer

---

## PROJECT STRUCTURE

src/
├── app/
│ ├── api/
│ │ ├── finnhub/
│ │ └── alphavantage/
│ ├── layout.tsx
│ ├── page.tsx
│ └── globals.css
│
├── components/
│ ├── dashboard/
│ │ ├── Widget.tsx
│ │ ├── AddWidgetForm.tsx
│ │ └── JsonExplorer.tsx
│ └── widgets/
│ └── StockChart.tsx
│
├── hooks/
│ └── useFetchWidgetData.ts
│
├── store/
│ └── useWidgetStore.ts
│
├── utils/
│ └── formatters.ts
│
└── types/
└── index.ts

---

## ENVIRONMENT VARIABLES

Create a .env.local file:

FINNHUB_API_KEY=your_finnhub_key
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key

These variables are also configured in Vercel
(Project Settings → Environment Variables).

---

## RUNNING LOCALLY

npm install
npm run dev

Open:
http://localhost:3000

---

## PRODUCTION BUILD

npm run build

Build performs:

- TypeScript validation
- Static optimization
- API route validation

---

## DEPLOYMENT (VERCEL)

Steps:

1. Push project to GitHub
2. Import repository into Vercel
3. Add environment variables
4. Deploy

Vercel provides:

- Automatic CI/CD
- Serverless API execution
- Static optimization

---

## ERROR HANDLING

- API error handling with user feedback
- Rate limit detection
- Loading and fallback states
- Production-safe TypeScript checks

---

## FUTURE IMPROVEMENTS

- Historical candle charts
- Authentication
- Cloud-synced dashboards
- Additional API providers
- Widget presets and templates

---

## WHAT THIS PROJECT DEMONSTRATES

- Real-world Next.js App Router usage
- Secure API proxying
- Dynamic schema-less UI
- Persistent state management
- Production deployment practices

---

## AUTHOR

Sailesh Kumar Panda
B.Tech Undergraduate
IIIT Allahabad
