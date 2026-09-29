// Minimal static server: `npm run dev` (forwards CLI host/port args to the listener)
const http = require("http");
const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
function argValue(names, dflt) {
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    for (const n of names) {
      if (a === n && args[i + 1]) return args[i + 1];
      if (a.startsWith(n + "=")) return a.split("=")[1];
    }
  }
  return dflt;
}
const host = argValue(["--host", "-H"], "127.0.0.1");
const port = parseInt(argValue(["--port", "-p"], "7100"), 10);
const root = __dirname;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".mp4": "video/mp4",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

http
  .createServer((req, res) => {
    let urlPath = decodeURIComponent(req.url.split("?")[0]);
    if (urlPath === "/") urlPath = "/index.html";
    const file = path.join(root, path.normalize(urlPath));
    if (!file.startsWith(root)) {
      res.writeHead(403);
      return res.end("Forbidden");
    }
    fs.readFile(file, (err, data) => {
      if (err) {
        res.writeHead(404);
        return res.end("Not found");
      }
      res.writeHead(200, { "Content-Type": MIME[path.extname(file).toLowerCase()] || "application/octet-stream" });
      res.end(data);
    });
  })
  .listen(port, host, () => console.log(`JUST BUILD AI Demo 網上版 → http://${host}:${port}/`));
