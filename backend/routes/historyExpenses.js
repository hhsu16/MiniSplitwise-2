const express = require("express");
const router = express.Router({
  mergeParams: true,
});
const mongoose = require("mongoose");
const Expense = require("../models/Expense");
const Group = require("../models/Groups");

router.get("/", async (req, res, next) => {
  try {
    const groupAllExpenses = await Expense.aggregate([
      { $match: { owner: mongoose.Types.ObjectId(req.groupId) } },
    ]);

    console.log("groupAllExpenses:", groupAllExpenses);
    res.status(200).json({
      message: `All expenses found:`,
      groupAllExpenses,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
