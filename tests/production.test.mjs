import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { validateEnquiry, createBrief, whatsappUrl } from '../dist/enquiry.mjs';
import { deploymentSettings } from '../scripts/build.mjs';

test('rejects whitespace-only required fields and unknown service values', () => {
  const result = validateEnquiry({ name: '  ', location: '\t', type: 'Unlisted service' });
  assert.deepEqual(Object.keys(result.errors).sort(), ['location', 'name', 'type']);
});
test('prepares a trimmed brief and preserves Unicode and punctuation in WhatsApp', () => {
  const { enquiry, errors } = validateEnquiry({ name: '  علی & Sons ', type: 'New construction', location: ' Nazimabad ', message: 'Cost? 50% & materials + labour\n233 sq yd' });
  assert.deepEqual(errors, {});
  const brief = createBrief(enquiry);
  const url = new URL(whatsappUrl(brief));
  assert.equal(url.origin, 'https://wa.me');
  assert.equal(url.pathname, '/923003732847');
  assert.equal(url.searchParams.get('text'), brief);
  assert.match(brief, /I'm علی & Sons\./);
  assert.match(brief, /Location: Nazimabad\nDetails:/);
});
test('optional notes are omitted and oversized input is bounded', () => {
  const { enquiry } = validateEnquiry({ name: 'a'.repeat(200), type: 'Other', location: 'Karachi', message: ' ' });
  assert.equal(enquiry.name.length, 100);
  assert.doesNotMatch(createBrief(enquiry), /Details:/);
});
test('preview deployments remain noindex even when launch indexing is enabled', () => {
  assert.equal(deploymentSettings({ SITE_URL: 'https://example.com', ALLOW_INDEXING: 'true', VERCEL_ENV: 'preview' }).indexing, false);
  assert.equal(deploymentSettings({ SITE_URL: 'https://example.com', ALLOW_INDEXING: 'true', VERCEL_ENV: 'production' }).indexing, true);
  assert.equal(deploymentSettings({ SITE_URL: 'https://example.com', ALLOW_INDEXING: 'true', CONTEXT: 'deploy-preview' }).indexing, false);
  assert.equal(deploymentSettings({ SITE_URL: 'https://example.com', ALLOW_INDEXING: 'true', CONTEXT: 'production' }).indexing, true);
  assert.equal(deploymentSettings({}).indexing, false);
  assert.throws(() => deploymentSettings({ SITE_URL: 'https://example.com/path' }));
  assert.throws(() => deploymentSettings({ SITE_URL: 'http://example.com' }));
});
test('Vercel content security policy allows the exact structured data block', async () => {
  const html = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
  const config = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'));
  const schema = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1];
  const hash = createHash('sha256').update(schema).digest('base64');
  const policy = config.headers[0].headers.find(item => item.key === 'Content-Security-Policy').value;
  assert.ok(policy.includes(`'sha256-${hash}'`));
  assert.equal(JSON.parse(schema)['@type'], 'GeneralContractor');
  assert.doesNotMatch(html, /silverlarch259/);
});

test('page has valid local resources, anchor targets, unique IDs, and service options', async () => {
  const html = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, 'IDs must be unique');
  for (const [, value] of html.matchAll(/\b(?:src|href)="([^"]+)"/g)) {
    if (value.startsWith('#')) assert.ok(ids.includes(value.slice(1)), `Missing anchor ${value}`);
    else if (!/^(https?:|tel:)/.test(value)) await access(new URL(`../dist/${value}`, import.meta.url));
  }
  const options = [...html.matchAll(/<option value="([^"]+)"/g)].map(match => match[1].replaceAll('&amp;', '&'));
  assert.deepEqual(options, ['New construction', 'Structure & concrete', 'Project consultation', 'Other']);
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.ok(html.includes('id="main" tabindex="-1"'));
  assert.ok(html.includes('<noscript>'));
});


test('Google Maps links use universal URLs with a precise business destination', async () => {
  const html = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
  const links = [...html.matchAll(/<a\b[^>]*href="(https:\/\/www\.google\.com\/maps\/[^"]*)"[^>]*>/g)];
  assert.equal(links.length, 3);
  for (const [tag, href] of links) {
    const url = new URL(href.replaceAll('&amp;', '&'));
    assert.equal(url.searchParams.get('api'), '1');
    assert.doesNotMatch(tag, /target="_blank"/, 'Allow direct app handoff without opening a new tab');
    if (url.pathname === '/maps/search/') {
      assert.ok(url.searchParams.get('query').includes('Fazal'));
      assert.equal(url.searchParams.get('query_place_id'), 'ChIJFf7C98E_sz4RNLds1g-D4PM');
    } else {
      assert.equal(url.pathname, '/maps/dir/');
      assert.equal(url.searchParams.get('destination'), '24.9081024,67.0285533');
      assert.equal(url.searchParams.get('destination_place_id'), 'ChIJFf7C98E_sz4RNLds1g-D4PM');
    }
  }
});
