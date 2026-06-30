import { getTheme } from "./themes.js";
import { getStrings } from "./i18n.js";

const CARD_WIDTH = 420;
const CARD_HEIGHT = 170;

export function escapeXml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function formatNumber(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}k`;
  return String(n);
}

export function renderStatsCard(stats, opts = {}) {
  const theme = getTheme(opts.theme);
  const t = getStrings(opts.lang);

  const ratingTotal = stats.goodRatings + stats.okRatings + stats.badRatings;
  const ratingPct =
    ratingTotal > 0 ? Math.round((stats.goodRatings / ratingTotal) * 100) : null;

  const rows = [
    { label: t.totalInstalls, value: formatNumber(stats.totalInstalls) },
    { label: t.dailyInstalls, value: formatNumber(stats.dailyInstalls) },
    { label: t.scripts, value: formatNumber(stats.scriptCount) },
  ];

  if (ratingPct !== null) {
    rows.push({ label: t.rating, value: `${ratingPct}% 👍` });
  }

  const titleText = opts.hideTitle ? "" : escapeXml(t.title(stats.username));
  const titleBlock = opts.hideTitle
    ? ""
    : `<text x="25" y="38" class="title">${titleText}</text>`;

  const rowsStartY = opts.hideTitle ? 35 : 70;
  const rowHeight = 26;

  const rowsSvg = rows
    .map((row, i) => {
      const y = rowsStartY + i * rowHeight;

      return `
      <g transform="translate(25, ${y})">
        <text class="label">${escapeXml(row.label)}</text>
        <text x="370" text-anchor="end" class="value">${escapeXml(row.value)}</text>
      </g>`;
    })
    .join("");

  const height = Math.max(CARD_HEIGHT, rowsStartY + rows.length * rowHeight + 20);
  const borderStyle = opts.hideBorder
    ? "stroke-width:0"
    : `stroke:${theme.border};stroke-width:1`;

  return `<svg width="${CARD_WIDTH}" height="${height}" viewBox="0 0 ${CARD_WIDTH} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${titleText}">
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
