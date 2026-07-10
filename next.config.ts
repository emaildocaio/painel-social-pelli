import type { NextConfig } from "next";

// ---------------------------------------------------------------------------
// Painel social PRIVADO do Pelli — separado do painel público da campanha.
// Dois modos de build (igual ao painel da campanha):
//  • Local (sem GITHUB_PAGES): modo servidor normal — `next dev` na raiz.
//  • GitHub Pages (GITHUB_PAGES=true, no workflow de deploy): export estático
//    para out/, sob o basePath /painel-social-pelli (site de projeto).
// O painel é só a "casca": nenhum dado sensível vem no build. Tudo é buscado
// em runtime do feed protegido do n8n (exige a senha do grupo).
// ---------------------------------------------------------------------------
const ghPages = process.env.GITHUB_PAGES === "true";
const repo = "painel-social-pelli";

const nextConfig: NextConfig = ghPages
  ? {
      output: "export",
      basePath: `/${repo}`,
      images: { unoptimized: true },
      trailingSlash: true,
    }
  : {
      experimental: {
        turbopackFileSystemCacheForDev: false,
      },
    };

export default nextConfig;
