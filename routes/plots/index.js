const express = require("express");
const router = express.Router();
const Plot = require("../../models").plot;
const { Op } = require("sequelize");

// Get all plots
router.get("/", async (req, res) => {
  try {
    const plots = await Plot.findAll({
      where: {
        resultDate: {
          [Op.gte]: new Date(),
        },
      },
    });
    res.json(plots);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get a specific plot
router.get("/:id", async (req, res) => {
  try {
    const plot = await Plot.findByPk(req.params.id);
    if (!plot) {
      return res.status(404).json({ message: "Plot not found" });
    }
    res.json(plot);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Create a new plot
router.post("/", async (req, res) => {
  try {
    const { name, description, startingBid, resultDate } = req.body;
    const plot = await Plot.create({
      name,
      description,
      startingBid,
      resultDate,
    });
    res.status(200).json(plot);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update a plot
router.put("/:id", async (req, res) => {
  try {
    const plot = await Plot.findByPk(req.params.id);
    if (!plot) {
      return res.status(404).json({ message: "Plot not found" });
    }
    const { name, description, startingBid, resultDate } = req.body;
    await plot.update({ name, description, startingBid, resultDate });
    res.json(plot);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete a plot
router.delete("/:id", async (req, res) => {
  try {
    const plot = await Plot.findByPk(req.params.id);
    if (!plot) {
      return res.status(404).json({ message: "Plot not found" });
    }
    await plot.destroy();
    res.status(200).json({ message: "Plot deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
