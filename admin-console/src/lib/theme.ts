export type Theme = "light" | "dark";

const KEY = "aspire.admin.theme";

export function getTheme(): Theme {
  const stored = localStorage.getItem(KEY) as Theme | null;
  if (stored) return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  localStorage.setItem(KEY, theme);
}

export function initTheme() {
  document.documentElement.classList.toggle("dark", getTheme() === "dark");
}
