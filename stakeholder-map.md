# Stakeholder Map: iGaming Platform

> Vision Phase artifact — AI-SDLC demo project

## Стейкхолдеры и их concerns

| Роль | Тип | Concerns | Human in Loop |
|------|-----|----------|---------------|
| **Platform Owner** (Developer) | Создатель | Демонстрация AI-SDLC процесса. Архитектурная чистота. Скорость итерации. | ДА — все фазы SDLC |
| **Operator (B2B)** | Арендатор (tenant) | Tenant isolation. White-label. Game provider интеграции. Revenue reporting. | НЕТ — заглушка в demo |
| **Player (B2C)** | Конечный пользователь | Регистрация. Баланс. Честная игра. Безопасность данных. Быстрые выплаты. | НЕТ — тест-данные |
| **Game Provider** | Внешний поставщик | Корректная интеграция API. Точный учёт RTP. | НЕТ — mock в demo |
| **PSP / Payment** | Внешний поставщик | Корректные транзакции. Финансовая безопасность. | НЕТ — stub в demo |
| **Regulator** | Надзорный орган | KYC/AML compliance. Responsible gambling. Аудит логи. | НЕТ — out of scope demo |
| **Аудитория доклада** | Наблюдатель | Понять AI-SDLC процесс. Увидеть как Claude Code строит реальное приложение. | НЕТ |

---

## Human-in-Loop матрица

| Фаза | Решение | Кто подтверждает | Обязательно |
|------|---------|-----------------|-------------|
| Vision | system-context.md + stakeholder-map.md | Platform Owner | ДА |
| Arch | ADR принятие, Utility Tree приоритеты | Platform Owner | ДА |
| TDD | Acceptance criteria | Platform Owner | ДА |
| Deploy | Prod deploy, env secrets | Platform Owner | ДА |
| Все | Деструктивные операции (drop DB, force push) | Platform Owner | ДА |

---

## Concerns по подсистемам

### TenantService
- **Operator**: полная изоляция данных между тенантами
- **Platform Owner**: простой onboarding API

### PlayerService
- **Player**: безопасность аккаунта, корректность баланса
- **Regulator**: история транзакций, self-exclusion
- **Platform Owner**: масштабируемость хранилища игроков

### GameService
- **Operator**: настройка доступных игр по тенанту
- **Game Provider**: корректный учёт RTP и сессий
- **Player**: честная игра, воспроизводимость результатов

### APIGateway
- **Operator**: SLA, latency < 200ms (p95)
- **Platform Owner**: единая точка входа, tenant routing

---

## Приоритизация для demo

**MVP scope (hello-world):**
1. TenantService: CRUD тенантов
2. PlayerService: регистрация + баланс
3. GameService: каталог игр + stub сессии
4. APIGateway: routing + health check

**Out of scope (следующие фазы):**
- JWT аутентификация
- Real PSP интеграция
- KYC/AML
- Persistent storage (PostgreSQL)
- Real-time (WebSocket)
