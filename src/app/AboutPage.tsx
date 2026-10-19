import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Brain,
  Heart,
  MapPin,
  MessageCircle,
  Shield,
  User,
  Users,
} from "lucide-react";
import {
  AboutImage,
  CTABanner,
  HeroHighlights,
  Label,
  MotionBox,
  Reveal,
  SEOHead,
  WA,
  WhatsAppIcon,
  aboutImage,
  ctaBtn,
  dark,
  easeOut,
  heroTitle,
  sectionPad,
  sectionPy,
  sectionTitle,
  specialtyGrid,
  splitRow,
} from "./App";
import { GOOGLE_BUSINESS_URL } from "./siteConfig";

const PRACTICE_CARDS = [
  {
    Icon: MessageCircle,
    title: "Escuta e acolhimento",
    desc: "Um espaço para falar livremente sobre sentimentos, relações e o que se repete — sem um roteiro rígido.",
  },
  {
    Icon: Heart,
    title: "Sem respostas prontas",
    desc: "Não ofereço conselhos, diagnósticos pela internet nem promessas de resultado. O trabalho é acompanhar o que se passa com você.",
  },
  {
    Icon: Brain,
    title: "Sessão a sessão",
    desc: "A proposta é construir, no seu tempo, uma compreensão mais ampla da própria história — ansiedade, autoestima, vínculos ou o desejo de se conhecer melhor.",
  },
];

const AUDIENCE = [
  {
    Icon: User,
    title: "Adultos e idosos",
    desc: "Atendimento individual para a vida adulta e para a terceira idade.",
  },
  {
    Icon: MapPin,
    title: "Todo o Brasil",
    desc: "Sessões online, com sigilo, a partir de qualquer estado.",
  },
  {
    Icon: Users,
    title: "Brasileiros no exterior",
    desc: "Acompanhamento em português para quem vive fora do país.",
  },
  {
    Icon: Brain,
    title: "Orientação psicanalítica",
    desc: "Trabalho pela fala e pela escuta, não por um protocolo fixo de técnicas.",
  },
];

export function AboutPage() {
  return (
    <>
      <SEOHead pathname="/sobre" />

      <section className="w-full bg-[#FFF7F2] pt-5 pb-6 md:pt-14 md:pb-20 lg:pt-16 lg:pb-28">
        <div className={`mx-auto max-w-[1280px] ${sectionPad}`}>
          <div className={`${splitRow} flex-col-reverse max-md:gap-4`}>
            <MotionBox
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: easeOut, delay: 0.1 }}
              className="flex flex-col gap-6 md:gap-7 lg:gap-8 flex-1 min-w-0"
            >
              <div className="flex flex-col gap-5">
                <Label><User size={12} />Psicólogo clínico</Label>
                <h1 className={heroTitle}>
                  Olá, sou <em>Breno Vieira</em>, psicólogo clínico
                </h1>
                <p className="font-['Noto_Sans',sans-serif] font-semibold text-[rgba(9,37,41,0.35)] text-[12px] uppercase tracking-[0.1em]">
                  CRP 03/36165
                </p>
                <p className="font-['Noto_Sans',sans-serif] text-[#092529] text-[16px] md:text-[17px] leading-[1.7]">
                  Psicólogo formado pela Escola Bahiana de Medicina e Saúde Pública, em Salvador.
                </p>
                <p className="font-['Noto_Sans',sans-serif] text-[#092529] text-[16px] md:text-[17px] leading-[1.7]">
                  Atendimento psicológico online para{" "}
                  <strong className="font-bold">adultos e idosos em todo o Brasil e brasileiros no exterior</strong>
                  , com orientação psicanalítica e base profissional em Salvador, Bahia.
                </p>
              </div>
              <a
                id="hero-cta"
                href={WA}
                target="_blank"
                rel="noopener noreferrer"
                className={`${ctaBtn} gap-2.5 bg-[#AFD7BF] hover:bg-[#9DCAAF] active:scale-[0.98] transition-all px-7 py-4 rounded-2xl font-['Noto_Sans',sans-serif] font-bold text-[#092529] text-[16px] shadow-[0_4px_20px_rgba(175,215,191,0.55)]`}
              >
                <WhatsAppIcon size={16} className="text-current" />Agendar consulta
              </a>
              <HeroHighlights />
            </MotionBox>
            <MotionBox
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: easeOut }}
              className={aboutImage}
            >
              <AboutImage priority />
            </MotionBox>
          </div>
        </div>
      </section>

      <section className={`w-full bg-[#AFD7BF] ${sectionPy}`}>
        <div className={`mx-auto max-w-[1280px] ${sectionPad} flex flex-col gap-10 md:gap-12 lg:gap-14`}>
          <Reveal className="flex flex-col items-center gap-4 text-center max-w-[600px] mx-auto">
            <Label variant="mint" align="center"><Heart size={12} />Prática</Label>
            <h2 className={sectionTitle}>Como eu <em>trabalho</em></h2>
            <p className="font-['Noto_Sans',sans-serif] text-[rgba(9,37,41,0.7)] text-[16px] leading-[1.65]">
              A clínica não é um lugar de fórmulas. É um espaço de escuta para compreender o que atravessa a sua história — sessão a sessão.
            </p>
          </Reveal>
          <div className={specialtyGrid}>
            {PRACTICE_CARDS.map(({ Icon, title, desc }, i) => (
              <Reveal
                key={title}
                delay={i * 0.1}
                className="bg-[#BFE2CD] rounded-2xl p-6 md:p-5 lg:p-8 flex flex-col gap-4 md:gap-3 lg:gap-5 min-w-0"
              >
                <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl flex items-center justify-center bg-[#AFD7BF] shrink-0">
                  <Icon size={24} color={dark} />
                </div>
                <p className="font-['Noto_Sans',sans-serif] font-bold text-[#092529] text-[20px] md:text-[17px] lg:text-[22px] leading-[1.25] tracking-[-0.4px]">{title}</p>
                <p className="font-['Noto_Sans',sans-serif] text-[rgba(9,37,41,0.75)] text-[14px] md:text-[13px] lg:text-[15px] leading-[1.6] lg:leading-[1.65]">{desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className={`w-full bg-[#FFF7F2] ${sectionPy}`}>
        <div className={`mx-auto max-w-[1280px] ${sectionPad} flex flex-col gap-10 md:gap-12 lg:gap-14`}>
          <Reveal className="flex flex-col items-center gap-4 text-center max-w-[580px] mx-auto">
            <Label align="center"><Users size={12} />Atendimento</Label>
            <h2 className={sectionTitle}>Para quem é o <em>acompanhamento</em></h2>
            <p className="font-['Noto_Sans',sans-serif] text-[rgba(9,37,41,0.55)] text-[16px] leading-[1.65]">
              Trabalho com adultos e idosos. O primeiro contato é pelo WhatsApp, para tirar dúvidas e verificar horários.
            </p>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {AUDIENCE.map(({ Icon, title, desc }, i) => (
              <Reveal
                key={title}
                delay={i * 0.08}
                className="rounded-2xl border border-[rgba(9,37,41,0.08)] bg-[rgba(255,255,255,0.55)] p-6 flex flex-col gap-3.5"
              >
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-[rgba(175,215,191,0.45)] shrink-0">
                  <Icon size={18} color={dark} />
                </div>
                <p className="font-['Noto_Sans',sans-serif] font-bold text-[#092529] text-[17px] leading-[1.3] tracking-[-0.3px]">{title}</p>
                <p className="font-['Noto_Sans',sans-serif] text-[rgba(9,37,41,0.65)] text-[14px] leading-[1.65]">{desc}</p>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div className="rounded-2xl border border-[rgba(9,37,41,0.04)] bg-[#F8EDE4] p-5 md:p-6 flex gap-4 items-start md:items-center">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 bg-[#AFD7BF]">
                <Shield size={18} color={dark} />
              </div>
              <p className="font-['Noto_Sans',sans-serif] text-[#092529] text-[14px] md:text-[15px] leading-[1.65]">
                <strong className="font-semibold">Sessões realizadas online, com sigilo e ética profissional</strong>, e cuidado com a singularidade de cada sujeito.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className={`w-full bg-[#FFF7F2] ${sectionPy} border-t border-[rgba(9,37,41,0.06)]`}>
        <div className={`mx-auto max-w-[1280px] ${sectionPad}`}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 md:gap-10">
            <Reveal className="flex flex-col gap-5 max-w-[640px]">
              <Label><BookOpen size={12} />Abordagem</Label>
              <h2 className={sectionTitle}>
                Prática orientada pela <em>psicanálise</em>
              </h2>
              <p className="font-['Noto_Sans',sans-serif] text-[rgba(9,37,41,0.72)] text-[16px] leading-[1.7]">
                Sou psicólogo clínico, registrado no CRP 03/36165. A palavra “psicanalista” descreve a abordagem de trabalho — a escuta do que se repete na vida emocional — e não substitui o registro profissional.
              </p>
              <p className="font-['Noto_Sans',sans-serif] text-[rgba(9,37,41,0.72)] text-[16px] leading-[1.7]">
                Se você quer entender a abordagem antes de agendar, comece pelos textos abaixo. Você também pode ver o{" "}
                <a
                  href={GOOGLE_BUSINESS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#092529] underline decoration-[#AFD7BF] decoration-2 underline-offset-[3px] hover:text-[rgba(9,37,41,0.65)]"
                >
                  perfil no Google
                </a>
                .
              </p>
            </Reveal>
            <Reveal delay={0.12} className="flex flex-col gap-3 w-full lg:w-[420px] shrink-0">
              <Link
                to="/conteudos/psicanalise/o-que-e-psicanalise"
                className="flex items-center gap-3 w-full border border-[rgba(9,37,41,0.13)] bg-[#FFF7F2] hover:bg-[#F0E6DD] px-5 py-3.5 rounded-2xl font-['Noto_Sans',sans-serif] text-[#092529] text-[14px] transition-colors"
              >
                <Brain size={15} />
                <span className="font-bold flex-1">O que é psicanálise?</span>
                <ArrowRight size={13} />
              </Link>
              <Link
                to="/conteudos/psicanalise/quando-procurar-psicanalista"
                className="flex items-center gap-3 w-full border border-[rgba(9,37,41,0.13)] bg-[#FFF7F2] hover:bg-[#F0E6DD] px-5 py-3.5 rounded-2xl font-['Noto_Sans',sans-serif] text-[#092529] text-[14px] transition-colors"
              >
                <BookOpen size={15} />
                <span className="font-bold flex-1">Quando procurar um psicanalista</span>
                <ArrowRight size={13} />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
