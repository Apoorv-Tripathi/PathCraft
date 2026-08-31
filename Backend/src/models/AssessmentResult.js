const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema(
  {
    question: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    selectedOptionIndex: {
      type: Number,
      required: true,
    },
    isCorrect: {
      type: Boolean,
      required: true,
    },
    pointsEarned: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

const assessmentResultSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assessment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assessment",
      required: true,
    },
    skill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill",
      required: true,
    },
    answers: [answerSchema],
    totalPoints: {
      type: Number,
      required: true,
    },
    earnedPoints: {
      type: Number,
      required: true,
    },
    scorePercent: {
      type: Number, // 0-100
      required: true,
    },
    proficiencyBefore: {
      type: Number,
      default: 0,
    },
    proficiencyAfter: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AssessmentResult", assessmentResultSchema);