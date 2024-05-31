const jwt = require("jsonwebtoken");
let tokenBlacklist = []; // Consider using Redis or similar for a real app

const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1]; // Extract the token from the Authorization header
  if (!token || tokenBlacklist.includes(token)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    req.user.role = verified.role;
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid token" });
  }
};



module.exports = verifyToken;