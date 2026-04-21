const http = require("http");

const PORT = process.argv[2] || 3000;

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/json-object") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      if (!body) {
        res.statusCode = 422;
        return res.end();
      }

      let parsed;

      try {
        parsed = JSON.parse(body);
      } catch (e) {
        res.statusCode = 422;
        return res.end();
      }

      const { name, age } = parsed;

      if (typeof name !== "string" || typeof age !== "number") {
        res.statusCode = 422;
        return res.end();
      }

      const response = {
        greeting: "Hello " + name,
        isAdult: age >= 18,
      };

      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(response));
    });
  } else {
    res.statusCode = 404;
    res.end("Not Found");
  }
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});