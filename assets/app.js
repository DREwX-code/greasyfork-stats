import { themes } from "../lib/themes.js";
import { i18n as translations } from "../lib/i18n.js";
import { renderStatsCard } from "../lib/card.js";
import { aggregateUserStats, normalizeUser } from "../lib/stats.js";
const API_BASE_URL = new URL("/api/stats", location.origin).href;

const interfaceStrings = {
  en: {
    interfaceTheme: "Interface theme",
    interfaceLanguage: "Interface language",
    builder: "GreasyFork card builder",
    displayOptions: "Display options",
    embedFormat: "Embed format",
    secondaryLinks: "Secondary links",
    themeAuto: "Auto",
    themeLight: "Light",
    themeDark: "Dark",
    eyebrow: "Card generator",
    headline: "Showcase your GreasyFork statistics.",
    intro:
      "Configure your card, preview it instantly, then copy the format you need.",
    settings: "Settings",
    settingsHelp: "Customize the content and appearance.",
    userLabel: "GreasyFork user",
    cardTheme: "Card theme",
    cardLanguage: "Card language",
    hideTitle: "Hide title",
    hideBorder: "Hide border",
    openCard: "Open card",
    copy: "Copy",
    copied: "Copied",
    layout: "Card layout",
    compact: "Compact",
    grid: "Grid",
    download: "Download SVG",
    share: "Copy settings link",
    retry: "Try again",
    shared: "Settings link copied",
    copyError: "Copy failed. Select and copy the code manually.",
    exportPending: "Load a valid profile to export your card.",
    userInvalid: "Enter a numeric ID or a greasyfork.org profile URL.",
    userIdle: "Profile ID or URL.",
    userChecking: "Checking GreasyFork…",
    userValid: (name) => `${name} · data loaded`,
    userError: "User not found or unavailable.",
    localNote:
      "Preview uses the latest fetched data. Embedded cards are cached for up to 6 hours; GitHub may also cache images.",
  },
  fr: {
    interfaceTheme: "Thème de l’interface",
    interfaceLanguage: "Langue de l’interface",
    builder: "Configurateur de carte GreasyFork",
    displayOptions: "Options d’affichage",
    embedFormat: "Format d’intégration",
    secondaryLinks: "Liens secondaires",
    themeAuto: "Auto",
    themeLight: "Clair",
    themeDark: "Sombre",
    eyebrow: "Générateur de carte",
    headline: "Présentez vos statistiques GreasyFork.",
    intro:
      "Configurez votre carte, contrôlez son rendu instantanément, puis copiez le format dont vous avez besoin.",
    settings: "Paramètres",
    settingsHelp: "Personnalisez le contenu et l’apparence.",
    userLabel: "Utilisateur GreasyFork",
    cardTheme: "Thème de la carte",
    cardLanguage: "Langue de la carte",
    hideTitle: "Masquer le titre",
    hideBorder: "Masquer la bordure",
    openCard: "Ouvrir la carte",
    copy: "Copier",
    copied: "Copié",
    layout: "Disposition",
    compact: "Compacte",
    grid: "Grille",
    download: "Télécharger le SVG",
    share: "Copier le lien des réglages",
    retry: "Réessayer",
    shared: "Lien des réglages copié",
    copyError:
      "Échec de la copie. Sélectionnez et copiez le code manuellement.",
    exportPending: "Chargez un profil valide pour exporter votre carte.",
    userInvalid:
      "Saisissez un identifiant numérique ou une URL de profil greasyfork.org.",
    userIdle: "Identifiant ou URL du profil.",
    userChecking: "Vérification sur GreasyFork…",
    userValid: (name) => `${name} · données chargées`,
    userError: "Utilisateur introuvable ou indisponible.",
    localNote:
      "L’aperçu utilise les dernières données récupérées. Les cartes intégrées sont mises en cache jusqu’à 6 heures ; GitHub peut aussi conserver les images en cache.",
  },
};
const form = document.querySelector(".builder-form");
const themeMenu = document.querySelector("#themeMenu");
const languageMenu = document.querySelector("#languageMenu");
const userInput = document.querySelector("#user");
const userStatus = document.querySelector("#userStatus");
const cardThemeMenu = document.querySelector("#cardThemeMenu");
const cardLanguageMenu = document.querySelector("#cardLanguageMenu");
const hideTitleInput = document.querySelector("#hideTitle");
const hideBorderInput = document.querySelector("#hideBorder");
const previewStage = document.querySelector("#preview-stage");
const localNote = document.querySelector("#localNote");
const codeOutput = document.querySelector("#code-output");
const copyButton = document.querySelector("#copyButton");
const openCard = document.querySelector("#openCard");
const layoutMenu = document.querySelector("#layoutMenu");
const downloadButton = document.querySelector("#downloadButton");
const shareButton = document.querySelector("#shareButton");
const retryButton = document.querySelector("#retryButton");
const feedback = document.querySelector("#actionFeedback");
const tabs = [...document.querySelectorAll(".tab")];
let activeFormat = "markdown";
let interfaceLanguage = "en";
let cardThemeValue = "github_dark";
let cardLanguageValue = "en";
let userStatusState = "idle";
let verifiedUsername = "";
let fetchController;
let fetchTimer;
let copyTimer;
let previewStats = null;
let requestVersion = 0;
const statsCache = new Map();

function setMenuValue(menu, value) {
  const options = [...menu.options];
  const selected =
    options.find((option) => option.value === value) || options[0];
  menu.value = selected.value;
}

function initializeMenu(menu, onSelect) {
  menu.addEventListener("change", () => {
    onSelect(menu.value);
  });
}

function applySiteTheme(value, persist = true) {
  const theme = ["light", "dark"].includes(value) ? value : "auto";
  if (theme === "auto") {
    document.documentElement.removeAttribute("data-site-theme");
  } else {
    document.documentElement.dataset.siteTheme = theme;
  }

  setMenuValue(themeMenu, theme);
  const isDark =
    theme === "dark" ||
    (theme === "auto" && matchMedia("(prefers-color-scheme: dark)").matches);
  document.querySelector('meta[name="theme-color"]').content = isDark
    ? "#111311"
    : "#f6f6f4";
  if (persist) {
    try {
      localStorage.setItem("greasyfork-stats-site-theme", theme);
    } catch {
      /* Storage is optional. */
    }
  }
}

function applyInterfaceLanguage(value, persist = true) {
  interfaceLanguage = value === "fr" ? "fr" : "en";
  const strings = interfaceStrings[interfaceLanguage];
  document.documentElement.lang = interfaceLanguage;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = strings[element.dataset.i18n];
  });
  document.querySelectorAll("[data-i18n-menu]").forEach((element) => {
    element.textContent = strings[element.dataset.i18nMenu];
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
    element.setAttribute("aria-label", strings[element.dataset.i18nAria]);
  });
  setMenuValue(themeMenu, document.documentElement.dataset.siteTheme || "auto");
  setMenuValue(languageMenu, interfaceLanguage);
  updateUserStatus();
  render();
  if (persist) {
    try {
      localStorage.setItem("greasyfork-stats-site-language", interfaceLanguage);
    } catch {
      /* Storage is optional. */
    }
  }
}

function updateUserStatus() {
  const strings = interfaceStrings[interfaceLanguage];
  userStatus.dataset.state = userStatusState;
  if (userStatusState === "checking") {
    userStatus.textContent = strings.userChecking;
  } else if (userStatusState === "valid") {
    userStatus.textContent = strings.userValid(verifiedUsername);
  } else if (userStatusState === "invalid") {
    userStatus.textContent = strings.userInvalid;
  } else if (userStatusState === "error") {
    userStatus.textContent = strings.userError;
  } else {
    userStatus.textContent = strings.userIdle;
  }
}

function updateLocalNote() {
  localNote.textContent = interfaceStrings[interfaceLanguage].localNote;
}

function invalidatePreview() {
  requestVersion += 1;
  fetchController?.abort();
  clearTimeout(fetchTimer);
  previewStats = null;
  verifiedUsername = "";
  userStatusState = userInput.value.trim() ? "checking" : "idle";
  render();
}

async function fetchUserStats() {
  const version = requestVersion;
  const user = normalizeUser(userInput.value);
  if (!user) {
    userStatusState = userInput.value.trim() ? "invalid" : "idle";
    render();
    return;
  }
  userStatusState = "checking";
  render();
  const controller = new AbortController();
  fetchController = controller;
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    let stats = statsCache.get(user);
    if (!stats) {
      const response = await fetch(
        `https://api.greasyfork.org/en/users/${user}.json`,
        { headers: { Accept: "application/json" }, signal: controller.signal },
      );
      if (!response.ok) throw new Error("Unavailable profile");
      const data = await response.json();
      stats = aggregateUserStats(data);
      statsCache.set(user, stats);
    }
    if (version !== requestVersion) return;
    previewStats = stats;
    verifiedUsername = stats.username;
    userStatusState = "valid";
  } catch {
    if (version !== requestVersion) return;
    previewStats = null;
    userStatusState = "error";
  } finally {
    clearTimeout(timeout);
    if (version === requestVersion) render();
  }
}

function scheduleUserFetch() {
  invalidatePreview();
  fetchTimer = setTimeout(fetchUserStats, 650);
}

function getState() {
  return {
    user: normalizeUser(userInput.value),
    layout: layoutMenu.value,
    theme: cardThemeValue,
    lang: cardLanguageValue,
    hideTitle: hideTitleInput.checked,
    hideBorder: hideBorderInput.checked,
  };
}

function buildUrl(state) {
  const url = new URL(API_BASE_URL);
  url.searchParams.set("user", state.user);
  url.searchParams.set("theme", state.theme);
  url.searchParams.set("lang", state.lang);
  if (state.layout === "grid") url.searchParams.set("layout", "grid");
  if (state.hideTitle) url.searchParams.set("hide_title", "true");
  if (state.hideBorder) url.searchParams.set("hide_border", "true");
  return url.href;
}

function getOutput(url) {
  if (activeFormat === "url") return url;
  if (activeFormat === "html") {
    return `<img src="${url.replaceAll("&", "&amp;")}" alt="GreasyFork Stats">`;
  }
  return `![GreasyFork Stats](${url})`;
}

function render() {
  const state = getState();
  const ready = userStatusState === "valid" && previewStats !== null;
  const strings = interfaceStrings[interfaceLanguage];
  updateUserStatus();
  updateLocalNote();
  previewStage.setAttribute(
    "aria-busy",
    String(userStatusState === "checking"),
  );
  if (ready) {
    previewStage.innerHTML = renderStatsCard(previewStats, state);
    previewStage.querySelector("svg").id = "card-preview";
  } else {
    previewStage.textContent =
      strings[
        userStatusState === "checking"
          ? "userChecking"
          : userStatusState === "invalid"
            ? "userInvalid"
            : userStatusState === "error"
              ? "userError"
              : "userIdle"
      ];
  }
  copyButton.disabled = !ready;
  downloadButton.disabled = !ready;
  shareButton.disabled = !ready;
  retryButton.hidden = userStatusState !== "error";
  codeOutput.textContent = ready
    ? getOutput(buildUrl(state))
    : strings.exportPending;
  if (ready) openCard.href = buildUrl(state);
  else openCard.removeAttribute("href");
  openCard.setAttribute("aria-disabled", String(!ready));
  document.querySelectorAll(".theme-swatch").forEach((button) => {
    button.setAttribute(
      "aria-pressed",
      String(button.dataset.theme === state.theme),
    );
  });
  try {
    localStorage.setItem(
      "greasyfork-stats-builder-v2",
      JSON.stringify({ ...state, user: userInput.value }),
    );
  } catch {
    /* Storage is optional. */
  }
}

function restoreState() {
  try {
    const state = JSON.parse(
      localStorage.getItem("greasyfork-stats-builder-v2"),
    );
    if (!state) return;
    userInput.value = state.user || "1259433";
    layoutMenu.value = state.layout === "grid" ? "grid" : "compact";
    if (Object.hasOwn(themes, state.theme)) cardThemeValue = state.theme;
    if (Object.hasOwn(translations, state.lang)) cardLanguageValue = state.lang;
    setMenuValue(cardThemeMenu, cardThemeValue);
    setMenuValue(cardLanguageMenu, cardLanguageValue);
    hideTitleInput.checked = Boolean(state.hideTitle);
    hideBorderInput.checked = Boolean(state.hideBorder);
  } catch {
    /* Stored state may be unavailable or malformed. */
  }
}

initializeMenu(themeMenu, applySiteTheme);
initializeMenu(languageMenu, applyInterfaceLanguage);
initializeMenu(cardThemeMenu, (value) => {
  cardThemeValue = themes[value] ? value : "github_dark";
  render();
});
initializeMenu(cardLanguageMenu, (value) => {
  cardLanguageValue = translations[value] ? value : "en";
  render();
});

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    activeFormat = tab.dataset.format;
    tabs.forEach((item) =>
      item.setAttribute("aria-selected", String(item === tab)),
    );
    tabs.forEach((item) => {
      item.tabIndex = item === tab ? 0 : -1;
    });
    document
      .querySelector("#exportPanel")
      .setAttribute("aria-labelledby", tab.id);
    render();
  });
  tab.addEventListener("keydown", (event) => {
    const index = tabs.indexOf(tab);
    const next =
      event.key === "ArrowRight"
        ? (index + 1) % tabs.length
        : event.key === "ArrowLeft"
          ? (index + tabs.length - 1) % tabs.length
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? tabs.length - 1
              : -1;
    if (next < 0) return;
    event.preventDefault();
    tabs[next].focus();
    tabs[next].click();
  });
});

form.addEventListener("input", (event) => {
  if (event.target !== userInput) render();
});
form.addEventListener("change", render);
userInput.addEventListener("input", scheduleUserFetch);

copyButton.addEventListener("click", async () => {
  const value = codeOutput.textContent;

  try {
    await copyText(value);
  } catch {
    feedback.textContent = interfaceStrings[interfaceLanguage].copyError;
    return;
  }

  clearTimeout(copyTimer);
  copyButton.classList.add("success");
  copyButton.querySelector("span").textContent =
    interfaceStrings[interfaceLanguage].copied;
  copyTimer = setTimeout(() => {
    copyButton.classList.remove("success");
    copyButton.querySelector("span").textContent =
      interfaceStrings[interfaceLanguage].copy;
  }, 1600);
});

async function copyText(value) {
  try {
    await navigator.clipboard.writeText(value);
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    textarea.remove();
    if (!copied) throw new Error("Copy failed");
  }
}

downloadButton.addEventListener("click", () => {
  if (!previewStats || userStatusState !== "valid") return;
  const url = URL.createObjectURL(
    new Blob([renderStatsCard(previewStats, getState())], {
      type: "image/svg+xml;charset=utf-8",
    }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = `greasyfork-${getState().user}.svg`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});
shareButton.addEventListener("click", async () => {
  const url = new URL(location.pathname, location.origin);
  url.search = new URL(buildUrl(getState())).search;
  try {
    await copyText(url.href);
    feedback.textContent = interfaceStrings[interfaceLanguage].shared;
  } catch {
    feedback.textContent = interfaceStrings[interfaceLanguage].copyError;
  }
});
retryButton.addEventListener("click", () => {
  invalidatePreview();
  fetchUserStats();
});

for (const [name, theme] of Object.entries(themes)) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "theme-swatch";
  button.dataset.theme = name;
  button.title = [...cardThemeMenu.options].find(
    (option) => option.value === name,
  ).textContent;
  button.setAttribute("aria-label", button.title);
  button.style.setProperty("--swatch-bg", theme.bg);
  button.style.setProperty("--swatch-ink", theme.title);
  button.innerHTML = '<span aria-hidden="true">Aa</span>';
  button.addEventListener("click", () => {
    cardThemeValue = name;
    setMenuValue(cardThemeMenu, name);
    render();
  });
  document.querySelector("#themeSwatches").appendChild(button);
}

function restoreSharedState() {
  const params = new URLSearchParams(location.search);
  if (!params.has("user")) return;
  userInput.value = params.get("user");
  cardThemeValue = Object.hasOwn(themes, params.get("theme"))
    ? params.get("theme")
    : "github_dark";
  cardLanguageValue = Object.hasOwn(translations, params.get("lang"))
    ? params.get("lang")
    : "en";
  setMenuValue(cardThemeMenu, cardThemeValue);
  setMenuValue(cardLanguageMenu, cardLanguageValue);
  layoutMenu.value = params.get("layout") === "grid" ? "grid" : "compact";
  hideTitleInput.checked = ["true", "1"].includes(params.get("hide_title"));
  hideBorderInput.checked = ["true", "1"].includes(params.get("hide_border"));
}

let savedTheme = "auto";
let savedLanguage = "en";
try {
  savedTheme = localStorage.getItem("greasyfork-stats-site-theme") || "auto";
  savedLanguage =
    localStorage.getItem("greasyfork-stats-site-language") || "en";
} catch {
  /* Storage is optional. */
}

restoreState();
restoreSharedState();
applySiteTheme(savedTheme, false);
applyInterfaceLanguage(savedLanguage, false);
render();
fetchUserStats();
