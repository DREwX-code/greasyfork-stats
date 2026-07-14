export const themes = {
  default: {
    bg: "#fffefe",
    border: "#e4e2e2",
    title: "#2f80ed",
    text: "#434d58",
    icon: "#4c71f2",
    barBg: "#eef0f4",
    barFill: "#2f80ed",
  },
  github_dark: {
    bg: "#0d1117",
    border: "#30363d",
    title: "#58a6ff",
    text: "#c9d1d9",
    icon: "#58a6ff",
    barBg: "#21262d",
    barFill: "#58a6ff",
  },
  dracula: {
    bg: "#282a36",
    border: "#44475a",
    title: "#ff79c6",
    text: "#f8f8f2",
    icon: "#bd93f9",
    barBg: "#44475a",
    barFill: "#ff79c6",
  },
  nord: {
    bg: "#2e3440",
    border: "#3b4252",
    title: "#88c0d0",
    text: "#eceff4",
    icon: "#81a1c1",
    barBg: "#3b4252",
    barFill: "#88c0d0",
  },
  gruvbox: {
    bg: "#282828",
    border: "#3c3836",
    title: "#fe8019",
    text: "#ebdbb2",
    icon: "#b8bb26",
    barBg: "#3c3836",
    barFill: "#fe8019",
  },
  tokyonight: {
    bg: "#1a1b27",
    border: "#3b4261",
    title: "#7aa2f7",
    text: "#c0caf5",
    icon: "#bb9af7",
    barBg: "#2b2e44",
    barFill: "#7aa2f7",
  },
  catppuccin: {
    bg: "#1e1e2e",
    border: "#313244",
    title: "#89dceb",
    text: "#cdd6f4",
    icon: "#a6e3a1",
    barBg: "#313244",
    barFill: "#89dceb",
  },
  monokai: {
    bg: "#272822",
    border: "#3e3d32",
    title: "#66d9ef",
    text: "#f8f8f2",
    icon: "#a1efe4",
    barBg: "#3e3d32",
    barFill: "#66d9ef",
  },
  cyberpunk: {
    bg: "#0a0e27",
    border: "#1a1f3a",
    title: "#00f0ff",
    text: "#d1d5e8",
    icon: "#ff006e",
    barBg: "#1a1f3a",
    barFill: "#00f0ff",
  },
  solarized_dark: {
    bg: "#002b36",
    border: "#073642",
    title: "#268bd2",
    text: "#93a1a1",
    icon: "#859900",
    barBg: "#073642",
    barFill: "#268bd2",
  },
};

export function getTheme(name = "default") {
  return themes[name] || themes.default;
}

export function getThemeNames() {
  return Object.keys(themes);
}
