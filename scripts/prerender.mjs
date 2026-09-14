import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { getPrerenderRoutes } from "./site-routes.mjs";
import { extractLcpPreloadHTML } from "./lcp-preload.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const distDir = join(root, "dist");
const assetsDir = join(distDir, "assets");
const serverPath = join(distDir, "server", "entry-server.js");

const { render, getSEO, buildMetaHTML, buildJsonLdHTML } = await import(pathToFileURL(serverPath).href);

const warn = console.warn;
const error = console.error;
console.warn = (...args) => {
  if (String(args[0] ?? "").includes("useLayoutEffect")) return;
  warn(...args);
};
console.error = (...args) => {
  if (String(args[0] ?? "").includes("useLayoutEffect")) return;
  error(...args);
};

const template = readFileSync(join(distDir, "index.html"), "utf-8");
const routes = getPrerenderRoutes();

const VIEWPORT =
  '<meta name="viewport" content="width=device-width, initial-scale=1.0" />';

function extractFontPreloadHTML() {
  try {
    const noto = readdirSync(assetsDir).find(
      (file) => file.includes("noto-sans-latin-400-normal") && file.endsWith(".woff2"),
    );
    if (!noto) return "";
    return `<link rel="preload" href="/assets/${noto}" as="font" type="font/woff2" crossorigin />`;
  } catch {
    return "";
  }
}

function injectHtml(templateHtml, routeHtml, metaHtml, headPreloadHtml, jsonLdHtml) {
  let html = templateHtml;

  html = html.replace('<div id="root"></div>', `<div id="root">${routeHtml}</div>`);

  if (headPreloadHtml) {
    html = html.replace(
      VIEWPORT,
      `${VIEWPORT}\n    ${headPreloadHtml.trim()}`,
    );
  }

  html = html.replace(
    /<!-- SEO_HEAD_START -->[\s\S]*?<!-- SEO_HEAD_END -->/,
    `<!-- SEO_HEAD_START -->\n    ${metaHtml}\n    <!-- SEO_HEAD_END -->`,
  );

  if (jsonLdHtml) {
    html = html.replace(
      "</body>",
      `\n    <!-- Structured data (prerendered) -->\n    ${jsonLdHtml}\n  </body>`,
    );
  }

  return html;
}

function outputPath(route) {
  if (route === "/") return join(distDir, "index.html");
  return join(distDir, route.slice(1), "index.html");
}

const fontPreload = extractFontPreloadHTML();

for (const route of routes) {
  const appHtml = await render(route);
  const seo = getSEO(route);
  const metaHtml = buildMetaHTML(seo);
  const jsonLdHtml = buildJsonLdHTML(seo);
  const lcpPreloadHtml = route === "/" ? extractLcpPreloadHTML(appHtml) : "";
  const headPreloadHtml = [lcpPreloadHtml, route === "/" ? fontPreload : ""].filter(Boolean).join("\n    ");
  const html = injectHtml(template, appHtml, metaHtml, headPreloadHtml, jsonLdHtml);
  const out = outputPath(route);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html, "utf-8");
  console.log(`  prerendered ${route}`);
}

console.log(`\n✓ Prerendered ${routes.length} routes`);
