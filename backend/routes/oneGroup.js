const express = require('express');
const router = express.Router({ mergeParams: true });
const Group = require('../models/Groups');
router.get('/', async (req, res, next) => {
  try {
    const foundGroup = await Group.findById(req.groupId)
    res.status(200).json(foundGroup);
  } catch (error) {
    next(error);
  }
});

router.delete('/', async (req, res, next) => {
  try {
    const { groupName } = await Group.findByIdAndDelete(req.groupId);
    res.status(200).json({
      message: `group ${groupName} deleted sucessfully`,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.put('/', async (req, res, next) => {
  try {
    const updatedGroup = await Group.findByIdAndUpdate(req.groupId, req.body, {
      new: true,
    });
    res.status(200).json({
      message: `${updatedGroup.groupName} updated sucessfully`,
      updatedGroup,
    });
  } catch (error) {
    next(error);
  }
});
router.use('/balance', require('./balance'));
router.use('/historySettles', require('./historySettles'))
router.use('/historyExpenses', require('./historyExpenses'))
router.use('/expenses', require('./expenses'));
router.use('/settles', require('./settles'));

module.exports = router;