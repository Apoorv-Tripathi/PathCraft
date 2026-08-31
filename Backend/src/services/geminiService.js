const Profile = require("../models/Profile");
const Skill = require("../models/Skill");

/**
 * Phase 11: AI Coach reasoning engine
 * Generates tailored learning advice based on user's active track, gaps, and question.
 */
async function getAICoachReply(userId, userMessage) {
  let contextSnippet = "Backend Engineering track";
  try {
    const profile = await Profile.findOne({ user: userId }).populate("careerGoal", "title");
    if (profile && profile.careerGoal) {
      contextSnippet = `${profile.careerGoal.title} track (Timeline: ${profile.timeline || "4 months"})`;
    }
  } catch (err) {
    // continue
  }

  const lower = userMessage.toLowerCase();

  // If Gemini API Key is provided, use Google GenAI SDK; otherwise smart context-driven rule system
  if (process.env.GEMINI_API_KEY) {
    try {
      const { GoogleGenerativeAI } = require("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `You are the PathCraft AI Learning Coach for a learner in the ${contextSnippet}. 
Provide concise, highly actionable, encouraging advice (under 120 words) for this question:
"${userMessage}"`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      return { reply: text, action: { label: "View Roadmap", to: "/roadmap" } };
    } catch (apiErr) {
      console.warn("Gemini API call fallback:", apiErr.message);
    }
  }

  // Built-in intelligent coach responses
  if (lower.includes("why") || lower.includes("recommend")) {
    return {
      reply: `Your diagnostic evaluation revealed an unaddressed gap in core async execution and Promise handling. Node.js microservices rely on non-blocking event loops — mastering this first prevents unhandled rejection crashes in your middleware pipelines.`,
      action: { label: "View Roadmap", to: "/roadmap" },
    };
  }

  if (lower.includes("skip")) {
    return {
      reply: `I strongly advise against skipping prerequisite milestones. Downstream microservice patterns and API routing build directly upon non-blocking I/O. Addressing this now saves dozens of debugging hours later in production.`,
      action: null,
    };
  }

  if (lower.includes("event loop") || lower.includes("async")) {
    return {
      reply: `The Event Loop coordinates async operations across queues:\n1. Synchronous code executes immediately on the main thread.\n2. Microtasks (Promise callbacks, queueMicrotask) drain completely.\n3. Macrotasks (setTimeout, I/O polling) execute one at a time.\nThis is why Promise.then fires before setTimeout(fn, 0).`,
      action: { label: "Start Async Lab", to: "/roadmap" },
    };
  }

  return {
    reply: `Regarding "${userMessage}": For your ${contextSnippet}, following the prerequisite-sequenced curriculum ensures strong fundamentals before scaling into production systems. What specific concept would you like to explore deeper?`,
    action: { label: "Continue Learning", to: "/roadmap" },
  };
}

module.exports = { getAICoachReply };
