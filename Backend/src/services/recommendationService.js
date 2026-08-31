const { analyzeSkillGap } = require("./skillGapService");

/**
 * Phase 7: Recommendation Engine
 * Analyzes skill gaps + prerequisites and determines the single highest-priority
 * next actionable module and reasons why.
 */
async function getNextRecommendation(userId, careerGoalId) {
  const { gaps } = await analyzeSkillGap(userId, careerGoalId);

  if (!gaps || gaps.length === 0) {
    return {
      recommendation: null,
      message: "No skill gaps found. You have met all targets for this career goal!",
    };
  }

  // Find the highest priority gap that has its prerequisites met
  let nextSkill = gaps.find((g) => g.gap > 0 && g.prerequisitesMet);

  // If no skill has all prerequisites met, pick the unfulfilled prerequisite with highest importance
  if (!nextSkill) {
    nextSkill = gaps.find((g) => g.gap > 0);
  }

  if (!nextSkill) {
    return {
      recommendation: null,
      message: "All skills are currently meeting target proficiency benchmarks.",
    };
  }

  let whyRecommended = `Priority score ${nextSkill.priorityScore}. You are at ${nextSkill.currentProficiency}% vs required ${nextSkill.requiredProficiency}% for this role.`;
  if (!nextSkill.prerequisitesMet) {
    whyRecommended = `Prerequisites pending. Mastering this unlocks advanced downstream modules in your track.`;
  } else if (nextSkill.gap >= 40) {
    whyRecommended = `Critical gap detected (${nextSkill.gap}% gap). Immediate focus required before advancing.`;
  }

  return {
    skill: nextSkill.skill,
    currentProficiency: nextSkill.currentProficiency,
    requiredProficiency: nextSkill.requiredProficiency,
    gap: nextSkill.gap,
    priorityScore: nextSkill.priorityScore,
    prerequisitesMet: nextSkill.prerequisitesMet,
    whyRecommended,
  };
}

module.exports = { getNextRecommendation };
