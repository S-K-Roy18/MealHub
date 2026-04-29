const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Mess = require('../models/Mess');

const auth = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-__v');
    if (!req.user) return res.status(401).json({ message: 'User not found' });
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const requireMess = async (req, res, next) => {
  if (!req.user.messId) {
    return res.status(403).json({ message: 'You are not part of any mess' });
  }
  req.mess = await Mess.findById(req.user.messId);
  if (!req.mess) return res.status(404).json({ message: 'Mess not found' });
  next();
};

const isAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

const isManager = async (req, res, next) => {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const mess = req.mess || await Mess.findById(req.user.messId);
  if (!mess) return res.status(403).json({ message: 'Not in a mess' });

  const manager = mess.monthlyManagers.find(m => m.month === month && m.year === year);
  if (!manager || manager.managerId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Current month manager access required' });
  }
  next();
};

module.exports = { auth, requireMess, isAdmin, isManager };
