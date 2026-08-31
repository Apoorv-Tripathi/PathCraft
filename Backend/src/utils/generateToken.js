const jwt = require("jsonwebtoken");

function generateToken(userId) {
  const secret = process.env.JWT_SECRET || "pathcraft_hcl_amplified_secret_key_2026";
  return jwt.sign({ id: userId }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}


module.exports = { generateToken };