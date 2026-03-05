

# AeroGuardian AI – Implementation Plan

## Overview
A visually stunning hackathon prototype for an AI-powered aircraft maintenance assistant. Uses mock data and simulated AI responses — no backend setup required. Dark navy/cyan/blue aerospace theme with smooth animations throughout.

## Design & Theme
- **Color palette**: Dark navy background, cyan/blue accents, white text, glowing effects
- **Style**: Futuristic aerospace dashboard with glassmorphism cards, subtle grid/particle background effects
- **Animations**: Framer Motion for page transitions, card entrances, hover effects, typing indicators, and loading states

## Pages & Features

### 1. Login Page
- Full-screen aviation-themed background with animated airplane graphic
- "AeroGuardian AI" branding with subtitle
- Glowing "Sign in with Google" button (simulated — sets user in local state)
- Smooth transition to dashboard on login

### 2. Dashboard (Home)
- Sidebar navigation with icons for all sections + logout
- Animated stat cards: Total Aircraft, Documents Uploaded, Recent Inspections, System Status
- Recharts-powered animated charts: Aircraft Health Status (bar), Inspection Activity (line)
- Welcome message with user avatar

### 3. Aircraft Management
- List of aircraft as animated cards (Boeing 737, Airbus A320, ATR 72 pre-loaded)
- "Add Aircraft" button → modal form (model, manufacturer, engine type, year)
- Click card → detail view with specs and associated documents

### 4. Document Upload
- Drag-and-drop upload zone with animated progress bar
- Simulated text extraction, chunking, and embedding pipeline (visual step indicator)
- Uploaded documents list showing filename, date, associated aircraft
- Supports PDF, Excel, CSV, TXT, DOCX labels

### 5. Pre-Flight Check (Main Feature)
- Inspection form: Aircraft dropdown, Engine Pressure, Engine Temperature, Vibration Level, Hydraulic Pressure, Fuel Flow Status
- "Run Aircraft Health Check" glowing button
- Animated result panel with color-coded status (GREEN/YELLOW/RED)
- Detected issues, possible causes, and recommended actions
- Mock RAG analysis with source citations

### 6. AI Maintenance Assistant (Chat)
- Chat interface with message bubbles, typing animation, loading spinner
- Pre-programmed intelligent responses to common maintenance questions
- Source citations shown below AI responses
- Smooth message entrance animations

### 7. Reports
- Table/list of past inspection reports
- Each report: aircraft, values, issues, recommendations, timestamp
- Mock historical data pre-populated

## Technical Approach
- **Framer Motion** for all animations (will be installed)
- **React Router** for navigation with animated page transitions
- **Local state** (React Context) for auth and data — no backend needed
- **Recharts** for dashboard charts
- **Mock RAG pipeline** with visual simulation steps
- Clean component structure organized by feature

