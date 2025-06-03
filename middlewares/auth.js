require("dotenv").config();

module.exports = (req, res, next) => {
  const adminKey = req.headers["x-api-key"];

  if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
    return res.status(403).json({ message: "Unauthorized access" });
  }

  next();
};
