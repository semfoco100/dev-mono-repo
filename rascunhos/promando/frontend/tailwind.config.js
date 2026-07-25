import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // ou @vitejs/plugin-react-swc
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss({
      // Passamos a configuração de escaneamento direto para o plugin v4 aqui:
      content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    }),
  ],
});
