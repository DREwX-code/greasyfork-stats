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
  assert.match(card, /stop-color="#fffefe"/);
  assert.match(card, /stroke="#e4e2e2" stroke-width="1"/);
  assert.match(card, /1\.3k/);
  assert.doesNotMatch(card, />Rating</);
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

  assert.match(card, />Note</);
  assert.match(card, />80%</);
  assert.match(card, /Installations totales/);
  assert.match(card, /stop-color="#0d1117"/);
  assert.doesNotMatch(card, /<rect x="24" y="23"/);
  assert.doesNotMatch(card, /stroke="#30363d" stroke-width="1"/);
});
