const express = require('express');
const aiController = require("../controllers/ai.controller");

const router = express.Router();

// Allow both GET (query params) and POST (JSON body)
router.get("/get-review", aiController.getReview);
router.post("/get-review", aiController.getReview);

module.exports = router;
