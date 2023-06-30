const express = require("express");
const router = express.Router();
const Plot = require("../../models").plot;
const WinningBids = require("../../models").winningbids;
const { validateToken } = require("../../utils/auth.middleware");
const { Op } = require("sequelize");

router.get("/list", validateToken, async (req, res) => {
  try {
    const { tokenData } = res.locals.auth;
    const userId = tokenData.id;
    const bids = await WinningBids.findAll({
      where: { userId, isPaid: false },
      include: {
        model: Plot,
        where: {
          resultDate: {
            [Op.lte]: new Date(),
          },
        },
        required: true,
      },
    });
    res.status(200).json(bids);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
