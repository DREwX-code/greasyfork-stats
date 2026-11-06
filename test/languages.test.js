import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { runInNewContext } from "node:vm";
import test from "node:test";
import { i18n } from "../lib/i18n.js";
import { renderStatsCard } from "../lib/card.js";

const languages = [
  "en",
  "fr",
  "es",
  "pt",
  "zh",
  "hi",
  "de",
  "it",
  "ja",
  "ko",
  "nl",
  "pl",
  "ru",
  "tr",
  "uk",
  "id",
];
const flags = [
  "gb",
  "fr",
  "es",
  "pt",
  "cn",
  "in",
  "de",
  "it",
  "jp",
  "kr",
  "nl",
  "pl",
  "ru",
  "tr",
  "ua",
  "id",
];

test("all languages have complete interface and card translations and local flags", async () => {
  const source = await readFile(
    new URL("../assets/app.js", import.meta.url),
    "utf8",
  );
  const start = source.indexOf("const interfaceStrings =");
  const end = source.indexOf("const form =", start);
  const strings = runInNewContext(
    `${source.slice(start, end)}\ninterfaceStrings;`,
  );
  const html = await readFile(
    new URL("../index.html", import.meta.url),
    "utf8",
  );
  const interfaceOptions = html.match(/id="languageMenu"[\s\S]*?<\/select>/)[0];
  const cardOptions = html.match(/id="cardLanguageMenu"[\s\S]*?<\/select>/)[0];
  assert.deepEqual(Object.keys(i18n).sort(), [...languages].sort());
  assert.deepEqual(Object.keys(strings).sort(), [...languages].sort());
  for (const [index, lang] of languages.entries()) {
    assert.match(interfaceOptions, new RegExp(`value="${lang}"`));
    assert.match(cardOptions, new RegExp(`value="${lang}"`));
    await access(
      new URL(`../assets/flags/${flags[index]}.svg`, import.meta.url),
    );
    for (const key of Object.keys(strings.en)) {
      assert.equal(
        typeof strings[lang][key],
        typeof strings.en[key],
        `${lang}: ${key}`,
      );
      if (typeof strings[lang][key] === "string")
        assert.ok(strings[lang][key], `${lang}: ${key}`);
    }
    for (const key of Object.keys(i18n.en)) {
      assert.equal(
        typeof i18n[lang][key],
        typeof i18n.en[key],
        `${lang}: ${key}`,
      );
    }
    const card = renderStatsCard(
      { username: "Test", totalInstalls: 100 },
      { lang },
    );
    assert.ok(card.includes(i18n[lang].totalInstalls), lang);
    assert.doesNotMatch(card, /undefined/);
  }
});
