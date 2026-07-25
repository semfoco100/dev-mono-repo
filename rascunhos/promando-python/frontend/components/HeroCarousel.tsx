"use client";
import Image from "next/image";
import React, { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

const HIGHLIGHTS = [
  {
    id: 1,
    title: "ELDEN RING",
    subtitle: "DESTAQUE DA SEMANA",
    image: "https://images.alphacoders.com/131/1311746.jpeg",
    buttonText: "Ver Oferta",
    color: "from-blue-900",
  },
  {
    id: 2,
    title: "RESIDENT EVIL 4",
    subtitle: "MELHOR PREÇO HISTÓRICO",
    image: "https://images.alphacoders.com/131/1310650.jpg",
    buttonText: "Aproveitar",
    color: "from-red-900",
  },
  {
    id: 3,
    title: "CYBERPUNK 2077",
    subtitle: "EXPANSÃO DISPONÍVEL",
    image: "https://images.alphacoders.com/134/1342621.jpg",
    buttonText: "Comprar Agora",
    color: "from-yellow-900",
  },
];

export default function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true }, 
    [
      Autoplay({ 
        delay: 5000, 
        stopOnMouseEnter: true, // Para o carrossel quando o mouse entra
        stopOnFocusIn: false, // Continua de onde parou quando o mouse sai
        playOnInit: true 
      })
    ]
  )


  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev() && emblaApi.autoplay.reset(),
    [emblaApi],
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext() && emblaApi.autoplay.reset(),
    [emblaApi],
  );

  return (
    <section className="relative p-4 max-w-7xl mx-auto group">
      <div className="overflow-hidden rounded-2xl shadow-2xl" ref={emblaRef}>
        <div className="flex">
          {HIGHLIGHTS.map((item) => (
            <div
              key={item.id}
              className="relative flex-[0_0_100%] min-w-0 h-80 md:h-112.5"
            >
              <Image
                fill // Use fill para carrosséis, fica mais fácil de gerenciar
                src={item.image}
                className="object-cover opacity-70 group-hover:scale-105 transition-transform duration-5000 ease-out"
                alt={item.title}
                priority={item.id === 1} // Carrega a primeira imagem mais rápido
              />
              <div
                className={`absolute inset-0 bg-linear-to-t ${item.color} via-transparent to-transparent opacity-60`}
              />
              <div className="absolute inset-0 bg-linear-to-r from-black/80 to-transparent" />

              <div className="absolute bottom-10 left-6 md:left-12 z-10">
                <span className="bg-blue-600 text-[10px] md:text-xs font-bold px-2 py-1 rounded mb-4 inline-block animate-pulse">
                  {item.subtitle}
                </span>
                <h2 className="text-4xl md:text-7xl font-black mb-6 tracking-tighter text-white">
                  {item.title}
                </h2>
                <button className="bg-white text-black px-10 py-4 rounded-xl font-black text-sm hover:bg-blue-500 hover:text-white transition-all transform hover:scale-105">
                  {item.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Botões de Navegação Customizados */}
      <button
        onClick={scrollPrev}
        className="absolute left-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-600"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <button
        onClick={scrollNext}
        className="absolute right-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-600"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </section>
  );
}
