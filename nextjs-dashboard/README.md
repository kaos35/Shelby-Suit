# 🎨 Shelby Dashboard

[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://typescriptlang.org/)
[![Shadcn/UI](https://img.shields.io/badge/Shadcn%2FUI-latest-purple.svg)](https://ui.shadcn.com/)

Real-time monitoring dashboard for the Shelby Protocol ecosystem. Built with Next.js 14, Shadcn/UI, and TailwindCSS.

## ✨ Features

- 📊 **Real-time Statistics** - Upload counts, storage usage, network health
- 👥 **Account Management** - Create, view, and manage Shelby accounts
- 📤 **Upload Manager** - Upload files directly from the dashboard
- 📋 **Activity Feed** - Live system activity logs
- 🏥 **System Health** - Network and service health indicators
- 📈 **Upload Charts** - Visual upload trends via Recharts
- 🎨 **Premium UI** - Shadcn/UI components with dark/light mode

## 🚀 Quick Start

### Prerequisites

- Node.js v18+
- npm or yarn

### Installation

```bash
cd nextjs-dashboard
npm install
```

### Development

```bash
npm run dev
```

Visit: http://localhost:3000

### Production Build

```bash
npm run build
npm start
```

## 📁 Project Structure

```
nextjs-dashboard/
├── src/
│   ├── app/                    # App Router pages
│   │   ├── page.tsx            # Main dashboard
│   │   ├── accounts/page.tsx   # Account management
│   │   ├── uploads/page.tsx    # Upload/Blob management
│   │   ├── activity/page.tsx   # Activity logs
│   │   ├── settings/page.tsx   # Settings
│   │   ├── layout.tsx          # Root layout
│   │   └── api/                # API Routes
│   │       ├── stats/          # GET /api/stats
│   │       ├── account/        # GET/POST /api/account
│   │       ├── upload/         # POST /api/upload
│   │       ├── blob/           # GET /api/blob
│   │       ├── activity/       # GET/POST /api/activity
│   │       └── download/       # GET /api/download
│   ├── components/             # React components
│   │   ├── ui/                 # Shadcn/UI primitives
│   │   ├── Sidebar.tsx
│   │   ├── StatCard.tsx
│   │   ├── AccountCard.tsx
│   │   ├── AccountManager.tsx
│   │   ├── UploadChart.tsx
│   │   ├── UploadManager.tsx
│   │   ├── SystemHealth.tsx
│   │   ├── UploadsTable.tsx
│   │   └── ActivityFeed.tsx
│   ├── hooks/                  # Custom React hooks
│   │   ├── useShelby.ts
│   │   ├── useAccounts.ts
│   │   ├── useStats.ts
│   │   ├── useToast.ts
│   │   └── useLoading.ts
│   └── lib/                    # Utilities
│       ├── store.ts            # In-memory data store
│       └── utils.ts
├── tailwind.config.ts
├── next.config.ts
└── package.json
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stats` | System statistics |
| GET/POST | `/api/account` | Account CRUD |
| POST | `/api/upload` | File upload |
| GET | `/api/blob` | List blobs |
| GET | `/api/download` | Download file |
| GET/POST | `/api/activity` | Activity logs (also accepts external POST) |

### External Integration

The `/api/activity` endpoint accepts POST requests from external services (e.g., Expiry Guard):

```bash
curl -X POST http://localhost:3000/api/activity \
  -H "Content-Type: application/json" \
  -d '{"type": "system", "message": "Alert from Expiry Guard", "status": "error"}'
```

## 🎨 UI Components

Built with [Shadcn/UI](https://ui.shadcn.com/):
- Button, Input, Table, Card, Dialog, Toast, Select, Avatar
- Custom StatCard, AccountCard, UploadChart components
- Responsive sidebar navigation

## 🧪 Testing

```bash
# Unit tests (planned)
npm run test

# E2E with Playwright (planned)
npx playwright test
```

## 📝 Environment Variables

```env
# Optional - defaults work for local development
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 📄 License

MIT License - see [LICENSE](../LICENSE)
