const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    questionText: {
      type: String,
      required: true,
      trim: true,
    },
    options: {
      type: [String],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length >= 2,
        message: "A question needs at least 2 options",
      },
      required: true,
    },
    correctOptionIndex: {
      type: Number,
      required: true,
      min: 0,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    points: {
      type: Number,
      default: 1,
    },
  },
  { _id: true }
);

const assessmentSchema = new mongoose.Schema(
  {
    skill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    questions: [questionSchema],
    generatedBy: {
      type: String,
      enum: ["manual", "gemini"],
      default: "manual",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Assessment", assessmentSchema);