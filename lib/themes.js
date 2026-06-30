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

  dark: {
    bg: "#151515",
    border: "#2a2a2a",
    title: "#fe428e",
    text: "#a9fef7",
    icon: "#f8d847",
    barBg: "#2a2a2a",
    barFill: "#fe428e",
  },

  radical: {
    bg: "#141321",
    border: "#2c2c54",
    title: "#fe428e",
    text: "#a9fef7",
    icon: "#f8d847",
    barBg: "#2c2c54",
    barFill: "#fe428e",
  },

  tokyonight: {
    bg: "#1a1b27",
    border: "#3b4261",
    title: "#70a5fd",
    text: "#9d7cd8",
    icon: "#bf91f3",
    barBg: "#2b2e44",
    barFill: "#70a5fd",
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
};

export function getTheme(name = "default") {
  return themes[name] || themes.default;
}

export function getThemeNames() {
  return Object.keys(themes);
}
