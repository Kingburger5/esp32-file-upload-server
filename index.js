const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");

const UPLOAD_DIR = path.join(__dirname, "uploads");

// Ensure uploads directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
}

app.use(express.raw({ type: "*/*", limit: "10mb" }));

// Test endpoint
app.get("/", (req, res) => {
  res.send("Server is running. Use POST /upload_chunk to upload files.");
});

// Upload chunk endpoint
app.post("/upload_chunk", (req, res) => {
  const filename = req.query.filename;
  const part = req.query.part;

  if (!filename || !part) {
    return res.status(400).send("Missing filename or part query parameter.");
  }

  const filepath = path.join(UPLOAD_DIR, filename);

  // Append chunk data to file
  fs.appendFile(filepath, req.body, (err) => {
    if (err) {
      console.error("Failed to write chunk:", err);
      return res.status(500).send("Failed to save chunk.");
    }
    console.log(`Saved chunk ${part} for file ${filename}`);
    res.send(`Chunk ${part} saved.`);
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
