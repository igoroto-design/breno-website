import { useState, useEffect, useCallback, useRef } from "react";
import { motion, MotionConfig } from "motion/react";
import useEmblaCarousel from "embla-carousel-react";
import Lenis from "lenis";
import {
  BrowserRouter, Routes, Route, Link, useNavigate, useParams, useLocation,
} from "react-router-dom";
import {
  Calendar, Clock, ChevronRight, ChevronLeft, ChevronDown,
  Menu, X, MapPin, User, Brain, Heart, Smile, MessageCircle,
  CheckCircle2, BookOpen, ArrowRight, Tag, Shield,
  Lightbulb, RefreshCw, Star, Plus, Minus, Share2,
  Layers, Sparkles, Sun, Users, Wind,
} from "lucide-react";

import imgHero            from "../assets/breno-psicologo-hero.webp";
import imgAbout           from "../assets/breno-psicologo-sobre.webp";
import imgBenefits        from "../assets/beneficios-psicoterapia.webp";
import imgProcess         from "../assets/como-funciona-atendimento.webp";
import imgAnxietyWoman    from "../assets/mulher-ansiedade-sessao.webp";
import imgTherapistSupport from "../assets/psicologo-apoio-suporte.webp";
import imgManContemplative from "../assets/homem-contemplativo-psicologia.webp";
import imgOnlineWomanLaptop   from "../assets/mulher-terapia-online-laptop.webp";
import imgTherapistTalking    from "../assets/psicologo-conversa-sessao.webp";
import imgManBlackSession     from "../assets/homem-sessao-psicologia.webp";
import imgElderWomanSerene    from "../assets/mulher-idosa-serena-terapia.webp";
import imgYoungWomanSession   from "../assets/jovem-mulher-sessao-terapia.webp";
import imgManOnlineDesk       from "../assets/homem-terapia-online-mesa.webp";
import imgManBlackExpressive  from "../assets/homem-expressivo-psicologia.webp";
import imgElderWomanSmiling   from "../assets/mulher-idosa-sorrindo-terapia.webp";
import imgCoupleSession       from "../assets/casal-sessao-psicologia.webp";
import imgYoungManSession     from "../assets/jovem-homem-sessao-terapia.webp";
import imgWomanTabletOnline   from "../assets/mulher-tablet-psicanalise-online.webp";
import imgManAirpodsSession   from "../assets/homem-fone-sessao-psicologia.webp";
import imgOlderManGlasses     from "../assets/homem-mais-velho-oculos-terapia.webp";
import imgYoungManPsicologia  from "../assets/jovem-homem-psicologia-sessao.webp";
import imgWomanPsicanalise    from "../assets/mulher-psicanalise-sessao.webp";
import imgWomanGlassesLaptop  from "../assets/mulher-oculos-laptop-ansiedade.webp";
import imgManCouchLaptop      from "../assets/homem-sofa-terapia-online.webp";
import imgElderWomanSession2  from "../assets/mulher-idosa-psicanalise-sessao.webp";
import imgManJournaling       from "../assets/homem-escrevendo-diario-terapia.webp";
import imgQuandoPsicologo     from "../assets/quando-buscar-psicologo-sinais.webp";

import { ARTICLE_BLOCKS, ARTICLE_RECOMMENDED, ARTICLE_TOC, slugifyHeading, type ArticleBlock } from "./articleBodies";

const dark  = "#092529";
const mint  = "#AFD7BF";
const muted = "#BBABA0";
const WA        = "https://api.whatsapp.com/send/?phone=5571997250690&text=Olá%2C+Breno%21+Tudo+bem%3F%0A%0AEstou+buscando+acompanhamento+psicológico+e+gostaria+de+saber+mais+sobre+o+seu+atendimento+online.+Vi+seu+site+e+me+identifiquei+com+a+sua+abordagem.%0A%0APoderia+me+passar+mais+informações%3F%0A%0AObrigado%28a%29%21&type=phone_number&app_absent=0";
const ARTICLE_IMAGES = [
  // Row 1 — man · woman · therapist pair  (homepage recent)
  imgManContemplative,     // quando-procurar-psicologo
  imgAnxietyWoman,         // ansiedade-12-sintomas
  imgTherapistSupport,     // o-que-e-psicanalise
  // Row 2 — young woman · couple · young man
  imgYoungWomanSession,    // autoestima-baixa-sinais
  imgCoupleSession,        // relacionamento-toxico-sinais
  imgYoungManPsicologia,   // como-saber-se-preciso-de-terapia
  // Row 3 — woman laptop · man journaling · therapist talking
  imgWomanGlassesLaptop,   // ansiedade-e-insonia
  imgManJournaling,        // psicanalise-funciona
  imgTherapistTalking,     // critica-interna-como-lidar
  // Row 4 — infographic · man desk · woman tablet
  imgBenefits,             // medo-de-abandono
  imgManOnlineDesk,        // terapia-online-funciona
  imgWomanTabletOnline,    // pensamentos-acelerados
  // Row 5 — woman · man expressive · woman laptop
  imgWomanPsicanalise,     // psicanalise-vs-tcc
  imgManBlackExpressive,   // inseguranca
  imgOnlineWomanLaptop,    // ciumes-em-excesso
  // Row 6 — man couch · elder woman · man airpods
  imgManCouchLaptop,       // terapia-online-ou-presencial
  imgElderWomanSession2,   // ansiedade-sintomas-fisicos
  imgManAirpodsSession,    // psicanalise-online
  // Row 7 — process · young man · elder woman
  imgProcess,              // terapia-ajuda-autoestima
  imgYoungManSession,      // dependencia-emocional
  imgElderWomanSmiling,    // como-escolher-um-psicologo
  // Row 8 — older man · man black · elder woman
  imgOlderManGlasses,      // quando-procurar-psicanalista
  imgManBlackSession,      // o-que-esperar-da-primeira-sessao
  imgElderWomanSerene,     // quanto-tempo-dura-psicanalise
  // Row 9
  imgQuandoPsicologo,      // quanto-tempo-dura-a-terapia
];
const SITE_BASE = "https://brenovieirapsi.com";

async function sharePage({ title, text, path }: { title: string; text: string; path: string }) {
  const url = typeof window !== "undefined"
    ? `${window.location.origin}${path}`
    : `${SITE_BASE}${path}`;
  const data = { title, text, url };
  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      if (!navigator.canShare || navigator.canShare(data)) {
        await navigator.share(data);
        return "shared";
      }
    } catch (err) {
      if ((err as DOMException).name === "AbortError") return "cancelled";
    }
  }
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(url);
      return "copied";
    } catch {
      return "failed";
    }
  }
  return "failed";
}

function whatsappArticleShareUrl(title: string, path: string) {
  const url = typeof window !== "undefined"
    ? `${window.location.origin}${path}`
    : `${SITE_BASE}${path}`;
  const text = `${title}\n\n${url}`;
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
}
const sectionPad = "px-6 md:px-8 lg:px-10";
const sectionPy  = "py-16 md:py-20 lg:py-28";
const splitImageDesktop = "lg:w-[440px] lg:max-w-none xl:w-[480px] lg:shrink-0 lg:aspect-auto lg:max-h-none lg:h-[560px]";
const heroImage  = `w-full rounded-3xl overflow-hidden aspect-[16/10] max-h-[230px] md:max-h-[520px] ${splitImageDesktop}`;
const aboutImage = `w-full rounded-3xl overflow-hidden max-md:aspect-[4/5] max-md:max-h-[380px] md:w-[42%] md:max-w-[400px] md:shrink-0 md:h-[480px] ${splitImageDesktop}`;
const processImage = "w-full rounded-3xl overflow-hidden aspect-[16/10] max-h-[320px] md:max-h-[360px] lg:flex-1 lg:aspect-auto lg:max-h-none lg:h-[680px]";
const articleGrid3 = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5";
const splitRow     = "flex flex-col lg:flex-row items-stretch lg:items-center gap-10 md:gap-12 lg:gap-20";
const specialtyGrid = "grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-4 lg:gap-5";
const ctaBtn       = "inline-flex items-center justify-center w-full md:w-auto md:self-start";
const heroTitle    = "font-['Merriweather',serif] font-bold text-[#092529] text-[36px] md:text-[38px] lg:text-[48px] leading-[1.15] max-md:tracking-[-0.02em]";
const sectionTitle = "font-['Merriweather',serif] font-bold text-[#092529] text-[34px] md:text-[36px] lg:text-[46px] leading-[1.15]";
const bannerTitle  = "font-['Merriweather',serif] font-bold text-[#092529] text-[32px] md:text-[34px] lg:text-[40px] leading-[1.2]";

type Article = {
  slug: string; title: string; excerpt: string;
  category: string; categorySlug: string;
  date: string; readTime: string; image: string; content: string;
};
type Category = { slug: string; name: string; description: string; count: number };

const CATEGORIES: Category[] = [
  { slug: "psicoterapia",         name: "Psicoterapia",    description: "Artigos sobre psicoterapia, saúde mental e o processo terapêutico.",              count: 7 },
  { slug: "ansiedade",       name: "Ansiedade",        description: "Sintomas, causas e formas de lidar com a ansiedade no cotidiano.",                count: 4 },
  { slug: "psicanalise",     name: "Psicanálise",      description: "Compreenda a abordagem psicanalítica e seus conceitos fundamentais.",             count: 6 },
  { slug: "autoestima",      name: "Autoestima",       description: "Autoconhecimento, limites e uma relação mais saudável consigo mesmo.",            count: 4 },
  { slug: "relacionamentos", name: "Relacionamentos",  description: "Como a psicologia pode ajudar a construir vínculos mais saudáveis e duradouros.", count: 4 },
];

const CAT_ICON: Record<string, React.ElementType> = {
  psicoterapia:   Heart,
  ansiedade:       Wind,
  psicanalise:     Brain,
  autoestima:      Sun,
  relacionamentos: Users,
};

function CatIcon({ slug, size = 12 }: { slug: string; size?: number }) {
  const Icon = CAT_ICON[slug] ?? Tag;
  return <Icon size={size} />;
}

const RAW: [string,string,string,string,string,string,string][] = [
  // Row 1 — terapia · ansiedade · psicanálise  (homepage recent)
  ["quando-procurar-psicologo","Quando Procurar um Psicólogo? 12 Sinais de Que Pode Ser a Hora de Buscar Ajuda","Muitas pessoas acreditam que procurar um psicólogo é necessário apenas em momentos de crise intensa — mas isso não é verdade.","Psicoterapia","psicoterapia","25 Mai 2025","10 min a ler"],
  ["ansiedade-12-sintomas","Ansiedade: 12 Sintomas Que Você Não Deve Ignorar","Conheça 12 sintomas de ansiedade que muitas pessoas carregam sem perceber — e saiba quando buscar ajuda psicológica.","Ansiedade","ansiedade","15 Jun 2025","10 min a ler"],
  ["o-que-e-psicanalise","O Que é Psicanálise e Como Ela Funciona?","A psicanálise é uma das abordagens mais conhecidas da Psicologia e ajuda a compreender emoções, conflitos e experiências.","Psicanálise","psicanalise","15 Jun 2025","12 min a ler"],
  // Row 2 — autoestima · relacionamentos · terapia
  ["autoestima-baixa-sinais","Baixa Autoestima: Principais Sinais e Como Compreender o Que Está Por Trás Dela","A forma como nos enxergamos influencia praticamente todas as áreas da vida.","Autoestima","autoestima","25 Mai 2025","9 min a ler"],
  ["relacionamento-toxico-sinais","Relacionamento Tóxico: 10 Sinais Que Merecem Atenção","Conflitos fazem parte de qualquer convivência — mas alguns padrões indicam um relacionamento tóxico que merece atenção.","Relacionamentos","relacionamentos","1 Jun 2025","12 min a ler"],
  ["como-saber-se-preciso-de-terapia","Como Saber se Preciso de Terapia? 10 Sinais Que Merecem Atenção","Descubra 10 sinais de que você pode se beneficiar da terapia — do ponto de vista de um psicanalista. Não é preciso estar em crise para começar.","Psicoterapia","psicoterapia","19 Jun 2025","10 min a ler"],
  // Row 3 — ansiedade · psicanálise · autoestima
  ["ansiedade-e-insonia","Ansiedade Pode Causar Insônia? Entenda a Relação Entre Sono e Saúde Emocional","Pensamentos acelerados e preocupações podem interferir no sono — entenda como ansiedade e insônia se relacionam.","Ansiedade","ansiedade","5 Jun 2025","8 min a ler"],
  ["psicanalise-funciona","A Psicanálise Funciona? Entenda Como Acontece o Processo Terapêutico","Entenda como o processo psicanalítico se desenvolve e o que pode ser esperado ao iniciar a terapia.","Psicanálise","psicanalise","1 Jun 2025","11 min a ler"],
  ["critica-interna-como-lidar","Por Que Sou Tão Crítico Comigo Mesmo? Entenda as Raízes da Autocrítica Excessiva","A autocrítica excessiva pode minar a autoestima e a qualidade de vida — entenda suas raízes e como a terapia ajuda.","Autoestima","autoestima","5 Jun 2025","11 min a ler"],
  // Row 4 — relacionamentos · terapia · ansiedade
  ["medo-de-abandono","Medo de Abandono: Por Que Tenho Tanto Medo de Ser Deixado?","O medo de abandono pode gerar angústia intensa nos relacionamentos — entenda suas origens e como a terapia pode ajudar.","Relacionamentos","relacionamentos","5 Jun 2025","10 min a ler"],
  ["terapia-online-funciona","Terapia Online Funciona? Entenda Como São as Sessões e os Benefícios","Entenda como funciona a terapia online, como são as sessões por videochamada e por que ela pode ser tão eficaz quanto o atendimento presencial.","Psicoterapia","psicoterapia","15 Jun 2025","8 min a ler"],
  ["pensamentos-acelerados","Pensamentos Acelerados: O Que Podem Significar?","Quando a mente não para, pensamentos surgem um atrás do outro e podem indicar ansiedade ou sobrecarga emocional.","Ansiedade","ansiedade","1 Jun 2025","9 min a ler"],
  // Row 5 — psicanálise · autoestima · relacionamentos
  ["psicanalise-vs-tcc","Qual a Diferença Entre Psicanálise e TCC? Entenda as Principais Características","Ao procurar um psicólogo, muitas pessoas se deparam com diferentes abordagens — conheça as diferenças entre psicanálise e TCC.","Psicanálise","psicanalise","19 Jun 2025","10 min a ler"],
  ["inseguranca","Insegurança: Quando Procurar Ajuda e Como Compreender Esse Sentimento","Sentir insegurança em determinados momentos é natural — mas quando ela se torna constante, pode merecer atenção.","Autoestima","autoestima","19 Jun 2025","8 min a ler"],
  ["ciumes-em-excesso","Ciúmes em Excesso: Quando Se Torna Um Problema?","Ciúmes podem surgir em qualquer relacionamento — o problema é quando se tornam excessivos e geram sofrimento.","Relacionamentos","relacionamentos","15 Jun 2025","10 min a ler"],
  // Row 6 — terapia · ansiedade · psicanálise
  ["terapia-online-ou-presencial","Terapia Online ou Presencial: Qual a Melhor Opção?","Se você está pensando em começar terapia, provavelmente já se perguntou qual modalidade faz mais sentido para você.","Psicoterapia","psicoterapia","19 Jun 2025","8 min a ler"],
  ["ansiedade-sintomas-fisicos","Ansiedade Pode Causar Sintomas Físicos? Entenda Como o Corpo Também Fala","A ansiedade não afeta apenas a mente — o corpo também manifesta tensão, palpitações e outros sintomas físicos.","Ansiedade","ansiedade","25 Mai 2025","10 min a ler"],
  ["psicanalise-online","Psicanálise Online Funciona? Entenda Como Acontecem as Sessões","A psicanálise online tornou o processo analítico mais acessível para pessoas em diferentes cidades e contextos.","Psicanálise","psicanalise","10 Jun 2025","8 min a ler"],
  // Row 7 — autoestima · relacionamentos · terapia
  ["terapia-ajuda-autoestima","Como a Terapia Pode Ajudar na Autoestima?","A autoestima influencia como nos relacionamos com nós mesmos, com os outros e com o mundo.","Autoestima","autoestima","15 Jun 2025","9 min a ler"],
  ["dependencia-emocional","Dependência Emocional: O Que É, Principais Sinais e Como Superar","Saiba o que é dependência emocional, como ela se manifesta e como construir relações mais saudáveis.","Relacionamentos","relacionamentos","25 Mai 2025","10 min a ler"],
  ["como-escolher-um-psicologo","Psicólogo em Salvador: Como Escolher o Profissional Ideal Para Você","Veja como escolher um psicólogo online para pacientes de Salvador: critérios, abordagens e sinais de que você encontrou o profissional certo.","Psicoterapia","psicoterapia","1 Jun 2025","8 min a ler"],
  // Row 8 — psicanálise · terapia · psicanálise
  ["quando-procurar-psicanalista","Quando Procurar um Psicanalista? Entenda Quando a Psicanálise Pode Ajudar","Não existe um único motivo para iniciar psicanálise — dúvidas emocionais, conflitos e autoconhecimento são motivos legítimos.","Psicanálise","psicanalise","25 Mai 2025","9 min a ler"],
  ["o-que-esperar-da-primeira-sessao","O Que Esperar da Primeira Sessão de Terapia?","Decidir procurar ajuda psicológica costuma ser um passo importante — e a primeira sessão pode trazer muitas dúvidas.","Psicoterapia","psicoterapia","10 Jun 2025","7 min a ler"],
  ["quanto-tempo-dura-psicanalise","Quanto Tempo Dura a Psicanálise? Entenda Como Funciona o Processo Analítico","A duração da psicanálise varia conforme objetivos, história e rito de cada pessoa — não existe um prazo fixo.","Psicanálise","psicanalise","5 Jun 2025","10 min a ler"],
  // Row 9
  ["quanto-tempo-dura-a-terapia","Quanto Tempo Dura a Terapia? Entenda Como Funciona o Processo Terapêutico","Uma das perguntas mais comuns entre quem está pensando em iniciar acompanhamento psicológico é quanto tempo dura a terapia.","Psicoterapia","psicoterapia","5 Jun 2025","9 min a ler"],
];

const ARTICLES: Article[] = RAW.map(([slug,title,excerpt,category,categorySlug,date,readTime], i) => ({
  slug, title, excerpt, category, categorySlug, date, readTime,
  image: ARTICLE_IMAGES[i],
  content: `${excerpt}\n\nA psicoterapia oferece um espaço único de escuta e reflexão, onde cada pessoa pode explorar sua história com liberdade e sem julgamentos.\n\nPor meio de um processo contínuo e colaborativo, é possível compreender melhor os próprios sentimentos, identificar padrões que se repetem e construir novas formas de lidar com os desafios do dia a dia.\n\nO trabalho terapêutico não segue um roteiro fixo — ele se adapta ao ritmo e às necessidades de cada pessoa, respeitando sua singularidade e seu tempo.\n\nBuscar terapia é um ato de coragem e cuidado consigo mesmo. Se você sente que chegou o momento de dar esse passo, estou aqui para caminhar junto com você.`,
}));

function Label({ children, variant = "outline", align = "start", className = "" }: {
  children: React.ReactNode;
  variant?: "outline"|"mint"|"mintFill";
  align?: "start"|"center";
  className?: string;
}) {
  const base = "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold tracking-wide font-['Noto_Sans',sans-serif] whitespace-nowrap";
  const v = variant === "outline" ? "border border-[rgba(9,37,41,0.15)] bg-[#FFF7F2] text-[#092529]"
          : variant === "mint"    ? "bg-[#BFE2CD] text-[#092529]"
          :                         "bg-[#AFD7BF] text-[#092529]";
  const a = align === "start" ? "self-start" : "self-center mx-auto";
  return <span className={`${base} ${v} ${a} ${className}`}>{children}</span>;
}

function Sep() { return <ChevronRight size={12} color={muted} className="shrink-0" />; }

const categoryFilterWrap =
  "grid grid-cols-2 gap-2 md:flex md:flex-nowrap md:items-center md:gap-2 md:overflow-x-auto pb-0.5 lg:justify-end md:[-ms-overflow-style:none] md:[scrollbar-width:none] md:[&::-webkit-scrollbar]:hidden";

function categoryFilterClass(active: boolean) {
  const base =
    "inline-flex w-full md:w-auto justify-center md:justify-start shrink-0 items-center gap-2 whitespace-nowrap px-3 py-2 rounded-xl font-['Noto_Sans',sans-serif] font-semibold text-[13px] border transition-colors";
  return `${base} ${active ? "bg-[#092529] text-[#FFF7F2] border-[#092529]" : "text-[#092529] border-[rgba(9,37,41,0.13)] hover:border-[rgba(9,37,41,0.25)]"}`;
}

function CategoryFilterNav({
  activeSlug,
  onSelect,
}: {
  activeSlug: string | null;
  onSelect?: (slug: string | null) => void;
}) {
  if (onSelect) {
    return (
      <div className={categoryFilterWrap}>
        <button type="button" onClick={() => onSelect(null)} className={categoryFilterClass(activeSlug === null)}>
          Todos
        </button>
        {CATEGORIES.map(c => (
          <button
            key={c.slug}
            type="button"
            onClick={() => onSelect(c.slug)}
            className={categoryFilterClass(activeSlug === c.slug)}
          >
            <CatIcon slug={c.slug} size={12} />{c.name}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={categoryFilterWrap}>
      <Link to="/conteudos" className={categoryFilterClass(activeSlug === null)}>Todos</Link>
      {CATEGORIES.map(c => (
        <Link key={c.slug} to={`/conteudos/${c.slug}`} className={categoryFilterClass(activeSlug === c.slug)}>
          <CatIcon slug={c.slug} size={12} />{c.name}
        </Link>
      ))}
    </div>
  );
}

function Meta({ date, readTime, invert = false }: { date: string; readTime: string; invert?: boolean }) {
  const col = invert ? "rgba(255,247,242,0.65)" : "rgba(9,37,41,0.5)";
  const sep = invert ? "rgba(255,247,242,0.25)" : "rgba(9,37,41,0.15)";
  return (
    <div className="flex items-center gap-3 text-[12px] font-semibold font-['Noto_Sans',sans-serif]" style={{ color: col }}>
      <span className="flex items-center gap-1.5"><Calendar size={12} className="shrink-0" />{date}</span>
      <span className="w-px h-3.5" style={{ background: sep }} />
      <span className="flex items-center gap-1.5"><Clock size={12} className="shrink-0" />{readTime}</span>
    </div>
  );
}

// Inline SVG logo — all 39 dark paths from Breno_s_logo-1.svg
const LOGO_DARK_PATHS = [
  "M80.9238 54.7254L76.6582 29.7888L74.6659 29.3169L74.7533 28.5134H83.6869L83.5642 29.3169L80.5403 29.8407L83.4249 48.6092L83.949 53.24L83.2844 53.3628L85.1198 48.7661L93.2484 29.7534L90.2942 29.2992L90.3815 28.5134H97.4267L97.3216 29.2992L95.242 29.7357L84.054 54.6191L80.9251 54.7242L80.9238 54.7254Z",
  "M97.0772 54.8658C96.6456 54.8658 96.2608 54.7836 95.9229 54.6216C95.5849 54.4597 95.3318 54.194 95.1622 53.8258C94.9926 53.4589 94.9495 52.973 95.0305 52.367C95.066 52.1114 95.1381 51.6306 95.2495 50.9258C95.3596 50.2211 95.4938 49.3683 95.652 48.3663C95.809 47.3642 95.9748 46.2862 96.1507 45.1336C96.3254 43.9809 96.5026 42.8182 96.6836 41.6478C96.8646 40.4762 97.019 39.3843 97.1469 38.3709L95.0141 37.7066L95.1191 37.0778L100.171 36.1871L100.818 36.6236L98.5101 51.8621C98.4405 52.305 98.481 52.6073 98.6328 52.7706C98.7847 52.9338 98.9531 53.0148 99.1391 53.0148C99.3834 53.0148 99.6252 52.9477 99.8644 52.8136C100.104 52.6795 100.397 52.4201 100.748 52.0355L101.115 52.7339C100.882 53.0603 100.573 53.3867 100.188 53.7119C99.8037 54.0383 99.3493 54.3116 98.8252 54.533C98.3012 54.7545 97.7177 54.8645 97.0772 54.8645V54.8658ZM99.472 33.9311C98.8771 33.9311 98.4113 33.7388 98.0734 33.3542C97.7354 32.9695 97.5671 32.5039 97.5671 31.9561C97.5671 31.14 97.7861 30.4821 98.2227 29.9811C98.6594 29.48 99.2277 29.2295 99.9277 29.2295C100.581 29.2295 101.069 29.4243 101.396 29.8153C101.723 30.2063 101.886 30.6693 101.886 31.2045C101.886 32.008 101.667 32.6634 101.23 33.1707C100.793 33.6781 100.207 33.9311 99.4733 33.9311H99.472Z",
  "M115.364 51.4408C115.003 51.9419 114.489 52.4543 113.826 52.9794C113.162 53.5044 112.38 53.946 111.483 54.3079C110.585 54.6684 109.606 54.8494 108.546 54.8494C107.487 54.8494 106.494 54.6634 105.679 54.2901C104.863 53.9169 104.187 53.407 103.652 52.7617C103.115 52.1152 102.714 51.3636 102.445 50.5071C102.177 49.6505 102.043 48.7332 102.043 47.7552C102.054 46.1939 102.307 44.711 102.804 43.3078C103.298 41.9047 103.995 40.661 104.893 39.5767C105.791 38.4936 106.845 37.6396 108.058 37.0171C109.27 36.3946 110.598 36.0821 112.043 36.0821C113.046 36.0821 113.879 36.2364 114.543 36.5451C115.208 36.8539 115.705 37.2815 116.038 37.8294C116.37 38.3772 116.537 39.0124 116.537 39.7348C116.537 40.6787 116.329 41.5175 115.917 42.2514C115.503 42.9852 114.938 43.6229 114.221 44.1644C113.504 44.7059 112.685 45.1576 111.764 45.5182C110.842 45.8801 109.873 46.1534 108.853 46.3394C107.832 46.5254 106.816 46.6304 105.802 46.6544C105.744 47.4705 105.773 48.2651 105.889 49.0394C106.006 49.8137 106.216 50.5071 106.518 51.1194C106.821 51.7306 107.235 52.2202 107.76 52.5871C108.284 52.954 108.926 53.1375 109.683 53.1375C110.37 53.1375 111.023 53.0325 111.641 52.8225C112.259 52.6124 112.841 52.3189 113.389 51.9393C113.937 51.561 114.443 51.1207 114.91 50.6197L115.365 51.4408H115.364ZM111.483 37.0943C110.737 37.0943 110.046 37.3384 109.411 37.8281C108.775 38.3177 108.211 38.9757 107.715 39.8031C107.22 40.6306 106.808 41.5681 106.482 42.617C106.155 43.6659 105.94 44.749 105.835 45.8674C106.71 45.7865 107.522 45.6081 108.274 45.3348C109.026 45.0615 109.704 44.7148 110.311 44.2947C110.917 43.8759 111.436 43.4002 111.866 42.8701C112.298 42.3399 112.63 41.7693 112.862 41.1569C113.095 40.5458 113.212 39.9069 113.212 39.2439C113.2 38.5455 113.055 38.0116 112.775 37.6446C112.495 37.2777 112.064 37.0943 111.481 37.0943H111.483Z",
  "M119.611 54.8658C119.18 54.8658 118.795 54.7836 118.457 54.6216C118.119 54.4597 117.866 54.194 117.696 53.8258C117.527 53.4589 117.484 52.973 117.565 52.367C117.6 52.1114 117.672 51.6306 117.784 50.9258C117.894 50.2211 118.028 49.3683 118.186 48.3663C118.343 47.3642 118.509 46.2862 118.685 45.1336C118.86 43.9809 119.037 42.8182 119.218 41.6478C119.399 40.4762 119.553 39.3843 119.681 38.3709L117.548 37.7066L117.653 37.0778L122.705 36.1871L123.352 36.6236L121.044 51.8621C120.975 52.305 121.015 52.6073 121.167 52.7706C121.319 52.9338 121.487 53.0148 121.673 53.0148C121.918 53.0148 122.159 52.9477 122.399 52.8136C122.638 52.6795 122.931 52.4201 123.282 52.0355L123.649 52.7339C123.416 53.0603 123.107 53.3867 122.723 53.7119C122.338 54.0383 121.883 54.3116 121.359 54.533C120.835 54.7545 120.252 54.8645 119.611 54.8645V54.8658ZM122.006 33.9311C121.411 33.9311 120.945 33.7388 120.608 33.3542C120.27 32.9695 120.101 32.5039 120.101 31.9561C120.101 31.14 120.32 30.4821 120.757 29.9811C121.194 29.48 121.762 29.2295 122.462 29.2295C123.115 29.2295 123.604 29.4243 123.93 29.8153C124.257 30.2063 124.42 30.6693 124.42 31.2045C124.42 32.008 124.201 32.6634 123.764 33.1707C123.328 33.6781 122.742 33.9311 122.007 33.9311H122.006Z",
  "M125.083 54.4812L127.391 38.3873L125.328 37.7231L125.45 37.0765L130.345 36.1858L130.974 36.6223L130.589 39.5577L130.03 43.1054C130.298 42.2779 130.63 41.4543 131.026 40.6331C131.422 39.812 131.865 39.063 132.355 38.3873C132.845 37.7117 133.38 37.1727 133.964 36.7703C134.546 36.368 135.159 36.1668 135.799 36.1668C136.148 36.1668 136.434 36.1934 136.656 36.2453C136.877 36.2971 137.046 36.3528 137.162 36.411L136.341 39.9752C136.247 39.8702 136.055 39.7715 135.764 39.6779C135.473 39.5842 135.169 39.5387 134.855 39.5387C134.318 39.5387 133.806 39.6994 133.317 40.0195C132.827 40.3396 132.364 40.7558 131.927 41.2695C131.49 41.782 131.102 42.3235 130.765 42.8954C130.427 43.466 130.148 43.9961 129.926 44.4858L128.492 54.4812H125.083Z",
  "M149.365 51.685C149.283 52.1974 149.307 52.5504 149.435 52.7427C149.563 52.9351 149.762 53.0312 150.03 53.0312C150.24 53.0312 150.491 52.9502 150.782 52.787C151.073 52.6238 151.37 52.3682 151.673 52.0178L152.04 52.682C151.865 52.9502 151.594 53.2526 151.227 53.5905C150.86 53.9283 150.411 54.2218 149.882 54.4736C149.351 54.7241 148.754 54.8494 148.09 54.8494C147.32 54.8494 146.76 54.614 146.411 54.1421C146.062 53.6702 145.928 53.0388 146.009 52.2455L146.306 50.4628C146.004 51.2207 145.569 51.9343 145.004 52.6036C144.438 53.2741 143.788 53.8157 143.054 54.2294C142.32 54.6431 141.551 54.8494 140.747 54.8494C139.722 54.8494 138.809 54.5925 138.012 54.0801C137.213 53.5677 136.59 52.8275 136.141 51.8609C135.691 50.8942 135.467 49.7176 135.467 48.3309C135.467 47.1314 135.622 45.9433 135.931 44.7667C136.24 43.59 136.694 42.4829 137.294 41.4467C137.894 40.4104 138.632 39.4931 139.505 38.6948C140.38 37.8977 141.381 37.2676 142.513 36.807C143.643 36.3465 144.89 36.1162 146.254 36.1162C146.907 36.1162 147.525 36.1921 148.107 36.344C148.689 36.4958 149.22 36.6995 149.698 36.9551L151.779 36.2731L149.367 51.6863L149.365 51.685ZM148.09 38.09C147.938 37.8104 147.696 37.5738 147.364 37.3827C147.033 37.1904 146.61 37.0943 146.097 37.0943C145.153 37.0943 144.311 37.3245 143.571 37.7838C142.83 38.2444 142.187 38.8643 141.639 39.645C141.091 40.4256 140.634 41.3075 140.267 42.2919C139.9 43.2762 139.627 44.3011 139.446 45.3677C139.265 46.433 139.175 47.473 139.175 48.4865C139.175 49.6163 139.282 50.5311 139.498 51.2295C139.713 51.9279 140.01 52.4378 140.389 52.7579C140.767 53.078 141.201 53.2387 141.691 53.2387C142.181 53.2387 142.685 53.1109 143.168 52.8541C143.652 52.5985 144.113 52.2404 144.549 51.7799C144.986 51.3194 145.377 50.7778 145.72 50.1541C146.063 49.5316 146.329 48.8585 146.515 48.136L148.088 38.0887L148.09 38.09Z",
  "M82.0086 0.134192C84.1059 0.134192 85.8375 0.337895 87.2007 0.745303C88.5639 1.15271 89.5841 1.81063 90.26 2.72034C90.9359 3.62879 91.2739 4.85227 91.2739 6.38954C91.2739 7.3448 91.1106 8.20769 90.784 8.97569C90.4574 9.74496 90.0031 10.3738 89.4208 10.8634C88.8386 11.3531 88.15 11.6795 87.3576 11.8415V12.0161C88.1728 12.1793 88.9246 12.4766 89.6132 12.9068C90.3005 13.3382 90.8549 13.9557 91.2739 14.7591C91.6928 15.5625 91.9029 16.6177 91.9029 17.9222C91.9029 19.4367 91.5536 20.7298 90.8536 21.8014C90.1549 22.8731 89.1689 23.6892 87.8994 24.2484C86.6286 24.8076 85.1071 25.0873 83.3363 25.0873H74.6659V0.134192H82.0086ZM82.4275 10.3055C83.9426 10.3055 84.9919 10.0258 85.5742 9.4666C86.1564 8.90737 86.4488 8.08117 86.4488 6.98547C86.4488 5.88977 86.1045 5.06357 85.4172 4.57392C84.7299 4.08427 83.6401 3.84008 82.1478 3.84008H79.3505V10.3055H82.4275ZM79.3505 13.9051V21.3497H82.7769C84.3616 21.3497 85.4628 21.0005 86.0805 20.3009C86.6982 19.6012 87.007 18.67 87.007 17.5047C87.007 16.7595 86.8728 16.118 86.6045 15.5828C86.3362 15.0476 85.8881 14.6338 85.259 14.3416C84.6299 14.0506 83.7553 13.9051 82.6364 13.9051H79.3492H79.3505Z",
  "M103.686 5.796C104.012 5.796 104.35 5.80739 104.7 5.83143C105.049 5.85547 105.34 5.90101 105.574 5.9706L105.155 10.0599C104.922 10.013 104.648 9.97256 104.334 9.93713C104.019 9.90171 103.687 9.88526 103.338 9.88526C102.754 9.88526 102.19 9.9966 101.642 10.2168C101.094 10.4382 100.592 10.7646 100.138 11.196C99.6835 11.6275 99.3215 12.1804 99.0544 12.856C98.786 13.5317 98.6519 14.3364 98.6519 15.2676V25.0884H94.0015V6.14647H97.5684L98.1975 9.43104H98.4418C98.7911 8.7554 99.2291 8.14429 99.7531 7.59644C100.277 7.04985 100.872 6.61208 101.537 6.28565C102.201 5.95922 102.917 5.796 103.687 5.796H103.686Z",
  "M114 5.796C115.632 5.796 117.036 6.14015 118.214 6.82717C119.391 7.5142 120.306 8.49349 120.958 9.76253C121.61 11.0328 121.937 12.5764 121.937 14.3933V16.6303H110.328C110.375 18.3548 110.801 19.6883 111.604 20.6322C112.408 21.5761 113.545 22.048 115.013 22.048C116.155 22.048 117.186 21.9253 118.108 21.6811C119.028 21.4369 119.978 21.0814 120.957 20.6158V24.1458C120.071 24.5886 119.151 24.915 118.195 25.1238C117.239 25.3338 116.062 25.4389 114.664 25.4389C112.892 25.4389 111.325 25.0833 109.961 24.3723C108.598 23.6625 107.531 22.5845 106.762 21.1396C105.992 19.6947 105.607 17.9018 105.607 15.7572C105.607 13.6127 105.957 11.7679 106.656 10.2876C107.355 8.80854 108.34 7.69007 109.611 6.93219C110.88 6.17557 112.343 5.796 113.999 5.796H114ZM114.07 9.0464C113.043 9.0464 112.204 9.42471 111.552 10.1826C110.899 10.9405 110.514 12.064 110.398 13.5557H117.531C117.531 12.6701 117.403 11.8894 117.146 11.2138C116.889 10.5381 116.504 10.008 115.991 9.62335C115.479 9.23872 114.837 9.0464 114.069 9.0464H114.07Z",
  "M133.789 5.796C135.77 5.796 137.332 6.34385 138.474 7.43828C139.615 8.53398 140.187 10.3041 140.187 12.751V25.0884H135.537V13.6253C135.537 12.2044 135.293 11.1378 134.803 10.428C134.313 9.71825 133.545 9.36145 132.495 9.36145C130.934 9.36145 129.873 9.91562 129.313 11.0214C128.754 12.1285 128.474 13.7303 128.474 15.8268V25.0884H123.824V6.14647H127.391L128.055 8.62761H128.265C128.637 7.97601 129.11 7.43955 129.682 7.01949C130.253 6.60069 130.888 6.29197 131.587 6.09333C132.287 5.89595 133.021 5.796 133.789 5.796Z",
  "M159.313 15.5826C159.313 17.1667 159.114 18.5648 158.718 19.7769C158.322 20.989 157.745 22.0202 156.988 22.8704C156.23 23.7207 155.314 24.3621 154.244 24.7923C153.171 25.2238 151.97 25.4389 150.643 25.4389C149.407 25.4389 148.265 25.2238 147.216 24.7923C146.167 24.3621 145.258 23.7207 144.488 22.8704C143.719 22.0202 143.125 20.989 142.705 19.7769C142.285 18.5661 142.076 17.168 142.076 15.5826C142.076 13.4861 142.425 11.7148 143.125 10.2699C143.824 8.82499 144.821 7.7179 146.115 6.9499C147.409 6.18063 148.953 5.796 150.748 5.796C152.402 5.796 153.877 6.18063 155.17 6.9499C156.464 7.71917 157.478 8.82499 158.212 10.2699C158.946 11.7148 159.313 13.4849 159.313 15.5826ZM146.796 15.5826C146.796 16.9099 146.93 18.0461 147.198 18.9899C147.465 19.9338 147.886 20.6499 148.457 21.1396C149.027 21.6292 149.768 21.8734 150.677 21.8734C151.586 21.8734 152.36 21.6292 152.932 21.1396C153.503 20.6499 153.923 19.9338 154.19 18.9899C154.458 18.0461 154.593 16.9099 154.593 15.5826C154.593 14.2554 154.459 13.0952 154.19 12.1753C153.922 11.2555 153.503 10.5558 152.932 10.0788C152.361 9.60184 151.61 9.36271 150.677 9.36271C149.301 9.36271 148.311 9.89918 147.705 10.9708C147.098 12.0425 146.796 13.581 146.796 15.5839V15.5826Z",
  // small text characters (tagline below wordmark)
  "M159.313 42.7792L159.342 42.5565L160.039 42.4085L160.944 35.8077L160.291 35.6597L160.32 35.4319H161.527C161.79 35.4319 162.038 35.4193 162.268 35.3952C162.499 35.3712 162.769 35.3585 163.08 35.3585C163.585 35.3585 164.006 35.4269 164.345 35.561C164.685 35.6964 164.94 35.9026 165.112 36.1784C165.285 36.4555 165.372 36.8047 165.374 37.226C165.374 37.5689 165.33 37.884 165.243 38.1699C165.155 38.4558 165.026 38.7127 164.854 38.9392C164.682 39.1644 164.472 39.3567 164.224 39.5123C163.974 39.6692 163.691 39.7894 163.371 39.8729C163.05 39.9564 162.7 39.9994 162.318 39.9994C162.196 39.9994 162.072 39.9956 161.947 39.9893C161.821 39.983 161.704 39.9729 161.594 39.9602C161.483 39.9476 161.385 39.9336 161.299 39.921L161.343 39.5503C161.439 39.5705 161.544 39.5895 161.659 39.6097C161.775 39.63 161.887 39.6452 161.996 39.6566C162.105 39.6679 162.201 39.6743 162.283 39.6743C162.551 39.6743 162.79 39.635 163.004 39.5553C163.216 39.4769 163.401 39.3656 163.558 39.2238C163.715 39.0821 163.845 38.9113 163.949 38.7127C164.053 38.5128 164.13 38.2926 164.182 38.0497C164.233 37.8068 164.259 37.5474 164.259 37.2716C164.259 36.916 164.211 36.6187 164.116 36.3821C164.02 36.1455 163.872 35.9659 163.668 35.8457C163.464 35.7255 163.204 35.6673 162.885 35.6698C162.769 35.6698 162.649 35.6761 162.524 35.69C162.399 35.7027 162.277 35.7191 162.158 35.7368C162.039 35.7546 161.934 35.7723 161.842 35.7887L162.044 35.6154L161.119 42.3933L162.252 42.5616L162.223 42.7792H159.313Z",
  "M168.626 38.7H168.473C168.427 38.4862 168.325 38.3002 168.167 38.1433C168.008 37.9864 167.797 37.9093 167.534 37.9093C167.355 37.9093 167.197 37.9396 167.059 38.0004C166.921 38.0611 166.812 38.1496 166.733 38.2648C166.653 38.3799 166.612 38.5191 166.609 38.6798C166.609 38.8379 166.645 38.9822 166.717 39.1125C166.79 39.2428 166.89 39.3643 167.016 39.4781C167.143 39.592 167.286 39.7046 167.444 39.8172C167.665 39.9653 167.859 40.112 168.025 40.2575C168.192 40.403 168.321 40.5612 168.416 40.732C168.51 40.9041 168.557 41.1027 168.557 41.3305C168.557 41.5873 168.506 41.8125 168.403 42.0048C168.301 42.1971 168.159 42.3591 167.978 42.4894C167.797 42.6197 167.591 42.7184 167.36 42.7842C167.13 42.85 166.886 42.8829 166.629 42.8829C166.44 42.8829 166.249 42.8652 166.055 42.831C165.862 42.7969 165.687 42.7526 165.534 42.6982C165.381 42.6438 165.269 42.5906 165.2 42.5375L165.417 41.5886H165.566C165.629 41.767 165.711 41.9289 165.815 42.0782C165.919 42.2263 166.045 42.3452 166.196 42.4338C166.347 42.5223 166.516 42.5666 166.707 42.5666C166.878 42.5666 167.034 42.5324 167.174 42.4654C167.315 42.3983 167.426 42.3009 167.508 42.1731C167.591 42.0466 167.633 41.8973 167.633 41.7252C167.633 41.5531 167.589 41.4013 167.503 41.2685C167.417 41.1344 167.305 41.0104 167.164 40.8952C167.024 40.7801 166.873 40.6662 166.711 40.5536C166.555 40.4486 166.405 40.3284 166.257 40.193C166.109 40.0576 165.985 39.9007 165.886 39.7211C165.787 39.5414 165.738 39.3314 165.738 39.091C165.738 38.781 165.821 38.5153 165.99 38.2926C166.158 38.0699 166.385 37.8991 166.669 37.7789C166.954 37.6587 167.276 37.598 167.631 37.598C167.793 37.598 167.951 37.6069 168.106 37.6233C168.26 37.6398 168.401 37.6625 168.526 37.6904C168.651 37.7182 168.751 37.7473 168.827 37.7764L168.625 38.7013L168.626 38.7Z",
  "M169.986 42.888C169.864 42.888 169.755 42.8652 169.659 42.8184C169.563 42.7716 169.492 42.6969 169.444 42.5932C169.396 42.4894 169.383 42.3515 169.407 42.1807C169.417 42.1086 169.437 41.9719 169.469 41.7733C169.501 41.5747 169.539 41.333 169.583 41.0496C169.627 40.7662 169.674 40.4612 169.724 40.1348C169.773 39.8084 169.824 39.4794 169.874 39.1479C169.925 38.8164 169.969 38.5077 170.006 38.2205L169.402 38.0332L169.431 37.8548L170.86 37.6031L171.044 37.7271L170.391 42.0377C170.37 42.163 170.382 42.249 170.425 42.2946C170.468 42.3401 170.516 42.3642 170.568 42.3642C170.637 42.3642 170.706 42.3452 170.773 42.3072C170.84 42.2693 170.923 42.1959 171.022 42.0871L171.126 42.2845C171.06 42.3768 170.973 42.4692 170.864 42.5615C170.755 42.6539 170.626 42.7311 170.478 42.7943C170.33 42.8576 170.164 42.888 169.983 42.888H169.986ZM170.664 36.9654C170.496 36.9654 170.364 36.911 170.268 36.8022C170.172 36.6934 170.125 36.5618 170.125 36.4074C170.125 36.1771 170.187 35.9911 170.311 35.8494C170.435 35.7077 170.596 35.6369 170.793 35.6369C170.978 35.6369 171.116 35.6926 171.208 35.8026C171.301 35.9127 171.346 36.0443 171.346 36.1961C171.346 36.4239 171.284 36.6086 171.16 36.7528C171.036 36.8971 170.87 36.9679 170.663 36.9679L170.664 36.9654Z",
  "M173.309 42.8779C172.752 42.8779 172.325 42.6982 172.028 42.3389C171.732 41.9795 171.583 41.5051 171.583 40.9155C171.583 40.4942 171.646 40.0842 171.773 39.6895C171.899 39.2947 172.084 38.9366 172.325 38.6191C172.565 38.3015 172.86 38.0484 173.211 37.8625C173.56 37.6765 173.956 37.5828 174.398 37.5828C174.573 37.5828 174.764 37.6005 174.969 37.6372C175.175 37.6739 175.354 37.7258 175.505 37.7954L175.189 38.9126L174.992 38.9025C174.912 38.6355 174.84 38.428 174.774 38.28C174.708 38.132 174.636 38.0282 174.556 37.9687C174.476 37.9093 174.376 37.8802 174.255 37.8802C174.05 37.8802 173.852 37.9548 173.661 38.1054C173.47 38.2559 173.298 38.4647 173.147 38.7329C172.997 39.0012 172.877 39.3175 172.789 39.6819C172.702 40.0463 172.658 40.4423 172.658 40.8712C172.658 41.1685 172.692 41.4317 172.759 41.662C172.826 41.8922 172.93 42.0744 173.068 42.206C173.206 42.3376 173.383 42.4034 173.597 42.4034C173.768 42.4034 173.932 42.3768 174.089 42.3224C174.246 42.268 174.395 42.1934 174.537 42.0972C174.679 42.0011 174.814 41.8897 174.942 41.7607L175.066 41.9884C174.947 42.1364 174.802 42.2794 174.628 42.4161C174.455 42.5527 174.259 42.664 174.037 42.7501C173.816 42.8361 173.574 42.8779 173.311 42.8779H173.309Z",
  "M178.29 37.5778C178.715 37.5778 179.069 37.66 179.348 37.822C179.628 37.9852 179.838 38.2205 179.979 38.5267C180.119 38.8329 180.189 39.2023 180.189 39.6338C180.189 40.0652 180.129 40.4461 180.01 40.8345C179.891 41.2229 179.717 41.5721 179.486 41.8809C179.256 42.1896 178.972 42.4338 178.636 42.6147C178.299 42.7956 177.915 42.8867 177.484 42.8867C177.052 42.8867 176.705 42.8045 176.423 42.64C176.141 42.4755 175.931 42.2389 175.793 41.9302C175.655 41.6228 175.585 41.2571 175.585 40.8345C175.585 40.4119 175.646 40.007 175.769 39.6186C175.89 39.2302 176.069 38.881 176.303 38.5735C176.537 38.2648 176.822 38.0219 177.156 37.8447C177.49 37.6663 177.869 37.5778 178.291 37.5778H178.29ZM178.246 37.8599C178.024 37.8599 177.827 37.9257 177.652 38.0548C177.478 38.1851 177.326 38.361 177.198 38.5836C177.069 38.8063 176.964 39.0556 176.881 39.3301C176.799 39.6047 176.738 39.8906 176.698 40.1854C176.659 40.4802 176.638 40.7662 176.638 41.0433C176.638 41.3887 176.674 41.6784 176.745 41.9112C176.816 42.144 176.918 42.3174 177.053 42.4325C177.189 42.5476 177.351 42.6058 177.538 42.6058C177.76 42.6058 177.956 42.5401 178.129 42.4085C178.303 42.2769 178.452 42.101 178.58 41.8821C178.707 41.6632 178.812 41.4153 178.894 41.1407C178.976 40.8661 179.038 40.5827 179.08 40.2905C179.122 39.9994 179.142 39.7173 179.142 39.4478C179.142 39.1517 179.115 38.8835 179.061 38.6444C179.007 38.4052 178.915 38.2155 178.786 38.0738C178.657 37.932 178.477 37.8612 178.247 37.8612L178.246 37.8599ZM178.152 36.8908L179.567 34.8335L180.255 35.4016C180.175 35.4977 180.08 35.6015 179.967 35.7128C179.855 35.8254 179.732 35.9393 179.596 36.057C179.461 36.1734 179.32 36.2898 179.176 36.4049C179.031 36.52 178.885 36.6301 178.736 36.7364C178.588 36.8414 178.445 36.9376 178.305 37.0236L178.152 36.8895V36.8908Z",
  "M181.689 42.0719C181.676 42.1744 181.689 42.2478 181.725 42.2946C181.763 42.3401 181.814 42.3642 181.876 42.3642C181.938 42.3642 182.009 42.3427 182.086 42.2996C182.163 42.2566 182.252 42.1795 182.351 42.0668L182.454 42.2592C182.375 42.368 182.278 42.4705 182.165 42.5653C182.051 42.6615 181.922 42.7387 181.776 42.7982C181.63 42.8576 181.471 42.8867 181.296 42.8867C181.181 42.8867 181.08 42.8665 180.995 42.8273C180.909 42.788 180.842 42.7222 180.795 42.6324C180.747 42.5426 180.723 42.4236 180.723 42.2794C180.723 42.2465 180.727 42.2035 180.733 42.1516C180.739 42.0985 180.747 42.039 180.756 41.9707C180.765 41.9024 180.775 41.8353 180.787 41.7657L181.752 35.2295L181.089 35.0815L181.128 34.903L182.632 34.7006L182.766 34.8044L181.687 42.0719H181.689Z",
  "M185.63 37.5778C186.055 37.5778 186.409 37.66 186.688 37.822C186.968 37.9852 187.178 38.2205 187.319 38.5267C187.459 38.8329 187.529 39.2023 187.529 39.6338C187.529 40.0652 187.469 40.4461 187.35 40.8345C187.231 41.2229 187.057 41.5721 186.826 41.8809C186.596 42.1896 186.312 42.4338 185.976 42.6147C185.639 42.7956 185.256 42.8867 184.824 42.8867C184.392 42.8867 184.045 42.8045 183.763 42.64C183.481 42.4755 183.271 42.2389 183.133 41.9302C182.995 41.6227 182.925 41.2571 182.925 40.8345C182.925 40.4119 182.986 40.007 183.109 39.6186C183.23 39.2302 183.409 38.881 183.643 38.5735C183.877 38.2648 184.162 38.0219 184.496 37.8447C184.83 37.6663 185.209 37.5778 185.631 37.5778H185.63ZM185.586 37.8599C185.364 37.8599 185.167 37.9257 184.992 38.0548C184.818 38.1851 184.666 38.361 184.538 38.5836C184.409 38.8063 184.304 39.0556 184.221 39.3301C184.139 39.6047 184.078 39.8906 184.038 40.1854C183.999 40.4802 183.978 40.7662 183.978 41.0433C183.978 41.3887 184.014 41.6784 184.085 41.9112C184.156 42.144 184.258 42.3174 184.394 42.4325C184.529 42.5476 184.691 42.6058 184.878 42.6058C185.1 42.6058 185.296 42.54 185.469 42.4085C185.643 42.2769 185.792 42.101 185.92 41.8821C186.047 41.6632 186.152 41.4152 186.234 41.1407C186.316 40.8661 186.378 40.5827 186.42 40.2904C186.462 39.9994 186.482 39.7173 186.482 39.4478C186.482 39.1517 186.455 38.8835 186.401 38.6444C186.347 38.4052 186.255 38.2155 186.126 38.0737C185.997 37.932 185.818 37.8612 185.587 37.8612L185.586 37.8599Z",
  "M191.946 43.1157C191.893 43.4687 191.793 43.7775 191.648 44.0432C191.502 44.3089 191.318 44.5303 191.098 44.7087C190.879 44.8858 190.634 45.0199 190.362 45.1085C190.089 45.1971 189.798 45.2413 189.488 45.2413C189.317 45.2413 189.14 45.2287 188.957 45.2021C188.773 45.1756 188.601 45.1376 188.44 45.0882C188.278 45.0389 188.145 44.9782 188.04 44.9048L188.357 44.1039C188.433 44.2481 188.536 44.3848 188.668 44.5113C188.8 44.6378 188.945 44.7403 189.106 44.8175C189.265 44.8947 189.424 44.9339 189.578 44.9339C189.822 44.9339 190.038 44.8744 190.224 44.7555C190.41 44.6366 190.568 44.4506 190.696 44.1963C190.825 43.9432 190.92 43.6142 190.983 43.2119L191.221 41.6898C191.135 41.8935 191.013 42.0871 190.855 42.2706C190.697 42.4528 190.511 42.6008 190.297 42.7134C190.083 42.8247 189.85 42.8817 189.6 42.8817C189.3 42.8817 189.034 42.8133 188.803 42.6767C188.573 42.5401 188.393 42.3326 188.264 42.0542C188.135 41.7759 188.072 41.4266 188.072 41.0091C188.072 40.67 188.115 40.3347 188.201 40.0058C188.287 39.6768 188.414 39.3656 188.582 39.0733C188.75 38.7823 188.959 38.5242 189.207 38.3015C189.457 38.0788 189.744 37.9042 190.07 37.7777C190.397 37.6512 190.762 37.5879 191.164 37.5879C191.392 37.5879 191.586 37.6081 191.748 37.6499C191.91 37.6917 192.056 37.7486 192.188 37.8207L192.792 37.6284L191.951 43.1157H191.946ZM191.739 38.1522C191.696 38.0636 191.624 37.9928 191.524 37.9396C191.424 37.8865 191.292 37.8599 191.13 37.8599C190.846 37.8599 190.594 37.927 190.376 38.0598C190.157 38.1927 189.968 38.3724 189.81 38.5988C189.651 38.8253 189.521 39.0784 189.419 39.3605C189.316 39.6427 189.24 39.9337 189.191 40.2335C189.141 40.5334 189.116 40.8219 189.116 41.0989C189.116 41.3368 189.134 41.5393 189.171 41.7075C189.207 41.8758 189.259 42.0137 189.329 42.12C189.398 42.2275 189.479 42.306 189.572 42.3553C189.664 42.4047 189.767 42.43 189.878 42.43C190.067 42.43 190.257 42.3692 190.449 42.2465C190.641 42.1238 190.813 41.9606 190.965 41.7543C191.117 41.5481 191.226 41.3216 191.292 41.0749L191.737 38.1535L191.739 38.1522Z",
  "M195.864 37.5778C196.289 37.5778 196.642 37.66 196.922 37.822C197.202 37.9852 197.412 38.2205 197.552 38.5267C197.693 38.8329 197.762 39.2023 197.762 39.6338C197.762 40.0652 197.703 40.4461 197.584 40.8345C197.465 41.2229 197.29 41.5721 197.06 41.8809C196.83 42.1896 196.546 42.4338 196.209 42.6147C195.873 42.7956 195.489 42.8867 195.058 42.8867C194.626 42.8867 194.279 42.8045 193.997 42.64C193.715 42.4755 193.504 42.2389 193.366 41.9302C193.229 41.6227 193.159 41.2571 193.159 40.8345C193.159 40.4119 193.22 40.007 193.342 39.6186C193.464 39.2302 193.642 38.881 193.877 38.5735C194.111 38.2648 194.396 38.0219 194.73 37.8447C195.064 37.6663 195.442 37.5778 195.865 37.5778H195.864ZM195.819 37.8599C195.598 37.8599 195.401 37.9257 195.226 38.0548C195.051 38.1851 194.899 38.361 194.771 38.5836C194.642 38.8063 194.537 39.0556 194.455 39.3301C194.373 39.6047 194.312 39.8906 194.271 40.1854C194.232 40.4802 194.212 40.7662 194.212 41.0433C194.212 41.3887 194.247 41.6784 194.318 41.9112C194.389 42.144 194.492 42.3174 194.627 42.4325C194.763 42.5476 194.925 42.6058 195.112 42.6058C195.333 42.6058 195.53 42.54 195.703 42.4085C195.876 42.2769 196.026 42.101 196.154 41.8821C196.28 41.6632 196.385 41.4152 196.468 41.1407C196.55 40.8661 196.612 40.5827 196.654 40.2904C196.695 39.9994 196.716 39.7173 196.716 39.4478C196.716 39.1517 196.689 38.8835 196.635 38.6444C196.58 38.4052 196.489 38.2155 196.36 38.0737C196.231 37.932 196.051 37.8612 195.821 37.8612L195.819 37.8599Z",
  "M202.798 42.8678C202.28 42.8678 201.848 42.7792 201.501 42.6008C201.155 42.4224 200.879 42.1845 200.672 41.8859C200.466 41.5873 200.319 41.2546 200.229 40.8851C200.141 40.5157 200.095 40.1424 200.095 39.7629C200.091 39.1239 200.184 38.5343 200.37 37.9953C200.556 37.4563 200.818 36.9894 201.153 36.5934C201.49 36.1987 201.885 35.8912 202.341 35.6736C202.795 35.456 203.291 35.3472 203.829 35.3472C204.158 35.3472 204.447 35.3687 204.695 35.4117C204.942 35.4547 205.156 35.5003 205.335 35.5483C205.515 35.5964 205.67 35.6268 205.797 35.6394L205.491 37.5082H204.903L204.838 35.9557C204.772 35.9102 204.69 35.8646 204.594 35.8204C204.496 35.7761 204.379 35.7394 204.241 35.709C204.103 35.6799 203.934 35.6647 203.736 35.6647C203.317 35.6647 202.949 35.7849 202.636 36.0253C202.32 36.2657 202.058 36.5871 201.85 36.9869C201.641 37.3867 201.484 37.8296 201.38 38.3116C201.276 38.7949 201.226 39.2783 201.229 39.7629C201.229 40.1019 201.258 40.4372 201.315 40.7687C201.374 41.1002 201.47 41.3988 201.605 41.6632C201.741 41.929 201.922 42.1402 202.15 42.2984C202.377 42.4566 202.662 42.5363 203.005 42.5363C203.147 42.5363 203.304 42.5135 203.475 42.4692C203.646 42.4249 203.806 42.3617 203.957 42.2807C204.108 42.1997 204.215 42.1036 204.281 41.9922C204.31 41.9163 204.344 41.8252 204.38 41.7202C204.415 41.6152 204.452 41.5051 204.486 41.3887C204.52 41.2736 204.554 41.1609 204.587 41.0496C204.62 40.9395 204.648 40.8396 204.671 40.751H205.2L204.958 42.4224C204.86 42.449 204.743 42.4857 204.609 42.5337C204.475 42.5818 204.32 42.6312 204.144 42.6818C203.968 42.7336 203.768 42.7767 203.546 42.8134C203.323 42.85 203.074 42.8678 202.796 42.8678H202.798Z",
  "M206.868 42.0719C206.856 42.1744 206.868 42.2478 206.905 42.2946C206.943 42.3401 206.994 42.3642 207.056 42.3642C207.118 42.3642 207.188 42.3427 207.266 42.2996C207.343 42.2566 207.431 42.1795 207.53 42.0668L207.634 42.2592C207.554 42.368 207.458 42.4705 207.344 42.5653C207.23 42.6615 207.101 42.7387 206.956 42.7982C206.81 42.8576 206.651 42.8867 206.476 42.8867C206.361 42.8867 206.259 42.8665 206.175 42.8273C206.089 42.788 206.021 42.7222 205.975 42.6324C205.927 42.5426 205.902 42.4236 205.902 42.2794C205.902 42.2465 205.906 42.2035 205.913 42.1516C205.919 42.0985 205.927 42.039 205.935 41.9707C205.944 41.9024 205.954 41.8353 205.967 41.7657L206.932 35.2295L206.268 35.0815L206.308 34.903L207.811 34.7006L207.945 34.8044L206.867 42.0719H206.868Z",
  "M208.896 42.888C208.774 42.888 208.666 42.8652 208.569 42.8184C208.473 42.7716 208.402 42.6969 208.354 42.5932C208.306 42.4894 208.294 42.3515 208.318 42.1807C208.328 42.1086 208.348 41.972 208.38 41.7733C208.411 41.5747 208.449 41.333 208.493 41.0496C208.538 40.7662 208.585 40.4613 208.634 40.1348C208.683 39.8084 208.734 39.4794 208.785 39.1479C208.835 38.8164 208.88 38.5077 208.916 38.2205L208.312 38.0333L208.342 37.8549L209.771 37.6031L209.954 37.7271L209.301 42.0378C209.281 42.163 209.292 42.249 209.335 42.2946C209.378 42.3401 209.426 42.3642 209.478 42.3642C209.548 42.3642 209.616 42.3452 209.683 42.3072C209.75 42.2693 209.834 42.1959 209.933 42.0871L210.036 42.2845C209.971 42.3768 209.883 42.4692 209.774 42.5616C209.666 42.6539 209.536 42.7311 209.388 42.7944C209.24 42.8576 209.074 42.888 208.893 42.888H208.896ZM209.367 36.8908L210.782 34.8335L211.469 35.4016C211.39 35.4977 211.295 35.6015 211.182 35.7128C211.069 35.8254 210.947 35.9393 210.811 36.057C210.676 36.1734 210.535 36.2898 210.391 36.4049C210.245 36.52 210.1 36.6301 209.95 36.7364C209.802 36.8414 209.659 36.9376 209.52 37.0236L209.367 36.8895V36.8908Z",
  "M212.072 39.4516C212.191 39.1973 212.326 38.9594 212.479 38.7342C212.632 38.5103 212.8 38.3103 212.982 38.1357C213.163 37.9611 213.355 37.8245 213.558 37.7283C213.76 37.6309 213.97 37.5828 214.188 37.5828C214.508 37.5828 214.751 37.6777 214.917 37.8675C215.083 38.0573 215.167 38.3281 215.167 38.6811C215.167 38.8126 215.155 38.9746 215.132 39.1656C215.11 39.3567 215.08 39.5642 215.046 39.7856C215.012 40.0083 214.977 40.231 214.94 40.4549C214.907 40.6599 214.873 40.8661 214.839 41.0749C214.804 41.2837 214.775 41.4772 214.753 41.6531C214.73 41.829 214.715 41.9707 214.708 42.0757C214.708 42.1782 214.722 42.2516 214.75 42.2959C214.778 42.3401 214.822 42.3629 214.882 42.3629C214.944 42.3629 215.015 42.3414 215.092 42.2984C215.169 42.2554 215.256 42.182 215.351 42.0757L215.455 42.268C215.389 42.3566 215.299 42.449 215.188 42.5451C215.075 42.6413 214.944 42.721 214.789 42.7868C214.636 42.8526 214.46 42.8855 214.263 42.8855C214.158 42.8855 214.063 42.8652 213.978 42.8235C213.894 42.7817 213.827 42.7184 213.781 42.6337C213.732 42.5476 213.708 42.4376 213.708 42.3022C213.708 42.2301 213.716 42.1288 213.731 42.0011C213.746 41.8733 213.767 41.7265 213.793 41.5633C213.82 41.4001 213.848 41.2293 213.877 41.0496C213.906 40.8699 213.935 40.6941 213.96 40.5233C213.989 40.355 214.018 40.1892 214.044 40.0235C214.07 39.859 214.094 39.7021 214.116 39.5516C214.137 39.4023 214.154 39.2631 214.165 39.1366C214.177 39.01 214.183 38.9 214.183 38.8076C214.183 38.6697 214.168 38.5558 214.139 38.4672C214.11 38.3787 214.06 38.3129 213.993 38.2724C213.926 38.2319 213.836 38.2104 213.724 38.2104C213.586 38.2104 213.434 38.2623 213.269 38.366C213.105 38.4698 212.939 38.6102 212.774 38.7861C212.61 38.9619 212.458 39.1631 212.319 39.3896C212.181 39.6161 212.068 39.8514 211.982 40.0994L211.601 42.7792H210.636L211.284 38.2256L210.706 38.0371L210.74 37.8549L212.13 37.598L212.308 37.722L212.07 39.4529L212.072 39.4516Z",
  "M216.671 42.888C216.55 42.888 216.441 42.8652 216.345 42.8184C216.249 42.7716 216.178 42.6969 216.13 42.5932C216.082 42.4894 216.069 42.3515 216.093 42.1807C216.103 42.1086 216.123 41.9719 216.155 41.7733C216.187 41.5747 216.225 41.333 216.269 41.0496C216.313 40.7662 216.36 40.4612 216.409 40.1348C216.459 39.8084 216.509 39.4794 216.56 39.1479C216.611 38.8164 216.655 38.5077 216.692 38.2205L216.088 38.0332L216.117 37.8548L217.546 37.6031L217.73 37.7271L217.076 42.0377C217.056 42.163 217.068 42.249 217.111 42.2946C217.154 42.3401 217.202 42.3642 217.254 42.3642C217.323 42.3642 217.392 42.3452 217.459 42.3072C217.526 42.2693 217.609 42.1959 217.708 42.0871L217.812 42.2845C217.746 42.3768 217.659 42.4692 217.55 42.5615C217.441 42.6539 217.312 42.7311 217.164 42.7943C217.016 42.8576 216.85 42.888 216.669 42.888H216.671ZM217.349 36.9654C217.18 36.9654 217.049 36.911 216.952 36.8022C216.856 36.6934 216.809 36.5618 216.809 36.4074C216.809 36.1771 216.871 35.9911 216.995 35.8494C217.12 35.7077 217.28 35.6369 217.478 35.6369C217.663 35.6369 217.8 35.6926 217.893 35.8026C217.985 35.9127 218.031 36.0443 218.031 36.1961C218.031 36.4239 217.969 36.6086 217.845 36.7528C217.721 36.8971 217.555 36.9679 217.347 36.9679L217.349 36.9654Z",
  "M219.995 42.8779C219.438 42.8779 219.011 42.6982 218.714 42.3389C218.418 41.9795 218.269 41.5051 218.269 40.9155C218.269 40.4942 218.332 40.0842 218.459 39.6895C218.585 39.2947 218.77 38.9366 219.011 38.6191C219.251 38.3015 219.546 38.0484 219.897 37.8625C220.246 37.6765 220.642 37.5828 221.084 37.5828C221.259 37.5828 221.45 37.6005 221.655 37.6372C221.861 37.6739 222.04 37.7258 222.191 37.7954L221.875 38.9126L221.677 38.9025C221.598 38.6355 221.526 38.428 221.46 38.28C221.394 38.132 221.322 38.0282 221.242 37.9687C221.162 37.9093 221.062 37.8802 220.941 37.8802C220.736 37.8802 220.538 37.9548 220.347 38.1054C220.156 38.2559 219.984 38.4647 219.833 38.7329C219.683 39.0012 219.562 39.3175 219.475 39.6819C219.388 40.0463 219.343 40.4423 219.343 40.8712C219.343 41.1685 219.378 41.4317 219.445 41.662C219.512 41.8922 219.616 42.0744 219.754 42.206C219.892 42.3376 220.069 42.4034 220.283 42.4034C220.453 42.4034 220.618 42.3768 220.775 42.3224C220.932 42.268 221.081 42.1934 221.223 42.0972C221.365 42.0011 221.5 41.8897 221.628 41.7607L221.752 41.9884C221.633 42.1364 221.488 42.2794 221.314 42.4161C221.141 42.5527 220.945 42.664 220.723 42.7501C220.502 42.8361 220.26 42.8779 219.997 42.8779H219.995Z",
  "M224.976 37.5778C225.401 37.5778 225.754 37.66 226.034 37.822C226.314 37.9852 226.524 38.2205 226.665 38.5267C226.805 38.8329 226.875 39.2023 226.875 39.6338C226.875 40.0652 226.815 40.4461 226.696 40.8345C226.577 41.2229 226.403 41.5721 226.172 41.8809C225.942 42.1896 225.658 42.4338 225.322 42.6147C224.985 42.7956 224.601 42.8867 224.17 42.8867C223.738 42.8867 223.391 42.8045 223.109 42.64C222.827 42.4755 222.617 42.2389 222.479 41.9302C222.341 41.6227 222.271 41.2571 222.271 40.8345C222.271 40.4119 222.332 40.007 222.455 39.6186C222.576 39.2302 222.755 38.881 222.989 38.5735C223.223 38.2648 223.508 38.0219 223.842 37.8447C224.176 37.6663 224.555 37.5778 224.977 37.5778H224.976ZM224.932 37.8599C224.71 37.8599 224.513 37.9257 224.338 38.0548C224.163 38.1851 224.012 38.361 223.884 38.5836C223.755 38.8063 223.65 39.0556 223.567 39.3301C223.485 39.6047 223.424 39.8906 223.384 40.1854C223.345 40.4802 223.324 40.7662 223.324 41.0433C223.324 41.3887 223.36 41.6784 223.431 41.9112C223.501 42.144 223.604 42.3174 223.739 42.4325C223.875 42.5476 224.037 42.6058 224.224 42.6058C224.446 42.6058 224.642 42.54 224.815 42.4085C224.989 42.2769 225.138 42.101 225.266 41.8821C225.392 41.6632 225.498 41.4152 225.58 41.1407C225.662 40.8661 225.724 40.5827 225.766 40.2904C225.808 39.9994 225.828 39.7173 225.828 39.4478C225.828 39.1517 225.801 38.8835 225.747 38.6444C225.692 38.4052 225.601 38.2155 225.472 38.0737C225.343 37.932 225.163 37.8612 224.933 37.8612L224.932 37.8599Z",
  "M159.313 54.7571L159.342 54.5344L160.039 54.3864L160.944 47.7856L160.291 47.6376L160.32 47.4098H161.527C161.79 47.4098 162.038 47.3972 162.268 47.3731C162.499 47.3491 162.769 47.3365 163.08 47.3365C163.585 47.3365 164.006 47.4048 164.345 47.5389C164.685 47.6743 164.94 47.8805 165.112 48.1563C165.285 48.4334 165.372 48.7826 165.374 49.204C165.374 49.5468 165.33 49.8619 165.243 50.1478C165.155 50.4338 165.026 50.6906 164.854 50.9171C164.682 51.1423 164.472 51.3346 164.224 51.4902C163.974 51.6471 163.691 51.7673 163.371 51.8508C163.05 51.9343 162.7 51.9774 162.318 51.9774C162.196 51.9774 162.072 51.9736 161.947 51.9672C161.821 51.9609 161.704 51.9508 161.594 51.9381C161.483 51.9255 161.385 51.9116 161.299 51.8989L161.343 51.5282C161.439 51.5484 161.544 51.5674 161.659 51.5877C161.775 51.6079 161.887 51.6231 161.996 51.6345C162.105 51.6459 162.201 51.6522 162.283 51.6522C162.551 51.6522 162.79 51.613 163.004 51.5333C163.216 51.4548 163.401 51.3435 163.558 51.2018C163.715 51.0601 163.845 50.8893 163.949 50.6906C164.053 50.4907 164.13 50.2705 164.182 50.0276C164.233 49.7847 164.259 49.5253 164.259 49.2495C164.259 48.894 164.211 48.5966 164.116 48.36C164.02 48.1234 163.872 47.9438 163.668 47.8236C163.464 47.7034 163.204 47.6452 162.885 47.6477C162.769 47.6477 162.649 47.654 162.524 47.6679C162.399 47.6806 162.277 47.6971 162.158 47.7148C162.039 47.7325 161.934 47.7502 161.842 47.7666L162.044 47.5933L161.119 54.3712L162.252 54.5395L162.223 54.7571H159.313Z",
  "M168.626 50.678H168.473C168.427 50.4641 168.325 50.2781 168.167 50.1213C168.008 49.9644 167.797 49.8872 167.534 49.8872C167.355 49.8872 167.197 49.9175 167.059 49.9783C166.921 50.039 166.812 50.1276 166.733 50.2427C166.653 50.3578 166.612 50.497 166.609 50.6577C166.609 50.8159 166.645 50.9601 166.717 51.0904C166.79 51.2207 166.89 51.3422 167.016 51.4561C167.143 51.5699 167.286 51.6826 167.444 51.7952C167.665 51.9432 167.859 52.09 168.025 52.2355C168.192 52.381 168.321 52.5391 168.416 52.7099C168.51 52.882 168.557 53.0806 168.557 53.3084C168.557 53.5652 168.506 53.7904 168.403 53.9828C168.301 54.1751 168.159 54.337 167.978 54.4673C167.797 54.5977 167.591 54.6964 167.36 54.7621C167.13 54.8279 166.886 54.8608 166.629 54.8608C166.44 54.8608 166.249 54.8431 166.055 54.809C165.86 54.7748 165.687 54.7305 165.534 54.6761C165.381 54.6217 165.269 54.5686 165.2 54.5154L165.417 53.5665H165.566C165.629 53.7449 165.711 53.9068 165.815 54.0561C165.919 54.2042 166.045 54.3231 166.196 54.4117C166.347 54.5002 166.516 54.5445 166.707 54.5445C166.878 54.5445 167.034 54.5104 167.174 54.4433C167.315 54.3762 167.426 54.2788 167.508 54.151C167.591 54.0245 167.633 53.8752 167.633 53.7031C167.633 53.5311 167.589 53.3792 167.503 53.2464C167.417 53.1123 167.305 52.9883 167.164 52.8731C167.024 52.758 166.873 52.6441 166.711 52.5315C166.555 52.4265 166.405 52.3063 166.257 52.1709C166.109 52.0356 165.985 51.8787 165.886 51.699C165.787 51.5193 165.738 51.3093 165.738 51.0689C165.738 50.7589 165.821 50.4932 165.99 50.2705C166.158 50.0479 166.385 49.8771 166.669 49.7569C166.954 49.6367 167.276 49.5759 167.631 49.5759C167.793 49.5759 167.951 49.5848 168.106 49.6012C168.26 49.6177 168.401 49.6405 168.526 49.6683C168.651 49.6961 168.751 49.7252 168.827 49.7543L168.625 50.6792L168.626 50.678Z",
  "M169.986 54.8659C169.864 54.8659 169.755 54.8431 169.659 54.7963C169.563 54.7495 169.492 54.6748 169.444 54.5711C169.396 54.4673 169.383 54.3294 169.407 54.1586C169.417 54.0865 169.437 53.9499 169.469 53.7512C169.501 53.5526 169.539 53.3109 169.583 53.0275C169.627 52.7441 169.674 52.4392 169.724 52.1127C169.773 51.7863 169.824 51.4573 169.874 51.1258C169.925 50.7944 169.969 50.4856 170.006 50.1984L169.402 50.0112L169.431 49.8328L170.86 49.581L171.044 49.705L170.391 54.0157C170.37 54.1409 170.382 54.227 170.425 54.2725C170.468 54.3181 170.516 54.3421 170.568 54.3421C170.637 54.3421 170.706 54.3231 170.773 54.2852C170.84 54.2472 170.923 54.1738 171.022 54.065L171.126 54.2624C171.06 54.3547 170.973 54.4471 170.864 54.5395C170.755 54.6318 170.626 54.709 170.478 54.7723C170.33 54.8355 170.164 54.8659 169.983 54.8659H169.986ZM170.664 48.9433C170.496 48.9433 170.364 48.8889 170.268 48.7801C170.172 48.6713 170.125 48.5397 170.125 48.3853C170.125 48.1551 170.187 47.9691 170.311 47.8274C170.435 47.6857 170.596 47.6148 170.793 47.6148C170.978 47.6148 171.116 47.6705 171.208 47.7806C171.301 47.8906 171.346 48.0222 171.346 48.174C171.346 48.4018 171.284 48.5865 171.16 48.7307C171.036 48.875 170.87 48.9458 170.663 48.9458L170.664 48.9433Z",
  "M173.309 54.8558C172.752 54.8558 172.325 54.6761 172.028 54.3168C171.732 53.9575 171.583 53.483 171.583 52.8934C171.583 52.4721 171.646 52.0621 171.773 51.6674C171.899 51.2726 172.084 50.9146 172.325 50.597C172.565 50.2794 172.86 50.0264 173.211 49.8404C173.56 49.6544 173.956 49.5608 174.398 49.5608C174.573 49.5608 174.764 49.5785 174.969 49.6152C175.175 49.6519 175.354 49.7037 175.505 49.7733L175.189 50.8905L174.992 50.8804C174.912 50.6134 174.84 50.4059 174.774 50.2579C174.708 50.1099 174.636 50.0061 174.556 49.9467C174.476 49.8872 174.376 49.8581 174.255 49.8581C174.05 49.8581 173.852 49.9327 173.661 50.0833C173.47 50.2339 173.298 50.4426 173.147 50.7109C172.997 50.9791 172.877 51.2954 172.789 51.6598C172.702 52.0242 172.658 52.4202 172.658 52.8491C172.658 53.1465 172.692 53.4096 172.759 53.6399C172.826 53.8702 172.93 54.0524 173.068 54.1839C173.206 54.3155 173.383 54.3813 173.597 54.3813C173.768 54.3813 173.932 54.3548 174.089 54.3004C174.246 54.2459 174.395 54.1713 174.537 54.0751C174.679 53.979 174.814 53.8676 174.942 53.7386L175.066 53.9663C174.947 54.1144 174.802 54.2573 174.628 54.394C174.455 54.5306 174.259 54.642 174.037 54.728C173.816 54.814 173.574 54.8558 173.311 54.8558H173.309Z",
  "M179.498 53.9663C179.475 54.1118 179.481 54.2105 179.518 54.2649C179.555 54.3193 179.61 54.3459 179.686 54.3459C179.746 54.3459 179.817 54.3231 179.899 54.2763C179.981 54.2308 180.066 54.1574 180.151 54.0587L180.255 54.2459C180.205 54.3219 180.128 54.4079 180.024 54.5028C179.92 54.5989 179.794 54.6812 179.643 54.752C179.493 54.8229 179.324 54.8583 179.137 54.8583C178.919 54.8583 178.761 54.7913 178.662 54.6584C178.564 54.5256 178.526 54.3459 178.548 54.122L178.632 53.6184C178.546 53.8322 178.423 54.0347 178.264 54.2244C178.104 54.4142 177.919 54.5673 177.712 54.6837C177.504 54.8001 177.286 54.8596 177.059 54.8596C176.769 54.8596 176.51 54.7875 176.284 54.642C176.059 54.4977 175.881 54.2877 175.755 54.0144C175.628 53.7411 175.565 53.4084 175.565 53.0161C175.565 52.677 175.609 52.3405 175.697 52.0077C175.784 51.675 175.913 51.3612 176.083 51.0677C176.252 50.7741 176.461 50.5148 176.708 50.2895C176.955 50.0643 177.238 49.8859 177.559 49.7556C177.879 49.6253 178.231 49.5608 178.617 49.5608C178.801 49.5608 178.976 49.5823 179.141 49.6253C179.305 49.6683 179.456 49.7265 179.591 49.7986L180.18 49.6063L179.498 53.9663ZM179.137 50.12C179.094 50.0416 179.026 49.9745 178.932 49.9201C178.838 49.8657 178.718 49.8378 178.574 49.8378C178.307 49.8378 178.069 49.9036 177.858 50.0327C177.648 50.163 177.467 50.3389 177.312 50.559C177.156 50.7805 177.027 51.0297 176.923 51.3081C176.819 51.5864 176.742 51.8762 176.69 52.1785C176.64 52.4797 176.613 52.7745 176.613 53.0617C176.613 53.3818 176.643 53.6399 176.704 53.8385C176.765 54.0359 176.85 54.1802 176.956 54.2713C177.064 54.3623 177.186 54.4066 177.324 54.4066C177.462 54.4066 177.605 54.3699 177.742 54.2978C177.879 54.2257 178.009 54.1245 178.133 53.9942C178.257 53.8638 178.367 53.7108 178.465 53.5349C178.562 53.359 178.637 53.168 178.69 52.9643L179.136 50.1213L179.137 50.12Z",
  "M182.262 51.4295C182.381 51.1752 182.516 50.9373 182.67 50.7121C182.823 50.4882 182.99 50.2883 183.172 50.1137C183.354 49.9391 183.546 49.8024 183.748 49.7063C183.951 49.6088 184.161 49.5608 184.378 49.5608C184.699 49.5608 184.942 49.6557 185.107 49.8454C185.273 50.0352 185.357 50.306 185.357 50.659C185.357 50.7906 185.345 50.9525 185.323 51.1436C185.3 51.3346 185.271 51.5421 185.237 51.7635C185.202 51.985 185.167 52.2089 185.13 52.4329C185.097 52.6378 185.063 52.8441 185.029 53.0528C184.995 53.2616 184.966 53.4552 184.943 53.631C184.92 53.8069 184.905 53.9486 184.899 54.0536C184.899 54.1561 184.913 54.2295 184.94 54.2738C184.968 54.3181 185.013 54.3408 185.072 54.3408C185.134 54.3408 185.205 54.3193 185.282 54.2763C185.359 54.2333 185.447 54.1599 185.542 54.0536L185.645 54.2459C185.58 54.3345 185.49 54.4269 185.378 54.523C185.266 54.6192 185.134 54.6989 184.98 54.7647C184.826 54.8305 184.651 54.8634 184.453 54.8634C184.348 54.8634 184.253 54.8431 184.168 54.8014C184.085 54.7596 184.018 54.6964 183.971 54.6116C183.923 54.5256 183.899 54.4155 183.899 54.2801C183.899 54.208 183.906 54.1068 183.921 53.979C183.937 53.8512 183.957 53.7044 183.984 53.5412C184.01 53.378 184.038 53.2072 184.067 53.0275C184.096 52.8479 184.125 52.672 184.151 52.5012C184.18 52.3329 184.209 52.1672 184.234 52.0014C184.261 51.8369 184.285 51.68 184.306 51.5295C184.328 51.3802 184.344 51.241 184.356 51.1145C184.367 50.988 184.373 50.8779 184.373 50.7855C184.373 50.6476 184.358 50.5337 184.329 50.4452C184.3 50.3566 184.251 50.2908 184.183 50.2503C184.116 50.2098 184.027 50.1883 183.914 50.1883C183.776 50.1883 183.624 50.2402 183.459 50.3439C183.295 50.4477 183.129 50.5881 182.965 50.764C182.8 50.9399 182.648 51.141 182.509 51.3675C182.371 51.594 182.258 51.8293 182.172 52.0773L181.791 54.7571H180.827L181.475 50.2035L180.896 50.015L180.931 49.8328L182.32 49.5759L182.499 49.6999L182.261 51.4308L182.262 51.4295Z",
  "M189.997 53.9663C189.974 54.1118 189.981 54.2105 190.017 54.2649C190.054 54.3193 190.11 54.3459 190.186 54.3459C190.245 54.3459 190.316 54.3231 190.398 54.2763C190.481 54.2308 190.565 54.1574 190.65 54.0587L190.754 54.2459C190.705 54.3219 190.627 54.4079 190.524 54.5028C190.42 54.5989 190.293 54.6812 190.143 54.752C189.992 54.8229 189.824 54.8583 189.636 54.8583C189.419 54.8583 189.26 54.7913 189.162 54.6584C189.063 54.5256 189.025 54.3459 189.048 54.122L189.131 53.6184C189.045 53.8322 188.922 54.0347 188.763 54.2244C188.603 54.4142 188.419 54.5673 188.211 54.6837C188.003 54.8001 187.786 54.8596 187.558 54.8596C187.268 54.8596 187.01 54.7875 186.783 54.642C186.558 54.4977 186.381 54.2877 186.254 54.0144C186.128 53.7411 186.064 53.4084 186.064 53.0161C186.064 52.677 186.109 52.3405 186.196 52.0077C186.283 51.675 186.412 51.3612 186.582 51.0677C186.752 50.7741 186.961 50.5148 187.207 50.2895C187.454 50.0643 187.738 49.8859 188.058 49.7556C188.378 49.6253 188.73 49.5608 189.116 49.5608C189.301 49.5608 189.476 49.5823 189.64 49.6253C189.805 49.6683 189.955 49.7265 190.091 49.7986L190.679 49.6063L189.997 53.9663ZM189.636 50.12C189.593 50.0416 189.525 49.9745 189.431 49.9201C189.338 49.8657 189.217 49.8378 189.073 49.8378C188.806 49.8378 188.568 49.9036 188.358 50.0327C188.148 50.163 187.967 50.3389 187.811 50.559C187.655 50.7805 187.526 51.0297 187.423 51.3081C187.319 51.5864 187.242 51.8762 187.19 52.1785C187.139 52.4797 187.112 52.7745 187.112 53.0617C187.112 53.3818 187.143 53.6399 187.204 53.8385C187.264 54.0359 187.349 54.1802 187.455 54.2713C187.563 54.3623 187.686 54.4066 187.824 54.4066C187.962 54.4066 188.105 54.3699 188.241 54.2978C188.378 54.2257 188.509 54.1245 188.633 53.9942C188.757 53.8638 188.867 53.7108 188.964 53.5349C189.062 53.359 189.136 53.168 189.19 52.9643L189.635 50.1213L189.636 50.12ZM188.905 48.8687L190.32 46.8114L191.007 47.3795C190.927 47.4756 190.832 47.5794 190.72 47.6907C190.607 47.8033 190.484 47.9172 190.349 48.0349C190.214 48.1513 190.073 48.2677 189.929 48.3828C189.783 48.498 189.638 48.608 189.488 48.7143C189.34 48.8193 189.197 48.9155 189.058 49.0015L188.905 48.8674V48.8687Z",
  "M192.341 54.0498C192.329 54.1523 192.341 54.2257 192.378 54.2725C192.416 54.3181 192.467 54.3421 192.529 54.3421C192.591 54.3421 192.661 54.3206 192.739 54.2776C192.816 54.2346 192.904 54.1574 193.003 54.0448L193.107 54.2371C193.027 54.3459 192.931 54.4484 192.817 54.5433C192.703 54.6394 192.574 54.7166 192.429 54.7761C192.283 54.8355 192.124 54.8646 191.949 54.8646C191.834 54.8646 191.732 54.8444 191.648 54.8052C191.562 54.766 191.494 54.7002 191.448 54.6103C191.4 54.5205 191.375 54.4016 191.375 54.2573C191.375 54.2244 191.379 54.1814 191.386 54.1295C191.392 54.0764 191.4 54.0169 191.408 53.9486C191.417 53.8803 191.427 53.8132 191.44 53.7436L192.405 47.2074L191.741 47.0594L191.781 46.881L193.284 46.6785L193.418 46.7823L192.34 54.0498H192.341Z",
  "M194.379 54.8659C194.258 54.8659 194.149 54.8431 194.053 54.7963C193.956 54.7495 193.885 54.6748 193.837 54.5711C193.789 54.4673 193.777 54.3294 193.801 54.1586C193.811 54.0865 193.831 53.9499 193.863 53.7512C193.894 53.5526 193.932 53.3109 193.977 53.0275C194.021 52.7441 194.068 52.4392 194.117 52.1127C194.166 51.7863 194.217 51.4573 194.268 51.1258C194.318 50.7944 194.363 50.4856 194.399 50.1984L193.796 50.0112L193.825 49.8328L195.254 49.581L195.437 49.705L194.784 54.0157C194.764 54.1409 194.775 54.227 194.818 54.2725C194.861 54.3181 194.909 54.3421 194.961 54.3421C195.031 54.3421 195.099 54.3231 195.166 54.2852C195.233 54.2472 195.317 54.1738 195.416 54.065L195.52 54.2624C195.454 54.3547 195.366 54.4471 195.258 54.5395C195.149 54.6318 195.02 54.709 194.871 54.7723C194.723 54.8355 194.558 54.8659 194.377 54.8659H194.379ZM195.058 48.9433C194.889 48.9433 194.758 48.8889 194.661 48.7801C194.565 48.6713 194.518 48.5397 194.518 48.3853C194.518 48.1551 194.58 47.9691 194.704 47.8274C194.828 47.6857 194.989 47.6148 195.187 47.6148C195.371 47.6148 195.509 47.6705 195.602 47.7806C195.694 47.8906 195.74 48.0222 195.74 48.174C195.74 48.4018 195.678 48.5865 195.554 48.7307C195.43 48.875 195.264 48.9458 195.056 48.9458L195.058 48.9433Z",
  "M199.346 50.678H199.193C199.147 50.4641 199.045 50.2781 198.886 50.1213C198.728 49.9644 198.517 49.8872 198.254 49.8872C198.075 49.8872 197.917 49.9175 197.779 49.9783C197.641 50.039 197.532 50.1276 197.452 50.2427C197.373 50.3578 197.332 50.497 197.328 50.6577C197.328 50.8159 197.365 50.9601 197.437 51.0904C197.509 51.2207 197.609 51.3422 197.736 51.4561C197.862 51.5699 198.005 51.6826 198.164 51.7952C198.385 51.9432 198.579 52.09 198.745 52.2355C198.912 52.381 199.041 52.5391 199.136 52.7099C199.229 52.882 199.276 53.0806 199.276 53.3084C199.276 53.5652 199.226 53.7904 199.123 53.9828C199.021 54.1751 198.879 54.337 198.698 54.4673C198.517 54.5977 198.311 54.6964 198.08 54.7621C197.85 54.8279 197.605 54.8608 197.349 54.8608C197.16 54.8608 196.969 54.8431 196.775 54.809C196.58 54.7748 196.407 54.7305 196.254 54.6761C196.1 54.6217 195.989 54.5686 195.919 54.5154L196.137 53.5665H196.285C196.349 53.7449 196.431 53.9068 196.535 54.0561C196.638 54.2042 196.765 54.3231 196.916 54.4117C197.066 54.5002 197.236 54.5445 197.427 54.5445C197.598 54.5445 197.754 54.5104 197.894 54.4433C198.035 54.3762 198.146 54.2788 198.228 54.151C198.31 54.0245 198.352 53.8752 198.352 53.7031C198.352 53.5311 198.309 53.3792 198.223 53.2464C198.137 53.1123 198.024 52.9883 197.884 52.8731C197.743 52.758 197.593 52.6441 197.431 52.5315C197.275 52.4265 197.124 52.3063 196.976 52.1709C196.828 52.0356 196.704 51.8787 196.606 51.699C196.507 51.5193 196.457 51.3093 196.457 51.0689C196.457 50.7589 196.541 50.4932 196.709 50.2705C196.878 50.0479 197.104 49.8771 197.389 49.7569C197.674 49.6367 197.995 49.5759 198.351 49.5759C198.513 49.5759 198.671 49.5848 198.826 49.6012C198.98 49.6177 199.121 49.6405 199.246 49.6683C199.371 49.6961 199.471 49.7252 199.547 49.7543L199.345 50.6792L199.346 50.678Z",
  "M203.679 53.8967C203.576 54.0384 203.432 54.1839 203.243 54.332C203.055 54.48 202.834 54.6053 202.58 54.7078C202.325 54.8102 202.05 54.8608 201.748 54.8608C201.447 54.8608 201.169 54.8077 200.937 54.7027C200.705 54.5977 200.515 54.4534 200.364 54.27C200.212 54.0865 200.098 53.874 200.022 53.6323C199.946 53.3906 199.908 53.13 199.908 52.8542C199.912 52.4126 199.983 51.9925 200.123 51.5965C200.264 51.1992 200.46 50.8475 200.714 50.5413C200.969 50.2351 201.266 49.9935 201.609 49.8176C201.952 49.6417 202.328 49.5532 202.737 49.5532C203.02 49.5532 203.256 49.5962 203.444 49.6835C203.632 49.7708 203.774 49.8922 203.867 50.0466C203.961 50.201 204.008 50.3806 204.008 50.5856C204.008 50.8526 203.949 51.0892 203.832 51.2979C203.715 51.5054 203.555 51.6864 203.352 51.8395C203.149 51.9925 202.918 52.1203 202.657 52.2228C202.396 52.3253 202.122 52.4025 201.833 52.4556C201.545 52.5088 201.257 52.5379 200.97 52.5442C200.953 52.7745 200.961 52.9997 200.995 53.2186C201.028 53.4374 201.088 53.6336 201.174 53.8069C201.26 53.9802 201.376 54.1181 201.524 54.2219C201.672 54.3256 201.855 54.3775 202.069 54.3775C202.263 54.3775 202.447 54.3472 202.623 54.289C202.798 54.2295 202.962 54.146 203.118 54.0397C203.272 53.9322 203.417 53.8082 203.548 53.6665L203.677 53.8993L203.679 53.8967ZM202.58 49.8378C202.369 49.8378 202.174 49.9074 201.994 50.0453C201.814 50.1833 201.655 50.3692 201.514 50.6033C201.374 50.8374 201.257 51.1031 201.165 51.3991C201.072 51.6952 201.012 52.0027 200.981 52.319C201.228 52.2962 201.458 52.2456 201.671 52.1684C201.884 52.0912 202.076 51.9925 202.247 51.8749C202.419 51.7559 202.565 51.6218 202.687 51.4725C202.809 51.322 202.904 51.1613 202.97 50.9879C203.036 50.8146 203.068 50.6349 203.068 50.4464C203.065 50.249 203.024 50.0985 202.944 49.9935C202.865 49.8897 202.743 49.8378 202.579 49.8378H202.58Z",
];
const LOGO_GREEN_PATH = "M59.6048 55C56.4632 55 51.6153 54.7141 45.9764 53.3932C39.7856 51.9445 31.8228 49.0002 24.3258 43.0346C23.9827 43.1611 23.641 43.2775 23.3005 43.3813C17.9325 45.016 13.6846 43.5369 11.6467 39.3199C10.3443 36.6249 11.2493 33.8882 13.9998 32.0283C11.0405 27.6847 10.0418 23.7359 11.0303 20.278C12.0695 16.6442 15.2124 13.7506 20.3716 11.6782C24.3384 10.0852 31.2887 8.0406 33.2632 12.2513C33.3468 12.431 33.4189 12.617 33.4771 12.8093C35.4922 10.3231 38.0794 9.14895 40.6691 9.70566C42.7741 10.1599 45.0423 11.892 46.3815 15.2955C48.3902 14.8742 50.5293 15.5245 52.1976 17.0896C55.2189 19.9225 56.2012 25.0606 54.8266 30.8314C54.1241 33.7819 52.8684 36.9716 51.4673 39.3654C49.4104 42.8803 47.0359 44.8945 44.4094 45.35C40.6755 45.9991 36.777 43.4142 32.8114 37.6675C30.8899 39.4591 28.6572 41.0204 26.3801 42.1452C33.3366 47.4453 40.6312 50.12 46.3536 51.4662C52.8254 52.9895 58.3112 53.0933 61.1363 53.006C56.2822 47.3415 57.9213 42.6614 59.7946 37.3107C60.9756 33.9388 62.3135 30.1178 62.3135 25.3314C62.3135 11.3517 51.1128 1.95859 34.4429 1.95859C19.6982 1.95859 11.8328 7.07902 7.83051 11.3745C3.63708 15.875 1.57517 21.8052 2.02198 28.0757C3.2447 45.2298 16.306 52.8807 28.7711 52.8807C28.8331 52.8807 28.8939 52.8795 28.9571 52.8807C29.4964 52.8807 29.9343 53.316 29.9381 53.855C29.9406 54.3965 29.5052 54.8381 28.9635 54.8406C28.8989 54.8406 28.8344 54.8406 28.7698 54.8406C21.7487 54.8406 15.0947 52.5821 10.0152 48.4714C4.1092 43.6925 0.668893 36.6882 0.0651305 28.2149C-0.420918 21.3952 1.82579 14.9412 6.39135 10.0409C10.6595 5.46078 18.9906 0 34.4404 0C43.3551 0 50.9116 2.50265 56.291 7.23971C61.4376 11.7705 64.2729 18.1967 64.2729 25.3352C64.2729 30.4543 62.8767 34.4424 61.6439 37.9623C59.6022 43.7925 58.2542 47.6452 63.9729 53.1553C64.2463 53.4185 64.3425 53.8157 64.221 54.1751C64.0994 54.5344 63.7805 54.7912 63.4033 54.8343C63.2729 54.8494 61.8894 55 59.6048 55ZM34.2176 36.2529C37.7807 41.5252 41.097 43.938 44.0727 43.4193C48.8066 42.5981 51.928 34.5297 52.9165 30.3784C54.1266 25.2997 53.3558 20.8663 50.8534 18.5206C49.6977 17.4363 48.3117 16.9631 46.9764 17.1794C47.427 18.9887 47.6472 21.1548 47.5346 23.7169C47.3422 28.1149 45.9828 29.6269 44.8765 30.1216C43.9765 30.5239 42.9779 30.3594 42.1361 29.6699C40.7527 28.5375 39.7135 25.8236 40.5071 22.3112C41.1716 19.3708 42.6083 17.1529 44.5385 16.0141C43.5234 13.4343 41.9083 11.9793 40.254 11.6225C37.5554 11.038 34.7543 13.2838 33.0999 17.3439C32.7658 18.2524 32.2987 19.176 31.7215 20.073C36.6187 21.4129 38.1731 24.0269 38.4984 26.3107C38.9502 29.4763 37.1111 33.1075 34.2176 36.2529ZM15.1503 33.6174C13.8175 34.4993 12.2758 36.1112 13.4137 38.4671C14.5314 40.78 17.0237 43.1776 22.5525 41.5594C19.9754 39.3148 17.4768 36.6882 15.1503 33.6187V33.6174ZM16.9249 32.7103C19.3539 35.8721 21.9727 38.5367 24.6688 40.7838C27.1193 39.7134 29.6002 38.042 31.6924 36.0429C29.9938 33.854 27.3699 32.4104 24.2169 31.9486C21.7297 31.5842 19.059 31.8765 16.9249 32.7115V32.7103ZM22.0284 29.8571C26.0447 29.8571 30.314 31.2337 33.067 34.6182C35.6125 31.7474 36.8795 28.845 36.5567 26.5878C36.2251 24.2648 34.1075 22.6276 30.4545 21.7862C29.1951 23.2804 27.6382 24.6077 25.9092 25.5401C21.4171 27.9618 17.8211 28.454 16.0427 26.8902C15.1174 26.0766 14.8592 24.8278 15.3503 23.5487C16.2034 21.3307 19.2995 19.1279 24.2992 19.181C26.3548 19.2064 28.1243 19.362 29.6445 19.6201C31.3836 17.1946 32.176 14.5541 31.4861 13.0851C30.5583 11.1063 26.6763 11.2606 21.1006 13.5001C16.5325 15.3347 13.7783 17.7981 12.9138 20.8195C12.0809 23.7321 13.0277 27.1837 15.7288 31.0882C17.5249 30.3076 19.7336 29.8584 22.0259 29.8584L22.0284 29.8571ZM45.1372 17.9677C43.874 18.9014 42.9146 20.5665 42.4222 22.7427C41.7754 25.6059 42.6412 27.5455 43.3816 28.1516C43.7677 28.4679 44.0019 28.3642 44.0791 28.33C44.6879 28.058 45.4448 26.6649 45.5777 23.6296C45.6739 21.442 45.5018 19.5556 45.1372 17.9677ZM24.0967 21.1396C20.169 21.1396 17.7629 22.7414 17.1819 24.2509C17.0477 24.6013 16.9654 25.0885 17.3388 25.4162C17.9983 25.9956 20.3475 26.3094 24.9789 23.8131C26.1586 23.1767 27.2319 22.3328 28.1585 21.3876C26.9775 21.2409 25.6814 21.1574 24.2764 21.1409C24.2169 21.1409 24.1562 21.1409 24.0967 21.1409V21.1396Z";

function Logo({ light = false, className }: { light?: boolean; className?: string }) {
  const f = light ? "#FFF7F2" : "#092529";
  return (
    <svg width="227" height="55" viewBox="0 0 227 55" fill="none"
      className={className ?? "h-[55px] w-auto shrink-0"} aria-label="Breno Psicólogo" role="img">
      <g fill={f}>
        {LOGO_DARK_PATHS.map((d, i) => <path key={i} d={d} />)}
      </g>
      <path d={LOGO_GREEN_PATH} fill="#AFD7BF" />
    </svg>
  );
}

function WhatsAppIcon({ size = 16, className = "text-current" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"
      className={`shrink-0 ${className}`} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.89-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

const HEADER_HEIGHT = 76;

function Header() {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const offset = useRef(0);
  const lastY = useRef(0);
  const { pathname } = useLocation();
  useEffect(() => {
    setOpen(false);
    setDropdownOpen(false);
  }, [pathname]);
  useEffect(() => {
    offset.current = 0;
    lastY.current = window.scrollY;
    if (headerRef.current) headerRef.current.style.transform = "translate3d(0, 0, 0)";
  }, [pathname]);
  useEffect(() => {
    const applyOffset = () => {
      if (headerRef.current) {
        headerRef.current.style.transform = `translate3d(0, -${offset.current}px, 0)`;
      }
    };
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY.current;
      setScrolled(y > 8);

      if (open) {
        offset.current = 0;
      } else if (y <= 0) {
        offset.current = 0;
      } else {
        offset.current = Math.min(
          HEADER_HEIGHT,
          Math.max(0, offset.current + delta),
        );
      }
      applyOffset();
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);
  useEffect(() => {
    if (open) {
      offset.current = 0;
      if (headerRef.current) headerRef.current.style.transform = "translate3d(0, 0, 0)";
    }
  }, [open]);
  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-50 w-full bg-[#FFF7F2] will-change-transform ${scrolled ? "shadow-[0_2px_20px_rgba(9,37,41,0.09)] border-b border-transparent" : "border-b border-[rgba(9,37,41,0.07)] shadow-none"} transition-[box-shadow,border-color] duration-300 ease-out`}
    >
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 md:px-8 lg:px-10 h-[76px]">
        <Link to="/"><Logo /></Link>
        <nav className="hidden md:flex items-center gap-0.5 lg:gap-1" aria-label="Navegação principal">
          <div
            className="relative"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <button
              type="button"
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
              onClick={() => setDropdownOpen(v => !v)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 lg:px-5 rounded-xl text-[13px] lg:text-[14px] font-semibold font-['Noto_Sans',sans-serif] text-[#092529] hover:bg-[rgba(9,37,41,0.05)] transition-colors focus-visible:outline-2 focus-visible:outline-[#092529] focus-visible:outline-offset-2"
            >
              Conteúdos
              <ChevronDown size={14} className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
            </button>
            <div
              className={`absolute top-full left-0 z-50 pt-2 transition-all duration-150 ${dropdownOpen ? "opacity-100 visible translate-y-0 pointer-events-auto" : "opacity-0 invisible translate-y-1 pointer-events-none"}`}
            >
              <div className="w-52 rounded-2xl border border-[rgba(9,37,41,0.07)] bg-[#FFF7F2] py-2 flex flex-col gap-1">
                <Link
                  to="/conteudos"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 pl-6 pr-3 py-2.5 rounded-xl font-['Noto_Sans',sans-serif] font-semibold text-[#092529] text-[14px] hover:bg-[rgba(9,37,41,0.04)] transition-colors"
                >
                  <BookOpen size={13} className="shrink-0 text-[#092529]" />
                  Conteúdos
                </Link>
                {CATEGORIES.map(c => (
                  <Link
                    key={c.slug}
                    to={`/conteudos/${c.slug}`}
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 pl-6 pr-3 py-2.5 rounded-xl text-[14px] font-['Noto_Sans',sans-serif] text-[rgba(9,37,41,0.55)] hover:text-[#092529] hover:bg-[rgba(9,37,41,0.03)] transition-colors"
                  >
                    <span style={{ color: muted }}><CatIcon slug={c.slug} size={13} /></span>{c.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <a href={WA} target="_blank" rel="noopener noreferrer"
            className="ml-1 lg:ml-2 flex items-center gap-2 bg-[#AFD7BF] hover:bg-[#9DCAAF] active:scale-[0.98] transition-all px-4 py-2.5 lg:px-6 rounded-xl font-['Noto_Sans',sans-serif] font-bold text-[#092529] text-[13px] lg:text-[14px]">
            <WhatsAppIcon size={14} className="text-current" />Fale comigo
          </a>
        </nav>
        <button
          onClick={() => setOpen(v => !v)}
          className="md:hidden p-2 rounded-xl hover:bg-[rgba(9,37,41,0.06)] transition-colors focus-visible:outline-2 focus-visible:outline-[#092529]"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
        >
          {open ? <X size={22} color={dark} /> : <Menu size={22} color={dark} />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-[rgba(9,37,41,0.07)] bg-[#FFF7F2] px-6 pb-5 pt-3 flex flex-col gap-1">
          <Link to="/conteudos" className="flex items-center gap-2 pl-6 pr-3 py-2.5 rounded-xl font-['Noto_Sans',sans-serif] font-semibold text-[#092529] text-[15px] hover:bg-[rgba(9,37,41,0.04)] transition-colors">
            <BookOpen size={13} className="shrink-0 text-[#092529]" />
            Conteúdos
          </Link>
          {CATEGORIES.map(c => (
            <Link key={c.slug} to={`/conteudos/${c.slug}`}
              className="flex items-center gap-2 pl-6 pr-3 py-2.5 rounded-xl text-[14px] font-['Noto_Sans',sans-serif] text-[rgba(9,37,41,0.55)] hover:text-[#092529] hover:bg-[rgba(9,37,41,0.03)]">
              <span style={{ color: muted }}><CatIcon slug={c.slug} size={13} /></span>{c.name}
            </Link>
          ))}
          <a href={WA} target="_blank" rel="noopener noreferrer"
            className="mt-2 flex items-center justify-center gap-2 bg-[#AFD7BF] hover:bg-[#9DCAAF] py-3.5 rounded-xl font-['Noto_Sans',sans-serif] font-bold text-[#092529] text-[15px] transition-colors">
            <WhatsAppIcon size={15} className="text-current" />Fale comigo
          </a>
        </div>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-[#092529] text-[#FFF7F2]">
      <div className="mx-auto max-w-[1280px] px-6 md:px-8 lg:px-10 pt-16 pb-10 max-md:pb-28 flex flex-col gap-12">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10 md:gap-12 lg:gap-16">
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-12 lg:flex lg:flex-col lg:max-w-[420px] gap-5 lg:gap-5 items-start">
            <Logo light className="h-[72px] w-auto shrink-0" />
            <div className="flex flex-col items-start gap-5 min-w-0 w-full md:col-start-2 lg:col-start-auto">
              <p className="font-['Noto_Sans',sans-serif] text-[rgba(255,247,242,0.55)] text-[14px] leading-[1.7]">
                Psicólogo clínico com orientação psicanalítica. Atendimento online para adultos e idosos em Salvador, em todo o Brasil e para brasileiros no exterior.
              </p>
              <a href={WA} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[rgba(175,215,191,0.3)] bg-[rgba(175,215,191,0.1)] hover:bg-[rgba(175,215,191,0.2)] text-[#AFD7BF] text-[13px] font-semibold font-['Noto_Sans',sans-serif] transition-colors">
                <WhatsAppIcon size={13} />WhatsApp
              </a>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-10 md:gap-x-12 lg:gap-x-16 gap-y-10 md:gap-y-12 shrink-0">
            <div>
            <p className="font-['Noto_Sans',sans-serif] font-bold text-[#AFD7BF] text-[11px] uppercase tracking-[0.12em] mb-5">Conteúdos</p>
            <ul className="flex flex-col gap-3">
              {CATEGORIES.map(c => (
                <li key={c.slug}>
                  <Link to={`/conteudos/${c.slug}`} className="inline-flex items-center gap-2 font-['Noto_Sans',sans-serif] text-[rgba(255,247,242,0.55)] text-[13px] hover:text-[#AFD7BF] transition-colors">
                    <span className="opacity-60"><CatIcon slug={c.slug} size={12} /></span>{c.name}
                  </Link>
                </li>
              ))}
            </ul>
            </div>
          <div>
            <p className="font-['Noto_Sans',sans-serif] font-bold text-[#AFD7BF] text-[11px] uppercase tracking-[0.12em] mb-5">Contato</p>
            <ul className="flex flex-col gap-3">
              {([
                { Icon: MapPin, text: "Salvador, Bahia" },
                { whatsapp: true, text: "WhatsApp", href: WA },
                { Icon: Shield, text: "CRP 03/36165" },
              ] as const).map((item) => (
                <li key={item.text}>
                  {item.href
                    ? <a href={item.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[rgba(255,247,242,0.55)] text-[13px] font-['Noto_Sans',sans-serif] hover:text-[#AFD7BF] transition-colors">
                        {item.whatsapp ? <WhatsAppIcon size={13} className="text-[#AFD7BF]" /> : <item.Icon size={13} color={mint} />}
                        {item.text}
                      </a>
                    : <span className="flex items-center gap-2 text-[rgba(255,247,242,0.55)] text-[13px] font-['Noto_Sans',sans-serif]">
                        {item.whatsapp ? <WhatsAppIcon size={13} className="text-[#AFD7BF]" /> : <item.Icon size={13} color={mint} />}
                        {item.text}
                      </span>}
                </li>
              ))}
            </ul>
          </div>
          </div>
        </div>
        <div className="border-t border-[rgba(255,247,242,0.08)] pt-7 flex flex-col sm:flex-row justify-between gap-3">
          <p className="font-['Noto_Sans',sans-serif] text-[rgba(255,247,242,0.3)] text-[12px]">© 2025 Breno Psicólogo · CRP 03/36165 · Todos os direitos reservados</p>
          <p className="font-['Noto_Sans',sans-serif] text-[rgba(255,247,242,0.3)] text-[12px]">Atendimento psicológico online para todo o Brasil</p>
        </div>
      </div>
    </footer>
  );
}

function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      to={`/conteudos/${article.categorySlug}/${article.slug}`}
      className="group block rounded-[20px] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(9,37,41,0.09)]"
    >
      <div className="flex flex-col rounded-[20px] overflow-hidden bg-[#F8EDE4] border border-[rgba(9,37,41,0.04)]">
        <div className="h-[196px] md:h-[220px] lg:h-[196px] overflow-hidden shrink-0">
          <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500" />
        </div>
        <div className="flex flex-col gap-4 p-6 flex-1">
          <div className="flex items-center gap-1.5" style={{ color: muted }}>
            <CatIcon slug={article.categorySlug} size={11} />
            <span className="font-['Noto_Sans',sans-serif] text-[11px] font-semibold uppercase tracking-widest">{article.category}</span>
          </div>
          <p className="font-['Noto_Sans',sans-serif] font-bold text-[#092529] text-[17px] leading-[1.4] tracking-[-0.3px] line-clamp-2">{article.title}</p>
          <Meta date={article.date} readTime={article.readTime} />
          <p className="font-['Noto_Sans',sans-serif] text-[rgba(9,37,41,0.55)] text-[14px] leading-[1.6] line-clamp-2">{article.excerpt}</p>
          <div className="flex items-center gap-1.5 font-['Noto_Sans',sans-serif] font-bold text-[#092529] text-[13px] pt-1 group-hover:gap-2.5 transition-all">
            Leia mais <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}

function HeroHighlights() {
  const items = [
    { Icon: MapPin, bold: "Atendimento online", sub: "para todo o Brasil" },
    { Icon: User, bold: "Psicoterapia", sub: "para adultos e idosos" },
    { Icon: Brain, bold: "Abordagem", sub: "psicanalítica" },
  ] as const;

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" });
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setActive(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on("select", onSelect);
    return () => emblaApi.off("select", onSelect);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => emblaApi.scrollNext(), 4000);
    return () => clearInterval(id);
  }, [emblaApi]);

  const shell = "rounded-2xl border border-[rgba(9,37,41,0.08)] bg-[rgba(255,255,255,0.6)] backdrop-blur-sm w-full";

  return (
    <>
      <div className={`${shell} sm:hidden px-4 py-3.5`}>
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex">
            {items.map(({ Icon, bold, sub }) => (
              <div key={bold} className="min-w-0 shrink-0 grow-0 basis-full flex items-center justify-center min-h-[52px] px-1">
                <div className="inline-flex items-center gap-3 max-w-full">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-[rgba(175,215,191,0.4)]">
                    <Icon size={17} color={dark} />
                  </div>
                  <div className="min-w-0 text-left">
                    <p className="font-['Noto_Sans',sans-serif] font-bold text-[#092529] text-[14px] leading-tight">{bold}</p>
                    <p className="font-['Noto_Sans',sans-serif] text-[rgba(9,37,41,0.55)] text-[12px] leading-snug mt-0.5">{sub}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center items-center gap-2 mt-2.5" aria-hidden="true">
          {items.map(({ bold }, i) => (
            <span key={bold} className={`rounded-full transition-all duration-300 ${i === active ? "h-1.5 w-5 bg-[#092529]" : "h-1.5 w-1.5 bg-[rgba(9,37,41,0.18)]"}`} />
          ))}
        </div>
      </div>
      <div className={`${shell} hidden sm:flex flex-row items-stretch divide-x divide-[rgba(9,37,41,0.08)] py-4 md:py-5`}>
        {items.map(({ Icon, bold, sub }) => (
          <div key={bold} className="flex flex-1 items-center justify-center gap-2.5 sm:gap-3 px-3 sm:px-3 md:px-4 min-w-0">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-[rgba(175,215,191,0.35)]">
              <Icon size={16} color={dark} />
            </div>
            <div className="min-w-0">
              <p className="font-['Noto_Sans',sans-serif] font-bold text-[#092529] text-[13px] leading-tight">{bold}</p>
              <p className="font-['Noto_Sans',sans-serif] text-[rgba(9,37,41,0.5)] text-[12px] leading-snug mt-0.5">{sub}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function ArticleCardsCarousel({ articles }: { articles: Article[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [active, setActive] = useState(0);
  const [snapCount, setSnapCount] = useState(0);

  const syncCarousel = useCallback(() => {
    if (!emblaApi) return;
    setSnapCount(emblaApi.scrollSnapList().length);
    setActive(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    syncCarousel();
    emblaApi.on("select", syncCarousel);
    emblaApi.on("reInit", syncCarousel);
    return () => {
      emblaApi.off("select", syncCarousel);
      emblaApi.off("reInit", syncCarousel);
    };
  }, [emblaApi, syncCarousel]);

  useEffect(() => {
    if (!emblaApi) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => emblaApi.scrollNext(), 4000);
    return () => clearInterval(id);
  }, [emblaApi]);

  return (
    <div className="flex flex-col gap-4 -my-6">
      <div
        className="overflow-hidden cursor-grab active:cursor-grabbing px-4 pt-4 pb-14"
        ref={emblaRef}
      >
        <div className="flex -ml-5">
          {articles.map(a => (
            <div key={a.slug} className="min-w-0 shrink-0 grow-0 basis-1/2 pl-5 pr-2">
              <ArticleCard article={a} />
            </div>
          ))}
        </div>
      </div>
      {snapCount > 1 && (
        <div className="flex justify-center items-center gap-2" role="tablist" aria-label="Navegação do carrossel">
          {Array.from({ length: snapCount }, (_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`Slide ${i + 1}`}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`rounded-full transition-all duration-300 ${i === active ? "h-1.5 w-5 bg-[#092529]" : "h-1.5 w-1.5 bg-[rgba(9,37,41,0.18)] hover:bg-[rgba(9,37,41,0.35)]"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SmallCard({ article }: { article: Article }) {
  return (
    <Link to={`/conteudos/${article.categorySlug}/${article.slug}`} className="group flex gap-4 items-start">
      <div className="w-[88px] h-[88px] md:w-[96px] md:h-[96px] rounded-2xl overflow-hidden shrink-0 border border-[rgba(9,37,41,0.06)]">
        <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500" />
      </div>
      <div className="flex flex-col gap-2 flex-1 min-w-0 pt-0.5">
        <span className="inline-flex items-center gap-1.5 font-['Noto_Sans',sans-serif] text-[11px] font-semibold uppercase tracking-[0.12em] text-[rgba(9,37,41,0.45)]">
          <CatIcon slug={article.categorySlug} size={11} />{article.category}
        </span>
        <p className="font-['Noto_Sans',sans-serif] font-bold text-[#092529] text-[15px] md:text-[16px] leading-[1.35] tracking-[-0.2px] line-clamp-2 group-hover:text-[rgba(9,37,41,0.65)] transition-colors">
          {article.title}
        </p>
        <Meta date={article.date} readTime={article.readTime} />
      </div>
    </Link>
  );
}

const easeOut = [0.22, 1, 0.36, 1] as const;

function Reveal({
  children, delay = 0, className = "", y = 24, x = 0,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  y?: number;
  x?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, ease: easeOut, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function CTABanner() {
  return (
    <section className="w-full bg-[#AFD7BF]">
      <Reveal className="mx-auto max-w-[1280px] px-6 md:px-8 lg:px-10 py-16 md:py-20 flex flex-col lg:flex-row lg:items-center gap-8 md:gap-10 justify-between">
        <div className="flex flex-col gap-4 max-w-[560px]">
          <h2 className={bannerTitle}>
            Pronto para cuidar da sua <em>saúde emocional</em>?
          </h2>
          <p className="font-['Noto_Sans',sans-serif] text-[rgba(9,37,41,0.7)] text-[16px] leading-[1.65]">
            Entre em contato pelo WhatsApp para agendar sua primeira consulta. Atendo adultos e idosos em Salvador, todo o Brasil e brasileiros no exterior.
          </p>
        </div>
        <a href={WA} target="_blank" rel="noopener noreferrer"
          className={`${ctaBtn} shrink-0 gap-2.5 bg-[#092529] hover:bg-[#0e3a40] active:scale-[0.98] text-[#FFF7F2] px-8 py-4 rounded-2xl font-['Noto_Sans',sans-serif] font-bold text-[16px] transition-all shadow-[0_4px_20px_rgba(9,37,41,0.25)]`}>
          <WhatsAppIcon size={16} className="text-current" />Agendar consulta
        </a>
      </Reveal>
    </section>
  );
}

const FAQS = [
  { q: "O que é psicanálise e como ela funciona?", a: "A psicanálise é uma abordagem terapêutica baseada na escuta e na reflexão sobre a história, os sentimentos e as experiências de cada sujeito. O processo busca compreender os significados que existem por trás de sintomas, conflitos emocionais e padrões que se repetem ao longo da vida." },
  { q: "Como saber se preciso de terapia?", a: "Não é necessário estar em uma crise para procurar ajuda psicológica. A terapia pode ser indicada quando existe sofrimento emocional, ansiedade, dificuldades nos relacionamentos, baixa autoestima ou simplesmente o desejo de compreender melhor a si mesmo." },
  { q: "Como funciona a terapia online?", a: "As sessões acontecem por videochamada, em um ambiente seguro e sigiloso. O atendimento online permite que pessoas de Salvador, da Bahia, de todo o Brasil e brasileiros que vivem no exterior tenham acesso à psicoterapia com praticidade e conforto." },
  { q: "O que acontece na primeira sessão?", a: "A primeira sessão é um espaço para conversar sobre o que motivou sua busca por terapia, esclarecer dúvidas e compreender como o processo terapêutico pode ser construído de acordo com suas necessidades e momento de vida." },
  { q: "O que diferencia a psicanálise de outras formas de terapia?", a: "A psicanálise busca compreender os significados que existem por trás dos sintomas, conflitos emocionais e padrões que se repetem na vida de cada pessoa. Mais do que oferecer respostas prontas, ela convida à reflexão e ao autoconhecimento." },
];

function FAQAccordion({ items, className = "" }: { items: { q: string; a: string }[]; className?: string }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className={`flex flex-col divide-y divide-[rgba(9,37,41,0.08)] ${className}`}>
      {items.map((faq, i) => (
        <div key={faq.q}>
          <button
            type="button"
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
            className="w-full flex items-start justify-between gap-6 py-6 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#092529] focus-visible:ring-offset-2 focus-visible:rounded-lg"
          >
            <span className={`font-['Noto_Sans',sans-serif] font-bold text-[16px] leading-[1.5] transition-colors ${open === i ? "text-[#092529]" : "text-[#3a5254] group-hover:text-[#092529]"}`}>
              {faq.q}
            </span>
            <span className={`shrink-0 mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${open === i ? "bg-[#AFD7BF]" : "bg-[rgba(9,37,41,0.06)] group-hover:bg-[rgba(9,37,41,0.1)]"}`}>
              {open === i ? <Minus size={14} color={dark} /> : <Plus size={14} color="#576264" />}
            </span>
          </button>
          {open === i && (
            <div className="pb-6">
              <p className="font-['Noto_Sans',sans-serif] text-[rgba(9,37,41,0.65)] text-[15px] leading-[1.75] lg:max-w-[600px]">{faq.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function FAQSection() {
  return (
    <section className={`w-full bg-[#FFF7F2] ${sectionPy}`}>
      <div className={`mx-auto max-w-[1280px] ${sectionPad}`}>
        <div className="flex flex-col lg:flex-row gap-10 md:gap-12 lg:gap-24 items-stretch lg:items-start">
          <Reveal className="flex flex-col gap-5 w-full lg:w-[340px] xl:w-[380px] shrink-0 lg:sticky lg:top-28" x={-20}>
            <Label><BookOpen size={12} />Dúvidas frequentes</Label>
            <h2 className={sectionTitle}>
              Perguntas <em>frequentes</em>
            </h2>
            <p className="font-['Noto_Sans',sans-serif] text-[rgba(9,37,41,0.55)] text-[15px] leading-[1.7]">
              Tire suas principais dúvidas sobre o processo terapêutico e o atendimento online.
            </p>
            <a href={WA} target="_blank" rel="noopener noreferrer"
              className={`${ctaBtn} gap-2 bg-[#AFD7BF] hover:bg-[#9DCAAF] transition-colors px-6 py-3 rounded-xl font-['Noto_Sans',sans-serif] font-bold text-[#092529] text-[14px] mt-2`}>
              <WhatsAppIcon size={14} className="text-current" />Agendar consulta
            </a>
          </Reveal>
          <Reveal className="w-full flex-1 min-w-0" delay={0.15}>
            <FAQAccordion items={FAQS} className="w-full" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function BenefitCard({ Icon, title, desc }: { Icon: React.ElementType; title: string; desc: string }) {
  return (
    <div className="bg-[#AFD7BF] rounded-2xl p-7 md:p-5 lg:p-7 flex flex-col gap-3 md:gap-2.5 lg:gap-3 flex-1">
      <div className="w-12 h-12 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center bg-[#9DCAAF] shrink-0">
        <Icon size={20} color={dark} />
      </div>
      <p className="font-['Noto_Sans',sans-serif] font-bold text-[#092529] text-[19px] md:text-[15px] lg:text-[19px] leading-[1.3] tracking-[-0.3px]">{title}</p>
      <p className="font-['Noto_Sans',sans-serif] text-[rgba(9,37,41,0.75)] text-[14px] md:text-[13px] lg:text-[14px] leading-[1.65] md:leading-[1.55]">{desc}</p>
    </div>
  );
}

function HomePage() {
  return (
    <>
      <SEOHead
        title="Psicólogo Online em Salvador | Atendimento Psicológico Online"
        description="Breno, psicólogo clínico em Salvador, oferece atendimento psicológico online para adultos em todo o Brasil. Psicanálise, ansiedade, autoestima e relacionamentos."
        canonical="/"
      />
      {/* Hero */}
      <section className={`w-full bg-[#FFF7F2] pt-5 pb-6 md:pt-14 md:pb-20 lg:pt-16 lg:pb-28`}>
        <div className={`mx-auto max-w-[1280px] ${sectionPad}`}>
          <div className={`${splitRow} flex-col-reverse max-md:gap-4`}>
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: easeOut, delay: 0.1 }}
              className="flex flex-col gap-6 md:gap-7 lg:gap-8 flex-1 min-w-0"
            >
              <div className="flex flex-col gap-5">
                <Label><Sparkles size={12} />Acolhimento psicológico online</Label>
                <h1 className={heroTitle}>
                  O que se repete na sua vida <em>merece ser escutado</em>
                </h1>
                <p className="font-['Noto_Sans',sans-serif] text-[#092529] text-[16px] md:text-[17px] leading-[1.7]">
                  <strong className="font-semibold">Psicólogo clínico com atendimento online para adultos e idosos em Salvador, todo o Brasil e brasileiros no exterior.</strong>{" "}Um espaço de escuta, acolhimento e autoconhecimento através da orientação psicanalítica.
                </p>
              </div>
              <a id="hero-cta" href={WA} target="_blank" rel="noopener noreferrer"
                className={`${ctaBtn} gap-2.5 bg-[#AFD7BF] hover:bg-[#9DCAAF] active:scale-[0.98] transition-all px-7 py-4 rounded-2xl font-['Noto_Sans',sans-serif] font-bold text-[#092529] text-[16px] shadow-[0_4px_20px_rgba(175,215,191,0.55)]`}>
                <WhatsAppIcon size={16} className="text-current" />Agendar consulta
              </a>
              <HeroHighlights />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: easeOut }}
              className={heroImage}
            >
              <img src={imgHero} alt="Breno, psicólogo clínico" className="w-full h-full object-cover object-[center_20%]" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className={`w-full bg-[#FFF7F2] ${sectionPy} border-t border-[rgba(9,37,41,0.06)]`}>
        <div className={`mx-auto max-w-[1280px] ${sectionPad}`}>
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-10 md:gap-12 lg:gap-20">
            <Reveal className={aboutImage} x={-20}>
              <img src={imgAbout} alt="Breno Psicólogo" className="w-full h-full object-cover" />
            </Reveal>
            <Reveal className="flex flex-col gap-6 flex-1 min-w-0" delay={0.15}>
              <Label><User size={12} />Sobre mim</Label>
              <h2 className={sectionTitle}>
                Olá, sou <em>Breno</em>, psicólogo clínico
              </h2>
              <p className="font-['Noto_Sans',sans-serif] font-semibold text-[rgba(9,37,41,0.35)] text-[12px] uppercase tracking-[0.1em]">CRP 03/36165</p>
              <div className="flex flex-col gap-4 font-['Noto_Sans',sans-serif] text-[rgba(9,37,41,0.72)] text-[16px] leading-[1.7]">
                <p>Sou psicólogo clínico e realizo atendimentos online para adultos e idosos em Salvador, na Bahia, todo o Brasil e brasileiros no exterior.</p>
                <p className="font-semibold text-[rgba(9,37,41,0.85)]">Minha prática é orientada pela psicanálise, oferecendo um espaço de escuta para compreender sentimentos, relações e conflitos que atravessam sua história.</p>
              </div>
              <Link to="/conteudos/psicanalise/o-que-e-psicanalise"
                className={`${ctaBtn} gap-3 border border-[rgba(9,37,41,0.13)] bg-[#FFF7F2] hover:bg-[#F0E6DD] px-5 py-3 rounded-2xl font-['Noto_Sans',sans-serif] text-[#092529] text-[14px] transition-colors`}>
                <Brain size={15} />
                <span className="font-bold">Psicanálise</span>
                <span className="text-[rgba(9,37,41,0.4)] italic">— Saiba mais</span>
                <ArrowRight size={13} />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Specialties */}
      <section className={`w-full bg-[#AFD7BF] ${sectionPy}`}>
        <div className={`mx-auto max-w-[1280px] ${sectionPad} flex flex-col gap-10 md:gap-12 lg:gap-14`}>
          <Reveal className="flex flex-col items-center gap-4 text-center max-w-[600px] mx-auto">
            <Label variant="mint" align="center"><Layers size={12} />Especialidades</Label>
            <h2 className={sectionTitle}>Como posso <em>te ajudar</em></h2>
            <p className="font-['Noto_Sans',sans-serif] text-[rgba(9,37,41,0.7)] text-[16px] leading-[1.65]">
              A terapia pode ser um apoio importante quando sentimentos e situações da vida começam a pesar mais do que você consegue sustentar sozinho.
            </p>
          </Reveal>
          <div className={specialtyGrid}>
            {[
              { Icon: Heart, title: "Ansiedade e angústia",       desc: "A ansiedade pode ser mais do que um sintoma. Compreender seus significados é parte do processo terapêutico." },
              { Icon: Smile, title: "Sofrimento emocional",         desc: "Explore emoções difíceis e encontre um espaço seguro para compreender seu sofrimento." },
              { Icon: Brain, title: "Autoconhecimento e relações", desc: "Compreenda os padrões que se repetem em sua vida e descubra novas formas de se relacionar consigo mesmo e com os outros." },
            ].map(({ Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.65, ease: easeOut, delay: i * 0.1 }}
                className="bg-[#BFE2CD] rounded-2xl p-6 md:p-5 lg:p-8 flex flex-col gap-4 md:gap-3 lg:gap-5 min-w-0"
              >
                <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl flex items-center justify-center bg-[#AFD7BF] shrink-0">
                  <Icon size={24} color={dark} />
                </div>
                <p className="font-['Noto_Sans',sans-serif] font-bold text-[#092529] text-[20px] md:text-[17px] lg:text-[22px] leading-[1.25] tracking-[-0.4px]">{title}</p>
                <p className="font-['Noto_Sans',sans-serif] text-[rgba(9,37,41,0.75)] text-[14px] md:text-[13px] lg:text-[15px] leading-[1.6] lg:leading-[1.65]">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className={`w-full bg-[#FFF7F2] ${sectionPy}`}>
        <div className={`mx-auto max-w-[1280px] ${sectionPad} flex flex-col gap-10 md:gap-12 lg:gap-14`}>
          <Reveal className="flex flex-col items-center gap-4 text-center max-w-[580px] mx-auto">
            <Label align="center"><CheckCircle2 size={12} />Benefícios</Label>
            <h2 className={sectionTitle}>O que a psicoterapia pode <em>proporcionar</em></h2>
            <p className="font-['Noto_Sans',sans-serif] text-[rgba(9,37,41,0.55)] text-[16px] leading-[1.65]">
              A terapia online oferece praticidade, flexibilidade e acesso ao acompanhamento de qualquer lugar do Brasil.
            </p>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
            <Reveal className="flex flex-col gap-4">
              <BenefitCard Icon={MessageCircle} title="Ser ouvido com acolhimento"  desc="Um espaço seguro para falar livremente sobre sentimentos, angústias e experiências." />
              <BenefitCard Icon={Lightbulb}     title="Compreender seus sentimentos" desc="Mais clareza sobre emoções, conflitos e situações que se repetem na vida." />
            </Reveal>
            <Reveal className="rounded-3xl overflow-hidden h-64 md:h-auto md:min-h-[280px] lg:min-h-[320px]" delay={0.1}>
              <img src={imgBenefits} alt="Benefícios" className="w-full h-full object-cover object-[70%_28%]" />
            </Reveal>
            <Reveal className="flex flex-col gap-4" delay={0.2}>
              <BenefitCard Icon={RefreshCw} title="Dar sentido à sua história"     desc="Um olhar mais profundo sobre vivências que influenciam escolhas e relações." />
              <BenefitCard Icon={Star}      title="Construir novas possibilidades"  desc="Mais consciência para lidar com desafios, relações e vivências do cotidiano." />
            </Reveal>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className={`w-full bg-[#FFF7F2] ${sectionPy} border-t border-[rgba(9,37,41,0.06)]`}>
        <div className={`mx-auto max-w-[1280px] ${sectionPad} flex flex-col gap-10`}>
          <div className={splitRow}>
            <Reveal className={processImage} x={-20}>
              <img src={imgProcess} alt="Como funciona o atendimento" className="w-full h-full object-cover" />
            </Reveal>
            <Reveal className="flex flex-col gap-8 md:gap-9 lg:gap-10 w-full lg:w-[500px] xl:w-[540px] shrink-0" delay={0.15}>
              <div className="flex flex-col gap-4">
                <Label><BookOpen size={12} />Processo</Label>
                <h2 className={sectionTitle}>Como <em>funciona</em> o atendimento</h2>
              </div>
              <ol className="flex flex-col">
                {[
                  { whatsapp: true, n:"01", label:"Agendamento",     desc:<><strong className="font-semibold text-[#092529]">Você entra em contato pelo WhatsApp</strong> para tirar dúvidas e verificar os horários disponíveis.</> },
                  { Icon: MessageCircle, n:"02", label:"Primeira sessão",  desc:<>Na primeira conversa, você terá um espaço para falar sobre aquilo que o levou a buscar terapia e <strong className="font-semibold text-[#092529]">conhecer como o processo terapêutico pode ser construído a partir da sua singularidade.</strong></> },
                  { Icon: RefreshCw,     n:"03", label:"Acompanhamento",   desc:<>As sessões acontecem de forma regular em um <strong className="font-semibold text-[#092529]">espaço de escuta, reflexão e construção no seu próprio tempo.</strong></> },
                ].map((step, i) => (
                  <li key={step.label} className={`flex gap-5 py-6 ${i > 0 ? "border-t border-[rgba(9,37,41,0.08)]" : ""} ${i === 2 ? "pb-0" : ""}`}>
                    <div className="flex flex-col items-center gap-2 shrink-0 pt-0.5">
                      <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-[#AFD7BF] shrink-0">
                        {step.whatsapp ? <WhatsAppIcon size={18} className="text-[#092529]" /> : <step.Icon size={18} color={dark} />}
                      </div>
                      <span className="font-['Noto_Sans',sans-serif] font-bold text-[11px] tracking-widest" style={{ color: muted }}>{step.n}</span>
                    </div>
                    <div className="flex flex-col gap-1.5 pt-1 min-w-0">
                      <p className="font-['Noto_Sans',sans-serif] font-bold text-[#092529] text-[17px] tracking-[-0.3px]">{step.label}</p>
                      <p className="font-['Noto_Sans',sans-serif] text-[rgba(9,37,41,0.65)] text-[14px] leading-[1.65]">{step.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="rounded-2xl border border-[rgba(9,37,41,0.04)] bg-[#F8EDE4] p-5 flex gap-4 items-center">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-[#AFD7BF]">
                  <Shield size={17} color={dark} />
                </div>
                <p className="font-['Noto_Sans',sans-serif] text-[#092529] text-[13px] leading-[1.6]">
                  <strong className="font-semibold">Sessões realizadas online, com sigilo, ética profissional</strong> e cuidado com a singularidade de cada sujeito.
                </p>
              </div>
            </Reveal>
          </div>
          <Reveal>
          <div className="bg-[#AFD7BF] rounded-2xl p-6 flex flex-col sm:flex-row gap-4 sm:items-center">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 bg-[#9DCAAF]">
              <MapPin size={21} color={dark} />
            </div>
            <div>
              <p className="font-['Noto_Sans',sans-serif] font-bold text-[#092529] text-[17px] tracking-[-0.2px] mb-1">Atendimento psicológico online em Salvador e todo o Brasil</p>
              <p className="font-['Noto_Sans',sans-serif] text-[rgba(9,37,41,0.7)] text-[14px] leading-[1.6]">Atendo pacientes em Salvador, na Bahia, em todas as regiões do Brasil e brasileiros no exterior, com escuta acolhedora, sigilo profissional e acompanhamento individualizado.</p>
            </div>
          </div>
          </Reveal>
        </div>
      </section>

      {/* Blog preview */}
      <section className={`w-full bg-[#FFF7F2] ${sectionPy} border-t border-[rgba(9,37,41,0.06)]`}>
        <div className={`mx-auto max-w-[1280px] ${sectionPad} flex flex-col gap-8 md:gap-10`}>
          <Reveal className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="flex flex-col gap-4">
              <Label><BookOpen size={12} />Conteúdos</Label>
              <h2 className={sectionTitle}>Artigos <em>recentes</em></h2>
            </div>
            <Link to="/conteudos" className="hidden md:inline-flex items-center gap-1.5 font-['Noto_Sans',sans-serif] font-semibold text-[rgba(9,37,41,0.45)] hover:text-[#092529] text-[13px] transition-colors shrink-0">
              Ver todos <ArrowRight size={13} />
            </Link>
          </Reveal>
          <div className="grid grid-cols-1 gap-5 md:hidden">
            {ARTICLES.slice(0, 3).map(a => <ArticleCard key={a.slug} article={a} />)}
          </div>
          <div className="hidden md:block lg:hidden">
            <ArticleCardsCarousel articles={ARTICLES.slice(0, 3)} />
          </div>
          <div className="hidden lg:grid lg:grid-cols-3 gap-5">
            {ARTICLES.slice(0, 3).map(a => <ArticleCard key={a.slug} article={a} />)}
          </div>
          <Link to="/conteudos" className="md:hidden flex items-center justify-center gap-2 py-4 border border-[rgba(9,37,41,0.12)] rounded-2xl font-['Noto_Sans',sans-serif] font-semibold text-[#092529] text-[14px] hover:bg-[rgba(9,37,41,0.03)]">
            Ver todos os artigos <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      <FAQSection />
      <CTABanner />
    </>
  );
}

const GRID_ROWS = 3;

function useGridColumns() {
  const [cols, setCols] = useState(3);
  useEffect(() => {
    const md = window.matchMedia("(min-width: 768px)");
    const lg = window.matchMedia("(min-width: 1024px)");
    const update = () => {
      if (lg.matches) setCols(3);
      else if (md.matches) setCols(2);
      else setCols(1);
    };
    update();
    md.addEventListener("change", update);
    lg.addEventListener("change", update);
    return () => {
      md.removeEventListener("change", update);
      lg.removeEventListener("change", update);
    };
  }, []);
  return cols;
}

function articlePageNumbers(current: number, total: number, maxSlots = 7): (number | "ellipsis")[] {
  if (total <= maxSlots) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "ellipsis", total];
  if (current >= total - 3) return [1, "ellipsis", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "ellipsis", current - 1, current, current + 1, "ellipsis", total];
}

function ArticlePagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;
  const pages = articlePageNumbers(page, totalPages);
  const mobilePages = articlePageNumbers(page, totalPages, 4);
  const btn =
    "flex items-center justify-center min-w-9 h-9 md:min-w-10 md:h-10 rounded-xl font-['Noto_Sans',sans-serif] font-semibold text-[13px] border transition-colors shrink-0";
  const arrowBtn = `${btn} w-9 md:w-10 px-0 text-[#092529] border-[rgba(9,37,41,0.13)] hover:border-[rgba(9,37,41,0.25)] disabled:opacity-40 disabled:pointer-events-none`;

  const pageBtn = (p: number) => (
    <button
      key={p}
      type="button"
      onClick={() => onPageChange(p)}
      aria-label={`Página ${p}`}
      aria-current={p === page ? "page" : undefined}
      className={`${btn} px-2.5 md:px-3 ${p === page ? "bg-[#092529] text-[#FFF7F2] border-[#092529]" : "text-[#092529] border-[rgba(9,37,41,0.13)] hover:border-[rgba(9,37,41,0.25)]"}`}
    >
      {p}
    </button>
  );

  return (
    <nav className="flex items-center justify-center gap-2 md:gap-2 pt-4 w-full max-w-full" aria-label="Paginação de artigos">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Página anterior"
        className={arrowBtn}
      >
        <ChevronLeft size={18} />
      </button>

      {totalPages <= 4 ? (
        <div className="flex items-center gap-1 md:hidden">
          {mobilePages.map((p, i) =>
            p === "ellipsis" ? (
              <span
                key={`mobile-ellipsis-${i}`}
                className="flex items-center justify-center w-8 h-9 font-['Noto_Sans',sans-serif] text-[13px] text-[rgba(9,37,41,0.45)]"
                aria-hidden
              >
                …
              </span>
            ) : (
              pageBtn(p)
            ),
          )}
        </div>
      ) : (
        <p className="md:hidden min-w-[6.5rem] text-center font-['Noto_Sans',sans-serif] font-semibold text-[13px] text-[#092529] tabular-nums">
          Página {page} de {totalPages}
        </p>
      )}

      <div className="hidden md:flex items-center gap-1.5">
        {pages.map((p, i) =>
          p === "ellipsis" ? (
            <span
              key={`ellipsis-${i}`}
              className="flex items-center justify-center w-10 h-10 font-['Noto_Sans',sans-serif] text-[13px] text-[rgba(9,37,41,0.45)]"
              aria-hidden
            >
              …
            </span>
          ) : (
            pageBtn(p)
          ),
        )}
      </div>

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Próxima página"
        className={arrowBtn}
      >
        <ChevronRight size={18} />
      </button>
    </nav>
  );
}

function BlogHubPage() {
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [slide, setSlide] = useState(0);
  const [page, setPage] = useState(1);
  const gridRef = useRef<HTMLDivElement>(null);
  const cols = useGridColumns();
  const perPage = cols * GRID_ROWS;
  const featured = ARTICLES.slice(0, 3);
  const filtered = activeCat ? ARTICLES.filter(a => a.categorySlug === activeCat) : ARTICLES;
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  useEffect(() => { setPage(1); }, [activeCat]);
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const goToPage = (next: number) => {
    setPage(next);
    requestAnimationFrame(() => {
      gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };
  return (
    <>
      <SEOHead
        title="Conteúdos sobre Saúde Mental e Psicologia"
        description="Artigos sobre terapia, ansiedade, psicanálise, autoestima e relacionamentos escritos por Breno, psicólogo clínico em Salvador."
        canonical="/conteudos"
      />
      <section className="w-full bg-[#FFF7F2] border-b border-[rgba(9,37,41,0.07)]">
        <div className={`mx-auto max-w-[1280px] ${sectionPad} py-8 md:py-10 lg:py-12`}>
          <nav className="flex items-center gap-2 flex-wrap" aria-label="Localização">
            <Link to="/" className="font-['Noto_Sans',sans-serif] text-[13px] hover:text-[#092529] transition-colors" style={{ color: muted }}>Homepage</Link>
            <Sep />
            <span className="font-['Noto_Sans',sans-serif] text-[13px] font-semibold text-[#092529]">Conteúdos</span>
          </nav>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: easeOut, delay: 0.05 }}
            className="mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-none lg:flex gap-8 md:gap-10 items-stretch"
          >
            <div className="relative isolate rounded-3xl overflow-hidden w-full min-w-0 self-stretch h-[420px] sm:h-[480px] md:h-full md:min-h-[440px] lg:flex-1 lg:min-h-[520px] border border-[rgba(9,37,41,0.08)] shadow-[0_12px_40px_rgba(9,37,41,0.08)]">
              {featured.map((art, i) => (
                <div
                  key={art.slug}
                  className={`absolute inset-0 size-full transition-opacity duration-500 ${i === slide ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"}`}
                >
                  <img
                    src={art.image}
                    alt={art.title}
                    className="absolute inset-0 size-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(9,37,41,0.82)] via-[rgba(9,37,41,0.28)] to-[rgba(9,37,41,0.04)] pointer-events-none" />
                  <Link
                    to={`/conteudos/${art.categorySlug}/${art.slug}`}
                    className="group absolute inset-0 flex h-full flex-col justify-end p-6 md:p-8"
                  >
                    <div className="flex flex-col gap-3 md:gap-4">
                      <div className="flex items-center justify-between gap-4">
                        <span className="inline-flex items-center gap-1.5 bg-[#AFD7BF] text-[#092529] px-2.5 py-1 rounded-full text-[11px] font-semibold font-['Noto_Sans',sans-serif]">
                          <CatIcon slug={art.categorySlug} size={11} />
                          {art.category}
                        </span>
                        <div className="flex gap-1.5 shrink-0">
                          {featured.map((_, j) => (
                            <button
                              key={j}
                              type="button"
                              onClick={e => { e.preventDefault(); e.stopPropagation(); setSlide(j); }}
                              aria-label={`Slide ${j + 1}`}
                              className={`h-1.5 rounded-full transition-all duration-200 ${j === slide ? "bg-[#FFF7F2] w-4" : "w-1.5 bg-[rgba(255,247,242,0.35)]"}`}
                            />
                          ))}
                        </div>
                      </div>
                      <h3 className="font-['Merriweather',serif] font-bold text-[#FFF7F2] text-[22px] md:text-[26px] lg:text-[30px] leading-[1.25] tracking-[0.04em] line-clamp-2">
                        {art.title}
                      </h3>
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <Meta date={art.date} readTime={art.readTime} invert />
                        <span className="inline-flex items-center gap-1 font-['Noto_Sans',sans-serif] font-semibold text-[12px] text-[#AFD7BF] group-hover:gap-2 transition-all">
                          Leia mais <ArrowRight size={12} />
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setSlide(s => (s - 1 + featured.length) % featured.length)}
                aria-label="Artigo anterior"
                className="absolute left-4 top-1/2 z-20 -translate-y-1/2 w-10 h-10 rounded-xl flex items-center justify-center bg-[#FFF7F2]/90 border border-[rgba(9,37,41,0.08)] hover:bg-[#FFF7F2] shadow-sm transition-all"
              >
                <ChevronLeft size={17} color={dark} />
              </button>
              <button
                type="button"
                onClick={() => setSlide(s => (s + 1) % featured.length)}
                aria-label="Próximo artigo"
                className="absolute right-4 top-1/2 z-20 -translate-y-1/2 w-10 h-10 rounded-xl flex items-center justify-center bg-[#FFF7F2]/90 border border-[rgba(9,37,41,0.08)] hover:bg-[#FFF7F2] shadow-sm transition-all"
              >
                <ChevronRight size={17} color={dark} />
              </button>
            </div>
            <div className="w-full lg:w-[360px] xl:w-[380px] shrink-0 flex flex-col gap-5 md:gap-6 self-stretch lg:pl-1">
              <div className="flex flex-col gap-3">
                <Label><BookOpen size={12} />Conteúdos</Label>
                <h2 className="font-['Merriweather',serif] font-bold text-[#092529] text-[28px] md:text-[30px] lg:text-[32px] leading-[1.15]">
                  Mais recentes
                </h2>
              </div>
              <div className="flex flex-col divide-y divide-[rgba(9,37,41,0.08)]">
                {ARTICLES.slice(0, 3).map(a => (
                  <div key={a.slug} className="py-5 first:pt-0 last:pb-0"><SmallCard article={a} /></div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      <section className={`w-full bg-[#FFF7F2] py-14 md:py-20 lg:py-24`}>
        <div className={`mx-auto max-w-[1280px] ${sectionPad} flex flex-col gap-8`}>
          <Reveal className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-5">
            <h2 className="font-['Merriweather',serif] font-bold text-[#092529] text-[28px] md:text-[30px] lg:text-[32px] leading-[1.15] shrink-0">Conteúdos</h2>
            <CategoryFilterNav activeSlug={activeCat} onSelect={setActiveCat} />
          </Reveal>
          <div ref={gridRef} className="flex flex-col gap-6 scroll-mt-28">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {paginated.map(a => <ArticleCard key={a.slug} article={a} />)}
            </div>
            <ArticlePagination page={page} totalPages={totalPages} onPageChange={goToPage} />
          </div>
        </div>
      </section>
      <CTABanner />
    </>
  );
}

function CategoryPage() {
  const { category } = useParams();
  const [page, setPage] = useState(1);
  const gridRef = useRef<HTMLDivElement>(null);
  const cols = useGridColumns();
  const perPage = cols * GRID_ROWS;
  const cat = CATEGORIES.find(c => c.slug === category);
  const articles = ARTICLES.filter(a => a.categorySlug === category);
  const totalPages = Math.max(1, Math.ceil(articles.length / perPage));
  const paginated = articles.slice((page - 1) * perPage, page * perPage);

  useEffect(() => { setPage(1); }, [category]);
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const goToPage = (next: number) => {
    setPage(next);
    requestAnimationFrame(() => {
      gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  if (!cat) return <NotFoundPage />;
  return (
    <>
      <SEOHead
        title={`${cat.name} — Artigos e Conteúdos sobre ${cat.name}`}
        description={cat.description}
        canonical={`/conteudos/${cat.slug}`}
      />
      <section className="w-full bg-[#FFF7F2] border-b border-[rgba(9,37,41,0.07)]">
        <div className={`mx-auto max-w-[1280px] ${sectionPad} py-8 md:py-10 lg:py-12`}>
          <nav className="flex items-center gap-2 flex-wrap" aria-label="Localização">
            <Link to="/" className="font-['Noto_Sans',sans-serif] text-[13px] hover:text-[#092529] transition-colors" style={{ color: muted }}>Homepage</Link>
            <Sep />
            <Link to="/conteudos" className="font-['Noto_Sans',sans-serif] text-[13px] hover:text-[#092529] transition-colors" style={{ color: muted }}>Conteúdos</Link>
            <Sep />
            <span className="font-['Noto_Sans',sans-serif] text-[13px] font-semibold text-[#092529]">{cat.name}</span>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: easeOut, delay: 0.05 }}
            className="mt-6 md:mt-8 relative rounded-[28px] overflow-hidden border border-[rgba(9,37,41,0.08)] bg-[#F8EDE4]"
          >
            <div className="pointer-events-none absolute -top-24 -right-16 w-72 h-72 rounded-full bg-[#AFD7BF] opacity-35 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-12 w-56 h-56 rounded-full bg-[#FFF7F2] opacity-70 blur-2xl" />

            <div className="relative grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(280px,380px)] gap-8 lg:gap-10 p-6 md:p-8 lg:p-10 items-center">
              <div className="flex flex-col gap-5 md:gap-6 min-w-0">
                <span className="inline-flex items-center gap-2 self-start bg-[#AFD7BF] text-[#092529] px-3 py-1.5 rounded-full text-[12px] font-semibold font-['Noto_Sans',sans-serif]">
                  <CatIcon slug={cat.slug} size={12} />
                  {cat.name}
                </span>
                <h1 className="font-['Merriweather',serif] font-bold text-[#092529] text-[36px] md:text-[44px] lg:text-[52px] leading-[1.1] tracking-[-0.02em]">
                  {cat.name}
                </h1>
                <p className="font-['Noto_Sans',sans-serif] text-[rgba(9,37,41,0.72)] text-[16px] md:text-[17px] leading-[1.7] max-w-[560px]">
                  {cat.description}
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(9,37,41,0.1)] bg-[#FFF7F2] px-4 py-2 font-['Noto_Sans',sans-serif] font-semibold text-[13px] text-[#092529]">
                    <BookOpen size={14} className="text-[rgba(9,37,41,0.55)]" />
                    {articles.length} artigos publicados
                  </span>
                  <Link
                    to="/conteudos"
                    className="inline-flex items-center gap-1.5 font-['Noto_Sans',sans-serif] font-semibold text-[13px] text-[rgba(9,37,41,0.55)] hover:text-[#092529] transition-colors"
                  >
                    Ver todos os conteúdos
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>

              {articles[0] && (
                <Link
                  to={`/conteudos/${articles[0].categorySlug}/${articles[0].slug}`}
                  className="group relative block rounded-2xl overflow-hidden h-[220px] sm:h-[260px] lg:h-[min(100%,300px)] lg:min-h-[280px] border border-[rgba(9,37,41,0.06)] shadow-[0_12px_40px_rgba(9,37,41,0.08)]"
                >
                  <img
                    src={articles[0].image}
                    alt={articles[0].title}
                    className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(9,37,41,0.72)] via-[rgba(9,37,41,0.18)] to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 md:p-6 flex flex-col gap-2">
                    <span className="font-['Noto_Sans',sans-serif] text-[11px] font-semibold uppercase tracking-[0.12em] text-[rgba(255,247,242,0.75)]">
                      Artigo em destaque
                    </span>
                    <p className="font-['Noto_Sans',sans-serif] font-bold text-[#FFF7F2] text-[16px] md:text-[18px] leading-[1.35] line-clamp-2">
                      {articles[0].title}
                    </p>
                    <span className="inline-flex items-center gap-1 font-['Noto_Sans',sans-serif] font-semibold text-[12px] text-[#AFD7BF] group-hover:gap-2 transition-all">
                      Ler artigo <ArrowRight size={12} />
                    </span>
                  </div>
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </section>
      <section className={`w-full bg-[#FFF7F2] py-14 md:py-20 lg:py-24`}>
        <div className={`mx-auto max-w-[1280px] ${sectionPad} flex flex-col gap-8`}>
          <Reveal className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-5">
            <h2 className="font-['Merriweather',serif] font-bold text-[#092529] text-[28px] md:text-[30px] lg:text-[32px] leading-[1.15] shrink-0">Conteúdos</h2>
            <CategoryFilterNav activeSlug={category ?? null} />
          </Reveal>
          <div ref={gridRef} className="flex flex-col gap-6 scroll-mt-28">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {paginated.map(a => <ArticleCard key={a.slug} article={a} />)}
            </div>
            <ArticlePagination page={page} totalPages={totalPages} onPageChange={goToPage} />
          </div>
        </div>
      </section>
      <CTABanner />
    </>
  );
}

function ArticleSignList({ signs }: { signs: { n: number; title: string; text: string }[] }) {
  return (
    <ol className="flex flex-col divide-y divide-[rgba(9,37,41,0.08)]">
      {signs.map(s => (
        <li key={s.n} className="py-6 md:py-7 first:pt-0">
          <div className="flex flex-col gap-3 md:gap-3.5">
            <div className="flex items-baseline gap-3 md:gap-4">
              <span className="font-['Merriweather',serif] font-bold text-[20px] md:text-[22px] leading-none text-[rgba(9,37,41,0.5)] tabular-nums shrink-0">
                {String(s.n).padStart(2, "0")}
              </span>
              <h3 className="font-['Merriweather',serif] font-bold text-[#092529] text-[18px] md:text-[20px] leading-[1.3]">
                {s.title}
              </h3>
            </div>
            <p className="font-['Noto_Sans',sans-serif] text-[rgba(9,37,41,0.72)] text-[15px] md:text-[16px] leading-[1.75] md:pl-10">
              {s.text}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function ArticleTopicCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-[rgba(9,37,41,0.08)] bg-[#F8EDE4]/60 p-5 md:p-6 flex flex-col gap-2.5">
      <h3 className="font-['Merriweather',serif] font-bold text-[#092529] text-[18px] md:text-[19px] leading-[1.3]">
        {title}
      </h3>
      {text && (
        <p className="font-['Noto_Sans',sans-serif] text-[rgba(9,37,41,0.72)] text-[15px] md:text-[16px] leading-[1.75]">
          {text}
        </p>
      )}
    </div>
  );
}

function ArticleTopicGrid({ topics }: { topics: { title: string; text: string }[] }) {
  return (
    <div className="flex flex-col gap-4 md:gap-5">
      {topics.map(t => <ArticleTopicCard key={t.title} {...t} />)}
    </div>
  );
}

function ArticleThoughts({ items }: { items: string[] }) {
  return (
    <div className="rounded-2xl border border-[rgba(9,37,41,0.08)] bg-white/70 px-5 py-4 md:px-6 md:py-5 flex flex-col gap-2.5">
      {items.map((item, i) => (
        <p key={i} className="font-['Merriweather',serif] italic text-[#092529] text-[16px] md:text-[17px] leading-[1.55]">
          &ldquo;{item}&rdquo;
        </p>
      ))}
    </div>
  );
}

function ArticleAnswer({ text }: { text: string }) {
  return (
    <p className="font-['Merriweather',serif] font-bold text-[#092529] text-[22px] md:text-[26px] leading-none tracking-[-0.01em]">
      {text}
    </p>
  );
}

function ArticleCallout({ parts }: { parts: { text: string; link?: { slug: string; categorySlug: string } }[] }) {
  return (
    <div className="rounded-2xl border border-[#AFD7BF]/60 bg-[#AFD7BF]/20 px-5 py-4 md:px-6 md:py-5 flex gap-3 items-start">
      <BookOpen size={18} className="shrink-0 mt-0.5 text-[#092529]/50" aria-hidden />
      <p className="font-['Noto_Sans',sans-serif] text-[rgba(9,37,41,0.78)] text-[15px] md:text-[16px] leading-[1.75]">
        {parts.map((part, j) =>
          part.link ? (
            <Link
              key={j}
              to={`/conteudos/${part.link.categorySlug}/${part.link.slug}`}
              className="font-semibold text-[#092529] underline decoration-[#AFD7BF] decoration-2 underline-offset-[3px] hover:text-[rgba(9,37,41,0.65)] transition-colors"
            >
              {part.text}
            </Link>
          ) : (
            <span key={j}>{part.text}</span>
          ),
        )}
      </p>
    </div>
  );
}

function renderInlineParts(parts: { text: string; link?: { slug: string; categorySlug: string } }[]) {
  return parts.map((part, j) =>
    part.link ? (
      <Link
        key={j}
        to={`/conteudos/${part.link.categorySlug}/${part.link.slug}`}
        className="font-semibold text-[#092529] underline decoration-[#AFD7BF] decoration-2 underline-offset-[3px] hover:text-[rgba(9,37,41,0.65)] transition-colors"
      >
        {part.text}
      </Link>
    ) : (
      <span key={j}>{part.text}</span>
    ),
  );
}

function renderArticleBlock(block: ArticleBlock, key: number) {
  switch (block.type) {
    case "p":
      if ("parts" in block && block.parts) {
        return (
          <p key={key} className="font-['Noto_Sans',sans-serif] text-[rgba(9,37,41,0.78)] text-[16px] md:text-[17px] leading-[1.85]">
            {renderInlineParts(block.parts)}
          </p>
        );
      }
      return (
        <p key={key} className="font-['Noto_Sans',sans-serif] text-[rgba(9,37,41,0.78)] text-[16px] md:text-[17px] leading-[1.85]">
          {block.text}
        </p>
      );
    case "h2":
      return (
        <h2
          key={key}
          id={slugifyHeading(block.text)}
          className="font-['Merriweather',serif] font-bold text-[#092529] text-[24px] md:text-[28px] leading-[1.25] tracking-[-0.02em] mt-2 scroll-mt-28"
        >
          {block.text}
        </h2>
      );
    case "h3":
      return (
        <h3
          key={key}
          className="font-['Merriweather',serif] font-bold text-[#092529] text-[20px] md:text-[22px] leading-[1.3] tracking-[-0.01em] mt-1"
        >
          {block.text}
        </h3>
      );
    case "ul":
      return (
        <ul key={key} className="flex flex-col gap-2 pl-1">
          {block.items.map((item, j) => (
            <li
              key={j}
              className="flex gap-3 font-['Noto_Sans',sans-serif] text-[rgba(9,37,41,0.78)] text-[16px] md:text-[17px] leading-[1.75]"
            >
              <span className="mt-[0.55em] shrink-0 size-1.5 rounded-full bg-[#AFD7BF]" aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case "quote":
      return (
        <blockquote key={key} className="rounded-2xl border border-[rgba(9,37,41,0.08)] bg-[#F8EDE4] px-6 py-6 md:px-8 md:py-7">
          <p className="font-['Merriweather',serif] font-bold italic text-[#092529] text-[20px] md:text-[22px] leading-[1.5]">
            &ldquo;{block.text}&rdquo;
          </p>
        </blockquote>
      );
    case "image":
      return (
        <figure key={key} className="overflow-hidden rounded-3xl border border-[rgba(9,37,41,0.08)] shadow-[0_12px_40px_rgba(9,37,41,0.08)]">
          <div className="aspect-[16/10] md:aspect-[21/10]">
            <img src={block.src} alt={block.alt} className="size-full object-cover" />
          </div>
          {block.caption && (
            <figcaption className="px-5 py-4 md:px-6 font-['Noto_Sans',sans-serif] text-[13px] leading-[1.6] text-[rgba(9,37,41,0.55)] bg-[#F8EDE4]">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    case "faq":
      return <FAQAccordion key={key} items={block.items} />;
    case "answer":
      return <ArticleAnswer key={key} text={block.text} />;
    case "thoughts":
      return <ArticleThoughts key={key} items={block.items} />;
    case "callout":
      return <div key={key} className="-mt-2 md:-mt-3"><ArticleCallout parts={block.parts} /></div>;
    default:
      return null;
  }
}

function renderArticleBlockGroup(blocks: ArticleBlock[], keyPrefix: string) {
  const nodes: React.ReactNode[] = [];
  let i = 0;
  while (i < blocks.length) {
    if (blocks[i].type === "sign") {
      const signs: { n: number; title: string; text: string }[] = [];
      while (i < blocks.length && blocks[i].type === "sign") {
        const s = blocks[i] as { type: "sign"; n: number; title: string; text: string };
        signs.push({ n: s.n, title: s.title, text: s.text });
        i++;
      }
      nodes.push(<ArticleSignList key={`${keyPrefix}-signs-${i}`} signs={signs} />);
    } else if (blocks[i].type === "topic") {
      const topics: { title: string; text: string }[] = [];
      while (i < blocks.length && blocks[i].type === "topic") {
        const t = blocks[i] as { type: "topic"; title: string; text: string };
        topics.push({ title: t.title, text: t.text });
        i++;
      }
      nodes.push(<ArticleTopicGrid key={`${keyPrefix}-topics-${i}`} topics={topics} />);
    } else {
      nodes.push(renderArticleBlock(blocks[i], i));
      i++;
    }
  }
  return nodes;
}

function ArticleContentSection({
  heading,
  blocks,
  isIntro,
}: {
  heading?: ArticleBlock;
  blocks: ArticleBlock[];
  isIntro?: boolean;
}) {
  const headingText = heading?.type === "h2" ? heading.text : "";
  const isConclusion = headingText === "Conclusão";
  const isFaq = headingText === "Perguntas frequentes";

  return (
    <section
      className={
        isIntro
          ? "flex flex-col gap-6 md:gap-7"
          : `flex flex-col gap-6 md:gap-7 pt-10 md:pt-12 border-t border-[rgba(9,37,41,0.08)] ${
              isConclusion ? "rounded-2xl border border-[rgba(9,37,41,0.08)] bg-[#F8EDE4]/40 px-6 py-8 md:px-8 md:py-10 !pt-8" : ""
            }`
      }
    >
      {heading && heading.type === "h2" && (
        <h2
          id={slugifyHeading(heading.text)}
          className={`font-['Merriweather',serif] font-bold text-[#092529] leading-[1.25] tracking-[-0.02em] scroll-mt-28 ${
            isFaq ? "text-[26px] md:text-[30px]" : "text-[24px] md:text-[28px] mt-0"
          }`}
        >
          {heading.text}
        </h2>
      )}
      <div className="flex flex-col gap-6 md:gap-7">
        {renderArticleBlockGroup(blocks, headingText || "intro")}
      </div>
    </section>
  );
}

function splitArticleSections(blocks: ArticleBlock[]) {
  const sections: { heading?: ArticleBlock; blocks: ArticleBlock[]; isIntro?: boolean }[] = [];
  let currentBlocks: ArticleBlock[] = [];
  let currentHeading: ArticleBlock | undefined;

  for (const block of blocks) {
    if (block.type === "h2") {
      if (currentHeading || currentBlocks.length) {
        sections.push({ heading: currentHeading, blocks: currentBlocks, isIntro: !currentHeading && sections.length === 0 });
      }
      currentHeading = block;
      currentBlocks = [];
    } else {
      currentBlocks.push(block);
    }
  }
  if (currentHeading || currentBlocks.length) {
    sections.push({
      heading: currentHeading,
      blocks: currentBlocks,
      isIntro: !currentHeading && sections.length === 0,
    });
  }
  return sections;
}

function ArticleBody({ blocks }: { blocks: ArticleBlock[] }) {
  const sections = splitArticleSections(blocks);
  return (
    <div className="flex flex-col gap-2 md:gap-4">
      {sections.map((section, idx) => (
        <ArticleContentSection
          key={idx}
          heading={section.heading}
          blocks={section.blocks}
          isIntro={section.isIntro}
        />
      ))}
    </div>
  );
}

function resolveArticleBlocks(article: Article): ArticleBlock[] {
  const idx = ARTICLES.findIndex(a => a.slug === article.slug && a.categorySlug === article.categorySlug);
  const midImage = ARTICLE_IMAGES[idx] ?? ARTICLE_IMAGES[0];
  let blocks: ArticleBlock[] = ARTICLE_BLOCKS[article.slug]
    ?? article.content.split("\n\n").filter(Boolean).map(text => ({ type: "p" as const, text }));
  blocks = blocks.map(b =>
    b.type === "image" && !b.src ? { ...b, src: midImage } : b,
  );
  if (!ARTICLE_BLOCKS[article.slug] && blocks.length >= 8 && !blocks.some(b => b.type === "image")) {
    const mid = Math.floor(blocks.length / 2);
    blocks = [
      ...blocks.slice(0, mid),
      {
        type: "image",
        src: midImage,
        alt: article.title,
        caption: "Reflexão e autoconhecimento no processo terapêutico.",
      },
      ...blocks.slice(mid),
    ];
  }
  return blocks;
}

function ArticleToc({ slug }: { slug: string }) {
  const items = ARTICLE_TOC[slug];
  if (!items || items.length === 0) return null;
  return (
    <nav aria-label="Sumário do artigo" className="sticky top-28 flex flex-col gap-3">
      <p className="font-['Noto_Sans',sans-serif] font-bold text-[11px] uppercase tracking-[0.12em] text-[rgba(9,37,41,0.45)]">
        Neste artigo
      </p>
      <ul className="flex flex-col gap-0.5">
        {items.map((item, i) => (
          <li key={i}>
            <a
              href={`#${slugifyHeading(item.h2)}`}
              className="block py-1.5 font-['Noto_Sans',sans-serif] text-[13px] text-[rgba(9,37,41,0.55)] hover:text-[#092529] transition-colors leading-snug"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function ArticleRecommendedReading({ currentSlug }: { currentSlug: string }) {
  const recommended = ARTICLE_RECOMMENDED[currentSlug] ?? [];
  const items = recommended
    .map(r => {
      const article = ARTICLES.find(a => a.slug === r.slug && a.categorySlug === r.categorySlug);
      return article ? { article, title: r.title } : null;
    })
    .filter(Boolean);

  if (items.length === 0) return null;

  return (
    <section className="mt-10 md:mt-12 pt-10 border-t border-[rgba(9,37,41,0.08)]" aria-label="Leitura recomendada">
      <h2 className="font-['Merriweather',serif] font-bold text-[#092529] text-[22px] md:text-[24px] leading-[1.2] mb-2">
        Leitura recomendada
      </h2>
      <p className="font-['Noto_Sans',sans-serif] text-[rgba(9,37,41,0.55)] text-[15px] leading-[1.65] mb-6">
        Se você deseja aprofundar o tema, estes conteúdos podem ajudar:
      </p>
      <ul className="flex flex-col divide-y divide-[rgba(9,37,41,0.08)]">
        {items.map(({ article, title }) => (
          <li key={article.slug}>
            <Link
              to={`/conteudos/${article.categorySlug}/${article.slug}`}
              className="group flex items-center justify-between gap-4 py-4 md:py-4 transition-colors"
            >
              <span className="font-['Noto_Sans',sans-serif] font-semibold text-[#092529] text-[15px] leading-[1.45] group-hover:text-[rgba(9,37,41,0.65)] transition-colors">
                {title}
              </span>
              <ArrowRight size={15} className="shrink-0 text-[rgba(9,37,41,0.3)] group-hover:text-[#092529] group-hover:translate-x-0.5 transition-all" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ArticlePage() {
  const { category, slug } = useParams();
  const article = ARTICLES.find(a => a.slug === slug && a.categorySlug === category);
  const catObj  = CATEGORIES.find(c => c.slug === category);
  const related = ARTICLES.filter(a => a.categorySlug === category && a.slug !== slug).slice(0, 3);
  const [shareStatus, setShareStatus] = useState<"idle" | "copied">("idle");

  const handleShare = async () => {
    if (!article || !category || !slug) return;
    const result = await sharePage({
      title: article.title,
      text: article.excerpt,
      path: `/conteudos/${category}/${slug}`,
    });
    if (result === "copied") {
      setShareStatus("copied");
      window.setTimeout(() => setShareStatus("idle"), 2000);
    }
  };

  if (!article) return <NotFoundPage />;
  const blocks = resolveArticleBlocks(article);
  const hasStructuredBody = Boolean(ARTICLE_BLOCKS[article.slug]);

  return (
    <>
      <SEOHead
        title={article.title}
        description={article.excerpt}
        canonical={`/conteudos/${category}/${slug}`}
        type="article"
        section={article.category}
        publishedTime={article.date}
      />

      <section className="w-full bg-[#FFF7F2] border-b border-[rgba(9,37,41,0.07)]">
        <div className={`mx-auto max-w-[1280px] ${sectionPad} py-8 md:py-10 lg:py-12`}>
          <nav className="flex items-center gap-2 flex-wrap" aria-label="Localização">
            <Link to="/" className="font-['Noto_Sans',sans-serif] text-[13px] hover:text-[#092529] transition-colors" style={{ color: muted }}>Homepage</Link>
            <Sep />
            <Link to="/conteudos" className="font-['Noto_Sans',sans-serif] text-[13px] hover:text-[#092529] transition-colors" style={{ color: muted }}>Conteúdos</Link>
            <Sep />
            <Link to={`/conteudos/${category}`} className="font-['Noto_Sans',sans-serif] text-[13px] hover:text-[#092529] transition-colors" style={{ color: muted }}>{catObj?.name}</Link>
          </nav>

          <div className="mt-6 md:mt-8 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(280px,420px)] gap-8 lg:gap-10 items-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: easeOut, delay: 0.05 }}
              className="flex flex-col gap-5 md:gap-6 min-w-0 max-w-[720px]"
            >
              <span className="inline-flex items-center gap-2 self-start bg-[#AFD7BF] text-[#092529] px-3 py-1.5 rounded-full text-[12px] font-semibold font-['Noto_Sans',sans-serif]">
                <CatIcon slug={article.categorySlug} size={12} />
                {article.category}
              </span>
              <h1 className="font-['Merriweather',serif] font-bold text-[#092529] text-[32px] md:text-[40px] lg:text-[44px] leading-[1.12] tracking-[-0.02em]">
                {article.title}
              </h1>
              <p className="font-['Noto_Sans',sans-serif] text-[rgba(9,37,41,0.72)] text-[16px] md:text-[17px] leading-[1.7]">
                {article.excerpt}
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#AFD7BF] shrink-0">
                    <img src={imgAbout} alt="Breno, psicólogo" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-['Noto_Sans',sans-serif] font-bold text-[#092529] text-[13px] leading-none">Breno</p>
                    <p className="font-['Noto_Sans',sans-serif] text-[12px] mt-0.5" style={{ color: muted }}>Psicólogo Clínico · CRP 03/36165</p>
                  </div>
                </div>
                <span className="hidden sm:block w-px h-8 bg-[rgba(9,37,41,0.1)]" />
                <Meta date={article.date} readTime={article.readTime} />
                <span className="hidden sm:block w-px h-8 bg-[rgba(9,37,41,0.1)]" />
                <div className="flex items-center gap-1.5">
                  <span className="font-['Noto_Sans',sans-serif] text-[12px] font-semibold" style={{ color: muted }}>Compartilhar</span>
                  <a
                    href={whatsappArticleShareUrl(article.title, `/conteudos/${category}/${slug}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Compartilhar no WhatsApp"
                    className="w-8 h-8 rounded-xl flex items-center justify-center bg-[rgba(9,37,41,0.05)] hover:bg-[#AFD7BF] transition-colors"
                  >
                    <WhatsAppIcon size={13} className="text-[#092529]" />
                  </a>
                  <button
                    type="button"
                    onClick={handleShare}
                    aria-label={shareStatus === "copied" ? "Link copiado" : "Compartilhar"}
                    className="w-8 h-8 rounded-xl flex items-center justify-center bg-[rgba(9,37,41,0.05)] hover:bg-[#AFD7BF] transition-colors"
                  >
                    <Share2 size={13} color={dark} />
                  </button>
                  {shareStatus === "copied" && (
                    <span className="font-['Noto_Sans',sans-serif] text-[11px] font-semibold text-[#2d6b4a]">
                      Link copiado!
                    </span>
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.65, ease: easeOut, delay: 0.15 }}
              className="relative rounded-3xl overflow-hidden aspect-[16/10] lg:aspect-auto lg:h-[min(100%,320px)] lg:min-h-[280px] border border-[rgba(9,37,41,0.06)] shadow-[0_16px_48px_rgba(9,37,41,0.1)]"
            >
              <img src={article.image} alt={article.title} className="absolute inset-0 size-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(9,37,41,0.25)] to-transparent pointer-events-none" />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="w-full bg-[#FFF7F2] py-12 md:py-16 lg:py-20">
        <div className={`mx-auto max-w-[1280px] ${sectionPad}`}>
          <div className="grid grid-cols-1 lg:grid-cols-[180px_minmax(0,1fr)] gap-10 lg:gap-14 xl:gap-16">
            <aside className="hidden lg:block">
              <ArticleToc slug={article.slug} />
            </aside>

            <article className="min-w-0 max-w-[720px] lg:max-w-none mx-auto lg:mx-0">
              {!hasStructuredBody && (
                <p className="font-['Noto_Sans',sans-serif] font-semibold text-[#092529] text-[18px] md:text-[19px] leading-[1.75] pl-5 md:pl-6 border-l-[3px] border-[#AFD7BF] mb-8 md:mb-10">
                  {article.excerpt}
                </p>
              )}

              <ArticleBody blocks={blocks} />

              <div className="mt-10 md:mt-12 rounded-2xl border border-[rgba(9,37,41,0.08)] bg-[#F8EDE4] p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="flex-1 min-w-0">
                  <p className="font-['Merriweather',serif] font-bold text-[#092529] text-[20px] md:text-[22px] leading-[1.3] mb-1.5">
                    Quer dar o primeiro passo?
                  </p>
                  <p className="font-['Noto_Sans',sans-serif] text-[rgba(9,37,41,0.72)] text-[15px] leading-[1.6]">
                    Entre em contato pelo WhatsApp para agendar sua primeira consulta online.
                  </p>
                </div>
                <a href={WA} target="_blank" rel="noopener noreferrer"
                  className={`${ctaBtn} md:shrink-0 gap-2 bg-[#092529] hover:bg-[#0e3a40] text-[#FFF7F2] px-7 py-4 rounded-xl font-['Noto_Sans',sans-serif] font-bold text-[15px] transition-colors focus-visible:outline-2 focus-visible:outline-white`}>
                  <WhatsAppIcon size={15} className="text-current" />Agendar consulta
                </a>
              </div>

              <div className="mt-10 md:mt-12 border-t border-[rgba(9,37,41,0.08)] pt-10 flex flex-col sm:flex-row gap-5 items-start">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#AFD7BF] shrink-0">
                  <img src={imgAbout} alt="Breno, psicólogo" className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col gap-2 min-w-0">
                  <p className="font-['Merriweather',serif] font-bold text-[#092529] text-[18px]">Breno — Psicólogo Clínico</p>
                  <p className="font-['Noto_Sans',sans-serif] text-[rgba(9,37,41,0.72)] text-[14px] leading-[1.7]">
                    Psicólogo clínico registrado no CRP 03/36165, com atendimento online para adultos e idosos em Salvador, todo o Brasil e brasileiros no exterior. Especialista em psicanálise, ansiedade, autoestima e relacionamentos.
                  </p>
                  <a href={WA} target="_blank" rel="noopener noreferrer"
                    className={`${ctaBtn} gap-2 bg-[#AFD7BF] hover:bg-[#9DCAAF] px-5 py-2.5 rounded-xl font-['Noto_Sans',sans-serif] font-bold text-[#092529] text-[13px] transition-colors mt-1`}>
                    <WhatsAppIcon size={13} className="text-current" />Agendar consulta
                  </a>
                </div>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-2">
                <span className="font-['Noto_Sans',sans-serif] font-semibold text-[11px] uppercase tracking-[0.1em] mr-1" style={{ color: muted }}>Temas</span>
                {CATEGORIES.map(c => (
                  <Link key={c.slug} to={`/conteudos/${c.slug}`}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold font-['Noto_Sans',sans-serif] transition-colors
                      ${c.slug === category
                        ? "bg-[#AFD7BF] text-[#092529]"
                        : "bg-[rgba(9,37,41,0.06)] text-[rgba(9,37,41,0.6)] hover:bg-[#EBDFD6] hover:text-[#092529]"
                      }`}>
                    <CatIcon slug={c.slug} size={11} />{c.name}
                  </Link>
                ))}
              </div>

              <ArticleRecommendedReading currentSlug={article.slug} />
            </article>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className={`w-full bg-[#FFF7F2] py-14 md:py-20 lg:py-24 border-t border-[rgba(9,37,41,0.06)]`}>
          <div className={`mx-auto max-w-[1280px] ${sectionPad} flex flex-col gap-8 md:gap-10`}>
            <Reveal className="flex items-end justify-between gap-4">
              <h2 className="font-['Merriweather',serif] font-bold text-[#092529] text-[28px] md:text-[32px] lg:text-[36px] leading-[1.2]">
                Mais artigos de <em>{catObj?.name}</em>
              </h2>
              <Link to={`/conteudos/${category}`}
                className="hidden sm:inline-flex items-center gap-1.5 font-['Noto_Sans',sans-serif] font-semibold text-[rgba(9,37,41,0.45)] hover:text-[#092529] text-[13px] transition-colors shrink-0">
                Ver todos <ArrowRight size={13} />
              </Link>
            </Reveal>
            <div className="grid grid-cols-1 gap-5 md:hidden">
              {related.map(a => <ArticleCard key={a.slug} article={a} />)}
            </div>
            <div className="hidden md:block lg:hidden">
              <ArticleCardsCarousel articles={related} />
            </div>
            <div className="hidden lg:grid lg:grid-cols-3 gap-5">
              {related.map(a => <ArticleCard key={a.slug} article={a} />)}
            </div>
            <Link
              to={`/conteudos/${category}`}
              className="md:hidden flex items-center justify-center gap-2 py-4 border border-[rgba(9,37,41,0.12)] rounded-2xl font-['Noto_Sans',sans-serif] font-semibold text-[#092529] text-[14px] hover:bg-[rgba(9,37,41,0.03)]"
            >
              Ver todos de {catObj?.name} <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      )}

      <CTABanner />
    </>
  );
}

function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: easeOut }}
      className="flex flex-col items-center justify-center min-h-[60vh] gap-8 px-6 text-center bg-[#FFF7F2]"
    >
      <p className="font-['Merriweather',serif] font-bold text-[rgba(9,37,41,0.08)] text-[120px] leading-none select-none">404</p>
      <div className="flex flex-col gap-3 -mt-12">
        <h1 className="font-['Merriweather',serif] font-bold text-[#092529] text-[30px]">Página não encontrada</h1>
        <p className="font-['Noto_Sans',sans-serif] text-[rgba(9,37,41,0.5)] text-[16px]">O conteúdo que você procura não existe ou foi movido.</p>
      </div>
      <button onClick={() => navigate("/")}
        className={`${ctaBtn} gap-2 bg-[#AFD7BF] hover:bg-[#9DCAAF] px-7 py-4 rounded-2xl font-['Noto_Sans',sans-serif] font-bold text-[#092529] text-[15px] transition-colors`}>
        <ChevronLeft size={15} />Voltar para o início
      </button>
    </motion.div>
  );
}

let __lenis: Lenis | null = null;

function ScrollReset() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (__lenis) {
      __lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [pathname]);
  return null;
}

function SEOHead({
  title,
  description,
  canonical,
  type = "website",
  section,
  publishedTime,
}: {
  title: string;
  description: string;
  canonical: string;
  type?: "website" | "article";
  section?: string;
  publishedTime?: string;
}) {
  useEffect(() => {
    const siteName = "Breno Psicólogo | Atendimento Online";
    document.title = title ? `${title} | ${siteName}` : siteName;
    const setMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!el) { el = document.createElement("meta"); el.name = name; document.head.appendChild(el); }
      el.content = content;
    };
    const setProp = (prop: string, content: string) => {
      let el = document.querySelector(`meta[property="${prop}"]`) as HTMLMetaElement;
      if (!el) { el = document.createElement("meta"); el.setAttribute("property", prop); document.head.appendChild(el); }
      el.content = content;
    };
    setMeta("description", description);
    setMeta("robots", "index, follow");
    setProp("og:title", document.title);
    setProp("og:description", description);
    setProp("og:type", type);
    setProp("og:site_name", "Breno Psicólogo");
    const base = SITE_BASE;
    setProp("og:url", `${base}${canonical}`);
    setProp("og:locale", "pt_BR");
    if (type === "article") {
      setProp("article:section", section ?? "");
      if (publishedTime) setProp("article:published_time", publishedTime);
    }
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!link) { link = document.createElement("link"); link.rel = "canonical"; document.head.appendChild(link); }
    link.href = `${base}${canonical}`;

    const scriptId = "article-jsonld";
    const existing = document.getElementById(scriptId);
    if (type === "article") {
      const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: title,
        description,
        url: `${base}${canonical}`,
        inLanguage: "pt-BR",
        author: { "@type": "Person", name: "Breno", jobTitle: "Psicólogo Clínico" },
        publisher: { "@type": "Organization", name: "Breno Psicólogo" },
        articleSection: section,
        datePublished: publishedTime,
      };
      const script = existing ?? document.createElement("script");
      script.id = scriptId;
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(jsonLd);
      if (!existing) document.head.appendChild(script);
    } else if (existing) {
      existing.remove();
    }
  }, [title, description, canonical, type, section, publishedTime]);
  return null;
}

function StickyCtaBar() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const hero = document.getElementById("hero-cta");
    if (!hero) { setVisible(true); return; }
    const obs = new IntersectionObserver(
      ([e]) => setVisible(!e.isIntersecting),
      { threshold: 0, rootMargin: "0px" }
    );
    obs.observe(hero);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      className={`md:hidden fixed bottom-0 left-0 right-0 z-40 transition-transform duration-300 ease-out ${visible ? "translate-y-0" : "translate-y-full"}`}
    >
      <div className="bg-[#FFF7F2]/95 backdrop-blur-md border-t border-[rgba(9,37,41,0.08)] shadow-[0_-4px_24px_rgba(9,37,41,0.08)] px-5 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        <a
          href={WA}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2.5 bg-[#AFD7BF] hover:bg-[#9DCAAF] active:scale-[0.98] transition-all px-6 py-[14px] rounded-2xl font-['Noto_Sans',sans-serif] font-bold text-[#092529] text-[16px] shadow-[0_4px_20px_rgba(175,215,191,0.5)] w-full"
        >
          <WhatsAppIcon size={17} className="text-current" />
          Agendar consulta
        </a>
      </div>
    </div>
  );
}

function Layout() {
  useEffect(() => {
    document.documentElement.lang = "pt-BR";

    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
      infinite: false,
    });
    __lenis = lenis;

    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      __lenis = null;
    };
  }, []);
  return (
    <div className="min-h-screen flex flex-col bg-[#FFF7F2]">
      {/* Skip navigation link for keyboard/screen reader accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-[#092529] focus:text-[#FFF7F2] focus:px-4 focus:py-2 focus:rounded-xl focus:font-['Noto_Sans',sans-serif] focus:font-semibold focus:text-sm"
      >
        Ir para o conteúdo principal
      </a>
      <ScrollReset />
      <Header />
      <main id="main-content" className="flex-1" role="main">
        <Routes>
          <Route path="/"                          element={<HomePage />} />
          <Route path="/conteudos"                 element={<BlogHubPage />} />
          <Route path="/conteudos/:category"       element={<CategoryPage />} />
          <Route path="/conteudos/:category/:slug" element={<ArticlePage />} />
          <Route path="*"                          element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      <StickyCtaBar />
    </div>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </MotionConfig>
  );
}
