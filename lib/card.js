import { getTheme } from "./themes.js";
import { getStrings } from "./i18n.js";

const CARD_WIDTH = 420;
const CARD_HEIGHT = 170;
const PADDING_X = 25;
const ROW_HEIGHT = 26;

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
    rows.push({ label: t.rating, value: `${ratingPct}% 👍` });
  }

  const title = t.title(stats.username || "GreasyFork");
  const titleBlock = opts.hideTitle
    ? ""
    : `<text x="${PADDING_X}" y="38" class="title">${escapeXml(title)}</text>`;

  const rowsStartY = opts.hideTitle ? 35 : 70;

  const rowsSvg = rows
    .map((row, index) => {
      const y = rowsStartY + index * ROW_HEIGHT;

      return `
      <g transform="translate(${PADDING_X}, ${y})">
        <text class="label">${escapeXml(row.label)}</text>
        <text x="${CARD_WIDTH - PADDING_X * 2}" text-anchor="end" class="value">${escapeXml(row.value)}</text>
      </g>`;
    })
    .join("");

  const height = Math.max(
    CARD_HEIGHT,
    rowsStartY + rows.length * ROW_HEIGHT + 20,
  );

  const borderStyle = opts.hideBorder
    ? "stroke-width:0"
    : `stroke:${theme.border};stroke-width:1`;

  const description = rows
    .map((row) => `${row.label}: ${row.value}`)
    .join(", ");

  return `<svg width="${CARD_WIDTH}" height="${height}" viewBox="0 0 ${CARD_WIDTH} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="card-title card-description">
  <title id="card-title">${escapeXml(title)}</title>
  <desc id="card-description">${escapeXml(description)}</desc>
  <style>
    .title { font: 600 16px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${theme.title}; }
    .label { font: 400 13px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${theme.text}; }
    .value { font: 700 13px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${theme.text}; }
  </style>
  <rect x="0.5" y="0.5" rx="6" width="${CARD_WIDTH - 1}" height="${height - 1}" fill="${theme.bg}" style="${borderStyle}" />
  ${titleBlock}
  ${rowsSvg}
</svg>`;
}
