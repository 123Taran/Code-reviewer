// ai.compiler.js
const express = require('express');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();

// Judge0 API Details
const JUDGE0_API_URL = "https://judge0-ce.p.rapidapi.com/submissions";
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY;

// Handle POST request for compiling and executing code
router.post('/execute', async (req, res) => {
    const { language_id, source_code, stdin } = req.body;

    if (!language_id || !source_code) {
        return res.status(400).json({ error: "Missing language or source code" });
    }

    try {
        const response = await axios.post(
            `${JUDGE0_API_URL}?base64_encoded=false&wait=true`,
            { source_code, language_id, stdin },
            {
                headers: {
                    "X-RapidAPI-Key": JUDGE0_API_KEY,
                    "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
                    "Content-Type": "application/json"
                }
            }
        );
        res.json(response.data);
    } catch (error) {
        console.error("Execution error:", error.message);
        res.status(500).json({ error: "Code execution failed" });
    }
});

module.exports = router;
