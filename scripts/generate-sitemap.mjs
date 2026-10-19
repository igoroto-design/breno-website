import { writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import {
  SITE_BASE,
  CATEGORY_SLUGS,
  ARTICLE_LASTMOD,
  getPrerenderRoutes,
} from "./site-routes.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function urlEntry(loc, { lastmod, changefreq, priority }) {
  const lines = [
    "  <url>",
    `    <loc>${loc}</loc>`,
  ];
  if (lastmod) lines.push(`    <lastmod>${lastmod}</lastmod>`);
  lines.push(`    <changefreq>${changefreq}</changefreq>`);
  lines.push(`    <priority>${priority}</priority>`);
  lines.push("  </url>");
  return lines.join("\n");
}

const entries = [];

entries.push(urlEntry(`${SITE_BASE}/`, { changefreq: "weekly", priority: "1.0" }));
entries.push(urlEntry(`${SITE_BASE}/sobre`, { lastmod: "2026-09-23", changefreq: "yearly", priority: "0.6" }));
entries.push(urlEntry(`${SITE_BASE}/politica-de-privacidade`, { changefreq: "yearly", priority: "0.3" }));
entries.push(urlEntry(`${SITE_BASE}/conteudos`, { changefreq: "weekly", priority: "0.9" }));

for (const slug of CATEGORY_SLUGS) {
  entries.push(
    urlEntry(`${SITE_BASE}/conteudos/${slug}`, {
      changefreq: "monthly",
      priority: "0.8",
    }),
  );
}

for (const [key, lastmod] of Object.entries(ARTICLE_LASTMOD)) {
  entries.push(
    urlEntry(`${SITE_BASE}/conteudos/${key}`, {
      lastmod,
      changefreq: "monthly",
      priority: "0.7",
    }),
  );
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

${entries.join("\n\n")}

</urlset>
`;

writeFileSync(join(root, "public/sitemap.xml"), xml, "utf-8");
writeFileSync(join(root, "dist/sitemap.xml"), xml, "utf-8");
console.log(`✓ Generated sitemap with ${getPrerenderRoutes().length} routes`);
