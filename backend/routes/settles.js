const express = require("express");
const router = express.Router({ mergeParams: true });
const mongoose = require("mongoose");
const Settle = require("../models/Settle");

router.post("/", (req, res, next) => {
  const { paidBy, paidTo, value } = req.body;
  try {
    const newSettle = new Settle({
      owner: req.groupId,
      paidBy,
      paidTo,
      value,
    });
    newSettle.save();
    res.status(201).json({
      message: `new settle with value of ${newSettle.value}`,
      newSettle,
    });
  } catch (error) {
    next(error);
  }
});

router.param("settleId", (req, res, next, settleIdParam) => {
  if (!mongoose.Types.ObjectId.isValid(settleIdParam)) {
    res.status(400).json({ message: "invalid settleId!" });
    return;
  }
  req.settleId = settleIdParam;
  next();
});

router.use("/:settleId", require("./oneSettle"));

module.exports = router;
