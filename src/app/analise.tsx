"use client";

import { useMemo } from "react";
import { TrendingDown, Sparkles, AlertTriangle, MessageSquare, Clock, Hash, Target, Lightbulb, Users2 } from "lucide-react";

type Post = {
  media_id: string;
  caption?: string;
  media_type?: string;
  permalink?: string;
  timestamp?: string;
  like_count?: number;
  comments_count?: number;
};

const nf = new Intl.NumberFormat("pt-BR");
const fmt = (n: number) => nf.format(Math.round(n));
const eng = (p: Post) => (p.like_count ?? 0) + (p.comments_count ?? 0);
const ano = (p: Post) => Number((p.timestamp ?? "0").slice(0, 4));
const avg = (a: number[]) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0);
const median = (a: number[]) => {
  if (!a.length) return 0;
  const s = [...a].sort((x, y) => x - y);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
const TIPO: Record<string, string> = { IMAGE: "Imagem", VIDEO: "Reel/Vídeo", CAROUSEL_ALBUM: "Carrossel" };
const DIAS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function VBars({ dados, cor = "var(--color-gold)", altura = 120 }: { dados: { label: string; valor: number; destaque?: boolean }[]; cor?: string; altura?: number }) {
  const max = Math.max(...dados.map((d) => d.valor), 1);
  return (
    <div className="flex items-end gap-1.5 overflow-x-auto pb-1" style={{ height: altura + 28 }}>
      {dados.map((d) => (
        <div key={d.label} className="flex min-w-[34px] flex-1 flex-col items-center justify-end gap-1">
          <span className="text-[10px] font-semibold text-slate-600">{fmt(d.valor)}</span>
          <div
            className="w-full rounded-t"
            style={{ height: Math.max(2, (d.valor / max) * altura), background: d.destaque ? "var(--color-brick)" : cor }}
            title={`${d.label}: ${fmt(d.valor)}`}
          />
          <span className="whitespace-nowrap text-[10px] text-slate-500">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-line bg-white p-5 ${className}`}>{children}</div>;
}
function Titulo({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <span className="text-gold-deep">{icon}</span>
      <h3 className="text-sm font-bold text-ink">{children}</h3>
    </div>
  );
}

export default function Analise({ posts }: { posts: Post[] }) {
  const base = useMemo(() => posts.filter((p) => ano(p) >= 2020), [posts]);

  const porAno = useMemo(() => {
    const g: Record<string, Post[]> = {};
    for (const p of base) (g[String(ano(p))] ||= []).push(p);
    return Object.keys(g).sort().map((y) => ({
      ano: y,
      n: g[y].length,
      medianaEng: median(g[y].map(eng)),
      curtMed: avg(g[y].map((x) => x.like_count ?? 0)),
    }));
  }, [base]);

  const porTipo = useMemo(() => {
    const g: Record<string, Post[]> = {};
    for (const p of base) (g[p.media_type ?? "?"] ||= []).push(p);
    return ["IMAGE", "VIDEO", "CAROUSEL_ALBUM"].filter((t) => g[t]).map((t) => ({
      tipo: TIPO[t] ?? t,
      n: g[t].length,
      pct: Math.round((100 * g[t].length) / base.length),
      medianaEng: median(g[t].map(eng)),
    }));
  }, [base]);

  const porHora = useMemo(() => {
    const g: Record<number, number[]> = {};
    for (const p of base) {
      const h = new Date(new Date(p.timestamp ?? 0).getTime() - 3 * 3600 * 1000).getUTCHours();
      (g[h] ||= []).push(eng(p));
    }
    return Array.from({ length: 24 }, (_, h) => ({ label: `${h}h`, valor: g[h] ? avg(g[h]) : 0, destaque: false }))
      .filter((d) => d.valor > 0);
  }, [base]);

  const porDia = useMemo(() => {
    const g: Record<number, number[]> = {};
    for (const p of base) {
      const d = new Date(new Date(p.timestamp ?? 0).getTime() - 3 * 3600 * 1000).getUTCDay();
      (g[d] ||= []).push(eng(p));
    }
    return DIAS.map((label, i) => ({ label, valor: g[i] ? avg(g[i]) : 0 }));
  }, [base]);

  const legenda = useMemo(() => {
    const buckets: [string, (l: number) => boolean][] = [
      ["1–99", (l) => l >= 1 && l < 100],
      ["100–299", (l) => l >= 100 && l < 300],
      ["300–599", (l) => l >= 300 && l < 600],
      ["600–999", (l) => l >= 600 && l < 1000],
      ["1000+", (l) => l >= 1000],
    ];
    return buckets.map(([label, f]) => {
      const g = base.filter((p) => f((p.caption ?? "").length));
      return { label, valor: median(g.map(eng)) };
    });
  }, [base]);

  const top = useMemo(() => [...base].sort((a, b) => eng(b) - eng(a)).slice(0, 6), [base]);
  const debate = useMemo(
    () => [...base].filter((p) => (p.like_count ?? 0) >= 300)
      .sort((a, b) => (b.comments_count ?? 0) / (b.like_count ?? 1) - (a.comments_count ?? 0) / (a.like_count ?? 1))
      .slice(0, 5),
    [base],
  );
  const piores = useMemo(() => [...base].filter((p) => ano(p) >= 2024).sort((a, b) => eng(a) - eng(b)).slice(0, 5), [base]);

  const hashtags = useMemo(() => {
    const c: Record<string, number> = {};
    base.forEach((p) => (p.caption ?? "").toLowerCase().match(/#[\wà-ÿ]+/g)?.forEach((t) => (c[t] = (c[t] ?? 0) + 1)));
    return Object.entries(c).sort((a, b) => b[1] - a[1]).slice(0, 12);
  }, [base]);
  const mentions = useMemo(() => {
    const c: Record<string, number> = {};
    base.forEach((p) => (p.caption ?? "").toLowerCase().match(/@[\w.]+/g)?.forEach((t) => (c[t] = (c[t] ?? 0) + 1)));
    return Object.entries(c).sort((a, b) => b[1] - a[1]).slice(0, 12);
  }, [base]);

  const excerto = (p: Post, n = 90) => (p.caption ?? "").replace(/\n/g, " ").slice(0, n) || "(sem legenda)";

  return (
    <div className="space-y-5">
      {/* Diagnóstico */}
      <Card className="border-brick/30 bg-brick/5">
        <Titulo icon={<TrendingDown size={16} />}>Diagnóstico central</Titulo>
        <p className="text-sm leading-relaxed text-slate-700">
          O engajamento <b>despencou</b> conforme o conteúdo se institucionalizou e o volume explodiu. A conta
          <b> hiberna entre eleições e faz blitz na campanha</b> (set/2024: 108 posts) — o algoritmo pune o liga-desliga
          e cada ciclo recomeça do zero. A mediana de engajamento caiu de <b>{fmt(porAno.find((y) => y.ano === "2021")?.medianaEng ?? 0)}</b> em
          2021 para <b>{fmt(porAno.find((y) => y.ano === "2024")?.medianaEng ?? 0)}</b> em 2024.
        </p>
        <div className="mt-4">
          <p className="mb-2 text-xs font-semibold text-slate-500">Mediana de engajamento por ano</p>
          <VBars dados={porAno.map((y) => ({ label: y.ano, valor: y.medianaEng, destaque: y.ano === "2024" }))} />
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* O que funciona */}
        <Card>
          <Titulo icon={<Sparkles size={16} />}>O que funciona (DNA da conta)</Titulo>
          <p className="mb-3 text-sm text-slate-600">
            Os campeões são <b>pessoais, humanos, com humor e identidade</b> — não cards de campanha. Vacina,
            família, pets, Vasco, poesia, e <b>perguntas de mobilização</b>. É o &quot;professor gente-boa&quot; que gera alcance e afeto.
          </p>
          <ul className="space-y-1.5">
            {top.map((p) => (
              <li key={p.media_id} className="flex items-center gap-2 text-sm">
                <span className="w-14 shrink-0 font-semibold text-brick">{fmt(p.like_count ?? 0)}❤</span>
                <a href={p.permalink} target="_blank" rel="noreferrer" className="truncate text-slate-600 hover:underline">
                  {excerto(p, 60)}
                </a>
              </li>
            ))}
          </ul>
        </Card>

        {/* O que não funciona */}
        <Card>
          <Titulo icon={<AlertTriangle size={16} />}>O que não funciona (peso morto)</Titulo>
          <p className="mb-3 text-sm text-slate-600">
            <b>Card institucional/policy seco</b> — estatísticas, datas comemorativas, &quot;compartilhe esse card&quot;.
            Passa seriedade, mas mata alcance e treina o algoritmo pra baixo. Piores de 2024:
          </p>
          <ul className="space-y-1.5">
            {piores.map((p) => (
              <li key={p.media_id} className="flex items-center gap-2 text-sm">
                <span className="w-14 shrink-0 font-semibold text-slate-400">{fmt(p.like_count ?? 0)}❤</span>
                <a href={p.permalink} target="_blank" rel="noreferrer" className="truncate text-slate-500 hover:underline">
                  {excerto(p, 60)}
                </a>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Formato */}
      <Card>
        <Titulo icon={<Target size={16} />}>Formato — e por que curtida engana</Titulo>
        <div className="grid gap-4 sm:grid-cols-[1fr_1.4fr]">
          <div className="space-y-2">
            {porTipo.map((t) => (
              <div key={t.tipo} className="flex items-center justify-between rounded-lg border border-line bg-cream/40 px-3 py-2 text-sm">
                <span className="font-medium text-ink">{t.tipo}</span>
                <span className="text-slate-500">{t.pct}% · mediana {fmt(t.medianaEng)}</span>
              </div>
            ))}
          </div>
          <div className="rounded-lg bg-gold/10 p-3 text-sm leading-relaxed text-slate-700">
            <b>Reel é motor de alcance e compartilhamento, não de curtida.</b> Ex.: o reel das <i>bets</i> teve 350 curtidas
            — mas <b>6.328 views e 93 compartilhamentos</b>. Medir reel por curtida subestima seu valor. Os insights
            (alcance/salvamentos/compartilhamentos) vão reordenar o &quot;top conteúdo&quot; por alcance real.
          </div>
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Debate */}
        <Card>
          <Titulo icon={<MessageSquare size={16} />}>Gatilhos de debate</Titulo>
          <p className="mb-3 text-sm text-slate-600">Maior razão comentário/curtida — <b>pergunta + convite + anúncio + posição</b> geram conversa (forte pro algoritmo):</p>
          <ul className="space-y-1.5">
            {debate.map((p) => (
              <li key={p.media_id} className="flex items-center gap-2 text-sm">
                <span className="w-12 shrink-0 font-semibold text-gold-deep">{p.comments_count}💬</span>
                <a href={p.permalink} target="_blank" rel="noreferrer" className="truncate text-slate-600 hover:underline">
                  {excerto(p, 55)}
                </a>
              </li>
            ))}
          </ul>
        </Card>

        {/* Legenda */}
        <Card>
          <Titulo icon={<Hash size={16} />}>Tamanho de legenda</Titulo>
          <p className="mb-3 text-sm text-slate-600"><b>Legenda curta e punchy vence</b> (exceto o &quot;textão emocional&quot; autêntico). Mediana de engajamento por faixa de caracteres:</p>
          <VBars dados={legenda.map((l) => ({ label: l.label, valor: l.valor }))} altura={90} cor="var(--color-amber-400)" />
        </Card>
      </div>

      {/* Timing */}
      <Card>
        <Titulo icon={<Clock size={16} />}>Timing (BRT)</Titulo>
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-semibold text-slate-500">Engajamento médio por horário</p>
            <VBars dados={porHora} altura={90} />
            <p className="mt-2 text-xs text-slate-500">Melhores janelas: <b>21h, 13–14h, 18–20h</b>.</p>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold text-slate-500">Engajamento médio por dia</p>
            <VBars dados={porDia.map((d) => ({ label: d.label, valor: d.valor }))} altura={90} cor="var(--color-amber-400)" />
            <p className="mt-2 text-xs text-slate-500">Melhores: <b>Dom, Qua, Ter</b>. Evitar Qui/Sex e manhãs.</p>
          </div>
        </div>
      </Card>

      {/* Pilares e rede */}
      <Card>
        <Titulo icon={<Users2 size={16} />}>Pilares & rede</Titulo>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-sm text-slate-700">
              <b>Pilares:</b> Educação (marca central — &quot;professor na política&quot;), Cultura/Ciência (sarau, poesia,
              Planetário do Rio), Rio &amp; causas, e a camada humana (Vasco, família, pets, humor).
            </p>
            <div className="flex flex-wrap gap-1">
              {hashtags.map(([t, c]) => (
                <span key={t} className="rounded-full bg-cream px-2 py-0.5 text-xs text-slate-600">{t} · {c}</span>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm text-slate-700"><b>Ecossistema político</b> (perfis mais marcados) — campo progressista/PSB + educação:</p>
            <div className="flex flex-wrap gap-1">
              {mentions.map(([t, c]) => (
                <span key={t} className="rounded-full border border-line bg-white px-2 py-0.5 text-xs text-slate-600">{t} · {c}</span>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Recomendações */}
      <Card className="border-gold/40 bg-gold/5">
        <Titulo icon={<Lightbulb size={16} />}>Recomendações para o plano</Titulo>
        <ol className="list-decimal space-y-1.5 pl-5 text-sm text-slate-700">
          <li><b>Reabilitar o &quot;professor gente-boa&quot;</b> — reintroduzir camada pessoal/humor/família/Vasco/poesia entre as pautas.</li>
          <li><b>Cortar o card institucional seco</b> — transformar política pública em história/rosto/reel narrado, não infográfico.</li>
          <li><b>Cadência sustentada já</b> — baseline constante (4–5/semana) pra chegar na campanha com a conta &quot;quente&quot;, sem começar do frio.</li>
          <li><b>Reel para alcance</b> (medido por views/shares/saves) + <b>imagem/pessoal para afeto</b> + <b>pergunta/CTA para mobilização</b>.</li>
          <li><b>Legenda curta e punchy</b>; publicar Dom/Ter/Qua nas janelas 13–14h e 18–21h.</li>
        </ol>
      </Card>

      {/* Hipóteses */}
      <Card>
        <Titulo icon={<Target size={16} />}>Hipóteses para cruzar (personas · plano · clipping)</Titulo>
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-slate-700">
          <li>As pautas que <b>engajam</b> (educação, cultura/ciência, humano) batem com as <b>prioridades das personas</b>? Onde há descasamento?</li>
          <li>O <b>clipping</b> (picos de notícia) correlaciona com picos de engajamento? → oportunidades de newsjacking.</li>
          <li>O <b>plano de comunicação</b> prioriza pilares com base de engajamento comprovada — ou aposta em temas que não engajam?</li>
          <li>Formatos/horários previstos no plano vs. o que os dados mostram.</li>
        </ul>
      </Card>

      <p className="pb-2 text-center text-xs text-slate-400">
        Base: {fmt(base.length)} posts (2020–2026) · curtidas, comentários, legenda, formato e horário.
        Alcance/salvamentos/compartilhamentos entram assim que a coleta de insights concluir.
      </p>
    </div>
  );
}
