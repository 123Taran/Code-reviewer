const aiService = require("../services/ai.service");
const vm = require("vm");

module.exports.getReview = async (req, res) => {
    const code = req.body.code;

    if (!code) {
        return res.status(400).send("Code is required");
    }

    try {
        // Try to execute code in a sandboxed environment
        const sandbox = {};
        vm.createContext(sandbox); // create a context to run the code in isolation
        vm.runInContext(code, sandbox, { timeout: 1000 }); // 1 second max

        // If no error, code ran fine, no review needed
        return res.send({
            message: "✅ Code ran successfully. No errors found.",
            review: null
        });

    } catch (err) {
        // If code fails to run, generate review from AI
        try {
            const errorPrompt = `
The following code throws an error when executed. Please identify the reason for the error and suggest the correct version of the code. Only focus on fixing the error, do not comment on code quality or best practices.

❌ Code:
\`\`\`javascript
${code}
\`\`\`

💥 Error Message:
${err.message}

✅ Fix:
`;

            const response = await aiService(errorPrompt);

            res.send({
                message: "⚠️ Code has errors.",
                error: err.message,
                review: response
            });

        } catch (error) {
            console.error("Error generating review:", error);
            res.status(500).send("Internal Server Error");
        }
    }
};
