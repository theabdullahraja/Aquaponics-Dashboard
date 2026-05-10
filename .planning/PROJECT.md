# Smart Aquaponics Dashboard

## What This Is

A React + TypeScript frontend dashboard for an IoT aquaponics system. It monitors water quality sensors (pH, temperature, flow rate, water level), controls actuators (pumps), displays system alerts, and provides an AI assistant for aquaponics guidance. Built as a demo project, hosted on Vercel, using only free/open-source tools.

## Core Value

An operator can open the dashboard, immediately see their system's health at a glance, and get AI-assisted guidance — all from a single clean, well-organized interface.

## Requirements

### Validated

- ✓ Hero stats cards (pH, temperature, water flow, water level) — existing
- ✓ Real-time sensor charts (pH history, temperature curve, flow rate) — existing
- ✓ System health ring gauge — existing
- ✓ Actuator control panel (water pump, air pump, quick actions) — existing
- ✓ Alert feed with severity levels and dismiss — existing
- ✓ Sidebar navigation (desktop) + mobile bottom nav — existing
- ✓ AI chatbot panel (UI only, mock response) — existing

### Active

- [ ] Redesigned landing page — animated hero, feature tiles, stat counters
- [ ] React Router — replace useState-based routing with proper URL routes
- [ ] Separate pages — Overview, Analytics, Controls, Alerts, AI Assistant (each a distinct route)
- [ ] User avatar — replace "JD" initials with DiceBear SVG avatar
- [ ] Live AI chatbot — wire up Groq API (Llama 3.1) via Vercel serverless function
- [ ] Clean chatbot entry — consolidate 3 chatbot open triggers to 2 (sidebar nav + mobile FAB)

### Out of Scope

- Real IoT backend / live sensor data — demo only, all data stays mocked
- User authentication — no login system needed for a demo
- Database / persistence — no backend storage
- Mobile native app — web only

## Context

- **Stack:** React 18, TypeScript, Vite, Tailwind CSS (custom tokens: aqua-blue, green-growth, warm-amber, danger-red, surface-dark, border-subtle), shadcn/ui, Recharts, Lucide icons, pnpm
- **Design tokens** are defined in `src/styles/theme.css` — all accent colors use CSS variables
- **Chatbot** currently uses a `setTimeout` mock. Plan: Groq API (free tier, 14,400 req/day) with Llama 3.1 via a Vercel serverless function at `api/chat.ts`
- **Avatar:** DiceBear `bottts-neutral` style via their free SVG API (no install needed, just `<img src>`)
- **Routing:** Will add `react-router-dom` — no backend routing needed, Vercel handles SPA fallback via `vercel.json`

## Constraints

- **Hosting:** Vercel — serverless functions for API routes, no long-running processes
- **Cost:** Zero — free tiers only (Groq free tier, DiceBear free API, Vercel hobby)
- **Chatbot model:** Open-source only (Llama 3.1 via Groq)
- **Data:** All sensor readings remain mocked/static — no real hardware integration

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Groq API for chatbot | Free tier (14,400 req/day), fast LPU inference, Llama 3.1 (open-source), Vercel-friendly | — Pending |
| DiceBear for avatar | Zero setup — works as `<img src>`, free, techy aesthetic fits IoT product | — Pending |
| react-router-dom | Proper URL routing enables clean page separation; needed before splitting pages | — Pending |
| AI chatbot as full page | Removes overlay/panel conflicts, gives chat room to breathe | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition:**
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

---
*Last updated: 2026-05-10 after initialization*
