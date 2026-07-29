import { test, describe } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

describe('PlayersMasterDetail - Create Veto Button & Handler', () => {
  test('PlayersMasterDetail.tsx imports useRouter from next/navigation', () => {
    const filePath = path.resolve(process.cwd(), 'src/components/player/PlayersMasterDetail.tsx');
    const content = fs.readFileSync(filePath, 'utf-8');
    assert.match(content, /import\s+\{?\s*useRouter\s*\}?\s+from\s+['"]next\/navigation['"]/);
  });

  test('PlayersMasterDetail.tsx contains handleCreateVeto implementation', () => {
    const filePath = path.resolve(process.cwd(), 'src/components/player/PlayersMasterDetail.tsx');
    const content = fs.readFileSync(filePath, 'utf-8');
    assert.match(content, /const\s+handleCreateVeto\s*=\s*async\s*\(\)\s*=>/);
    assert.match(content, /\/api\/veto\/create/);
    assert.match(content, /router\.push\(`/);
  });

  test('PlayersMasterDetail.tsx contains Criar Votação button', () => {
    const filePath = path.resolve(process.cwd(), 'src/components/player/PlayersMasterDetail.tsx');
    const content = fs.readFileSync(filePath, 'utf-8');
    assert.match(content, /Criar Votação/);
    assert.match(content, /onClick=\{handleCreateVeto\}/);
  });
});
