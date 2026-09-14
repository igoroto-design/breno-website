/** Extract LCP image preload tags from prerendered app HTML. */
export function extractLcpPreloadHTML(html) {
  const tags = [];

  const mobileMatch = html.match(/media="\(max-width: 768px\)"[^>]*srcSet="([^"]+\.webp)"/);
  const desktopMatch = html.match(/media="\(min-width: 769px\)" srcSet="([^"]+)"/);

  if (mobileMatch) {
    tags.push(
      `<link rel="preload" as="image" type="image/webp" href="${mobileMatch[1]}" media="(max-width: 768px)" fetchpriority="high" />`,
    );
  }

  if (desktopMatch) {
    tags.push(
      `<link rel="preload" as="image" type="image/webp" href="${desktopMatch[1]}" media="(min-width: 769px)" fetchpriority="high" />`,
    );
  }

  return tags.length ? `\n    ${tags.join("\n    ")}` : "";
}

/** Inject or replace LCP preload link tags in document.head (client navigation). */
export function injectLcpPreloads(html) {
  document.querySelectorAll("link[data-lcp-preload]").forEach((node) => node.remove());

  const mobileMatch = html.match(/media="\(max-width: 768px\)"[^>]*srcSet="([^"]+\.webp)"/);
  const desktopMatch = html.match(/media="\(min-width: 769px\)" srcSet="([^"]+)"/);

  const add = (href, media) => {
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

  if (mobileMatch) add(mobileMatch[1], "(max-width: 768px)");
  if (desktopMatch) add(desktopMatch[1], mobileMatch ? "(min-width: 769px)" : undefined);
}
