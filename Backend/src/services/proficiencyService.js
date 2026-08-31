const Profile = require("../models/Profile");

/**
 * Updates (or inserts) a skill's proficiency inside a learner's profile.
 * Uses a simple weighted blend so one bad/good test doesn't wildly swing mastery:
 * newProficiency = 40% old + 60% new score
 */
async function updateSkillProficiency(userId, skillId, scorePercent) {
  let profile = await Profile.findOne({ user: userId });

  if (!profile) {
    profile = await Profile.create({ user: userId });
  }

  const existingEntry = profile.currentSkills.find(
    (entry) => entry.skill.toString() === skillId.toString()
  );

  const oldProficiency = existingEntry ? existingEntry.proficiency : 0;
  const blendedProficiency = Math.round(oldProficiency * 0.4 + scorePercent * 0.6);

  if (existingEntry) {
    existingEntry.proficiency = blendedProficiency;
  } else {
    profile.currentSkills.push({ skill: skillId, proficiency: blendedProficiency });
  }

  await profile.save();

  return { oldProficiency, newProficiency: blendedProficiency };
}

module.exports = { updateSkillProficiency };