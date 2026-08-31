const CareerGoal = require("../models/CareerGoal");

// @route GET /api/career-goals
async function getCareerGoals(req, res, next) {
  try {
    const goals = await CareerGoal.find().populate("requiredSkills.skill", "name category difficulty");
    res.status(200).json({ success: true, count: goals.length, data: goals });
  } catch (err) {
    next(err);
  }
}

// @route GET /api/career-goals/:id
async function getCareerGoalById(req, res, next) {
  try {
    const goal = await CareerGoal.findById(req.params.id).populate(
      "requiredSkills.skill",
      "name category difficulty prerequisites"
    );

    if (!goal) {
      return res.status(404).json({ success: false, message: "Career goal not found" });
    }

    res.status(200).json({ success: true, data: goal });
  } catch (err) {
    next(err);
  }
}

// @route POST /api/career-goals
async function createCareerGoal(req, res, next) {
  try {
    const { title, description, requiredSkills } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: "Career goal title is required" });
    }

    const existing = await CareerGoal.findOne({ title: title.trim() });
    if (existing) {
      return res.status(409).json({ success: false, message: "Career goal with this title already exists" });
    }

    const goal = await CareerGoal.create({ title, description, requiredSkills });

    res.status(201).json({ success: true, data: goal });
  } catch (err) {
    next(err);
  }
}

// @route PUT /api/career-goals/:id
async function updateCareerGoal(req, res, next) {
  try {
    const allowedFields = ["title", "description", "requiredSkills"];
    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }

    const goal = await CareerGoal.findByIdAndUpdate(req.params.id, { $set: updates }, {
      new: true,
      runValidators: true,
    });

    if (!goal) {
      return res.status(404).json({ success: false, message: "Career goal not found" });
    }

    res.status(200).json({ success: true, data: goal });
  } catch (err) {
    next(err);
  }
}

// @route DELETE /api/career-goals/:id
async function deleteCareerGoal(req, res, next) {
  try {
    const goal = await CareerGoal.findByIdAndDelete(req.params.id);
    if (!goal) {
      return res.status(404).json({ success: false, message: "Career goal not found" });
    }
    res.status(200).json({ success: true, message: "Career goal deleted" });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getCareerGoals,
  getCareerGoalById,
  createCareerGoal,
  updateCareerGoal,
  deleteCareerGoal,
};