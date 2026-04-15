const express = require("express");
const app = express();

let keys = {}; // database (use real DB later)

function generateKey() {
  return "NINJA-" + Math.floor(Math.random() * 1000000);
}

// Generate Key
app.get("/generate", (req, res) => {
  const key = generateKey();

  keys[key] = {
    used: false,
    expiry: Date.now() + 24 * 60 * 60 * 1000
  };

  res.json({ key });
});

// Verify Key
app.get("/verify", (req, res) => {
  const key = req.query.key;

  if (!keys[key]) return res.json({ valid: false });

  const data = keys[key];

  if (Date.now() > data.expiry) {
    return res.json({ valid: false, reason: "expired" });
  }

  if (data.used) {
    return res.json({ valid: false, reason: "used" });
  }

  // mark as used
  data.used = true;

  res.json({ valid: true });
});

app.listen(3000, () => console.log("Server running"));
