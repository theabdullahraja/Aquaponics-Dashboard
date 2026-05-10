# Requirements: Smart Aquaponics Dashboard

**Defined:** 2026-05-10
**Core Value:** Operator sees system health at a glance and gets AI-assisted guidance from one clean interface.

## v1 Requirements

### Landing Page

- [ ] **LAND-01**: User sees a full-screen animated hero with gradient/wave background
- [ ] **LAND-02**: User sees headline, sub-headline, and 3 feature tiles on the landing page
- [ ] **LAND-03**: User sees animated stat counters (uptime, sensors, alerts resolved) that count up on load
- [ ] **LAND-04**: User can navigate to the dashboard via "Open Dashboard" CTA
- [ ] **LAND-05**: User can navigate directly to the AI Assistant via "Try AI Assistant" CTA

### Routing

- [ ] **ROUT-01**: App uses react-router-dom with URL-based routes (/dashboard, /analytics, /controls, /alerts, /ai, /settings)
- [ ] **ROUT-02**: Vercel SPA fallback configured so direct URL access works (vercel.json)
- [ ] **ROUT-03**: Sidebar and mobile nav links update the URL (not just component state)

### Pages

- [ ] **PAGE-01**: /dashboard shows Overview — stat cards + system health ring + compact recent alerts (max 2)
- [ ] **PAGE-02**: /analytics shows the 3 sensor charts (pH, temperature, flow rate) with a time-range selector UI
- [ ] **PAGE-03**: /controls shows the full actuator control panel
- [ ] **PAGE-04**: /alerts shows the full alert feed with all alerts and dismiss functionality
- [ ] **PAGE-05**: /ai shows AI Assistant as a full-page chat interface (not a side panel)
- [ ] **PAGE-06**: /settings shows a settings placeholder page

### Avatar

- [ ] **AVTR-01**: User avatar uses DiceBear bottts-neutral SVG (seed="AquaFarm") instead of "JD" initials in sidebar
- [ ] **AVTR-02**: Same DiceBear avatar used in dashboard header (replaces gradient circle with "JD")

### Chatbot

- [ ] **CHAT-01**: Chatbot sends user messages to Groq API (Llama 3.1 8B) via Vercel serverless function at /api/chat
- [ ] **CHAT-02**: System prompt scopes AI to aquaponics domain (pH, temperature, fish care, plant health)
- [ ] **CHAT-03**: GROQ_API_KEY stored as Vercel environment variable (not hardcoded)
- [ ] **CHAT-04**: Chatbot entry points reduced to 2: sidebar "AI Assistant" nav (desktop) and mobile FAB
- [ ] **CHAT-05**: Header Bot button removed (duplicate entry point eliminated)
- [ ] **CHAT-06**: On API error, chatbot shows a user-friendly fallback message

## v2 Requirements

### Chatbot Enhancements

- **CHAT-V2-01**: Streaming responses (SSE) for more responsive feel
- **CHAT-V2-02**: Conversation history persisted in localStorage across sessions
- **CHAT-V2-03**: Voice input via Web Speech API

### Analytics Enhancements

- **ANLX-V2-01**: Real date range picker (calendar widget) for chart data
- **ANLX-V2-02**: Nutrient level (DO, EC) sensor charts added

### User Profile

- **PROF-V2-01**: Settings page lets user change display name (stored in localStorage)
- **PROF-V2-02**: Settings page lets user choose avatar seed/style

## Out of Scope

| Feature | Reason |
|---------|--------|
| Real IoT sensor data | Demo only — hardware integration not part of this milestone |
| User authentication | No multi-user support needed for demo |
| Database / backend | Vercel serverless + Groq is the only backend needed |
| Mobile native app | Web responsive only |
| Dark/light theme toggle | Theme is already dark — good for an IoT dashboard |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| LAND-01 to LAND-05 | Phase 1 | Pending |
| ROUT-01 to ROUT-03 | Phase 2 | Pending |
| PAGE-01 to PAGE-06 | Phase 3 | Pending |
| AVTR-01 to AVTR-02 | Phase 3 | Pending |
| CHAT-01 to CHAT-06 | Phase 4 | Pending |

**Coverage:**
- v1 requirements: 21 total
- Mapped to phases: 21
- Unmapped: 0 ✓

---
*Requirements defined: 2026-05-10*
*Last updated: 2026-05-10 after initialization*
