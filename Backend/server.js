const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 5000;
const FILE_PATH = "./data.txt";

app.use(cors());
app.use(bodyParser.json());

// Helper to read file
const readData = () => {
  if (!fs.existsSync(FILE_PATH)) {
    fs.writeFileSync(FILE_PATH, JSON.stringify([])); // Create empty file if doesn't exist
  }
  const data = fs.readFileSync(FILE_PATH, "utf-8");
  return JSON.parse(data);
};

// Helper to write file
const writeData = (data) => {
  fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
};

// Create item
app.post("/api/items", (req, res) => {
  const { name } = req.body;
  const items = readData();
  const newItem = { id: Date.now(), name };
  items.push(newItem);
  writeData(items);
  res.json(newItem);
});

// Get all items
app.get("/api/items", (req, res) => {
  const items = readData();
  res.json(items);
});

// Update item
app.put("/api/items/:id", (req, res) => {
  const { id } = req.params;
  const items = readData();

  const index = items.findIndex((item) => String(item.id) === String(id)); // 🔥 Type Safe Compare
  if (index === -1) {
    return res.status(404).json({ message: "Item not found" });
  }

  items[index].name = req.body.name;
  writeData(items);

  res.json(items[index]);
});

// Delete item
app.delete("/api/items/:id", (req, res) => {
  const { id } = req.params;
  let items = readData();

  const originalLength = items.length;
  items = items.filter((item) => String(item.id) !== String(id)); // 🔥 Type Safe Compare

  if (items.length === originalLength) {
    return res.status(404).json({ message: "Item not found" });
  }

  writeData(items);
  res.json({ message: "Item deleted" });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
