export class GreasyForkError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.name = "GreasyForkError";
    this.status = status;
  }
}

const GREASYFORK_BASE_URL = "https://greasyfork.org";

export async function getUserStats(user) {
  if (!user) {
    throw new GreasyForkError("Missing user parameter.", 400);
  }

  const scripts = await fetchUserScripts(user);

  if (!scripts.length) {
    throw new GreasyForkError("No public scripts found for this user.", 404);
  }

  return aggregateUserStats(user, scripts);
}

async function fetchUserScripts(user) {
  const url = `${GREASYFORK_BASE_URL}/en/users/${encodeURIComponent(user)}.json`;

  const response = await fetch(url, {
    headers: {
      "User-Agent": "greasyfork-stats",
      "Accept": "application/json",
    },
  });

  if (!response.ok) {
    throw new GreasyForkError(
      `Unable to fetch GreasyFork user data (${response.status}).`,
      response.status
    );
  }

  const data = await response.json();

  if (!Array.isArray(data.scripts)) {
    throw new GreasyForkError("Invalid GreasyFork response format.", 502);
  }

  return data.scripts;
}

function aggregateUserStats(user, scripts) {
  return {
    username: getUsername(user),
    totalInstalls: sum(scripts, "total_installs"),
    dailyInstalls: sum(scripts, "daily_installs"),
    scriptCount: scripts.length,
    goodRatings: sum(scripts, "good_ratings"),
    okRatings: sum(scripts, "ok_ratings"),
    badRatings: sum(scripts, "bad_ratings"),
  };
}

function sum(items, key) {
  return items.reduce((total, item) => total + (Number(item[key]) || 0), 0);
}

function getUsername(user) {
  return String(user).replace(/^\d+-?/, "") || "GreasyFork User";
}
