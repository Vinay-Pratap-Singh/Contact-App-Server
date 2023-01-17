const jwt = require("jsonwebtoken");

// middleware for autherization
exports.auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    // if there is no token
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token does not exist",
      });
    }

    // decoding the token
    const verifiedToken = jwt.verify(token, process.env.SECRET_KEY);
    if (!verifiedToken) {
      return res.status(400).json({
        success: false,
        message: "Invalid token",
      });
    }

    req.id = verifiedToken.id;
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      message:"Unauthorized! Login again ",
      error,
    });
  }
};
