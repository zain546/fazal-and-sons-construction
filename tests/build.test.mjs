import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { build } from '../scripts/build.mjs';

test('builds production metadata and prevents preview indexing', async () => {
  try {
    await build({ SITE_URL: 'https://example.com', ALLOW_INDEXING: 'true', VERCEL_ENV: 'production' });
    let html = await readFile(new URL('../build/index.html', import.meta.url), 'utf8');
    assert.ok(html.includes('<meta name="robots" content="index,follow">'));
    assert.ok(html.includes('<link rel="canonical" href="https://example.com/">'));
    assert.ok(html.includes('https://example.com/assets/social.jpg'));
    const sitemap = await readFile(new URL('../build/sitemap.xml', import.meta.url), 'utf8');
    assert.ok(sitemap.includes('<loc>https://example.com/</loc>'));
    await build({ SITE_URL: 'https://example.com', ALLOW_INDEXING: 'true', VERCEL_ENV: 'preview' });
    html = await readFile(new URL('../build/index.html', import.meta.url), 'utf8');
    assert.ok(html.includes('<meta name="robots" content="noindex,follow">'));
    assert.equal((html.match(/rel="canonical"/g) || []).length, 1);
  } finally {
    await build({});
  }
});
