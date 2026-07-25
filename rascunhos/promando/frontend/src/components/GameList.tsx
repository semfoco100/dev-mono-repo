interface Deal {
  id: string;
  image: string;
  title: string;
  platform: string;
  originalPrice: number;
  salePrice: number;
  discount: number;
  affiliateLink: string;
}

interface GameListProps {
  deals: Deal[];
}

export default function GameList({ deals }: GameListProps) {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

  if (deals.length === 0) {
    return (
      <div className="no-deals flex items-center justify-center py-12">
        <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
          Nenhuma oferta encontrada. Volte mais tarde!
        </p>
      </div>
    );
  }

  return (
    <div className="games-grid grid gap-4 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
      {deals.map((deal) => (
        <div key={deal.id} className="game-card flex flex-col justify-between overflow-hidden">
          <div className="game-image relative aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
            <img
              src={`${API_URL}${deal.image}`}
              alt={deal.title}
              crossOrigin="anonymous"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>

          <div className="p-5 flex flex-col gap-3 justify-between flex-1">
            <div className="space-y-1">
              <h3 className="text-gray-900 dark:text-gray-100 text-xl font-bold tracking-wide line-clamp-2">
                {deal.title}
              </h3>
              <span className="inline-block px-2 py-0.5 text-xs font-medium text-gray-600 bg-gray-100 dark:text-gray-300 dark:bg-gray-800 rounded">
                {deal.platform}
              </span>
            </div>

            <div className="price-info flex items-baseline gap-2 mt-2">
              <span className="sale-price text-primary text-2xl font-black">
                ${deal.salePrice.toFixed(2)}
              </span>
              <span className="original-price text-gray-400 dark:text-gray-500 line-through text-sm">
                ${deal.originalPrice.toFixed(2)}
              </span>
              <span className="discount ml-auto px-1.5 py-0.5 text-xs font-bold text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30 rounded">
                -{deal.discount}%
              </span>
            </div>

            <a
              href={deal.affiliateLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn primary mt-4 w-full text-center rounded-lg py-2.5 font-bold shadow-md cursor-pointer block"
            >
              Ver Oferta
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
