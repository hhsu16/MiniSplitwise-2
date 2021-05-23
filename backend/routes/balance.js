const express = require("express");
const router = express.Router({
  mergeParams: true,
});
const mongoose = require("mongoose");
const Expense = require("../models/Expense");
const Settle = require("../models/Settle");
const Group = require("../models/Groups");

router.get("/", async (req, res, next) => {
  try {
    const expensePaid = await Expense.aggregate([
      { $match: { owner: mongoose.Types.ObjectId(req.groupId) } },
      { $group: { _id: "$split.paidBy", expensePaid: { $sum: "$value" } } },
    ]);

    const share = await Expense.aggregate([
      { $match: { owner: mongoose.Types.ObjectId(req.groupId) } },
      { $group: { _id: "$split.dividedBy", total: { $sum: "$value" } } },
      {
        $addFields: {
          valuePerMember: { $divide: ["$total", { $size: "$_id" }] },
        },
      },
      { $project: { total: 0 } },
      { $unwind: "$_id" },
      { $group: { _id: "$_id", share: { $sum: "$valuePerMember" } } },
    ]);

    const settlePaid = await Settle.aggregate([
      { $match: { owner: mongoose.Types.ObjectId(req.groupId) } },
      { $group: { _id: "$paidBy", settlePaid: { $sum: "$value" } } },
    ]);

    const settleReceived = await Settle.aggregate([
      { $match: { owner: mongoose.Types.ObjectId(req.groupId) } },
      { $group: { _id: "$paidTo", settleReceived: { $sum: "$value" } } },
    ]);

    const listOfGroupMembers = await Group.findById(req.groupId).distinct(
      "members"
    );

    const queryResult = listOfGroupMembers.map((member) => {
      const memberRow = { member };

      const findObjFromArrByValue = (arr, objKeyName, valueToFind) => {
        return arr.find((e) => String(e[objKeyName]) === String(valueToFind));
      };

      const expensePaidObj = findObjFromArrByValue(expensePaid, "_id", member);
      if (typeof expensePaidObj === "undefined") {
        memberRow.expensePaid = 0;
      } else {
        memberRow.expensePaid = expensePaidObj.expensePaid;
      }

      const settlePaidObj = findObjFromArrByValue(settlePaid, "_id", member);
      if (typeof settlePaidObj === "undefined") {
        memberRow.settlePaid = 0;
      } else {
        memberRow.settlePaid = settlePaidObj.settlePaid;
      }
      const settleReceivedObj = findObjFromArrByValue(
        settleReceived,
        "_id",
        member
      );
      if (typeof settleReceivedObj === "undefined") {
        memberRow.settleReceived = 0;
      } else {
        memberRow.settleReceived = settleReceivedObj.settleReceived;
      }

      const shareObj = findObjFromArrByValue(share, "_id", member);
      if (typeof shareObj === "undefined") {
        memberRow.share = 0;
      } else {
        memberRow.share = shareObj.share;
      }

      memberRow.balance =
        memberRow.share +
        memberRow.settleReceived -
        (memberRow.expensePaid + memberRow.settlePaid);

      return memberRow;
    });
    res.status(200).json({
      message: `balance evaluated`,
      queryResult,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
