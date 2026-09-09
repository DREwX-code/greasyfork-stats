import assert from "node:assert/strict";
import test from "node:test";

import { escapeXml, formatNumber, renderStatsCard } from "../lib/card.js";

test("escapeXml escapes every XML metacharacter", () => {
  assert.equal(escapeXml(`&<>"'`), "&amp;&lt;&gt;&quot;&apos;");
});

test("formatNumber normalizes invalid values and abbreviates boundaries", () => {
  assert.equal(formatNumber("invalid"), "0");
  assert.equal(formatNumber(-1), "0");
  assert.equal(formatNumber(999), "999");
  assert.equal(formatNumber(1_000), "1k");
  assert.equal(formatNumber(1_000_000), "1M");
});

test("renderStatsCard escapes names and falls back to English and default theme", () => {
  const card = renderStatsCard(
    {
      username: `<Alice & "Bob">'`,
      totalInstalls: 1_250,
      dailyInstalls: 12,
      scriptCount: 2,
    },
    { theme: "missing", lang: "missing" },
  );

  assert.match(
    card,
    /&lt;Alice &amp; &quot;Bob&quot;&gt;&apos;&apos;s Userscript Stats/,
  );
  assert.match(card, /Total Installs/);
  assert.match(card, /fill="#fffefe"/);
  assert.match(card, /stroke="#e4e2e2" stroke-width="1"/);
  assert.match(card, /1\.3k/);
  assert.match(card, /No reviews yet/);
});

test("renderStatsCard includes ratings and honors title and border options", () => {
  const card = renderStatsCard(
    {
      username: "Alice",
      totalInstalls: 1,
      dailyInstalls: 2,
      scriptCount: 3,
      goodRatings: 8,
      okRatings: 1,
      badRatings: 1,
    },
    { lang: "fr", theme: "github_dark", hideTitle: true, hideBorder: true },
  );

  assert.match(card, />Avis positifs</);
  assert.match(card, />80%</);
  assert.match(card, /Installations totales/);
  assert.match(card, /fill="#0d1117"/);
  assert.doesNotMatch(card, /<rect x="24" y="23"/);
  assert.doesNotMatch(card, /stroke="#30363d" stroke-width="1"/);
});

test("cards retain accessible full titles and exact numbers while truncating the visible heading", () => {
  const name = "A very long name ".repeat(10);
  const card = renderStatsCard({ username: name, totalInstalls: 999_999 });
  assert.match(card, new RegExp(`<title id="card-title">${name}`));
  assert.match(card, /…<\/text>/);
  assert.match(card, /Total Installs: 999999/);
  assert.match(card, />1M</);
});

test("both layouts shrink when their title is hidden and show rating sample sizes", () => {
  for (const layout of ["compact", "grid"]) {
    const stats = { goodRatings: 8, okRatings: 1, badRatings: 1 };
    const full = renderStatsCard(stats, { layout });
    const compact = renderStatsCard(stats, { layout, hideTitle: true });
    const height = (svg) => Number(svg.match(/height="(\d+)"/)[1]);
    assert.ok(height(compact) < height(full));
    assert.match(full, /80%/);
    assert.match(full, /10 reviews/);
  }
});

test("inherited theme and language names fall back safely", () => {
  for (const value of ["constructor", "__proto__", "toString"]) {
    const card = renderStatsCard({}, { theme: value, lang: value });
    assert.match(card, /fill="#fffefe"/);
    assert.match(card, /Total Installs/);
    assert.doesNotMatch(card, /undefined/);
  }
});
