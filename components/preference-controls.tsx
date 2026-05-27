"use client";

import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { ColorPalette, Locale, ThemeMode } from "@/lib/preferences";

type PreferenceControlsProps = {
  locale: Locale;
  themeMode: ThemeMode;
  colorPalette: ColorPalette;
};

const preferenceCookieMaxAge = 60 * 60 * 24 * 365;
const fixedColorPalette: ColorPalette = "ocean";

export function PreferenceControls({ locale, themeMode }: PreferenceControlsProps) {
  const [selectedThemeMode, setSelectedThemeMode] = useState<ThemeMode>(themeMode);

  useEffect(() => {
    const storedThemeMode = readStoredThemeMode() ?? themeMode;

    setSelectedThemeMode(storedThemeMode);
    applyVisualPreferences(storedThemeMode);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    function handleSystemThemeChange() {
      const currentThemeMode = readCurrentThemeMode(storedThemeMode);

      if (currentThemeMode === "system") {
        applyVisualPreferences(currentThemeMode);
      }
    }

    mediaQuery.addEventListener("change", handleSystemThemeChange);
    return () => mediaQuery.removeEventListener("change", handleSystemThemeChange);
  }, [themeMode]);

  function handleThemeModeChange(nextThemeMode: ThemeMode) {
    setSelectedThemeMode(nextThemeMode);
    persistPreference("portfolio_theme_mode", nextThemeMode);
    applyVisualPreferences(nextThemeMode);
  }

  function toggleLocale() {
    const nextLocale = locale === "pt" ? "en" : "pt";

    persistPreference("portfolio_locale", nextLocale);
    window.location.reload();
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={toggleLocale}
        className="button-soft focus-ring inline-flex h-10 items-center rounded-full px-4 text-sm font-semibold transition hover:-translate-y-0.5"
        aria-label="Toggle language"
      >
        {locale === "pt" ? "EN" : "PT-BR"}
      </button>

      <div className="liquid-glass flex items-center gap-1 rounded-full p-1">
        {(["system", "light", "dark"] as ThemeMode[]).map((mode) => {
          const isActive = selectedThemeMode === mode;
          const Icon = mode === "system" ? Monitor : mode === "light" ? Sun : Moon;

          return (
            <button
              key={mode}
              type="button"
              onClick={() => handleThemeModeChange(mode)}
              className={`focus-ring inline-flex h-9 w-9 items-center justify-center rounded-full transition hover:-translate-y-0.5 ${
                isActive ? "button-primary" : "text-muted hover:bg-white/20"
              }`}
              aria-label={`Set ${mode} theme`}
            >
              <Icon size={16} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function applyVisualPreferences(themeMode: ThemeMode) {
  const root = document.documentElement;
  const shouldUseDark =
    themeMode === "dark" ||
    (themeMode === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  root.classList.toggle("dark", shouldUseDark);
  root.classList.remove("palette-emerald", "palette-violet");
  root.classList.add("palette-ocean");

  root.dataset.themeMode = themeMode;
  root.dataset.colorPalette = fixedColorPalette;

  localStorage.setItem("portfolio_theme_mode", themeMode);
  localStorage.setItem("portfolio_color_palette", fixedColorPalette);
  persistPreference("portfolio_color_palette", fixedColorPalette);
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

function isThemeMode(value: unknown): value is ThemeMode {
  return value === "system" || value === "light" || value === "dark";
}
