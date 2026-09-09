import { getTheme } from "./themes.js";
import { getStrings } from "./i18n.js";

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
  // Select the unit after rounding so 999,999 becomes 1M, not 1000k.
  if (number >= 999_950)
    return `${(number / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (number >= 1_000)
    return `${(number / 1_000).toFixed(1).replace(/\.0$/, "")}k`;
  return String(number);
}

function shortTitle(title) {
  // Conservative width estimate also accounts for full-width and emoji characters.
  let width = 0;
  let output = "";
  for (const character of title) {
    width += character.codePointAt(0) <= 255 ? 9 : 17;
    if (width > 340) return `${output}…`;
    output += character;
  }
  return output;
}

export function renderStatsCard(stats = {}, opts = {}) {
  const theme = getTheme(opts.theme);
  const t = getStrings(opts.lang);
  const ratingTotal =
    safeNumber(stats.goodRatings) +
    safeNumber(stats.okRatings) +
    safeNumber(stats.badRatings);
  const ratingPct =
    ratingTotal > 0
      ? Math.round((safeNumber(stats.goodRatings) / ratingTotal) * 100)
      : null;
  const rows = [
    {
      label: t.totalInstalls,
      value: formatNumber(stats.totalInstalls),
      exact: safeNumber(stats.totalInstalls),
    },
    {
      label: t.dailyInstalls,
      value: formatNumber(stats.dailyInstalls),
      exact: safeNumber(stats.dailyInstalls),
    },
    {
      label: t.scripts,
      value: formatNumber(stats.scriptCount),
      exact: safeNumber(stats.scriptCount),
    },
  ];
  const rating = {
    label: t.rating,
    value: ratingPct === null ? "—" : `${ratingPct}%`,
    exact:
      ratingPct === null
        ? t.noReviews
        : `${ratingPct}% (${ratingTotal} ${t.reviews})`,
  };
  const title = t.title(stats.username || "GreasyFork");
  const grid = opts.layout === "grid";
  const top = opts.hideTitle ? 24 : 68;
  const height = top + (grid ? 174 : 154);
  const text = (
    x,
    y,
    value,
    size = 13,
    weight = 400,
    color = theme.text,
    extra = "",
  ) =>
    `<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" fill="${color}" ${extra}>${escapeXml(value)}</text>`;
  let content = "";
  if (grid) {
    [...rows, rating].forEach((row, index) => {
      const x = index % 2 === 0 ? 24 : 224;
      const y = top + Math.floor(index / 2) * 82;
      content += text(x, y + 10, row.label, 12);
      content += text(
        x,
        y + 43,
        row.value,
        28,
        700,
        index === 0 ? theme.title : theme.text,
      );
      if (index === 3)
        content += text(
          x,
          y + 63,
          ratingTotal
            ? `${formatNumber(ratingTotal)} ${t.reviews}`
            : t.noReviews,
          11,
        );
    });
    content += `<path d="M210 ${top}v145 M24 ${top + 72}h372" stroke="${theme.border}" opacity="0.65"/>`;
  } else {
    rows.forEach((row, index) => {
      const y = top + 18 + index * 32;
      content += text(24, y, row.label);
      content += text(
        396,
        y,
        row.value,
        index === 0 ? 23 : 16,
        700,
        index === 0 ? theme.title : theme.text,
        'text-anchor="end"',
      );
      content += `<path d="M24 ${y + 12}h372" stroke="${theme.border}" opacity="0.55"/>`;
    });
    content += text(24, top + 120, rating.label, 12);
    content += text(
      396,
      top + 120,
      rating.value,
      16,
      700,
      theme.text,
      'text-anchor="end"',
    );
    content += text(
      24,
      top + 139,
      ratingTotal ? `${formatNumber(ratingTotal)} ${t.reviews}` : t.noReviews,
      11,
    );
  }
  const border = opts.hideBorder
    ? ""
    : `stroke="${theme.border}" stroke-width="1"`;
  const description = [...rows, rating]
    .map((row) => `${row.label}: ${row.exact}`)
    .join(", ");
  return `<svg width="420" height="${height}" viewBox="0 0 420 ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="card-title card-description">
  <title id="card-title">${escapeXml(title)}</title>
  <desc id="card-description">${escapeXml(description)}</desc>
  <rect x="0.5" y="0.5" rx="12" width="419" height="${height - 1}" fill="${theme.bg}" ${border}/>
  <g font-family="'Segoe UI', Ubuntu, Sans-Serif">
  ${opts.hideTitle ? "" : `<rect x="24" y="23" width="4" height="22" rx="2" fill="${theme.title}"/>${text(38, 40, shortTitle(title), 16, 600, theme.title)}`}
  ${content}
  </g>
</svg>`;
}
