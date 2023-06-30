const express = require("express");
const router = express.Router();
const Bid = require("../../models").bid;
const Plot = require("../../models").plot;
const WinningBids = require("../../models").winningbids;
const { validateToken } = require("../../utils/auth.middleware");
const { Op } = require("sequelize");

router.post("/", validateToken, async (req, res) => {
  try {
    const { tokenData } = res.locals.auth;
    const userId = tokenData.id;
    const { plotId, amount } = req.body;
    const plot = await Plot.findByPk(plotId);
    if (!plot) {
      return res.status(404).json({ message: "Plot not found" });
    }
    if (new Date(plot.resultDate) < new Date()) {
      return res
        .status(404)
        .json({ message: "Bidding already done for this plot" });
    }

    if (amount < plot.startingBid) {
      return res
        .status(404)
        .json({ message: "Please bid larger than the starting bid" });
    }

    const bid = await Bid.create({ userId, plotId, amount });
    const highestBid = await WinningBids.findOne({ where: { plotId } });
    if (highestBid) {
      if (highestBid.bidAmount < amount) {
        await highestBid.update({ userId, bidAmount: amount });
      }
    } else {
      await WinningBids.create({ plotId, userId, bidAmount: amount });
    }
    res.status(200).json({ message: "Bid placed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/:id", validateToken, async (req, res) => {
  try {
    const { amount } = req.body;
    const { id } = req.params;
    const bidObj = await Bid.findByPk(id);
    if (!bidObj) {
      return res.status(404).json({ message: "Bid not found" });
    }
    const plotObj = await Plot.findByPk(bidObj.plotId);

    if (new Date(plotObj.resultDate) < new Date()) {
      return res
        .status(404)
        .json({ message: "Bidding already done for this plot" });
    }
    if (amount < plotObj.startingBid) {
      return res
        .status(404)
        .json({ message: "Please bid larger than the starting bid" });
    }

    const bid = await bidObj.update({ amount });
    res.status(200).json({ message: "Bid updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/details/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const bids = await Bid.findOne({ where: { id }, include: { model: Plot } });
    res.status(200).json(bids);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/user", validateToken, async (req, res) => {
  try {
    const { tokenData } = res.locals.auth;
    const userId = tokenData.id;
    const bids = await Bid.findAll({
      where: { userId },
      include: {
        model: Plot,
        where: {
          resultDate: {
            [Op.gte]: new Date(),
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

router.get("/plots/:id", async (req, res) => {
  try {
    const plotId = req.params.id;

    const bids = await Bid.findAll({ where: { plotId } });
    res.status(200).json(bids);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/:id", validateToken, async (req, res) => {
  try {
    const bidId = req.params.id;
    const bid = await Bid.findByPk(bidId);
    if (!bid) {
      return res.status(404).json({ message: "Bid not found" });
    }
    await bid.destroy();

    res.status(200).json({ message: "Bid deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
