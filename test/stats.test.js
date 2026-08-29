import assert from "node:assert/strict";
import test from "node:test";

import handler from "../api/stats.js";

const SUCCESS_CACHE =
  "public, max-age=21600, s-maxage=21600, stale-while-revalidate=86400";

function response({ status = 200, json } = {}) {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText: "Test response",
    headers: new Headers({ "content-type": "application/json" }),
    json: async () => json,
    text: async () => "",
  };
}

function createResponse() {
  const headers = new Map();

  return {
    body: undefined,
    statusCode: undefined,
    headers,
    setHeader(name, value) {
      headers.set(name, value);
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    send(body) {
      this.body = body;
      return this;
    },
  };
}

function successfulPayload() {
  return {
    name: "Alice",
    scripts: [
      {
        total_installs: 1_250,
        daily_installs: 12,
        good_ratings: 8,
        ok_ratings: 1,
        bad_ratings: 1,
      },
    ],
  };
}

test("handler returns SVG response headers and six-hour caching for GET", async (t) => {
  t.mock.method(globalThis, "fetch", async () =>
    response({ json: successfulPayload() }),
  );
  const res = createResponse();

  await handler({ method: "GET", query: { user: "1259433" } }, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.headers.get("Content-Type"), "image/svg+xml; charset=utf-8");
  assert.equal(res.headers.get("X-Content-Type-Options"), "nosniff");
  assert.equal(res.headers.get("Cache-Control"), SUCCESS_CACHE);
  assert.match(res.body, /Alice&apos;s Userscript Stats/);
  assert.match(res.body, />1\.3k</);
  assert.match(res.body, />12</);
  assert.match(res.body, />80%</);
});

test("handler omits the body for successful HEAD responses", async (t) => {
  t.mock.method(globalThis, "fetch", async () =>
    response({ json: successfulPayload() }),
  );
  const res = createResponse();

  await handler({ method: "HEAD", query: { user: "1259433" } }, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body, "");
  assert.equal(res.headers.get("Cache-Control"), SUCCESS_CACHE);
});

test("handler rejects unsupported methods and missing users", async () => {
  const methodRes = createResponse();
  await handler({ method: "POST", query: {} }, methodRes);

  assert.equal(methodRes.statusCode, 405);
  assert.equal(methodRes.headers.get("Allow"), "GET, HEAD");
  assert.equal(methodRes.headers.get("Cache-Control"), "no-store");

  const userRes = createResponse();
  await handler({ method: "GET", query: {} }, userRes);

  assert.equal(userRes.statusCode, 400);
  assert.equal(userRes.headers.get("Cache-Control"), "no-store");
});

test("handler maps upstream not-found results to a five-minute cache", async (t) => {
  t.mock.method(globalThis, "fetch", async () => response({ status: 404 }));
  const res = createResponse();

  await handler({ method: "GET", query: { user: "1259433" } }, res);

  assert.equal(res.statusCode, 404);
  assert.equal(
    res.headers.get("Cache-Control"),
    "public, max-age=300, s-maxage=300",
  );
});
