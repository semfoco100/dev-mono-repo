import { useState, useEffect } from "react";

interface Platform {
  id: number;
  name: string;
}

interface PlatformFilterProps {
  selectedPlatform: number | null;
  onPlatformChange: (value: number | null | ((prev: number | null) => number | null)) => void;
}

export default function PlatformFilter({
  selectedPlatform,
  onPlatformChange,
}: PlatformFilterProps) {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

  useEffect(() => {
    const fetchPlatforms = async (): Promise<void> => {
      try {
        const response = await fetch(`${API_URL}/api/platforms`);
        const data = await response.json();
        setPlatforms(data.platforms || []);
      } catch (error) {
        console.error("Erro ao buscar plataformas:", error);
      }
    };

    fetchPlatforms();
  }, [API_URL]);

  return (
    <div className="space-y-3">
      <h2 className="text-gray-900 dark:text-white text-2xl font-bold tracking-wide">
        Plataformas
      </h2>

      <div className="platforms-list">
        <button
          type="button"
          className={`platform-btn ${
            selectedPlatform === null ? "active" : "opacity-80 hover:opacity-100"
          }`}
          onClick={() => onPlatformChange(null)}
        >
          Todas
        </button>

        {platforms.map((platform: Platform) => (
          <button
            key={platform.id}
            type="button"
            className={`platform-btn ${
              selectedPlatform === platform.id ? "active" : "opacity-80 hover:opacity-100"
            }`}
            onClick={() => onPlatformChange(platform.id)}
          >
            {platform.name}
          </button>
        ))}
      </div>
    </div>
  );
}
