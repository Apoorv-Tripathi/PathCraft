const { generateLearningPath, updateModuleProgress } = require("../services/learningPathService");
const { getNextRecommendation } = require("../services/recommendationService");
const LearningPath = require("../models/LearningPath");
const Profile = require("../models/Profile");

// @route GET /api/learning-path
// @desc  Get the logged-in user's personalized roadmap (generates if not existing)
async function getMyLearningPath(req, res, next) {
  try {
    let path = await LearningPath.findOne({ user: req.user._id }).populate("careerGoal", "title description");
    if (!path) {
      path = await generateLearningPath(req.user._id);
    }
    res.status(200).json({ success: true, data: path });
  } catch (err) {
    next(err);
  }
}

// @route POST /api/learning-path/generate
// @desc  Regenerate the learning roadmap
async function regeneratePath(req, res, next) {
  try {
    const { careerGoalId, forceAdaptive } = req.body;
    const path = await generateLearningPath(req.user._id, careerGoalId, forceAdaptive);
    res.status(200).json({ success: true, data: path });
  } catch (err) {
    next(err);
  }
}

// @route GET /api/learning-path/recommendation
// @desc  Phase 7: Get next best action recommendation
async function getRecommendation(req, res, next) {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    const goalId = profile && profile.careerGoal ? profile.careerGoal : null;
    const rec = await getNextRecommendation(req.user._id, goalId);
    res.status(200).json({ success: true, data: rec });
  } catch (err) {
    next(err);
  }
}

// @route PUT /api/learning-path/modules/:moduleId/progress
// @desc  Phase 9: Update progress of a specific module
async function updateProgress(req, res, next) {
  try {
    const { progress, status, quizScore } = req.body;
    const updated = await updateModuleProgress(req.user._id, req.params.moduleId, { progress, status, quizScore });
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getMyLearningPath,
  regeneratePath,
  getRecommendation,
  updateProgress,
};
