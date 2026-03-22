# ADR-001: Utility Tree

> Architecture Phase artifact — AI-SDLC demo project
> Date: 2026-03-22 | Status: Accepted

## Business Goal

Предоставить B2B операторам (казино-брендам) готовую платформу для запуска онлайн-казино,
с изоляцией данных между тенантами и возможностью подключения игровых провайдеров.

---

## Utility Tree

```
Utility
├── Security
│   └── Tenant Isolation                                        [H/H] ← DRIVER
│       Scenario: запрос Operator-A никогда не читает/записывает
│       данные Operator-B, даже при общей инфраструктуре.
│       Метрика: 0 cross-tenant data leaks в тестах и ревью.
│
├── Testability                                                 [H/H] ← DRIVER
│   └── Service Isolation
│       Scenario: каждый микросервис тестируется unit/integration
│       без реального DB, без запущенных соседних сервисов.
│       Метрика: npm test завершается за < 10s, все тесты green.
│
├── Extensibility                                               [M/H]
│   └── Game Provider Integration
│       Scenario: добавление нового game provider (stub → real API)
│       без изменения TenantService или PlayerService.
│       Метрика: только GameService затронут при добавлении провайдера.
│
├── Deployability                                               [M/L]
│   └── Local Environment Setup
│       Scenario: новый разработчик запускает полную платформу
│       командой docker-compose up за < 60 секунд.
│       Метрика: время от git clone до working platform < 5 min.
│
└── Observability                                               [L/L]
    └── Health Checks
        Scenario: каждый сервис отвечает на GET /health
        с service name, status, version.
        Метрика: /health возвращает 200 за < 50ms.
```

**Приоритет**: H = High importance, M = Medium, L = Low
**Сложность**: H = High difficulty, L = Low

---

## Architectural Drivers

Drivers — это QA scenarios с приоритетом H/H (высокая важность × высокая сложность):

| # | Driver | QA Category | ADR |
|---|--------|-------------|-----|
| D1 | Tenant Isolation | Security | [ADR-002](adr-002-multi-tenant-routing.md) |
| D2 | Service Isolation (Testability) | Testability | [ADR-003](adr-003-service-decomposition.md) |

Вторичные drivers (M/H — требуют архитектурного внимания):
| # | Driver | QA Category | ADR |
|---|--------|-------------|-----|
| D3 | Storage choice (demo tradeoff) | Deployability | [ADR-004](adr-004-storage-strategy.md) |

---

## C4 Context Diagram (текстовый, pet level)

```
┌──────────────────────────────────────────────────────────────┐
│                    [iGaming Platform]                        │
│                                                              │
│  ┌────────────┐    X-Tenant-Id    ┌──────────────────────┐  │
│  │ API Gateway│ ────────────────→ │  Tenant Service      │  │
│  │  :3000     │                   │  :3001               │  │
│  └─────┬──────┘                   └──────────────────────┘  │
│        │                                                     │
│        ├──────────────────────── ┌──────────────────────┐   │
│        │                         │  Player Service      │   │
│        │                         │  :3002               │   │
│        │                         └──────────────────────┘   │
│        │                                                     │
│        └──────────────────────── ┌──────────────────────┐   │
│                                  │  Game Service        │   │
│                                  │  :3003               │   │
│                                  └──────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
         ↑                  ↑                    ↑
   [Operator/B2B]      [Player/B2C]     [Game Providers]
   X-Tenant-Id         via Gateway         (stub/mock)
```

---

## Coverage

- [x] D1: Tenant Isolation → ADR-002
- [x] D2: Testability → ADR-003
- [x] D3: Storage → ADR-004
- [ ] D4: JWT Auth → out of scope (следующая фаза)
