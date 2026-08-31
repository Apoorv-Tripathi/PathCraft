const mongoose = require("mongoose");

const moduleNodeSchema = new mongoose.Schema(
  {
    skill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: "Core Language",
    },
    description: {
      type: String,
      default: "",
    },
    estimatedHours: {
      type: Number,
      default: 20,
    },
    status: {
      type: String,
      enum: ["completed", "current", "upcoming", "locked", "remedial"],
      default: "upcoming",
    },
    order: {
      type: Number,
      default: 1,
    },
    isRemedial: {
      type: Boolean,
      default: false,
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    quizScore: {
      type: Number,
      default: null,
    },
    completedDate: {
      type: String,
      default: null,
    },
    whyRecommended: {
      type: String,
      default: "",
    },
    topics: [String],
    prerequisites: [String],
  },
  { _id: true }
);

const learningPathSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    careerGoal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CareerGoal",
      required: true,
    },
    modules: [moduleNodeSchema],
    isAdaptive: {
      type: Boolean,
      default: false,
    },
    overallProgress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    readinessScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 50,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LearningPath", learningPathSchema);
