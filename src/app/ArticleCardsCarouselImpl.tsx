import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArticleCard, type Article } from "./App";

export default function ArticleCardsCarouselImpl({ articles }: { articles: Article[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [active, setActive] = useState(0);
  const [snapCount, setSnapCount] = useState(0);

  const syncCarousel = useCallback(() => {
    if (!emblaApi) return;
    setSnapCount(emblaApi.scrollSnapList().length);
    setActive(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    syncCarousel();
    emblaApi.on("select", syncCarousel);
    emblaApi.on("reInit", syncCarousel);
    return () => {
      emblaApi.off("select", syncCarousel);
      emblaApi.off("reInit", syncCarousel);
    };
  }, [emblaApi, syncCarousel]);

  useEffect(() => {
    if (!emblaApi) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => emblaApi.scrollNext(), 4000);
    return () => clearInterval(id);
  }, [emblaApi]);

  return (
    <div className="flex flex-col gap-4 -my-6">
      <div
        className="overflow-hidden cursor-grab active:cursor-grabbing px-4 pt-4 pb-14"
        ref={emblaRef}
      >
        <div className="flex -ml-5">
          {articles.map(a => (
            <div key={a.slug} className="min-w-0 shrink-0 grow-0 basis-1/2 pl-5 pr-2">
              <ArticleCard article={a} />
            </div>
          ))}
        </div>
      </div>
      {snapCount > 1 && (
        <div className="flex justify-center items-center gap-2" role="tablist" aria-label="Navegação do carrossel">
          {Array.from({ length: snapCount }, (_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`Slide ${i + 1}`}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`rounded-full transition-all duration-300 ${i === active ? "h-1.5 w-5 bg-[#092529]" : "h-1.5 w-1.5 bg-[rgba(9,37,41,0.18)] hover:bg-[rgba(9,37,41,0.35)]"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
