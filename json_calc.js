const http = require("http");

const PORT = process.argv[2] || 3000;

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/json-calc") {
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

      const { a, b, operation } = parsed;

      if (
        typeof a !== "number" ||
        typeof b !== "number" ||
        typeof operation !== "string"
      ) {
        res.statusCode = 422;
        return res.end();
      }

      let result;

      switch (operation) {
        case "add":
          result = a + b;
          break;

        case "subtract":
          result = a - b;
          break;

        case "multiply":
          result = a * b;
          break;

        case "divide":
          if (b === 0) {
            res.statusCode = 400;
            return res.end();
          }
          result = a / b;
          break;

        default:
          res.statusCode = 400;
          return res.end();
      }

      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ result }));
    });
  } else {
    res.statusCode = 404;
    res.end("Not Found");
  }
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});