import { cookies, headers } from "next/headers";
import { ArrowRight, Database, Gauge, Layers3, Mail } from "lucide-react";
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

export default async function HomePage() {
  const cookieStore = cookies();
  const locale = normalizeLocale(cookieStore.get("portfolio_locale")?.value ?? headers().get("accept-language"));
  const themeMode = normalizeThemeMode(cookieStore.get("portfolio_theme_mode")?.value);
  const colorPalette = normalizeColorPalette(cookieStore.get("portfolio_color_palette")?.value);
  const copy = dictionary[locale];

  const projects = await prisma.project.findMany({
    where: { published: true },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }]
  });

  return (
    <>
      <SiteHeader locale={locale} themeMode={themeMode} colorPalette={colorPalette} />

      <main className="mx-auto max-w-6xl px-5 pb-12 pt-4">
        <section className="grid min-h-[calc(100vh-12rem)] items-center gap-10 py-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="animate-fade-up">
            <p className="mb-5 inline-flex rounded-full border border-theme bg-white/10 px-4 py-2 text-sm font-bold text-muted">
              {copy.role}
            </p>

            <h1 className="max-w-4xl text-5xl font-black tracking-tight md:text-7xl">
              {copy.heroTitle}
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
              {copy.heroDescription}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#contact" className="button-primary focus-ring inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition hover:-translate-y-0.5">
                {copy.contactMe} <ArrowRight size={16} />
              </a>
              <a href="#projects" className="button-soft focus-ring inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition hover:-translate-y-0.5">
                {copy.viewProjects}
              </a>
            </div>
          </div>

          <div className="animate-fade-up lg:justify-self-end" style={{ animationDelay: "120ms" }}>
            <div className="liquid-glass relative overflow-hidden rounded-[2.5rem] p-5">
              <div className="absolute right-8 top-8 h-24 w-24 rounded-full bg-[var(--primary)] opacity-20 blur-3xl" />
              <div className="relative min-h-[420px] overflow-hidden rounded-[2rem] border border-theme bg-surface">
                <div className="flex min-h-[420px] flex-col justify-between p-8">
                  <div>
                    <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-3xl button-primary text-3xl font-black shadow-glow">
                      MD
                    </div>
                    <h2 className="text-2xl font-black">Matheus Durigon</h2>
                    <p className="mt-2 text-muted">Backend Engineer · UTC-3</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-bold text-muted">{copy.stackLabel}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {["Node.js", "Laravel", "PostgreSQL", "Redis", "Docker", "TypeScript"].map((skill) => (
                        <span key={skill} className="rounded-2xl border border-theme bg-white/10 px-3 py-2 text-sm font-semibold">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="py-12">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.28em] text-muted">{copy.aboutTitle}</p>
              <h2 className="text-4xl font-black tracking-tight md:text-5xl">
                Backend focus with full-stack delivery.
              </h2>
            </div>

            <div className="liquid-glass rounded-[2rem] p-7">
              <p className="text-lg leading-8 text-muted">{copy.aboutDescription}</p>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {[
                  { icon: Layers3, label: copy.aboutHighlightOne },
                  { icon: Database, label: copy.aboutHighlightTwo },
                  { icon: Gauge, label: copy.aboutHighlightThree }
                ].map((item) => (
                  <div key={item.label} className="rounded-3xl border border-theme bg-white/10 p-5">
                    <item.icon className="mb-4 text-[var(--primary)]" size={24} />
                    <p className="text-sm font-bold">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="projects" className="py-12">
          <div className="mb-10 max-w-2xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.28em] text-muted">{copy.projectsTitle}</p>
            <h2 className="text-4xl font-black tracking-tight md:text-5xl">{copy.projectsTitle}</h2>
            <p className="mt-4 leading-7 text-muted">{copy.projectsDescription}</p>
          </div>

          {projects.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} locale={locale} />
              ))}
            </div>
          ) : (
            <p className="text-muted">{copy.noProjects}</p>
          )}
        </section>

        <section id="contact" className="py-12">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.28em] text-muted">{copy.contactTitle}</p>
              <h2 className="text-4xl font-black tracking-tight md:text-5xl">{copy.contactTitle}</h2>
              <p className="mt-4 leading-7 text-muted">{copy.contactDescription}</p>

              <div className="mt-8 space-y-3 text-sm">
                <a href="mailto:matheusdurigon1@gmail.com" className="button-soft inline-flex items-center gap-2 rounded-full px-4 py-2 font-semibold">
                  <Mail size={16} /> matheusdurigon1@gmail.com
                </a>
                <div className="flex flex-wrap gap-3">
                  <a href="https://github.com/MathiRD" target="_blank" className="button-soft rounded-full px-4 py-2 font-semibold">GitHub</a>
                  <a href="https://www.linkedin.com/in/matheus-r-durigon" target="_blank" className="button-soft rounded-full px-4 py-2 font-semibold">LinkedIn</a>
                </div>
              </div>
            </div>

            <ContactForm locale={locale} />
          </div>
        </section>
      </main>

      <footer className="mx-auto max-w-6xl px-5 pb-10">
        <div className="liquid-glass rounded-[2rem] px-6 py-5 text-sm text-muted">
          © {new Date().getFullYear()} Matheus Durigon — Backend Engineer.
        </div>
      </footer>
    </>
  );
}
