const http = require("http");
const fs = require("fs");
const path = require("path");

// File path to persist data
const itemsFilePath = path.join(__dirname, "items.json");

// To read items from the file
const readItems = () => {
  try {
    const data = fs.readFileSync(itemsFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// To write items to the file
const writeItems = (items) => {
  fs.writeFileSync(itemsFilePath, JSON.stringify(items, null, 2), "utf-8");
};

// Create a new item
const createItem = (name, price, size) => {
  const items = readItems();
  const id = Date.now().toString();
  const newItem = { id, name, price, size };
  items.push(newItem);
  writeItems(items);
  return newItem;
};

// Get all items
const getItems = () => {
  console.log("getItems");
  return readItems();
};

// Get one item by ID
const getItem = (id) => {
  const items = readItems();
  return items.find((item) => item.id === id);
};

// Update an item by ID
const updateItem = (id, name, price, size) => {
  const items = readItems();
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return null;

  const updatedItem = { id, name, price, size };
  items[index] = updatedItem;
  writeItems(items);
  return updatedItem;
};

// Delete an item by ID
const deleteItem = (id) => {
  const items = readItems();
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return null;

  const deletedItem = items.splice(index, 1);
  writeItems(items);
  return deletedItem[0];
};

// Create an HTTP server for the API
const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;

  res.setHeader("Content-Type", "application/json");

  if (url === "/api/items" && method === "GET") {
    const items = getItems();
    res.statusCode = 200;
    res.end(JSON.stringify({ status: "success", data: items }));
  } else if (url === "/api/item" && method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      const { name, price, size } = JSON.parse(body);
      if (!name || !price || !size) {
        res.statusCode = 400;
        return res.end(
          JSON.stringify({ status: "error", message: "Missing fields" })
        );
      }
      const newItem = createItem(name, price, size);
      res.statusCode = 201;
      res.end(JSON.stringify({ status: "success", data: newItem }));
    });
  } else if (url.match(/^\/api\/item\/[0-9]+$/) && method === "GET") {
    const id = url.split("/")[3];
    const item = getItem(id);
    if (!item) {
      res.statusCode = 404;
      return res.end(
        JSON.stringify({ status: "error", message: "Item not found" })
      );
    }
    res.statusCode = 200;
    res.end(JSON.stringify({ status: "success", data: item }));
  } else if (url.match(/^\/api\/item\/[0-9]+$/) && method === "PUT") {
    const id = url.split("/")[3];
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      const { name, price, size } = JSON.parse(body);
      if (!name || !price || !size) {
        res.statusCode = 400;
        return res.end(
          JSON.stringify({ status: "error", message: "Missing fields" })
        );
      }
      const updatedItem = updateItem(id, name, price, size);
      if (!updatedItem) {
        res.statusCode = 404;
        return res.end(
          JSON.stringify({ status: "error", message: "Item not found" })
        );
      }
      res.statusCode = 200;
      res.end(JSON.stringify({ status: "success", data: updatedItem }));
    });
  } else if (url.match(/^\/api\/item\/[0-9]+$/) && method === "DELETE") {
    const id = url.split("/")[3];
    const deletedItem = deleteItem(id);
    if (!deletedItem) {
      res.statusCode = 404;
      return res.end(
        JSON.stringify({ status: "error", message: "Item not found" })
      );
    }
    res.statusCode = 200;
    res.end(JSON.stringify({ status: "success", data: deletedItem }));
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ status: "error", message: "Not found" }));
  }
});

// Start the server
//server.listen(3000, () => {
//console.log('API server is running on http://localhost:3000');
//});
