import { getUserStats, GreasyForkError } from "../lib/greasyfork.js";
import { renderStatsCard, escapeXml } from "../lib/card.js";
import { getTheme } from "../lib/themes.js";

const CACHE_SECONDS = 60 * 60 * 6;
const STALE_SECONDS = 60 * 60 * 24;

export default async function handler(req, res) {
  res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
  res.setHeader("X-Content-Type-Options", "nosniff");

  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", "GET, HEAD");
    res.setHeader("Cache-Control", "no-store");
    res.status(405).send(renderErrorCard("Method not allowed."));
    return;
  }

  const user = getQueryValue(req.query.user);
  const theme = getQueryValue(req.query.theme) || "default";
  const lang = getQueryValue(req.query.lang) || "en";
  const hideTitle = parseBoolean(req.query.hide_title);
  const hideBorder = parseBoolean(req.query.hide_border);

  if (!user) {
    res.setHeader("Cache-Control", "no-store");
    res
      .status(400)
      .send(
        renderErrorCard(
          "Missing parameter: ?user=<greasyfork-user-id>",
          theme,
        ),
      );
    return;
  }

  try {
    const stats = await getUserStats(user);

    const svg = renderStatsCard(stats, {
      theme,
      lang,
      hideTitle,
      hideBorder,
    });

    res.setHeader(
      "Cache-Control",
      `public, max-age=${CACHE_SECONDS}, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=${STALE_SECONDS}`,
    );

    res.status(200).send(req.method === "HEAD" ? "" : svg);
  } catch (error) {
    const status =
      error instanceof GreasyForkError &&
      Number.isInteger(error.status) &&
      error.status >= 400 &&
      error.status <= 599
        ? error.status
        : 500;

    if (!(error instanceof GreasyForkError)) {
      console.error("Unexpected stats endpoint error:", error);
    }

    const message =
      status === 500
        ? "Unable to generate the stats card."
        : error.message || "Unknown error.";

    res.setHeader(
      "Cache-Control",
      status === 404
        ? "public, max-age=300, s-maxage=300"
        : "no-store",
    );

    res
      .status(status)
      .send(req.method === "HEAD" ? "" : renderErrorCard(message, theme));
  }
}

function renderErrorCard(message, themeName = "default") {
  const theme = getTheme(themeName);

  return `<svg width="420" height="100" viewBox="0 0 420 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="error-title error-description">
  <title id="error-title">GreasyFork Stats Error</title>
  <desc id="error-description">${escapeXml(message)}</desc>
  <style>
    .title { font: 600 14px 'Segoe UI', Ubuntu, Sans-Serif; fill: #e84545; }
    .text { font: 400 12px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${theme.text}; }
  </style>
  <rect x="0.5" y="0.5" rx="6" width="419" height="99" fill="${theme.bg}" stroke="${theme.border}" />
  <text x="25" y="35" class="title">GreasyFork Stats Error</text>
  <text x="25" y="62" class="text">${escapeXml(message)}</text>
</svg>`;
}

function getQueryValue(value) {
  if (Array.isArray(value)) {
    return String(value[0] ?? "").trim();
  }

  return String(value ?? "").trim();
}

function parseBoolean(value) {
  const normalized = getQueryValue(value).toLowerCase();
  return normalized === "true" || normalized === "1";
}
