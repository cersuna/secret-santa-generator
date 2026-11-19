// Static site generator: node src/build.mjs  ->  writes ./docs (served by GitHub Pages)
import { mkdirSync, writeFileSync, copyFileSync, rmSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "./config.mjs";
import { gifts } from "./gifts.mjs";
import { pages } from "./pages.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "docs");
const base = new URL(config.siteUrl).pathname.replace(/\/$/, "");
const year = new Date().getFullYear();

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
export const amz = (q) =>
  "https://www.amazon.com/s?k=" + encodeURIComponent(q) + (config.amazonTag ? "&tag=" + encodeURIComponent(config.amazonTag) : "");

const favicon = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#c8102e"/><text x="32" y="44" font-size="38" text-anchor="middle">🎁</text></svg>')}`;

function layout({ path, title, description, body, schema = [], noindex = false, scripts = [] }) {
  const url = config.siteUrl + path;
  const ga = config.ga4Id
    ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${config.ga4Id}"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${config.ga4Id}');</script>`
    : "";
  const ads = config.adsenseClient
    ? `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${config.adsenseClient}" crossorigin="anonymous"></script>`
    : "";
  const ld = schema.map((s) => `<script type="application/ld+json">${JSON.stringify(s)}</script>`).join("");
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
${noindex ? '<meta name="robots" content="noindex,nofollow">' : `<link rel="canonical" href="${url}">`}
<meta property="og:type" content="website">
<meta property="og:site_name" content="${config.siteName}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${config.siteUrl}/og.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#14532d">
<link rel="icon" href="${favicon}">
<link rel="stylesheet" href="${base}/style.css">
${ga}${ads}${ld}
</head>
<body>
<header class="site"><div class="wrap">
<a class="logo" href="${base}/"><span>🎁</span>${config.siteName}</a>
<nav class="top"><a href="${base}/">Generator</a><a href="${base}/secret-santa-gift-ideas/">Gift ideas</a><a href="${base}/secret-santa-rules/">Rules</a><a href="${base}/secret-santa-questionnaire/">Questionnaire</a></nav>
</div></header>
<main class="wrap">
${body}
</main>
<footer class="site"><div class="wrap">
<p><a href="${base}/">Secret Santa Generator</a><a href="${base}/office-secret-santa/">Office Secret Santa</a><a href="${base}/virtual-secret-santa/">Virtual Secret Santa</a><a href="${base}/white-elephant-rules/">White Elephant Rules</a><a href="${base}/secret-santa-gift-ideas/">Gift Ideas</a><a href="${base}/privacy/">Privacy</a></p>
<p class="disclosure">As an Amazon Associate ${config.siteName} earns from qualifying purchases. That's how this tool stays free. © ${year} ${config.siteName}.</p>
</div></footer>
<div class="toast" id="toast" role="status" aria-live="polite"></div>
<script>window.DS={base:${JSON.stringify(base)},tag:${JSON.stringify(config.amazonTag)},amz:function(q){return "https://www.amazon.com/s?k="+encodeURIComponent(q)+(this.tag?"&tag="+encodeURIComponent(this.tag):"")}};</script>
${scripts.map((s) => (s.startsWith("<") ? s : `<script src="${base}/${s}"></script>`)).join("\n")}
</body>
</html>`;
}

export function supportBlock() {
  if (!config.supportUrl) return "";
  return `<div class="card support center noprint"><h2>☕ Free forever, no ads in your face</h2><p class="muted">${config.siteName} is built by one person. If it saved your party, a small tip keeps it running.</p><a class="btn gold" href="${config.supportUrl}" target="_blank" rel="noopener">Buy us a hot cocoa</a></div>`;
}

export function ideaCards(tier, limit = 99) {
  return `<div class="ideas">${gifts[tier]
    .slice(0, limit)
    .map((g) => `<div class="idea"><b>${esc(g.name)}</b><p>${esc(g.why)}</p><a rel="sponsored noopener" target="_blank" href="${amz(g.q)}">See options on Amazon &rarr;</a></div>`)
    .join("")}</div>`;
}

export function faqBlock(faqs) {
  return {
    html: `<section class="faq"><h2>Frequently asked questions</h2>${faqs.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${a}</p></details>`).join("")}</section>`,
    schema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a.replace(/<[^>]+>/g, "") } })),
    },
  };
}

// ---------- build ----------
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
for (const f of readdirSync(join(root, "src/static"))) copyFileSync(join(root, "src/static", f), join(out, f));

const ctx = { base, config, esc, amz, ideaCards, faqBlock, supportBlock, gifts, year };
const sitemap = [];
for (const p of pages(ctx)) {
  const html = layout(p);
  const file = p.path === "/404.html" ? join(out, "404.html") : join(out, p.path, "index.html");
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
  if (!p.noindex) sitemap.push(`<url><loc>${config.siteUrl}${p.path}</loc><changefreq>weekly</changefreq><priority>${p.priority || 0.7}</priority></url>`);
}
writeFileSync(join(out, "gifts.js"), "window.GIFTS=" + JSON.stringify(gifts) + ";");
writeFileSync(join(out, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitemap.join("")}</urlset>\n`);
writeFileSync(join(out, "robots.txt"), `User-agent: *\nAllow: /\nDisallow: ${base}/reveal/\nSitemap: ${config.siteUrl}/sitemap.xml\n`);
writeFileSync(join(out, ".nojekyll"), "");
if (config.adsenseClient) writeFileSync(join(out, "ads.txt"), `google.com, ${config.adsenseClient.replace("ca-", "")}, DIRECT, f08c47fec0942fa0\n`);
const host = new URL(config.siteUrl).host;
if (!host.endsWith("github.io")) writeFileSync(join(out, "CNAME"), host + "\n");
console.log(`Built ${sitemap.length} indexable pages -> docs/ (base "${base}")`);
