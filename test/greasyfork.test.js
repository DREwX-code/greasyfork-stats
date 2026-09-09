import assert from "node:assert/strict";
import test from "node:test";

import { GreasyForkError, getUserStats } from "../lib/greasyfork.js";

function response({ status = 200, json, text = "" } = {}) {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText: "Test response",
    headers: new Headers({ "content-type": "application/json" }),
    json: async () => json,
    text: async () => text,
  };
}

async function expectStatus(operation, status) {
  await assert.rejects(operation, (error) => {
    assert.ok(error instanceof GreasyForkError);
    assert.equal(error.status, status);
    return true;
  });
}

test("getUserStats rejects empty users without fetching", async (t) => {
  const fetch = t.mock.fn();
  t.mock.method(globalThis, "fetch", fetch);

  await expectStatus(() => getUserStats("   "), 400);
  assert.equal(fetch.mock.callCount(), 0);
});

test("getUserStats filters invalid scripts and aggregates string and numeric fields", async (t) => {
  t.mock.method(globalThis, "fetch", async () =>
    response({
      json: {
        name: "Alice",
        scripts: [
          {
            total_installs: "1250",
            daily_installs: 12,
            good_ratings: "8",
            ok_ratings: 1,
            bad_ratings: "1",
          },
          {
            total_installs: 10,
            daily_installs: "2",
            good_ratings: 2,
            ok_ratings: "3",
            bad_ratings: 0,
          },
          null,
          "not a script",
        ],
      },
    }),
  );

  assert.deepEqual(await getUserStats("1259433"), {
    username: "Alice",
    totalInstalls: 1_260,
    dailyInstalls: 14,
    scriptCount: 2,
    goodRatings: 10,
    okRatings: 4,
    badRatings: 1,
  });
});

test("getUserStats returns zero statistics for an existing profile without scripts", async (t) => {
  t.mock.method(globalThis, "fetch", async () =>
    response({ json: { scripts: [] } }),
  );

  const stats = await getUserStats("Alice");
  assert.equal(stats.scriptCount, 0);
  assert.equal(stats.totalInstalls, 0);
});

test("getUserStats preserves upstream 404 and 429 statuses", async (t) => {
  let status = 404;
  t.mock.method(globalThis, "fetch", async () => response({ status }));

  await expectStatus(() => getUserStats("Alice"), 404);
  status = 429;
  await expectStatus(() => getUserStats("Alice"), 429);
});

test("getUserStats maps invalid upstream JSON and response shapes to 502", async (t) => {
  let invalidJson = true;
  t.mock.method(globalThis, "fetch", async () => {
    if (invalidJson) {
      return {
        ...response(),
        json: async () => {
          throw new SyntaxError("invalid JSON");
        },
      };
    }

    return response({ json: { name: "Alice" } });
  });

  await expectStatus(() => getUserStats("Alice"), 502);
  invalidJson = false;
  await expectStatus(() => getUserStats("Alice"), 502);
});

test("getUserStats maps network failures to 502", async (t) => {
  t.mock.method(globalThis, "fetch", async () => {
    throw new TypeError("network unavailable");
  });

  await expectStatus(() => getUserStats("Alice"), 502);
});

test("the request timeout also covers a stalled response body", async (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  t.mock.method(globalThis, "fetch", async (_url, { signal }) => ({
    ...response(),
    json: () =>
      new Promise((_resolve, reject) => {
        signal.addEventListener(
          "abort",
          () => reject(new DOMException("Aborted", "AbortError")),
          { once: true },
        );
      }),
  }));
  const result = getUserStats("1259433");
  await Promise.resolve();
  const rejected = expectStatus(() => result, 504);
  t.mock.timers.tick(8000);
  await rejected;
});
