export function normalizeUser(value) {
  const input = String(value ?? "").trim();
  if (/^\d+(?:-[^\s/?#]+)?$/.test(input)) return input.match(/^\d+/)[0];
  try {
    const url = new URL(input);
    if (
      !["https:", "http:"].includes(url.protocol) ||
      url.hostname !== "greasyfork.org"
    )
      return "";
    return (
      url.pathname.match(
        /^\/(?:[a-z-]+\/)?users\/(\d+)(?:-[^/]*)?\/?$/i,
      )?.[1] || ""
    );
  } catch {
    return "";
  }
}

export function aggregateUserStats(data, fallbackName = "GreasyFork User") {
  if (!data || typeof data !== "object" || !Array.isArray(data.scripts)) {
    throw new Error("Invalid GreasyFork response format.");
  }
  const scripts = data.scripts.filter(
    (script) => script && typeof script === "object" && !Array.isArray(script),
  );
  const sum = (key) =>
    scripts.reduce((total, script) => {
      const value = Number(script[key]);
      return total + (Number.isFinite(value) && value > 0 ? value : 0);
    }, 0);
  return {
    username: String(
      data.name || data.username || data.display_name || fallbackName,
    ),
    totalInstalls: sum("total_installs"),
    dailyInstalls: sum("daily_installs"),
    scriptCount: scripts.length,
    goodRatings: sum("good_ratings"),
    okRatings: sum("ok_ratings"),
    badRatings: sum("bad_ratings"),
  };
}
