const express = require('express');
const router = express.Router({ mergeParams: true });
const Settle = require('../models/Settle');

router.delete('/', async (req, res, next) => {
  try {
    await Settle.findByIdAndDelete(req.settleId);
    res.status(200).json({
      message: `settle deleted sucessfully & removed from group`,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.put('/', async (req, res, next) => {
  try {
    console.log('settleId:', req.settleId)

    const updatedSettle = await Settle.findByIdAndUpdate(
      req.settleId,
      req.body,
      {
        new: true,
      }
    )
    console.log('update settle:', updatedSettle);
    res.status(200).json({
      message: `Settle with the value of ${updatedSettle.value} updated`,
      updatedSettle,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;