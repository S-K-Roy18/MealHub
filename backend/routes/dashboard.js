const router = require('express').Router();
const MoneyEntry = require('../models/MoneyEntry');
const Expense = require('../models/Expense');
const MealEntry = require('../models/MealEntry');
const GasCylinder = require('../models/GasCylinder');
const RiceBag = require('../models/RiceBag');
const { auth, requireMess } = require('../middleware/auth');

const { getPeriodDates } = require('../utils/period');

// GET /api/dashboard?periodId=
router.get('/', auth, requireMess, async (req, res) => {
  try {
    const messId = req.user.messId;
    const { startDate, endDate, selectedPeriod } = await getPeriodDates(req);

    const [moneyEntries, expenses, meals, gas, rice] = await Promise.all([
      MoneyEntry.find({ messId, date: { $gte: startDate, $lte: endDate } }).populate('memberId', 'username'),
      Expense.find({ messId, date: { $gte: startDate, $lte: endDate } }),
      MealEntry.find({ messId, date: { $gte: startDate, $lte: endDate } }).populate('entries.memberId', 'username'),
      GasCylinder.find({ messId, buyingDate: { $gte: startDate, $lte: endDate } }).populate('addedBy', 'username').sort({ buyingDate: -1 }),
      RiceBag.find({ messId, buyingDate: { $gte: startDate, $lte: endDate } }).populate('addedBy', 'username').sort({ buyingDate: -1 }),
    ]);

    const totalCollected = moneyEntries.reduce((s, e) => s + e.amount, 0);
    const paidGasTotal = gas.filter(g => g.isPaid).reduce((s, g) => s + g.price, 0);
    const paidRiceTotal = rice.filter(r => r.isPaid).reduce((s, r) => s + r.price, 0);
    const totalSpent = expenses.reduce((s, e) => s + e.price, 0) + paidGasTotal + paidRiceTotal;

    // Per-member meal totals
    const memberTotals = {};
    let totalMessMeals = 0;
    for (const meal of meals) {
      for (const entry of meal.entries) {
        const id = entry.memberId?._id?.toString() || entry.memberId?.toString();
        if (!id) continue;
        if (!memberTotals[id]) {
          memberTotals[id] = { memberId: entry.memberId, lunch: 0, dinner: 0, extra: 0, total: 0 };
        }
        if (entry.lunch) { memberTotals[id].lunch++; memberTotals[id].total++; totalMessMeals++; }
        if (entry.dinner) { memberTotals[id].dinner++; memberTotals[id].total++; totalMessMeals++; }
        if (entry.extra) {
          memberTotals[id].extra += entry.extra;
          memberTotals[id].total += entry.extra;
          totalMessMeals += entry.extra;
        }
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
      period: selectedPeriod,
      startDate,
      endDate,
      totalCollected,
      totalSpent,
      balance: totalCollected - totalSpent,
      totalMessMeals,
      perMealCost,
      gasCount: gas.length,
      gas,
      riceCount: rice.length,
      rice,
      memberTotals: Object.values(memberTotals),
      moneyByMember,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
