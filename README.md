# 🚀 Shelby Ecosystem Suite

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Type: TypeScript](https://img.shields.io/badge/types-TypeScript-blue.svg)](https://www.typescriptlang.org/)
[![Python: 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/)

**The Ultimate Command Center for Decentralized Data & Media Orchestration.**

Shelby Ecosystem Suite is a professional-grade toolkit designed to bridge the gap between traditional data management and the decentralized future. Whether you are an enterprise looking for resilient storage or a creator building the next-generation media platform, Shelby provides the infrastructure, tools, and interface to lead the transition.

---

## 🌟 The 5 Pillars of Shelby

### 1. Unified Web3 Identity
Move beyond insecure passwords. Shelby utilizes **Wallet-Based Authentication (Aptos/Petra)** to give you absolute ownership over your data. Your identity is cryptographic, verified on-chain, and completely under your control.

### 2. Resilient Decentralized Storage
Upload once, preserve forever. By distributing data across the Shelby Protocol, your files are immune to single-point-of-failure risks. 
- **Integrity Verified:** Every blob is hashed and verified on-chain.
- **High Availability:** Data is distributed across a robust network of providers.

### 3. Next-Gen Media Orchestration
Shelby isn't just about storage; it's about consumption. 
- **Native Streaming:** Optimized HLS/DASH playback directly from the network.
- **Transcoding Tools:** Professional-grade media preparation for global delivery across any device.

### 4. Enterprise-Grade Infrastructure
Connect your existing stack to the decentralized web.
- **S3 Compatibility:** A dedicated Gateway that lets legacy applications interact with Shelby as if it were Amazon S3.
- **Edge Acceleration:** Integration with **Cavalier Nodes** for sub-100ms read latency at edge locations.

### 5. Real-Time Ecosystem Intelligence
Never fly blind. The Monitor Dashboard provides high-fidelity visibility into your nodes, storage health, and network performance through interactive charts and live activity feeds.

---

## 📦 Component Overview

- 🎨 **Monitor Dashboard** - A premium Next.js 14 management interface with Shadcn/UI.
- 🐍 **Python SDK** - High-performance async library for programmatic integration.
- ⚡ **Batch Upload Manager** - Reliable Node.js job queue for high-volume data migration.
- ⏰ **Expiry Guard** - Automated lifecycle monitoring and proactive renewal service.

---

## 🚀 Quick Start (One-Click Demo)

The fastest path to exploring the Shelby ecosystem is our native democratic launcher:

```powershell
./start-demo.ps1
```

Access points:
- **Dashboard**: [http://localhost:3000](http://localhost:3000)
- **API Reference**: [http://localhost:3000/api](http://localhost:3000/api)

---

### Manual Installation

#### Prerequisites

- Node.js v20+
- Python 3.11+
- Docker & Docker Compose (Recommended)

#### Setup

```bash
git clone https://github.com/shelby-ecosystem/shelby-ecosystem-suite.git
cd shelby-ecosystem-suite
docker-compose up -d --build
```

---

## 📋 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                           USER / CLIENT                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│        ┌──────────────────────────────────────────┐             │
│        │      MONITOR DASHBOARD (Next.js 14)      │             │
│        └──────────────────────────────────────────┘             │
│                                                                 │
│                 ┌─────────────────────┐                         │
│                 │      PYTHON SDK     │                         │
│                 └─────────────────────┘                         │
│                                                                 │
│        ┌─────────────────────┐  ┌─────────────────────┐         │
│        │  NODE.JS BATCH      │  │ PYTHON EXPIRY       │         │
│        │  MANAGER            │  │ GUARD               │         │
│        └─────────────────────┘  └─────────────────────┘         │
│                                                                 │
│        ┌──────────────────────────────────────────────┐         │
│        │          SHELBY PROTOCOL RPC API             │         │
│        └──────────────────────────────────────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📝 Development & Contribution

Shelby is built for developers. See the individual package directories for deep-dive technical documentation:

- `/nextjs-dashboard` - Frontend & API Implementation
- `/python-sdk` - Async Python Client
- `/batch-manager` - High-throughput Workers
- `/expiry-guard` - Lifecycle Automation

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 🌟 Support

- [Shelby Protocol Official Site](https://shelby.xyz)
- [Documentation](https://docs.shelby.xyz)
- [GitHub Issues](https://github.com/shelby-ecosystem/shelby-ecosystem-suite/issues)

Developed with ❤️ by the Shelby Community.
