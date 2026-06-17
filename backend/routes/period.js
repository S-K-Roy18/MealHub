const router = require('express').Router();
const Period = require('../models/Period');
const Mess = require('../models/Mess');
const { auth, requireMess } = require('../middleware/auth');

// Middleware to check if user is manager or admin of the mess
const isManagerOrAdmin = async (req, res, next) => {
  try {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const mess = req.mess || await Mess.findById(req.user.messId);
    if (!mess) return res.status(403).json({ message: 'Not in a mess' });

    const manager = mess.monthlyManagers.find(m => m.month === month && m.year === year);
    const isCurrentManager = manager && manager.managerId.toString() === req.user._id.toString();
    const isMessAdmin = mess.adminId.toString() === req.user._id.toString();

    if (!isCurrentManager && !isMessAdmin) {
      return res.status(403).json({ message: 'Only current month manager or mess admin can manage periods' });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/period — list all periods for the mess
router.get('/', auth, requireMess, async (req, res) => {
  try {
    const periods = await Period.find({ messId: req.user.messId })
      .populate('managerId', 'username')
      .sort({ startDate: -1 });
    res.json({ periods });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/period — create new period
router.post('/', auth, requireMess, isManagerOrAdmin, async (req, res) => {
  try {
    const { startDate, endDate, isActive } = req.body;
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'startDate and endDate are required' });
    }

    const sDate = new Date(startDate);
    const eDate = new Date(endDate);
    if (sDate > eDate) {
      return res.status(400).json({ message: 'Start date cannot be after End date' });
    }

    // If active is true, deactivate all other periods first
    if (isActive) {
      await Period.updateMany({ messId: req.user.messId }, { isActive: false });
    }

    const period = await Period.create({
      messId: req.user.messId,
      startDate: sDate,
      endDate: eDate,
      managerId: req.user._id,
      isActive: !!isActive,
    });

    const populated = await Period.findById(period._id).populate('managerId', 'username');
    res.status(201).json({ period: populated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/period/:id — update a period
router.put('/:id', auth, requireMess, isManagerOrAdmin, async (req, res) => {
  try {
    const { startDate, endDate, isActive } = req.body;
    const period = await Period.findOne({ _id: req.params.id, messId: req.user.messId });
    if (!period) return res.status(404).json({ message: 'Period not found' });

    if (startDate) period.startDate = new Date(startDate);
    if (endDate) period.endDate = new Date(endDate);
    
    if (period.startDate > period.endDate) {
      return res.status(400).json({ message: 'Start date cannot be after End date' });
    }

    if (isActive !== undefined) {
      if (isActive) {
        await Period.updateMany({ messId: req.user.messId }, { isActive: false });
      }
      period.isActive = !!isActive;
    }

    await period.save();
    const populated = await Period.findById(period._id).populate('managerId', 'username');
    res.json({ period: populated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/period/:id/activate — activate a period
router.put('/:id/activate', auth, requireMess, isManagerOrAdmin, async (req, res) => {
  try {
    const period = await Period.findOne({ _id: req.params.id, messId: req.user.messId });
    if (!period) return res.status(404).json({ message: 'Period not found' });

    // Deactivate all others
    await Period.updateMany({ messId: req.user.messId }, { isActive: false });

    period.isActive = true;
    await period.save();

    const populated = await Period.findById(period._id).populate('managerId', 'username');
    res.json({ period: populated, message: 'Period activated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
