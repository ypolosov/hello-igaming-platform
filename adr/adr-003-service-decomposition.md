# ADR-003: Service Decomposition Strategy

> Architecture Phase artifact — AI-SDLC demo project
> Date: 2026-03-22 | Status: Accepted
> Driver: D2 — Testability (H/H), D3 — Extensibility (M/H)

## Context

Для demo iGaming Platform нужно выбрать архитектурный паттерн декомпозиции.
Платформа включает три чётких домена: управление тенантами, игроки, игры.
Выбор влияет на тестируемость, расширяемость и сложность разработки.

## Alternatives Considered

### A1: 4 Микросервиса (npm workspaces monorepo) ✅ Chosen

```
packages/
├── api-gateway/      # routing + tenant validation
├── tenant-service/   # bounded context: операторы
├── player-service/   # bounded context: игроки + баланс
└── game-service/     # bounded context: игры + сессии
```

**Pros:**
- Каждый сервис тестируется в полной изоляции (supertest без mock)
- Новый game provider затрагивает только `game-service`
- Демонстрирует реальную B2B2C multi-tenant архитектуру
- npm workspaces — shared tsconfig без code duplication

**Cons:**
- Больше boilerplate (4× package.json, tsconfig, Dockerfile)
- Межсервисная коммуникация через HTTP (добавляет latency)

### A2: Монолит с модулями

```
src/
├── modules/tenant/
├── modules/player/
└── modules/game/
```

**Pros:** Меньше файлов, проще для абсолютного новичка

**Cons:**
- Не показывает реальную iGaming архитектуру (все операторы в одном процессе)
- Tenant isolation сложнее — нет сетевой границы
- Не демонстрирует scaling возможности

### A3: Monolith-First + Split Later

**Pros:** YAGNI подход

**Cons:**
- Для demo мы ЗНАЕМ конечную архитектуру заранее
- Split later в demo контексте = никогда

## Decision

**Выбрана A1: 4 микросервиса в npm workspaces monorepo.**

Доменные границы (Bounded Contexts по DDD):
- **Tenant BC**: операторы, конфигурация, white-label
- **Player BC**: аккаунты, KYC, баланс, транзакции
- **Game BC**: каталог, провайдеры, сессии, RTP
- **Gateway**: cross-cutting concerns (routing, auth, rate limiting)

## Fitness Function

```bash
# Каждый сервис должен собираться независимо
cd packages/tenant-service && npm run build
cd packages/player-service && npm run build
cd packages/game-service   && npm run build
cd packages/api-gateway    && npm run build

# Каждый сервис тестируется независимо (без запуска других)
cd packages/tenant-service && npm test
cd packages/player-service && npm test
# ... все должны быть green без docker-compose up
```

## Rejected

- A2 (монолит): не демонстрирует реальную архитектуру, tenant isolation слабее
- A3 (monolith-first): anti-pattern для demo с известными требованиями
