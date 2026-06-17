const router = require('express').Router();
const Expense = require('../models/Expense');
const GasCylinder = require('../models/GasCylinder');
const RiceBag = require('../models/RiceBag');
const Notification = require('../models/Notification');
const { auth, requireMess, isManager } = require('../middleware/auth');
const { getPeriodDates } = require('../utils/period');


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

// POST /api/expense/batch — add multiple expenses
router.post('/batch', auth, requireMess, isManager, async (req, res) => {
  try {
    const { expenses } = req.body;
    if (!expenses || !Array.isArray(expenses)) return res.status(400).json({ message: 'Expenses array required' });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let totalBatchPrice = 0;
    let isAnyBackdated = false;

    for (const exp of expenses) {
      const entryDate = new Date(exp.date);
      entryDate.setHours(0, 0, 0, 0);
      const isBackdated = entryDate < today;
      if (isBackdated) isAnyBackdated = true;

      await Expense.create({
        ...exp,
        messId: req.user.messId,
        month: entryDate.getMonth() + 1,
        year: entryDate.getFullYear(),
        addedBy: req.user._id,
        isBackdated
      });
      totalBatchPrice += Number(exp.price);
    }

    await Notification.create({
      messId: req.user.messId,
      type: isAnyBackdated ? 'expense_backdated' : 'expense_added',
      message: `Batch Added: ${expenses.length} items total ₹${totalBatchPrice.toFixed(2)}`,
      isBackdated: isAnyBackdated,
      addedBy: req.user._id,
    });

    res.status(201).json({ message: 'Batch expenses added successfully', count: expenses.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/expense?periodId=&date=&search= — list expenses
router.get('/', auth, requireMess, async (req, res) => {
  try {
    let startDate, endDate;
    let query = { messId: req.user.messId };
    
    if (req.query.date) {
      const d = new Date(req.query.date);
      const next = new Date(d);
      next.setDate(next.getDate() + 1);
      query.date = { $gte: d, $lt: next };
      startDate = d;
      endDate = next;
    } else {
      const periodDates = await getPeriodDates(req);
      startDate = periodDates.startDate;
      endDate = periodDates.endDate;
      query.date = { $gte: startDate, $lte: endDate };
    }

    if (req.query.search) {
      query.itemName = { $regex: req.query.search, $options: 'i' };
    }

    const expenses = await Expense.find(query).populate('addedBy', 'username').sort({ date: -1 });

    // Include Paid Gas Cylinders
    let gasQuery = { messId: req.user.messId, isPaid: true };
    if (req.query.date) {
      gasQuery.buyingDate = { $gte: startDate, $lt: endDate };
    } else {
      gasQuery.buyingDate = { $gte: startDate, $lte: endDate };
    }
    
    const gasCylinders = await GasCylinder.find(gasQuery).populate('addedBy', 'username');
    
    const gasExpenses = gasCylinders.map(g => ({
      _id: g._id,
      date: g.buyingDate,
      itemName: 'Gas Cylinder 🔥',
      price: g.price,
      mealType: 'other',
      notes: `Bought: ${new Date(g.buyingDate).toLocaleDateString('en-IN')}${g.paymentDate ? `, Paid: ${new Date(g.paymentDate).toLocaleDateString('en-IN')}` : ''}`,
      addedBy: g.addedBy,
      isGas: true
    }));

    // Include Paid Rice Bags
    let riceQuery = { messId: req.user.messId, isPaid: true };
    if (req.query.date) {
      riceQuery.buyingDate = { $gte: startDate, $lt: endDate };
    } else {
      riceQuery.buyingDate = { $gte: startDate, $lte: endDate };
    }
    
    const riceBags = await RiceBag.find(riceQuery).populate('addedBy', 'username');
    
    const riceExpenses = riceBags.map(r => ({
      _id: r._id,
      date: r.buyingDate,
      itemName: `Rice Bag 🌾${r.weight ? ` (${r.weight})` : ''}`,
      price: r.price,
      mealType: 'other',
      notes: `Bought: ${new Date(r.buyingDate).toLocaleDateString('en-IN')}${r.paymentDate ? `, Paid: ${new Date(r.paymentDate).toLocaleDateString('en-IN')}` : ''}${r.remark ? ` [${r.remark}]` : ''}`,
      addedBy: r.addedBy,
      isRice: true
    }));

    const combined = [...expenses, ...gasExpenses, ...riceExpenses].sort((a, b) => new Date(b.date) - new Date(a.date));
    const totalSpent = combined.reduce((sum, e) => sum + e.price, 0);

    res.json({ expenses: combined, totalSpent });
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
