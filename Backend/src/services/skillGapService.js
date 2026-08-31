const CareerGoal = require("../models/CareerGoal");
const Profile = require("../models/Profile");
const Skill = require("../models/Skill");

/**
 * Builds a quick lookup map: skillId -> learner's current proficiency (0 if unassessed)
 */
function buildProficiencyMap(currentSkills) {
  const map = new Map();
  for (const entry of currentSkills) {
    const skillId = entry.skill._id ? entry.skill._id.toString() : entry.skill.toString();
    map.set(skillId, entry.proficiency);
  }
  return map;
}

/**
 * Checks whether all prerequisites for a skill are sufficiently mastered.
 * "Sufficiently mastered" = proficiency >= 60 (adjustable threshold).
 */
function prerequisitesMet(skill, proficiencyMap, prereqThreshold = 60) {
  if (!skill.prerequisites || skill.prerequisites.length === 0) return true;

  return skill.prerequisites.every((prereq) => {
    const prereqId = prereq._id ? prereq._id.toString() : prereq.toString();
    const proficiency = proficiencyMap.get(prereqId) || 0;
    return proficiency >= prereqThreshold;
  });
}

/**
 * Core skill gap analysis.
 * Compares a learner's current proficiency against a career goal's required skills.
 *
 * Returns an array of gap objects, sorted by priority (biggest/most important gaps first):
 * {
 *   skill, currentProficiency, requiredProficiency, gap,
 *   importance, prerequisitesMet, priorityScore
 * }
 */
async function analyzeSkillGap(userId, careerGoalId) {
  const careerGoal = await CareerGoal.findById(careerGoalId).populate({
    path: "requiredSkills.skill",
    populate: { path: "prerequisites", select: "name" },
  });

  if (!careerGoal) {
    const err = new Error("Career goal not found");
    err.statusCode = 404;
    throw err;
  }

  const profile = await Profile.findOne({ user: userId }).populate("currentSkills.skill", "name");

  const currentSkills = profile ? profile.currentSkills : [];
  const proficiencyMap = buildProficiencyMap(currentSkills);

  const gaps = careerGoal.requiredSkills.map((req) => {
    const skill = req.skill;
    const skillId = skill._id.toString();
    const currentProficiency = proficiencyMap.get(skillId) || 0;
    const requiredProficiency = req.minProficiency;
    const gap = Math.max(0, requiredProficiency - currentProficiency);
    const prereqsMet = prerequisitesMet(skill, proficiencyMap);

    // Priority score: bigger gap + higher importance = higher priority.
    // Skills whose prerequisites aren't met yet are deprioritized (learner should do prereqs first)
    // but not zeroed out entirely, so they still show up on the roadmap.
    const prereqMultiplier = prereqsMet ? 1 : 0.5;
    const priorityScore = Math.round(gap * req.importance * prereqMultiplier);

    return {
      skill: {
        id: skill._id,
        name: skill.name,
        category: skill.category,
        difficulty: skill.difficulty,
        prerequisites: skill.prerequisites.map((p) => ({ id: p._id, name: p.name })),
      },
      currentProficiency,
      requiredProficiency,
      gap,
      importance: req.importance,
      prerequisitesMet: prereqsMet,
      priorityScore,
    };
  });

  // Sort by priority score descending — most urgent, most important gaps first
  gaps.sort((a, b) => b.priorityScore - a.priorityScore);

  return {
    careerGoal: { id: careerGoal._id, title: careerGoal.title },
    gaps,
  };
}

module.exports = { analyzeSkillGap, buildProficiencyMap, prerequisitesMet };