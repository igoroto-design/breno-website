export const SITE_BASE = "https://www.brenovieirapsi.com";
export const SITE_NAME = "Breno Psicólogo";
export const PERSON_PATH = "/sobre";
export const PERSON_URL = `${SITE_BASE}${PERSON_PATH}`;
export const DEFAULT_OG_IMAGE = `${SITE_BASE}/og-image.jpg`;
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;
export const GOOGLE_BUSINESS_URL = "https://share.google/WhHQEJ8Lu3lCTtAAF";
/** Public profile URLs for Person schema sameAs */
export const SOCIAL_PROFILES = [
  GOOGLE_BUSINESS_URL,
  "https://www.google.com/search?kgmid=/g/11zcnpd3gw&q=Breno+Vieira+Psic%C3%B3logo",
];

export const CATEGORY_SLUGS = [
  "psicoterapia",
  "ansiedade",
  "psicanalise",
  "autoestima",
  "relacionamentos",
];

export const ARTICLE_LASTMOD = {
  "psicoterapia/quando-procurar-psicologo": "2025-05-25",
  "psicoterapia/como-saber-se-preciso-de-terapia": "2025-06-19",
  "psicoterapia/terapia-online-funciona": "2025-06-15",
  "psicoterapia/terapia-online-ou-presencial": "2025-06-19",
  "psicoterapia/o-que-esperar-da-primeira-sessao": "2025-06-10",
  "psicoterapia/quanto-tempo-dura-a-terapia": "2026-10-19",
  "psicoterapia/como-escolher-um-psicologo": "2025-06-01",
  "ansiedade/ansiedade-12-sintomas": "2025-06-15",
  "ansiedade/ansiedade-e-insonia": "2025-06-05",
  "ansiedade/pensamentos-acelerados": "2025-06-01",
  "ansiedade/ansiedade-sintomas-fisicos": "2025-05-25",
  "psicanalise/o-que-e-psicanalise": "2026-09-23",
  "psicanalise/psicanalise-funciona": "2026-09-23",
  "psicanalise/psicanalise-vs-tcc": "2025-06-19",
  "psicanalise/psicanalise-online": "2025-06-10",
  "psicanalise/quando-procurar-psicanalista": "2026-09-14",
  "psicanalise/quanto-tempo-dura-psicanalise": "2025-06-05",
  "autoestima/autoestima-baixa-sinais": "2025-05-25",
  "autoestima/critica-interna-como-lidar": "2025-06-05",
  "autoestima/inseguranca": "2025-06-19",
  "autoestima/terapia-ajuda-autoestima": "2025-06-15",
  "relacionamentos/relacionamento-toxico-sinais": "2025-06-01",
  "relacionamentos/medo-de-abandono": "2026-10-19",
  "relacionamentos/dependencia-emocional": "2025-05-25",
  "relacionamentos/ciumes-em-excesso": "2025-06-15",
};

export function getPrerenderRoutes() {
  const articleRoutes = Object.keys(ARTICLE_LASTMOD).map((key) => `/conteudos/${key}`);
  return [
    "/",
    "/sobre",
    "/politica-de-privacidade",
    "/conteudos",
    ...CATEGORY_SLUGS.map((slug) => `/conteudos/${slug}`),
    ...articleRoutes,
  ];
}
