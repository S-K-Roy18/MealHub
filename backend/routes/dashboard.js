const router = require('express').Router();
const MoneyEntry = require('../models/MoneyEntry');
const Expense = require('../models/Expense');
const MealEntry = require('../models/MealEntry');
const GasCylinder = require('../models/GasCylinder');
const { auth, requireMess } = require('../middleware/auth');

// GET /api/dashboard?month=&year=
router.get('/', auth, requireMess, async (req, res) => {
  try {
    const now = new Date();
    const month = parseInt(req.query.month) || now.getMonth() + 1;
    const year = parseInt(req.query.year) || now.getFullYear();
    const messId = req.user.messId;

    const [moneyEntries, expenses, meals, gas] = await Promise.all([
      MoneyEntry.find({ messId, month, year }).populate('memberId', 'username'),
      Expense.find({ messId, month, year }),
      MealEntry.find({ messId, month, year }).populate('entries.memberId', 'username'),
      GasCylinder.find({ messId, month, year }).populate('addedBy', 'username').sort({ date: -1 }),
    ]);

    const totalCollected = moneyEntries.reduce((s, e) => s + e.amount, 0);
    const totalSpent = expenses.reduce((s, e) => s + e.price, 0);

    // Per-member meal totals
    const memberTotals = {};
    let totalMessMeals = 0;
    for (const meal of meals) {
      for (const entry of meal.entries) {
        const id = entry.memberId?._id?.toString() || entry.memberId?.toString();
        if (!id) continue;
        if (!memberTotals[id]) {
          memberTotals[id] = { memberId: entry.memberId, lunch: 0, dinner: 0, total: 0 };
        }
        if (entry.lunch) { memberTotals[id].lunch++; memberTotals[id].total++; totalMessMeals++; }
        if (entry.dinner) { memberTotals[id].dinner++; memberTotals[id].total++; totalMessMeals++; }
      }
    }

    const perMealCost = totalMessMeals > 0 ? totalSpent / totalMessMeals : 0;

    // Per-member money given
    const moneyByMember = {};
    moneyEntries.forEach(e => {
      const id = e.memberId?._id?.toString() || e.memberId?.toString();
      if (id) moneyByMember[id] = (moneyByMember[id] || 0) + e.amount;
    });

    res.json({
      month, year,
      totalCollected,
      totalSpent,
      balance: totalCollected - totalSpent,
      totalMessMeals,
      perMealCost,
      gasCount: gas.length,
      gas,
      memberTotals: Object.values(memberTotals),
      moneyByMember,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
