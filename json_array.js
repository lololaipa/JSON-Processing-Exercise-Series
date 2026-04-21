const http = require("http");

const PORT = process.argv[2] || 3000;

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/json-array") {
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

      const { numbers } = parsed;

      if (!Array.isArray(numbers)) {
        res.statusCode = 422;
        return res.end();
      }

      const isValid = numbers.every((n) => typeof n === "number");

      if (!isValid) {
        res.statusCode = 422;
        return res.end();
      }

      const count = numbers.length;
      const sum = numbers.reduce((acc, n) => acc + n, 0);
      const average = count === 0 ? 0 : sum / count;

      const response = {
        count,
        sum,
        average,
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