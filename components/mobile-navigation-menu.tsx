"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, Monitor, Moon, Sun, UserRound, X } from "lucide-react";
import { Locale, ThemeMode, dictionary } from "@/lib/preferences";

type MobileNavigationMenuProps = {
  locale: Locale;
  themeMode: ThemeMode;
};

const preferenceCookieMaxAge = 60 * 60 * 24 * 365;
const mobileColorPalette = "ocean";
const mobileMediaQuery = "(max-width: 767px)";

export function MobileNavigationMenu({ locale, themeMode }: MobileNavigationMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedThemeMode, setSelectedThemeMode] = useState<ThemeMode>(themeMode);
  const copy = dictionary[locale];

  useEffect(() => {
    const storedThemeMode = readStoredThemeMode() ?? themeMode;
    setSelectedThemeMode(storedThemeMode);

    const viewportQuery = window.matchMedia(mobileMediaQuery);
    const systemThemeQuery = window.matchMedia("(prefers-color-scheme: dark)");

    function syncMobilePreferences() {
      if (!viewportQuery.matches) {
        setIsOpen(false);
        return;
      }

      const currentThemeMode = readCurrentThemeMode(storedThemeMode);
      applyMobileVisualPreferences(currentThemeMode);
    }

    syncMobilePreferences();

    viewportQuery.addEventListener("change", syncMobilePreferences);
    systemThemeQuery.addEventListener("change", syncMobilePreferences);

    return () => {
      viewportQuery.removeEventListener("change", syncMobilePreferences);
      systemThemeQuery.removeEventListener("change", syncMobilePreferences);
    };
  }, [themeMode]);

  function handleThemeModeChange(nextThemeMode: ThemeMode) {
    setSelectedThemeMode(nextThemeMode);
    persistPreference("portfolio_theme_mode", nextThemeMode);

    if (isMobileViewport()) {
      applyMobileVisualPreferences(nextThemeMode);
    }
  }

  function toggleLocale() {
    const nextLocale = locale === "pt" ? "en" : "pt";

    persistPreference("portfolio_locale", nextLocale);
    window.location.reload();
  }

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setIsOpen((currentValue) => !currentValue)}
        aria-label="Open menu"
        aria-expanded={isOpen}
        className="button-soft focus-ring inline-flex h-10 w-10 items-center justify-center rounded-full transition hover:-translate-y-0.5"
      >
        {isOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {isOpen ? (
        <div className="absolute left-0 right-0 top-[calc(100%+0.75rem)] z-50 px-4">
          <div className="liquid-glass rounded-[1.75rem] p-4 shadow-glass">
            <div className="grid gap-3">
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={toggleLocale}
                  className="focus-ring inline-flex h-10 items-center justify-center rounded-full bg-white px-4 text-sm font-bold text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50"
                >
                  {locale === "pt" ? "EN" : "PT-BR"}
                </button>

                <div className="flex items-center gap-1 rounded-full bg-white p-1 shadow-sm">
                  {(["system", "light", "dark"] as ThemeMode[]).map((mode) => {
                    const isActive = selectedThemeMode === mode;
                    const Icon = mode === "system" ? Monitor : mode === "light" ? Sun : Moon;

                    return (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => handleThemeModeChange(mode)}
                        className={`focus-ring inline-flex h-9 w-9 items-center justify-center rounded-full transition ${
                          isActive ? "button-primary" : "text-slate-600 hover:bg-slate-100"
                        }`}
                        aria-label={`Set ${mode} theme`}
                      >
                        <Icon size={16} />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="h-px bg-[var(--border)]" />

              <nav className="grid gap-1 text-sm font-bold">
                <a
                  href="#about"
                  onClick={closeMenu}
                  className="rounded-2xl bg-white px-4 py-3 text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50"
                >
                  {copy.navAbout}
                </a>
                <a
                  href="#journey"
                  onClick={closeMenu}
                  className="rounded-2xl bg-white px-4 py-3 text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50"
                >
                  {locale === "pt" ? "Trajetória" : "Journey"}
                </a>
                <a
                  href="#projects"
                  onClick={closeMenu}
                  className="rounded-2xl bg-white px-4 py-3 text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50"
                >
                  {copy.navProjects}
                </a>
                <a
                  href="#contact"
                  onClick={closeMenu}
                  className="rounded-2xl bg-white px-4 py-3 text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50"
                >
                  {copy.navContact}
                </a>
              </nav>

              <Link
                href="/admin"
                onClick={closeMenu}
                className="button-primary focus-ring inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-bold"
              >
                <UserRound size={16} />
                {copy.admin}
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function applyMobileVisualPreferences(themeMode: ThemeMode) {
  const root = document.documentElement;
  const shouldUseDark =
    themeMode === "dark" ||
    (themeMode === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  root.classList.toggle("dark", shouldUseDark);
  root.classList.remove("palette-ocean", "palette-emerald", "palette-violet");
  root.classList.add(`palette-${mobileColorPalette}`);

  root.dataset.themeMode = themeMode;
  root.dataset.colorPalette = mobileColorPalette;

  localStorage.setItem("portfolio_theme_mode", themeMode);
  localStorage.setItem("portfolio_color_palette", mobileColorPalette);
  persistPreference("portfolio_color_palette", mobileColorPalette);
}

function persistPreference(name: string, value: string) {
  localStorage.setItem(name, value);
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${preferenceCookieMaxAge}; samesite=lax`;
}

function readCurrentThemeMode(fallbackThemeMode: ThemeMode): ThemeMode {
  const datasetThemeMode = document.documentElement.dataset.themeMode;
  if (isThemeMode(datasetThemeMode)) return datasetThemeMode;

  const storedThemeMode = readStoredThemeMode();
  return storedThemeMode ?? fallbackThemeMode;
}

function readStoredThemeMode(): ThemeMode | null {
  const value = localStorage.getItem("portfolio_theme_mode");
  return isThemeMode(value) ? value : null;
}

function isMobileViewport(): boolean {
  return window.matchMedia(mobileMediaQuery).matches;
}

function isThemeMode(value: unknown): value is ThemeMode {
  return value === "system" || value === "light" || value === "dark";
}
