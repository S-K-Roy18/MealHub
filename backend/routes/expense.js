const router = require('express').Router();
const Expense = require('../models/Expense');
const Notification = require('../models/Notification');
const { auth, requireMess, isManager } = require('../middleware/auth');

// POST /api/expense — add expense (manager only)
router.post('/', auth, requireMess, isManager, async (req, res) => {
  try {
    const { date, itemName, price, mealType, notes } = req.body;
    if (!date || !itemName || !price || !mealType) {
      return res.status(400).json({ message: 'date, itemName, price, mealType required' });
    }

    const entryDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    entryDate.setHours(0, 0, 0, 0);
    const isBackdated = entryDate < today;
    const month = entryDate.getMonth() + 1;
    const year = entryDate.getFullYear();

    const expense = await Expense.create({
      messId: req.user.messId,
      date: new Date(date),
      itemName,
      price,
      mealType,
      notes: notes || '',
      month,
      year,
      addedBy: req.user._id,
      isBackdated,
    });

    await Notification.create({
      messId: req.user.messId,
      type: isBackdated ? 'expense_backdated' : 'expense_added',
      message: `Expense added: ${itemName} ₹${price} (${mealType})`,
      isBackdated,
      addedBy: req.user._id,
      refId: expense._id,
    });

    res.status(201).json({ expense });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/expense?month=&year=&search=&date= — list expenses
router.get('/', auth, requireMess, async (req, res) => {
  try {
    const now = new Date();
    const month = parseInt(req.query.month) || now.getMonth() + 1;
    const year = parseInt(req.query.year) || now.getFullYear();

    let query = { messId: req.user.messId, month, year };
    if (req.query.date) {
      const d = new Date(req.query.date);
      const next = new Date(d);
      next.setDate(next.getDate() + 1);
      query.date = { $gte: d, $lt: next };
    }
    if (req.query.search) {
      query.itemName = { $regex: req.query.search, $options: 'i' };
    }

    const expenses = await Expense.find(query).populate('addedBy', 'username').sort({ date: -1 });
    const totalSpent = expenses.reduce((sum, e) => sum + e.price, 0);
    res.json({ expenses, totalSpent });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/expense/:id — edit expense (manager only)
router.put('/:id', auth, requireMess, isManager, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense || expense.messId.toString() !== req.user.messId.toString()) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    const { itemName, price, mealType, notes } = req.body;
    if (itemName) expense.itemName = itemName;
    if (price) expense.price = price;
    if (mealType) expense.mealType = mealType;
    if (notes !== undefined) expense.notes = notes;
    expense.isEdited = true;
    await expense.save();

    await Notification.create({
      messId: req.user.messId,
      type: 'expense_edited',
      message: `Expense edited: ${expense.itemName} ₹${expense.price}`,
      isEdited: true,
      addedBy: req.user._id,
      refId: expense._id,
    });

    res.json({ expense });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
