import { test, describe } from 'node:test';
import assert from 'node:assert';

process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';

const { supabase } = await import('../../../../lib/supabase');
const { POST } = await import('./route');

describe('POST /api/veto/create', () => {
  let originalFrom: any;

  test('returns 400 if missing captain1_id', async () => {
    const req = new Request('http://localhost/api/veto/create', {
      method: 'POST',
      body: JSON.stringify({ captain2_id: 'cap2', format: 'bo3' }),
    });
    const res = await POST(req);
    assert.strictEqual(res.status, 400);
    const data = await res.json();
    assert.deepStrictEqual(data, { error: 'Missing required fields' });
  });

  test('returns 400 if missing captain2_id', async () => {
    const req = new Request('http://localhost/api/veto/create', {
      method: 'POST',
      body: JSON.stringify({ captain1_id: 'cap1', format: 'bo3' }),
    });
    const res = await POST(req);
    assert.strictEqual(res.status, 400);
    const data = await res.json();
    assert.deepStrictEqual(data, { error: 'Missing required fields' });
  });

  test('returns 400 if missing format', async () => {
    const req = new Request('http://localhost/api/veto/create', {
      method: 'POST',
      body: JSON.stringify({ captain1_id: 'cap1', captain2_id: 'cap2' }),
    });
    const res = await POST(req);
    assert.strictEqual(res.status, 400);
    const data = await res.json();
    assert.deepStrictEqual(data, { error: 'Missing required fields' });
  });

  test('successfully creates a veto room and returns room id', async () => {
    let insertedPayload: any = null;
    const mockFrom = (table: string) => {
      assert.strictEqual(table, 'match_vetoes');
      return {
        insert: (records: any[]) => {
          insertedPayload = records[0];
          return {
            select: () => ({
              single: async () => ({
                data: { id: 'veto-123-uuid' },
                error: null,
              }),
            }),
          };
        },
      };
    };

    if (supabase) {
      originalFrom = supabase.from;
      (supabase as any).from = mockFrom;
    }

    try {
      const req = new Request('http://localhost/api/veto/create', {
        method: 'POST',
        body: JSON.stringify({
          captain1_id: 'cap-gusta',
          captain2_id: 'cap-hps',
          format: 'bo3',
        }),
      });

      const res = await POST(req);
      assert.strictEqual(res.status, 200);
      const data = await res.json();
      assert.deepStrictEqual(data, { id: 'veto-123-uuid' });

      assert.deepStrictEqual(insertedPayload, {
        captain1_id: 'cap-gusta',
        captain2_id: 'cap-hps',
        format: 'bo3',
        status: 'in_progress',
        current_turn: 'cap-gusta',
        actions: [],
      });
    } finally {
      if (supabase && originalFrom) {
        (supabase as any).from = originalFrom;
      }
    }
  });

  test('returns 500 when database insert fails', async () => {
    const mockFrom = () => {
      return {
        insert: () => ({
          select: () => ({
            single: async () => ({
              data: null,
              error: new Error('Database connection failed'),
            }),
          }),
        }),
      };
    };

    if (supabase) {
      originalFrom = supabase.from;
      (supabase as any).from = mockFrom;
    }

    try {
      const req = new Request('http://localhost/api/veto/create', {
        method: 'POST',
        body: JSON.stringify({
          captain1_id: 'cap-gusta',
          captain2_id: 'cap-hps',
          format: 'bo3',
        }),
      });

      const res = await POST(req);
      assert.strictEqual(res.status, 500);
      const data = await res.json();
      assert.deepStrictEqual(data, { error: 'Internal Server Error' });
    } finally {
      if (supabase && originalFrom) {
        (supabase as any).from = originalFrom;
      }
    }
  });
});
