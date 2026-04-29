export type Locale = "en" | "pt";
export type ThemeMode = "system" | "light" | "dark";
export type ColorPalette = "ocean" | "emerald" | "violet";

export const supportedLocales: Locale[] = ["en", "pt"];
export const supportedThemeModes: ThemeMode[] = ["system", "light", "dark"];
export const supportedColorPalettes: ColorPalette[] = ["ocean", "emerald", "violet"];

export function normalizeLocale(value?: string | null): Locale {
  if (!value) return "en";
  return value.toLowerCase().startsWith("pt") ? "pt" : "en";
}

export function normalizeThemeMode(value?: string | null): ThemeMode {
  if (value === "light" || value === "dark" || value === "system") return value;
  return "system";
}

export function normalizeColorPalette(value?: string | null): ColorPalette {
  if (value === "emerald" || value === "violet" || value === "ocean") return value;
  return "ocean";
}

export const colorPalettes: Record<ColorPalette, { label: string; dotClassName: string }> = {
  ocean: {
    label: "Ocean",
    dotClassName: "bg-sky-500"
  },
  emerald: {
    label: "Emerald",
    dotClassName: "bg-emerald-500"
  },
  violet: {
    label: "Violet",
    dotClassName: "bg-violet-500"
  }
};

export const dictionary = {
  en: {
    navProjects: "Projects",
    navAbout: "About",
    navContact: "Contact",
    role: "Backend Engineer",
    heroTitle: "Building scalable APIs and data-driven systems.",
    heroDescription:
      "Backend-focused developer with 3+ years of experience building production APIs, database-heavy systems and practical software for real business needs.",
    contactMe: "Contact me",
    viewProjects: "View projects",
    stackLabel: "Core stack",
    aboutTitle: "About",
    aboutDescription:
      "I work across backend architecture, database optimization, API design, Redis caching and legacy refactoring. Although my focus is backend, I can deliver full-stack features when needed.",
    aboutHighlightOne: "Production systems",
    aboutHighlightTwo: "PostgreSQL performance",
    aboutHighlightThree: "Clean and maintainable code",
    projectsTitle: "Selected projects",
    projectsDescription: "Projects managed through the admin dashboard and displayed dynamically from PostgreSQL.",
    github: "GitHub",
    live: "Live",
    noProjects: "No published projects yet.",
    contactTitle: "Let's talk",
    contactDescription:
      "Use the form below or reach me directly through email, LinkedIn or GitHub.",
    name: "Name",
    email: "Email",
    message: "Message",
    sendMessage: "Send message",
    messageSent: "Message sent successfully.",
    messageRateLimited: "Please wait before sending another message.",
    directContact: "Direct contact",
    admin: "Admin",
    dashboard: "Dashboard",
    newProject: "New project",
    edit: "Edit",
    delete: "Delete",
    logout: "Logout",
    backHome: "Back to site",
    messages: "Messages",
    projects: "Projects"
  },
  pt: {
    navProjects: "Projetos",
    navAbout: "Sobre",
    navContact: "Contato",
    role: "Backend Engineer",
    heroTitle: "Construindo APIs escaláveis e sistemas orientados a dados.",
    heroDescription:
      "Desenvolvedor com foco em backend, com mais de 3 anos de experiência construindo APIs em produção, sistemas com forte uso de dados e soluções práticas para problemas reais de negócio.",
    contactMe: "Contato",
    viewProjects: "Ver projetos",
    stackLabel: "Stack principal",
    aboutTitle: "Sobre",
    aboutDescription:
      "Atuo com arquitetura backend, otimização de banco de dados, design de APIs, cache com Redis e refatoração de sistemas legados. Apesar do foco em backend, também entrego funcionalidades full stack quando necessário.",
    aboutHighlightOne: "Sistemas em produção",
    aboutHighlightTwo: "Performance em PostgreSQL",
    aboutHighlightThree: "Código limpo e sustentável",
    projectsTitle: "Projetos selecionados",
    projectsDescription: "Projetos gerenciados pelo painel admin e exibidos dinamicamente a partir do PostgreSQL.",
    github: "GitHub",
    live: "Demo",
    noProjects: "Nenhum projeto publicado ainda.",
    contactTitle: "Vamos conversar",
    contactDescription:
      "Use o formulário abaixo ou entre em contato diretamente por e-mail, LinkedIn ou GitHub.",
    name: "Nome",
    email: "E-mail",
    message: "Mensagem",
    sendMessage: "Enviar mensagem",
    messageSent: "Mensagem enviada com sucesso.",
    messageRateLimited: "Aguarde antes de enviar outra mensagem.",
    directContact: "Contato direto",
    admin: "Admin",
    dashboard: "Painel",
    newProject: "Novo projeto",
    edit: "Editar",
    delete: "Excluir",
    logout: "Sair",
    backHome: "Voltar ao site",
    messages: "Mensagens",
    projects: "Projetos"
  }
} as const;
