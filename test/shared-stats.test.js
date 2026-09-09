import assert from "node:assert/strict";
import test from "node:test";
import { normalizeUser, aggregateUserStats } from "../lib/stats.js";

test("profile normalization accepts IDs and genuine localized profile URLs", () => {
  for (const value of [
    " 1259433 ",
    "1259433-name",
    "https://greasyfork.org/fr/users/1259433-name",
    "https://greasyfork.org/users/1259433?tab=scripts",
  ]) {
    assert.equal(normalizeUser(value), "1259433");
  }
  for (const value of [
    "",
    "abc",
    "123abc",
    "https://evil.test/greasyfork.org/users/123",
    "https://greasyfork.org.evil.test/users/123",
    "https://greasyfork.org/users/123/scripts",
  ]) {
    assert.equal(normalizeUser(value), "");
  }
});

test("shared aggregation rejects malformed payloads and tolerates invalid script entries", () => {
  assert.throws(() => aggregateUserStats({ name: "Alice" }));
  const stats = aggregateUserStats({
    display_name: "Alice",
    scripts: [
      null,
      [],
      "bad",
      { total_installs: "12", daily_installs: -2 },
      { total_installs: 3, daily_installs: "NaN" },
    ],
  });
  assert.equal(stats.username, "Alice");
  assert.equal(stats.totalInstalls, 15);
  assert.equal(stats.dailyInstalls, 0);
  assert.equal(stats.scriptCount, 2);
});
