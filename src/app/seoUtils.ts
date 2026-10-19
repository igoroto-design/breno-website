import {
  ARTICLE_LASTMOD,
  CATEGORY_SLUGS,
  DEFAULT_OG_IMAGE,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
  PERSON_PATH,
  PERSON_URL,
  SITE_BASE,
  SITE_NAME,
  SOCIAL_PROFILES,
  parsePtDate,
} from "./siteConfig";

export type FAQItem = {
  q: string;
  a: string;
  more?: { lead: string; label: string; to: string };
};

export function faqAnswerText(item: FAQItem): string {
  if (!item.more) return item.a;
  return `${item.a} ${item.more.lead} ${item.more.label}.`;
}

export type BreadcrumbItem = { name: string; path: string };

export type PageSEO = {
  title: string;
  fullTitle: string;
  description: string;
  canonical: string;
  canonicalUrl: string;
  type: "website" | "article";
  robots: string;
  section?: string;
  publishedTime?: string;
  modifiedTime?: string;
  ogImage: string;
  breadcrumbs?: BreadcrumbItem[];
  faq?: FAQItem[];
  jsonLd: object[];
};

const CATEGORY_NAMES: Record<string, string> = {
  psicoterapia: "Psicoterapia",
  ansiedade: "Ansiedade",
  psicanalise: "Psicanálise",
  autoestima: "Autoestima",
  relacionamentos: "Relacionamentos",
};

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  psicoterapia: "Artigos sobre terapia online, a primeira sessão e como escolher um psicólogo, escritos por Breno Vieira.",
  ansiedade: "Sintomas, causas e formas de lidar com a ansiedade no cotidiano.",
  psicanalise: "Artigos sobre a abordagem psicanalítica, as sessões e o trabalho do psicanalista, escritos por Breno Vieira, psicólogo clínico.",
  autoestima: "Autoconhecimento, limites e uma relação mais saudável consigo mesmo.",
  relacionamentos: "Como a psicologia pode ajudar a construir vínculos mais saudáveis e duradouros.",
};

const CATEGORY_TITLES: Record<string, string> = {
  psicoterapia: "Artigos sobre Psicoterapia Online",
  psicanalise: "Artigos sobre Psicanálise",
};

const CATEGORY_HEADINGS: Record<string, string> = {
  psicoterapia: "Psicoterapia",
  psicanalise: "Psicanálise",
};

export const HOMEPAGE_FAQS: FAQItem[] = [
  {
    q: "O que é psicanálise e como ela funciona?",
    a: "A psicanálise é uma abordagem terapêutica baseada na fala e na escuta, para compreender sentimentos, conflitos e padrões que se repetem ao longo da vida.",
    more: {
      lead: "A explicação completa está em",
      label: "o que é psicanálise",
      to: "/conteudos/psicanalise/o-que-e-psicanalise",
    },
  },
  {
    q: "Como saber se preciso de terapia?",
    a: "Não é necessário estar em uma crise para procurar ajuda psicológica. A terapia pode fazer sentido diante de sofrimento emocional, ansiedade, dificuldades nos relacionamentos, baixa autoestima ou do desejo de se compreender melhor.",
    more: {
      lead: "Veja os sinais descritos em",
      label: "como saber se preciso de terapia",
      to: "/conteudos/psicoterapia/como-saber-se-preciso-de-terapia",
    },
  },
  {
    q: "Como funciona a terapia online?",
    a: "As sessões acontecem por videochamada, em um ambiente seguro e sigiloso, para pessoas em qualquer estado do Brasil e brasileiros que vivem no exterior.",
    more: {
      lead: "Detalhes práticos em",
      label: "terapia online funciona?",
      to: "/conteudos/psicoterapia/terapia-online-funciona",
    },
  },
  {
    q: "O que acontece na primeira sessão?",
    a: "A primeira sessão é um espaço para falar sobre o que motivou a busca por terapia, esclarecer dúvidas e compreender como o acompanhamento pode ser construído a partir do seu momento.",
    more: {
      lead: "O que esperar está descrito em",
      label: "a primeira sessão de terapia",
      to: "/conteudos/psicoterapia/o-que-esperar-da-primeira-sessao",
    },
  },
  {
    q: "O que diferencia a psicanálise de outras formas de terapia?",
    a: "A psicanálise se interessa pelos significados que existem por trás dos sintomas e dos padrões que se repetem, mais do que por respostas prontas.",
    more: {
      lead: "A comparação com a TCC está em",
      label: "qual a diferença entre psicanálise e TCC",
      to: "/conteudos/psicanalise/psicanalise-vs-tcc",
    },
  },
];

type ArticleSEOInput = {
  title: string;
  excerpt: string;
  category: string;
  categorySlug: string;
  slug: string;
  date: string;
  image?: string;
};

export function buildFullTitle(title: string): string {
  return title ? `${title} | ${SITE_NAME}` : SITE_NAME;
}

export function resolveOgImage(image?: string): string {
  if (!image) return DEFAULT_OG_IMAGE;
  if (image.startsWith("http")) return image;
  if (image.startsWith("/")) return `${SITE_BASE}${image}`;
  return `${SITE_BASE}/${image.replace(/^\.\//, "")}`;
}

export function getPageSEO(
  pathname: string,
  options: {
    article?: ArticleSEOInput;
    noindex?: boolean;
    faq?: FAQItem[];
  } = {},
): PageSEO {
  const canonical = pathname === "" ? "/" : pathname.startsWith("/") ? pathname : `/${pathname}`;
  const canonicalUrl = `${SITE_BASE}${canonical === "/" ? "" : canonical}` || SITE_BASE;
  const robots = options.noindex ? "noindex, nofollow" : "index, follow";

  if (options.noindex) {
    return {
      title: "Página não encontrada",
      fullTitle: `Página não encontrada | ${SITE_NAME}`,
      description: "O conteúdo que você procura não existe ou foi movido.",
      canonical,
      canonicalUrl,
      type: "website",
      robots,
      ogImage: DEFAULT_OG_IMAGE,
      jsonLd: [],
    };
  }

  if (options.article) {
    const { article } = options;
    const publishedTime = parsePtDate(article.date);
    const lastmodKey = `${article.categorySlug}/${article.slug}`;
    const modifiedTime = (ARTICLE_LASTMOD as Record<string, string>)[lastmodKey] ?? publishedTime;
    const ogImage = resolveOgImage(article.image);
    const breadcrumbs: BreadcrumbItem[] = [
      { name: "Início", path: "/" },
      { name: "Conteúdos", path: "/conteudos" },
      { name: article.category, path: `/conteudos/${article.categorySlug}` },
      { name: article.title, path: `/conteudos/${article.categorySlug}/${article.slug}` },
    ];

    return {
      title: article.title,
      fullTitle: buildFullTitle(article.title),
      description: article.excerpt,
      canonical: `/conteudos/${article.categorySlug}/${article.slug}`,
      canonicalUrl: `${SITE_BASE}/conteudos/${article.categorySlug}/${article.slug}`,
      type: "article",
      robots,
      section: article.category,
      publishedTime,
      modifiedTime,
      ogImage,
      breadcrumbs,
      faq: options.faq,
      jsonLd: buildJsonLd({
        type: "article",
        title: article.title,
        description: article.excerpt,
        canonicalUrl: `${SITE_BASE}/conteudos/${article.categorySlug}/${article.slug}`,
        section: article.category,
        publishedTime,
        modifiedTime,
        ogImage,
        breadcrumbs,
        faq: options.faq,
      }),
    };
  }

  if (canonical === "/") {
    const title = "Psicólogo Online no Brasil";
    const description =
      "Atendimento psicológico online para adultos e idosos em todo o Brasil e brasileiros no exterior. Breno Vieira, psicólogo clínico (CRP 03/36165). Psicanálise, escuta acolhedora e conteúdos sobre saúde mental.";
    return {
      title,
      fullTitle: buildFullTitle(title),
      description,
      canonical: "/",
      canonicalUrl: SITE_BASE,
      type: "website",
      robots,
      ogImage: DEFAULT_OG_IMAGE,
      faq: HOMEPAGE_FAQS,
      jsonLd: buildJsonLd({
        type: "website",
        title,
        description,
        canonicalUrl: SITE_BASE,
        ogImage: DEFAULT_OG_IMAGE,
        faq: HOMEPAGE_FAQS,
        includePerson: true,
        includeService: true,
      }),
    };
  }

  if (canonical === PERSON_PATH) {
    const title = "Sobre Breno Vieira, psicólogo clínico";
    const description =
      "Breno Vieira é psicólogo clínico (CRP 03/36165). Psicólogo formado pela Escola Bahiana de Medicina e Saúde Pública, em Salvador. Atendimento online para adultos e idosos em todo o Brasil e brasileiros no exterior, com prática orientada pela psicanálise.";
    return {
      title,
      fullTitle: buildFullTitle(title),
      description,
      canonical: PERSON_PATH,
      canonicalUrl: PERSON_URL,
      type: "website",
      robots,
      ogImage: DEFAULT_OG_IMAGE,
      breadcrumbs: [
        { name: "Início", path: "/" },
        { name: "Sobre", path: PERSON_PATH },
      ],
      jsonLd: buildJsonLd({
        type: "website",
        title,
        description,
        canonicalUrl: PERSON_URL,
        ogImage: DEFAULT_OG_IMAGE,
        breadcrumbs: [
          { name: "Início", path: "/" },
          { name: "Sobre", path: PERSON_PATH },
        ],
        includePerson: true,
      }),
    };
  }

  if (canonical === "/conteudos") {
    const title = "Psicologia e Saúde Mental: Artigos por Breno Vieira";
    const description =
      "Artigos sobre terapia, ansiedade, psicanálise, autoestima e relacionamentos escritos por Breno Vieira, psicólogo clínico com atendimento online em todo o Brasil.";
    return {
      title,
      fullTitle: buildFullTitle(title),
      description,
      canonical: "/conteudos",
      canonicalUrl: `${SITE_BASE}/conteudos`,
      type: "website",
      robots,
      ogImage: DEFAULT_OG_IMAGE,
      jsonLd: buildJsonLd({
        type: "website",
        title,
        description,
        canonicalUrl: `${SITE_BASE}/conteudos`,
        ogImage: DEFAULT_OG_IMAGE,
      }),
    };
  }

  if (canonical === "/politica-de-privacidade") {
    const title = "Política de Privacidade";
    const description =
      "Saiba como Breno Vieira, psicólogo clínico (CRP 03/36165), trata dados pessoais no site, no contato por WhatsApp e no atendimento psicológico online. Transparência, sigilo profissional e LGPD.";
    return {
      title,
      fullTitle: buildFullTitle(title),
      description,
      canonical: "/politica-de-privacidade",
      canonicalUrl: `${SITE_BASE}/politica-de-privacidade`,
      type: "website",
      robots,
      ogImage: DEFAULT_OG_IMAGE,
      jsonLd: buildJsonLd({
        type: "website",
        title,
        description,
        canonicalUrl: `${SITE_BASE}/politica-de-privacidade`,
        ogImage: DEFAULT_OG_IMAGE,
      }),
    };
  }

  const categoryMatch = canonical.match(/^\/conteudos\/([^/]+)$/);
  if (categoryMatch) {
    const slug = categoryMatch[1];
    const name = CATEGORY_NAMES[slug] ?? slug;
    const title = CATEGORY_TITLES[slug] ?? `${name}: Artigos e Conteúdos sobre ${name}`;
    const description = CATEGORY_DESCRIPTIONS[slug] ?? `Artigos sobre ${name}.`;
    return {
      title,
      fullTitle: buildFullTitle(title),
      description,
      canonical,
      canonicalUrl: `${SITE_BASE}${canonical}`,
      type: "website",
      robots,
      ogImage: DEFAULT_OG_IMAGE,
      breadcrumbs: [
        { name: "Início", path: "/" },
        { name: "Conteúdos", path: "/conteudos" },
        { name, path: canonical },
      ],
      jsonLd: buildJsonLd({
        type: "website",
        title,
        description,
        canonicalUrl: `${SITE_BASE}${canonical}`,
        ogImage: DEFAULT_OG_IMAGE,
        breadcrumbs: [
          { name: "Início", path: "/" },
          { name: "Conteúdos", path: "/conteudos" },
          { name, path: canonical },
        ],
      }),
    };
  }

  const title = "Breno Vieira | Psicólogo Clínico Online";
  const description =
    "Psicólogo clínico com atendimento online para adultos e idosos em todo o Brasil e brasileiros no exterior.";
  return {
    title,
    fullTitle: buildFullTitle(title),
    description,
    canonical,
    canonicalUrl: `${SITE_BASE}${canonical}`,
    type: "website",
    robots,
    ogImage: DEFAULT_OG_IMAGE,
    jsonLd: [],
  };
}

function personEntity(description: string): Record<string, unknown> {
  const person: Record<string, unknown> = {
    "@type": "Person",
    "@id": `${PERSON_URL}#person`,
    name: "Breno Vieira",
    jobTitle: "Psicólogo Clínico",
    description,
    url: PERSON_URL,
    image: DEFAULT_OG_IMAGE,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Salvador",
      addressRegion: "BA",
      addressCountry: "BR",
    },
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "CRP 03/36165",
    },
    alumniOf: {
      "@type": "EducationalOrganization",
      name: "Escola Bahiana de Medicina e Saúde Pública",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Salvador",
        addressRegion: "BA",
        addressCountry: "BR",
      },
    },
    knowsAbout: [
      "Psicoterapia",
      "Psicanálise",
      "Ansiedade",
      "Autoestima",
      "Relacionamentos",
      "Terapia online",
    ],
  };
  if (SOCIAL_PROFILES.length > 0) person.sameAs = SOCIAL_PROFILES;
  return person;
}

function buildJsonLd(input: {
  type: "website" | "article";
  title: string;
  description: string;
  canonicalUrl: string;
  ogImage: string;
  section?: string;
  publishedTime?: string;
  modifiedTime?: string;
  breadcrumbs?: BreadcrumbItem[];
  faq?: FAQItem[];
  includePerson?: boolean;
  includeService?: boolean;
}): object[] {
  const graphs: object[] = [];
  const person = personEntity(input.description);

  if (input.type === "article") {
    graphs.push({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: input.title,
      description: input.description,
      url: input.canonicalUrl,
      inLanguage: "pt-BR",
      image: input.ogImage,
      author: {
        "@type": "Person",
        "@id": `${PERSON_URL}#person`,
        name: "Breno Vieira",
        jobTitle: "Psicólogo Clínico",
        url: PERSON_URL,
      },
      publisher: {
        "@type": "Organization",
        name: "Breno Psicólogo",
        url: SITE_BASE,
        logo: {
          "@type": "ImageObject",
          url: DEFAULT_OG_IMAGE,
        },
      },
      articleSection: input.section,
      datePublished: input.publishedTime,
      dateModified: input.modifiedTime,
    });
  }

  if (input.breadcrumbs && input.breadcrumbs.length > 0) {
    graphs.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: input.breadcrumbs.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: `${SITE_BASE}${item.path === "/" ? "" : item.path}`,
      })),
    });
  }

  if (input.faq && input.faq.length > 0) {
    graphs.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: input.faq.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: faqAnswerText(item),
        },
      })),
    });
  }

  if (input.includePerson) {
    graphs.push({
      "@context": "https://schema.org",
      ...person,
    });
  }

  if (input.includeService) {
    graphs.push({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Breno Psicólogo",
      url: SITE_BASE,
      inLanguage: "pt-BR",
      description: input.description,
    });

    graphs.push({
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      name: "Breno Vieira, Psicólogo Clínico",
      url: SITE_BASE,
      image: DEFAULT_OG_IMAGE,
      description: input.description,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Salvador",
        addressRegion: "BA",
        addressCountry: "BR",
      },
      areaServed: [
        { "@type": "Country", name: "Brasil" },
        { "@type": "State", name: "Bahia" },
        { "@type": "City", name: "Salvador" },
      ],
      serviceType: "Psicoterapia online",
      provider: { "@id": `${PERSON_URL}#person` },
    });
  }

  return graphs;
}

export function injectHeadTags(seo: PageSEO): void {
  document.title = seo.fullTitle;

  const setMeta = (name: string, content: string) => {
    let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
    if (!el) {
      el = document.createElement("meta");
      el.name = name;
      document.head.appendChild(el);
    }
    el.content = content;
  };

  const setProp = (prop: string, content: string) => {
    let el = document.querySelector(`meta[property="${prop}"]`) as HTMLMetaElement | null;
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute("property", prop);
      document.head.appendChild(el);
    }
    el.content = content;
  };

  setMeta("description", seo.description);
  setMeta("robots", seo.robots);
  setProp("og:title", seo.fullTitle);
  setProp("og:description", seo.description);
  setProp("og:type", seo.type);
  setProp("og:site_name", "Breno Psicólogo");
  setProp("og:url", seo.canonicalUrl);
  setProp("og:locale", "pt_BR");
  setProp("og:image", seo.ogImage);
  setProp("og:image:width", String(OG_IMAGE_WIDTH));
  setProp("og:image:height", String(OG_IMAGE_HEIGHT));
  setMeta("twitter:card", "summary_large_image");
  setMeta("twitter:title", seo.fullTitle);
  setMeta("twitter:description", seo.description);
  setMeta("twitter:image", seo.ogImage);

  if (seo.type === "article") {
    setProp("article:section", seo.section ?? "");
    if (seo.publishedTime) setProp("article:published_time", seo.publishedTime);
    if (seo.modifiedTime) setProp("article:modified_time", seo.modifiedTime);
  }

  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement("link");
    link.rel = "canonical";
    document.head.appendChild(link);
  }
  link.href = seo.canonicalUrl;

  document.querySelectorAll('script[data-seo-jsonld="true"]').forEach((node) => node.remove());
  seo.jsonLd.forEach((schema, index) => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.dataset.seoJsonld = "true";
    script.id = `seo-jsonld-${index}`;
    script.textContent = JSON.stringify(schema);
    document.body.appendChild(script);
  });
}

/** Meta and social tags only. JSON-LD belongs in `<body>` for faster head parsing. */
export function buildMetaHTML(seo: PageSEO): string {
  const tags = [
    `<title>${escapeHtml(seo.fullTitle)}</title>`,
    `<meta name="description" content="${escapeAttr(seo.description)}" />`,
    `<meta name="robots" content="${escapeAttr(seo.robots)}" />`,
    `<link rel="canonical" href="${escapeAttr(seo.canonicalUrl)}" />`,
    `<meta property="og:title" content="${escapeAttr(seo.fullTitle)}" />`,
    `<meta property="og:description" content="${escapeAttr(seo.description)}" />`,
    `<meta property="og:type" content="${seo.type}" />`,
    `<meta property="og:site_name" content="Breno Psicólogo" />`,
    `<meta property="og:url" content="${escapeAttr(seo.canonicalUrl)}" />`,
    `<meta property="og:locale" content="pt_BR" />`,
    `<meta property="og:image" content="${escapeAttr(seo.ogImage)}" />`,
    `<meta property="og:image:width" content="${OG_IMAGE_WIDTH}" />`,
    `<meta property="og:image:height" content="${OG_IMAGE_HEIGHT}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeAttr(seo.fullTitle)}" />`,
    `<meta name="twitter:description" content="${escapeAttr(seo.description)}" />`,
    `<meta name="twitter:image" content="${escapeAttr(seo.ogImage)}" />`,
  ];

  if (seo.type === "article") {
    if (seo.section) tags.push(`<meta property="article:section" content="${escapeAttr(seo.section)}" />`);
    if (seo.publishedTime) tags.push(`<meta property="article:published_time" content="${escapeAttr(seo.publishedTime)}" />`);
    if (seo.modifiedTime) tags.push(`<meta property="article:modified_time" content="${escapeAttr(seo.modifiedTime)}" />`);
  }

  return tags.join("\n    ");
}

export function buildJsonLdHTML(seo: PageSEO): string {
  if (!seo.jsonLd.length) return "";
  return seo.jsonLd
    .map((schema) => `<script type="application/ld+json">${JSON.stringify(schema)}</script>`)
    .join("\n    ");
}

export function buildHeadHTML(seo: PageSEO): string {
  return [buildMetaHTML(seo), buildJsonLdHTML(seo)].filter(Boolean).join("\n    ");
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeAttr(value: string): string {
  return escapeHtml(value).replace(/"/g, "&quot;");
}

export function injectLcpPreloadsFromUrls(mobileWebp?: string, desktop?: string) {
  document.querySelectorAll("link[data-lcp-preload]").forEach((node) => node.remove());

  const add = (href: string, media?: string) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.type = "image/webp";
    link.href = href;
    link.fetchPriority = "high";
    link.dataset.lcpPreload = "true";
    if (media) link.media = media;
    document.head.appendChild(link);
  };

  if (mobileWebp) add(mobileWebp, "(max-width: 768px)");
  if (desktop) add(desktop, mobileWebp ? "(min-width: 769px)" : undefined);
}

export function getCategoryHeading(slug: string, fallback: string): string {
  return CATEGORY_HEADINGS[slug] ?? fallback;
}

export function isKnownCategory(slug: string): boolean {
  return (CATEGORY_SLUGS as readonly string[]).includes(slug);
}
