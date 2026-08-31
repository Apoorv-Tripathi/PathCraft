const { analyzeSkillGap } = require("../services/skillGapService");
const Profile = require("../models/Profile");

// @route GET /api/skill-gap
// @desc  Analyze skill gap for the logged-in user's own career goal (from their profile)
async function getMySkillGap(req, res, next) {
  try {
    const profile = await Profile.findOne({ user: req.user._id });

    if (!profile || !profile.careerGoal) {
      return res.status(400).json({
        success: false,
        message: "Set a career goal on your profile before requesting a skill gap analysis",
      });
    }

    const result = await analyzeSkillGap(req.user._id, profile.careerGoal);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

// @route GET /api/skill-gap/:careerGoalId
// @desc  Analyze skill gap for the logged-in user against any specified career goal
async function getSkillGapForGoal(req, res, next) {
  try {
    const result = await analyzeSkillGap(req.user._id, req.params.careerGoalId);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

module.exports = { getMySkillGap, getSkillGapForGoal };