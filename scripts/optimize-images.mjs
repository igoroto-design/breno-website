import { readdirSync, readFileSync, statSync, writeFileSync } from "fs";
import { join, extname } from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const assetsDir = join(__dirname, "..", "dist", "assets");

let sharp;
try {
  sharp = (await import("sharp")).default;
} catch {
  console.log("⚠ sharp not installed — skipping image optimization");
  process.exit(0);
}

const IMAGE_EXT = new Set([".webp", ".jpg", ".jpeg", ".png"]);
const WEBP_QUALITY = 78;

function walk(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      files.push(...walk(full));
    } else {
      files.push(full);
    }
  }
  return files;
}

if (!statSync(assetsDir, { throwIfNoEntry: false })) {
  console.log("⚠ No dist/assets folder — skipping image optimization");
  process.exit(0);
}

const images = walk(assetsDir).filter((f) => IMAGE_EXT.has(extname(f).toLowerCase()));
let saved = 0;

const MAX_WIDTH = 1280;

for (const file of images) {
  if (file.endsWith(".avif")) continue;
  const before = statSync(file).size;
  const input = readFileSync(file);
  const image = sharp(input);
  const meta = await image.metadata();

  let pipeline = sharp(input);
  if (meta.width && meta.width > MAX_WIDTH) {
    pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
  }

  const ext = extname(file).toLowerCase();
  if (ext === ".webp") {
    pipeline = pipeline.webp({ quality: WEBP_QUALITY, effort: 4 });
  } else if (ext === ".jpg" || ext === ".jpeg") {
    pipeline = pipeline.jpeg({ quality: WEBP_QUALITY, mozjpeg: true });
  } else if (ext === ".png") {
    pipeline = pipeline.png({ compressionLevel: 9, palette: true });
  }

  const output = await pipeline.toBuffer();
  if (output.length < before) {
    writeFileSync(file, output);
    saved += before - output.length;
  }
}

console.log(`✓ Optimized ${images.length} images (saved ${(saved / 1024 / 1024).toFixed(2)} MB)`);
