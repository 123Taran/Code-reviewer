const aiService = require("../services/ai.service")


module.exports.getReview = async (req, res) => {
    const code = req.query.prompt || req.body.code; // Accept query param or body

    if (!code) {
        return res.status(400).send("Prompt is required");
    }

    const response = await aiService(code);
    res.send(response);
};
