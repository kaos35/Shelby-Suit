# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2026-02-13

### Added
- **Batch Manager**: Persistent job queue with SQLite (`better-sqlite3`).
- **Batch Manager**: New `status` and `resume` CLI commands.
- **Batch Manager**: Account selection strategies (Round-Robin, Least-Loaded, Token-Aware, Weighted Random).
- **Expiry Guard**: Dashboard integration via HTTP POST alerts.
- **Expiry Guard**: Automatic renewal service for expiring blobs.
- **Dashboard**: System health indicators and activity feed.
- **Dashboard**: POST API for external activity logging.
- **Testing**: Comprehensive unit test suites for all modules:
  - Batch Manager (14 tests)
  - Expiry Guard (9 tests)
  - Dashboard (24 tests)
- **CI/CD**: GitHub Actions pipeline for automated testing and Docker builds.
- **Deployment**: Dockerfiles for all services and `docker-compose.yml` orchestration.
- **Deployment**: Nginx reverse proxy configuration.

### Fixed
- ESM module transformation issues in Jest for `uuid`.
- Python dataclass mutable default error in `Config`.
- Next.js hydration issues in dashboard components.

### Security
- Dependency audit performed (0 vulnerabilities).
- Dependabot configured for automated updates.

---
[1.0.0]: https://github.com/KULLANICI/shelby-ecosystem-suite/releases/tag/v1.0.0
