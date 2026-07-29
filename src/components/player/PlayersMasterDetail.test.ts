import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import Module, { createRequire } from 'node:module';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import jsxRuntime from 'react/jsx-runtime';

const req = createRequire(import.meta.url);
const { transformSync } = req('next/dist/build/swc');

// Wrap jsx runtime to handle CJS default exports if needed
const origJsx = (jsxRuntime as any).jsx;
const origJsxs = (jsxRuntime as any).jsxs;

function wrapJsx(orig: any) {
  return function (this: any, type: any, props: any, key: any) {
    if (type && typeof type === 'object' && type.default) {
      type = type.default;
    }
    return orig.call(this, type, props, key);
  };
}

(jsxRuntime as any).jsx = wrapJsx(origJsx);
(jsxRuntime as any).jsxs = wrapJsx(origJsxs);

// Set up custom require hook for TSX/TS files and Next/lucide mocks
const origRequire = (Module.prototype as any).require;

let pushUrl: string | null = null;
let alertMsg: string | null = null;
let promptQueue: (string | null)[] = [];
let fetchCalls: Array<{ url: string; options: any }> = [];

(Module.prototype as any).require = function (this: any, id: string) {
  if (id === 'next/navigation') {
    return { useRouter: () => ({ push: (url: string) => { pushUrl = url; } }) };
  }
  if (id === 'next/link') {
    return { default: ({ children, href }: any) => React.createElement('a', { href }, children) };
  }
  if (id === 'lucide-react') {
    return new Proxy({}, { get: () => (props: any) => React.createElement('svg', props) });
  }
  if (id === 'recharts') {
    return new Proxy({}, { get: () => (props: any) => React.createElement('div', props) });
  }
  if (id.startsWith('@/')) {
    const relPath = id.replace('@/', './src/');
    const absPath = path.resolve(process.cwd(), relPath);
    if (fs.existsSync(absPath + '.tsx')) return req(absPath + '.tsx');
    if (fs.existsSync(absPath + '.ts')) return req(absPath + '.ts');
    return req(absPath);
  }
  return origRequire.apply(this, arguments as any);
};

(Module as any)._extensions['.tsx'] = function (module: any, filename: string) {
  const content = fs.readFileSync(filename, 'utf8');
  const transformed = transformSync(content, {
    filename,
    jsc: {
      parser: { syntax: 'typescript', tsx: true },
      transform: { react: { runtime: 'automatic' } },
      target: 'es2020',
    },
    module: { type: 'commonjs' },
  });
  module._compile(transformed.code, filename);
};
(Module as any)._extensions['.ts'] = (Module as any)._extensions['.tsx'];

const { PlayersMasterDetail } = req('./PlayersMasterDetail.tsx');

function findButtonByText(node: any, text: string): any {
  if (!node || typeof node !== 'object') return null;
  if (node.props) {
    if (node.props.children === text && node.props.onClick) {
      return node;
    }
    const children = Array.isArray(node.props.children) ? node.props.children : [node.props.children];
    for (const child of children) {
      const found = findButtonByText(child, text);
      if (found) return found;
    }
  }
  return null;
}

function renderAndGetVetoHandler(players: any[]): () => Promise<void> {
  let handler: any = null;
  function Container() {
    const v = PlayersMasterDetail({ players });
    const btn = findButtonByText(v, 'Criar Votação');
    if (btn) handler = btn.props.onClick;
    return v;
  }
  ReactDOMServer.renderToString(React.createElement(Container));
  return handler;
}

describe('PlayersMasterDetail - Component Rendering & Veto Creation', () => {
  beforeEach(() => {
    pushUrl = null;
    alertMsg = null;
    promptQueue = [];
    fetchCalls = [];
    (global as any).alert = (msg: string) => { alertMsg = msg; };
    (global as any).prompt = (msg: string, defaultVal: string) => {
      if (promptQueue.length > 0) return promptQueue.shift();
      return defaultVal;
    };
    (global as any).fetch = async (url: string, options: any) => {
      fetchCalls.push({ url, options });
      return {
        json: async () => ({ id: 'mock-veto-room-id' }),
      };
    };
  });

  test('renders component with player data and Criar Votação button', () => {
    const players = [
      { id: '1', user_id: 'u1', player_name: 'Fallen', kd_ratio: 1.25, win_rate: 60, role: 'awper', premier_points: 15000 },
      { id: '2', user_id: 'u2', player_name: 'fer', kd_ratio: 1.15, win_rate: 55, role: 'entry fragger', premier_points: 14000 },
    ];

    const html = ReactDOMServer.renderToString(React.createElement(PlayersMasterDetail, { players }));
    assert.ok(html.includes('Fallen'), 'Renders player Fallen');
    assert.ok(html.includes('fer'), 'Renders player fer');
    assert.ok(html.includes('Criar Votação'), 'Renders Criar Votação button');
  });

  test('handleCreateVeto alerts when fewer than 2 players exist', async () => {
    const players = [
      { id: '1', user_id: 'u1', player_name: 'Fallen' },
    ];
    const handleCreateVeto = renderAndGetVetoHandler(players);
    assert.ok(handleCreateVeto, 'Handler captured');

    await handleCreateVeto();

    assert.strictEqual(alertMsg, 'Need at least 2 players');
    assert.strictEqual(fetchCalls.length, 0, 'No fetch called');
    assert.strictEqual(pushUrl, null, 'No navigation triggered');
  });

  test('handleCreateVeto cancels when prompt input is missing/cancelled', async () => {
    const players = [
      { id: '1', user_id: 'u1', player_name: 'Fallen' },
      { id: '2', user_id: 'u2', player_name: 'fer' },
    ];
    promptQueue = [null]; // First prompt returned null (cancelled)

    const handleCreateVeto = renderAndGetVetoHandler(players);
    await handleCreateVeto();

    assert.strictEqual(fetchCalls.length, 0, 'No fetch called when prompt is cancelled');
    assert.strictEqual(pushUrl, null, 'No navigation triggered');
  });

  test('handleCreateVeto posts data to /api/veto/create and navigates to veto room on success', async () => {
    const players = [
      { id: 'p1', user_id: 'cap1-uuid', player_name: 'Fallen' },
      { id: 'p2', user_id: 'cap2-uuid', player_name: 'fer' },
    ];
    promptQueue = ['cap1-uuid', 'cap2-uuid', 'MD3'];

    const handleCreateVeto = renderAndGetVetoHandler(players);
    await handleCreateVeto();

    assert.strictEqual(fetchCalls.length, 1, 'Fetch called once');
    assert.strictEqual(fetchCalls[0].url, '/api/veto/create');
    assert.strictEqual(fetchCalls[0].options.method, 'POST');
    
    const body = JSON.parse(fetchCalls[0].options.body);
    assert.deepStrictEqual(body, {
      captain1_id: 'cap1-uuid',
      captain2_id: 'cap2-uuid',
      format: 'MD3',
    });

    assert.strictEqual(pushUrl, '/veto/mock-veto-room-id');
  });

  test('handleCreateVeto alerts when veto creation API returns an error', async () => {
    (global as any).fetch = async () => ({
      json: async () => ({ error: 'Database failure' }),
    });

    const players = [
      { id: 'p1', user_id: 'cap1-uuid', player_name: 'Fallen' },
      { id: 'p2', user_id: 'cap2-uuid', player_name: 'fer' },
    ];
    promptQueue = ['cap1-uuid', 'cap2-uuid', 'MD1'];

    const handleCreateVeto = renderAndGetVetoHandler(players);
    await handleCreateVeto();

    assert.strictEqual(alertMsg, 'Erro ao criar sala de veto');
    assert.strictEqual(pushUrl, null, 'No navigation triggered when API fails');
  });
});
