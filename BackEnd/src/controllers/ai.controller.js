const aiService = require("../services/ai.service");

module.exports.getReview = async (req, res) => {
    const { code, language, errorMessage } = req.body;

    if (!code) {
        return res.status(400).send("Code is required");
    }

    // Basic check for natural language input
    const isLikelyCode = /function|let|const|var|=>|;|{|}|\(|\)|def|class|int|print/.test(code);

    if (!isLikelyCode) {
        return res.send({
            message: "👋 I’m your code reviewer. Please provide valid code for me to review.",
            review: null
        });
    }

    // If there's no error, assume code ran successfully
    if (!errorMessage) {
        return res.send({
            message: "✅ Code ran successfully. No errors found.",
            review: null
        });
    }

    // Use AI to review the code and error
    try {
        const prompt = `
The following ${language} code throws an error when executed. Identify the issue and suggest the corrected version. Only focus on fixing the error.

❌ Code:
\`\`\`${language.toLowerCase()}
${code}
\`\`\`

💥 Error Message:
${errorMessage}

✅ Fix:
`;

        const response = await aiService(prompt);

        res.send({
            message: "⚠️ Code has errors.",
            error: errorMessage,
            review: response
        });
    } catch (error) {
        console.error("AI Review Error:", error);
        res.status(500).send("Internal Server Error");
    }
};
