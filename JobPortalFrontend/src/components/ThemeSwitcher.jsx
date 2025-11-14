// src/components/ThemeSwitcher.jsx
import React from "react";

const THEMES = [
  { key: "minimal", label: "Modern Minimal" },
  { key: "dark", label: "Dark Modern" },
  { key: "glass", label: "Glassmorphism" },
  { key: "corporate", label: "Corporate Blue" },
  { key: "gradient", label: "Bold Gradient" },
];

export default function ThemeSwitcher() {
  const onChange = (e) => {
    document.documentElement.setAttribute("data-theme", e.target.value);
  };
  return (
    <select className="theme-switcher" onChange={onChange} defaultValue="minimal" aria-label="Change theme">
      {THEMES.map(t => <option key={t.key} value={t.key}>{t.label}</option>)}
    </select>
  );
}
