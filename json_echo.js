const http = require("http");

const PORT = process.argv[2] || 3000;

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/json-echo") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      if (!body) {
        res.statusCode = 400;
        return res.end("Missing body");
      }

      try {
        const parsed = JSON.parse(body);

        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(parsed));
      } catch (err) {
        res.statusCode = 400;
        res.end("Invalid JSON");
      }
    });
  } else {
    res.statusCode = 404;
    res.end("Not Found");
  }
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});