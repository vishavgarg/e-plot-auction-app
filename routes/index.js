const router = require("express").Router();
const userRoutes = require("./users");
const plotRoutes = require("./plots");
const bidRoutes = require("./bids");
const winningBidsRoutes = require("./winningbids");
const paymentRoutes = require("./payment");

router.use("/user", userRoutes);
router.use("/plot", plotRoutes);
router.use("/bid", bidRoutes);
router.use("/winningbids", winningBidsRoutes);
router.use("/payment", paymentRoutes);

module.exports = router;
