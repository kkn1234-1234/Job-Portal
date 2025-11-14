import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import { transform } from "esbuild";
import react from "@vitejs/plugin-react";

function jsAsJsxPlugin() {
  return {
    name: "load-js-files-as-jsx",
    enforce: "pre",
    async transform(code, id) {
      const [filepath] = id.split("?");

      if (!filepath.endsWith(".js") || filepath.includes("node_modules")) {
        return null;
      }

      const result = await transform(code, {
        loader: "jsx",
        jsx: "automatic",
        sourcefile: id,
        sourcemap: true,
      });

      return {
        code: result.code,
        map: result.map,
      };
    },
  };
}

export default defineConfig({
  plugins: [
    jsAsJsxPlugin(),
    react({
      include: ["**/*.jsx", "**/*.js", "**/*.tsx", "**/*.ts"],
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  esbuild: {
    loader: "jsx",
    include: /src\/.*\.[jt]sx?$/,
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".js": "jsx",
        ".jsx": "jsx",
      },
    },
  },
});
