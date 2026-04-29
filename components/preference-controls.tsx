"use client";

import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import {
  ColorPalette,
  Locale,
  ThemeMode,
  colorPalettes,
  supportedColorPalettes
} from "@/lib/preferences";

type PreferenceControlsProps = {
  locale: Locale;
  themeMode: ThemeMode;
  colorPalette: ColorPalette;
};

const preferenceCookieMaxAge = 60 * 60 * 24 * 365;

export function PreferenceControls({
  locale,
  themeMode,
  colorPalette
}: PreferenceControlsProps) {
  const [selectedThemeMode, setSelectedThemeMode] = useState<ThemeMode>(themeMode);
  const [selectedColorPalette, setSelectedColorPalette] = useState<ColorPalette>(colorPalette);

  useEffect(() => {
    const storedThemeMode = readStoredThemeMode() ?? themeMode;
    const storedColorPalette = readStoredColorPalette() ?? colorPalette;

    setSelectedThemeMode(storedThemeMode);
    setSelectedColorPalette(storedColorPalette);
    applyVisualPreferences(storedThemeMode, storedColorPalette);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    function handleSystemThemeChange() {
      const currentThemeMode = readCurrentThemeMode(storedThemeMode);
      const currentColorPalette = readCurrentColorPalette(storedColorPalette);

      if (currentThemeMode === "system") {
        applyVisualPreferences(currentThemeMode, currentColorPalette);
      }
    }

    mediaQuery.addEventListener("change", handleSystemThemeChange);
    return () => mediaQuery.removeEventListener("change", handleSystemThemeChange);
  }, [themeMode, colorPalette]);

  function handleThemeModeChange(nextThemeMode: ThemeMode) {
    const currentColorPalette = readCurrentColorPalette(selectedColorPalette);

    setSelectedThemeMode(nextThemeMode);
    persistPreference("portfolio_theme_mode", nextThemeMode);
    applyVisualPreferences(nextThemeMode, currentColorPalette);
  }

  function handleColorPaletteChange(nextColorPalette: ColorPalette) {
    const currentThemeMode = readCurrentThemeMode(selectedThemeMode);

    setSelectedColorPalette(nextColorPalette);
    persistPreference("portfolio_color_palette", nextColorPalette);
    applyVisualPreferences(currentThemeMode, nextColorPalette);
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

      <div className="liquid-glass flex items-center gap-1 rounded-full p-1">
        {supportedColorPalettes.map((palette) => {
          const isActive = selectedColorPalette === palette;

          return (
            <button
              key={palette}
              type="button"
              onClick={() => handleColorPaletteChange(palette)}
              className={`focus-ring inline-flex h-9 items-center gap-2 rounded-full px-3 text-xs font-semibold transition hover:-translate-y-0.5 ${
                isActive ? "button-primary" : "text-muted hover:bg-white/20"
              }`}
              aria-label={`Set ${colorPalettes[palette].label} palette`}
            >
              <span className={`h-2.5 w-2.5 rounded-full ${colorPalettes[palette].dotClassName}`} />
              {colorPalettes[palette].label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function applyVisualPreferences(themeMode: ThemeMode, colorPalette: ColorPalette) {
  const root = document.documentElement;
  const shouldUseDark =
    themeMode === "dark" ||
    (themeMode === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  root.classList.toggle("dark", shouldUseDark);
  root.classList.remove("palette-ocean", "palette-emerald", "palette-violet");
  root.classList.add(`palette-${colorPalette}`);

  root.dataset.themeMode = themeMode;
  root.dataset.colorPalette = colorPalette;

  localStorage.setItem("portfolio_theme_mode", themeMode);
  localStorage.setItem("portfolio_color_palette", colorPalette);
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

function readCurrentColorPalette(fallbackColorPalette: ColorPalette): ColorPalette {
  const datasetColorPalette = document.documentElement.dataset.colorPalette;
  if (isColorPalette(datasetColorPalette)) return datasetColorPalette;

  const storedColorPalette = readStoredColorPalette();
  return storedColorPalette ?? fallbackColorPalette;
}

function readStoredThemeMode(): ThemeMode | null {
  const value = localStorage.getItem("portfolio_theme_mode");
  return isThemeMode(value) ? value : null;
}

function readStoredColorPalette(): ColorPalette | null {
  const value = localStorage.getItem("portfolio_color_palette");
  return isColorPalette(value) ? value : null;
}

function isThemeMode(value: unknown): value is ThemeMode {
  return value === "system" || value === "light" || value === "dark";
}

function isColorPalette(value: unknown): value is ColorPalette {
  return value === "ocean" || value === "emerald" || value === "violet";
}
