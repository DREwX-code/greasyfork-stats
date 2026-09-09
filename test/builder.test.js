import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";
import { themes } from "../lib/themes.js";
import { i18n as translations } from "../lib/i18n.js";
import { renderStatsCard } from "../lib/card.js";
import { aggregateUserStats, normalizeUser } from "../lib/stats.js";

// Exercise the actual browser controller with a small DOM adapter and controlled
// network responses. Layout and native browser behavior need separate visual QA.
async function builder() {
  const nodes = new Map();
  function element(value = "") {
    return {
      value,
      dataset: {},
      style: { setProperty() {} },
      checked: false,
      options: [],
      listeners: {},
      attributes: {},
      children: [],
      classList: { add() {}, remove() {} },
      setAttribute(name, value) {
        this.attributes[name] = value;
      },
      removeAttribute(name) {
        delete this.attributes[name];
      },
      addEventListener(name, listener) {
        this.listeners[name] = listener;
      },
      appendChild(child) {
        this.children.push(child);
      },
      querySelector() {
        return element();
      },
    };
  }
  const get = (selector) => {
    if (!nodes.has(selector)) nodes.set(selector, element());
    return nodes.get(selector);
  };
  for (const [id, values] of Object.entries({
    themeMenu: ["auto", "light", "dark"],
    languageMenu: ["en", "fr"],
    cardThemeMenu: Object.keys(themes),
    cardLanguageMenu: Object.keys(translations),
  })) {
    get(`#${id}`).options = values.map((value) => ({
      value,
      textContent: value,
    }));
  }
  get("#user").value = "1259433";
  get("#layoutMenu").value = "compact";
  const timers = new Map();
  let timerId = 0;
  const requests = [];
  const source = (
    await readFile(new URL("../assets/app.js", import.meta.url), "utf8")
  ).replace(/^import .*?;\n/gm, "");
  runInNewContext(source, {
    themes,
    translations,
    renderStatsCard,
    aggregateUserStats,
    normalizeUser,
    URL,
    URLSearchParams,
    AbortController,
    location: { origin: "https://example.test", pathname: "/", search: "" },
    localStorage: { getItem: () => null, setItem() {} },
    matchMedia: () => ({ matches: false }),
    document: {
      documentElement: element(),
      querySelector: get,
      querySelectorAll: () => [],
      createElement: () => element(),
    },
    setTimeout(fn, delay) {
      timers.set(++timerId, { fn, delay });
      return timerId;
    },
    clearTimeout(id) {
      timers.delete(id);
    },
    fetch(url) {
      return new Promise((resolve, reject) =>
        requests.push({ url, resolve, reject }),
      );
    },
  });
  const settle = () => new Promise((resolve) => setImmediate(resolve));
  return {
    get,
    requests,
    settle,
    input(value) {
      get("#user").value = value;
      get("#user").listeners.input();
    },
    debounce() {
      for (const [id, timer] of timers) {
        if (timer.delay === 650) {
          timers.delete(id);
          timer.fn();
        }
      }
    },
    async success(index, name, installs = 10) {
      requests[index].resolve({
        ok: true,
        json: async () => ({ name, scripts: [{ total_installs: installs }] }),
      });
      await settle();
    },
  };
}

test("editing or clearing a profile removes old statistics and disables export immediately", async () => {
  const app = await builder();
  await app.success(0, "Alice");
  assert.equal(app.get("#copyButton").disabled, false);
  app.input("");
  assert.equal(app.get("#userStatus").dataset.state, "idle");
  assert.equal(app.get("#copyButton").disabled, true);
  assert.equal(app.get("#downloadButton").disabled, true);
  assert.doesNotMatch(app.get("#code-output").textContent, /1259433/);
  app.debounce();
  assert.equal(app.requests.length, 1);
});

test("late responses cannot replace the latest profile, even when abort is ignored", async () => {
  const app = await builder();
  app.input("42");
  app.debounce();
  await app.success(1, "Latest profile", 900);
  await app.success(0, "Old profile", 1);
  assert.match(app.get("#userStatus").textContent, /Latest profile/);
  assert.match(app.get("#preview-stage").innerHTML, />900</);
  assert.match(app.get("#code-output").textContent, /user=42/);
});

test("failed profile requests keep export unavailable and expose retry", async () => {
  const app = await builder();
  await app.success(0, "Alice");
  app.input("42");
  app.debounce();
  app.requests[1].reject(new Error("offline"));
  await app.settle();
  assert.equal(app.get("#userStatus").dataset.state, "error");
  assert.equal(app.get("#copyButton").disabled, true);
  assert.equal(app.get("#retryButton").hidden, false);
  app.get("#retryButton").listeners.click();
  await app.success(2, "Recovered");
  assert.equal(app.get("#copyButton").disabled, false);
  assert.match(app.get("#userStatus").textContent, /Recovered/);
});
