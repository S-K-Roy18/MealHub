const router = require('express').Router();
const MealEntry = require('../models/MealEntry');
const Notification = require('../models/Notification');
const { auth, requireMess, isManager } = require('../middleware/auth');

// POST /api/meal — submit/update meal entry for a date (manager only)
router.post('/', auth, requireMess, isManager, async (req, res) => {
  try {
    const { date, entries } = req.body; // entries: [{memberId, lunch, dinner}]
    if (!date || !entries) return res.status(400).json({ message: 'date and entries required' });

    const entryDate = new Date(date);
    entryDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isBackdated = entryDate < today;
    const month = entryDate.getMonth() + 1;
    const year = entryDate.getFullYear();

    // Upsert meal entry for this date
    const meal = await MealEntry.findOneAndUpdate(
      { messId: req.user.messId, date: entryDate },
      { entries, month, year, addedBy: req.user._id, isBackdated },
      { upsert: true, new: true }
    ).populate('entries.memberId', 'username');

    await Notification.create({
      messId: req.user.messId,
      type: 'meal_added',
      message: `Meal entry submitted for ${entryDate.toDateString()}`,
      isBackdated,
      addedBy: req.user._id,
      refId: meal._id,
    });

    res.status(201).json({ meal });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/meal?month=&year=&date= — get meal entries
router.get('/', auth, requireMess, async (req, res) => {
  try {
    const now = new Date();
    const month = parseInt(req.query.month) || now.getMonth() + 1;
    const year = parseInt(req.query.year) || now.getFullYear();

    let query = { messId: req.user.messId, month, year };
    if (req.query.date) {
      const d = new Date(req.query.date);
      d.setHours(0, 0, 0, 0);
      const next = new Date(d);
      next.setDate(next.getDate() + 1);
      query.date = { $gte: d, $lt: next };
    }

    const meals = await MealEntry.find(query)
      .populate('entries.memberId', 'username')
      .sort({ date: 1 });

    // Calculate per-member totals
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

    res.json({ meals, memberTotals: Object.values(memberTotals), totalMessMeals });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/meal/date/:date — get single date meal entry (for meal entry form)
router.get('/date/:date', auth, requireMess, async (req, res) => {
  try {
    const d = new Date(req.params.date);
    d.setHours(0, 0, 0, 0);
    const next = new Date(d);
    next.setDate(next.getDate() + 1);
    const meal = await MealEntry.findOne({ messId: req.user.messId, date: { $gte: d, $lt: next } })
      .populate('entries.memberId', 'username');
    res.json({ meal });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
