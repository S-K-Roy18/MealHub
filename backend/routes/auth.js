const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Mess = require('../models/Mess');

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { username, mobile, gmail } = req.body;
    if (!username || !mobile || !gmail) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const exists = await User.findOne({ $or: [{ mobile }, { gmail: gmail.toLowerCase() }] });
    if (exists) return res.status(400).json({ message: 'Mobile or Gmail already registered' });

    const user = await User.create({ username, mobile, gmail: gmail.toLowerCase() });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.status(201).json({ token, user: { _id: user._id, username: user.username, mobile: user.mobile, gmail: user.gmail, messId: user.messId, isAdmin: user.isAdmin } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { mobile, gmail } = req.body;
    if (!mobile || !gmail) return res.status(400).json({ message: 'Mobile and Gmail are required' });

    const user = await User.findOne({ mobile, gmail: gmail.toLowerCase() });
    if (!user) return res.status(400).json({ message: 'No account found with this mobile and Gmail combination' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    // Get mess info
    let messInfo = null;
    let currentManagerId = null;
    if (user.messId) {
      const mess = await Mess.findById(user.messId);
      if (mess) {
        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();
        const cm = mess.monthlyManagers.find(m => m.month === month && m.year === year);
        currentManagerId = cm?.managerId?.toString() || null;
        messInfo = { _id: mess._id, name: mess.name };
      }
    }

    res.json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        mobile: user.mobile,
        gmail: user.gmail,
        messId: user.messId,
        isAdmin: user.isAdmin,
      },
      mess: messInfo,
      isManager: currentManagerId === user._id.toString(),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/auth/me
router.get('/me', require('../middleware/auth').auth, async (req, res) => {
  try {
    const user = req.user;
    let messInfo = null;
    let currentManagerId = null;
    if (user.messId) {
      const mess = await Mess.findById(user.messId);
      if (mess) {
        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();
        const cm = mess.monthlyManagers.find(m => m.month === month && m.year === year);
        currentManagerId = cm?.managerId?.toString() || null;
        messInfo = { _id: mess._id, name: mess.name };
      }
    }
    res.json({
      user: { _id: user._id, username: user.username, mobile: user.mobile, gmail: user.gmail, messId: user.messId, isAdmin: user.isAdmin },
      mess: messInfo,
      isManager: currentManagerId === user._id.toString(),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/auth/profile
router.put('/profile', require('../middleware/auth').auth, async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) return res.status(400).json({ message: 'Username required' });
    req.user.username = username;
    await req.user.save();
    res.json({ user: req.user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
