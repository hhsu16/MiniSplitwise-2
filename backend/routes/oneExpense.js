const express = require('express');
const router = express.Router({ mergeParams: true });
const Expense = require('../models/Expense');

router.delete('/', async (req, res, next) => {
  try {
    await Expense.findByIdAndDelete(req.expenseId);
    res.status(200).json({
      message: `expense deleted sucessfully & removed from group`,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.put('/', async (req, res, next) => {
  try {
    const updatedExpense = await Expense.findByIdAndUpdate(
      req.expenseId,
      req.body,
      {
        new: true,
      }
    );
    res.status(200).json({
      message: `expense with the value of ${updatedExpense.value} updated`,
      updatedExpense,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;