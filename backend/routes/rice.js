const router = require('express').Router();
const RiceBag = require('../models/RiceBag');
const Notification = require('../models/Notification');
const { auth, requireMess } = require('../middleware/auth');

// POST /api/rice — add rice bag
router.post('/', auth, requireMess, async (req, res) => {
  try {
    const { buyingDate, price, isPaid, weight, remark } = req.body;
    const bDate = buyingDate ? new Date(buyingDate) : new Date();
    const month = bDate.getMonth() + 1;
    const year = bDate.getFullYear();

    const rice = await RiceBag.create({
      messId: req.user.messId,
      buyingDate: bDate,
      paymentDate: isPaid ? bDate : null,
      isPaid,
      price: price || 0,
      weight: weight || '',
      remark: remark || '',
      month,
      year,
      addedBy: req.user._id,
    });

    await Notification.create({
      messId: req.user.messId,
      type: 'rice_added',
      message: `Rice bag added: ${isPaid ? 'Paid' : 'Due'} (₹${price || 0}) ${weight ? `[${weight}]` : ''}`,
      addedBy: req.user._id,
    });

    res.status(201).json({ rice });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/rice — list rice bags
router.get('/', auth, requireMess, async (req, res) => {
  try {
    const now = new Date();
    const month = parseInt(req.query.month) || now.getMonth() + 1;
    const year = parseInt(req.query.year) || now.getFullYear();

    const bags = await RiceBag.find({ messId: req.user.messId, month, year })
      .populate('addedBy', 'username')
      .sort({ buyingDate: -1 });

    res.json({ bags, count: bags.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/rice/:id/pay — mark as paid
router.put('/:id/pay', auth, requireMess, async (req, res) => {
  try {
    const rice = await RiceBag.findOne({ _id: req.params.id, messId: req.user.messId });
    if (!rice) return res.status(404).json({ message: 'Rice entry not found' });

    rice.isPaid = true;
    rice.paymentDate = new Date();
    await rice.save();

    await Notification.create({
      messId: req.user.messId,
      type: 'rice_paid',
      message: `Rice bag marked as Paid (₹${rice.price})`,
      addedBy: req.user._id,
      refId: rice._id,
    });

    res.json({ message: 'Rice marked as paid', rice });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/rice/:id — delete rice entry
router.delete('/:id', auth, requireMess, async (req, res) => {
  try {
    const result = await RiceBag.findOneAndDelete({ _id: req.params.id, messId: req.user.messId });
    if (!result) return res.status(404).json({ message: 'Rice entry not found' });

    await Notification.create({
      messId: req.user.messId,
      type: 'rice_deleted',
      message: `Rice entry deleted: ₹${result.price} (${result.isPaid ? 'Paid' : 'Due'})`,
      addedBy: req.user._id,
    });

    res.json({ message: 'Rice entry deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
