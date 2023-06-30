const express = require("express");
const router = express.Router();
const Plot = require("../../models").plot;
const User = require("../../models").user;
const WinningBids = require("../../models").winningbids;
const PaymentDetails = require("../../models").paymentdetails;
const { validateToken } = require("../../utils/auth.middleware");
const { PaymentSuccess } = require("../../utils/mail-helper");

router.post("/", validateToken, async (req, res) => {
  try {
    const { tokenData } = res.locals.auth;
    const userId = tokenData.id;
    const { winningbidId, name, cardDetails, paidAmount } = req.body;
    const winningBid = await WinningBids.findOne({
      where: { id: winningbidId },
      include: [
        {
          model: User,
        },
        {
          model: Plot,
        },
      ],
    });
    if (!winningBid) {
      return res.status(400).json({ message: "Bid not found" });
    }
    await winningBid.update({ isPaid: true });
    const payment = await PaymentDetails.create({
      winningbidId,
      name,
      cardDetails,
      paidAmount,
    });
    const data = `<table><tr>
    <th>Plot name</th>
    <th>Plot description</th>
    <th>Paid amount</th>
    <th>Status</th>
  </tr>
  <tr>
    <td>${winningBid.plot.name}</td>
    <td>${winningBid.plot.description}</td>
    <td>${paidAmount}</td>
    <td>Success </td>
    </tr></table>`;
    PaymentSuccess(winningBid.user.email, data);
    res.status(200).json({ message: "Payment completed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/", validateToken, async (req, res) => {
  try {
    const { tokenData } = res.locals.auth;
    const userId = tokenData.id;
    const bids = await PaymentDetails.findAll({
      include: {
        model: WinningBids,
        where: {
          userId,
        },
        required: true,
        include: {
          model: Plot,
          attributes: ["name"],
        },
      },
    });
    res.status(200).json(bids);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
