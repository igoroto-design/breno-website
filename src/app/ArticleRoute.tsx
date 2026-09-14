import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowRight, BookOpen, Share2 } from "lucide-react";
import {
  ARTICLES,
  ARTICLE_IMAGES,
  CATEGORIES,
  WA,
  sectionPad,
  ctaBtn,
  muted,
  dark,
  easeOut,
  imgAbout,
  SEOHead,
  NotFoundPage,
  MotionBox,
  Reveal,
  CTABanner,
  ArticleCard,
  ArticleCardsCarousel,
  FAQAccordion,
  Meta,
  Sep,
  CatIcon,
  WhatsAppIcon,
  sharePage,
  whatsappArticleShareUrl,
  type Article,
} from "./App";
import {
  ARTICLE_BLOCKS,
  ARTICLE_RECOMMENDED,
  ARTICLE_TOC,
  getArticleFaqs,
  slugifyHeading,
  type ArticleBlock,
} from "./articleBodies";

function ArticleSignList({ signs }: { signs: { n: number; title: string; text: string }[] }) {
  return (
    <ol className="flex flex-col divide-y divide-[rgba(9,37,41,0.08)]">
      {signs.map(s => (
        <li key={s.n} className="py-6 md:py-7 first:pt-0">
          <div className="flex flex-col gap-3 md:gap-3.5">
            <div className="flex items-baseline gap-3 md:gap-4">
              <span className="font-['Merriweather',serif] font-bold text-[20px] md:text-[22px] leading-none text-[rgba(9,37,41,0.5)] tabular-nums shrink-0">
                {String(s.n).padStart(2, "0")}
              </span>
              <h3 className="font-['Merriweather',serif] font-bold text-[#092529] text-[18px] md:text-[20px] leading-[1.3]">
                {s.title}
              </h3>
            </div>
            <p className="font-['Noto_Sans',sans-serif] text-[rgba(9,37,41,0.72)] text-[15px] md:text-[16px] leading-[1.75] md:pl-10">
              {s.text}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function ArticleTopicCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-[rgba(9,37,41,0.08)] bg-[#F8EDE4]/60 p-5 md:p-6 flex flex-col gap-2.5">
      <h3 className="font-['Merriweather',serif] font-bold text-[#092529] text-[18px] md:text-[19px] leading-[1.3]">
        {title}
      </h3>
      {text && (
        <p className="font-['Noto_Sans',sans-serif] text-[rgba(9,37,41,0.72)] text-[15px] md:text-[16px] leading-[1.75]">
          {text}
        </p>
      )}
    </div>
  );
}

function ArticleTopicGrid({ topics }: { topics: { title: string; text: string }[] }) {
  return (
    <div className="flex flex-col gap-4 md:gap-5">
      {topics.map(t => <ArticleTopicCard key={t.title} {...t} />)}
    </div>
  );
}

function ArticleThoughts({ items }: { items: string[] }) {
  return (
    <div className="rounded-2xl border border-[rgba(9,37,41,0.08)] bg-white/70 px-5 py-4 md:px-6 md:py-5 flex flex-col gap-2.5">
      {items.map((item, i) => (
        <p key={i} className="font-['Merriweather',serif] italic text-[#092529] text-[16px] md:text-[17px] leading-[1.55]">
          &ldquo;{item}&rdquo;
        </p>
      ))}
    </div>
  );
}

function ArticleAnswer({ text }: { text: string }) {
  return (
    <p className="font-['Merriweather',serif] font-bold text-[#092529] text-[22px] md:text-[26px] leading-none tracking-[-0.01em]">
      {text}
    </p>
  );
}

function ArticleCallout({ parts }: { parts: { text: string; link?: { slug: string; categorySlug: string } }[] }) {
  return (
    <div className="rounded-2xl border border-[#AFD7BF]/60 bg-[#AFD7BF]/20 px-5 py-4 md:px-6 md:py-5 flex gap-3 items-start">
      <BookOpen size={18} className="shrink-0 mt-0.5 text-[#092529]/50" aria-hidden />
      <p className="font-['Noto_Sans',sans-serif] text-[rgba(9,37,41,0.78)] text-[15px] md:text-[16px] leading-[1.75]">
        {parts.map((part, j) =>
          part.link ? (
            <Link
              key={j}
              to={`/conteudos/${part.link.categorySlug}/${part.link.slug}`}
              className="font-semibold text-[#092529] underline decoration-[#AFD7BF] decoration-2 underline-offset-[3px] hover:text-[rgba(9,37,41,0.65)] transition-colors"
            >
              {part.text}
            </Link>
          ) : (
            <span key={j}>{part.text}</span>
          ),
        )}
      </p>
    </div>
  );
}

function renderInlineParts(parts: { text: string; link?: { slug: string; categorySlug: string } }[]) {
  return parts.map((part, j) =>
    part.link ? (
      <Link
        key={j}
        to={`/conteudos/${part.link.categorySlug}/${part.link.slug}`}
        className="font-semibold text-[#092529] underline decoration-[#AFD7BF] decoration-2 underline-offset-[3px] hover:text-[rgba(9,37,41,0.65)] transition-colors"
      >
        {part.text}
      </Link>
    ) : (
      <span key={j}>{part.text}</span>
    ),
  );
}

function renderArticleBlock(block: ArticleBlock, key: number) {
  switch (block.type) {
    case "p":
      if ("parts" in block && block.parts) {
        return (
          <p key={key} className="font-['Noto_Sans',sans-serif] text-[rgba(9,37,41,0.78)] text-[16px] md:text-[17px] leading-[1.85]">
            {renderInlineParts(block.parts)}
          </p>
        );
      }
      return (
        <p key={key} className="font-['Noto_Sans',sans-serif] text-[rgba(9,37,41,0.78)] text-[16px] md:text-[17px] leading-[1.85]">
          {block.text}
        </p>
      );
    case "h2":
      return (
        <h2
          key={key}
          id={slugifyHeading(block.text)}
          className="font-['Merriweather',serif] font-bold text-[#092529] text-[24px] md:text-[28px] leading-[1.25] tracking-[-0.02em] mt-2 scroll-mt-28"
        >
          {block.text}
        </h2>
      );
    case "h3":
      return (
        <h3
          key={key}
          className="font-['Merriweather',serif] font-bold text-[#092529] text-[20px] md:text-[22px] leading-[1.3] tracking-[-0.01em] mt-1"
        >
          {block.text}
        </h3>
      );
    case "ul":
      return (
        <ul key={key} className="flex flex-col gap-2 pl-1">
          {block.items.map((item, j) => (
            <li
              key={j}
              className="flex gap-3 font-['Noto_Sans',sans-serif] text-[rgba(9,37,41,0.78)] text-[16px] md:text-[17px] leading-[1.75]"
            >
              <span className="mt-[0.55em] shrink-0 size-1.5 rounded-full bg-[#AFD7BF]" aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case "quote":
      return (
        <blockquote key={key} className="rounded-2xl border border-[rgba(9,37,41,0.08)] bg-[#F8EDE4] px-6 py-6 md:px-8 md:py-7">
          <p className="font-['Merriweather',serif] font-bold italic text-[#092529] text-[20px] md:text-[22px] leading-[1.5]">
            &ldquo;{block.text}&rdquo;
          </p>
        </blockquote>
      );
    case "image":
      return (
        <figure key={key} className="overflow-hidden rounded-3xl border border-[rgba(9,37,41,0.08)] shadow-[0_12px_40px_rgba(9,37,41,0.08)]">
          <div className="aspect-[16/10] md:aspect-[21/10]">
            <img src={block.src} alt={block.alt} width={800} height={500} loading="lazy" decoding="async" className="size-full object-cover" />
          </div>
          {block.caption && (
            <figcaption className="px-5 py-4 md:px-6 font-['Noto_Sans',sans-serif] text-[13px] leading-[1.6] text-[rgba(9,37,41,0.55)] bg-[#F8EDE4]">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    case "faq":
      return <FAQAccordion key={key} items={block.items} />;
    case "answer":
      return <ArticleAnswer key={key} text={block.text} />;
    case "thoughts":
      return <ArticleThoughts key={key} items={block.items} />;
    case "callout":
      return <div key={key} className="-mt-2 md:-mt-3"><ArticleCallout parts={block.parts} /></div>;
    default:
      return null;
  }
}

function renderArticleBlockGroup(blocks: ArticleBlock[], keyPrefix: string) {
  const nodes: React.ReactNode[] = [];
  let i = 0;
  while (i < blocks.length) {
    if (blocks[i].type === "sign") {
      const signs: { n: number; title: string; text: string }[] = [];
      while (i < blocks.length && blocks[i].type === "sign") {
        const s = blocks[i] as { type: "sign"; n: number; title: string; text: string };
        signs.push({ n: s.n, title: s.title, text: s.text });
        i++;
      }
      nodes.push(<ArticleSignList key={`${keyPrefix}-signs-${i}`} signs={signs} />);
    } else if (blocks[i].type === "topic") {
      const topics: { title: string; text: string }[] = [];
      while (i < blocks.length && blocks[i].type === "topic") {
        const t = blocks[i] as { type: "topic"; title: string; text: string };
        topics.push({ title: t.title, text: t.text });
        i++;
      }
      nodes.push(<ArticleTopicGrid key={`${keyPrefix}-topics-${i}`} topics={topics} />);
    } else {
      nodes.push(renderArticleBlock(blocks[i], i));
      i++;
    }
  }
  return nodes;
}

function ArticleContentSection({
  heading,
  blocks,
  isIntro,
}: {
  heading?: ArticleBlock;
  blocks: ArticleBlock[];
  isIntro?: boolean;
}) {
  const headingText = heading?.type === "h2" ? heading.text : "";
  const isConclusion = headingText === "Conclusão";
  const isFaq = headingText === "Perguntas frequentes";

  return (
    <section
      className={
        isIntro
          ? "flex flex-col gap-6 md:gap-7"
          : `flex flex-col gap-6 md:gap-7 pt-10 md:pt-12 border-t border-[rgba(9,37,41,0.08)] ${
              isConclusion ? "rounded-2xl border border-[rgba(9,37,41,0.08)] bg-[#F8EDE4]/40 px-6 py-8 md:px-8 md:py-10 !pt-8" : ""
            }`
      }
    >
      {heading && heading.type === "h2" && (
        <h2
          id={slugifyHeading(heading.text)}
          className={`font-['Merriweather',serif] font-bold text-[#092529] leading-[1.25] tracking-[-0.02em] scroll-mt-28 ${
            isFaq ? "text-[26px] md:text-[30px]" : "text-[24px] md:text-[28px] mt-0"
          }`}
        >
          {heading.text}
        </h2>
      )}
      <div className="flex flex-col gap-6 md:gap-7">
        {renderArticleBlockGroup(blocks, headingText || "intro")}
      </div>
    </section>
  );
}

function splitArticleSections(blocks: ArticleBlock[]) {
  const sections: { heading?: ArticleBlock; blocks: ArticleBlock[]; isIntro?: boolean }[] = [];
  let currentBlocks: ArticleBlock[] = [];
  let currentHeading: ArticleBlock | undefined;

  for (const block of blocks) {
    if (block.type === "h2") {
      if (currentHeading || currentBlocks.length) {
        sections.push({ heading: currentHeading, blocks: currentBlocks, isIntro: !currentHeading && sections.length === 0 });
      }
      currentHeading = block;
      currentBlocks = [];
    } else {
      currentBlocks.push(block);
    }
  }
  if (currentHeading || currentBlocks.length) {
    sections.push({
      heading: currentHeading,
      blocks: currentBlocks,
      isIntro: !currentHeading && sections.length === 0,
    });
  }
  return sections;
}

function ArticleBody({ blocks }: { blocks: ArticleBlock[] }) {
  const sections = splitArticleSections(blocks);
  return (
    <div className="flex flex-col gap-2 md:gap-4">
      {sections.map((section, idx) => (
        <ArticleContentSection
          key={idx}
          heading={section.heading}
          blocks={section.blocks}
          isIntro={section.isIntro}
        />
      ))}
    </div>
  );
}

function resolveArticleBlocks(article: Article): ArticleBlock[] {
  const idx = ARTICLES.findIndex(a => a.slug === article.slug && a.categorySlug === article.categorySlug);
  const midImage = ARTICLE_IMAGES[idx] ?? ARTICLE_IMAGES[0];
  let blocks: ArticleBlock[] = ARTICLE_BLOCKS[article.slug] ?? [];
  blocks = blocks.map(b =>
    b.type === "image" && !b.src ? { ...b, src: midImage } : b,
  );
  if (!ARTICLE_BLOCKS[article.slug] && blocks.length >= 8 && !blocks.some(b => b.type === "image")) {
    const mid = Math.floor(blocks.length / 2);
    blocks = [
      ...blocks.slice(0, mid),
      {
        type: "image",
        src: midImage,
        alt: article.title,
        caption: "Reflexão e autoconhecimento no processo terapêutico.",
      },
      ...blocks.slice(mid),
    ];
  }
  return blocks;
}

function ArticleToc({ slug }: { slug: string }) {
  const items = ARTICLE_TOC[slug];
  if (!items || items.length === 0) return null;
  return (
    <nav aria-label="Sumário do artigo" className="sticky top-28 flex flex-col gap-3">
      <p className="font-['Noto_Sans',sans-serif] font-bold text-[11px] uppercase tracking-[0.12em] text-[rgba(9,37,41,0.45)]">
        Neste artigo
      </p>
      <ul className="flex flex-col gap-0.5">
        {items.map((item, i) => (
          <li key={i}>
            <a
              href={`#${slugifyHeading(item.h2)}`}
              className="block py-1.5 font-['Noto_Sans',sans-serif] text-[13px] text-[rgba(9,37,41,0.55)] hover:text-[#092529] transition-colors leading-snug"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function ArticleRecommendedReading({ currentSlug }: { currentSlug: string }) {
  const recommended = ARTICLE_RECOMMENDED[currentSlug] ?? [];
  const items = recommended
    .map(r => {
      const article = ARTICLES.find(a => a.slug === r.slug && a.categorySlug === r.categorySlug);
      return article ? { article, title: r.title } : null;
    })
    .filter(Boolean);

  if (items.length === 0) return null;

  return (
    <section className="mt-10 md:mt-12 pt-10 border-t border-[rgba(9,37,41,0.08)]" aria-label="Leitura recomendada">
      <h2 className="font-['Merriweather',serif] font-bold text-[#092529] text-[22px] md:text-[24px] leading-[1.2] mb-2">
        Leitura recomendada
      </h2>
      <p className="font-['Noto_Sans',sans-serif] text-[rgba(9,37,41,0.55)] text-[15px] leading-[1.65] mb-6">
        Se você deseja aprofundar o tema, estes conteúdos podem ajudar:
      </p>
      <ul className="flex flex-col divide-y divide-[rgba(9,37,41,0.08)]">
        {items.map(({ article, title }) => (
          <li key={article.slug}>
            <Link
              to={`/conteudos/${article.categorySlug}/${article.slug}`}
              className="group flex items-center justify-between gap-4 py-4 md:py-4 transition-colors"
            >
              <span className="font-['Noto_Sans',sans-serif] font-semibold text-[#092529] text-[15px] leading-[1.45] group-hover:text-[rgba(9,37,41,0.65)] transition-colors">
                {title}
              </span>
              <ArrowRight size={15} className="shrink-0 text-[rgba(9,37,41,0.3)] group-hover:text-[#092529] group-hover:translate-x-0.5 transition-all" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function ArticlePage() {
  const { category, slug } = useParams();
  const article = ARTICLES.find(a => a.slug === slug && a.categorySlug === category);
  const catObj  = CATEGORIES.find(c => c.slug === category);
  const related = ARTICLES.filter(a => a.categorySlug === category && a.slug !== slug).slice(0, 3);
  const [shareStatus, setShareStatus] = useState<"idle" | "copied">("idle");

  const handleShare = async () => {
    if (!article || !category || !slug) return;
    const result = await sharePage({
      title: article.title,
      text: article.excerpt,
      path: `/conteudos/${category}/${slug}`,
    });
    if (result === "copied") {
      setShareStatus("copied");
      window.setTimeout(() => setShareStatus("idle"), 2000);
    }
  };

  if (!article) return <NotFoundPage />;
  const blocks = resolveArticleBlocks(article);
  const hasStructuredBody = Boolean(ARTICLE_BLOCKS[article.slug]);

  return (
    <>
      <SEOHead pathname={`/conteudos/${category}/${slug}`} article={article} faq={getArticleFaqs(article.slug)} />

      <section className="w-full bg-[#FFF7F2] border-b border-[rgba(9,37,41,0.07)]">
        <div className={`mx-auto max-w-[1280px] ${sectionPad} py-8 md:py-10 lg:py-12`}>
          <nav className="flex items-center gap-2 flex-wrap" aria-label="Localização">
            <Link to="/" className="font-['Noto_Sans',sans-serif] text-[13px] hover:text-[#092529] transition-colors" style={{ color: muted }}>Início</Link>
            <Sep />
            <Link to="/conteudos" className="font-['Noto_Sans',sans-serif] text-[13px] hover:text-[#092529] transition-colors" style={{ color: muted }}>Conteúdos</Link>
            <Sep />
            <Link to={`/conteudos/${category}`} className="font-['Noto_Sans',sans-serif] text-[13px] hover:text-[#092529] transition-colors" style={{ color: muted }}>{catObj?.name}</Link>
          </nav>

          <div className="mt-6 md:mt-8 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(280px,420px)] gap-8 lg:gap-10 items-start">
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: easeOut, delay: 0.05 }}
              className="flex flex-col gap-5 md:gap-6 min-w-0 max-w-[720px]"
            >
              <span className="inline-flex items-center gap-2 self-start bg-[#AFD7BF] text-[#092529] px-3 py-1.5 rounded-full text-[12px] font-semibold font-['Noto_Sans',sans-serif]">
                <CatIcon slug={article.categorySlug} size={12} />
                {article.category}
              </span>
              <h1 className="font-['Merriweather',serif] font-bold text-[#092529] text-[32px] md:text-[40px] lg:text-[44px] leading-[1.12] tracking-[-0.02em]">
                {article.title}
              </h1>
              <p className="font-['Noto_Sans',sans-serif] text-[rgba(9,37,41,0.72)] text-[16px] md:text-[17px] leading-[1.7]">
                {article.excerpt}
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#AFD7BF] shrink-0">
                    <img src={imgAbout} alt="Breno Vieira, psicólogo clínico" width={80} height={80} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-['Noto_Sans',sans-serif] font-bold text-[#092529] text-[13px] leading-none">Breno Vieira</p>
                    <p className="font-['Noto_Sans',sans-serif] text-[12px] mt-0.5" style={{ color: muted }}>Psicólogo Clínico · CRP 03/36165</p>
                  </div>
                </div>
                <span className="hidden sm:block w-px h-8 bg-[rgba(9,37,41,0.1)]" />
                <Meta date={article.date} readTime={article.readTime} />
                <span className="hidden sm:block w-px h-8 bg-[rgba(9,37,41,0.1)]" />
                <div className="flex items-center gap-1.5">
                  <span className="font-['Noto_Sans',sans-serif] text-[12px] font-semibold" style={{ color: muted }}>Compartilhar</span>
                  <a
                    href={whatsappArticleShareUrl(article.title, `/conteudos/${category}/${slug}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Compartilhar no WhatsApp"
                    className="w-8 h-8 rounded-xl flex items-center justify-center bg-[rgba(9,37,41,0.05)] hover:bg-[#AFD7BF] transition-colors"
                  >
                    <WhatsAppIcon size={13} className="text-[#092529]" />
                  </a>
                  <button
                    type="button"
                    onClick={handleShare}
                    aria-label={shareStatus === "copied" ? "Link copiado" : "Compartilhar"}
                    className="w-8 h-8 rounded-xl flex items-center justify-center bg-[rgba(9,37,41,0.05)] hover:bg-[#AFD7BF] transition-colors"
                  >
                    <Share2 size={13} color={dark} />
                  </button>
                  {shareStatus === "copied" && (
                    <span className="font-['Noto_Sans',sans-serif] text-[11px] font-semibold text-[#2d6b4a]">
                      Link copiado!
                    </span>
                  )}
                </div>
              </div>
            </MotionBox>

            <MotionBox
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.65, ease: easeOut, delay: 0.15 }}
              className="relative rounded-3xl overflow-hidden aspect-[16/10] lg:aspect-auto lg:h-[min(100%,320px)] lg:min-h-[280px] border border-[rgba(9,37,41,0.06)] shadow-[0_16px_48px_rgba(9,37,41,0.1)]"
            >
              <img src={article.image} alt={article.title} width={800} height={500} loading="eager" fetchPriority="high" decoding="async" className="absolute inset-0 size-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(9,37,41,0.25)] to-transparent pointer-events-none" />
            </MotionBox>
          </div>
        </div>
      </section>

      <section className="w-full bg-[#FFF7F2] py-12 md:py-16 lg:py-20">
        <div className={`mx-auto max-w-[1280px] ${sectionPad}`}>
          <div className="grid grid-cols-1 lg:grid-cols-[180px_minmax(0,1fr)] gap-10 lg:gap-14 xl:gap-16">
            <aside className="hidden lg:block">
              <ArticleToc slug={article.slug} />
            </aside>

            <article className="min-w-0 max-w-[720px] lg:max-w-none mx-auto lg:mx-0">
              {!hasStructuredBody && (
                <p className="font-['Noto_Sans',sans-serif] font-semibold text-[#092529] text-[18px] md:text-[19px] leading-[1.75] pl-5 md:pl-6 border-l-[3px] border-[#AFD7BF] mb-8 md:mb-10">
                  {article.excerpt}
                </p>
              )}

              <ArticleBody blocks={blocks} />

              <div className="mt-10 md:mt-12 rounded-2xl border border-[rgba(9,37,41,0.08)] bg-[#F8EDE4] p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="flex-1 min-w-0">
                  <p className="font-['Merriweather',serif] font-bold text-[#092529] text-[20px] md:text-[22px] leading-[1.3] mb-1.5">
                    Quer dar o primeiro passo?
                  </p>
                  <p className="font-['Noto_Sans',sans-serif] text-[rgba(9,37,41,0.72)] text-[15px] leading-[1.6]">
                    Entre em contato pelo WhatsApp para agendar sua primeira consulta online.
                  </p>
                </div>
                <a href={WA} target="_blank" rel="noopener noreferrer"
                  className={`${ctaBtn} md:shrink-0 gap-2 bg-[#092529] hover:bg-[#0e3a40] text-[#FFF7F2] px-7 py-4 rounded-xl font-['Noto_Sans',sans-serif] font-bold text-[15px] transition-colors focus-visible:outline-2 focus-visible:outline-white`}>
                  <WhatsAppIcon size={15} className="text-current" />Agendar consulta
                </a>
              </div>

              <div className="mt-10 md:mt-12 border-t border-[rgba(9,37,41,0.08)] pt-10 flex flex-col sm:flex-row gap-5 items-start">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#AFD7BF] shrink-0">
                  <img src={imgAbout} alt="Breno Vieira, psicólogo clínico" width={64} height={64} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col gap-2 min-w-0">
                  <p className="font-['Merriweather',serif] font-bold text-[#092529] text-[18px]">Breno Vieira, psicólogo clínico</p>
                  <p className="font-['Noto_Sans',sans-serif] text-[rgba(9,37,41,0.72)] text-[14px] leading-[1.7]">
                    Psicólogo clínico registrado no CRP 03/36165, com atendimento online para adultos e idosos em todo o Brasil e brasileiros no exterior. Prática orientada pela psicanálise, com escuta para ansiedade, autoestima e relacionamentos.
                  </p>
                  <Link to="/sobre" className="font-['Noto_Sans',sans-serif] font-semibold text-[13px] text-[#092529] underline decoration-[#AFD7BF] decoration-2 underline-offset-[3px]">
                    Conheça o psicólogo
                  </Link>
                  <a href={WA} target="_blank" rel="noopener noreferrer"
                    className={`${ctaBtn} gap-2 bg-[#AFD7BF] hover:bg-[#9DCAAF] px-5 py-2.5 rounded-xl font-['Noto_Sans',sans-serif] font-bold text-[#092529] text-[13px] transition-colors mt-1`}>
                    <WhatsAppIcon size={13} className="text-current" />Agendar consulta
                  </a>
                </div>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-2">
                <span className="font-['Noto_Sans',sans-serif] font-semibold text-[11px] uppercase tracking-[0.1em] mr-1" style={{ color: muted }}>Temas</span>
                {CATEGORIES.map(c => (
                  <Link key={c.slug} to={`/conteudos/${c.slug}`}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold font-['Noto_Sans',sans-serif] transition-colors
                      ${c.slug === category
                        ? "bg-[#AFD7BF] text-[#092529]"
                        : "bg-[rgba(9,37,41,0.06)] text-[rgba(9,37,41,0.6)] hover:bg-[#EBDFD6] hover:text-[#092529]"
                      }`}>
                    <CatIcon slug={c.slug} size={11} />{c.name}
                  </Link>
                ))}
              </div>

              <ArticleRecommendedReading currentSlug={article.slug} />
            </article>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className={`w-full bg-[#FFF7F2] py-14 md:py-20 lg:py-24 border-t border-[rgba(9,37,41,0.06)]`}>
          <div className={`mx-auto max-w-[1280px] ${sectionPad} flex flex-col gap-8 md:gap-10`}>
            <Reveal className="flex items-end justify-between gap-4">
              <h2 className="font-['Merriweather',serif] font-bold text-[#092529] text-[28px] md:text-[32px] lg:text-[36px] leading-[1.2]">
                Mais artigos de <em>{catObj?.name}</em>
              </h2>
              <Link to={`/conteudos/${category}`}
                className="hidden sm:inline-flex items-center gap-1.5 font-['Noto_Sans',sans-serif] font-semibold text-[rgba(9,37,41,0.45)] hover:text-[#092529] text-[13px] transition-colors shrink-0">
                Ver todos <ArrowRight size={13} />
              </Link>
            </Reveal>
            <div className="grid grid-cols-1 gap-5 md:hidden">
              {related.map(a => <ArticleCard key={a.slug} article={a} />)}
            </div>
            <div className="hidden md:block lg:hidden">
              <ArticleCardsCarousel articles={related} />
            </div>
            <div className="hidden lg:grid lg:grid-cols-3 gap-5">
              {related.map(a => <ArticleCard key={a.slug} article={a} />)}
            </div>
            <Link
              to={`/conteudos/${category}`}
              className="md:hidden flex items-center justify-center gap-2 py-4 border border-[rgba(9,37,41,0.12)] rounded-2xl font-['Noto_Sans',sans-serif] font-semibold text-[#092529] text-[14px] hover:bg-[rgba(9,37,41,0.03)]"
            >
              Ver todos de {catObj?.name} <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      )}

      <CTABanner />
    </>
  );
}
