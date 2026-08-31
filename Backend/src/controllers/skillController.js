const Skill = require("../models/Skill");

// @route GET /api/skills
async function getSkills(req, res, next) {
  try {
    const skills = await Skill.find()
      .populate("prerequisites", "name category")
      .populate("relatedSkills", "name category");

    res.status(200).json({ success: true, count: skills.length, data: skills });
  } catch (err) {
    next(err);
  }
}

// @route GET /api/skills/:id
async function getSkillById(req, res, next) {
  try {
    const skill = await Skill.findById(req.params.id)
      .populate("prerequisites", "name category")
      .populate("relatedSkills", "name category");

    if (!skill) {
      return res.status(404).json({ success: false, message: "Skill not found" });
    }

    res.status(200).json({ success: true, data: skill });
  } catch (err) {
    next(err);
  }
}

// @route POST /api/skills
async function createSkill(req, res, next) {
  try {
    const { name, category, description, difficulty, prerequisites, relatedSkills } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: "Skill name is required" });
    }

    const existing = await Skill.findOne({ name: name.trim() });
    if (existing) {
      return res.status(409).json({ success: false, message: "Skill with this name already exists" });
    }

    const skill = await Skill.create({
      name,
      category,
      description,
      difficulty,
      prerequisites,
      relatedSkills,
    });

    res.status(201).json({ success: true, data: skill });
  } catch (err) {
    next(err);
  }
}

// @route PUT /api/skills/:id
async function updateSkill(req, res, next) {
  try {
    const allowedFields = ["name", "category", "description", "difficulty", "prerequisites", "relatedSkills"];
    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }

    const skill = await Skill.findByIdAndUpdate(req.params.id, { $set: updates }, {
      new: true,
      runValidators: true,
    });

    if (!skill) {
      return res.status(404).json({ success: false, message: "Skill not found" });
    }

    res.status(200).json({ success: true, data: skill });
  } catch (err) {
    next(err);
  }
}

// @route DELETE /api/skills/:id
async function deleteSkill(req, res, next) {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) {
      return res.status(404).json({ success: false, message: "Skill not found" });
    }
    res.status(200).json({ success: true, message: "Skill deleted" });
  } catch (err) {
    next(err);
  }
}

module.exports = { getSkills, getSkillById, createSkill, updateSkill, deleteSkill };