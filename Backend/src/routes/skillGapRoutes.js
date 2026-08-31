const express = require("express");
const { getMySkillGap, getSkillGapForGoal } = require("../controllers/skillGapController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getMySkillGap);
router.get("/:careerGoalId", protect, getSkillGapForGoal);

module.exports = router;