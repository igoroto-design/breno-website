export {
  SITE_BASE,
  SITE_NAME,
  PERSON_PATH,
  PERSON_URL,
  DEFAULT_OG_IMAGE,
  OG_IMAGE_WIDTH,
  OG_IMAGE_HEIGHT,
  GOOGLE_BUSINESS_URL,
  SOCIAL_PROFILES,
  CATEGORY_SLUGS,
  ARTICLE_LASTMOD,
  getPrerenderRoutes,
} from "../../scripts/site-routes.mjs";

const PT_MONTHS: Record<string, string> = {
  Jan: "01", Fev: "02", Mar: "03", Abr: "04", Mai: "05", Jun: "06",
  Jul: "07", Ago: "08", Set: "09", Out: "10", Nov: "11", Dez: "12",
};

/** Converts "25 Mai 2025" → "2025-05-25" for schema.org */
export function parsePtDate(date: string): string {
  const parts = date.trim().split(/\s+/);
  if (parts.length !== 3) return date;
  const [day, monthPt, year] = parts;
  const month = PT_MONTHS[monthPt];
  if (!month) return date;
  return `${year}-${month}-${day.padStart(2, "0")}`;
}
