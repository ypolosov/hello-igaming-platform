# ADR-004: Storage Strategy

> Architecture Phase artifact — AI-SDLC demo project
> Date: 2026-03-22 | Status: Accepted
> Driver: D2 — Testability (H/H), Deployability (M/L)

## Context

Для demo платформы необходимо хранить данные: тенанты, игроки, игровые сессии.
Выбор storage влияет на:
- Скорость запуска (zero setup vs DB migrations)
- Тестируемость (без mock vs с mock)
- Реализм демонстрации (hello-world vs production)

## Alternatives Considered

### A1: In-Memory `Map<string, T>` ✅ Chosen

```typescript
const tenants = new Map<string, Tenant>();
```

**Pros:**
- Zero setup — `npm test` работает без запущенного Docker
- Тесты детерминированы (нет shared state между запусками)
- Нет ORM, нет migration, нет connection pooling
- Максимально понятен аудитории доклада

**Cons:**
- Данные теряются при рестарте сервиса
- Нельзя масштабировать горизонтально (shared memory не работает)

### A2: SQLite (better-sqlite3)

**Pros:** Персистентность без внешнего сервера, файловая база данных

**Cons:**
- Нужен ORM или query builder (drizzle/prisma) — усложняет demo
- Файл БД нужно игнорировать в git или сидировать
- Migration setup даже для hello-world

### A3: PostgreSQL + Prisma

**Pros:** Production-grade, реальный опыт

**Cons:**
- Требует docker-compose postgres + healthcheck
- Prisma generate + migrate deploy в Dockerfile
- Оверинжиниринг для demo — отвлекает от AI-SDLC процесса

## Decision

**Выбрана A1: In-Memory Map.**

Это **conscious tradeoff**, явно задокументированный:
> "Мы выбрали простоту ради демонстрации ПРОЦЕССА, а не persistence."

Когда переходить на PostgreSQL (следующая фаза):
- Когда нужна персистентность между деплоями
- Когда нужны SQL joins (player × tenant × transaction)
- Когда горизонтальное масштабирование актуально

## Fitness Function

```bash
# Тест должен работать без любых внешних сервисов
npm test  # все сервисы: no DB connection required, все green
```

```typescript
// Anti-pattern: НЕ делать так (не должно быть в codebase)
// import { Pool } from 'pg'; ← отсутствие этого import = fitness check пройден
```

## Rejected

- A2 (SQLite): нет явного выигрыша перед in-memory для demo; добавляет migration complexity
- A3 (PostgreSQL): production concerns не нужны в hello-world demo
