# System Context: iGaming Platform

> Vision Phase artifact — AI-SDLC demo project

## Целевая система (ЦС)

**iGaming Platform** — B2B2C multi-tenant SaaS для онлайн-казино.

### Уровень реализации
Hello-world / demo скаффолдинг для демонстрации AI-SDLC процесса.

### Ключевые подсистемы

| Подсистема | Ответственность |
|------------|----------------|
| **APIGateway** | Маршрутизация запросов, tenant routing, порт 3000 |
| **TenantService** | Регистрация и управление операторами (B2B), порт 3001 |
| **PlayerService** | Аккаунты игроков, баланс, сессии, порт 3002 |
| **GameService** | Каталог игр, запуск сессий (stub), порт 3003 |

### Ограничения hello-world уровня
- In-memory storage (нет персистентности)
- Stub интеграции с Game Providers и PSP
- Нет аутентификации (JWT — следующая фаза)
- Нет реального KYC/AML

---

## Надсистема (НС)

```
┌─────────────────────────────────────────────────────────────┐
│                    iGaming Ecosystem                        │
│                                                             │
│  [Regulator] ←── compliance                                 │
│       ↑                                                     │
│  [Operator/B2B] ──── registers tenant ───→ [iGaming Platform] │
│                                                    ↑        │
│  [Game Providers]  ──── game catalog ─────────────┘        │
│  (BGaming, Evolution)                              ↑        │
│                                                    │        │
│  [PSP/Payments] ──── payment processing ──────────┘        │
│                                                    ↑        │
│  [Player/B2C] ──── plays games, deposits ─────────┘        │
└─────────────────────────────────────────────────────────────┘
```

**Внешние системы (в demo — заглушки):**
- Game Providers: BGaming, Evolution Gaming, Pragmatic Play
- PSP: Stripe, local payment methods, crypto
- Regulator: KYC/AML провайдеры (Onfido, Sum&Substance)

---

## Система создания (СС)

| Компонент | Роль |
|-----------|------|
| **Developer** | Platform Owner, принимает архитектурные решения |
| **Claude Code** | AI-ассистент, генерирует код и артефакты |
| **AI-SDLC Plugin** | Процесс: Vision → Arch → TDD → Deploy |
| **VSCode** | IDE с Claude Code extension |
| **Node.js 20+** | Runtime |
| **Docker** | Контейнеризация для локального dev |

---

## DVS — Direct Value Stream

```
Operator регистрирует tenant
        ↓
Настраивает casino (games, limits)
        ↓
Player регистрируется на платформе
        ↓
Player пополняет баланс (deposit)
        ↓
Player запускает игровую сессию
        ↓
Фиксируется транзакция (win/loss)
        ↓
Player выводит средства (withdrawal)
```

## OVS — Operations Value Stream

```
Developer: /vision  → system-context.md + stakeholder-map.md
Developer: /arch    → ADR-001..ADR-N + Utility Tree
Developer: /tdd     → RED → GREEN → REFACTOR (jest)
Developer: /deploy  → docker-compose + CI/CD pipeline
```

---

## Технический стек

- **Runtime**: Node.js 20+ (LTS)
- **Language**: TypeScript 5+
- **Framework**: Express 4
- **Testing**: Jest + Supertest
- **Packaging**: npm workspaces (monorepo)
- **Containerization**: Docker + docker-compose
- **Architecture**: Microservices (loosely coupled, demo level)
