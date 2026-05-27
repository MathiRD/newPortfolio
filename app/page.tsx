import { cookies, headers } from "next/headers";
import { ArrowRight, BriefcaseBusiness, Database, Gauge, Layers3, Mail, Rocket } from "lucide-react";
import { prisma } from "@/lib/prisma";
import {
  dictionary,
  normalizeColorPalette,
  normalizeLocale,
  normalizeThemeMode
} from "@/lib/preferences";
import { SiteHeader } from "@/components/site-header";
import { ProjectCard } from "@/components/project-card";
import { ContactForm } from "@/components/contact-form";
import { ScrollBackground } from "@/components/scroll-background";
import { ScrollReveal } from "@/components/scroll-reveal";

type PublishedProject = {
  id: string;
  titleEn: string;
  titlePt: string;
  descriptionEn: string;
  descriptionPt: string;
  imageUrl: string | null;
  githubUrl: string | null;
  liveUrl: string | null;
  techStack: string[];
  featured: boolean;
};

export default async function HomePage() {
  const cookieStore = cookies();
  const locale = normalizeLocale(cookieStore.get("portfolio_locale")?.value ?? headers().get("accept-language"));
  const themeMode = normalizeThemeMode(cookieStore.get("portfolio_theme_mode")?.value);
  const colorPalette = normalizeColorPalette(cookieStore.get("portfolio_color_palette")?.value);
  const copy = dictionary[locale];

  const projects = (await prisma.project.findMany({
    where: { published: true },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }]
  })) as PublishedProject[];

  const journey = locale === "pt" ? journeyPt : journeyEn;

  return (
    <>
      <ScrollBackground />
      <SiteHeader locale={locale} themeMode={themeMode} colorPalette={colorPalette} />

      <main className="site-shell relative z-10 pb-12 pt-28 sm:pt-32">
        <section className="grid min-h-[calc(100vh-8rem)] items-center gap-10 py-8 lg:grid-cols-[1.05fr_0.95fr] xl:gap-16">
          <ScrollReveal>
            <p className="mb-5 inline-flex rounded-full border border-theme bg-white/10 px-4 py-2 text-sm font-bold text-muted">
              {copy.role}
            </p>

            <h1 className="max-w-5xl text-[clamp(2.75rem,7vw,6.8rem)] font-black leading-[0.96] tracking-tight">
              {copy.heroTitle}
            </h1>

            <p className="mt-6 max-w-3xl text-[clamp(1rem,1.4vw,1.25rem)] leading-8 text-muted">
              {copy.heroDescription}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#contact" className="button-primary focus-ring inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition hover:-translate-y-0.5">
                {copy.contactMe} <ArrowRight size={16} />
              </a>
              <a href="#projects" className="button-soft focus-ring inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition hover:-translate-y-0.5">
                {copy.viewProjects}
              </a>
            </div>
          </ScrollReveal>

          <ScrollReveal className="lg:justify-self-end" delay={70}>
            <div className="liquid-glass relative overflow-hidden rounded-[2.5rem] p-5">
              <div className="absolute right-8 top-8 h-28 w-28 rounded-full bg-[var(--primary)] opacity-20 blur-3xl" />
              <div className="relative min-h-[420px] rounded-[2rem] border border-theme bg-surface xl:min-h-[500px]">
                <div className="flex min-h-[420px] flex-col justify-between p-8 xl:min-h-[500px] xl:p-10">
                  <div>
                    <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-3xl button-primary text-3xl font-black shadow-glow xl:h-28 xl:w-28 xl:text-4xl">
                      MD
                    </div>
                    <h2 className="text-2xl font-black xl:text-3xl">Matheus Durigon</h2>
                    <p className="mt-2 text-muted">Backend Engineer · UTC-3</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-bold text-muted">{copy.stackLabel}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {["PHP", "Laravel", "PostgreSQL", "Redis", "Docker", "TypeScript"].map((skill) => (
                        <span key={skill} className="rounded-2xl border border-theme bg-white/10 px-3 py-2 text-sm font-semibold xl:px-4 xl:py-3">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>

        <section id="about" className="section-spacing scroll-mt-28">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] xl:gap-12">
            <ScrollReveal>
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.28em] text-muted">{copy.aboutTitle}</p>
              <h2 className="text-[clamp(2.2rem,4vw,4.25rem)] font-black leading-tight tracking-tight">
                {copy.aboutHeadline}
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={60}>
              <div className="liquid-glass rounded-[2rem] p-7 xl:p-9">
                <p className="text-lg leading-8 text-muted xl:text-xl xl:leading-9">{copy.aboutDescription}</p>

                <div className="mt-8 grid gap-4 md:grid-cols-3">
                  {[
                    { icon: Layers3, label: copy.aboutHighlightOne },
                    { icon: Database, label: copy.aboutHighlightTwo },
                    { icon: Gauge, label: copy.aboutHighlightThree }
                  ].map((item) => (
                    <div key={item.label} className="rounded-3xl border border-theme bg-white/10 p-5 xl:p-6">
                      <item.icon className="mb-4 text-[var(--primary)]" size={24} />
                      <p className="text-sm font-bold xl:text-base">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <section id="journey" className="section-spacing scroll-mt-28">
          <ScrollReveal className="mb-12 max-w-3xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.28em] text-muted">
              {locale === "pt" ? "Trajetória" : "Professional journey"}
            </p>
            <h2 className="text-[clamp(2.2rem,4vw,4.25rem)] font-black leading-tight tracking-tight">
              {locale === "pt" ? "Marcos que conectam código, produto e impacto real." : "Milestones connecting code, product and real impact."}
            </h2>
          </ScrollReveal>

          <div className="relative mx-auto max-w-6xl">
            <div className="journey-line absolute left-4 top-0 h-full w-px md:left-1/2" />
            <div className="space-y-8 md:space-y-12">
              {journey.map((item, index) => {
                const Icon = item.icon;
                const isRight = index % 2 === 1;

                return (
                  <ScrollReveal key={`${item.company}-${item.period}`} className="journey-reveal" delay={index * 18}>
                    <article className="relative grid gap-5 pl-12 md:grid-cols-2 md:pl-0">
                      <div className={isRight ? "md:col-start-2" : "md:col-start-1"}>
                        <div className="liquid-glass rounded-[2rem] p-6 transition duration-300 hover:-translate-y-1 xl:p-8">
                          <div className="mb-5 flex items-start gap-4">
                            <span className="button-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl">
                              <Icon size={21} />
                            </span>
                            <div>
                              <p className="text-sm font-black text-[var(--primary)]">{item.company}</p>
                              <h3 className="text-xl font-black leading-tight xl:text-2xl">{item.title}</h3>
                              <p className="mt-1 text-sm font-semibold text-muted">{item.type}</p>
                            </div>
                          </div>

                          <div className="mb-5 space-y-1 text-sm font-semibold text-muted">
                            <p>{item.period}</p>
                            <p>{item.location}</p>
                          </div>

                          <ul className="space-y-3 text-sm leading-6 text-muted xl:text-base xl:leading-7">
                            {item.highlights.map((highlight) => (
                              <li key={highlight} className="flex gap-3">
                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--primary)] shadow-glow" />
                                <span>{highlight}</span>
                              </li>
                            ))}
                          </ul>

                          <div className="mt-6 flex flex-wrap gap-2">
                            {item.skills.map((skill) => (
                              <span key={skill} className="rounded-full border border-theme bg-white/10 px-3 py-1.5 text-xs font-bold text-muted">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="absolute left-0 top-8 h-9 w-9 rounded-full border border-theme bg-[var(--surface-strong)] shadow-glow md:left-1/2 md:-translate-x-1/2">
                        <span className="absolute inset-2 rounded-full bg-[var(--primary)]" />
                      </span>
                    </article>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>

        <section id="projects" className="section-spacing scroll-mt-28">
          <ScrollReveal className="mb-10 max-w-3xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.28em] text-muted">{copy.projectsTitle}</p>
            <h2 className="text-[clamp(2.2rem,4vw,4.25rem)] font-black leading-tight tracking-tight">{copy.projectsTitle}</h2>
            <p className="mt-4 text-lg leading-8 text-muted">{copy.projectsDescription}</p>
          </ScrollReveal>

          {projects.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:gap-8">
              {projects.map((project, index) => (
                <ScrollReveal key={project.id} delay={index * 28}>
                  <ProjectCard project={project} locale={locale} />
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <ScrollReveal>
              <p className="text-muted">{copy.noProjects}</p>
            </ScrollReveal>
          )}
        </section>

        <section id="contact" className="section-spacing scroll-mt-28">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] xl:gap-12">
            <ScrollReveal>
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.28em] text-muted">{copy.contactTitle}</p>
              <h2 className="text-[clamp(2.2rem,4vw,4.25rem)] font-black leading-tight tracking-tight">{copy.contactTitle}</h2>
              <p className="mt-4 text-lg leading-8 text-muted">{copy.contactDescription}</p>

              <div className="mt-8 space-y-3 text-sm">
                <a href="mailto:matheusdurigon1@gmail.com" className="button-soft inline-flex items-center gap-2 rounded-full px-4 py-2 font-semibold">
                  <Mail size={16} /> matheusdurigon1@gmail.com
                </a>
                <div className="flex flex-wrap gap-3">
                  <a href="https://github.com/MathiRD" target="_blank" className="button-soft rounded-full px-4 py-2 font-semibold">GitHub</a>
                  <a href="https://www.linkedin.com/in/matheus-r-durigon" target="_blank" className="button-soft rounded-full px-4 py-2 font-semibold">LinkedIn</a>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={70}>
              <ContactForm locale={locale} />
            </ScrollReveal>
          </div>
        </section>
      </main>

      <footer className="site-shell relative z-10 pb-10">
        <div className="liquid-glass rounded-[2rem] px-6 py-5 text-sm text-muted">
          © {new Date().getFullYear()} Matheus Durigon — Backend Engineer.
        </div>
      </footer>
    </>
  );
}

const journeyPt = [
  {
    title: "Software Engineering",
    company: "Compass UOL",
    type: "Estágio",
    period: "jun de 2023 - nov de 2023 · 6 meses",
    location: "Remoto",
    highlights: [
      "Desenvolvi funcionalidades web e mobile em um ambiente remoto usando React, React Native, TypeScript e serviços backend.",
      "Construí e consumi APIs REST, trabalhando com validação de dados, fluxos de integração e bancos relacionais.",
      "Atuei com Docker, fluxos Git, debugging e desenvolvimento colaborativo em times distribuídos.",
      "Fortaleci fundamentos de engenharia de software, incluindo organização de código, integridade de dados e manutenibilidade."
    ],
    skills: ["TypeScript", "React", "React Native", "AWS", "Docker", "Git", "REST APIs", "Bancos relacionais"],
    icon: Rocket
  },
  {
    title: "Backend-focused Full Stack Developer",
    company: "Atua Sistemas by nstech",
    type: "Tempo integral",
    period: "mar de 2024 - o momento · 2 anos 3 meses",
    location: "Passo Fundo, Rio Grande do Sul, Brasil · Híbrido",
    highlights: [
      "Projetei e entreguei do zero um módulo de fluxo de caixa, hoje integrado ao produto principal e utilizado por uma grande base de clientes no Brasil.",
      "Melhorei a performance de queries críticas em PostgreSQL em mais de 40% com estratégias de indexação e refatoração de consultas.",
      "Construí e mantive APIs REST com autenticação, validação de dados e regras de negócio complexas.",
      "Implementei estratégias de cache com Redis para reduzir carga no banco em endpoints de alta frequência.",
      "Refatorei módulos legados para melhorar manutenibilidade, legibilidade e escalabilidade de longo prazo.",
      "Entreguei funcionalidades full stack com foco em backend, alinhadas a requisitos operacionais e de negócio reais."
    ],
    skills: ["PHP", "Laravel", "PostgreSQL", "Redis", "Docker", "REST APIs", "Performance", "Sistemas logísticos"],
    icon: BriefcaseBusiness
  }
];

const journeyEn = [
  {
    title: "Software Engineering",
    company: "Compass UOL",
    type: "Internship",
    period: "Jun 2023 - Nov 2023 · 6 mos",
    location: "Remote",
    highlights: [
      "Developed web and mobile features in a remote-first internship environment using React, React Native, TypeScript and backend services.",
      "Built and consumed REST APIs, working with data validation, integration flows and relational databases.",
      "Worked with Docker, Git workflows, debugging and collaborative development in distributed teams.",
      "Strengthened software engineering fundamentals, including code organization, data integrity and maintainability."
    ],
    skills: ["TypeScript", "React", "React Native", "AWS", "Docker", "Git", "REST APIs", "Relational databases"],
    icon: Rocket
  },
  {
    title: "Backend-focused Full Stack Developer",
    company: "Atua Sistemas by nstech",
    type: "Full-time",
    period: "Mar 2024 - Present · 2 yrs 3 mos",
    location: "Passo Fundo, Rio Grande do Sul, Brazil · Hybrid",
    highlights: [
      "Designed and delivered a cash flow module from scratch, now integrated into the core product and used by a large client base across Brazil.",
      "Improved critical PostgreSQL query performance by 40%+ through indexing strategies and query refactoring.",
      "Built and maintained REST APIs handling authentication, data validation and complex business rules.",
      "Implemented Redis-based caching strategies to reduce database load on high-frequency endpoints.",
      "Refactored legacy modules to improve maintainability, readability and long-term scalability.",
      "Delivered backend-focused full-stack features aligned with real-world operational and business requirements."
    ],
    skills: ["PHP", "Laravel", "PostgreSQL", "Redis", "Docker", "REST APIs", "Performance", "Logistics systems"],
    icon: BriefcaseBusiness
  }
];
