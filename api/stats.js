import { getUserStats, GreasyForkError } from "../lib/greasyfork.js";
import { renderStatsCard } from "../lib/card.js";
import { getTheme } from "../lib/themes.js";

const CACHE_SECONDS = 60 * 60;

export default async function handler(req, res) {
  const {
    user,
    theme = "default",
    lang = "en",
    hide_title = "false",
    hide_border = "false",
  } = req.query;

  res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");

  if (!user) {
    res.status(400).send(renderErrorCard("Missing parameter: ?user=<greasyfork-user-id>", theme));
    return;
  }

  try {
    const stats = await getUserStats(user);

    const svg = renderStatsCard(stats, {
      theme,
      lang,
      hideTitle: hide_title === "true",
      hideBorder: hide_border === "true",
    });

    res.setHeader(
      "Cache-Control",
      `public, max-age=${CACHE_SECONDS}, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=${CACHE_SECONDS * 6}`
    );

    res.status(200).send(svg);
  } catch (error) {
    const status = error instanceof GreasyForkError ? error.status : 500;

    res.setHeader("Cache-Control", "no-cache");
    res.status(status).send(renderErrorCard(error.message || "Unknown error.", theme));
  }
}

function renderErrorCard(message, themeName = "default") {
  const theme = getTheme(themeName);
  const safeMessage = escapeXml(message);

  return `
<svg width="420" height="100" viewBox="0 0 420 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="GreasyFork Stats Error">
  <style>
    .title { font: 600 14px 'Segoe UI', Ubuntu, Sans-Serif; fill: #e84545; }
    .text { font: 400 12px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${theme.text}; }
  </style>
  <rect x="0.5" y="0.5" rx="6" width="419" height="99" fill="${theme.bg}" stroke="${theme.border}" />
  <text x="25" y="35" class="title">GreasyFork Stats Error</text>
  <text x="25" y="62" class="text">${safeMessage}</text>
</svg>
`.trim();
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
