export const i18n = {
  en: {
    title: (username) => `${username}'s Userscript Stats`,
    totalInstalls: "Total Installs",
    dailyInstalls: "Daily Installs",
    scripts: "Scripts",
    rating: "Rating",
  },

  fr: {
    title: (username) => `${username}'s GreasyFork Stats`,
    totalInstalls: "Installations totales",
    dailyInstalls: "Installations / jour",
    scripts: "Scripts",
    rating: "Note",
  },

  es: {
    title: (username) => `${username}'s GreasyFork Stats`,
    totalInstalls: "Instalaciones totales",
    dailyInstalls: "Instalaciones diarias",
    scripts: "Scripts",
    rating: "Valoración",
  },

  de: {
    title: (username) => `${username}'s GreasyFork Stats`,
    totalInstalls: "Installationen gesamt",
    dailyInstalls: "Installationen / Tag",
    scripts: "Skripte",
    rating: "Bewertung",
  },
};

export function getStrings(lang = "en") {
  return i18n[lang] || i18n.en;
}

export function getLanguageNames() {
  return Object.keys(i18n);
}
