import { Deal } from "../types/Deals";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback } from "react";

export default function Featured({ deals }: { deals: Deal[] }) {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", loop: false });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="featured">
      <h2 className="featured-title">Destaque</h2>
      <div className="embla">
        <div ref={emblaRef} className="embla__viewport">
          <div className="embla__container">
            {deals.map((game) => (
              <div key={game.id} className="embla__slide">
                <div className="game-featured-card">
                  <div className="game-image-container">
                    <img
                      src={`${API_URL}${game.image}`}
                      alt={game.title}
                      className="game-card-img"
                      crossOrigin="anonymous"
                      draggable="false"
                    />
                  </div>

                  <div className="game-card-content">
                    <h2 className="game-card-title">{game.title}</h2>
                    <div className="game-card-footer">
                      <span className="game-card-platform">{game.platform}</span>
                      <div className="game-card-price-group">
                        <span className="game-card-discount">-{game.discount}%</span>
                        <span className="game-card-price">${game.originalPrice.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button onClick={scrollPrev} className="embla__prev" aria-label="Voltar slide">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button onClick={scrollNext} className="embla__next" aria-label="Avançar slide">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
