const Assessment = require("../models/Assessment");
const AssessmentResult = require("../models/AssessmentResult");
const { updateSkillProficiency } = require("../services/proficiencyService");

// Strip correct-answer info before sending an assessment to be taken
function sanitizeAssessment(assessment) {
  const obj = assessment.toObject ? assessment.toObject() : assessment;
  return {
    ...obj,
    questions: obj.questions.map((q) => ({
      _id: q._id,
      questionText: q.questionText,
      options: q.options,
      difficulty: q.difficulty,
      points: q.points,
    })),
  };
}

// @route GET /api/assessment
async function getAssessments(req, res, next) {
  try {
    const filter = { isActive: true };
    if (req.query.skill) filter.skill = req.query.skill;

    const assessments = await Assessment.find(filter).populate("skill", "name category");
    const sanitized = assessments.map(sanitizeAssessment);

    res.status(200).json({ success: true, count: sanitized.length, data: sanitized });
  } catch (err) {
    next(err);
  }
}

// @route GET /api/assessment/:id
async function getAssessmentById(req, res, next) {
  try {
    const assessment = await Assessment.findById(req.params.id).populate("skill", "name category");

    if (!assessment) {
      return res.status(404).json({ success: false, message: "Assessment not found" });
    }

    res.status(200).json({ success: true, data: sanitizeAssessment(assessment) });
  } catch (err) {
    next(err);
  }
}

// @route POST /api/assessment
// @desc  Create assessment manually (or store Gemini-generated + validated questions)
async function createAssessment(req, res, next) {
  try {
    const { skill, title, description, questions, generatedBy } = req.body;

    if (!skill || !title || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "skill, title and a non-empty questions array are required",
      });
    }

    for (const q of questions) {
      if (
        !q.questionText ||
        !Array.isArray(q.options) ||
        q.options.length < 2 ||
        typeof q.correctOptionIndex !== "number" ||
        q.correctOptionIndex < 0 ||
        q.correctOptionIndex >= q.options.length
      ) {
        return res.status(400).json({
          success: false,
          message: "Each question needs questionText, at least 2 options, and a valid correctOptionIndex",
        });
      }
    }

    const assessment = await Assessment.create({
      skill,
      title,
      description,
      questions,
      generatedBy: generatedBy === "gemini" ? "gemini" : "manual",
    });

    res.status(201).json({ success: true, data: assessment });
  } catch (err) {
    next(err);
  }
}

// @route POST /api/assessment/:id/submit
// @desc  Submit answers, calculate score, update skill proficiency
async function submitAssessment(req, res, next) {
  try {
    const { answers } = req.body; // [{ questionId, selectedOptionIndex }]

    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ success: false, message: "answers array is required" });
    }

    const assessment = await Assessment.findById(req.params.id);
    if (!assessment) {
      return res.status(404).json({ success: false, message: "Assessment not found" });
    }

    let totalPoints = 0;
    let earnedPoints = 0;
    const gradedAnswers = [];

    for (const question of assessment.questions) {
      totalPoints += question.points;

      const submitted = answers.find((a) => a.questionId === question._id.toString());
      const selectedOptionIndex = submitted ? submitted.selectedOptionIndex : -1;
      const isCorrect = selectedOptionIndex === question.correctOptionIndex;
      const pointsEarned = isCorrect ? question.points : 0;

      earnedPoints += pointsEarned;

      gradedAnswers.push({
        question: question._id,
        selectedOptionIndex,
        isCorrect,
        pointsEarned,
      });
    }

    const scorePercent = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;

    const { oldProficiency, newProficiency } = await updateSkillProficiency(
      req.user._id,
      assessment.skill,
      scorePercent
    );

    const result = await AssessmentResult.create({
      user: req.user._id,
      assessment: assessment._id,
      skill: assessment.skill,
      answers: gradedAnswers,
      totalPoints,
      earnedPoints,
      scorePercent,
      proficiencyBefore: oldProficiency,
      proficiencyAfter: newProficiency,
    });

    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

// @route GET /api/assessment/results/me
async function getMyResults(req, res, next) {
  try {
    const results = await AssessmentResult.find({ user: req.user._id })
      .populate("skill", "name category")
      .populate("assessment", "title");

    res.status(200).json({ success: true, count: results.length, data: results });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAssessments,
  getAssessmentById,
  createAssessment,
  submitAssessment,
  getMyResults,
};