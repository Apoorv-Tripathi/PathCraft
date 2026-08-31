const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
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
      default: null,
    },
    timelineMonths: {
      type: Number,
      default: null,
    },
    currentSkills: [
      {
        skill: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Skill",
        },
        proficiency: {
          type: Number, // 0-100
          min: 0,
          max: 100,
          default: 0,
        },
      },
    ],
    experienceLevel: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    interests: [
      {
        type: String,
        trim: true,
      },
    ],
    availableHoursPerWeek: {
      type: Number,
      default: 5,
    },
    learningPreferences: {
      type: [String], // e.g. ["video", "text", "hands-on", "project-based"]
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", profileSchema);