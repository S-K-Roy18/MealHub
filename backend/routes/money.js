const router = require('express').Router();
const MoneyEntry = require('../models/MoneyEntry');
const Notification = require('../models/Notification');
const { auth, requireMess, isManager } = require('../middleware/auth');

// POST /api/money — add money entry (manager only)
router.post('/', auth, requireMess, isManager, async (req, res) => {
  try {
    const { memberId, amount, date, paymentMode } = req.body;
    if (!memberId || !amount || !date) return res.status(400).json({ message: 'memberId, amount, date required' });

    const entryDate = new Date(date);
    const month = entryDate.getMonth() + 1;
    const year = entryDate.getFullYear();

    const entry = await MoneyEntry.create({
      messId: req.user.messId,
      memberId,
      amount,
      date: entryDate,
      month,
      year,
      addedBy: req.user._id,
      paymentMode: paymentMode || 'Cash'
    });

    const populated = await MoneyEntry.findById(entry._id).populate('memberId', 'username');
    await Notification.create({
      messId: req.user.messId,
      type: 'money_added',
      message: `₹${amount} (${paymentMode || 'Cash'}) added for ${populated.memberId.username}`,
      addedBy: req.user._id,
    });

    res.status(201).json({ entry: populated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/money?month=&year= — get money entries
router.get('/', auth, requireMess, async (req, res) => {
  try {
    const now = new Date();
    const month = parseInt(req.query.month) || now.getMonth() + 1;
    const year = parseInt(req.query.year) || now.getFullYear();

    const entries = await MoneyEntry.find({ messId: req.user.messId, month, year })
      .populate('memberId', 'username mobile')
      .sort({ date: 1 });

    const totalCollected = entries.reduce((sum, e) => sum + e.amount, 0);
    res.json({ entries, totalCollected });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/money/:id — delete money entry (manager only)
router.delete('/:id', auth, requireMess, isManager, async (req, res) => {
  try {
    const entry = await MoneyEntry.findOneAndDelete({ _id: req.params.id, messId: req.user.messId })
      .populate('memberId', 'username');
    if (!entry) return res.status(404).json({ message: 'Entry not found' });

    await Notification.create({
      messId: req.user.messId,
      type: 'money_deleted',
      message: `Money entry of ₹${entry.amount} for ${entry.memberId?.username || 'Unknown'} was deleted`,
      addedBy: req.user._id,
    });

    res.json({ message: 'Entry deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
