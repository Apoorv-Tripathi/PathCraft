const express = require("express");
const {
  getSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill,
} = require("../controllers/skillController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

const router = express.Router();

// Public reads (any logged-in learner needs to browse skills)
router.get("/", protect, getSkills);
router.get("/:id", protect, getSkillById);

// Admin-only writes
router.post("/", protect, restrictTo("admin"), createSkill);
router.put("/:id", protect, restrictTo("admin"), updateSkill);
router.delete("/:id", protect, restrictTo("admin"), deleteSkill);

module.exports = router;