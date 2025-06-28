const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 80;

// Parse all incoming POST data as raw binary
app.use(express.raw({ type: "*/*", limit: "10mb" }));

const UPLOAD_DIR = path.join(__dirname, "uploads");

// Create uploads folder if missing
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
  console.log("Created uploads directory");
}

app.post("/upload_chunk", (req, res) => {
  const filename = req.query.filename;
  const part = req.query.part;

  if (!filename || !part) {
    return res.status(400).send("Missing filename or part query parameters");
  }

  const filePath = path.join(UPLOAD_DIR, filename);

  // Append chunk data to the file
  fs.appendFile(filePath, req.body, (err) => {
    if (err) {
      console.error("Error saving chunk:", err);
      return res.status(500).send("Failed to save chunk");
    }

    console.log(`Saved chunk part ${part} for file ${filename} (${req.body.length} bytes)`);

    res.send("Chunk saved");
  });
});

// Simple test route to check server status
app.get("/", (req, res) => {
  res.send("ESP32 Chunk Upload Server running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
