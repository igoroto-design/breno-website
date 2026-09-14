import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const assetsDir = join(__dirname, "..", "src", "assets");

const VARIANTS = [
  {
    source: "breno-psicologo-hero.webp",
    outputWebp: "breno-psicologo-hero-mobile.webp",
    outputAvif: "breno-psicologo-hero-mobile.avif",
    width: 480,
    webpQuality: 62,
    avifQuality: 50,
  },
  {
    source: "breno-psicologo-sobre.webp",
    outputWebp: "breno-psicologo-sobre-mobile.webp",
    width: 860,
    webpQuality: 68,
  },
];

let sharp;
try {
  sharp = (await import("sharp")).default;
} catch {
  console.log("⚠ sharp not installed — skipping mobile image generation");
  process.exit(0);
}

for (const variant of VARIANTS) {
  const { source, outputWebp, width, webpQuality } = variant;
  const outputAvif = variant.outputAvif;
  const avifQuality = variant.avifQuality;
  const inputPath = join(assetsDir, source);

  if (!existsSync(inputPath)) {
    console.log(`⚠ Missing ${source} — skipping`);
    continue;
  }

  const input = sharp(readFileSync(inputPath)).resize({ width, withoutEnlargement: true });

  const webpBuffer = await input.clone().webp({ quality: webpQuality, effort: 4 }).toBuffer();
  writeFileSync(join(assetsDir, outputWebp), webpBuffer);
  console.log(`✓ ${outputWebp} (${(webpBuffer.length / 1024).toFixed(0)} KB, max ${width}px wide)`);

  if (outputAvif && avifQuality) {
    const avifBuffer = await input.clone().avif({ quality: avifQuality, effort: 4 }).toBuffer();
    writeFileSync(join(assetsDir, outputAvif), avifBuffer);
    console.log(`✓ ${outputAvif} (${(avifBuffer.length / 1024).toFixed(0)} KB, max ${width}px wide)`);
  }
}
