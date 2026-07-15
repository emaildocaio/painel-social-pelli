"use client";

// ===========================================================================
// Plano da Semana 1 (pré-campanha) — Instagram @renatopellizzari
// Página de decisão para aprovar com o grupo: 3 sugestões por dia, cada uma
// com estratégia e objetivo, ancoradas nos dados reais do painel (aba
// "Análise de conteúdo"). Conteúdo estático (não vem do feed).
// ===========================================================================

import {
  CalendarDays,
  Star,
  Film,
  LayoutGrid,
  Image as ImageIcon,
  Radio,
  Users,
  Clock,
  ShieldAlert,
  Target,
  Lightbulb,
  Megaphone,
} from "lucide-react";

type Objetivo = "Alcance" | "Salvamento" | "Compartilhamento" | "Comunidade" | "Afinidade";
type Persona = "Professor" | "Cultura" | "Construtor" | "Defensor";
type Formato = "Reel" | "Carrossel" | "Publicação" | "Stories";

type Opcao = {
  titulo: string;
  formato: Formato;
  resumo: string;
  estrategia: string;
  objetivo: Objetivo;
  persona: Persona;
  cta: string;
  recomendada?: boolean;
};

type Dia = {
  dia: string;
  data: string;
  foco: string;
  horario: string;
  opcoes: Opcao[];
};

// --- config visual dos rótulos --------------------------------------------
const FORMATO: Record<Formato, { icon: React.ReactNode; label: string }> = {
  Reel: { icon: <Film size={13} />, label: "Reel" },
  Carrossel: { icon: <LayoutGrid size={13} />, label: "Carrossel" },
  Publicação: { icon: <ImageIcon size={13} />, label: "Publicação" },
  Stories: { icon: <Radio size={13} />, label: "Stories" },
};

const OBJETIVO: Record<Objetivo, { classe: string; dica: string }> = {
  Alcance: { classe: "bg-brick/10 text-brick", dica: "Topo do funil — ganhar novos olhos (Reels)" },
  Salvamento: { classe: "bg-amber-400/20 text-amber-700", dica: "Utilidade — conteúdo que se guarda (cola/dado)" },
  Compartilhamento: { classe: "bg-ink/10 text-ink", dica: "Mobilização — pauta com pedido claro" },
  Comunidade: { classe: "bg-ink text-cream", dica: "Conversão — leva pro WhatsApp (a meta)" },
  Afinidade: { classe: "bg-gold/15 text-gold-deep", dica: "Relacionamento — o 'professor gente-boa'" },
};

const PERSONA_COR: Record<Persona, string> = {
  Professor: "text-brick",
  Cultura: "text-gold-deep",
  Construtor: "text-amber-700",
  Defensor: "text-ink",
};

// --- os 7 dias -------------------------------------------------------------
const DIAS: Dia[] = [
  {
    dia: "Quinta",
    data: "16/07",
    foco: "Abertura humana + gancho do Dia do Comerciante",
    horario: "18h30",
    opcoes: [
      {
        recomendada: true,
        titulo: "“O Rio que acorda cedo” — Dia do Comerciante",
        formato: "Publicação",
        resumo:
          "Foto do Renato numa rua comercial (Tijuca/Campo Grande) com um comerciante + faixa com o título. Homenagem à data e microproposta: abrir empresa no RJ ainda leva ~40 dias.",
        estrategia:
          "Data comemorativa só engaja com rosto e rua — o card institucional seco é o pior formato do histórico. Abre a semana no registro humano, sem tom de campanha.",
        objetivo: "Afinidade",
        persona: "Construtor",
        cta: "Segue + link na bio",
      },
      {
        titulo: "“3 perguntas que todo comerciante já se fez”",
        formato: "Reel",
        resumo:
          "Reel curto (~20s) com 3 dores de quem tem comércio no Rio (burocracia, imposto, segurança) e a visão do Renato em uma frase cada.",
        estrategia:
          "Reel é o motor de alcance (mediana 3.601 de alcance vs. quase nada no feed antigo). Formato de lista/pergunta prende nos primeiros segundos.",
        objetivo: "Alcance",
        persona: "Construtor",
        cta: "Salva + segue",
      },
      {
        titulo: "“Começa uma fase nova por aqui” (bastidor)",
        formato: "Stories",
        resumo:
          "3–4 telas de bastidor do Renato + enquete “você acompanha política no Instagram?”. Aquecimento leve da conta.",
        estrategia:
          "Bastidor humano + enquete sinalizam interação ao algoritmo logo no 1º dia — combate direto ao diagnóstico do ‘liga-desliga’ que derruba o alcance.",
        objetivo: "Afinidade",
        persona: "Professor",
        cta: "Enquete + sticker de link",
      },
    ],
  },
  {
    dia: "Sexta",
    data: "17/07",
    foco: "Bastidor humano / rotina do professor",
    horario: "13h + 19h",
    opcoes: [
      {
        recomendada: true,
        titulo: "Série “Um dia na minha vida: da sala de aula pra rua”",
        formato: "Stories",
        resumo:
          "5–6 telas: manhã de professor → rua ouvindo o Rio → tarde no Planetário → tela-fecho com sticker de link pra Comunidade.",
        estrategia:
          "Bastidor pessoal é conteúdo campeão de afinidade; o Stories carrega o 1º link do funil da semana sem pedir nada em troca.",
        objetivo: "Comunidade",
        persona: "Professor",
        cta: "Sticker de link → Comunidade",
      },
      {
        titulo: "“A cola que o professor libera”",
        formato: "Publicação",
        resumo:
          "Card/carrossel-‘cola’ de cidadania (ex.: como ler, em 4 passos, pra onde vai a verba da sua escola), no visual do post recordista de salvamentos.",
        estrategia:
          "O post “ESSA COLA O PROFESSOR LIBERA” é o nº 1 em salvamentos do histórico (445). Replicar o formato-cola é a aposta mais segura em utilidade.",
        objetivo: "Salvamento",
        persona: "Professor",
        cta: "Salva essa cola",
      },
      {
        titulo: "“O professor fora da sala”",
        formato: "Reel",
        resumo:
          "Reel leve/bem-humorado do Renato na rotina fora da aula (feira, torcida, filho). Mostra a pessoa por trás do professor.",
        estrategia:
          "Humor + humano ampliam alcance sem cair no tom institucional que afunda o engajamento.",
        objetivo: "Alcance",
        persona: "Professor",
        cta: "Segue",
      },
    ],
  },
  {
    dia: "Sábado",
    data: "18/07",
    foco: "Afeto / vida pessoal (‘professor gente-boa’)",
    horario: "13h",
    opcoes: [
      {
        recomendada: true,
        titulo: "“Antes de qualquer cargo”",
        formato: "Publicação",
        resumo:
          "Foto real: pai do Matteus, professor, torcedor sofredor. Legenda curta em 1ª pessoa conectando afeto → cuidar da escola em escala maior.",
        estrategia:
          "Família e afeto estão entre os temas de maior engajamento do histórico. É a recomendação nº 1 do painel: reabilitar o ‘professor gente-boa’.",
        objetivo: "Afinidade",
        persona: "Professor",
        cta: "Marca um amigo professor",
      },
      {
        titulo: "“Meu time sofre, mas eu não desisto”",
        formato: "Reel",
        resumo:
          "Metáfora do futebol (Vasco) → persistência com a educação do Rio. Reel de fim de semana, tom carioca.",
        estrategia:
          "Vasco/futebol é tema campeão e genuinamente carioca; reel garante o alcance no sábado.",
        objetivo: "Alcance",
        persona: "Professor",
        cta: "Comenta seu time",
      },
      {
        titulo: "“Quem defende gente, defende bicho também”",
        formato: "Publicação",
        resumo:
          "Foto com os cães Barão e Duquesa, com uma linha sobre cuidado e direitos.",
        estrategia:
          "Pets engajam muito e já é o motivo nº 23 dos ‘40 motivos’. Afeto puro, custo de produção zero.",
        objetivo: "Afinidade",
        persona: "Defensor",
        cta: "Deixa um 🐾 no comentário",
      },
    ],
  },
  {
    dia: "Domingo",
    data: "19/07",
    foco: "ÂNCORA de alcance + 1ª grande chamada pra Comunidade",
    horario: "19h · melhor dia da semana",
    opcoes: [
      {
        recomendada: true,
        titulo: "“Antes de político, professor” (apresentação)",
        formato: "Reel",
        resumo:
          "Reel 30–40s: 20 anos de sala de aula + gestão do Planetário (R$30 mi captados) → “quero levar a sala de aula pra ALERJ”. Fecho convidando pra Comunidade.",
        estrategia:
          "Reels de marco/identidade têm o maior alcance do histórico (recorde 50.727, o post do Paulo Freire). Domingo é o melhor dia. Transforma alcance em entrada no funil.",
        objetivo: "Comunidade",
        persona: "Professor",
        cta: "Link na bio → Comunidade  ·  CTA #1",
      },
      {
        titulo: "“Quem é o Pelli em 6 fatos”",
        formato: "Carrossel",
        resumo:
          "Álbum de apresentação salvável — trajetória, entregas e bandeiras em 6 telas.",
        estrategia:
          "Formato salvável para quem chega pela 1ª vez pelo Reel; funciona como ‘cartão de visita’ fixável.",
        objetivo: "Salvamento",
        persona: "Professor",
        cta: "Salva + segue",
      },
      {
        titulo: "“O dia em que captei R$30 milhões pro Planetário”",
        formato: "Reel",
        resumo:
          "Storytelling da maior entrega como gestor, com imagens da reforma.",
        estrategia:
          "Prova de entrega + ciência/Planetário (tema campeão) constroem autoridade — o diferencial ‘explica como professor, entrega como gestor’.",
        objetivo: "Alcance",
        persona: "Professor",
        cta: "Link na bio",
      },
    ],
  },
  {
    dia: "Segunda",
    data: "20/07",
    foco: "Mobilização + coleta de pauta",
    horario: "13h + 20h",
    opcoes: [
      {
        recomendada: true,
        titulo: "Enquete “Qual o maior problema da escola do seu bairro?”",
        formato: "Stories",
        resumo:
          "4 telas: pergunta → enquete (estrutura / merenda / segurança / professor) → repost de respostas com comentário do Renato → fecho com sticker de link.",
        estrategia:
          "Perguntas de mobilização estão entre os conteúdos que mais engajam; as respostas viram pauta de conteúdo e alimentam a Comunidade.",
        objetivo: "Comunidade",
        persona: "Defensor",
        cta: "Responde + entra na Comunidade",
      },
      {
        titulo: "“Você sabe pra onde vai o dinheiro da sua escola?”",
        formato: "Reel",
        resumo:
          "Reel-pergunta sobre fiscalização do orçamento (os 25% da arrecadação, o FUNDEB) explicado em linguagem simples.",
        estrategia:
          "Reel + dado + pergunta = alcance e salvamento. Educação cívica é o território mais forte do Renato.",
        objetivo: "Alcance",
        persona: "Professor",
        cta: "Salva + comenta",
      },
      {
        titulo: "“Escola é lugar de aula, não de operação”",
        formato: "Publicação",
        resumo:
          "Print de fala do Renato (formato tweet), pauta de segurança inteligente perto das escolas.",
        estrategia:
          "Advocacy de pauta com pedido claro gera compartilhamento (o post do Paulo Freire fez 395). Print é formato leve e replicável.",
        objetivo: "Compartilhamento",
        persona: "Defensor",
        cta: "Compartilha nos stories",
      },
    ],
  },
  {
    dia: "Terça",
    data: "21/07",
    foco: "Utilidade salvável (cola) + Comunidade",
    horario: "19h · ótimo dia",
    opcoes: [
      {
        recomendada: true,
        titulo: "“O que faz um deputado estadual?”",
        formato: "Carrossel",
        resumo:
          "6 slides didáticos: faz as leis do RJ, fiscaliza o governador, aprova o orçamento (inclusive o da sua escola). Fecho: salva + entra na Comunidade.",
        estrategia:
          "Educação cívica ‘cola’ é o conteúdo de maior salvamento; terça é ótimo dia. Salvamento e compartilhamento puxam pra Comunidade.",
        objetivo: "Comunidade",
        persona: "Professor",
        cta: "Salva + link na bio  ·  CTA #2",
      },
      {
        titulo: "“A cola do professor: 5 direitos que a lei já garante à sua escola”",
        formato: "Carrossel",
        resumo:
          "Carrossel-‘cola’ com direitos concretos (piso, 1/3 de planejamento, merenda, transporte, infraestrutura).",
        estrategia:
          "Replica direto o formato recordista de salvamentos (‘cola do professor’) — utilidade máxima com a autoridade do Renato.",
        objetivo: "Salvamento",
        persona: "Professor",
        cta: "Salva essa cola",
      },
      {
        titulo: "“Deputado estadual em 30 segundos”",
        formato: "Reel",
        resumo: "Versão em vídeo do mesmo conteúdo do carrossel, para quem não salva.",
        estrategia:
          "Reel garante o alcance de quem passa rápido; complementa o carrossel salvável do mesmo dia.",
        objetivo: "Alcance",
        persona: "Professor",
        cta: "Segue + salva",
      },
    ],
  },
  {
    dia: "Quarta",
    data: "22/07",
    foco: "ÂNCORA de alcance + CTA “comente QUERO”",
    horario: "20h · ótimo dia",
    opcoes: [
      {
        recomendada: true,
        titulo: "“3 coisas que dá pra fazer JÁ pela escola”",
        formato: "Reel",
        resumo:
          "Reel 30–45s: 1/3 de planejamento, merenda de verdade (hoje R$1,08/dia por aluno) e climatização. Fecho: “comenta QUERO que te mando o convite da Comunidade”.",
        estrategia:
          "Reel + educação + pedido claro = alcance e compartilhamento. Encerra a semana convertendo alcance direto em membros da Comunidade.",
        objetivo: "Comunidade",
        persona: "Professor",
        cta: "Comente QUERO  ·  CTA #3",
      },
      {
        titulo: "“3 coisas pela escola” (versão salvável)",
        formato: "Carrossel",
        resumo: "Mesmo conteúdo em carrossel, com o mesmo CTA de comentário.",
        estrategia:
          "Salvamento como reforço para quem prefere guardar a lista; mantém o mesmo gatilho ‘comente QUERO’.",
        objetivo: "Salvamento",
        persona: "Professor",
        cta: "Salva + comenta QUERO",
      },
      {
        titulo: "“Merenda a R$1,08 por dia: dá pra fazer melhor”",
        formato: "Reel",
        resumo:
          "Reel-dado: indignação com proposta (compra direto da agricultura familiar, mais verba fiscalizada).",
        estrategia:
          "Dado forte + proposta concreta = compartilhamento e debate — sempre problema → solução, nunca só denúncia.",
        objetivo: "Compartilhamento",
        persona: "Defensor",
        cta: "Comente QUERO",
      },
    ],
  },
];

export default function Plano() {
  return (
    <div className="space-y-5">
      {/* Cabeçalho / tese da semana */}
      <section className="rounded-2xl border border-line bg-white p-5">
        <div className="mb-3 flex items-center gap-2">
          <CalendarDays size={18} className="text-gold-deep" />
          <h2 className="text-base font-bold text-ink">Plano da Semana 1 · 16–22/07</h2>
          <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[11px] font-semibold text-gold-deep">
            pré-campanha
          </span>
        </div>
        <p className="text-sm leading-relaxed text-slate-700">
          <strong>Tese:</strong> a conta engaja quando é o <strong>“professor gente-boa”</strong> — humano,
          didático, com pergunta de mobilização — e perde quando vira político institucional. A semana
          reabilita esse rosto, ancora tudo em <strong>educação</strong>, usa <strong>Reels para alcance</strong> e
          transforma esse alcance em entradas na <strong>Comunidade do Pelli</strong> (WhatsApp).
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <MiniStat valor="4.699 → 225" label="mediana de engajamento (2021→2024)" />
          <MiniStat valor="3.601" label="alcance mediano (~7% dos seguidores)" />
          <MiniStat valor="Reels" label="motor de alcance e compartilhamento" />
          <MiniStat valor="Dom/Ter/Qua" label="melhores dias · 13–14h e 18–21h" />
        </div>
        <div className="mt-4 flex flex-wrap items-start gap-3 rounded-xl border border-line bg-cream/40 p-3 text-xs text-slate-600">
          <ShieldAlert size={15} className="mt-0.5 shrink-0 text-brick" />
          <p>
            <strong>Compliance TSE (pré-campanha):</strong> nenhuma peça pede voto nem usa número como pedido de
            voto antes de 16/08. Todo CTA é <em>seguir / participar / entrar na Comunidade</em>. A automação
            “comente QUERO” ainda não está no ar — nesta semana o link vai por resposta manual + bio + Stories.
          </p>
        </div>
      </section>

      {/* Legenda de objetivos (o funil) */}
      <section className="rounded-2xl border border-line bg-white p-4">
        <div className="mb-2 flex items-center gap-2">
          <Target size={15} className="text-gold-deep" />
          <h3 className="text-sm font-bold text-ink">Objetivos (o funil)</h3>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {(Object.keys(OBJETIVO) as Objetivo[]).map((o) => (
            <div key={o} className="flex items-start gap-2">
              <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${OBJETIVO[o].classe}`}>{o}</span>
              <span className="text-[11px] leading-tight text-slate-500">{OBJETIVO[o].dica}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Os 7 dias */}
      {DIAS.map((d) => (
        <section key={d.data} className="rounded-2xl border border-line bg-white p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
            <div className="flex items-baseline gap-2">
              <h3 className="text-lg font-bold text-ink">{d.dia}</h3>
              <span className="text-sm font-semibold text-brick">{d.data}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <Clock size={13} /> {d.horario}
            </div>
            <p className="w-full text-sm text-slate-600">
              <Megaphone size={13} className="mr-1 inline text-gold-deep" />
              Foco do dia: <strong className="text-ink">{d.foco}</strong>
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
            {d.opcoes.map((op, i) => (
              <OpcaoCard key={i} op={op} n={i + 1} />
            ))}
          </div>
        </section>
      ))}

      {/* Rodapé */}
      <p className="px-1 pb-2 text-center text-xs text-slate-500">
        Escolha 1 opção por dia com o grupo. A recomendada ⭐ é a de melhor aderência aos dados do painel.
        Após aprovar, geramos os criativos estáticos no Claude Design.
      </p>
    </div>
  );
}

function MiniStat({ valor, label }: { valor: string; label: string }) {
  return (
    <div className="rounded-xl border border-line bg-cream/40 p-3">
      <p className="text-base font-bold text-ink">{valor}</p>
      <p className="mt-0.5 text-[11px] leading-tight text-slate-500">{label}</p>
    </div>
  );
}

function OpcaoCard({ op, n }: { op: Opcao; n: number }) {
  const fmt = FORMATO[op.formato];
  return (
    <div
      className={`flex flex-col rounded-xl border p-4 ${
        op.recomendada ? "border-gold bg-gold/[0.06]" : "border-line bg-cream/20"
      }`}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1 rounded-full border border-line bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-600">
          {fmt.icon} {fmt.label}
        </span>
        {op.recomendada ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-gold px-2 py-0.5 text-[11px] font-bold text-white">
            <Star size={11} /> Recomendada
          </span>
        ) : (
          <span className="text-[11px] font-medium text-slate-400">Opção {n}</span>
        )}
      </div>

      <h4 className="text-sm font-bold leading-snug text-ink">{op.titulo}</h4>
      <p className="mt-1.5 text-xs leading-relaxed text-slate-600">{op.resumo}</p>

      <div className="mt-3 space-y-2 border-t border-line pt-3">
        <p className="flex items-start gap-1.5 text-xs leading-relaxed text-slate-600">
          <Lightbulb size={13} className="mt-0.5 shrink-0 text-gold-deep" />
          <span>
            <strong className="text-ink">Estratégia:</strong> {op.estrategia}
          </span>
        </p>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${OBJETIVO[op.objetivo].classe}`}>
          {op.objetivo}
        </span>
        <span className={`rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold ${PERSONA_COR[op.persona]}`}>
          {op.persona}
        </span>
      </div>
      <p className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
        <Users size={12} className="text-brick" /> {op.cta}
      </p>
    </div>
  );
}
