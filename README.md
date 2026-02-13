# 🚀 Shelby Ecosystem Suite

[![CI/CD Pipeline](https://github.com/kaos35/Shelby-Suit/actions/workflows/ci.yml/badge.svg)](https://github.com/kaos35/Shelby-Suit/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Type: TypeScript](https://img.shields.io/badge/types-TypeScript-blue.svg)](https://www.typescriptlang.org/)
[![Python: 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/)

**The Ultimate Command Center for Decentralized Data & Media Orchestration.**

Shelby Ecosystem Suite is a professional-grade toolkit designed to bridge the gap between traditional data management and the decentralized future. Whether you are an enterprise looking for resilient storage or a creator building the next-generation media platform, Shelby provides the infrastructure, tools, and interface to lead the transition.

## 🏗️ The 5 Pillars of Shelby Ecosystem

Shelby isn't just a set of tools; it's a comprehensive layer for the **Shelby Protocol** that empowers developers and node operators.

### 1. Unified Web3 Identity
Eliminate friction with **Wallet-Based Authentication (Aptos/Petra)**. Shelby provides a bridge between cryptographic identity and application-level authorization, giving users true data ownership.

### 2. Resilient Data Orchestration
Upload once, persist infinitely. By leveraging the Shelby Protocol, files are distributed across a decentralized network with built-in:
- **Cryptographic Integrity:** Automatic on-chain verification of every blob.
- **High Availability:** Peer-to-peer distribution ensuring zero downtime.

### 3. Professional Media Workflows
Go beyond simple storage with built-in media preparation:
- **Adaptive Streaming:** Native support for HLS/DASH playback.
- **Edge Transcoding:** High-performance tools to prepare media for global delivery.

### 4. Enterprise-Ready Infrastructure
Bridge the gap between legacy and decentralized systems:
- **S3-Compatible Gateway:** Let your existing apps talk to Shelby using standard S3 APIs.
- **Edge Acceleration:** Sub-100ms latency via strategic **Cavalier Node** integration.

### 5. Observability & Live Intelligence
Operations at scale require visibility. The **Monitor Dashboard** delivers real-time metrics, node health tracking, and deep insights into network activity.

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
git clone https://github.com/kaos35/Shelby-Suit.git shelby-ecosystem-suite
cd shelby-ecosystem-suite
docker-compose up -d --build
```

### 🧪 Running Tests

Each component includes a comprehensive test suite.

#### Python Components
```bash
# Python SDK
cd python-sdk
pip install -r requirements.txt
pip install -e .
pytest

# Expiry Guard
cd ../expiry-guard
pip install -r requirements.txt
pytest
```

#### Node.js Components
```bash
# Dashboard
cd ../nextjs-dashboard
npm install --legacy-peer-deps
npm test

# Batch Manager
cd ../batch-manager
npm install
npm test
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
- [GitHub Issues](https://github.com/kaos35/Shelby-Suit/issues)

Developed with ❤️ by the Shelby Community.
