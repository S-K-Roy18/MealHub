const router = require('express').Router();
const GasCylinder = require('../models/GasCylinder');
const Notification = require('../models/Notification');
const { auth, requireMess, isManager } = require('../middleware/auth');

// POST /api/gas — add gas cylinder (manager only)
router.post('/', auth, requireMess, isManager, async (req, res) => {
  try {
    const { date, remark } = req.body;
    const entryDate = date ? new Date(date) : new Date();
    const month = entryDate.getMonth() + 1;
    const year = entryDate.getFullYear();

    const gas = await GasCylinder.create({
      messId: req.user.messId,
      date: entryDate,
      remark: remark || 'paid',
      month,
      year,
      addedBy: req.user._id,
    });

    await Notification.create({
      messId: req.user.messId,
      type: 'gas_added',
      message: `Gas cylinder added on ${entryDate.toDateString()} (${remark || 'paid'})`,
      isBackdated: remark === 'due',
      addedBy: req.user._id,
      refId: gas._id,
    });

    res.status(201).json({ gas });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/gas?month=&year= — list gas cylinders
router.get('/', auth, requireMess, async (req, res) => {
  try {
    const now = new Date();
    const month = parseInt(req.query.month) || now.getMonth() + 1;
    const year = parseInt(req.query.year) || now.getFullYear();

    const cylinders = await GasCylinder.find({ messId: req.user.messId, month, year })
      .populate('addedBy', 'username')
      .sort({ date: -1 });

    res.json({ cylinders, count: cylinders.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
