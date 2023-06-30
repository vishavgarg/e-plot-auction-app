// routes/users.js
const express = require("express");
const router = express.Router();
const User = require("../../models").user;
const {
  hashAsync,
  compareAsync,
  generateUserToken,
} = require("../../utils/auth");
const { AuthMail } = require("../../utils/mail-helper");
const { validateToken } = require("../../utils/auth.middleware");

router.post("/register", async (req, res) => {
  try {
    let { name, email, password: pass } = req.body;
    const existingUser = await User.findOne({
      where: { email },
    });
    if (existingUser) {
      res.status(400).json({ message: "Email already exists" });
    } else {
      const hashedPassword = await hashAsync(pass);
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
      });
      const token = generateUserToken(user);
      AuthMail(user.email, token);
      const { password, ...filteredUser } = user.dataValues;
      res.status(200).json({ ...filteredUser, token });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;
    const user = await User.findOne({
      where: { email },
    });
    if (user) {
      const check = await compareAsync(password, user.password);
      if (check) {
        if (user.isVerified) {
          const token = generateUserToken(user);
          const { password, ...filteredUser } = user.dataValues;
          return res.status(200).json({ ...filteredUser, token });
        } else {
          return res.status(400).json({ message: "Email is not verified" });
        }
      } else {
        return res.status(400).json({ message: "Password is incorrect" });
      }
    } else {
      return res.status(400).json({ message: "Email does not exist" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/verify-email", validateToken, async (req, res) => {
  try {
    const { tokenData } = res.locals.auth;
    const userId = tokenData.id;
    const user = await User.findOne({ where: { id: userId } });
    await user.update({ isVerified: true });
    return res.status(200).json({ message: "Email has been verified" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
