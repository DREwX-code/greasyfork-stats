export class GreasyForkError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.name = "GreasyForkError";
    this.status = status;
  }
}

const GREASYFORK_BASE_URL = "https://api.greasyfork.org";
const REQUEST_TIMEOUT_MS = 8_000;

export async function getUserStats(user) {
  const normalizedUser = String(user ?? "").trim();

  if (!normalizedUser) {
    throw new GreasyForkError("Missing user parameter.", 400);
  }

  const { username, scripts } = await fetchUserData(normalizedUser);

  if (scripts.length === 0) {
    throw new GreasyForkError("No public scripts found for this user.", 404);
  }

  return aggregateUserStats(username, scripts);
}

async function fetchUserData(user) {
  const url = `${GREASYFORK_BASE_URL}/en/users/${encodeURIComponent(user)}.json`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response;

  try {
    response = await fetch(url, {
      headers: {
        "User-Agent":
          "GreasyFork-Stats/1.0 (+https://github.com/DREwX-code/greasyfork-stats)",
        Accept: "application/json",
      },
      signal: controller.signal,
    });
  } catch (error) {
    if (error?.name === "AbortError") {
      throw new GreasyForkError("GreasyFork request timed out.", 504);
    }

    throw new GreasyForkError("Unable to reach GreasyFork.", 502);
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    const responseBody = await response.text().catch(() => "");

    console.error("GreasyFork request failed:", {
      url,
      status: response.status,
      statusText: response.statusText,
      contentType: response.headers.get("content-type"),
      body: responseBody.slice(0, 500),
    });

    const status =
      response.status === 404
        ? 404
        : response.status === 429
          ? 429
          : 502;

    throw new GreasyForkError(
      `Unable to fetch GreasyFork user data (${response.status}).`,
      status,
    );
  }

  let data;

  try {
    data = await response.json();
  } catch {
    throw new GreasyForkError(
      "GreasyFork returned an invalid JSON response.",
      502,
    );
  }

  if (!data || typeof data !== "object" || !Array.isArray(data.scripts)) {
    console.error("Unexpected GreasyFork response:", data);

    throw new GreasyForkError("Invalid GreasyFork response format.", 502);
  }

  return {
    username:
      data.name ||
      data.username ||
      data.display_name ||
      getUsernameFromParameter(user),
    scripts: data.scripts.filter(
      (script) => script && typeof script === "object",
    ),
  };
}

function aggregateUserStats(username, scripts) {
  return {
    username,
    totalInstalls: sum(scripts, "total_installs"),
    dailyInstalls: sum(scripts, "daily_installs"),
    scriptCount: scripts.length,
    goodRatings: sum(scripts, "good_ratings"),
    okRatings: sum(scripts, "ok_ratings"),
    badRatings: sum(scripts, "bad_ratings"),
  };
}

function sum(items, key) {
  return items.reduce((total, item) => {
    const value = Number(item[key]);
    return total + (Number.isFinite(value) && value > 0 ? value : 0);
  }, 0);
}

function getUsernameFromParameter(user) {
  const value = String(user).replace(/^\d+-?/, "").trim();
  return value || "GreasyFork User";
}
