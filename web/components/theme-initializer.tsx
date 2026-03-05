"use client";

import { useEffect } from "react";

export function ThemeInitializer() {
  useEffect(() => {
    const color = localStorage.getItem("themeColor");
    if (!color) return;

    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);

    const root = document.documentElement;
    root.style.setProperty("--theme-color", color);
    root.style.setProperty(
      "--theme-color-hover",
      `rgba(${r}, ${g}, ${b}, 0.9)`,
    );
    root.style.setProperty("--sidebar-primary", color);
    root.style.setProperty("--sidebar-accent", color);
    root.style.setProperty("--sidebar-ring", color);
    root.style.setProperty("--sidebar-hover", `rgba(${r}, ${g}, ${b}, 0.1)`);

    // Convert hex to approximate OKLCH for --primary (used by shadcn/base-ui components)
    const rn = r / 255,
      gn = g / 255,
      bn = b / 255;
    const max = Math.max(rn, gn, bn),
      min = Math.min(rn, gn, bn);
    const l = (max + min) / 2;
    const c = max - min;
    let h = 0;
    if (c !== 0) {
      if (max === rn) h = ((gn - bn) / c + 6) % 6;
      else if (max === gn) h = (bn - rn) / c + 2;
      else h = (rn - gn) / c + 4;
      h *= 60;
    }
    root.style.setProperty(
      "--primary",
      `oklch(${(l * 0.8 + 0.1).toFixed(2)} ${(c * 0.2).toFixed(2)} ${h.toFixed(0)})`,
    );
  }, []);

  return null;
}
