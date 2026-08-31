const express = require("express");
const {
  getAssessments,
  getAssessmentById,
  createAssessment,
  submitAssessment,
  getMyResults,
} = require("../controllers/assessmentController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/results/me", protect, getMyResults);

router.get("/", protect, getAssessments);
router.get("/:id", protect, getAssessmentById);
router.post("/", protect, restrictTo("admin"), createAssessment);
router.post("/:id/submit", protect, submitAssessment);

module.exports = router;