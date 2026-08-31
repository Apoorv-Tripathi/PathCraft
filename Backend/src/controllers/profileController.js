const Profile = require("../models/Profile");

// @route GET /api/profile
// @desc  Get logged-in user's profile (creates an empty one if none exists)
async function getProfile(req, res, next) {
  try {
    let profile = await Profile.findOne({ user: req.user._id })
      .populate("careerGoal")
      .populate("currentSkills.skill");

    if (!profile) {
      profile = await Profile.create({ user: req.user._id });
    }

    res.status(200).json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
}

// @route PUT /api/profile
// @desc  Update logged-in user's profile
async function updateProfile(req, res, next) {
  try {
    const allowedFields = [
      "careerGoal",
      "timelineMonths",
      "currentSkills",
      "experienceLevel",
      "interests",
      "availableHoursPerWeek",
      "learningPreferences",
    ];

    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    let profile = await Profile.findOne({ user: req.user._id });

    if (!profile) {
      profile = await Profile.create({ user: req.user._id, ...updates });
    } else {
      profile = await Profile.findOneAndUpdate(
        { user: req.user._id },
        { $set: updates },
        { new: true, runValidators: true }
      );
    }

    res.status(200).json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
}

module.exports = { getProfile, updateProfile };