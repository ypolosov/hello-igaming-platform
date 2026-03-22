# iGaming Platform

> B2B2C multi-tenant casino — AI-SDLC demo project
> Built with Claude Code + [AI-SDLC plugin](https://github.com/your-org/ai-sdlc-plugin)

## AI-SDLC Process

This project was built end-to-end using the AI-SDLC methodology:

```
/vision  → system-context.md + stakeholder-map.md
/arch    → adr/adr-001..004 (Utility Tree + ADRs)
/tdd     → RED → GREEN → REFACTOR (24 tests)
/ff      → Fitness functions as pre-commit gates
/deploy  → CI/CD pipeline + docker-compose
```

## Architecture

```
                    ┌─────────────────┐
 Operator (B2B) ──→ │   API Gateway   │ :3000
                    │  X-Tenant-Id    │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              ↓              ↓              ↓
     ┌────────────────┐  ┌──────────┐  ┌──────────┐
     │ TenantService  │  │ Player   │  │  Game    │
     │     :3001      │  │ Service  │  │ Service  │
     │  CRUD tenants  │  │  :3002   │  │  :3003   │
     └────────────────┘  └──────────┘  └──────────┘
```

**Key decisions (see [adr/](adr/)):**
- `X-Tenant-Id` header for tenant routing (ADR-002)
- 4 microservices by bounded context (ADR-003)
- In-memory storage — conscious demo tradeoff (ADR-004)

## Quick Start

```bash
# Prerequisites: Node.js 20+, Docker

git clone <repo>
cd hello-igaming-platform

make install   # npm install
make build     # tsc compilation
make test      # 24 unit tests
make fitness   # ADR quality gates
make up        # docker-compose up --build -d
```

### Verify

```bash
curl http://localhost:3000/health
# {"service":"api-gateway","status":"ok","version":"0.1.0",...}

curl http://localhost:3001/health
# {"service":"tenant-service","status":"ok"}

# Tenant isolation in action:
curl http://localhost:3000/api/players
# {"error":"X-Tenant-Id header is required"}  ← ADR-002 enforced

curl http://localhost:3000/api/players -H "X-Tenant-Id: operator-royal"
# []  ← scoped to operator-royal tenant
```

## Development

```bash
make test      # unit tests (all services)
make fitness   # ADR fitness gates
make up        # start all services
make logs      # follow container logs
make down      # stop all services
```

## CI/CD

GitHub Actions pipeline (`.github/workflows/ci.yml`):

```
push/PR → fitness-gates → unit-tests → build-images
                ↑                ↑
          ADR-002 + ADR-004   24 jest tests
          (blocks on violation)
```

## Project Structure

```
hello-igaming-platform/
├── adr/                    # Architecture Decision Records
│   ├── adr-001-utility-tree.md
│   ├── adr-002-multi-tenant-routing.md
│   ├── adr-003-service-decomposition.md
│   └── adr-004-storage-strategy.md
├── packages/
│   ├── api-gateway/        # :3000 — routing + tenant validation
│   ├── tenant-service/     # :3001 — operator CRUD
│   ├── player-service/     # :3002 — player accounts + balance
│   └── game-service/       # :3003 — game catalog + sessions
├── tests/fitness/          # ADR fitness functions (pre-commit gates)
├── system-context.md       # Vision: system + supersystem + DVS/OVS
├── stakeholder-map.md      # Vision: stakeholders + human-in-loop matrix
├── docker-compose.yml
└── Makefile
```

## Stack

- **Runtime**: Node.js 20+ / TypeScript 5+
- **Framework**: Express 4
- **Testing**: Jest + Supertest
- **Packaging**: npm workspaces (monorepo)
- **Containerization**: Docker + docker-compose
- **CI**: GitHub Actions
