import { PassThrough } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { MotionConfig } from "motion/react";
import { AppLayout, getArticleByPath } from "../app/App";
import { getPageSEO, buildHeadHTML, buildMetaHTML, buildJsonLdHTML, type PageSEO } from "../app/seoUtils";
import { isKnownCategory } from "../app/seoUtils";
import { getArticleFaqs } from "../app/articleBodies";

function renderApp(url: string) {
  return (
    <MotionConfig reducedMotion="always">
      <MemoryRouter initialEntries={[url]} initialIndex={0}>
        <AppLayout />
      </MemoryRouter>
    </MotionConfig>
  );
}

export function render(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    let html = "";
    const passThrough = new PassThrough();

    passThrough.on("data", (chunk: Buffer) => {
      html += chunk.toString();
    });
    passThrough.on("end", () => resolve(html));
    passThrough.on("error", reject);

    const { pipe } = renderToPipeableStream(renderApp(url), {
      onAllReady() {
        pipe(passThrough);
      },
      onError(error) {
        reject(error);
      },
    });
  });
}

export function getSEO(url: string): PageSEO {
  const article = getArticleByPath(url);
  if (article) {
    return getPageSEO(url, {
      article: {
        title: article.title,
        excerpt: article.excerpt,
        category: article.category,
        categorySlug: article.categorySlug,
        slug: article.slug,
        date: article.date,
        image: article.image,
      },
      faq: getArticleFaqs(article.slug),
    });
  }

  const categoryMatch = url.match(/^\/conteudos\/([^/]+)$/);
  if (categoryMatch && isKnownCategory(categoryMatch[1])) {
    return getPageSEO(url);
  }

  if (url === "/" || url === "/conteudos" || url === "/politica-de-privacidade" || url === "/sobre") {
    return getPageSEO(url);
  }

  return getPageSEO(url, { noindex: true });
}

export { buildHeadHTML, buildMetaHTML, buildJsonLdHTML };
