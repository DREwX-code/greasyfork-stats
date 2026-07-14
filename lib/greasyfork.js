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
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept": "application/json, text/plain;q=0.9, */*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
      "Accept-Encoding": "gzip, deflate, br",
      "Referer": "https://greasyfork.org/",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-origin",
      "Cache-Control": "no-cache",
      "Pragma": "no-cache",
    },
    redirect: "follow",
  });

  if (!response.ok) {
    const responseBody = await response.text();
    console.error("GreasyFork request failed:", {
      url,
      status: response.status,
      statusText: response.statusText,
      contentType: response.headers.get("content-type"),
      server: response.headers.get("server"),
      body: responseBody.slice(0, 1500),
    });
    throw new GreasyForkError(
      `Unable to fetch GreasyFork user data (${response.status}).`,
      response.status
    );
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new GreasyForkError(
      "GreasyFork returned an invalid JSON response.",
      502
    );
  }

  if (!Array.isArray(data.scripts)) {
    console.error("Unexpected GreasyFork response:", data);
    throw new GreasyForkError(
      "Invalid GreasyFork response format.",
      502
    );
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
