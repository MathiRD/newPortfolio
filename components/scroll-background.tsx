"use client";

import { useEffect } from "react";

export function ScrollBackground() {
  useEffect(() => {
    let animationFrame = 0;

    const update = () => {
      const root = document.documentElement;
      const maxScroll = Math.max(1, root.scrollHeight - window.innerHeight);
      const scrollY = window.scrollY;
      const progress = Math.min(1, Math.max(0, scrollY / maxScroll));

      root.style.setProperty("--scroll-progress", progress.toFixed(4));
      root.style.setProperty("--journey-progress", `${Math.max(12, progress * 100).toFixed(1)}%`);
      root.style.setProperty("--bg-grid-y", `${scrollY * -0.22}px`);
      root.style.setProperty("--bg-grid-x", `${scrollY * 0.06}px`);
      root.style.setProperty("--bg-streak-y", `${scrollY * -0.34}px`);
      root.style.setProperty("--bg-streak-x", `${scrollY * 0.16}px`);
      root.style.setProperty("--light-left-x", `${-80 + progress * 260}px`);
      root.style.setProperty("--light-left-y", `${40 + progress * 220}px`);
      root.style.setProperty("--light-right-x", `${80 - progress * 260}px`);
      root.style.setProperty("--light-right-y", `${180 + progress * -140}px`);
      root.style.setProperty("--light-center-x", `${progress * 120 - 60}px`);
      root.style.setProperty("--light-center-y", `${progress * 320}px`);

      animationFrame = 0;
    };

    const requestUpdate = () => {
      if (animationFrame) return;
      animationFrame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  return (
    <div className="scroll-background" aria-hidden="true">
      <div className="scroll-background__base" />
      <div className="scroll-background__grid" />
      <div className="scroll-background__streaks" />
      <div className="scroll-background__lights">
        <span className="scroll-light scroll-light--left" />
        <span className="scroll-light scroll-light--right" />
        <span className="scroll-light scroll-light--center" />
      </div>
      <div className="scroll-background__vignette" />
    </div>
  );
}
