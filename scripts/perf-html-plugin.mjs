import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const criticalCss = readFileSync(join(__dirname, "../src/styles/critical.css"), "utf8");

const VIEWPORT = '<meta name="viewport" content="width=device-width, initial-scale=1.0" />';

/** Inject critical CSS, defer full stylesheet, and preload key fonts. */
export function perfHtmlPlugin() {
  return {
    name: "perf-html",
    apply: "build",
    transformIndexHtml: {
      order: "post",
      handler(html, ctx) {
        html = html.replace(
          /<style>[\s\S]*?<\/style>/,
          `<style>${criticalCss}</style>`,
        );

        html = html.replace(
          /<link rel="stylesheet" crossorigin href="(\/assets\/[^"]+\.css)">/,
          '<link rel="preload" as="style" href="$1" onload="this.onload=null;this.rel=\'stylesheet\'" />' +
            '<noscript><link rel="stylesheet" href="$1" /></noscript>',
        );

        const earlyHints = [];
        if (ctx.bundle) {
          for (const chunk of Object.values(ctx.bundle)) {
            if (chunk.fileName.endsWith(".woff2")) {
              const name = chunk.fileName.toLowerCase();
              if (name.includes("noto-sans-latin-400-normal")) {
                earlyHints.push(
                  `<link rel="preload" href="/${chunk.fileName}" as="font" type="font/woff2" crossorigin />`,
                );
              }
            }
          }
        }

        if (earlyHints.length) {
          html = html.replace(VIEWPORT, `${VIEWPORT}\n    ${earlyHints.join("\n    ")}`);
        }

        return html;
      },
    },
  };
}
