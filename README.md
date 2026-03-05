# ✈️ AeroGuardian AI

**AI-Powered Aircraft Maintenance Intelligence Platform**

AeroGuardian AI is a cutting-edge aircraft maintenance assistant that leverages RAG (Retrieval-Augmented Generation) technology to provide intelligent fault detection, real-time diagnostics, and predictive maintenance recommendations.

## 🚀 Features

- **RAG-Powered AI Assistant** — Chat with documents using AI to get instant maintenance guidance
- **Pre-Flight Health Check** — Run AI-assisted diagnostics with real-time fault detection
- **Aircraft Fleet Management** — Track and manage your entire fleet in one dashboard
- **Document Processing Pipeline** — Upload maintenance manuals with automatic text extraction, chunking, and embedding
- **Inspection Reports** — Comprehensive historical inspection data with status tracking
- **Google Sign-In** — Secure authentication powered by Firebase

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, TailwindCSS, Framer Motion
- **UI Components:** Radix UI, shadcn/ui
- **Charts:** Recharts
- **Authentication:** Firebase Auth (Google Sign-In)
- **Build Tool:** Vite
- **State Management:** React Context API

## 📦 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd aero-guardian-ai

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Fill in your Firebase config values

# Start the development server
npm run dev
```

### Environment Variables

Create a `.env` file in the root directory with your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

## 📁 Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── layout/       # Dashboard layout, sidebar
│   └── ui/           # shadcn/ui components
├── contexts/         # React context providers
├── data/             # Mock data and types
├── hooks/            # Custom React hooks
├── lib/              # Utility functions + Firebase config
└── pages/            # Application pages
```

## 🧑‍💻 Team

Built with ❤️ by the AeroGuardian AI Team

## 📄 License

This project is for educational/hackathon purposes.
