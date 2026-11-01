import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export function deploymentSettings(env) {
  const raw = env.SITE_URL || (env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}` : '') || env.URL || '';
  let origin = '';
  if (raw) {
    const url = new URL(raw);
    if (url.protocol !== 'https:' || url.username || url.password || url.pathname !== '/' || url.search || url.hash) {
      throw new Error('SITE_URL must be an HTTPS origin, such as https://example.com, without a path or credentials.');
    }
    origin = url.origin;
  }
  const isProductionEnv = (!env.VERCEL_ENV || env.VERCEL_ENV === 'production') && (!env.CONTEXT || env.CONTEXT === 'production');
  const indexing = env.ALLOW_INDEXING === 'true' && Boolean(origin) && isProductionEnv;
  return { origin, indexing };
}

export async function build(env = process.env) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const target = path.join(root, 'build');
  const { origin, indexing } = deploymentSettings(env);
  await mkdir(target, { recursive: true });
  await cp(path.join(root, 'dist'), target, { recursive: true });
  let html = await readFile(path.join(target, 'index.html'), 'utf8');
  html = html.replace('<meta name="robots" content="noindex,follow">', `<meta name="robots" content="${indexing ? 'index,follow' : 'noindex,follow'}">`);
  if (origin) {
    const metadata = [
      `<link rel="canonical" href="${origin}/">`,
      `<meta property="og:url" content="${origin}/">`,
      `<meta property="og:image" content="${origin}/assets/social.jpg">`,
      '<meta property="og:image:width" content="1200">',
      '<meta property="og:image:height" content="630">',
      '<meta property="og:image:alt" content="Contemporary architecture and construction by Fazal and Sons Construction Development">',
      `<meta name="twitter:image" content="${origin}/assets/social.jpg">`
    ].join('\n  ');
    html = html.replace('</head>', `  ${metadata}\n</head>`);
  }
  await writeFile(path.join(target, 'index.html'), html);
  await writeFile(path.join(target, 'robots.txt'), `User-agent: *\nAllow: /\n${indexing ? `Sitemap: ${origin}/sitemap.xml\n` : ''}`);
  await writeFile(path.join(target, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${indexing ? `<url><loc>${origin}/</loc></url>` : ''}</urlset>\n`);
  console.log(`Built static site in build/. Search indexing: ${indexing ? 'enabled' : 'disabled'}.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await build();
}
