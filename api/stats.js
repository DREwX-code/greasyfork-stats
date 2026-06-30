import { renderStatsCard } from "../lib/card.js";

export default function handler(req, res) {
  const {
    theme = "default",
    lang = "en",
    hide_title = "false",
    hide_border = "false",
  } = req.query;

  const stats = {
    username: "Dℝ∃wX",
    totalInstalls: 12450,
    dailyInstalls: 84,
    scriptCount: 7,
    goodRatings: 42,
    okRatings: 3,
    badRatings: 1,
  };

  const svg = renderStatsCard(stats, {
    theme,
    lang,
    hideTitle: hide_title === "true",
    hideBorder: hide_border === "true",
  });

  res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.status(200).send(svg);
}
