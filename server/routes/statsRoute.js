const express = require("express");
const router = express.Router();
const { getStats } = require("../controllers/statsController");
const { protect } = require("../middleware/authMiddleware");

router.get("/stats", getStats);

module.exports = router;
