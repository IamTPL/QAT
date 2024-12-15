import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const isProduction = mode === "production";

  return {
    plugins: [react()],
    base: "/",
    build: {
      outDir: "dist",
      emptyOutDir: true,
      minify: isProduction ? "terser" : false,
      terserOptions: isProduction
        ? {
            compress: {
              drop_console: true,
              drop_debugger: true,
            },
            format: {
              comments: false,
            },
          }
        : {},
    },
    server: {
      proxy: {
        "/api": {
          target: "http://172.16.9.178:3000",
          changeOrigin: true,
        },
      },
      host: "0.0.0.0",
    },
  };
});
