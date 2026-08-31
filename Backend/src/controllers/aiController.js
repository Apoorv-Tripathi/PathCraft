const { getAICoachReply } = require("../services/geminiService");

// @route POST /api/ai/coach
// @desc  Phase 11: Ask the AI Learning Coach
async function askCoach(req, res, next) {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: "A message is required." });
    }

    const response = await getAICoachReply(req.user ? req.user._id : null, message);
    res.status(200).json({ success: true, data: response });
  } catch (err) {
    next(err);
  }
}

module.exports = { askCoach };
