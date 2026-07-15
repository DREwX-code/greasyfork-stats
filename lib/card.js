import { getTheme } from "./themes.js";
import { getStrings } from "./i18n.js";

const CARD_WIDTH = 420;
const CARD_HEIGHT = 178;
const PADDING_X = 24;
const ROW_HEIGHT = 27;
const VALUE_X = CARD_WIDTH - PADDING_X;

export function escapeXml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function safeNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? Math.round(number) : 0;
}

export function formatNumber(value) {
  const number = safeNumber(value);

  if (number >= 1_000_000) {
    return `${(number / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  }

  if (number >= 1_000) {
    return `${(number / 1_000).toFixed(1).replace(/\.0$/, "")}k`;
  }

  return String(number);
}

export function renderStatsCard(stats = {}, opts = {}) {
  const theme = getTheme(opts.theme);
  const t = getStrings(opts.lang);

  const goodRatings = safeNumber(stats.goodRatings);
  const okRatings = safeNumber(stats.okRatings);
  const badRatings = safeNumber(stats.badRatings);
  const ratingTotal = goodRatings + okRatings + badRatings;
  const ratingPct =
    ratingTotal > 0 ? Math.round((goodRatings / ratingTotal) * 100) : null;

  const rows = [
    { label: t.totalInstalls, value: formatNumber(stats.totalInstalls) },
    { label: t.dailyInstalls, value: formatNumber(stats.dailyInstalls) },
    { label: t.scripts, value: formatNumber(stats.scriptCount) },
  ];

  if (ratingPct !== null) {
    rows.push({ label: t.rating, value: `${ratingPct}%` });
  }

  const title = t.title(stats.username || "GreasyFork");
  const rowsStartY = opts.hideTitle ? 40 : 78;

  const titleBlock = opts.hideTitle
    ? ""
    : `
  <rect x="${PADDING_X}" y="23" width="4" height="22" rx="2" fill="${theme.title}" />
  <text x="${PADDING_X + 14}" y="40" class="title">${escapeXml(title)}</text>`;

  const rowsSvg = rows
    .map((row, index) => {
      const y = rowsStartY + index * ROW_HEIGHT;
      const divider =
        index === rows.length - 1
          ? ""
          : `<line x1="${PADDING_X}" y1="${y + 11}" x2="${VALUE_X}" y2="${y + 11}" class="divider" />`;

      return `
  <g>
    <text x="${PADDING_X}" y="${y}" class="label">${escapeXml(row.label)}</text>
    <text x="${VALUE_X}" y="${y}" text-anchor="end" class="value">${escapeXml(row.value)}</text>
    ${divider}
  </g>`;
    })
    .join("");

  const height = Math.max(
    CARD_HEIGHT,
    rowsStartY + rows.length * ROW_HEIGHT + 16,
  );

  const border = opts.hideBorder
    ? ""
    : `stroke="${theme.border}" stroke-width="1"`;

  const description = rows
    .map((row) => `${row.label}: ${row.value}`)
    .join(", ");

  return `<svg width="${CARD_WIDTH}" height="${height}" viewBox="0 0 ${CARD_WIDTH} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="card-title card-description">
  <title id="card-title">${escapeXml(title)}</title>
  <desc id="card-description">${escapeXml(description)}</desc>
  <defs>
    <linearGradient id="card-bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${theme.bg}" />
      <stop offset="100%" stop-color="${theme.bg}" stop-opacity="0.94" />
    </linearGradient>
  </defs>
  <style>
    .title { font: 600 16px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${theme.title}; }
    .label { font: 400 13px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${theme.text}; opacity: 0.82; }
    .value { font: 700 14px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${theme.text}; }
    .divider { stroke: ${theme.border}; stroke-width: 1; opacity: 0.45; }
  </style>
  <rect x="0.5" y="0.5" rx="10" width="${CARD_WIDTH - 1}" height="${height - 1}" fill="url(#card-bg)" ${border} />
  ${titleBlock}
  ${rowsSvg}
</svg>`;
}
