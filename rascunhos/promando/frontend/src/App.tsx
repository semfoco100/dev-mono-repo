import { useEffect, useState } from "react";
import "./index.css";
import GameList from "./components/GameList";
import PlatformFilter from "./components/PlatformFilter";
import axios from "axios";
import Featured from "./components/Featured";
import { Deal } from "./types/Deals";

declare global {
  interface Window {
    igBannerConfig?: {
      lang: string;
      igr: string;
      banners: string[];
    };
  }
}

interface ApiResponse {
  deals: Deal[];
}

function App() {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

  const [deals, setDeals] = useState<Deal[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Inicializa o tema checando o localStorage ou preferência do sistema
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme === "light" || savedTheme === "dark") return savedTheme;

      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      return systemPrefersDark ? "dark" : "light";
    }
    return "light";
  });

  // Sincroniza a classe .dark no HTML para o Tailwind v4
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // Script da Instant Gaming
  useEffect(() => {
    window.igBannerConfig = {
      lang: "br",
      igr: "gamer-0ab1c21",
      banners: ["my-banner"],
    };

    const script = document.createElement("script");
    script.src = "https://www.instant-gaming.com/api/banner/partner/loader.js";
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Busca de ofertas via Axios
  useEffect(() => {
    const fetchDeals = async (): Promise<void> => {
      setLoading(true);
      try {
        const config: { params: { platformId?: number } } = { params: {} };

        if (selectedPlatform !== null) {
          config.params.platformId = selectedPlatform;
        }

        const response = await axios.get<ApiResponse>(`${API_URL}/api/deals`, config);
        setDeals(response.data.deals || []);
      } catch (error) {
        console.error("Erro ao buscar ofertas com Axios:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, [API_URL, selectedPlatform]);

  return (
    <div className="app bg-background text-text transition-colors duration-200">
      <header className="header">
        <h1 className="main-title">🎮 Promando</h1>
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-xl cursor-pointer hover:scale-105 active:scale-95 transition-all duration-200"
          aria-label="Alternar tema"
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </header>

      <Featured deals={deals} />

      {/* Conteúdo Principal com Filtros e Listagem */}
      <main className="container mx-auto max-w-7xl space-y-6 p-4 md:p-8">
        <PlatformFilter
          selectedPlatform={selectedPlatform}
          // Arrow function impede conflitos de assinaturas estritas do seu tsconfig
          onPlatformChange={(id) => setSelectedPlatform(id)}
        />
        {loading ? (
          <div className="loading flex animate-pulse items-center justify-center py-10">
            <div className="border-primary h-10 w-10 animate-pulse rounded-full border"></div>
          </div>
        ) : (
          <GameList deals={deals} />
        )}
      </main>
    </div>
  );
}

export default App;
