/**
 * Fitness Function — ADR-004: Storage Strategy (In-Memory)
 * Linked to: adr/adr-004-storage-strategy.md
 * Quality attribute: Deployability / Testability
 *
 * Constraint: Source files MUST NOT import external DB clients.
 *             Allowed storage: only in-memory Map / plain objects.
 * Failure means: ADR-004 constraint violated — external DB dependency introduced.
 *
 * Registered as: pre-commit quality gate
 */
import * as fs from 'fs';
import * as path from 'path';

const PACKAGES_DIR = path.resolve(__dirname, '../../packages');
const FORBIDDEN_PATTERNS = [
  /from ['"]pg['"]/,
  /require\(['"]pg['"]\)/,
  /from ['"]mysql['"]/,
  /from ['"]mysql2['"]/,
  /from ['"]mongodb['"]/,
  /from ['"]mongoose['"]/,
  /from ['"]@prisma\/client['"]/,
  /from ['"]drizzle-orm['"]/,
  /from ['"]better-sqlite3['"]/,
  /from ['"]knex['"]/,
];

function collectSourceFiles(dir: string): string[] {
  const results: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== 'dist') {
      results.push(...collectSourceFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.ts') && !entry.name.endsWith('.test.ts')) {
      results.push(fullPath);
    }
  }
  return results;
}

describe('[Fitness] ADR-004: No External DB Imports', () => {
  const sourceFiles = collectSourceFiles(PACKAGES_DIR);

  it('should find TypeScript source files to check', () => {
    expect(sourceFiles.length).toBeGreaterThan(0);
  });

  it.each(sourceFiles)('%s MUST NOT import external DB clients', (filePath) => {
    const content = fs.readFileSync(filePath, 'utf-8');
    const violations = FORBIDDEN_PATTERNS.filter((pattern) => pattern.test(content));

    expect(violations).toHaveLength(0);
  });
});
