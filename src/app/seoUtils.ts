import {
  CATEGORY_SLUGS,
  DEFAULT_OG_IMAGE,
  SITE_BASE,
  SITE_NAME,
  parsePtDate,
} from "./siteConfig";

export type FAQItem = { q: string; a: string };

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
  psicoterapia: "Artigos sobre psicoterapia, saúde mental e o processo terapêutico.",
  ansiedade: "Sintomas, causas e formas de lidar com a ansiedade no cotidiano.",
  psicanalise: "Compreenda a abordagem psicanalítica e seus conceitos fundamentais.",
  autoestima: "Autoconhecimento, limites e uma relação mais saudável consigo mesmo.",
  relacionamentos: "Como a psicologia pode ajudar a construir vínculos mais saudáveis e duradouros.",
};

export const HOMEPAGE_FAQS: FAQItem[] = [
  {
    q: "O que é psicanálise e como ela funciona?",
    a: "A psicanálise é uma abordagem terapêutica baseada na escuta e na reflexão sobre a história, os sentimentos e as experiências de cada sujeito. O processo busca compreender os significados que existem por trás de sintomas, conflitos emocionais e padrões que se repetem ao longo da vida.",
  },
  {
    q: "Como saber se preciso de terapia?",
    a: "Não é necessário estar em uma crise para procurar ajuda psicológica. A terapia pode ser indicada quando existe sofrimento emocional, ansiedade, dificuldades nos relacionamentos, baixa autoestima ou simplesmente o desejo de compreender melhor a si mesmo.",
  },
  {
    q: "Como funciona a terapia online?",
    a: "As sessões acontecem por videochamada, em um ambiente seguro e sigiloso. O atendimento online permite que pessoas de Salvador, da Bahia, de todo o Brasil e brasileiros que vivem no exterior tenham acesso à psicoterapia com praticidade e conforto.",
  },
  {
    q: "O que acontece na primeira sessão?",
    a: "A primeira sessão é um espaço para conversar sobre o que motivou sua busca por terapia, esclarecer dúvidas e compreender como o processo terapêutico pode ser construído de acordo com suas necessidades e momento de vida.",
  },
  {
    q: "O que diferencia a psicanálise de outras formas de terapia?",
    a: "A psicanálise busca compreender os significados que existem por trás dos sintomas, conflitos emocionais e padrões que se repetem na vida de cada pessoa. Mais do que oferecer respostas prontas, ela convida à reflexão e ao autoconhecimento.",
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
      modifiedTime: publishedTime,
      ogImage,
      breadcrumbs,
      jsonLd: buildJsonLd({
        type: "article",
        title: article.title,
        description: article.excerpt,
        canonicalUrl: `${SITE_BASE}/conteudos/${article.categorySlug}/${article.slug}`,
        section: article.category,
        publishedTime,
        modifiedTime: publishedTime,
        ogImage,
        breadcrumbs,
      }),
    };
  }

  if (canonical === "/") {
    const title = "Psicólogo Online em Salvador | Atendimento Psicológico Online";
    const description =
      "Breno Vieira, psicólogo clínico em Salvador, oferece atendimento psicológico online para adultos em todo o Brasil. Psicanálise, ansiedade, autoestima e relacionamentos.";
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
      }),
    };
  }

  if (canonical === "/conteudos") {
    const title = "Conteúdos sobre Saúde Mental e Psicologia";
    const description =
      "Artigos sobre terapia, ansiedade, psicanálise, autoestima e relacionamentos escritos por Breno Vieira, psicólogo clínico em Salvador.";
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

  const categoryMatch = canonical.match(/^\/conteudos\/([^/]+)$/);
  if (categoryMatch) {
    const slug = categoryMatch[1];
    const name = CATEGORY_NAMES[slug] ?? slug;
    const title = `${name} — Artigos e Conteúdos sobre ${name}`;
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
    "Psicólogo clínico com atendimento online para adultos e idosos em Salvador, Bahia e todo o Brasil.";
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
}): object[] {
  const graphs: object[] = [];

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
        name: "Breno Vieira",
        jobTitle: "Psicólogo Clínico",
        url: SITE_BASE,
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
          text: item.a,
        },
      })),
    });
  }

  if (input.type === "website" && input.canonicalUrl === SITE_BASE) {
    graphs.push({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Breno Psicólogo",
      url: SITE_BASE,
      inLanguage: "pt-BR",
      description: input.description,
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
    document.head.appendChild(script);
  });
}

export function buildHeadHTML(seo: PageSEO): string {
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

  seo.jsonLd.forEach((schema) => {
    tags.push(`<script type="application/ld+json">${JSON.stringify(schema)}</script>`);
  });

  return tags.join("\n    ");
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

export function injectLcpPreloadsFromUrls(mobile?: string, desktop?: string) {
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

  if (mobile) add(mobile, "(max-width: 768px)");
  if (desktop) add(desktop, mobile ? "(min-width: 769px)" : undefined);
}

export function isKnownCategory(slug: string): boolean {
  return (CATEGORY_SLUGS as readonly string[]).includes(slug);
}
