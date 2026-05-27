import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import Script from "next/script";
import "./globals.css";
import {
  normalizeLocale,
  normalizeThemeMode
} from "@/lib/preferences";
import { redis } from "@/lib/redis";

export const metadata: Metadata = {
  title: "Matheus Durigon | Backend Engineer",
  description: "Backend Engineer portfolio focused on APIs, PostgreSQL, Redis and scalable systems."
};

async function getInitialPreferences() {
  const cookieStore = cookies();
  const clientId = cookieStore.get("portfolio_client_id")?.value;

  let locale = cookieStore.get("portfolio_locale")?.value;
  let themeMode = cookieStore.get("portfolio_theme_mode")?.value;
  if (clientId && redis) {
    try {
      const savedPreferences = await redis.hgetall(`portfolio:preferences:${clientId}`);
      locale = savedPreferences.locale || locale;
      themeMode = savedPreferences.themeMode || themeMode;
    } catch {
      // Cookies are enough for rendering.
    }
  }

  return {
    locale: normalizeLocale(locale ?? headers().get("accept-language")),
    themeMode: normalizeThemeMode(themeMode),
    colorPalette: "ocean" as const
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const preferences = await getInitialPreferences();

  const themeBootstrapScript = `
    (function () {
      try {
        var serverMode = ${JSON.stringify(preferences.themeMode)};
        var storedMode = localStorage.getItem('portfolio_theme_mode');

        var mode = ['system', 'light', 'dark'].indexOf(storedMode) >= 0 ? storedMode : serverMode;
        var palette = 'ocean';

        var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        var shouldUseDark = mode === 'dark' || (mode === 'system' && prefersDark);

        document.documentElement.classList.toggle('dark', shouldUseDark);
        document.documentElement.classList.remove('palette-ocean', 'palette-emerald', 'palette-violet');
        document.documentElement.classList.add('palette-' + palette);
        document.documentElement.dataset.themeMode = mode;
        document.documentElement.dataset.colorPalette = palette;
        localStorage.setItem('portfolio_color_palette', palette);
      } catch (error) {}
    })();
  `;

  return (
    <html lang={preferences.locale} className={`palette-${preferences.colorPalette}`} suppressHydrationWarning>
      <head>
        <Script id="theme-bootstrap" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: themeBootstrapScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
