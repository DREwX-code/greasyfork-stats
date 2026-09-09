import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import statsHandler from "../api/stats.js";

const root = new URL("../", import.meta.url);
const files = new Map([
  ["/", ["index.html", "text/html; charset=utf-8"]],
  ["/index.html", ["index.html", "text/html; charset=utf-8"]],
  ["/assets/app.css", ["assets/app.css", "text/css; charset=utf-8"]],
  ["/assets/app.js", ["assets/app.js", "text/javascript; charset=utf-8"]],
  ["/assets/logo.png", ["assets/logo.png", "image/png"]],
  ...["card", "themes", "i18n", "stats"].map((name) => [
    `/lib/${name}.js`,
    [`lib/${name}.js`, "text/javascript; charset=utf-8"],
  ]),
]);

export function createDevServer() {
  return createServer(async (req, res) => {
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("X-Content-Type-Options", "nosniff");
    try {
      const url = new URL(req.url, "http://localhost");
      if (url.pathname === "/api/stats" || url.pathname === "/api") {
        req.query = Object.create(null);
        for (const key of new Set(url.searchParams.keys())) {
          const values = url.searchParams.getAll(key);
          req.query[key] = values.length === 1 ? values[0] : values;
        }
        res.status = (code) => {
          res.statusCode = code;
          return res;
        };
        res.send = (body) => {
          // Always show edits immediately in development, including API output.
          res.setHeader("Cache-Control", "no-store");
          res.end(req.method === "HEAD" ? undefined : body);
          return res;
        };
        await statsHandler(req, res);
        return;
      }
      if (req.method !== "GET" && req.method !== "HEAD") {
        res.writeHead(405, { Allow: "GET, HEAD" });
        res.end();
        return;
      }
      const file = files.get(url.pathname);
      if (!file) {
        res.writeHead(404);
        res.end(req.method === "HEAD" ? undefined : "Not found");
        return;
      }
      const content = await readFile(new URL(file[0], root));
      res.writeHead(200, { "Content-Type": file[1] });
      res.end(req.method === "HEAD" ? undefined : content);
    } catch (error) {
      console.error("Local server error:", error);
      if (!res.headersSent) res.writeHead(500);
      res.end();
    }
  });
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const port = Number(process.env.PORT || 3000);
  const server = createDevServer();
  server.on("error", (error) => {
    console.error(
      error.code === "EADDRINUSE"
        ? `Port ${port} is busy. Try: PORT=${port + 1} npm run dev`
        : error.message,
    );
    process.exitCode = 1;
  });
  server.listen(port, "127.0.0.1", () => {
    console.log(`GreasyFork Stats: http://127.0.0.1:${server.address().port}`);
    console.log("Refresh your browser after edits. Press Ctrl+C to stop.");
  });
}
