import { Link } from "react-router-dom";
import { Shield } from "lucide-react";
import { SEOHead, sectionPad, sectionPy, Label, Sep, WA, WhatsAppIcon } from "./App";

const sections = [
  {
    title: "1. Quem somos",
    paragraphs: [
      "Esta Política de Privacidade descreve como Breno Vieira, psicólogo clínico inscrito no Conselho Regional de Psicologia da Bahia (CRP 03/36165), trata informações pessoais no site brenovieirapsi.com e nos canais de contato associados ao atendimento psicológico online.",
      "O site tem caráter informativo e institucional. O agendamento de consultas e o acompanhamento terapêutico ocorrem por canais privados, como WhatsApp e videochamada, regidos pelas normas éticas da profissão e pela legislação aplicável.",
    ],
  },
  {
    title: "2. Dados que podemos coletar",
    paragraphs: [
      "Ao navegar no site, podemos registrar automaticamente dados técnicos, como endereço IP, tipo de navegador, páginas visitadas, tempo de permanência e origem de acesso. Essas informações são tratadas de forma agregada ou pseudonimizada por ferramentas de análise, com o objetivo de compreender o uso do site e melhorar sua experiência.",
      "Quando você entra em contato pelo WhatsApp ou por outros meios indicados no site, tratamos os dados que você voluntariamente compartilha, como nome, telefone, e-mail e o conteúdo da mensagem, exclusivamente para responder sua solicitação, agendar consultas e conduzir o processo terapêutico, quando houver relação clínica estabelecida.",
    ],
  },
  {
    title: "3. Finalidade do tratamento",
    paragraphs: [
      "Utilizamos os dados para: responder dúvidas e solicitações de contato; viabilizar o agendamento de sessões; prestar atendimento psicológico online; cumprir obrigações legais e regulatórias do exercício profissional; melhorar conteúdos e desempenho do site; e garantir segurança contra usos indevidos.",
      "Não vendemos, alugamos nem comercializamos dados pessoais. O site não possui formulários de cadastro nem área de login.",
    ],
  },
  {
    title: "4. Sigilo profissional e confidencialidade",
    paragraphs: [
      "O atendimento psicológico é regido pelo sigilo profissional, conforme o Código de Ética Profissional do Psicólogo e a Resolução CFP nº 10/2005. Informações compartilhadas em sessões terapêuticas são confidenciais e não são divulgadas a terceiros, salvo nas hipóteses legalmente previstas (risco iminente à vida, ordem judicial ou consentimento expresso do paciente, quando aplicável).",
      "O conteúdo desta política não substitui o acordo terapêutico nem as orientações específicas fornecidas no início do acompanhamento clínico.",
    ],
  },
  {
    title: "5. Cookies e tecnologias similares",
    paragraphs: [
      "O site pode utilizar cookies e tecnologias semelhantes para funcionamento básico, preferências de navegação e mensuração de audiência. Atualmente, utilizamos o Google Analytics (Google LLC) de forma diferida, iniciado após interação do usuário ou após curto intervalo de carregamento, para compreender visitas e páginas mais acessadas.",
      "Você pode gerenciar ou bloquear cookies nas configurações do seu navegador. A desativação de cookies analíticos não impede o uso do site, mas pode limitar a coleta de estatísticas de acesso.",
    ],
  },
  {
    title: "6. Compartilhamento com terceiros",
    paragraphs: [
      "Podemos compartilhar dados limitados com prestadores de serviço que auxiliam na operação do site e na comunicação, como plataformas de hospedagem (Vercel), ferramentas de análise (Google) e o WhatsApp/Meta para troca de mensagens iniciadas por você.",
      "Esses fornecedores tratam dados conforme suas próprias políticas e apenas na medida necessária para prestar o serviço contratado. Links externos presentes no site possuem políticas próprias, sobre as quais não temos controle.",
    ],
  },
  {
    title: "7. Retenção e segurança",
    paragraphs: [
      "Mantemos dados de contato e registros clínicos pelo tempo necessário à prestação do serviço, ao cumprimento de obrigações legais e às exigências do Conselho Federal de Psicologia quanto à guarda de documentos profissionais, quando aplicável.",
      "Adotamos medidas técnicas e organizacionais razoáveis para proteger informações contra acesso não autorizado, perda ou uso indevido. Nenhum sistema é totalmente imune a incidentes; por isso, recomendamos que você também utilize dispositivos seguros e conexões confiáveis ao acessar serviços online.",
    ],
  },
  {
    title: "8. Seus direitos (LGPD)",
    paragraphs: [
      "Nos termos da Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você pode solicitar confirmação de tratamento, acesso, correção, anonimização, portabilidade, eliminação de dados tratados com consentimento, informação sobre compartilhamentos e revogação de consentimento, quando cabível.",
      "Para exercer seus direitos, entre em contato pelo WhatsApp indicado no site. Poderemos solicitar informações adicionais para confirmar sua identidade antes de atender ao pedido. O sigilo clínico e outras limitações legais podem restringir determinados pedidos relacionados a registros terapêuticos.",
    ],
  },
  {
    title: "9. Menores de idade",
    paragraphs: [
      "O atendimento psicológico oferecido por Breno Vieira destina-se a adultos e idosos. O site não é direcionado a menores de 18 anos. Caso identifiquemos coleta inadvertida de dados de menores, tomaremos medidas para eliminá-los.",
    ],
  },
  {
    title: "10. Alterações desta política",
    paragraphs: [
      "Esta política pode ser atualizada periodicamente para refletir mudanças legais, técnicas ou operacionais. A data da última revisão será indicada abaixo. Recomendamos a leitura periódica desta página.",
    ],
  },
];

export function PrivacyPolicyPage() {
  return (
    <>
      <SEOHead pathname="/politica-de-privacidade" />
      <section className={`w-full bg-[#FFF7F2] ${sectionPy}`}>
        <div className={`mx-auto max-w-[800px] ${sectionPad}`}>
          <nav className="flex items-center gap-2 flex-wrap mb-8" aria-label="Localização">
            <Link to="/" className="font-['Noto_Sans',sans-serif] text-[13px] hover:text-[#092529] transition-colors text-[rgba(9,37,41,0.55)]">
              Início
            </Link>
            <Sep />
            <span className="font-['Noto_Sans',sans-serif] text-[13px] font-semibold text-[#092529]">
              Política de privacidade
            </span>
          </nav>

          <div className="flex flex-col gap-6 mb-10">
            <Label><Shield size={12} />Privacidade e proteção de dados</Label>
            <h1 className="font-['Merriweather',serif] font-bold text-[#092529] text-[32px] md:text-[40px] leading-[1.15] tracking-[-0.02em]">
              Política de Privacidade
            </h1>
            <p className="font-['Noto_Sans',sans-serif] text-[rgba(9,37,41,0.72)] text-[16px] leading-[1.75]">
              Transparência sobre como tratamos informações no site e nos canais de contato de Breno Vieira, psicólogo clínico com atendimento online em todo o Brasil.
            </p>
            <p className="font-['Noto_Sans',sans-serif] text-[rgba(9,37,41,0.45)] text-[13px]">
              Última atualização: 30 de julho de 2026 · CRP 03/36165
            </p>
          </div>

          <div className="flex flex-col gap-10">
            {sections.map((section) => (
              <div key={section.title} className="flex flex-col gap-4">
                <h2 className="font-['Merriweather',serif] font-bold text-[#092529] text-[22px] md:text-[24px] leading-[1.3]">
                  {section.title}
                </h2>
                {section.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 40)}
                    className="font-['Noto_Sans',sans-serif] text-[rgba(9,37,41,0.72)] text-[15px] md:text-[16px] leading-[1.75]"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-[rgba(9,37,41,0.08)] flex flex-col gap-4">
            <h2 className="font-['Merriweather',serif] font-bold text-[#092529] text-[20px] leading-[1.3]">
              Dúvidas sobre privacidade?
            </h2>
            <p className="font-['Noto_Sans',sans-serif] text-[rgba(9,37,41,0.72)] text-[15px] leading-[1.75]">
              Entre em contato pelo WhatsApp para esclarecimentos sobre esta política ou sobre o tratamento de seus dados.
            </p>
            <a
              href={WA}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 self-start px-5 py-3 rounded-xl bg-[#AFD7BF] hover:bg-[#9DCAAF] font-['Noto_Sans',sans-serif] font-bold text-[#092529] text-[14px] transition-colors"
            >
              <WhatsAppIcon size={14} className="text-current" />
              Falar com Breno
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
