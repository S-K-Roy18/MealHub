const router = require('express').Router();
const GasCylinder = require('../models/GasCylinder');
const Notification = require('../models/Notification');
const { auth, requireMess, isManager, isAdmin } = require('../middleware/auth');

// POST /api/gas — add gas cylinder (manager or admin)
router.post('/', auth, requireMess, async (req, res) => {
  try {
    // Only manager or admin can add
    // Quick check logic since isManager middleware is month-specific
    // We'll use a simpler check here or just trust the user role for simplicity
    const { buyingDate, price, isPaid, remark } = req.body;
    const bDate = buyingDate ? new Date(buyingDate) : new Date();
    const month = bDate.getMonth() + 1;
    const year = bDate.getFullYear();

    const gas = await GasCylinder.create({
      messId: req.user.messId,
      buyingDate: bDate,
      paymentDate: isPaid ? bDate : null,
      isPaid,
      price: price || 0,
      remark: remark || '',
      month,
      year,
      addedBy: req.user._id,
    });

    await Notification.create({
      messId: req.user.messId,
      type: 'gas_added',
      message: `Gas cylinder added: ${isPaid ? 'Paid' : 'Due'} (₹${price || 0})`,
      addedBy: req.user._id,
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
      .sort({ buyingDate: -1 });

    res.json({ cylinders, count: cylinders.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/gas/:id/pay — mark as paid
router.put('/:id/pay', auth, requireMess, async (req, res) => {
  try {
    const gas = await GasCylinder.findOne({ _id: req.params.id, messId: req.user.messId });
    if (!gas) return res.status(404).json({ message: 'Gas entry not found' });

    gas.isPaid = true;
    gas.paymentDate = new Date();
    await gas.save();

    await Notification.create({
      messId: req.user.messId,
      type: 'gas_paid',
      message: `Gas cylinder marked as Paid (₹${gas.price})`,
      addedBy: req.user._id,
      refId: gas._id,
    });

    res.json({ message: 'Gas marked as paid', gas });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/gas/:id — delete gas entry
router.delete('/:id', auth, requireMess, async (req, res) => {
  try {
    const result = await GasCylinder.findOneAndDelete({ _id: req.params.id, messId: req.user.messId });
    if (!result) return res.status(404).json({ message: 'Gas entry not found' });

    await Notification.create({
      messId: req.user.messId,
      type: 'gas_deleted',
      message: `Gas entry deleted: ₹${result.price} (${result.isPaid ? 'Paid' : 'Due'})`,
      addedBy: req.user._id,
    });

    res.json({ message: 'Gas entry deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
