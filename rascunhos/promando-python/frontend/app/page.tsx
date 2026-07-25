"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import GameCard from "@/components/GameCard";
import HeroCarousel from "@/components/HeroCarousel";

// Definição de tipo para o TypeScript
interface Game {
  id: number;
  title: string;
  image: string;
  store: string;
  price: number;
  base_price: number;
  discount: number;
  url: string;
}

export default function Home() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        // Usando Axios. No Docker, o frontend acessa via localhost no navegador
        const response = await axios.get(
          "http://localhost:8000/games?limit=12",
        );
        setGames(response.data);
      } catch (error) {
        console.error("Erro ao buscar jogos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#0b0e14] text-gray-900 dark:text-white">
      {/* Menu Superior */}
      <nav className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-white/80 dark:bg-[#0b0e14]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <h1 className="font-black text-2xl tracking-tighter italic text-blue-600">
            GAME<span className="text-gray-900 dark:text-white">TRACKER</span>
          </h1>

          {/* Links de navegação rápidos - Estilo Nuuvem */}
          <div className="hidden lg:flex gap-6 text-xs font-bold uppercase tracking-widest text-gray-400">
            <a href="#" className="hover:text-blue-500 transition-colors">
              PC
            </a>
            <a href="#" className="hover:text-blue-500 transition-colors">
              Consoles
            </a>
            <a href="#" className="hover:text-blue-500 transition-colors">
              Promoções
            </a>
          </div>
        </div>

        <div className="flex gap-3 items-center">
          <div className="relative group">
            <input
              type="text"
              placeholder="Buscar jogos..."
              className="bg-gray-100 dark:bg-gray-800 px-5 py-2 rounded-xl text-sm outline-none border-2 border-transparent focus:border-blue-500 w-40 md:w-64 transition-all"
            />
            <span className="absolute right-3 top-2.5 opacity-30">🔍</span>
          </div>

          <button
            className="p-2.5 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title="Wishlist"
          >
            ❤️
          </button>
          <button
            className="p-2.5 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title="Alternar Tema"
          >
            🌙
          </button>
        </div>
      </nav>

      <HeroCarousel />

      <section className="p-4 max-w-7xl mx-auto mt-8">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-black tracking-tight uppercase italic">
              Mais acessados <span className="text-blue-600">Desta semana</span>
            </h2>
            <div className="h-1 w-20 bg-blue-600 mt-1"></div>
          </div>
        </div>

        <div className="flex overflow-x-auto gap-6 pb-8 snap-x no-scrollbar">
          {/* Criamos blocos de 4 jogos (2x2) */}
          {Array.from({ length: 3 }).map((_, blockIndex) => (
            <div
              key={blockIndex}
              className="grid grid-cols-2 grid-rows-2 gap-4 min-w-[340px] md:min-w-[800px] snap-start snap-always"
            >
              {games.slice(blockIndex * 4, blockIndex * 4 + 4).map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Grid de Categorias: Abaixo de R$ 50 */}
      <section className="p-4 max-w-7xl mx-auto mt-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold border-l-4 border-green-500 pl-3">
            OFERTAS{" "}
            <span className="text-green-500 underline underline-offset-4">
              ATÉ R$ 50,00
            </span>
          </h2>
          <a
            href="#"
            className="text-xs font-bold text-blue-500 hover:underline"
          >
            VER TUDO
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {games
            .filter((g) => g.price <= 50)
            .slice(0, 6)
            .map((game) => (
              <div key={game.id} className="h-[280px]">
                {" "}
                {/* Versão menor do card se desejar */}
                <GameCard game={game} />
              </div>
            ))}
        </div>
      </section>

      {/* Grid de Lojas Específicas: Nuuvem */}
      <section className="p-4 max-w-7xl mx-auto mt-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold border-l-4 border-orange-500 pl-3 uppercase">
            Destaques da <span className="text-orange-500">Nuuvem</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {games
            .filter((g) => g.store === "Nuuvem")
            .slice(0, 5)
            .map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
        </div>
      </section>

      {/* Rodapé */}
      <footer className="mt-20 p-10 bg-white dark:bg-[#12161f] border-t dark:border-gray-800 text-center">
        <p className="text-gray-500 text-sm italic">
          As melhores ofertas de jogos em real (BRL) atualizadas em tempo real.
        </p>
      </footer>
    </main>
  );
}
