import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { MotionConfig } from "motion/react";
import { AppLayout, getArticleByPath } from "../app/App";
import { getPageSEO, buildHeadHTML, type PageSEO } from "../app/seoUtils";
import { isKnownCategory } from "../app/seoUtils";

export function render(url: string): string {
  return renderToString(
    <MotionConfig reducedMotion="always">
      <MemoryRouter initialEntries={[url]} initialIndex={0}>
        <AppLayout />
      </MemoryRouter>
    </MotionConfig>,
  );
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
    });
  }

  const categoryMatch = url.match(/^\/conteudos\/([^/]+)$/);
  if (categoryMatch && isKnownCategory(categoryMatch[1])) {
    return getPageSEO(url);
  }

  if (url === "/" || url === "/conteudos") {
    return getPageSEO(url);
  }

  return getPageSEO(url, { noindex: true });
}

export { buildHeadHTML };
