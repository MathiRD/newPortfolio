import Link from "next/link";
import { UserRound } from "lucide-react";
import { MobileNavigationMenu } from "@/components/mobile-navigation-menu";
import { ColorPalette, Locale, ThemeMode, dictionary } from "@/lib/preferences";
import { PreferenceControls } from "@/components/preference-controls";

type SiteHeaderProps = {
  locale: Locale;
  themeMode: ThemeMode;
  colorPalette: ColorPalette;
};

export function SiteHeader({ locale, themeMode, colorPalette }: SiteHeaderProps) {
  const copy = dictionary[locale];

  return (
    <header className="sticky top-3 z-50 mx-auto max-w-6xl px-4 sm:px-5">
      <nav className="liquid-glass relative flex items-center justify-between gap-4 rounded-full px-4 py-2.5">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full button-primary text-sm font-bold">
            MD
          </span>
          <span className="hidden text-sm font-bold tracking-tight sm:block">Matheus Durigon</span>
        </Link>

        <div className="hidden items-center gap-6 text-sm font-medium text-muted md:flex">
          <a href="#about" className="transition hover:text-[var(--text)]">{copy.navAbout}</a>
          <a href="#projects" className="transition hover:text-[var(--text)]">{copy.navProjects}</a>
          <a href="#contact" className="transition hover:text-[var(--text)]">{copy.navContact}</a>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <PreferenceControls locale={locale} themeMode={themeMode} colorPalette={colorPalette} />
          <Link
            href="/admin"
            aria-label={copy.admin}
            className="button-soft focus-ring inline-flex h-10 w-10 items-center justify-center rounded-full transition hover:-translate-y-0.5"
          >
            <UserRound size={17} />
          </Link>
        </div>

        <MobileNavigationMenu locale={locale} themeMode={themeMode} />
      </nav>
    </header>
  );
}
