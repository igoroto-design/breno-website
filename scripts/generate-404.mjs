import { writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, "..", "dist");

const html = `<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="noindex, nofollow" />
    <title>Página não encontrada | Breno Psicólogo</title>
    <meta name="description" content="A página que você procura não existe ou foi movida." />
    <link rel="icon" type="image/png" href="/favicon.png" />
    <style>
      *, *::before, *::after { box-sizing: border-box; }
      html, body { min-height: 100%; margin: 0; }
      body {
        font-family: "Noto Sans", system-ui, -apple-system, sans-serif;
        background: #FFF7F2;
        color: #092529;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1.5rem;
      }
      main {
        text-align: center;
        max-width: 28rem;
      }
      .code {
        font-family: Merriweather, Georgia, serif;
        font-size: clamp(4rem, 18vw, 7rem);
        font-weight: 700;
        line-height: 1;
        color: rgba(9, 37, 41, 0.08);
        user-select: none;
        margin: 0 0 -1.5rem;
      }
      h1 {
        font-family: Merriweather, Georgia, serif;
        font-size: 1.75rem;
        font-weight: 700;
        margin: 0 0 0.75rem;
        line-height: 1.2;
      }
      p {
        margin: 0 0 1.75rem;
        color: rgba(9, 37, 41, 0.55);
        font-size: 1rem;
        line-height: 1.65;
      }
      .actions {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        align-items: center;
      }
      a {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        text-decoration: none;
        font-weight: 700;
        font-size: 0.9375rem;
        border-radius: 1rem;
        padding: 0.875rem 1.75rem;
        transition: background 0.15s ease, color 0.15s ease;
      }
      .primary {
        background: #AFD7BF;
        color: #092529;
      }
      .primary:hover { background: #9DCAAF; }
      .secondary {
        color: rgba(9, 37, 41, 0.55);
        font-weight: 600;
        padding: 0.5rem 1rem;
      }
      .secondary:hover { color: #092529; }
    </style>
  </head>
  <body>
    <main>
      <p class="code" aria-hidden="true">404</p>
      <h1>Página não encontrada</h1>
      <p>O conteúdo que você procura não existe, foi movido ou o endereço está incorreto.</p>
      <div class="actions">
        <a class="primary" href="/">Voltar para o início</a>
        <a class="secondary" href="/conteudos">Ver conteúdos</a>
      </div>
    </main>
  </body>
</html>
`;

writeFileSync(join(distDir, "404.html"), html, "utf-8");
console.log("✓ Generated static 404.html");
