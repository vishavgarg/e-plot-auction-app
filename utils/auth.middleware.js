const { decodeToken } = require("./auth");
const db = require("../models");

exports.validateToken = async (req, res, next) => {
  try {
    let token = req.header("access-token");
    if (!token) {
      return res.status(401).json({ message: "Access token is empty" });
    }

    const decodeData = decodeToken(token);
    if (!decodeData) {
      return res.status(401).json({ message: "Invalid token" });
    }

    let user = await db.user.findOne({
      where: {
        id: decodeData.id,
      },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    res.locals.auth = {
      success: true,
      message: "Valid token",
      data: user,
      tokenData: decodeData,
      token,
      userId: user.id,
    };

    next();
  } catch (e) {
    res.status(401).json({ message: "Internal server error" });
  }
};
