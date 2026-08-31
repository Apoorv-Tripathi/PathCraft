const LearningPath = require("../models/LearningPath");
const CareerGoal = require("../models/CareerGoal");
const Profile = require("../models/Profile");
const Skill = require("../models/Skill");
const { analyzeSkillGap } = require("./skillGapService");

/**
 * Phase 8: Generates or updates a personalized prerequisite-ordered learning roadmap.
 */
async function generateLearningPath(userId, careerGoalId = null, forceAdaptive = false) {
  let profile = await Profile.findOne({ user: userId });
  const targetGoalId = careerGoalId || (profile && profile.careerGoal);

  if (!targetGoalId) {
    const defaultGoal = await CareerGoal.findOne();
    if (!defaultGoal) throw new Error("No Career Goals available in database.");
    careerGoalId = defaultGoal._id;
  } else {
    careerGoalId = targetGoalId;
  }

  const { gaps } = await analyzeSkillGap(userId, careerGoalId);
  const goal = await CareerGoal.findById(careerGoalId);

  // Build modules topologically based on prerequisites
  const modules = [];
  let order = 1;

  for (let i = 0; i < gaps.length; i++) {
    const item = gaps[i];
    const isCompleted = item.currentProficiency >= item.requiredProficiency;
    const isCurrent = !isCompleted && item.prerequisitesMet && order === 1;

    let status = "upcoming";
    if (isCompleted) {
      status = "completed";
    } else if (item.prerequisitesMet && !modules.some((m) => m.status === "current")) {
      status = "current";
    } else if (!item.prerequisitesMet) {
      status = "locked";
    }

    modules.push({
      skill: item.skill.id,
      title: item.skill.name,
      category: item.skill.category || "Core Competency",
      description: `Target proficiency: ${item.requiredProficiency}%. Current calibrated level: ${item.currentProficiency}%.`,
      estimatedHours: Math.max(10, Math.round(item.gap * 0.4)),
      status,
      order: order++,
      isRemedial: false,
      progress: isCompleted ? 100 : status === "current" ? 35 : 0,
      quizScore: isCompleted ? item.currentProficiency : null,
      completedDate: isCompleted ? "Completed" : null,
      whyRecommended: `Required for ${goal.title} track (Importance ${Math.round(item.importance * 100)}%).`,
      topics: [item.skill.name, `${item.skill.difficulty} Patterns`, "Production Verification"],
      prerequisites: item.skill.prerequisites.map((p) => p.name),
    });
  }

  // Phase 10: Adaptive Learning Injection
  // If user has critical gap or adaptive mode is requested
  const hasCriticalGap = gaps.some((g) => g.gap >= 40);
  const shouldBeAdaptive = forceAdaptive || hasCriticalGap;

  if (shouldBeAdaptive) {
    const criticalSkill = gaps.find((g) => g.gap >= 40) || gaps[0];
    if (criticalSkill) {
      const remedialIndex = modules.findIndex((m) => m.skill.toString() === criticalSkill.skill.id.toString());
      const insertAt = remedialIndex >= 0 ? remedialIndex : 0;

      modules.splice(insertAt, 0, {
        skill: criticalSkill.skill.id,
        title: `${criticalSkill.skill.name} Remedial Deep Dive`,
        category: "Diagnostic Remediation",
        description: `Targeted remediation generated automatically due to identified gap (${criticalSkill.gap}% gap).`,
        estimatedHours: 8,
        status: "current",
        order: insertAt + 1,
        isRemedial: true,
        progress: 25,
        whyRecommended: `Auto-injected remedial lab to master prerequisite concepts before unblocking advanced modules.`,
        topics: ["Core Mechanics", "Concurrency Isolation", "Error Handling Labs"],
        prerequisites: [],
      });
    }
  }

  const completedCount = modules.filter((m) => m.status === "completed").length;
  const overallProgress = modules.length > 0 ? Math.round((completedCount / modules.length) * 100) : 0;

  // Calculate career readiness
  let totalReq = 0;
  let totalAchieved = 0;
  gaps.forEach((g) => {
    totalReq += g.requiredProficiency;
    totalAchieved += Math.min(g.currentProficiency, g.requiredProficiency);
  });
  const readinessScore = totalReq > 0 ? Math.round((totalAchieved / totalReq) * 100) : 50;

  let learningPath = await LearningPath.findOne({ user: userId });
  if (!learningPath) {
    learningPath = await LearningPath.create({
      user: userId,
      careerGoal: careerGoalId,
      modules,
      isAdaptive: shouldBeAdaptive,
      overallProgress,
      readinessScore,
    });
  } else {
    learningPath.careerGoal = careerGoalId;
    learningPath.modules = modules;
    learningPath.isAdaptive = shouldBeAdaptive;
    learningPath.overallProgress = overallProgress;
    learningPath.readinessScore = readinessScore;
    await learningPath.save();
  }

  return learningPath;
}

/**
 * Phase 9: Update progress on a specific learning module
 */
async function updateModuleProgress(userId, moduleId, { progress, status, quizScore }) {
  const path = await LearningPath.findOne({ user: userId });
  if (!path) throw new Error("Learning Path not found for user");

  const mod = path.modules.id(moduleId);
  if (!mod) throw new Error("Module not found in learning path");

  if (progress !== undefined) mod.progress = progress;
  if (status !== undefined) mod.status = status;
  if (quizScore !== undefined) mod.quizScore = quizScore;

  if (mod.progress >= 100 || mod.status === "completed") {
    mod.status = "completed";
    mod.completedDate = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  const completedCount = path.modules.filter((m) => m.status === "completed").length;
  path.overallProgress = Math.round((completedCount / path.modules.length) * 100);
  await path.save();

  return path;
}

module.exports = { generateLearningPath, updateModuleProgress };
