const aiService = require("../services/ai.service");

module.exports.getReview = async (req, res) => {
    // For GET requests, use query parameter; for POST requests, use request body.
    const code = req.body.code;

    if (!code) {
        return res.status(400).send("Code is required");
    }

    try {
        const response = await aiService(code);
        res.send(response);
    } catch (error) {
        console.error("Error generating review:", error);
        res.status(500).send("Internal Server Error");
    }
};
