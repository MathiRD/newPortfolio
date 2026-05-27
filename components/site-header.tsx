"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    function updateHeader() {
      const currentScrollY = Math.max(window.scrollY, 0);
      const scrollDifference = currentScrollY - lastScrollY.current;

      if (currentScrollY < 20) {
        setIsVisible(true);
      } else if (scrollDifference > 6) {
        setIsVisible(false);
      } else if (scrollDifference < -6) {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
      ticking.current = false;
    }

    function handleScroll() {
      if (!ticking.current) {
        window.requestAnimationFrame(updateHeader);
        ticking.current = true;
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className="fixed left-0 right-0 top-3 z-50 px-4 transition-transform duration-300 ease-out sm:px-5"
      style={{ transform: isVisible ? "translate3d(0, 0, 0)" : "translate3d(0, -120%, 0)" }}
    >
      <nav className="liquid-glass mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-full px-4 py-2.5 shadow-glass">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full button-primary text-sm font-bold">
            MD
          </span>
          <span className="hidden text-sm font-bold tracking-tight sm:block">Matheus Durigon</span>
        </Link>

        <div className="hidden items-center gap-6 text-sm font-medium text-muted md:flex">
          <a href="#about" className="transition hover:text-[var(--text)]">{copy.navAbout}</a>
          <a href="#journey" className="transition hover:text-[var(--text)]">{locale === "pt" ? "Trajetória" : "Journey"}</a>
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
