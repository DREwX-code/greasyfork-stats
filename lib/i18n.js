export const i18n = {
  en: {
    title: (username) => `${username}'s Userscript Stats`,
    totalInstalls: "Total Installs",
    dailyInstalls: "Daily Installs",
    scripts: "Scripts",
    rating: "Positive reviews",
    reviews: "reviews",
    noReviews: "No reviews yet",
  },

  fr: {
    title: (username) => `Statistiques de ${username}`,
    totalInstalls: "Installations totales",
    dailyInstalls: "Installations / jour",
    scripts: "Scripts",
    rating: "Avis positifs",
    reviews: "avis",
    noReviews: "Aucun avis",
  },

  es: {
    title: (username) => `Estadísticas de ${username}`,
    totalInstalls: "Instalaciones totales",
    dailyInstalls: "Instalaciones diarias",
    scripts: "Scripts",
    rating: "Reseñas positivas",
    reviews: "reseñas",
    noReviews: "Sin reseñas",
  },

  de: {
    title: (username) => `Statistiken von ${username}`,
    totalInstalls: "Installationen gesamt",
    dailyInstalls: "Installationen / Tag",
    scripts: "Skripte",
    rating: "Positive Bewertungen",
    reviews: "Bewertungen",
    noReviews: "Noch keine Bewertungen",
  },
};

export function getStrings(lang = "en") {
  return Object.hasOwn(i18n, lang) ? i18n[lang] : i18n.en;
}

export function getLanguageNames() {
  return Object.keys(i18n);
}
