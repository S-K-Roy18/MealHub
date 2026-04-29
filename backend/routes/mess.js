const router = require('express').Router();
const Mess = require('../models/Mess');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { auth, requireMess, isAdmin } = require('../middleware/auth');

// POST /api/mess/create — create a mess (user becomes admin)
router.post('/create', auth, async (req, res) => {
  try {
    if (req.user.messId) return res.status(400).json({ message: 'You are already in a mess' });
    const { name, members } = req.body; // members: [{username, mobile, gmail}]
    if (!name) return res.status(400).json({ message: 'Mess name required' });

    // Create member users
    const memberIds = [];
    const createdMembers = [];
    if (members && members.length > 0) {
      for (const m of members) {
        if (!m.username || !m.mobile || !m.gmail) continue;
        let memberUser = await User.findOne({ $or: [{ mobile: m.mobile }, { gmail: m.gmail.toLowerCase() }] });
        if (!memberUser) {
          memberUser = await User.create({ username: m.username, mobile: m.mobile, gmail: m.gmail.toLowerCase() });
        }
        memberIds.push(memberUser._id);
        createdMembers.push(memberUser);
      }
    }

    // Set current user as admin
    req.user.isAdmin = true;
    const mess = await Mess.create({
      name,
      adminId: req.user._id,
      members: [req.user._id, ...memberIds],
    });

    // Link all users to mess
    req.user.messId = mess._id;
    await req.user.save();
    for (const m of createdMembers) {
      m.messId = mess._id;
      await m.save();
    }

    res.status(201).json({ mess, members: [req.user, ...createdMembers] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/mess — get current mess info
router.get('/', auth, requireMess, async (req, res) => {
  try {
    const mess = await Mess.findById(req.user.messId).populate('members', 'username mobile gmail isAdmin').populate('monthlyManagers.managerId', 'username');
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const cm = mess.monthlyManagers.find(m => m.month === month && m.year === year);
    res.json({ mess, currentManagerId: cm?.managerId?._id || null });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/mess/add-member — admin adds a member
router.post('/add-member', auth, requireMess, isAdmin, async (req, res) => {
  try {
    const { username, mobile, gmail } = req.body;
    if (!username || !mobile || !gmail) return res.status(400).json({ message: 'All fields required' });

    let memberUser = await User.findOne({ $or: [{ mobile }, { gmail: gmail.toLowerCase() }] });
    if (memberUser && memberUser.messId && memberUser.messId.toString() !== req.mess._id.toString()) {
      return res.status(400).json({ message: 'This user is already in another mess' });
    }
    if (!memberUser) {
      memberUser = await User.create({ username, mobile, gmail: gmail.toLowerCase(), messId: req.mess._id });
    } else {
      memberUser.messId = req.mess._id;
      await memberUser.save();
    }

    if (!req.mess.members.includes(memberUser._id)) {
      req.mess.members.push(memberUser._id);
      await req.mess.save();
    }
    res.json({ member: memberUser, mess: req.mess });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/mess/set-manager — admin sets monthly manager
router.put('/set-manager', auth, requireMess, isAdmin, async (req, res) => {
  try {
    const { memberId, month, year } = req.body;
    if (!memberId || !month || !year) return res.status(400).json({ message: 'memberId, month, year required' });

    const existing = req.mess.monthlyManagers.findIndex(m => m.month === month && m.year === year);
    if (existing >= 0) {
      req.mess.monthlyManagers[existing].managerId = memberId;
    } else {
      req.mess.monthlyManagers.push({ month, year, managerId: memberId });
    }
    await req.mess.save();

    const member = await User.findById(memberId);
    await Notification.create({
      messId: req.mess._id,
      type: 'manager_changed',
      message: `${member.username} set as manager for ${month}/${year}`,
      addedBy: req.user._id,
    });

    res.json({ mess: req.mess });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/mess/manager-history — get all monthly managers with per meal cost
router.get('/manager-history', auth, requireMess, async (req, res) => {
  try {
    const mess = await Mess.findById(req.mess._id).populate('monthlyManagers.managerId', 'username');
    res.json({ managers: mess.monthlyManagers });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
