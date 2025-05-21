const express = require("express");
const router = express.Router();
const File = require("../models/File");
const authenticateToken = require("../middleware/auth");

// Save a new file
router.post("/save", authenticateToken, async (req, res) => {
  const { name, code, language } = req.body;

  if (!name || !code || !language) {
    return res.status(400).json({ msg: "Missing required fields" });
  }

  try {
    const newFile = new File({
      user: req.user.id,
      name,
      code,
      language,
    });

    await newFile.save();
    res.status(201).json({ msg: "File saved successfully", file: newFile });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// Get all files for the logged-in user
router.get("/my-files", authenticateToken, async (req, res) => {
  try {
    const files = await File.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(files);
  } catch (err) {
    res.status(500).json({ msg: "Failed to load files", error: err.message });
  }
});

// Get one file by ID (for loading into editor)
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const file = await File.findOne({ _id: req.params.id, user: req.user.id });

    if (!file) {
      return res.status(404).json({ msg: "File not found" });
    }

    res.json(file);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching file", error: err.message });
  }
});

module.exports = router;
