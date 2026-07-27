import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { getPrerenderRoutes } from "./site-routes.mjs";
import { extractLcpPreloadHTML } from "./lcp-preload.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const distDir = join(root, "dist");
const serverPath = join(distDir, "server", "entry-server.js");

const { render, getSEO, buildHeadHTML } = await import(pathToFileURL(serverPath).href);

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

function injectHtml(templateHtml, routeHtml, headHtml) {
  let html = templateHtml;

  html = html.replace('<div id="root"></div>', `<div id="root">${routeHtml}</div>`);

  // Replace default head SEO block with route-specific tags
  html = html.replace(
    /<!-- Primary meta -->[\s\S]*?<!-- Schema: Person \(professional\) -->/,
    `<!-- Primary meta (prerendered) -->\n    ${headHtml}\n\n    <!-- Schema: Person (professional) -->`,
  );

  return html;
}

function outputPath(route) {
  if (route === "/") return join(distDir, "index.html");
  return join(distDir, route.slice(1), "index.html");
}

for (const route of routes) {
  const appHtml = render(route);
  const seo = getSEO(route);
  const headHtml = buildHeadHTML(seo) + extractLcpPreloadHTML(appHtml);
  const html = injectHtml(template, appHtml, headHtml);
  const out = outputPath(route);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html, "utf-8");
  console.log(`  prerendered ${route}`);
}

console.log(`\n✓ Prerendered ${routes.length} routes`);
