const router = require('express').Router();
const Notification = require('../models/Notification');
const { auth, requireMess } = require('../middleware/auth');

// GET /api/notifications — list all notifications for the mess
router.get('/', auth, requireMess, async (req, res) => {
  try {
    const notifications = await Notification.find({ messId: req.user.messId })
      .populate('addedBy', 'username')
      .sort({ createdAt: -1 })
      .limit(100);
    res.json({ notifications });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
