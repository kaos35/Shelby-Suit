# ⚡ Shelby Batch Upload Manager

[![Node.js](https://img.shields.io/badge/Node.js-22+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://typescriptlang.org/)
[![Jest](https://img.shields.io/badge/Tests-Jest-red.svg)](https://jestjs.io/)

High-performance batch upload manager for the Shelby Protocol. Features persistent job queues (SQLite), multiple account selection strategies, and a CLI interface.

## ✨ Features

- 📦 **Persistent Job Queue** - SQLite-backed queue survives restarts
- 🔄 **Resume Support** - Recover interrupted uploads automatically
- 🎯 **Selection Strategies** - Round-Robin, Least-Loaded, Token-Aware, Weighted Random
- 👷 **Worker Pool** - Configurable concurrency with parallel processing
- ⏰ **Scheduler** - Cron-based job scheduling via `node-cron`
- 🖥️ **CLI Interface** - Full command-line control (start, upload, status, resume)
- 📊 **Real-time Status** - Track pending, processing, completed, and failed jobs

## 🚀 Quick Start

### Prerequisites

- Node.js v18+
- npm

### Installation

```bash
cd batch-manager
npm install
```

### CLI Usage

```bash
# Start the batch manager daemon
npx tsx src/cli/index.ts start -c ./config/accounts.yaml -s round-robin

# Queue files for upload (and start processing)
npx tsx src/cli/index.ts upload file1.txt file2.txt file3.txt

# Queue files without processing
npx tsx src/cli/index.ts upload file1.txt --no-start

# Check queue status
npx tsx src/cli/index.ts status

# Resume interrupted jobs
npx tsx src/cli/index.ts resume -c ./config/accounts.yaml
```

## 📁 Project Structure

```
batch-manager/
├── src/
│   ├── cli/
│   │   └── index.ts            # CLI commands (start, upload, status, resume)
│   ├── config/
│   │   └── index.ts            # YAML config loader
│   ├── db/
│   │   └── index.ts            # SQLite database layer (better-sqlite3)
│   ├── scheduler/
│   │   └── index.ts            # Cron job scheduler
│   ├── strategies/
│   │   ├── round-robin.ts      # Round-robin account selection
│   │   ├── least-loaded.ts     # Least-loaded selection
│   │   ├── token-aware.ts      # Highest balance selection
│   │   └── weighted-random.ts  # Weighted random selection
│   ├── worker/
│   │   ├── job.ts              # Job type definitions
│   │   ├── pool.ts             # Worker pool with concurrency
│   │   └── queue.ts            # Persistent job queue
│   └── manager.ts              # Main BatchManager orchestrator
├── tests/
│   ├── __mocks__/
│   │   └── uuid.js             # UUID mock for Jest
│   ├── manager.test.ts         # BatchManager tests
│   ├── queue.test.ts           # JobQueue tests
│   └── strategies.test.ts      # Strategy tests (10 tests)
├── config/
│   └── accounts.yaml           # Sample account config
├── jest.config.js
├── tsconfig.json
└── package.json
```

## 🎯 Selection Strategies

| Strategy | Description | Best For |
|----------|-------------|----------|
| **Round-Robin** | Cycles through accounts sequentially | Even distribution |
| **Least-Loaded** | Picks account with fewest active jobs | Load balancing |
| **Token-Aware** | Picks account with highest token balance | Cost optimization |
| **Weighted Random** | Random selection weighted by config | Custom distribution |

### Configuration

Create `config/accounts.yaml`:

```yaml
accounts:
  - id: "acc-1"
    name: "Primary Account"
    address: "0x1234..."
    privateKey: "0xabcd..."
    weight: 3
    balance: "1000000000000000000"
  - id: "acc-2"
    name: "Secondary Account"
    address: "0x5678..."
    privateKey: "0xefgh..."
    weight: 1
    balance: "500000000000000000"

global_limits:
  max_parallel_uploads: 5
  max_retries: 3
```

## 💾 Persistence

Jobs are stored in a local SQLite database (`batch-manager.db`):

```
┌────────────────────────────────────────────────┐
│                    jobs TABLE                   │
├──────────┬──────────┬──────────┬───────────────┤
│ id       │ type     │ status   │ payload       │
│ TEXT PK  │ TEXT     │ TEXT     │ JSON TEXT     │
├──────────┼──────────┼──────────┼───────────────┤
│ retries  │ maxRetries│ result  │ error         │
│ INT      │ INT      │ JSON    │ TEXT          │
├──────────┼──────────┼──────────┼───────────────┤
│ createdAt│ updatedAt│          │               │
│ INT (ms) │ INT (ms) │          │               │
└──────────┴──────────┴──────────┴───────────────┘
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with verbose output
npx jest --verbose

# Run specific test file
npx jest tests/strategies.test.ts
```

**Test Coverage:** 14 tests across 3 suites (Manager, Queue, Strategies)

## 📝 Environment Variables

```env
# No required env vars - all config via YAML
# Optional:
NODE_ENV=development
```

## 📄 License

MIT License - see [LICENSE](../LICENSE)
