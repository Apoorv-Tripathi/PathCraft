const express = require("express");
const {
  getCareerGoals,
  getCareerGoalById,
  createCareerGoal,
  updateCareerGoal,
  deleteCareerGoal,
} = require("../controllers/careerGoalController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getCareerGoals);
router.get("/:id", protect, getCareerGoalById);

router.post("/", protect, restrictTo("admin"), createCareerGoal);
router.put("/:id", protect, restrictTo("admin"), updateCareerGoal);
router.delete("/:id", protect, restrictTo("admin"), deleteCareerGoal);

module.exports = router;