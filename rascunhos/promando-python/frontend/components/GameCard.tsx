import Image from "next/image";

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
export default function GameCard({ game }: { game: Game }) {
  return (
    <div className="group flex flex-col bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden hover:shadow-xl transition-shadow h-full">
      {/* Imagem (60-70% da altura) */}
      <div className="relative h-48 overflow-hidden">
        <Image
          width={400}
          loading="lazy"
          height={200}
          unoptimized
          src={game.image}
          alt={game.title}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
        {game.discount > 0 && (
          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{game.discount}%
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col justify-between grow">
        <div>
          <p className="text-[10px] uppercase text-gray-500 font-semibold">
            {game.store}
          </p>
          <h3 className="text-sm font-bold line-clamp-2 dark:text-white leading-tight mt-1">
            {game.title}
          </h3>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex flex-col">
            {game.discount > 0 && (
              <span className="text-[10px] text-gray-400 line-through">
                R$ {game.base_price.toFixed(2)}
              </span>
            )}
            <span className="text-lg font-black text-blue-600 dark:text-blue-400">
              R$ {game.price.toFixed(2)}
            </span>
          </div>
          <a
            href={game.url}
            target="_blank"
            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
