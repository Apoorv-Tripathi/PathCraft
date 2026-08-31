const express = require("express");
const {
  getMyLearningPath,
  regeneratePath,
  getRecommendation,
  updateProgress,
} = require("../controllers/learningPathController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getMyLearningPath);
router.get("/recommendation", protect, getRecommendation);
router.post("/generate", protect, regeneratePath);
router.put("/modules/:moduleId/progress", protect, updateProgress);

module.exports = router;
