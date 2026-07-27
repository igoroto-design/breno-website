import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const assetsDir = join(__dirname, "..", "src", "assets");

const VARIANTS = [
  {
    source: "breno-psicologo-hero.webp",
    output: "breno-psicologo-hero-mobile.webp",
    width: 720,
    quality: 76,
  },
];

let sharp;
try {
  sharp = (await import("sharp")).default;
} catch {
  console.log("⚠ sharp not installed — skipping mobile image generation");
  process.exit(0);
}

for (const { source, output, width, quality } of VARIANTS) {
  const inputPath = join(assetsDir, source);
  const outputPath = join(assetsDir, output);

  if (!existsSync(inputPath)) {
    console.log(`⚠ Missing ${source} — skipping`);
    continue;
  }

  const buffer = await sharp(readFileSync(inputPath))
    .resize({ width, withoutEnlargement: true })
    .webp({ quality, effort: 4 })
    .toBuffer();

  writeFileSync(outputPath, buffer);
  console.log(`✓ ${output} (${(buffer.length / 1024).toFixed(0)} KB, max ${width}px wide)`);
}
