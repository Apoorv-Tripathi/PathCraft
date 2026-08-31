const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Skill = require("./src/models/Skill");
const CareerGoal = require("./src/models/CareerGoal");
const Assessment = require("./src/models/Assessment");

dotenv.config();

const skillsData = [
  { name: "JavaScript Core", category: "Language", difficulty: "beginner" },
  { name: "Node.js Architecture", category: "Runtime", difficulty: "intermediate" },
  { name: "Async JavaScript & Event Loop", category: "Concurrency", difficulty: "advanced" },
  { name: "REST APIs & Middleware", category: "Web Services", difficulty: "intermediate" },
  { name: "Docker & Containers", category: "DevOps", difficulty: "intermediate" },
  { name: "Authentication & JWT", category: "Security", difficulty: "intermediate" },
];

async function seed() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error("No MONGO_URI provided in .env");
      process.exit(1);
    }

    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(mongoUri);
    console.log("Connected!");

    // Clear existing
    await Skill.deleteMany({});
    await CareerGoal.deleteMany({});
    await Assessment.deleteMany({});

    console.log("Seeding Skills...");
    const createdSkills = await Skill.insertMany(skillsData);

    const jsSkill = createdSkills.find(s => s.name === "JavaScript Core");
    const nodeSkill = createdSkills.find(s => s.name === "Node.js Architecture");
    const asyncSkill = createdSkills.find(s => s.name === "Async JavaScript & Event Loop");
    const restSkill = createdSkills.find(s => s.name === "REST APIs & Middleware");

    // Set prerequisites
    nodeSkill.prerequisites = [jsSkill._id];
    await nodeSkill.save();

    asyncSkill.prerequisites = [jsSkill._id];
    await asyncSkill.save();

    restSkill.prerequisites = [nodeSkill._id, asyncSkill._id];
    await restSkill.save();

    console.log("Seeding Career Goals...");
    await CareerGoal.create({
      title: "Backend Developer",
      description: "Design, build, and deploy high-performance scalable web APIs and backend microservices.",
      requiredSkills: [
        { skill: jsSkill._id, minProficiency: 85, importance: 0.9 },
        { skill: nodeSkill._id, minProficiency: 80, importance: 0.8 },
        { skill: asyncSkill._id, minProficiency: 85, importance: 0.9 },
        { skill: restSkill._id, minProficiency: 80, importance: 0.8 },
      ],
    });

    console.log("Seeding Diagnostic Assessment...");
    await Assessment.create({
      skill: jsSkill._id,
      title: "JavaScript Core & Concurrency Diagnostic",
      description: "Diagnostic exam to evaluate scope, closures, event loop, and REST fundamentals.",
      questions: [
        {
          questionText: "What does typeof null return in JavaScript?",
          options: ['"null"', '"object"', '"undefined"', '"string"'],
          correctOptionIndex: 1,
          difficulty: "medium",
          points: 10,
        },
        {
          questionText: "Which component of Node.js handles asynchronous file I/O operations?",
          options: ["V8 engine on main thread", "Libuv worker thread pool", "Microtask queue", "OS socket polling layer"],
          correctOptionIndex: 1,
          difficulty: "medium",
          points: 10,
        },
        {
          questionText: "What is the console output order of sync code, Promise.then, and setTimeout(fn, 0)?",
          options: ["1, 2, 3, 4", "1, 4, 3, 2", "1, 4, 2, 3", "1, 3, 4, 2"],
          correctOptionIndex: 1,
          difficulty: "hard",
          points: 15,
        },
      ],
    });

    console.log("✅ Seed completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  }
}

seed();
