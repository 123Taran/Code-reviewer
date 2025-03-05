const express = require('express');
const cors = require('cors');
const aiRoutes = require('./routes/ai.routes'); // Import ai.routes.js
const aiCompiler = require('./routes/ai.compiler'); // Import ai.compiler.js

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World');
});

// Use aiRoutes for /ai/get-review and aiCompiler for /ai/compiler
app.use('/ai', aiRoutes); // This will handle the /ai/get-review route
app.use('/ai/compiler', aiCompiler); // This will handle the /ai/compiler route

module.exports = app;
