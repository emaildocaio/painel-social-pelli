"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Heart,
  MessageCircle,
  Users,
  UserPlus,
  Grid3x3,
  ExternalLink,
  Lock,
  RefreshCw,
  TrendingUp,
  LogOut,
} from "lucide-react";

// Feed protegido servido pelo n8n. A "casca" é pública; os dados só vêm com a
// senha certa (?key=...). Sem senha, o feed responde 401 e o painel não mostra nada.
const FEED_URL = "https://emaildocaio.app.n8n.cloud/webhook/feed-social-pelli";
const STORAGE_KEY = "pelli-social-key";

type Perfil = {
  username?: string;
  name?: string;
  followers_count?: number;
  follows_count?: number;
  media_count?: number;
  data?: string;
};

type Snapshot = {
  data?: string;
  followers_count?: number;
  follows_count?: number;
  media_count?: number;
};

type Post = {
  media_id: string;
  caption?: string;
  media_type?: string;
  permalink?: string;
  media_url?: string;
  thumbnail_url?: string;
  timestamp?: string;
  like_count?: number;
  comments_count?: number;
};

type Feed = {
  atualizadoEm?: string;
  perfil?: Perfil | null;
  historico?: Snapshot[];
  posts?: Post[];
};

const nf = new Intl.NumberFormat("pt-BR");
const fmt = (n?: number) => (typeof n === "number" ? nf.format(n) : "—");

function dataCurta(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

function dataHora(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
}

const engajamento = (p: Post) => (p.like_count ?? 0) + (p.comments_count ?? 0);

const TIPO_LABEL: Record<string, string> = {
  IMAGE: "Imagem",
  VIDEO: "Reel/Vídeo",
  CAROUSEL_ALBUM: "Carrossel",
};

export default function Home() {
  const [key, setKey] = useState<string | null>(null);
  const [senha, setSenha] = useState("");
  const [data, setData] = useState<Feed | null>(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [ordenar, setOrdenar] = useState<"engajamento" | "curtidas" | "comentarios" | "recentes">("engajamento");
  const [tipoFiltro, setTipoFiltro] = useState<string>("todos");
  const [anoFiltro, setAnoFiltro] = useState<string>("todos");
  const [visiveis, setVisiveis] = useState(60);

  const buscar = useCallback(async (chave: string) => {
    setLoading(true);
    setErro(null);
    try {
      const res = await fetch(`${FEED_URL}?key=${encodeURIComponent(chave)}`, { cache: "no-store" });
      if (res.status === 401) {
        setErro("Senha incorreta.");
        setData(null);
        sessionStorage.removeItem(STORAGE_KEY);
        setKey(null);
        return false;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as Feed;
      setData(json);
      sessionStorage.setItem(STORAGE_KEY, chave);
      setKey(chave);
      return true;
    } catch {
      setErro("Não foi possível carregar os dados. Tente novamente.");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const salva = typeof window !== "undefined" ? sessionStorage.getItem(STORAGE_KEY) : null;
    if (salva) {
      setKey(salva);
      void buscar(salva);
    }
  }, [buscar]);

  const anos = useMemo(() => {
    const set = new Set<string>();
    for (const p of data?.posts ?? []) {
      const y = new Date(p.timestamp ?? 0).getFullYear();
      if (!Number.isNaN(y)) set.add(String(y));
    }
    return [...set].sort((a, b) => Number(b) - Number(a));
  }, [data]);

  const posts = useMemo(() => {
    let arr = [...(data?.posts ?? [])];
    if (tipoFiltro !== "todos") arr = arr.filter((p) => p.media_type === tipoFiltro);
    if (anoFiltro !== "todos") arr = arr.filter((p) => String(new Date(p.timestamp ?? 0).getFullYear()) === anoFiltro);
    arr.sort((a, b) => {
      if (ordenar === "curtidas") return (b.like_count ?? 0) - (a.like_count ?? 0);
      if (ordenar === "comentarios") return (b.comments_count ?? 0) - (a.comments_count ?? 0);
      if (ordenar === "recentes") return new Date(b.timestamp ?? 0).getTime() - new Date(a.timestamp ?? 0).getTime();
      return engajamento(b) - engajamento(a);
    });
    return arr;
  }, [data, ordenar, tipoFiltro, anoFiltro]);

  useEffect(() => {
    setVisiveis(60);
  }, [ordenar, tipoFiltro, anoFiltro]);

  const perfil = data?.perfil ?? null;

  function sair() {
    sessionStorage.removeItem(STORAGE_KEY);
    setKey(null);
    setData(null);
    setSenha("");
  }

  // ---------- Tela de senha ----------
  if (!key || !data) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (senha.trim()) void buscar(senha.trim());
          }}
          className="w-full max-w-sm rounded-2xl border border-line bg-white p-8 shadow-sm"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gold/15 text-gold-deep">
            <Lock size={22} />
          </div>
          <h1 className="text-xl font-bold text-ink">Painel de Redes</h1>
          <p className="mb-6 mt-1 text-sm text-slate-600">
            Acesso restrito · Renato Pellizzari
          </p>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Senha de acesso</label>
          <input
            type="password"
            value={senha}
            autoFocus
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Digite a senha do grupo"
            className="w-full rounded-lg border border-line bg-cream/40 px-3 py-2.5 text-ink outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
          />
          {erro && <p className="mt-2 text-sm text-brick">{erro}</p>}
          <button
            type="submit"
            disabled={loading || !senha.trim()}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-gold px-4 py-2.5 font-semibold text-white transition hover:bg-gold-deep disabled:opacity-50"
          >
            {loading ? <RefreshCw size={16} className="animate-spin" /> : null}
            {loading ? "Entrando…" : "Entrar"}
          </button>
        </form>
      </main>
    );
  }

  // ---------- Dashboard ----------
  return (
    <main className="mx-auto w-full max-w-[1100px] px-4 py-6 sm:px-6 lg:py-8">
      {/* Header */}
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-ink">{perfil?.name ?? "Renato Pellizzari"}</h1>
            {perfil?.username && (
              <a
                href={`https://instagram.com/${perfil.username}`}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-medium text-brick hover:underline"
              >
                @{perfil.username}
              </a>
            )}
          </div>
          <p className="mt-0.5 text-sm text-slate-600">
            Painel de redes · atualizado {dataHora(data?.atualizadoEm)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => key && buscar(key)}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-cream disabled:opacity-50"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} /> Atualizar
          </button>
          <button
            onClick={sair}
            className="flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-cream"
          >
            <LogOut size={15} /> Sair
          </button>
        </div>
      </header>

      {/* KPIs */}
      <section className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Kpi icon={<Users size={18} />} label="Seguidores" value={fmt(perfil?.followers_count)} destaque />
        <Kpi icon={<UserPlus size={18} />} label="Seguindo" value={fmt(perfil?.follows_count)} />
        <Kpi icon={<Grid3x3 size={18} />} label="Publicações" value={fmt(perfil?.media_count)} />
      </section>

      {/* Evolução de seguidores */}
      <section className="mb-6 rounded-2xl border border-line bg-white p-5">
        <div className="mb-3 flex items-center gap-2">
          <TrendingUp size={16} className="text-gold-deep" />
          <h2 className="text-sm font-semibold text-ink">Evolução de seguidores</h2>
        </div>
        <Sparkline pontos={data?.historico ?? []} />
      </section>

      {/* Posts */}
      <section>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-ink">Desempenho dos posts · {fmt(posts.length)}</h2>
          <div className="flex flex-wrap gap-1">
            {(
              [
                ["engajamento", "Engajamento"],
                ["curtidas", "Curtidas"],
                ["comentarios", "Comentários"],
                ["recentes", "Recentes"],
              ] as const
            ).map(([val, lbl]) => (
              <button
                key={val}
                onClick={() => setOrdenar(val)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  ordenar === val
                    ? "bg-ink text-cream"
                    : "border border-line bg-white text-slate-600 hover:bg-cream"
                }`}
              >
                {lbl}
              </button>
            ))}
          </div>
        </div>

        {/* Filtros por tipo e ano */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap gap-1">
            {(
              [
                ["todos", "Todos os tipos"],
                ["IMAGE", "Imagem"],
                ["VIDEO", "Reel/Vídeo"],
                ["CAROUSEL_ALBUM", "Carrossel"],
              ] as const
            ).map(([val, lbl]) => (
              <button
                key={val}
                onClick={() => setTipoFiltro(val)}
                className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${
                  tipoFiltro === val
                    ? "bg-brick text-white"
                    : "border border-line bg-white text-slate-600 hover:bg-cream"
                }`}
              >
                {lbl}
              </button>
            ))}
          </div>
          <select
            value={anoFiltro}
            onChange={(e) => setAnoFiltro(e.target.value)}
            className="rounded-full border border-line bg-white px-3 py-1 text-xs font-medium text-slate-700 outline-none focus:border-gold"
          >
            <option value="todos">Todos os anos</option>
            {anos.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {posts.slice(0, visiveis).map((p, i) => (
            <PostCard key={p.media_id} post={p} rank={ordenar !== "recentes" ? i + 1 : undefined} />
          ))}
        </div>

        {posts.length === 0 && (
          <p className="py-8 text-center text-sm text-slate-500">Nenhum post com esses filtros.</p>
        )}

        <div className="mt-5 flex flex-col items-center gap-2">
          <p className="text-xs text-slate-500">
            Mostrando {fmt(Math.min(visiveis, posts.length))} de {fmt(posts.length)}
          </p>
          {visiveis < posts.length && (
            <button
              onClick={() => setVisiveis((v) => v + 60)}
              className="rounded-lg border border-line bg-white px-5 py-2 text-sm font-medium text-slate-700 transition hover:bg-cream"
            >
              Carregar mais
            </button>
          )}
        </div>
      </section>
    </main>
  );
}

function Kpi({
  icon,
  label,
  value,
  destaque,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  destaque?: boolean;
}) {
  return (
    <div className={`rounded-2xl border p-4 ${destaque ? "border-gold/40 bg-gold/10" : "border-line bg-white"}`}>
      <div className="flex items-center gap-1.5 text-slate-600">
        <span className={destaque ? "text-gold-deep" : "text-slate-500"}>{icon}</span>
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="mt-1 text-2xl font-bold text-ink">{value}</p>
    </div>
  );
}

function Sparkline({ pontos }: { pontos: Snapshot[] }) {
  const dados = pontos
    .filter((p) => typeof p.followers_count === "number")
    .map((p) => ({ t: new Date(p.data ?? 0).getTime(), v: p.followers_count as number, data: p.data }));

  if (dados.length < 2) {
    return (
      <p className="text-sm text-slate-500">
        Coletando histórico… o gráfico aparece conforme os dados se acumulam (coleta a cada 6h).
      </p>
    );
  }

  const w = 640;
  const h = 120;
  const pad = 8;
  const vs = dados.map((d) => d.v);
  const min = Math.min(...vs);
  const max = Math.max(...vs);
  const span = max - min || 1;
  const stepX = (w - pad * 2) / (dados.length - 1);
  const y = (v: number) => h - pad - ((v - min) / span) * (h - pad * 2);
  const pontosSvg = dados.map((d, i) => `${pad + i * stepX},${y(d.v)}`).join(" ");

  return (
    <div>
      <div className="mb-2 flex items-baseline gap-2">
        <span className="text-2xl font-bold text-ink">{fmt(dados[dados.length - 1].v)}</span>
        <Delta de={dados[0].v} para={dados[dados.length - 1].v} />
      </div>
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${w} ${h}`} className="h-28 w-full min-w-[420px]">
          <polyline points={pontosSvg} fill="none" stroke="#d99a2b" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
          {dados.map((d, i) => (
            <circle key={i} cx={pad + i * stepX} cy={y(d.v)} r={2.5} fill="#b0503f" />
          ))}
        </svg>
      </div>
      <div className="mt-1 flex justify-between text-xs text-slate-500">
        <span>{dataCurta(dados[0].data)}</span>
        <span>{dataCurta(dados[dados.length - 1].data)}</span>
      </div>
    </div>
  );
}

function Delta({ de, para }: { de: number; para: number }) {
  const d = para - de;
  if (d === 0) return <span className="text-xs text-slate-500">estável</span>;
  const pos = d > 0;
  return (
    <span className={`text-xs font-semibold ${pos ? "text-emerald-600" : "text-brick"}`}>
      {pos ? "+" : ""}
      {fmt(d)} no período
    </span>
  );
}

function PostCard({ post, rank }: { post: Post; rank?: number }) {
  const [imgErro, setImgErro] = useState(false);
  const img = post.thumbnail_url || post.media_url;
  const tipo = TIPO_LABEL[post.media_type ?? ""] ?? post.media_type ?? "";

  return (
    <a
      href={post.permalink}
      target="_blank"
      rel="noreferrer"
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition hover:shadow-md"
    >
      <div className="relative aspect-square bg-cream">
        {img && !imgErro ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={img}
            alt={post.caption?.slice(0, 40) ?? "post"}
            className="h-full w-full object-cover"
            loading="lazy"
            onError={() => setImgErro(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-400">
            <Grid3x3 size={28} />
          </div>
        )}
        <span className="absolute left-2 top-2 rounded-full bg-ink/75 px-2 py-0.5 text-[11px] font-medium text-cream">
          {tipo}
        </span>
        {rank && (
          <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gold text-xs font-bold text-white">
            {rank}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-3">
        <p className="line-clamp-2 text-sm text-slate-700">{post.caption || <span className="text-slate-400">(sem legenda)</span>}</p>
        <div className="mt-auto flex items-center gap-3 pt-3 text-sm">
          <span className="flex items-center gap-1 font-semibold text-brick">
            <Heart size={15} /> {fmt(post.like_count)}
          </span>
          <span className="flex items-center gap-1 font-semibold text-slate-600">
            <MessageCircle size={15} /> {fmt(post.comments_count)}
          </span>
          <span className="ml-auto text-xs text-slate-400">{dataCurta(post.timestamp)}</span>
          <ExternalLink size={13} className="text-slate-400 opacity-0 transition group-hover:opacity-100" />
        </div>
      </div>
    </a>
  );
}
