const http = require("http");
const fs = require("fs");
const path = require("path");

// Create a simple HTTP server
const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === "/" || url === "/index.html") {
    // Serve the index.html
    fs.readFile(
      path.join(__dirname, "public", "index.html"),
      "utf-8",
      (err, data) => {
        if (err) {
          res.statusCode = 500;
          res.end("Error reading the index.html file.");
          return;
        }
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        res.end(data);
      }
    );
  } else if (url.endsWith(".html")) {
    // Return 404 for any random .html file
    fs.readFile(
      path.join(__dirname, "public", "404.html"),
      "utf-8",
      (err, data) => {
        if (err) {
          res.statusCode = 500;
          res.end("Error reading the 404.html file.");
          return;
        }
        res.statusCode = 404;
        res.setHeader("Content-Type", "text/html");
        res.end(data);
      }
    );
  } else {
    res.statusCode = 404;
    res.end("page not found.");
  }
});

// Start the server on port 5500
server.listen(5500, () => {
  console.log("Server is running at http://localhost:5500");
});
