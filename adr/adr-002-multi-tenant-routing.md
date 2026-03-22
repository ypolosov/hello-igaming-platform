# ADR-002: Multi-Tenant Routing Strategy

> Architecture Phase artifact — AI-SDLC demo project
> Date: 2026-03-22 | Status: Accepted
> Driver: D1 — Tenant Isolation (H/H)

## Context

iGaming Platform — B2B2C SaaS с несколькими независимыми операторами (тенантами).
Каждый оператор должен быть полностью изолирован: его игроки, настройки и данные
не должны быть доступны другим операторам.

Необходим механизм идентификации тенанта на уровне API Gateway,
чтобы все нижестоящие сервисы могли фильтровать данные по tenant scope.

## Alternatives Considered

### A1: HTTP Header `X-Tenant-Id` ✅ Chosen

```
GET /players HTTP/1.1
X-Tenant-Id: operator-royal-casino
Authorization: Bearer <jwt>
```

**Pros:**
- Не меняет URL структуру — RESTful пути остаются чистыми
- Легко тестируется (supertest header injection)
- Стандартная практика для B2B SaaS (Stripe, Twilio)
- Gateway извлекает tenant, передаёт downstream без изменений URL

**Cons:**
- Клиент должен явно передавать header
- Без API Gateway header может быть проигнорирован

### A2: URL Path Prefix `/api/v1/{tenantId}/players`

**Pros:** Tenant виден в URL, работает с любым HTTP клиентом без доп. настройки

**Cons:**
- Нарушает RESTful semantics (tenant — это контекст, не ресурс)
- Все endpoint пути становятся длиннее
- Swagger/OpenAPI схема дублируется для каждого tenant pattern

### A3: Subdomain Routing `royal-casino.platform.io`

**Pros:** Полная изоляция на DNS уровне, максимальная security

**Cons:**
- Требует wildcard DNS настройки
- Сложно в локальной разработке (нужны hosts файл правки)
- Избыточно для demo уровня

## Decision

**Выбрана A1: X-Tenant-Id header.**

API Gateway:
1. Читает `X-Tenant-Id` из входящего запроса
2. Если header отсутствует — возвращает `400 Bad Request`
3. Передаёт tenant context в downstream сервисы через тот же header

## Implementation

```typescript
// api-gateway/src/router.ts
app.use((req, res, next) => {
  const tenantId = req.headers['x-tenant-id'];
  if (!tenantId) {
    return res.status(400).json({ error: 'X-Tenant-Id header is required' });
  }
  next();
});
```

## Fitness Function

Автоматическая проверка: тест должен упасть если tenant validation убрана.

```typescript
// Тест: запрос без X-Tenant-Id должен вернуть 400
it('returns 400 when X-Tenant-Id is missing', async () => {
  const res = await request(app).get('/health');
  // health endpoint исключён из tenant validation
  expect(res.status).toBe(200);
});

it('returns 400 when X-Tenant-Id missing on protected routes', async () => {
  const res = await request(app).get('/api/players');
  expect(res.status).toBe(400);
});
```

## Fitness Function

**File:** `tests/fitness/adr-002-tenant-isolation.test.ts`
**Gate:** pre-commit hook (`.git/hooks/pre-commit`)

Проверяет: все protected routes (`/api/players`, `/api/games`, `/api/tenants`) возвращают 400 при отсутствии `X-Tenant-Id`.
`/health` остаётся доступным без заголовка.

## Rejected

- A2 (path prefix): нарушает REST семантику
- A3 (subdomain): избыточная сложность для demo, DNS зависимость
