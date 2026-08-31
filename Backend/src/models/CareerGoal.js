const mongoose = require("mongoose");

const careerGoalSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    requiredSkills: [
      {
        skill: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Skill",
          required: true,
        },
        importance: {
          type: Number, // 0 to 1, how critical this skill is for the goal
          min: 0,
          max: 1,
          default: 0.5,
        },
        minProficiency: {
          type: Number, // 0-100, expected mastery level for this goal
          min: 0,
          max: 100,
          default: 60,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("CareerGoal", careerGoalSchema);