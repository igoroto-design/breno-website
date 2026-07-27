export const SITE_BASE = "https://brenovieirapsi.com";
export const SITE_NAME = "Breno Psicólogo";
export const DEFAULT_OG_IMAGE = `${SITE_BASE}/og-image.jpg`;

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
  "psicoterapia/quanto-tempo-dura-a-terapia": "2025-06-05",
  "psicoterapia/como-escolher-um-psicologo": "2025-06-01",
  "ansiedade/ansiedade-12-sintomas": "2025-06-15",
  "ansiedade/ansiedade-e-insonia": "2025-06-05",
  "ansiedade/pensamentos-acelerados": "2025-06-01",
  "ansiedade/ansiedade-sintomas-fisicos": "2025-05-25",
  "psicanalise/o-que-e-psicanalise": "2025-06-15",
  "psicanalise/psicanalise-funciona": "2025-06-01",
  "psicanalise/psicanalise-vs-tcc": "2025-06-19",
  "psicanalise/psicanalise-online": "2025-06-10",
  "psicanalise/quando-procurar-psicanalista": "2025-05-25",
  "psicanalise/quanto-tempo-dura-psicanalise": "2025-06-05",
  "autoestima/autoestima-baixa-sinais": "2025-05-25",
  "autoestima/critica-interna-como-lidar": "2025-06-05",
  "autoestima/inseguranca": "2025-06-19",
  "autoestima/terapia-ajuda-autoestima": "2025-06-15",
  "relacionamentos/relacionamento-toxico-sinais": "2025-06-01",
  "relacionamentos/medo-de-abandono": "2025-06-05",
  "relacionamentos/dependencia-emocional": "2025-05-25",
  "relacionamentos/ciumes-em-excesso": "2025-06-15",
};

export function getPrerenderRoutes() {
  const articleRoutes = Object.keys(ARTICLE_LASTMOD).map((key) => `/conteudos/${key}`);
  return [
    "/",
    "/conteudos",
    ...CATEGORY_SLUGS.map((slug) => `/conteudos/${slug}`),
    ...articleRoutes,
  ];
}
