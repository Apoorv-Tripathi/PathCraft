const express = require("express");
const { askCoach } = require("../controllers/aiController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/coach", protect, askCoach);

module.exports = router;
