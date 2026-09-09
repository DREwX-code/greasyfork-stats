import assert from "node:assert/strict";
import test from "node:test";
import { once } from "node:events";
import { createDevServer } from "../scripts/dev.js";

const localFetch = globalThis.fetch;

test("local server serves the builder and shared modules, and runs the real stats handler", async (t) => {
  t.mock.method(
    globalThis,
    "fetch",
    async () =>
      new Response(
        JSON.stringify({
          name: "Local test",
          scripts: [{ total_installs: 1250, daily_installs: 12 }],
        }),
        { headers: { "Content-Type": "application/json" } },
      ),
  );
  const server = createDevServer();
  t.after(
    () =>
      new Promise((resolve) => {
        server.close(resolve);
        server.closeAllConnections();
      }),
  );
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const base = `http://127.0.0.1:${server.address().port}`;
  for (const [path, type, content] of [
    ["/", "text/html", "assets/app.js"],
    ["/assets/app.js", "text/javascript", "renderStatsCard"],
    ["/assets/app.css", "text/css", ".theme-swatches"],
    ["/lib/card.js", "text/javascript", "renderStatsCard"],
    ["/api/stats?user=1&layout=grid", "image/svg+xml", "Local test"],
  ]) {
    const response = await localFetch(base + path);
    assert.equal(response.status, 200);
    assert.ok(response.headers.get("Content-Type").startsWith(type));
    assert.equal(response.headers.get("Cache-Control"), "no-store");
    assert.ok((await response.text()).includes(content));
  }
  const head = await localFetch(base + "/api?user=1", { method: "HEAD" });
  assert.equal(head.status, 200);
  assert.equal(await head.text(), "");
  assert.equal((await localFetch(base + "/api/stats")).status, 400);
  assert.equal((await localFetch(base + "/.git/config")).status, 404);
  assert.equal((await localFetch(base + "/package.json")).status, 404);
});
