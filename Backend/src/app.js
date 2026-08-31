const express = require("express");
const cors = require("cors");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());


app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "API is running" });
});

// Routes (Phases 1 - 11)
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/profile", require("./routes/profileRoutes"));
app.use("/api/skills", require("./routes/skillRoutes"));
app.use("/api/career-goals", require("./routes/careerGoalRoutes"));
app.use("/api/assessment", require("./routes/assessmentRoutes"));
app.use("/api/skill-gap", require("./routes/skillGapRoutes"));
app.use("/api/learning-path", require("./routes/learningPathRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));

app.use(notFound);
app.use(errorHandler);

module.exports = app;