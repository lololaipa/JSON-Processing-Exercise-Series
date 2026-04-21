const http = require("http");

const PORT = process.argv[2] || 3000;

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/json-nested") {
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

      if (
        !parsed ||
        typeof parsed !== "object" ||
        !parsed.user ||
        typeof parsed.user !== "object" ||
        typeof parsed.user.name !== "string" ||
        !Array.isArray(parsed.user.roles)
      ) {
        res.statusCode = 422;
        return res.end();
      }

      const name = parsed.user.name;
      const roles = parsed.user.roles;

      const response = {
        name,
        roleCount: roles.length,
        isAdmin: roles.includes("admin"),
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