# Roadmap: Smart Aquaponics Dashboard

**Milestone:** v1.0 — Enhanced Demo
**Created:** 2026-05-10
**Phases:** 4 | **Requirements:** 21 | **Coverage:** 100% ✓

---

## Milestone 1: v1.0 — Enhanced Demo

### Phase 1: Landing Page
**Goal:** Replace the minimal card landing page with a visually impressive full-screen hero page that sets the product's tone.
**Mode:** mvp
**Requirements:** LAND-01, LAND-02, LAND-03, LAND-04, LAND-05

**Success Criteria:**
1. Landing page fills the full viewport with an animated gradient/wave background
2. Three feature tiles are visible below the hero section
3. Stat counters animate from 0 to their target values on page load
4. "Open Dashboard" navigates to /dashboard (after Phase 2) or triggers page state
5. "Try AI Assistant" navigates to /ai or opens chatbot

**Plans:**
- `plan-01`: Build LandingPage component (hero, animated background, headline, CTAs)
- `plan-02`: Build FeatureTiles and AnimatedStats sub-components

---

### Phase 2: Routing & Navigation
**Goal:** Replace useState-based routing with react-router-dom URL routes, update sidebar and mobile nav to use Links, and configure Vercel SPA fallback.
**Mode:** mvp
**Requirements:** ROUT-01, ROUT-02, ROUT-03
**Depends on:** Phase 1

**Success Criteria:**
1. Navigating to /dashboard, /analytics, /controls, /alerts, /ai, /settings each render the correct page
2. Browser back/forward navigation works correctly
3. Refreshing the page on any route stays on that route (vercel.json configured)
4. Sidebar and mobile nav links are `<Link>` components, not onClick handlers

**Plans:**
- `plan-01`: Install react-router-dom, refactor App.tsx to use BrowserRouter + Routes
- `plan-02`: Update Sidebar and MobileNav to use NavLink, add vercel.json

---

### Phase 3: Page Separation & Avatar
**Goal:** Split the single dashboard page into 5 distinct route-based pages (Overview, Analytics, Controls, Alerts, Settings), fix the user avatar across sidebar and header, and move the AI chatbot to its own full page.
**Mode:** mvp
**Requirements:** PAGE-01, PAGE-02, PAGE-03, PAGE-04, PAGE-05, PAGE-06, AVTR-01, AVTR-02
**Depends on:** Phase 2

**Success Criteria:**
1. /dashboard shows only stat cards + system health + 2 most-recent alerts (not the full feed)
2. /analytics shows all 3 sensor charts with a time-range tab selector
3. /controls shows the full ControlPanel
4. /alerts shows the full AlertFeed
5. /ai is a full-page chat interface (sidebar panel no longer used)
6. "JD" gradient circle replaced by DiceBear bottts-neutral avatar in both sidebar and header
7. Sidebar and header show consistent avatar + "Demo User" name

**Plans:**
- `plan-01`: Create page components (OverviewPage, AnalyticsPage, ControlsPage, AlertsPage, SettingsPage)
- `plan-02`: Create AiPage (full-page chat, reuse AIChatbot logic without panel constraints)
- `plan-03`: Update Sidebar bottom section and App header with DiceBear avatar

---

### Phase 4: Live Groq Chatbot
**Goal:** Wire the AI chatbot to the Groq API (Llama 3.1 8B) via a Vercel serverless function, add aquaponics system prompt, handle errors gracefully, and clean up the 3 duplicate chatbot entry points to 2.
**Mode:** mvp
**Requirements:** CHAT-01, CHAT-02, CHAT-03, CHAT-04, CHAT-05, CHAT-06
**Depends on:** Phase 3

**Success Criteria:**
1. Sending a message in the chatbot returns a real AI response (not the hardcoded mock)
2. The AI response is contextually relevant to aquaponics (system prompt working)
3. GROQ_API_KEY is read from environment variable, never hardcoded
4. Header Bot button is removed — chatbot opens only from sidebar nav item or mobile FAB
5. On network error or API failure, user sees "Something went wrong — try again" (not a blank state or crash)
6. Local dev works with GROQ_API_KEY in .env.local

**Plans:**
- `plan-01`: Create api/chat.ts Vercel serverless function with Groq SDK
- `plan-02`: Update AIChatbot component to call /api/chat, handle loading/error states
- `plan-03`: Remove header Bot button, clean up chatbot open/close logic in App.tsx

---

## Completion Criteria

All 21 v1 requirements checked off in REQUIREMENTS.md.

| Phase | Status | Requirements | 
|-------|--------|--------------|
| 1: Landing Page | ○ Pending | LAND-01..05 |
| 2: Routing | ○ Pending | ROUT-01..03 |
| 3: Pages & Avatar | ○ Pending | PAGE-01..06, AVTR-01..02 |
| 4: Groq Chatbot | ○ Pending | CHAT-01..06 |

---
*Roadmap created: 2026-05-10*
